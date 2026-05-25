import dayjs from "dayjs";
import { AppRecord } from "../../../review/engine/contracts/models";
import { TransactionMetaData } from "../constants";
import { readPdfTokens } from "./common";

export const parsePhonePeStatement = async (file: File) => {
    const tokens = await readPdfTokens(file);
    const transactions: Array<AppRecord> = [];
    const meta = TransactionMetaData;

    if (!tokens[0]?.includes('Transaction Statement')) throw new Error('Invalid PhonePe Statement Provided!');

    tokens.forEach((item, index) => {
        if (item.includes('Transaction ID')) {
            const words = [tokens[index - 1], tokens[index - 2], tokens[index - 3], tokens[index - 4], tokens[index - 5], tokens[index - 6]];
            const timeIndex = words.findIndex(word => /^\d{1,2}:\d{2} ?[APap][Mm]$/.test(word));

            const time = words[timeIndex];
            const recipient = words.slice(0, timeIndex).map(word => word.trim()).reverse().join(" ");

            let date = words[timeIndex + 1].trim();
            if (!(/^[a-z]{3} \d{1,2}, \d{4}$/i.test(date)))
                date = `${words[timeIndex + 2].trim()} ${date}`;

            const transaction: AppRecord = {
                date: dayjs(`${date} - ${time}`, 'MMM DD, YYYY - hh:mm A').toDate(),
                app: 'phonepe',
                recipient: `${recipient.replace('Paid to', '').replace('Received from', '').replace('Bill paid -', '').trim()}`,
                transactionId: tokens[index].split(':')[1].trim(),
                utr: tokens[index + 1].split(':')[1].trim(),
                bank: meta[tokens[index + 2].trim()] ?? 'Unknown',
                type: tokens[index + 2].trim().includes('Credit') ? 'Credit' : tokens[index + 2].trim().includes('Debit') ? 'Debit' : 'Unknown',
                amount: tokens[index + 4].replace('INR', '').trim().length > 0 ?
                    parseFloat(tokens[index + 4].replace('INR', '').trim()) : parseFloat(tokens[index + 5].trim())
            };
            transactions.push(transaction);
        }
    });

    return transactions;
};
