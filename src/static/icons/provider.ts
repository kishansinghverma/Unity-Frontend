import { createElement, type CSSProperties, type FC } from 'react';
import Cash from './cash.svg';
import Hdfc from './hdfc.svg';
import Icici from './icici.svg';
import OtherPay from './otherpay.svg';
import Paytm from './paytm.svg';
import PhonePe from './phonepe.svg';
import Sbi from './sbi.svg';
import SbiCc from './sbicc.svg';
import Upi from './upi.svg';

export const ImgSrc = {
  Cash,
  Hdfc,
  Icici,
  OtherPay,
  Paytm,
  PhonePe,
  Sbi,
  SbiCc,
  Upi
} as const;

type ImgSource = (typeof ImgSrc)[keyof typeof ImgSrc];

type SvgImageProps = {
  alt?: string;
  src: ImgSource;
  width?: number | string;
  height?: number | string;
  style?: CSSProperties;
};

export const SvgImage: FC<SvgImageProps> = ({ src: imageSrc, width, height, style, alt }) => createElement('img', { alt, src: imageSrc, style, width, height });
