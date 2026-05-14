import { Nullable, ReactState, WithId } from "../../../../engine/models/types";
import { DraftEntry, PaymentAppEntry } from "./types";

export type DraftItemProps = {
    selectedItem: ReactState<string | null>
} & WithId<DraftEntry>;

export type PaymentAppItemProps = {
    selectedItem: Nullable<string>
} & WithId<PaymentAppEntry>;