import { StringUtils } from "../../../../../../engine/helpers/stringHelper";
import { ExcelStatementType, StatementFileType, StatementType } from "../contracts/types";
import { getExcelWorkbookContext, getStringAt } from "./common";
import { parseHdfcStatement } from "./hdfc";
import { parsePaytmStatement } from "./paytm";
import { parseSbiStatement } from "./sbi";
import { parseIciciCardStatement } from "./icicicard";
import { parsePhonePeStatement } from "./phonepe";
import { parseSbiCardStatement } from "./sbicard";

const parsers = {
    "hdfc": parseHdfcStatement,
    "icici": parseIciciCardStatement,
    "paytm": parsePaytmStatement,
    "phonepe": parsePhonePeStatement,
    "sbi": parseSbiStatement,
    "sbicc": parseSbiCardStatement
};

const getFileDescriptor = (file: File) => ({
    extension: file.name.split(".").pop()?.toLowerCase() ?? StringUtils.empty,
    mimeType: file.type,
});

const isExcelMimeType = (fileType: string) => (
    fileType === "application/vnd.ms-excel" ||
    fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
);

const identifyExcelStatementType = async (file: File): Promise<ExcelStatementType> => {
    const context = await getExcelWorkbookContext(file);

    if (getStringAt(context.sheet, 'A1')?.includes('HDFC BANK')) return "hdfc";
    if (getStringAt(context.sheet, 'B2')?.includes('State Bank of India')) return "sbi";
    if (getStringAt(context.sheet, 'A9')?.includes('Paytm Statement')) return "paytm";

    throw new Error("Unsupported Excel File Provided!");
}

const getStatementFileType = (file: File): StatementFileType => {
    const { extension, mimeType } = getFileDescriptor(file);

    if (mimeType === "application/pdf" || extension === "pdf") return "pdf";
    if (isExcelMimeType(mimeType) || extension === "xls" || extension === "xlsx") return "excel";
    if (mimeType === "text/html" || extension === "html") return "html";
    if (mimeType === "text/csv" || extension === "csv") return "csv";

    throw new Error("File Type Not Supported!");
};

const identifyStatementType = async (file: File): Promise<StatementType> => {
    const statementFileType = getStatementFileType(file);

    switch (statementFileType) {
        case "excel": return await identifyExcelStatementType(file);
        case "pdf": return "phonepe";
        case "html": return "sbicc";
        case "csv": return "icici";
        default: throw new Error("File Type Not Supported!");
    }
}

export const parseStatement = async (file: File) => {
    const statementType = await identifyStatementType(file);
    const parse = parsers[statementType];
    const records = await parse(file);

    if (records.length === 0) throw new Error("No Record Extracted From Statement!");
    return { records, statementType };
}