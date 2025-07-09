import { ListCheck, Calendar } from "lucide-react"
import { BankIcon } from "./Common"
import dayjs from "dayjs"
import { useRef, useEffect, useState } from "react";
import { WithId } from "../../../engine/models/types";
import { BankEntry } from "../engine/models/types";

export const BankItem = ({ openItemId, setOpenItemId, ...item }: any) => {

    const gestureStartX = useRef(0);
    const gestureEndX = useRef(0);
    const [isDragging, setIsDragging] = useState(false);
    const listContainerRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
        if (openItemId !== null && listContainerRef.current && !listContainerRef.current.contains(event.target as Node)) {
            setOpenItemId(null);
        }
    };

    const handleGestureStart = (clientX: number) => {
        gestureStartX.current = clientX;
        gestureEndX.current = clientX;
    };

    const handleDelete = (id: string) => {
        //setItems(items.filter(item => item._id !== id));
        setOpenItemId(null);
    };

    const handleGestureMove = (clientX: number) => {
        gestureEndX.current = clientX;
    };

    const handleGestureEnd = (item: WithId<BankEntry>) => {
        const swipeDistance = gestureStartX.current - gestureEndX.current;
        const clickThreshold = 10;
        const swipeThreshold = 20;

        if (Math.abs(swipeDistance) < clickThreshold) {
            setIsDragging(false);
            if (openItemId) {
                setOpenItemId(null);
            } else {
                handleItemClick(item);
            }
            return;
        }

        setIsDragging(false);

        if (swipeDistance > swipeThreshold) {
            setOpenItemId(item._id);
        } else if (swipeDistance < -swipeThreshold) {
            if (openItemId === item._id) {
                setOpenItemId(null);
            }
        }
    };

    const handleItemClick = (item: WithId<BankEntry>) => {
        if (!openItemId) {
            //dispatch(setBankItemId(item._id))
        }
    };

    return (
        <div className="relative overflow-hidden border-b border-gray-200 dark:border-gray-700 last:border-b-0">
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
                onTouchEnd={() => handleGestureEnd(item)}
                onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => { setIsDragging(true); handleGestureStart(e.clientX); }}
                onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => { if (isDragging) handleGestureMove(e.clientX); }}
                onMouseUp={() => handleGestureEnd(item)}
                onMouseLeave={() => { if (isDragging) handleGestureEnd(item); }}
                className={`relative z-10 bg-white dark:bg-gray-800 group flex items-center justify-between p-3 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-transform duration-300 ease-out cursor-pointer ${openItemId === item._id ? '-translate-x-20' : 'translate-x-0'}`}
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
        </div>
    )
}