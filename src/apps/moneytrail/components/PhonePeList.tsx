import { ListX, ListCheck, Clock } from "lucide-react";
import { useState, useRef, useEffect, FC, createRef } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { PhonepeEntry, PhonepeListProps } from "../commons/types";
import { WithId } from "../../../commons/types";
import { getBankIcon } from "./Common";
import { getDateComponent } from "../../../services/utils";

const PhonepeList: FC<PhonepeListProps> = ({ title, subtitle, icon: Icon, gradientColors, isLoading, items }) => {
  const [listItems, setItems] = useState(items);
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showProcessed, setShowProcessed] = useState(false);

  const gestureStartX = useRef(0);
  const gestureEndX = useRef(0);
  const listContainerRef = useRef<HTMLDivElement>(null);

  const formatDate = (date: string) => {
    return getDateComponent(date).time;
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (openItemId !== null && listContainerRef.current && !listContainerRef.current.contains(event.target as Node)) {
        setOpenItemId(null);
      }
    };
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

  const handleDelete = (id: string) => {
    setItems(items.filter(item => item._id !== id));
    setOpenItemId(null);
  };

  const handleItemClick = (item: WithId<PhonepeEntry>) => {
    if (!openItemId) {
      setSelectedItem(item._id);
    }
  };

  const handleGestureStart = (clientX: number) => {
    gestureStartX.current = clientX;
    gestureEndX.current = clientX;
  };

  const handleGestureMove = (clientX: number) => {
    gestureEndX.current = clientX;
  };

  const handleGestureEnd = (item: WithId<PhonepeEntry>) => {
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
                <TransitionGroup className="todo-list">
                  {
                    itemsToRender.map(item => {
                      const ref = createRef<HTMLLIElement>();
                      return (
                        <CSSTransition
                          key={item._id}
                          nodeRef={ref}
                          timeout={400}
                          classNames="expense-item"
                        >
                          <li ref={ref} key={item._id} className="relative overflow-hidden border-b border-gray-200 dark:border-gray-700 last:border-b-0">
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
                                {getBankIcon(item.bank)}
                              </div>
                              <div className="flex-grow pr-6 pl-4 min-w-4">
                                <h3 className="font-semibold text-[15px] text-gray-800 dark:text-gray-200 line-clamp-2 break-all">{item.recipient}</h3>
                              </div>
                              <div className="text-right min-w-fit">
                                <p className={`font-semibold ${item.type === 'Credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{item.type === 'Credit' ? '+' : '-'} ₹{item.amount}</p>
                                <div className="text-sm flex justify-end font-semibold text-gray-400 dark:text-gray-300">
                                  <div className="flex items-center">
                                    <div className="mr-1"><Clock width={16} height={16} strokeWidth={2.5}/></div>
                                    <div>{formatDate(item.date)}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        </CSSTransition>
                      )
                    })
                  }
                </TransitionGroup>
              )
            }
          </ul>
        </div>
      </div>
      {/* <ReviewModal itemId={selectedItem} bankEntries={items} phonepeEntries={[]} onClose={() => setSelectedItem(null)} /> */}
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

export default PhonepeList;