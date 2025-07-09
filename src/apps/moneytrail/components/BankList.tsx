import { ListX, ListCheck, Calendar } from "lucide-react";
import { useState, useRef, useEffect, FC, createRef } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { BankEntry, TransactionListProps } from "../engine/models/types";
import { WithId } from "../../../engine/models/types";
import { getDateComponent } from "../../../engine/helpers/dateTimeHelper";
import { BankIcon } from "./Common";
import { useAppDispatch } from "../../../store/hooks";
import { setBankItemId } from "../store/reviewModalSlice";
import { BankItem } from "./BankItem";
import { AnimatePresence, motion } from "framer-motion";

const TransactionList: FC<TransactionListProps> = ({ title, subtitle, icon: Icon, gradientColors, isLoading, items }) => {
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

  const itemsToRender = listItems.filter(item => (!item.processed || showProcessed))

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
              (Array.from({ length: 3 }).map((_, index) => <SkeletonItem key={index} />)) :
              itemsToRender.length === 0 ? (
                <div className="text-center py-12 px-6 flex flex-col items-center justify-center h-full">
                  <ListX className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-300">No Transactions</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Your transactions will appear here.</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {
                    itemsToRender.map(item => (
                      <motion.div
                        layout
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: "spring" }}
                        key={item._id}
                        className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 relative overflow-hidden"
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

const SkeletonItem: FC = () => (
  <div className="flex items-center justify-between p-3.5 border-b border-gray-200 dark:border-gray-700">
    <div className="flex items-center gap-4 flex-grow min-w-0">
      <div className="h-10 w-10 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      <div className="flex-grow space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
      </div>
    </div>
    <div className="text-right flex-shrink-0 ml-4 space-y-2">
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
    </div>
  </div>
);

export default TransactionList;