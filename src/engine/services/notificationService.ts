import { notification } from 'antd';
import { ArgsProps } from 'antd/es/notification';
import { ReactNode } from 'react';
import { FailedMessage, PendingMessage, SuccessMessage } from '../../components/common/notification';
import { DefaultDescriptions, DefaultMessages } from '../defaults';

export type NotificationMessages = {
    pending?: string | ReactNode;
    success?: string | ReactNode;
    error?: string | ReactNode;
}

export type NotificationDescriptions = {
    pending?: string;
    success?: string | ((data: any) => string);
    error?: string | ((data: any) => string);
}

const styles = {
    pending: 'bg-blue-100/20 border rounded-lg font-medium order-blue-200',
    success: 'bg-green-100/20 border rounded-lg font-medium border-green-200',
    error: 'bg-red-100/10 border rounded-lg font-medium border-red-200'
}

type NotifyFunction = (args: Parameters<ReturnType<typeof notification.useNotification>[0]['open']>[0]) => void;

let toast: NotifyFunction = () => console.warn('Notification Engine Not Ready!');

export const setNotificationApi = (api: ReturnType<typeof notification.useNotification>[0]) => { toast = api.open };

export const notify = {
    error: (props: ArgsProps) => toast({
        message: FailedMessage({ content: props.message }),
        description: props.description,
        duration: 5,
        className: styles.error
    }),
    success: (props: ArgsProps) => toast({
        message: SuccessMessage({ content: props.message }),
        description: props.description,
        duration: 5,
        className: styles.success
    }),
    promise: (promise: Promise<any>, messages: NotificationMessages, descriptions: NotificationDescriptions) => {
        const notificationKey = crypto.randomUUID();

        toast({
            key: notificationKey,
            duration: 0,
            message: PendingMessage({ content: messages.pending ?? DefaultMessages.pending }),
            description: descriptions.pending ?? DefaultDescriptions.pending,
            className: styles.pending
        });

        promise.then((data) => {
            const description = typeof descriptions.success === 'function' ? descriptions.success(data) : descriptions.success;
            toast({
                key: notificationKey,
                duration: 5,
                message: SuccessMessage({ content: messages.success ?? DefaultMessages.success }),
                description: description ?? DefaultDescriptions.success as string,
                className: styles.success
            });
        }).catch((err) => {
            const description = typeof descriptions.error === 'function' ? descriptions.error(err) : descriptions.error;
            toast({
                key: notificationKey,
                duration: 30,
                message: FailedMessage({ content: messages.error ?? DefaultMessages.error }),
                description: description ?? err?.message ?? DefaultDescriptions.error,
                className: styles.error
            });
        });
    }
}