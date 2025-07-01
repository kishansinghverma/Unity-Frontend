import { Dispatch, SetStateAction } from "react";

export type WithId<T> = {
    _id: string;
} & T;

export type Fetchable<T> = {
    contents: T;
    isLoading: boolean
    error: string
}

export type ReactState<T> = {
  get: () => T;
  set: Dispatch<SetStateAction<T>>;
};