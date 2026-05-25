import { Button, TableColumnsType, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { AlignLeft, BadgeIndianRupee, Calendar, Clock, CloudUpload, CodeXml, Database, FileText, Hash, LayoutGrid, LoaderCircle, ScanSearch, Trash2, UserRound } from "lucide-react";
import { getFormattedAmount } from "../../../../engine/helpers/numberHelper";
import { BankPreviewRow, AppPreviewRow } from "./engine/contracts/types";
import { FC } from "react";
import { StatementParams } from "./engine/constants";
import { PreviewTableHeaderProps } from "./engine/contracts/props";

const { Text } = Typography;

export const BankColumns: TableColumnsType<BankPreviewRow> = [
    {
        key: "date",
        dataIndex: "date",
        width: 130,
        title: <span className="flex items-center gap-1.5 text-gray-600"><Calendar size={14} /> Date</span>,
        render: (value: Date) => (<Text type="secondary">{dayjs(value).format("DD MMM YYYY")}</Text>)
    },
    {
        key: "description",
        dataIndex: "description",
        ellipsis: true,
        title: <span className="flex items-center gap-1.5 text-gray-600"><AlignLeft size={14} /> Description</span>,
        render: (value: string) => <Text style={{ textTransform: "capitalize" }}>{value.toLowerCase()}</Text>,
    },
    {
        key: "amount",
        dataIndex: "amount",
        width: 150,
        align: "right",
        title: <span className="flex items-center justify-end gap-1.5 text-gray-600"><BadgeIndianRupee size={14} /> Amount</span>,
        onCell: (record: BankPreviewRow) => ({ className: record.type === "Credit" ? "bg-green-50/50" : "bg-red-50/50" }),
        render: (value: number, record: BankPreviewRow) => (
            <Text strong className={record.type === "Credit" ? "text-green-600" : "text-red-600"}>
                {record.type === "Credit" ? "+" : "-"}{getFormattedAmount(value)}
            </Text>
        )
    }
];

export const AppColumns: TableColumnsType<AppPreviewRow> = [
    {
        key: "date",
        dataIndex: "date",
        width: 120,
        title: <span className="flex items-center gap-1.5 text-gray-600"><Calendar size={14} /> Date</span>,
        render: (value: Date) => <Text>{dayjs(value).format("DD MMM YYYY")}</Text>
    },
    {
        key: "time",
        dataIndex: "date",
        width: 100,
        title: <span className="flex items-center gap-1.5 text-gray-600"><Clock size={14} /> Time</span>,
        render: (value: Date) => <Text type="secondary">{dayjs(value).format("hh:mm A")}</Text>
    },
    {
        key: "utr",
        dataIndex: "utr",
        width: 400,
        ellipsis: true,
        title: <span className="flex items-center gap-1.5 text-gray-600"><Hash size={14} /> UTR</span>,
        render: (value: string) => <a type="secondary">{value}</a>,
    },
    {
        key: "recipient",
        dataIndex: "recipient",
        ellipsis: true,
        title: <span className="flex items-center gap-1.5 text-gray-600"><UserRound size={14} /> Recipient</span>,
        render: (value: string) => <Text style={{ textTransform: "capitalize" }}>{value.toLowerCase()}</Text>,
    },
    {
        key: "amount",
        dataIndex: "amount",
        width: 120,
        align: "right",
        onCell: (record: AppPreviewRow) => ({ className: record.type === "Credit" ? "bg-green-50/50" : "bg-red-50/50" }),
        title: <span className="flex items-center justify-end gap-1.5 text-gray-600"><BadgeIndianRupee size={14} /> Amount</span>,
        render: (value: number, record: AppPreviewRow) => (
            <Text strong className={record.type === "Credit" ? "text-green-600" : "text-red-600"}>
                {record.type === "Credit" ? "+" : "-"}{getFormattedAmount(value)}
            </Text>
        )
    }
];

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
                    <Tag className="rounded-full px-2.5 inline-flex items-center gap-1.5" color="gold">
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
                        color="primary"
                        variant="outlined"
                        shape="round"
                        icon={isUploading
                            ? <LoaderCircle size={14} strokeWidth={2.5} className="animate-spin" />
                            : <CloudUpload size={14} strokeWidth={2.5} />
                        }
                        disabled={isUploading || isParsing}
                        onClick={uploadRecords}
                    >
                        Upload
                    </Button>
                    <Button
                        size="small"
                        color="danger"
                        variant="outlined"
                        shape="round"
                        icon={<Trash2 size={14} strokeWidth={2.5} />}
                        disabled={isUploading}
                        onClick={clearSelection}
                    >
                        Clear
                    </Button>
                </div>
            </div>
        </div>
    );
};