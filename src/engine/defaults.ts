import { Fetchable } from "./types";

export const StringDefault = '';

export const FetchableDefault: Fetchable<any[]> = {
    contents: [],
    isLoading: true,
    error: StringDefault
}