import { CircleDollarSign } from "lucide-react";
import { JSX } from "react";
import { SafeMap } from "../../../../../../engine/containers/safeMap";
import { getIcon, icon } from '../../../../../../static/icons/provider';

export const BankLogo = new SafeMap<string, JSX.Element>({
    HDFC: <img src={getIcon(icon.Hdfc)} width={24} height={24} />,
    SBI: <img src={getIcon(icon.Sbi)} width={24} height={24} />,
    "ICICI CC": <img src={getIcon(icon.Icici)} width={24} height={24} className="rounded-xl" />,
    "SBI CC": <img src={getIcon(icon.SbiCc)} width={24} height={24} />,
    "UPI Lite": <img src={getIcon(icon.Upi)} width={24} height={24} />,
    Default: <CircleDollarSign size={24} />
});
