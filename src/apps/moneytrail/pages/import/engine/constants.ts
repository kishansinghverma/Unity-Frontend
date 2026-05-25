import { FileText, Table2, Table as Table1, CodeXml } from "lucide-react";
import { NotificationMessages as TNotificationMessages } from "../../../../../engine/services/notificationService";
import { StatementType, SupportedFormatItem } from "./contracts/types";

export const NotificationMessages: TNotificationMessages = {
    pending: "Uploading Parsed Statement...",
    success: "Uploaded Successfully.",
    error: "Error Occured While Uploading!",
};

export const StatementParams: Record<StatementType, { source: string, fileType: string }> = {
    hdfc: { source: "HDFC Bank", fileType: "Excel" },
    sbi: { source: "SBI Bank", fileType: "Excel" },
    paytm: { source: "Paytm App", fileType: "Excel" },
    phonepe: { source: "PhonePe App", fileType: "PDF" },
    sbicc: { source: "SBI Credit Card", fileType: "HTML" },
    icici: { source: "ICICI Credit Card", fileType: "CSV" },
};

export const SupportedFormats: SupportedFormatItem[][] = [
    [
        {
            title: "PhonePe App Statement",
            description: "Download the PDF statement from PhonePe App.",
            iconStyle: "bg-red-100 text-red-700",
            icon: FileText
        },
        {
            title: "Paytm App Statement",
            description: "Download the Excel statement from Paytm App.",
            iconStyle: "bg-green-100 text-green-700",
            icon: Table2
        },
    ],
    [
        {
            title: "HDFC Bank Statement",
            description: "Download Excel File from App/Netbanking.",
            iconStyle: "bg-green-100 text-green-700",
            icon: Table2
        },
        {
            title: "SBI Bank Statement",
            description: "Download Excel File from App/Netbanking.",
            iconStyle: "bg-green-100 text-green-700",
            icon: Table2
        },
    ],
    [
        {
            title: "SBI Credit Card",
            description: "Get <tbody> from Web App as HTML File using VS Code.",
            iconStyle: "bg-amber-100 text-amber-700",
            icon: CodeXml
        },
        {
            title: "ICICI Credit Card",
            description: "Get Monthly / Yearly Statement as CSV File from WebApp.",
            iconStyle: "bg-blue-100 text-blue-700",
            icon: Table1
        },
    ],
];
