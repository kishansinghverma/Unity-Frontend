import toast from "react-hot-toast";
import { HttpStatusCode } from "../constants/constant";

export const handleResponse = (response: Response, errorMessage?: string) => {
    if (!response.ok)
        throw new Error(`Error ${response.status} : ${errorMessage ? errorMessage : HttpStatusCode[response.status]}`);
}

export const handleJsonResponse = (response: Response, errorMessage?: string) => {
    handleResponse(response, errorMessage);
    return response.json();
}

export const handleError = (error: Error) => toast.error(error.message);