import { HttpStatusCode } from "../constant";
import { notifyError } from "../services/notificationService";

export const fetchJson = (route: string) => fetch(route).then(handleJsonResponse).catch(error => handleError(error, true));

export const handleResponse = (response: Response, errorMessage?: string) => {
    if (!response.ok)
        throw new Error(`Error ${response.status} : ${errorMessage ? errorMessage : HttpStatusCode[response.status]}`);
}

export const handleJsonResponse = (response: Response, errorMessage?: string) => {
    handleResponse(response, errorMessage);
    return response.json();
}

export const handleError = (error: Error | string, rethrow = false) => {
    notifyError({
        showProgress: true,
        pauseOnHover: true,
        duration: 5,
        message: 'Request Error',
        description: error instanceof Error ? error.message : error,
    });

    if (rethrow) throw error;
}