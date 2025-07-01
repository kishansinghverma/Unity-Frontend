import { Fetchable } from "./models/types";

export const StringDefault = '';

export const FetchableDefault: Fetchable<any[]> = {
    contents: [],
    isLoading: true,
    error: StringDefault
}