import dayjs from "dayjs";
import * as XLSX from 'xlsx';
import customParseFormat from "dayjs/plugin/customParseFormat";
import { BankRecord } from "../../../review/engine/contracts/models";
import { getStringAt, getNumberAt, getExcelWorkbookContext } from "./common";

dayjs.extend(customParseFormat);

export const parseSbiStatement = async (file: File) => {
    const { sheet } = await getExcelWorkbookContext(file);
    const range = XLSX.utils.decode_range(sheet["!ref"] || "");
    if (!range) throw new Error('Empty Worksheet Found!');

    const transactions: Array<BankRecord> = [];

    for (let row = range.s.r + 1; row <= range.e.r + 1; row++) {
        const cellAddress = `A${row}`;
        const txnDate = dayjs(getStringAt(sheet, cellAddress), "DD/MM/YYYY", true);

        if (txnDate.isValid()) {
            const date = txnDate.toDate();
            const description = getStringAt(sheet, `B${row}`)?.replace('\n ', '').replace(/\s+/g, " ").replace('AT 11649 SAHPAU (DISTT HATHRAS)', '').trim() ?? '** UNIDENTIFIED **';
            const debit = getNumberAt(sheet, `D${row}`);
            const credit = getNumberAt(sheet, `E${row}`)
            const type = debit === null ? 'Credit' : 'Debit';
            const amount = credit ?? debit ?? 0;
            transactions.push({ date, description, amount, type, bank: 'SBI' })
        }
    }

    return transactions;
}