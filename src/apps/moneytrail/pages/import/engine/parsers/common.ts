import * as XLSX from 'xlsx';
import * as pdfjsLib from "pdfjs-dist";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { StringUtils } from '../../../../../../engine/helpers/stringHelper';
import { ExcelWorkbookContext } from '../contracts/types';
import dayjs from 'dayjs';

dayjs.extend(customParseFormat);
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;

export const TransactionMetaData: { [key: string]: { Account: string, Type: string } } = {
    "Debited from XX0041": { Account: "HDFC", Type: "Debit" },
    "Debited from XX6026": { Account: "SBI", Type: "Debit" },
    "Credited to XX0041": { Account: "HDFC", Type: "Credit" },
    "Credited to XX6026": { Account: "SBI", Type: "Credit" },
    "Debited from XXXX38": { Account: "SBI CC", Type: "Debit" },
    "Debited from XX1133": { Account: "IOB", Type: "Debit" },
    "Credited to XX1133": { Account: "IOB", Type: "Credit" },
    "Credited to Account": { Account: "Other", Type: "Credit" },
    "UPI Lite": { Account: "UPI Lite", Type: "Paytm" },
    "HDFC Bank - 41": { Account: "HDFC", Type: "Paytm" },
    "SBI Rupay Credit Card - 38": { Account: "SBI CC", Type: "Paytm" },
    "State Bank Of India - 26": { Account: "SBI", Type: "Paytm" },
}

export const getNumberAt = (sheet: XLSX.WorkSheet, cellAddress: string): number | null => {
    const data = sheet[cellAddress]?.v;
    if (data === undefined || data === null) return null;

    const value = String(data).replace(/[,\s]+/g, '');
    if (StringUtils.isNullOrEmpty(value)) return null;

    return isNaN(parseFloat(value)) ? null : parseFloat(value);
};

export const getStringAt = (sheet: XLSX.WorkSheet, cellAddress: string): string | null => {
    const data = sheet[cellAddress]?.v;
    if (data === undefined || data === null) return null;
    return String(data).trim();
};

export const getExcelWorkbookContext = async (file: File): Promise<ExcelWorkbookContext> => {
    const reader = new FileReader();
    const binaryString = await new Promise((resolve, reject) => {
        reader.onload = (e) => resolve(e.target?.result);
        reader.onerror = reject;
        reader.readAsBinaryString(file);
    });

    const workbook = XLSX.read(binaryString, { type: "binary" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    if (StringUtils.isNullOrEmpty(sheetName) || !sheet) throw new Error("Empty Worksheet Found!");
    return { workbook, sheet };
};

export const readPdfTokens = async (file: File, maxPages?: number): Promise<string[]> => {
    let tokens: string[] = [];
    const fileBuffer = await file.arrayBuffer();
    const document = await pdfjsLib.getDocument({ data: fileBuffer }).promise;
    const pageCount = maxPages ? Math.min(maxPages, document.numPages) : document.numPages;

    for (let index = 1; index <= pageCount; index++) {
        const page = await document.getPage(index);
        const textContent = await page.getTextContent();
        const pageTokens = textContent.items
            .map(item => ('str' in item && typeof item.str === 'string' ? item.str : StringUtils.empty))
            .filter(token => token.trim().length > 0);

        tokens = [...tokens, ...pageTokens];
    }

    return tokens;
};