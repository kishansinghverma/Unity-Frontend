import { TableColumnsType, Typography } from "antd";
import dayjs from "dayjs";
import { AlignLeft, BadgeIndianRupee, Calendar, Clock, Hash, UserRound } from "lucide-react";
import { getFormattedAmount } from "../../../../engine/helpers/numberHelper";
import { BankPreviewRow, AppPreviewRow } from "./engine/contracts/types";

const { Text } = Typography;

export const bankColumns: TableColumnsType<BankPreviewRow> = [
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

export const appColumns: TableColumnsType<AppPreviewRow> = [
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
        title: <span className="flex items-center gap-1.5 text-gray-600"><Hash size={14} /> UTR</span>,
        render: (value: string) => <a type="secondary">{value}</a>,
    },
    {
        key: "recipient",
        dataIndex: "recipient",
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