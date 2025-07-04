import { getColorPair, getIconBackground } from "../engine/utils";
import { CircleDollarSign } from "lucide-react";
import HdfcLogo from '../../../static/hdfc.svg';
import SbiLogo from '../../../static/sbi.svg';
import { SafeMap } from "../../../engine/containers/safeMap";

export const BankLogo = new SafeMap<string, JSX.Element>({
    HDFC: <img src={HdfcLogo} width={24} height={24} />,
    SBI: <img src={SbiLogo} width={24} height={24} />,
    Default: <CircleDollarSign size={24} />
});

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
