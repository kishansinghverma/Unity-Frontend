import { Trash2, ArrowDownLeft, ArrowUpRight, ListX } from "lucide-react";
import { useState, useRef, useEffect, ElementType, ReactNode, FC } from "react";

export interface ListItem {
  id: number;
  title: string;
  description: string;
  tag: string;
  date: string;
  amount: string;
  type: 'credit' | 'debit';
}

interface IconWrapperProps {
  children: ReactNode;
  className?: string;
}

interface TransactionListProps {
  title: string;
  subtitle: string;
  icon: ElementType;
  gradientColors: {
    from: string;
    to: string;
  };
  initialItems: ListItem[];
}

const IconWrapper: FC<IconWrapperProps> = ({ children, className = '' }) => (
  <div className={`p-3 rounded-full ${className}`}>{children}</div>
);

const SkeletonItem: FC = () => (
    <div className="flex items-center justify-between p-4 sm:px-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4 flex-grow min-w-0">
            <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div className="flex-grow space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
            </div>
        </div>
        <div className="text-right flex-shrink-0 ml-4 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
        </div>
    </div>
);


// --- Reusable Transaction List Component ---

const TransactionList: FC<TransactionListProps> = ({ title, subtitle, icon: Icon, gradientColors, initialItems }) => {
  const [items, setItems] = useState<ListItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [openItemId, setOpenItemId] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ListItem | null>(null);
  const [showProcessed, setShowProcessed] = useState(false);

  const gestureStartX = useRef(0);
  const gestureEndX = useRef(0);
  const listContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
        setItems(initialItems);
        setIsLoading(false);
    }, 1500); // Simulate network delay

    return () => clearTimeout(timer);
  }, [initialItems]);

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

  const handleDelete = (id: number) => {
    setItems(items.filter(item => item.id !== id));
    setOpenItemId(null);
  };
  
  const handleItemClick = (item: ListItem) => {
    if (!openItemId) {
      setSelectedItem(item);
    }
  };

  const handleGestureStart = (clientX: number) => {
    gestureStartX.current = clientX;
    gestureEndX.current = clientX;
  };

  const handleGestureMove = (clientX: number) => {
    gestureEndX.current = clientX;
  };

  const handleGestureEnd = (item: ListItem) => {
    const swipeDistance = gestureStartX.current - gestureEndX.current;
    const clickThreshold = 10;
    const swipeThreshold = 50;
    
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
        setOpenItemId(item.id);
    } else if (swipeDistance < -swipeThreshold) {
        if (openItemId === item.id) {
            setOpenItemId(null);
        }
    }
  };

  return (
    <>
      <div ref={listContainerRef} className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col border dark:border-gray-700 max-h-[85vh]">
        <header className={`bg-gradient-to-r ${gradientColors.from} ${gradientColors.to} p-6 flex-shrink-0`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center justify-start gap-4">
                    <div className="bg-white/20 p-3 rounded-lg">
                        <Icon size={32} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{title}</h1>
                        <p className="text-indigo-100 mt-1 text-sm">{subtitle}</p>
                    </div>
                </div>
                <div className="relative group">
                    <button
                        type="button"
                        onClick={() => setShowProcessed(!showProcessed)}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white ${showProcessed ? 'bg-green-400' : 'bg-white/30'}`}
                        role="switch"
                        aria-checked={showProcessed}
                    >
                        <span
                            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ease-in-out ${showProcessed ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                    </button>
                    <div className="absolute top-8 right-0 w-max bg-gray-900 text-white dark:bg-gray-200 dark:text-black text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        Show Processed
                    </div>
                </div>
            </div>
        </header>

        <div className="select-none flex-grow overflow-y-auto">
          <ul>
            {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => <SkeletonItem key={index} />)
            ) : items.length === 0 ? (
                <div className="text-center py-12 px-6 flex flex-col items-center justify-center h-full">
                   <ListX className="mx-auto h-12 w-12 text-gray-400" />
                   <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-300">No Transactions</h3>
                   <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Your transactions will appear here.</p>
                </div>
             ) : (
              items.map(item => (
              <li key={item.id} className="relative overflow-hidden border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <div className="absolute top-0 right-0 h-full flex items-center">
                    <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 text-white h-full w-24 flex items-center justify-center hover:bg-red-600 transition-colors"
                        aria-label={`Delete ${item.title}`}
                    >
                        <Trash2 size={20} />
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
                  className={`relative z-10 bg-white dark:bg-gray-800 group flex items-center justify-between p-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-transform duration-300 ease-out cursor-pointer ${openItemId === item.id ? '-translate-x-24' : 'translate-x-0'}`}
                >
                  <div className="flex items-center gap-4 flex-grow min-w-0">
                    <IconWrapper className={item.type === 'credit' ? 'bg-green-100 dark:bg-green-500/10' : 'bg-red-100 dark:bg-red-500/10'}>
                      {item.type === 'credit' ? 
                       <ArrowDownLeft size={20} className="text-green-600 dark:text-green-400"/> : 
                       <ArrowUpRight size={20} className="text-red-600 dark:text-red-400"/>}
                    </IconWrapper>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200 line-clamp-2">{item.title}</h3>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className={`font-semibold ${item.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{item.amount}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.date}</p>
                  </div>
                </div>
              </li>
            )))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default TransactionList;