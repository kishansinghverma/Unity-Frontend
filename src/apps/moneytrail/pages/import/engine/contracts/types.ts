import { LucideIcon } from 'lucide-react';
import * as XLSX from 'xlsx';
import { BankRecord, AppRecord } from '../../../review/engine/contracts/models';

export type StatementFileType = "pdf" | "excel" | "html" | "csv";
export type ExcelStatementType = "hdfc" | "sbi" | "paytm";
export type StatementType = "phonepe" | "sbicc" | "icici" | ExcelStatementType;
export type BankPreviewRow = BankRecord & { key: string };
export type AppPreviewRow = AppRecord & { key: string };

export type ExcelWorkbookContext = {
    workbook: XLSX.WorkBook;
    sheet: XLSX.WorkSheet;
};

export type ParsedStatementPreview = {
  fileName: string;
  recordType: "app" | "bank";
  statementType: StatementType;
  records: Array<BankRecord> | Array<AppRecord>;
};

export type UploadResult = {
  insertedCount: number;
  totalCount: number;
};

export type SupportedFormatItem = {
  title: string;
  description: string;
  iconStyle: string;
  icon: LucideIcon
};