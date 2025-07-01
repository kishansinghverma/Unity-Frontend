import { useState } from "react";

export const useReactState = <T>(value: T) => {
    const state = useState<T>(value);
    return {
        get: () => state[0],
        set: state[1]
    }
};

export const useAsyncState = <T>(value: T, isLoading = true) => {
    const contentState = useReactState(value);
    const loadingState = useReactState(isLoading)

    return {
        content: contentState.get(),
        isLoading: loadingState.get(),
        setContent: (state: T) => contentState.set(state),
        setLoading: (state: boolean) => loadingState.set(state),
        startLoading: () => loadingState.set(true),
        stopLoading: () => loadingState.set(false)
    }
};