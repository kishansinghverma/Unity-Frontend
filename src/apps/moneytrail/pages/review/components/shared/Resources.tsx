import { CircleDollarSign } from "lucide-react";
import { JSX } from "react";
import { SafeMap } from "../../../../../../engine/containers/safeMap";
import { ImgSrc, SvgImage } from '../../../../../../static/icons/provider';

export const BankLogo = new SafeMap<string, JSX.Element>({
    HDFC: <SvgImage src={ImgSrc.Hdfc} width={24} height={24} />,
    SBI: <SvgImage src={ImgSrc.Sbi} width={24} height={24} />,
    "ICICI CC": <SvgImage src={ImgSrc.Icici} width={24} height={24} style={{ borderRadius: 12 }} />,
    "SBI CC": <SvgImage src={ImgSrc.SbiCc} width={24} height={24} />,
    "UPI Lite": <SvgImage src={ImgSrc.Upi} width={24} height={24} />,
    Default: <CircleDollarSign size={24} />
});
