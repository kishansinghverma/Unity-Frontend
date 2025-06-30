import { getIconBackground } from "../commons/utils";
import { BankLogo } from "./Resoures";

export const getBankIcon = (bankName: string) => (
    <div className={`p-2 rounded ${getIconBackground(bankName)}`} title={bankName}>
        {BankLogo.get(bankName)}
    </div>
)