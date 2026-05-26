import dayjs from "dayjs";
import { CalendarArrowUp, ClockArrowUp, PlusCircle } from "lucide-react";
import { FC, memo } from "react";
import { HeaderProps, ListHeaderProps } from "../../engine/contracts/props";

const HeaderComponent: FC<HeaderProps> = ({ setModalVisible }) => (
  <div className="flex w-full items-center text-sm font-medium text-gray-600">
    <div className="flex min-w-0 flex-1 items-center justify-between">
      <button
        onClick={() => setModalVisible(true)}
        className="flex w-32 items-center gap-1 rounded-md px-2 py-1 transition-colors duration-200 hover:font-semibold hover:text-gray-900"
      >
        <PlusCircle size={20} />
        <span>Add Expense</span>
      </button>
      <div className="hidden items-center gap-3 md:flex">
        <div className="flex gap-1">
          <CalendarArrowUp size={20} />
          <div>{dayjs().format("DD-MMM-YYYY")}</div>
        </div>
        <div className="flex gap-1">
          <ClockArrowUp size={20} />
          <div>{dayjs().format("hh:mm A")}</div>
        </div>
      </div>
    </div>
    <div className="ml-4 h-6 w-px bg-gray-200 dark:bg-gray-600" aria-hidden />
  </div>
);

const ListHeaderFC: FC<ListHeaderProps> = ({
  title, subtitle, Icon, className, showProcessed, setShowProcessed
}) => (
  <header className={`px-6 py-4 flex-shrink-0 bg-gradient-to-r ${className}`}>
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
          onClick={() => setShowProcessed(flag => !flag)}
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white ${showProcessed ? 'bg-green-500/90' : 'bg-white/30'}`}
          role="switch"
          aria-checked={showProcessed}
        >
          <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ease-in-out ${showProcessed ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
        <div className="absolute top-8 right-0 w-max bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Show Processed
        </div>
      </div>
    </div>
  </header>
);
export const HeaderFC = memo(HeaderComponent);
export const ListHeader = memo(ListHeaderFC);
