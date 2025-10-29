import dayjs from "dayjs";
import { PlusCircle, CalendarArrowUp, ClockArrowUp } from "lucide-react";
import { ElementType, FC, memo } from "react";
import { UploadStatement } from "../Common";

const HeaderFC: FC<{ setModalVisible: React.Dispatch<React.SetStateAction<boolean>> }> = ({ setModalVisible }) => (
  <div className="flex px-4 py-3 mb-6 justify-between items-center text-sm font-medium text-gray-600 dark:text-gray-300 duration-200 rounded-xl bg-white dark:bg-gray-800 shadow-md dark:shadow-none border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
    <div className="flex gap-2">
      <button onClick={() => setModalVisible(true)} className="flex gap-1 hover:text-gray-900 dark:hover:text-white hover:font-semibold transition-colors duration-200 rounded-md px-2 py-1 flex w-32">
        <PlusCircle size={20} />
        <span>Add Expense</span>
      </button>
      <UploadStatement />
    </div>
    <div className="flex gap-3">
      <div className="flex gap-1">
        <CalendarArrowUp size={20} />
        <div> {dayjs(Date.now()).format('DD-MMM-YYYY')} </div>
      </div>
      <div className="flex gap-1">
        <ClockArrowUp size={20} />
        <div> {dayjs(Date.now()).format('hh:mm A')} </div>
      </div>
    </div>
  </div>
);

const ListHeaderFC: FC<{
  title: string;
  subtitle: string;
  Icon: ElementType;
  className: string;
  showProcessed: boolean;
  setShowProcessed: React.Dispatch<React.SetStateAction<boolean>>
}> = ({
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
          <div className="absolute top-8 right-0 w-max bg-gray-900 text-white dark:bg-gray-200 dark:text-black text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Show Processed
          </div>
        </div>
      </div>
    </header>
  )

export const Header = memo(HeaderFC);
export const ListHeader = memo(ListHeaderFC);