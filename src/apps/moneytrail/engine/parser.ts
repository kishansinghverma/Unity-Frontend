import * as pdfjsLib from "pdfjs-dist";
import * as XLSX from 'xlsx';
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { StringUtils } from "../../../engine/helpers/stringHelper";
import { getHash } from "./utils";
dayjs.extend(customParseFormat);

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;

type BankEntry = {
    date: Date,
    description: string,
    amount: number,
    processed?: boolean,
    type: "Credit" | "Debit",
    bank: "SBI" | "HDFC" | "SBI CC" | "ICICI CC"
}

type PhonePeEntry = {
    date: Date,
    recipient: string,
    transactionId: string,
    utr: string,
    processed?: boolean,
    bank: string | "SBI" | "HDFC"
    type: string | "Credit" | "Debit",
    amount: number
}

const TransactionMetaData: { [key: string]: { Account: string, Type: string } } = {
    "Debited from XX0041": { Account: "HDFC", Type: "Debit" },
    "Debited from XX6026": { Account: "SBI", Type: "Debit" },
    "Credited to XX0041": { Account: "HDFC", Type: "Credit" },
    "Credited to XX6026": { Account: "SBI", Type: "Credit" }
}

const isFloat = (number: number) => Number(number) === number && number % 1 !== 0;

const getNumberAt = (sheet: XLSX.WorkSheet, cellAddress: string): number | null => {
    const data = sheet[cellAddress]?.v;
    if (data === undefined || data === null) return null;
    return isNaN(parseFloat(data)) ? null : parseFloat(data);
};

const getStringAt = (sheet: XLSX.WorkSheet, cellAddress: string): string | null => {
    const data = sheet[cellAddress]?.v;
    if (data === undefined || data === null) return null;
    return String(data).trim();
};

const parseHdfcStatement = (sheet: XLSX.WorkSheet) => {
    const transactions: Array<BankEntry> = [];
    const range = XLSX.utils.decode_range(sheet["!ref"] || "");
    if (!range) throw new Error('Empty Worksheet Found!');

    for (let row = range.s.r + 1; row <= range.e.r + 1; row++) {
        const cellAddress = `A${row}`;
        const txnDate = dayjs(getStringAt(sheet, cellAddress), "DD/MM/YY", true);
        if (txnDate.isValid()) {
            const date = txnDate.toDate();
            const description = getStringAt(sheet, `B${row}`) ?? '** UNIDENTIFIED **';
            const debit = getNumberAt(sheet, `E${row}`);
            const credit = getNumberAt(sheet, `F${row}`)
            const type = debit === null ? 'Credit' : 'Debit';
            const amount = credit ?? debit ?? 0;
            transactions.push({ date, description, amount, type, bank: 'HDFC' })
        }
    }

    return transactions;
}

const parseSbiStatement = (sheet: XLSX.WorkSheet) => {
    const transactions: Array<BankEntry> = [];
    const range = XLSX.utils.decode_range(sheet["!ref"] || "");
    if (!range) throw new Error('Empty Worksheet Found!');

    for (let row = range.s.r + 1; row <= range.e.r + 1; row++) {
        const cellAddress = `A${row}`;
        if (isFloat(getNumberAt(sheet, cellAddress) ?? 0)) {
            const parsedDate = XLSX.SSF.parse_date_code(getNumberAt(sheet, cellAddress));
            const date = new Date(parsedDate.y, parsedDate.m - 1, parsedDate.d);
            const description = getStringAt(sheet, `C${row}`) ?? '** UNIDENTIFIED **';
            const debit = getNumberAt(sheet, `E${row}`);
            const credit = getNumberAt(sheet, `F${row}`)
            const type = debit === null ? 'Credit' : 'Debit';
            const amount = credit ?? debit ?? 0;
            transactions.push({ date, description, amount, type, bank: 'SBI' })
        }
    }

    return transactions;
}

export const extractDataFromExcel = async (file: File) => {
    const reader = new FileReader();
    const binaryString = await new Promise((resolve, reject) => {
        reader.onload = (e) => resolve(e.target?.result);
        reader.onerror = reject;
        reader.readAsBinaryString(file);
    });

    const workbook = XLSX.read(binaryString, { type: "binary" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    if (getStringAt(sheet, 'A1')?.includes('HDFC BANK')) return parseHdfcStatement(sheet);
    else if (getStringAt(sheet, 'B8')?.includes('SBNCHQ-GEN')) return parseSbiStatement(sheet);
    else throw Error("Unsupported Excel File Provided.")
}

export const parsePhonePeStatement = async (file: File) => {
    let tokens: Array<string> = [];
    const transactions: Array<PhonePeEntry> = [];
    const meta = TransactionMetaData;
    const fileBuffer = await file.arrayBuffer();
    const document = await pdfjsLib.getDocument({ data: fileBuffer }).promise;

    for (let index = 1; index <= document.numPages; index++) {
        const page = await document.getPage(index);
        const textContent = await page.getTextContent();
        tokens = [...tokens, ...textContent.items.filter((t: any) => Boolean(t.str?.trim())).map((t: any) => t.str)];
    }

    if (!tokens[0].includes('Transaction Statement'))
        throw new pdfjsLib.InvalidPDFException('Invalid PhonePe Statement.');

    tokens.forEach((item, index) => {
        if (item.includes('Transaction ID')) {
            const transaction = {
                date: dayjs(`${tokens[index - 3]} - ${tokens[index - 2]}`, 'MMM DD, YYYY - hh:mm A').toDate(),
                recipient: tokens[index - 1].replace('Paid to', '').replace('Received from', '').replace('Bill paid -', '').trim(),
                transactionId: tokens[index].split(':')[1].trim(),
                utr: tokens[index + 1].split(':')[1].trim(),
                bank: meta[tokens[index + 2].trim()]?.Account ?? 'Unknown',
                type: tokens[index + 2].trim().includes('Credit') ? 'Credit' : tokens[index + 2].trim().includes('Debit') ? 'Debit' : 'Unknown',
                amount: Boolean(tokens[index + 4].replace('INR', '').trim()) ?
                    parseFloat(tokens[index + 4].replace('INR', '').trim()) : parseFloat(tokens[index + 5].trim())
            };
            transactions.push(transaction);
        }
    });

    return transactions;
};

export const extractDataFromHtml = async (file: File) => {
    const tableContents = await file.text();
    const htmlContents = `<table>${tableContents}</table>`;
    const parser = new DOMParser();
    const virtualDom = parser.parseFromString(htmlContents, 'text/html');
    const rows = virtualDom.querySelectorAll('tr');

    const transactions: BankEntry[] = [];

    const isValidDate = (dateString: string) => (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString));
    const isValidType = (type: string) => (type === "Debit" || type === "Credit");

    Array.from(rows).forEach(row => {
        const cells = row.querySelectorAll('td');
        const dateString = cells[0]?.textContent?.trim() ?? StringUtils.empty;
        const type = cells[2]?.textContent?.trim() ?? StringUtils.empty;
        const amount = parseFloat(cells[3]?.textContent?.trim() ?? StringUtils.empty);
        const description = cells[1]?.textContent?.trim();

        if (isValidDate(dateString) && isValidType(type) && !isNaN(amount) && !StringUtils.isNullOrEmpty(description)) {
            const [day, month, year] = dateString.split('/').map(Number);
            const date = dayjs(`${year}-${month}-${day}`).toDate();

            transactions.push({
                date, type, amount,
                bank: "SBI CC",
                description: `${description}/${getHash(date, amount, description)}`
            })
        }
    });

    if (transactions.length === 0) throw new Error("No Record Extracted From HTML File.");
    return transactions;
}

export const extractDataFromCsv = async (file: File) => {
    const isValidDate = (value: any) => (value instanceof Date && !isNaN(value.getTime()));

    const csvData = await file.text();
    const workbook = XLSX.read(csvData, { type: "string", cellDates: true, raw: false });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const transactions: BankEntry[] = [];

    rows.forEach(row => {
        const rowData = row as Array<any>;
        const date = rowData[0];
        const description = rowData[2];
        const amount = rowData[5];

        if (isValidDate(date) && !isNaN(amount) && amount !== 0) {
            const type = amount < 0 ? "Credit" : "Debit";
            const amountAbsolute = Math.abs(amount);

            transactions.push({
                date, type,
                bank: "ICICI CC",
                amount: amountAbsolute,
                description: `${description}/${getHash(date, amountAbsolute, description)}`
            })
        }
    });

    if (transactions.length === 0) throw new Error("No Record Extracted From CSV File.");
    return transactions;
} 