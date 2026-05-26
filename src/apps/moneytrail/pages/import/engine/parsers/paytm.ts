import dayjs from 'dayjs';
import customParseFormat from "dayjs/plugin/customParseFormat";
import * as XLSX from 'xlsx';
import { StringUtils } from '../../../../../../engine/helpers/stringHelper';
import { AppRecord } from "../../../review/engine/contracts/models";
import { getHash } from '../../../review/engine/utils';
import { TransactionMetaData } from '../constants';
import { getExcelWorkbookContext, getNumberAt, getStringAt } from './common';

dayjs.extend(customParseFormat);

export const parsePaytmStatement = async (file: File) => {
    const { workbook } = await getExcelWorkbookContext(file);

    const sheetName = workbook.SheetNames[1] ?? workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) throw new Error("Invalid Paytm Statement Provided!");

    const range = XLSX.utils.decode_range(sheet["!ref"] || "");
    if (!range) throw new Error('No record found in Paytm Statement!');

    const meta = TransactionMetaData;
    const transactions: Array<AppRecord> = [];

    const prefixes = [
        'Paid to',
        'Received from',
        'Recharge of',
        'Money sent to'
    ];

    const upiLiteIdentifiers = [
        'automatic add money for upi lite',
        'money added to upi lite'
    ]

    for (let row = range.s.r + 1; row <= range.e.r + 1; row++) {
        const dateVal = getStringAt(sheet, `A${row}`);
        const timeVal = getStringAt(sheet, `B${row}`);
        const txnDate = dayjs(dateVal, "DD/MM/YYYY", true);

        if (txnDate.isValid()) {
            const date = dayjs(`${dateVal} - ${timeVal}`, 'DD/MM/YYYY - HH:mm:ss').toDate();
            const recipient = getStringAt(sheet, `C${row}`)?.replace(new RegExp(`^(${prefixes.join('|')})\\s*`, 'i'), StringUtils.empty).trim() || '** UNIDENTIFIED **';
            const amount = getNumberAt(sheet, `F${row}`) ?? 0;
            const transactionId = `${getHash(date, amount ?? 0, recipient)}`;
            const utr = `${getStringAt(sheet, `D${row}`)}/${transactionId}`;
            const bank = meta[getStringAt(sheet, `E${row}`) ?? StringUtils.empty] ?? 'Unknown';
            const type = upiLiteIdentifiers.includes(recipient.toLowerCase())  ? 'Debit' : amount > 0 ? 'Credit' : 'Debit';

            transactions.push({ date, app: 'paytm', recipient, transactionId, utr, bank, type, amount: Math.abs(amount) });
        }
    }

    return transactions;
}
