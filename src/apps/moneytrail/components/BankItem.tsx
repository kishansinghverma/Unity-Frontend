import { Calendar, CircleCheckBigIcon } from "lucide-react"
import { BankIcon } from "./Common"
import dayjs from "dayjs"
import React, { memo, useEffect } from "react";
import { WithId } from "../../../engine/models/types";
import { BankEntry } from "../engine/models/types";
import { motion, PanInfo, useMotionValue, animate } from "framer-motion";
import { useAppDispatch } from "../../../store/hooks";
import { setBankItemId } from "../store/reviewModalSlice";

export const BankItem = memo(({ isOpen, onOpen, setItems, item }: {
    item: WithId<BankEntry>;
    isOpen: boolean;
    onOpen: (id: string | null) => void;
    setItems: React.Dispatch<React.SetStateAction<WithId<BankEntry>[]>>
}) => {
    const dispatch = useAppDispatch();

    const dragThreshold = -50;
    const motionValue = useMotionValue(0);

    useEffect(() => {
        animate(motionValue, isOpen ? -80 : 0, { type: "spring", stiffness: 300, damping: 30, });
    }, [isOpen, motionValue]);

    const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.offset.x < dragThreshold) {
            animate(motionValue, -80, { type: "spring", stiffness: 300, damping: 30, });
            onOpen(item._id);
        } else {
            animate(motionValue, 0, { type: "spring", stiffness: 300, damping: 30, });
            onOpen(null);
        }
    };

    const markProcessed = (id: string) => {
        setItems(items => items.filter(item => item._id !== id));
        onOpen(null);
    }

    const onItemClick = (id: string) => {
        const offset = motionValue.get();
        const epsilon = 2;
        if (Math.abs(offset - 0) > epsilon && Math.abs(offset + 80) > epsilon) return;
        dispatch(setBankItemId(id));
    }

    return (
        <>
            <div className="absolute top-0 right-0 h-full flex items-center">
                <button
                    title="Mark Complete"
                    onClick={() => markProcessed(item._id)}
                    className="bg-green-500 text-white h-full w-20 flex items-center justify-center hover:bg-green-600 transition-colors"
                >
                    <CircleCheckBigIcon />
                </button>
            </div>
            <motion.div
                drag="x"
                style={{ x: motionValue }}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                onClick={()=>onItemClick(item._id)}
                className="relative z-10 bg-white dark:bg-gray-800 group flex items-center justify-between p-3 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
            >
                <div className="flex items-center flex-shrink-0"> <BankIcon bankName={item.bank} /></div>
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
        </>
    );
});
