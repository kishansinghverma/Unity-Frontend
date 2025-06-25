export type WithId<T> = {
    _id: string;
} & T;