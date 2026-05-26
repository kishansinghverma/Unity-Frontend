import { KeyRound } from "lucide-react";
import { FC, memo } from "react";

const PDF_UNLOCK_URL = "https://www.ilovepdf.com/unlock_pdf";
const EXCEL_UNLOCK_URL = "https://products.aspose.app/cells/unlock";

const openExternal = (url: string) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

const HeaderFC: FC = () => (
  <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
    <button
      type="button"
      onClick={() => openExternal(PDF_UNLOCK_URL)}
      className="flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900"
    >
      <KeyRound size={15} strokeWidth={2.3} />
      Unlock PDF
    </button>
    <div className="h-4 w-px bg-gray-200" aria-hidden />
    <button
      type="button"
      onClick={() => openExternal(EXCEL_UNLOCK_URL)}
      className="flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900"
    >
      <KeyRound size={15} strokeWidth={2.3} />
      Unlock Excel
    </button>
  </div>
);

export const Header = memo(HeaderFC);
