import dayjs from "dayjs";
import { StringUtils } from "../../../../../../engine/helpers/stringHelper";
import { BankRecord } from "../../../review/engine/contracts/models";
import { getHash } from "../../../review/engine/utils";

export const parseSbiCardStatement = async (file: File) => {
    const tableContents = await file.text();
    const htmlContents = `<table>${tableContents}</table>`;
    const parser = new DOMParser();
    const virtualDom = parser.parseFromString(htmlContents, 'text/html');
    const rows = virtualDom.querySelectorAll('tr');

    const transactions: BankRecord[] = [];

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

    return transactions;
}