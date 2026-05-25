import { ParsedStatementPreview } from "./types";

export type PreviewTableHeaderProps = {
    parsedPreview: ParsedStatementPreview;
    isUploading: boolean;
    isParsing: boolean;
    uploadRecords: () => Promise<void>;
    clearSelection: () => void;
}