import dayjs from 'dayjs';
import customParseFormat from "dayjs/plugin/customParseFormat";
import * as XLSX from 'xlsx';
import { BankRecord } from "../../../review/engine/contracts/models";
import { getExcelWorkbookContext, getNumberAt, getStringAt } from "./common";

dayjs.extend(customParseFormat);

export const parseHdfcStatement = async (file: File) => {
    const { sheet } = await getExcelWorkbookContext(file);

    const range = XLSX.utils.decode_range(sheet["!ref"] || "");
    if (!range) throw new Error('No record found in HDFC Statement!');

    const transactions: Array<BankRecord> = [];

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