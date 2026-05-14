import { Nullable, ReactState, WithId } from "../../../../engine/models/types";
import { DraftEntry, PhonePeEntry } from "./types";

export type DraftItemProps = {
    selectedItem: ReactState<string | null>
} & WithId<DraftEntry>;

export type PhonePeItemProps = {
    selectedItem: Nullable<string>
} & WithId<PhonePeEntry>;