
import React, { useState, useEffect, useRef, useCallback, useMemo, Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence, PanInfo, useAnimation, useMotionValue } from 'framer-motion';
import { Mail, CheckCircle, X, Calendar, Settings, Eye, EyeOff, ListCheck } from 'lucide-react';
import dayjs from 'dayjs';
import { BankIcon } from './Common';

interface ListItemData {
    id: string;
    title: string;
    subtitle: string;
    timestamp: string;
    processed: boolean;
    priority: 'high' | 'medium' | 'low';
    category: string;
    description: string;
}

export const ListItem = React.memo<
    {
        item: any;
        openItemId: string | null;
        setOpenItemId: Dispatch<SetStateAction<string | null>>;
        onItemSelect: (item: ListItemData) => void;
        onProcessItem: (id: string) => void;
    }
>(({ item, openItemId, setOpenItemId, onItemSelect, onProcessItem }) => {
    const x = useMotionValue(0);
    const controls = useAnimation();
    const isDragging = useRef(false);

    const isCurrentItemOpen = openItemId === item._id;

    // Effect to close the item if another one is opened
    useEffect(() => {
        if (!isCurrentItemOpen && x.get() !== 0) {
            controls.start({ x: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } });
        }
    }, [isCurrentItemOpen, x, controls]);

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        // A short delay to distinguish between a tap and a drag/pan
        setTimeout(() => { isDragging.current = false; }, 200);

        const offset = info.offset.x;
        const velocity = info.velocity.x;

        // Snap open or closed based on drag distance and velocity
        if (offset < -80 * 0.4 || velocity < -500) {
            controls.start({ x: -80, transition: { type: 'spring', stiffness: 400, damping: 30 } });
            setOpenItemId(item._id);
        } else {
            controls.start({ x: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } });
            if (isCurrentItemOpen) {
                setOpenItemId(null);
            }
        }
    };

    const handleTap = () => {
        if (!isDragging.current && !isCurrentItemOpen) {
            onItemSelect(item);
        } else if (isCurrentItemOpen) {
            // If it's already open, tapping it should close it
            controls.start({ x: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } });
            setOpenItemId(null);
        }
    };

    const handleActionClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent tap event on the parent
        onProcessItem(item._id);
        controls.start({ x: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } });
        setOpenItemId(null);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
            onTap={handleTap}
            className="relative overflow-hidden border-b border-gray-200 dark:border-gray-700 last:border-b-0 cursor-pointer"
        >
            {/* Action Button (behind the main content) */}
            <div className="absolute top-0 right-0 h-full flex items-center">
                <button
                    onClick={handleActionClick}
                    className="bg-green-500 text-white h-full w-20 flex items-center justify-center hover:bg-green-600 transition-colors"
                    title="Mark as Processed"
                >
                    <ListCheck size={24} />
                </button>
            </div>

            {/* Draggable Content - Layout adapted from user example */}
            <motion.div
                drag="x"
                dragConstraints={{ left: -80, right: 0 }}
                dragElastic={0.2}
                onDragStart={() => { isDragging.current = true; }}
                onDragEnd={handleDragEnd}
                style={{ x }}
                animate={controls}
                className="relative z-10 bg-white dark:bg-gray-800 group flex items-center justify-between p-3 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
                <div className="flex items-center flex-shrink-0">
                    <BankIcon bankName={item.bank} />
                </div>
                <div className="flex-grow pr-6 pl-4 min-w-4">
                    <h3 className="font-semibold text-[15px] text-gray-800 dark:text-gray-200 line-clamp-2 break-all">{item.description}</h3>
                </div>
                <div className="text-right min-w-fit">
                    <p className={`font-semibold ${item.type === 'Credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{item.type === 'Credit' ? '+' : '-'} ₹{item.amount}</p>
                    <div className="text-sm flex justify-end font-semibold text-gray-400 dark:text-gray-400">
                        <div className="flex items-center">
                            <div className="mr-1"><Calendar width={16} height={16} strokeWidth={2.5} /></div>
                            <div>{dayjs(item.date).format('DD MMM')}</div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
});