export const getArrayOrDefault = (result: {
    data?: any;
    isLoading: boolean;
    isError: boolean
}): any[] => (result.isLoading || result.isError ? [] : result.data)