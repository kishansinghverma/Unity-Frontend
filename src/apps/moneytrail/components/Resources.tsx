import { CircleDollarSign } from "lucide-react";
import { SafeMap } from "../../../engine/containers/safeMap";
import HdfcLogo from '../../../static/icons/hdfc.svg';
import SbiLogo from '../../../static/icons/sbi.svg';
import IciciLogo from '../../../static/icons/icici.svg';
import SbiCcLogo from '../../../static/icons/sbicc.svg';

export const BankLogo = new SafeMap<string, JSX.Element>({
    HDFC: <img src={HdfcLogo} width={24} height={24} />,
    SBI: <img src={SbiLogo} width={24} height={24} />,
    "ICICI CC": <img src={IciciLogo} width={24} height={24} className="rounded-xl" />,
    "SBI CC": <img src={SbiCcLogo} width={24} height={24}/>,
    Default: <CircleDollarSign size={24} />
});