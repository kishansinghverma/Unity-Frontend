import { Nullable } from "../../../../engine/models/types";

export type DescriptionInfo = {
  platform: string;
  category: string;
};

export type BankTheme = {
  gradient: string;
  bg: string;
  text: string;
  border: string;
};

export type ReviewModalState = {
  bankItemId: Nullable<string>;
};
