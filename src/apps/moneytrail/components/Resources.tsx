import { CircleDollarSign, CreditCard } from "lucide-react";
import HdfcLogo from '../../../static/hdfc.svg';
import SbiLogo from '../../../static/sbi.svg';
import IciciLogo from '../../../static/icici.svg';
import SbiCcLogo from '../../../static/sbicc.svg';
import { SafeMap } from "../../../engine/containers/safeMap";

export const BankLogo = new SafeMap<string, JSX.Element>({
    HDFC: <img src={HdfcLogo} width={24} height={24} />,
    SBI: <img src={SbiLogo} width={24} height={24} />,
    "ICICI CC": <img src={IciciLogo} width={24} height={24} className="rounded-xl" />,
    "SBI CC": <img src={SbiCcLogo} width={24} height={24}/>,
    Default: <CircleDollarSign size={24} />
});