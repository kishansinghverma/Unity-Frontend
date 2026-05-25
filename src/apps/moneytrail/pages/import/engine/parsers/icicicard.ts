import dayjs from "dayjs";
import * as XLSX from 'xlsx';
import customParseFormat from "dayjs/plugin/customParseFormat";
import { StringUtils } from "../../../../../../engine/helpers/stringHelper";
import { BankRecord } from "../../../review/engine/contracts/models";
import { getHash } from "../../../review/engine/utils";

dayjs.extend(customParseFormat);

const getDate = (value: unknown) => {
    const invalidDate = dayjs('invalid');
    if (value === null || value === undefined) return invalidDate;

    const dateValue = String(value).trim();
    if (StringUtils.isNullOrEmpty(dateValue)) return invalidDate;
    const parsedDate = dayjs(dateValue, ['DD/MM/YYYY', 'DD-MMM-YY'], true);
    if (parsedDate.isValid()) return parsedDate;

    const match = dateValue.match(/^(\d{1,2})[-/.]([A-Za-z]{3})[-/.](\d{2,4})$/);
    if (!match) return invalidDate;

    return dayjs(new Date(dateValue));
}

export const parseIciciCardStatement = async (file: File) => {
    const csvData = await file.text();
    const workbook = XLSX.read(csvData, { type: "string", raw: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const transactions: BankRecord[] = [];

    rows.forEach(row => {
        const rowData = row as Array<string | number | null | undefined>;
        const parsedDate = getDate(rowData[0]);
        const description = String(rowData[2] ?? StringUtils.empty).trim();
        const amount = String(rowData[5] ?? StringUtils.empty).replaceAll(',', '');
        const amountSigned = String(rowData[6] ?? StringUtils.empty).replaceAll(',', '');
        const parsedAmount = parseFloat(amount);
        const parsedSignedAmount = parseFloat(amountSigned);
        
        const type: 'Debit' | 'Credit' = isNaN(parsedSignedAmount) ?
            StringUtils.isNullOrEmpty(amountSigned) ? 'Debit' : 'Credit' : parsedSignedAmount > 0 ? 'Debit' : 'Credit';

        if (parsedDate.isValid() && !isNaN(parsedAmount) && parsedAmount !== 0) {
            const date = parsedDate.toDate();
            const amountAbsolute = Math.abs(parsedAmount);

            transactions.push({
                date, type,
                bank: "ICICI CC",
                amount: amountAbsolute,
                description: `${description}/${getHash(date, amountAbsolute, description)}`
            });
        }
    });

    return transactions;
} 
