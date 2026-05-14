import Cash from './cash.svg';
import Hdfc from './hdfc.svg';
import Icici from './icici.svg';
import OtherPay from './otherpay.svg';
import Sbi from './sbi.svg';
import SbiCc from './sbicc.svg';
import Upi from './upi.svg';

const iconMap = {
  Cash,
  Hdfc,
  Icici,
  OtherPay,
  Sbi,
  SbiCc,
  Upi
} as const;

type Svg = keyof typeof iconMap;

export const icon = Object.fromEntries(Object.keys(iconMap).map((key) => [key, key])) as { [K in Svg]: K };
export const getIcon = (name: Svg) => iconMap[name];
