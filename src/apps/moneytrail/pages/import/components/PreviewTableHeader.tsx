import { Button, Tag, Typography } from "antd";
import { CloudUpload, CodeXml, Database, Eye, FileText, Focus, LayoutGrid, LoaderCircle, Table2, Trash2 } from "lucide-react";
import { FC } from "react";
import { StatementParams } from "../engine/constants";
import { PreviewTableHeaderProps } from "../engine/contracts/props";

const { Text } = Typography;

export const PreviewTableHeader: FC<PreviewTableHeaderProps> = ({ parsedPreview, isUploading, isParsing, uploadRecords, clearSelection }) => {
    if (!parsedPreview) return null;

    return (
        <div className="flex items-center justify-between p-1.5">
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600">
                    <Eye size={16} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                    <Text className="text-gray-900 font-semibold leading-tight" style={{ fontSize: 14 }}>Statement Preview</Text>
                    <Text className="text-gray-500 leading-tight" style={{ fontSize: 12 }}>Review parsed transactions</Text>
                </div>
            </div>

            <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                    <Tag className="rounded-md px-2 py-0.5 border-amber-200 bg-amber-50 text-amber-700 inline-flex items-center gap-1.5 shadow-sm m-0">
                        <FileText size={12} strokeWidth={2.5} className="text-amber-600" />
                        <span className="font-medium max-w-[250px] truncate" title={parsedPreview.fileName}>{parsedPreview.fileName}</span>
                    </Tag>
                    <Tag className="rounded-md px-2 py-0.5 border-violet-200 bg-violet-50 text-violet-700 inline-flex items-center gap-1.5 shadow-sm m-0">
                        <Database size={12} strokeWidth={2.5} className="text-violet-600" />
                        <span className="font-medium">{parsedPreview.records.length} Records</span>
                    </Tag>
                    <Tag className="rounded-md px-2 py-0.5 border-emerald-200 bg-emerald-50 text-emerald-700 inline-flex items-center gap-1.5 shadow-sm m-0">
                        <LayoutGrid size={12} strokeWidth={2.5} className="text-emerald-600" />
                        <span className="font-medium">{StatementParams[parsedPreview.statementType].source}</span>
                    </Tag>
                    <Tag className="rounded-md px-2 py-0.5 border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700 inline-flex items-center gap-1.5 shadow-sm m-0">
                        <CodeXml size={12} strokeWidth={2.5} className="text-fuchsia-600" />
                        <span className="font-medium">{StatementParams[parsedPreview.statementType].fileType}</span>
                    </Tag>
                </div>

                <div className="flex items-center ml-4">
                    <div className="inline-flex rounded-lg bg-white">
                        <button
                            type="button"
                            disabled={isUploading || isParsing}
                            onClick={uploadRecords}
                            className="group relative inline-flex items-center gap-2 rounded-l-lg border border-slate-300 bg-blue-50/50 px-4 py-1.5 text-sm font-semibold text-blue-600 transition-all hover:z-10 hover:border-blue-300 hover:bg-blue-100/50 focus:z-10 focus:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
                        >
                            {isUploading ? (
                                <LoaderCircle size={14} strokeWidth={2.5} className="animate-spin text-blue-600" />
                            ) : (
                                <CloudUpload size={14} strokeWidth={2.5} className="transition-transform group-hover:-translate-y-0.5" />
                            )}
                            Upload
                        </button>
                        <button
                            type="button"
                            disabled={isUploading}
                            onClick={clearSelection}
                            className="group relative -ml-px inline-flex items-center gap-2 rounded-r-lg border border-slate-300 bg-rose-50/50 px-3 py-1.5 text-sm font-medium text-rose-600 transition-all hover:z-10 hover:border-rose-300 hover:bg-rose-100/50 focus:z-10 focus:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
                        >
                            <Trash2 size={14} strokeWidth={2.5} className="transition-transform group-hover:scale-110" />
                            <span className="sr-only">Clear</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
