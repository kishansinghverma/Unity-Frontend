import { Unlock } from "lucide-react";
import { FC, memo } from "react";

const PDF_UNLOCK_URL = "https://www.ilovepdf.com/unlock_pdf";
const EXCEL_UNLOCK_URL = "https://products.aspose.app/cells/unlock";

const openExternal = (url: string) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

const HeaderFC: FC = () => (
  <div className="flex items-center gap-1">
    <button
      type="button"
      onClick={() => openExternal(PDF_UNLOCK_URL)}
      className="group flex items-center gap-1.5 rounded-[4px] px-2.5 py-1.5 text-[14px] font-medium text-gray-700 transition-colors duration-150 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-200 focus:outline-none"
    >
      <Unlock size={14} className="text-gray-600 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:rotate-12 group-hover:text-gray-900" />
      Unlock PDF
    </button>
    <div className="h-4 w-px bg-gray-300 mx-1" aria-hidden />
    <button
      type="button"
      onClick={() => openExternal(EXCEL_UNLOCK_URL)}
      className="group flex items-center gap-1.5 rounded-[4px] px-2.5 py-1.5 text-[14px] font-medium text-gray-700 transition-colors duration-150 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-200 focus:outline-none"
    >
      <Unlock size={14} className="text-gray-600 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:rotate-12 group-hover:text-gray-900" />
      Unlock Excel
    </button>
  </div>
);

export const Header = memo(HeaderFC);
