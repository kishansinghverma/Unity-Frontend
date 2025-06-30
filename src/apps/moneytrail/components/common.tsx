import { getColorPair, getIconBackground } from "../commons/utils";
import { BankLogo } from "./Resoures";

export const getBankIcon = (bankName: string) => (
    <div className={`p-2 rounded ${getIconBackground(bankName)}`} title={bankName}>
        {BankLogo.get(bankName)}
    </div>
);

export const getAlphabetIcon = (firstLetter: string, seed: string, overrideStyle: string | null) => {
    return (
        <div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg ${overrideStyle ?? getColorPair(seed)}`}>
            <span className={`text-lg sm:text-xl font-bold`}>
                {firstLetter}
            </span>
        </div>
    )
}