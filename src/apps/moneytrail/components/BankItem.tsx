import { ListCheck, Calendar } from "lucide-react"
import { BankIcon } from "./Common"
import dayjs from "dayjs"
import React, { useRef, useState, memo } from "react";
import { WithId } from "../../../engine/models/types";
import { BankEntry } from "../engine/models/types";
import { motion } from "framer-motion";

interface BankItemProps extends WithId<BankEntry> {
    isOpen: boolean;
    onSwipe: (id: string | null) => void;
    onProcess: React.Dispatch<React.SetStateAction<WithId<BankEntry>[]>>
}

export const BankItem = memo(({ isOpen, onSwipe, onProcess, ...item }: BankItemProps) => {
    const gestureStartX = useRef(0);
    const gestureEndX = useRef(0);
    const [isDragging, setIsDragging] = useState(false);

    const handleGestureStart = (clientX: number) => {
        gestureStartX.current = clientX;
        gestureEndX.current = clientX;
    };

    const handleDelete = (id: string) => {
        onSwipe(null);
    };

    const handleGestureMove = (clientX: number) => {
        gestureEndX.current = clientX;
    };

    const handleGestureEnd = () => {
        const swipeDistance = gestureStartX.current - gestureEndX.current;
        const clickThreshold = 10;
        const swipeThreshold = 50;

        if (Math.abs(swipeDistance) < clickThreshold) {
            setIsDragging(false);
            if (isOpen) {
                onSwipe(null);
            } else {
                handleItemClick();
            }
            return;
        }

        setIsDragging(false);

        if (swipeDistance > swipeThreshold) {
            onSwipe(item._id);
        } else if (swipeDistance < -swipeThreshold) {
            if (isOpen) {
                onSwipe(null);
            }
        }
    };

    const handleItemClick = () => {
        if (!isOpen) {
            markProcessed()
            // dispatch(setBankItemId(item._id))
        }
    };

    const markProcessed = () => {
        onProcess(items => items.filter(x => x._id !== item._id));
    }

    return (
        <>
            <div className="absolute top-0 right-0 h-full flex items-center">
                <button
                    className="bg-green-500 text-white h-full w-20 flex items-center justify-center hover:bg-green-600 transition-colors"
                    onClick={() => handleDelete(item._id)}
                    title="Mark Complete"
                >
                    <ListCheck size={28} />
                </button>
            </div>
            <div
                onTouchStart={(e: React.TouchEvent<HTMLDivElement>) => handleGestureStart(e.targetTouches[0].clientX)}
                onTouchMove={(e: React.TouchEvent<HTMLDivElement>) => handleGestureMove(e.targetTouches[0].clientX)}
                onTouchEnd={handleGestureEnd}
                onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => { setIsDragging(true); handleGestureStart(e.clientX); }}
                onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => { if (isDragging) handleGestureMove(e.clientX); }}
                onMouseUp={handleGestureEnd}
                onMouseLeave={() => { if (isDragging) handleGestureEnd(); }}
                className={`relative z-10 bg-white dark:bg-gray-800 group flex items-center justify-between p-3 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-transform duration-300 ease-out cursor-pointer ${isOpen ? '-translate-x-20' : 'translate-x-0'}`}
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
            </div>
        </>
    );
});