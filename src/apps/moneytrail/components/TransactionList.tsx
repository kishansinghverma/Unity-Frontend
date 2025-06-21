import { Trash2, ArrowDownLeft, ArrowUpRight } from "lucide-react";
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

export const TransactionList: FC<TransactionListProps> = ({ title, subtitle, icon: Icon, gradientColors, initialItems }) => {
  const [items, setItems] = useState<ListItem[]>(initialItems);
  const [openItemId, setOpenItemId] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ListItem | null>(null);
  const [showProcessed, setShowProcessed] = useState(false);

  const gestureStartX = useRef(0);
  const gestureEndX = useRef(0);
  const listContainerRef = useRef<HTMLDivElement>(null);

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
      <div
        ref={listContainerRef}
        className="w-full min-w-0 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col"
      >
        <header className={`bg-gradient-to-r ${gradientColors.from} ${gradientColors.to} p-6 rounded-t-xl`}>
            <div className="flex items-center justify-between">
                {/* Left Side: Title & Icon */}
                <div className="flex items-center justify-start gap-4">
                    <div className="bg-white/20 p-3 rounded-lg">
                        <Icon size={32} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{title}</h1>
                        <p className="text-indigo-100 mt-1 text-sm">{subtitle}</p>
                    </div>
                </div>
                {/* Right Side: Controls */}
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
                    {/* Tooltip on hover */}
                    <div className="absolute top-8 right-0 w-max bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        Show Processed
                    </div>
                </div>
            </div>
        </header>

        <div className="select-none overflow-y-auto">
          <ul>
            {items.map(item => (
              <li key={item.id} className="relative overflow-hidden border-b border-gray-200 last:border-b-0">
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
                  className={`relative z-10 bg-white group flex items-center justify-between p-4 sm:px-6 hover:bg-gray-50 transition-transform duration-300 ease-out cursor-pointer ${openItemId === item.id ? '-translate-x-24' : 'translate-x-0'}`}
                >
                  <div className="flex items-center gap-4 flex-grow min-w-0">
                    <IconWrapper className={item.type === 'credit' ? 'bg-green-100' : 'bg-red-100'}>
                      {item.type === 'credit' ? 
                       <ArrowDownLeft size={20} className="text-green-600"/> : 
                       <ArrowUpRight size={20} className="text-red-600"/>}
                    </IconWrapper>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-semibold text-gray-800 line-clamp-2">{item.title}</h3>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className={`font-semibold ${item.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>{item.amount}</p>
                    <p className="text-sm text-gray-500">{item.date}</p>
                  </div>
                </div>
              </li>
            ))}
             {items.length === 0 && (
                <div className="text-center py-12 px-6">
                   <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                   </svg>
                   <h3 className="mt-2 text-sm font-medium text-gray-900">No Transactions</h3>
                   <p className="mt-1 text-sm text-gray-500">Your transactions will appear here.</p>
                </div>
             )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default TransactionList;