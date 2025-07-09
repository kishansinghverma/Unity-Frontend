import { getColorPair, getIconBackground } from "../engine/utils";
import { BankLogo } from "./Resources";

export const BankIcon = ({ bankName }: {
    bankName: string
}) => (
    <div className={`p-2 rounded ${getIconBackground(bankName)}`} title={bankName}>
        {BankLogo.get(bankName)}
    </div>
);

export const AlphabetIcon = ({ firstLetter, seed, overrideStyle}: {
    firstLetter: string
    seed: string;
    overrideStyle?: string;
}) => (
    <div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg ${overrideStyle ?? getColorPair(seed)}`}>
        <span className={`text-lg sm:text-xl font-bold`}>
            {firstLetter}
        </span>
    </div>
);
