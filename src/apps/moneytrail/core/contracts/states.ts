import { Nullable } from "../../../../engine/models/types";

export type FormState = {
  amount: number,
  description: string,
  category: number,
  group: number
};

export type ReviewModalState = {
  bankItemId: Nullable<string>;
};