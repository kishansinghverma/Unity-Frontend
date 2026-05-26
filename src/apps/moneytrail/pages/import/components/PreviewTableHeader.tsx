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
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600">
                    <Eye size={16} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                    <Text className="text-gray-900 font-semibold leading-tight" style={{ fontSize: 14 }}>Statement Preview</Text>
                    <Text className="text-gray-500 leading-tight" style={{ fontSize: 12 }}>Review parsed transactions</Text>
                </div>
            </div>
            
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                    <Tag className="rounded-md px-2 py-0.5 border-gray-200 bg-gray-50 text-gray-600 inline-flex items-center gap-1.5 shadow-sm m-0">
                        <FileText size={12} strokeWidth={2.5} className="text-gray-400" />
                        <span className="font-medium max-w-[250px] truncate" title={parsedPreview.fileName}>{parsedPreview.fileName}</span>
                    </Tag>
                    <Tag className="rounded-md px-2 py-0.5 border-indigo-100 bg-indigo-50 text-indigo-600 inline-flex items-center gap-1.5 shadow-sm m-0">
                        <Database size={12} strokeWidth={2.5} className="text-indigo-400" />
                        <span className="font-medium">{parsedPreview.records.length} Records</span>
                    </Tag>
                    <Tag className="rounded-md px-2 py-0.5 border-emerald-100 bg-emerald-50 text-emerald-600 inline-flex items-center gap-1.5 shadow-sm m-0">
                        <LayoutGrid size={12} strokeWidth={2.5} className="text-emerald-400" />
                        <span className="font-medium">{StatementParams[parsedPreview.statementType].source}</span>
                    </Tag>
                    <Tag className="rounded-md px-2 py-0.5 border-amber-100 bg-amber-50 text-amber-600 inline-flex items-center gap-1.5 shadow-sm m-0">
                        <CodeXml size={12} strokeWidth={2.5} className="text-amber-400" />
                        <span className="font-medium">{StatementParams[parsedPreview.statementType].fileType}</span>
                    </Tag>
                </div>
                
                <div className="flex items-center gap-2 border-l border-gray-200 pl-8">
                    <Button
                        size="small"
                        type="text"
                        danger
                        icon={<Trash2 size={14} />}
                        disabled={isUploading}
                        onClick={clearSelection}
                        className="hover:bg-red-50"
                    >
                        Clear
                    </Button>
                    <Button
                        size="small"
                        type="primary"
                        className="bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                        icon={isUploading
                            ? <LoaderCircle size={14} className="animate-spin" />
                            : <CloudUpload size={14} />
                        }
                        disabled={isUploading || isParsing}
                        onClick={uploadRecords}
                    >
                        Upload Records
                    </Button>
                </div>
            </div>
        </div>
    );
};
