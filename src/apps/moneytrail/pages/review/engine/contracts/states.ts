import { Nullable } from "../../../../../../engine/models/types";

export type ReviewModalFormState = {
  amount: number,
  description: string,
  category: number,
  group: number
};

export type ReviewModalState = {
  bankItemId: Nullable<string>;
};

export type ManualEntryFormState = {
  amount: number;
  description: string;
  category: number;
  group: number;
  date: Date;
  source: string;
  location: string;
  type: "Credit" | "Debit";
};