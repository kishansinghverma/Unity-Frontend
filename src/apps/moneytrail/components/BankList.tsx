import { ListX, ListCheck, Calendar } from "lucide-react";
import { useState, useRef, useEffect, FC, createRef } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { BankEntry, TransactionListProps } from "../engine/models/types";
import { WithId } from "../../../engine/models/types";
import { getDateComponent } from "../../../engine/helpers/dateTimeHelper";
import { BankIcon, EmptyList, SkeletonItem } from "./Common";
import { useAppDispatch } from "../../../store/hooks";
import { setBankItemId } from "../store/reviewModalSlice";
import { BankItem } from "./BankItem";
import { AnimatePresence, motion } from "framer-motion";

export const TransactionList: FC<TransactionListProps> = ({ title, subtitle, icon: Icon, gradientColors, isLoading, items }) => {
  const [listItems, setItems] = useState(items);
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const [showProcessed, setShowProcessed] = useState(false);
  const listContainerRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    if (openItemId !== null && listContainerRef.current && !listContainerRef.current.contains(event.target as Node)) {
      setOpenItemId(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [openItemId]);

  useEffect(() => {
    setItems(items);
  }, [items]);

  const itemsToRender = listItems.filter(item => (!item.processed || showProcessed));

  return (
    <>
      <div ref={listContainerRef} className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col border dark:border-gray-700 max-h-[85vh]">
        <header className={`bg-gradient-to-r ${gradientColors.from} ${gradientColors.to} px-6 py-4 flex-shrink-0`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start gap-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Icon size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{title}</h1>
                <p className="text-slate-100 text-sm">{subtitle}</p>
              </div>
            </div>
            <div className="relative group">
              <button
                type="button"
                onClick={() => setShowProcessed(!showProcessed)}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white ${showProcessed ? 'bg-green-500/90' : 'bg-white/30'}`}
                role="switch"
                aria-checked={showProcessed}
              >
                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ease-in-out ${showProcessed ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
              <div className="absolute top-8 right-0 w-max bg-gray-900 text-white dark:bg-gray-200 dark:text-black text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                Show Processed
              </div>
            </div>
          </div>
        </header>

        <div className="select-none flex-grow overflow-y-auto">
          <ul>
            {isLoading ?
              Array.from({ length: 5 }).map((_, index) => <SkeletonItem key={index} />) :
              itemsToRender.length === 0 ? <EmptyList /> : (
                <AnimatePresence mode="popLayout">
                  {
                    itemsToRender.map((item, index) => (
                      <motion.div
                        layout
                        initial={{
                          opacity: 0,
                          scale: 0.9,
                          y: 30,
                          x: -20
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          y: 0,
                          x: 0
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.95,
                          y: -15,
                          x: 20,
                          transition: { duration: 0.2, ease: "easeInOut" }
                        }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.05, // Staggered animation
                          ease: "easeOut",
                          layout: { duration: 0.2 }
                        }}
                        key={item._id}
                        className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 relative overflow-hidden origin-left"
                      >
                        <BankItem
                          {...item}
                          isOpen={openItemId === item._id}
                          onSwipe={setOpenItemId}
                          onProcess={setItems}
                        />
                      </motion.div>
                    ))
                  }
                </AnimatePresence>
              )
            }
          </ul>
        </div>
      </div>
    </>
  );
};