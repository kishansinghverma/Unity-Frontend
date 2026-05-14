import { Pagination } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { FileSearch } from "lucide-react";
import { useState, useRef, useEffect, useMemo, useCallback, FC, memo } from "react";
import { PostParams, Routes } from "../../../../../../engine/constant";
import { handleResponse, handleError } from "../../../../../../engine/helpers/httpHelper";
import { WithId, Nullable } from "../../../../../../engine/models/types";
import { notify } from "../../../../../../engine/services/notificationService";
import { useAppDispatch } from "../../../../../../store/hooks";
import { SkeletonItem, EmptyList } from "../../../../components/Common";
import { DraftEntry } from "../../../../engine/models/types";
import { reviewApi } from "../../../../store/reviewSlice";
import { ListHeader } from "../layouts/Headers";
import { DraftItem } from "../../../../components/ListItem";

const DraftListFC: FC<{
  items: WithId<DraftEntry>[];
  isLoading: boolean;
  setDraftItem: React.Dispatch<React.SetStateAction<Nullable<WithId<DraftEntry>>>>
}> = ({
  isLoading,
  items,
  setDraftItem
}) => {
    const dispatch = useAppDispatch();
    const [openItemId, setOpenItemId] = useState<string | null>(null);
    const [showProcessed, setShowProcessed] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 15;
    const listContainerRef = useRef<HTMLDivElement>(null);
    const handleClickOutside = useCallback((event: MouseEvent | TouchEvent) => {
      if (openItemId !== null && listContainerRef.current && !listContainerRef.current.contains(event.target as Node)) {
        setOpenItemId(null);
      }
    }, [openItemId]);

    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
      };
    }, [handleClickOutside]);
    const setProcessed = useCallback((id: string) => {
      dispatch(reviewApi.util.updateQueryData('draftEntry', undefined, (data) => {
        data.forEach(entry => { if (entry._id === id) entry.processed = true });
      }));

      fetch(`${Routes.ProcessDraft}/${id}`, PostParams)
        .then(handleResponse)
        .then(() => notify.success({ message: "Success", description: "Transaction Marked as Proccessed!" }))
        .catch(handleError);
    }, [dispatch]);

    const filteredItems = useMemo(
      () => items?.filter((item) => (!item.processed || showProcessed)) ?? [],
      [items, showProcessed],
    );
    const itemsToRender = useMemo(
      () => filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize),
      [filteredItems, currentPage, pageSize],
    );

    return (
      <div ref={listContainerRef} className="w-full h-fit max-h-full bg-white rounded-xl shadow-lg overflow-hidden flex flex-col border">
        <ListHeader {...{
          title: "Draft Logs",
          subtitle: "Metadata for identification",
          Icon: FileSearch,
          className: 'from-orange-500 to-yellow-500',
          showProcessed,
          setShowProcessed
        }} />

        <div className="select-none overflow-y-auto">
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
                        className="border-b border-gray-200 last:border-b-0 relative overflow-hidden origin-left"
                      >
                        <DraftItem
                          item={item}
                          setProcessed={setProcessed}
                          setDraftItem={setDraftItem}
                          isOpen={openItemId === item._id}
                          onOpen={setOpenItemId}
                        />
                      </motion.div>
                    ))
                  }
                </AnimatePresence>
              )
            }
          </ul>
        </div>
        
        {!isLoading && filteredItems.length > 0 && (
          <div className="py-3 px-4 border-t border-gray-200 flex justify-center bg-white">
            <Pagination
              size="small"
              current={currentPage}
              pageSize={pageSize}
              total={filteredItems.length}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
            />
          </div>
        )}
      </div>
    );
  };

export const DraftList = memo(DraftListFC);
