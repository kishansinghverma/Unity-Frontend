import { notification } from 'antd';
import { ArgsProps } from 'antd/es/notification';
import { ReactNode } from 'react';
import { FailedMessage, PendingMessage, SuccessMessage } from '../../components/common/notification';

type NotifyFunction = (args: Parameters<ReturnType<typeof notification.useNotification>[0]['open']>[0]) => void;

let toast: NotifyFunction = () => console.warn('Notification not initialized yet');

export const setNotificationApi = (api: ReturnType<typeof notification.useNotification>[0]) => { toast = api.open };

export const notify = {
    error: (props: ArgsProps) => toast({
        message: FailedMessage({ content: props.message }),
        description: props.description,
        duration: 3,
        className: "bg-red-100/10 border rounded-lg font-medium border-red-200"
    }),
    success: (props: ArgsProps) => toast({
        message: SuccessMessage({ content: props.message }),
        description: props.description,
        duration: 3,
        className: "bg-green-100/20 border rounded-lg font-medium border-green-200"
    }),
    promise: (promise: Promise<any>, params: {
        pending?: { message: string | ReactNode, description: string },
        success?: { message: string | ReactNode, description?: string, render?: (data: any) => string },
        error?: { message: string | ReactNode, description?: string }
    }) => {
        const notificationKey = crypto.randomUUID();

        toast({
            key: notificationKey,
            duration: 0,
            message: PendingMessage({ content: params.pending?.message ?? "Executing Operation" }),
            description: params.pending?.description ?? "Processing the Task...",
            className: "bg-blue-100/20 border rounded-lg font-medium order-blue-200"
        });

        promise.then((data) => {
            const description = !!params.success?.render ? params.success.render(data) : params.success?.description;
            toast({
                key: notificationKey,
                duration: 3,
                message: SuccessMessage({ content: params.success?.message ?? "Operation Success" }),
                description: description ?? "Task Completed Successfully.",
                className: "bg-green-100/20 border rounded-lg font-medium border-green-200"
            });
        }).catch((err) => {
            toast({
                key: notificationKey,
                duration: 300,
                message: FailedMessage({ content: params.error?.message ?? "Operation Failed" }),
                description: params.error?.description ?? err.message ?? "Unable to Complete the Task!",
                className: "bg-red-100/10 border rounded-lg font-medium border-red-200"
            });
        }).catch(() => {
            toast({
                key: notificationKey,
                duration: 3,
                message: FailedMessage({ content: params.error?.message ?? "Operation Failed" }),
                description: params.error?.description ?? "Unable to Complete the Task!",
                className: "bg-red-100/10 border rounded-lg font-medium border-red-200",
            });
        });
    }
}