import { ReactState, WithId } from "../../../../engine/models/types";
import { DraftEntry, PhonepeEntry } from "./types";

export type DraftItemProps = {
    selectedItem: ReactState<string | null>
} & WithId<DraftEntry>;

export type PhonepeItemProps = {
    selectedItem: ReactState<string | null>
} & WithId<PhonepeEntry>;