import { Button, Tag, Typography } from "antd";
import { CloudUpload, CodeXml, Database, FileText, LayoutGrid, LoaderCircle, ScanSearch, Trash2 } from "lucide-react";
import { FC } from "react";
import { StatementParams } from "../engine/constants";
import { PreviewTableHeaderProps } from "../engine/contracts/props";

const { Text } = Typography;

export const PreviewTableHeader: FC<PreviewTableHeaderProps> = ({ parsedPreview, isUploading, isParsing, uploadRecords, clearSelection }) => {
    if (!parsedPreview) return null;

    return (
        <div className="flex items-center justify-between p-1">
            <div className="flex items-center gap-2">
                <ScanSearch size={15} strokeWidth={2.5} />
                <Text style={{ fontSize: 15 }} className="text-gray-800 tracking-wide">Statement Preview</Text>
            </div>
            <div className="flex gap-12">
                <div>
                    <Tag className="rounded-full px-2.5 inline-flex items-center gap-1.5" color="orange">
                        <FileText size={12} strokeWidth={2.5} />
                        <span>{parsedPreview.fileName}</span>
                    </Tag>
                    <Tag className="rounded-full px-2.5 inline-flex items-center gap-1.5" color="green">
                        <Database size={12} strokeWidth={2.5} />
                        <span>Records : {parsedPreview.records.length}</span>
                    </Tag>
                    <Tag className="rounded-full px-2.5 inline-flex items-center gap-1.5" color="purple">
                        <LayoutGrid size={12} strokeWidth={2.5} />
                        <span>{StatementParams[parsedPreview.statementType].source}</span>
                    </Tag>
                    <Tag className="rounded-full px-2.5 inline-flex items-center gap-1.5" color="cyan">
                        <CodeXml size={12} strokeWidth={2.5} />
                        <span>{StatementParams[parsedPreview.statementType].fileType}</span>
                    </Tag>
                </div>
                <div className="flex gap-2.5">
                    <Button
                        size="small"
                        color="danger"
                        variant="outlined"
                        icon={<Trash2 size={14} strokeWidth={2.5} />}
                        disabled={isUploading}
                        onClick={clearSelection}
                    >
                        Clear
                    </Button>
                    <Button
                        size="small"
                        color="primary"
                        variant="outlined"
                        icon={isUploading
                            ? <LoaderCircle size={14} strokeWidth={2.5} className="animate-spin" />
                            : <CloudUpload size={14} strokeWidth={2.5} />
                        }
                        disabled={isUploading || isParsing}
                        onClick={uploadRecords}
                    >
                        Upload
                    </Button>
                </div>
            </div>
        </div>
    );
};
