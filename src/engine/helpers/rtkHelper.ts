export const getArrayOrDefault = <T>(result: {
    data?: T[];
    isLoading: boolean;
    isError: boolean
}): T[] => (result.isLoading || result.isError ? [] : (result.data ?? []))