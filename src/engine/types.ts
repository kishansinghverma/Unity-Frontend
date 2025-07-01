export type WithId<T> = {
    _id: string;
} & T;

export type Fetchable<T> = {
    contents: T;
    isLoading: boolean
    error: string
}