import dayjs from "dayjs"
import React, { memo, useEffect, useRef, useState } from "react";
import { Calendar, CircleCheckBigIcon, Clock, Check } from "lucide-react"
import { AlphabetIcon, BankIcon } from "./Common"
import { BankEntry, DraftEntry, PhonePeEntry } from "../engine/models/types";
import { StringUtils } from "../../../engine/helpers/stringHelper";
import { Nullable, WithId } from "../../../engine/models/types";

const ACTION_WIDTH = 80;
const OPEN_THRESHOLD = -50;
const CLICK_EPSILON = 6;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const ProcessedMarker = () => (
    <div className="absolute top-0 left-0 z-30 flex h-4 w-4 items-center justify-center bg-green-600/90 rounded-br-lg shadow-lg">
        <Check className="h-2 w-2 text-white" strokeWidth={5} />
    </div>
);

const SwipeableContent = ({
    id,
    isOpen,
    onOpen,
    onClick,
    children
}: {
    id: string;
    isOpen: boolean;
    onOpen: (id: string | null) => void;
    onClick: () => void;
    children: React.ReactNode;
}) => {
    const pointerStartX = useRef(0);
    const dragStartX = useRef(0);
    const activePointerId = useRef<number | null>(null);
    const wasDragged = useRef(false);
    const offsetRef = useRef(isOpen ? -ACTION_WIDTH : 0);
    const [offsetX, setOffsetX] = useState(isOpen ? -ACTION_WIDTH : 0);
    const [isDragging, setIsDragging] = useState(false);

    const updateOffset = (value: number) => {
        offsetRef.current = value;
        setOffsetX(value);
    };

    useEffect(() => {
        if (!isDragging) updateOffset(isOpen ? -ACTION_WIDTH : 0);
    }, [isDragging, isOpen]);

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        if (event.button !== 0) return;

        activePointerId.current = event.pointerId;
        pointerStartX.current = event.clientX;
        dragStartX.current = offsetRef.current;
        wasDragged.current = false;
        setIsDragging(true);
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        if (activePointerId.current !== event.pointerId) return;

        const deltaX = event.clientX - pointerStartX.current;
        if (Math.abs(deltaX) > CLICK_EPSILON) wasDragged.current = true;

        updateOffset(clamp(dragStartX.current + deltaX, -ACTION_WIDTH, 0));
    };

    const finishDrag = (event: React.PointerEvent<HTMLDivElement>) => {
        if (activePointerId.current !== event.pointerId) return;

        activePointerId.current = null;
        setIsDragging(false);

        if (offsetRef.current < OPEN_THRESHOLD) {
            updateOffset(-ACTION_WIDTH);
            onOpen(id);
        }
        else {
            updateOffset(0);
            onOpen(null);
        }

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    };

    const handleClick = () => {
        if (wasDragged.current) return;
        onClick();
    };

    return (
        <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishDrag}
            onPointerCancel={finishDrag}
            onClick={handleClick}
            style={{ transform: `translate3d(${offsetX}px, 0, 0)` }}
            className={`relative z-10 touch-pan-y bg-white text-sm font-semibold group flex items-center justify-between p-3 sm:px-6 hover:bg-gray-50 cursor-pointer will-change-transform ${isDragging ? '' : 'transition-transform duration-200 ease-out'}`}
        >
            {children}
        </div>
    );
};

export const BankItem = ({ isOpen, onOpen, setProcessed, item, setBankItemId }: {
    item: WithId<BankEntry>;
    isOpen: boolean;
    onOpen: (id: string | null) => void;
    setProcessed: (id: string) => void;
    setBankItemId: React.Dispatch<React.SetStateAction<Nullable<string>>>;
}) => {
    const markProcessed = (id: string) => {
        setProcessed(id);
        onOpen(null);
    };

    return (
        <>
            <div className="absolute top-0 right-0 h-full flex items-center">
                <button
                    disabled={item.processed}
                    title="Mark Complete"
                    onClick={() => markProcessed(item._id)}
                    className={`text-white h-full w-20 flex items-center justify-center transition-colors ${
                        item.processed
                            ? 'bg-gray-400/50 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600 cursor-pointer'
                    }`}
                >
                    <CircleCheckBigIcon />
                </button>
            </div>
            <SwipeableContent
                id={item._id}
                isOpen={isOpen}
                onOpen={onOpen}
                onClick={() => setBankItemId(item._id)}
            >
                {item.processed && <ProcessedMarker />}
                <div className="flex items-center flex-shrink-0"> <BankIcon bankName={item.bank} /></div>
                <div className="flex-grow pr-6 pl-4 min-w-4">
                    <h3 className="text-gray-800 line-clamp-2 break-all capitalize">{item.description}</h3>
                </div>
                <div className="text-right min-w-fit">
                    <p className={`${item.type === 'Credit' ? 'text-green-600' : 'text-red-600'}`}>{item.type === 'Credit' ? '+' : '-'} ₹{item.amount}</p>
                    <div className="flex justify-end text-gray-400">
                        <div className="flex items-center">
                            <div className="mr-1"><Calendar width={16} height={16} strokeWidth={2.5} /></div>
                            <div>{dayjs(item.date).format('DD MMM')}</div>
                        </div>
                    </div>
                </div>
            </SwipeableContent>
        </>
    );
};

export const PhonePeItem = memo(({ isOpen, onOpen, setProcessed, item, setPhonePeItemId }: {
    item: WithId<PhonePeEntry>;
    isOpen: boolean;
    onOpen: (id: string | null) => void;
    setProcessed: (id: string) => void;
    setPhonePeItemId: React.Dispatch<React.SetStateAction<Nullable<string>>>;
}) => {
    const markProcessed = (id: string) => {
        setProcessed(id);
        onOpen(null);
    }

    return (
        <>
            <div className="absolute top-0 right-0 h-full flex items-center">
                <button
                    disabled={item.processed}
                    title="Mark Complete"
                    onClick={() => markProcessed(item._id)}
                    className={`text-white h-full w-20 flex items-center justify-center transition-colors ${
                        item.processed
                            ? 'bg-gray-400/50 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600 cursor-pointer'
                    }`}
                >
                    <CircleCheckBigIcon />
                </button>
            </div>
            <SwipeableContent
                id={item._id}
                isOpen={isOpen}
                onOpen={onOpen}
                onClick={() => setPhonePeItemId(item._id)}
            >
                {item.processed && <ProcessedMarker />}
                <div className="flex items-center flex-shrink-0">
                    <BankIcon bankName={item.bank} />
                </div>
                <div className="flex-grow pl-4 min-w-4">
                    <div className="text-gray-800 line-clamp-1 break-all capitalize">{item.recipient}</div>
                    <div className="flex justify-between">
                        <div className={`flex items-center ${item.type === 'Credit' ? 'text-green-600' : 'text-red-600'}`}>{item.type === 'Credit' ? '+' : '-'} ₹{item.amount}</div>
                        <div className="flex items-center text-gray-400">
                            <div className="mr-1"><Calendar width={16} height={16} strokeWidth={2.5} /></div>
                            <div>{dayjs(item.date).format('DD MMM')}</div>
                            <div className="m-1"><Clock width={16} height={16} strokeWidth={2.5} /></div>
                            <div>{dayjs(item.date).format('hh:mm A')}</div>
                        </div>
                    </div>
                </div>
            </SwipeableContent>
        </>
    );
});

export const DraftItem = memo(({ isOpen, onOpen, setProcessed, item, setDraftItem }: {
    item: WithId<DraftEntry>;
    isOpen: boolean;
    onOpen: (id: string | null) => void;
    setProcessed: (id: string) => void;
    setDraftItem: React.Dispatch<React.SetStateAction<Nullable<WithId<DraftEntry>>>>;
}) => {
    const location = StringUtils.isNullOrEmpty(item.location) ? 'Unidentified Location' : item.location;

    const markProcessed = (id: string) => {
        setProcessed(id);
        onOpen(null);
    }

    return (
        <>
            <div className="absolute top-0 right-0 h-full flex items-center">
                <button
                    disabled={item.processed}
                    title="Mark Complete"
                    onClick={() => markProcessed(item._id)}
                    className={`text-white h-full w-20 flex items-center justify-center transition-colors ${
                        item.processed
                            ? 'bg-gray-400/50 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600 cursor-pointer'
                    }`}
                >
                    <CircleCheckBigIcon />
                </button>
            </div>
            <SwipeableContent
                id={item._id}
                isOpen={isOpen}
                onOpen={onOpen}
                onClick={() => setDraftItem(item)}
            >
                {item.processed && <ProcessedMarker />}
                <a
                    target="_blank"
                    href={`https://www.google.com/maps?q=${item.coordinate}`}
                    onClick={(e) => e.stopPropagation()}
                    className="cursor-default"
                >
                    <AlphabetIcon seed={item._id} firstLetter={location.charAt(0).toUpperCase()} />
                </a>

                <div className="flex-grow pr-6 pl-4 min-w-4">
                    <h3 className="text-gray-800 line-clamp-2 break-all capitalize">{location}</h3>
                </div>
                <div className="text-right min-w-fit">
                    <div className="text-gray-400">
                        <div className="flex items-center">
                            <div className="mr-1"><Calendar width={16} height={16} strokeWidth={2.5} /></div>
                            <div>{dayjs(item.dateTime).format('DD MMM')}</div>
                        </div>
                        <div className="flex items-center">
                            <div className="mr-1"><Clock width={16} height={16} strokeWidth={2.5} /></div>
                            <div>{dayjs(item.dateTime).format('hh:mm A')}</div>
                        </div>
                    </div>
                </div>
            </SwipeableContent>
        </>
    );
});
