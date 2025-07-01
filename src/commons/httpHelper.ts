import toast from "react-hot-toast";
import { HttpStatusCode } from "../constants/constant";

export const FetchJson = (route: string) => fetch(route).then(handleJsonResponse);

export const handleResponse = (response: Response, errorMessage?: string) => {
    if (!response.ok)
        throw new Error(`Error ${response.status} : ${errorMessage ? errorMessage : HttpStatusCode[response.status]}`);
}

export const handleJsonResponse = (response: Response, errorMessage?: string) => {
    handleResponse(response, errorMessage);
    return response.json();
}

export const handleError = (error: Error | string) => toast.error(error instanceof Error ? error.message : error);