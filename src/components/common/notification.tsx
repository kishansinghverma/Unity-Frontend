import { CheckCircle2, CircleX, LoaderCircle } from "lucide-react";
import { FC, ReactNode } from "react";

export const PendingMessage: FC<{ content: string | ReactNode }> = ({ content }) => (
    typeof content === 'string' ? (
        <div className="flex gap-2">
            <LoaderCircle className="w-6 h-6 animate-spin text-blue-500" />
            <div className="text-blue-600">{content}</div>
        </div>
    ) : <>{content}</>
);

export const SuccessMessage: FC<{ content: string | ReactNode }> = ({ content }) => (
    typeof content === 'string' ? (
        <div className="flex gap-2">
            <CheckCircle2 className="text-green-500" />
            <div className="text-green-600">{content}</div>
        </div>
    ) : <>{content}</>
);

export const FailedMessage: FC<{ content: string | ReactNode }> = ({ content }) => (
    typeof content === 'string' ? (
        <div className="flex gap-2">
            <CircleX className="text-red-500" />
            <div className="text-red-600">{content}</div>
        </div>
    ) : <>{content}</>
);