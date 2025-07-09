import { Building2 } from "lucide-react";
import { useState, useRef, useEffect, FC } from "react";
import { BankEntry } from "../engine/models/types";
import { Fetchable, WithId } from "../../../engine/models/types";
import { EmptyList, ListHeader, SkeletonItem } from "./Common";
import { BankItem } from "./BankItem";
import { AnimatePresence, motion } from "framer-motion";

export const BankList: FC<Fetchable<WithId<BankEntry>[]>> = ({ isLoading, contents: items}) => {
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
        <ListHeader {...{
          title: "Bank Entries",
          subtitle: "Aggregated bank transactions",
          Icon: Building2,
          headerBackground: { from: 'from-violet-500', to: 'to-indigo-600' },
          showProcessed,
          setShowProcessed
        }} />

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
                        key={item._id}
                        initial={{ opacity: 0, scale: 0.9, y: 30, x: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -15, x: 20, transition: { duration: 0.2, ease: "easeInOut" } }}
                        transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut", layout: { duration: 0.2 } }}
                        className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 relative overflow-hidden origin-left"
                      >
                        <BankItem
                          item={item}
                          isOpen={openItemId === item._id}
                          onOpen={setOpenItemId}
                          setItems={setItems}
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