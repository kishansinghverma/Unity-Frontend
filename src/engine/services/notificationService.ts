import { notification } from 'antd';
import { ArgsProps } from 'antd/es/notification';

type NotifyFunction = (args: Parameters<ReturnType<typeof notification.useNotification>[0]['open']>[0]) => void;

let notify: NotifyFunction = () => console.warn('Notification not initialized yet');

export const setNotificationApi = (api: ReturnType<typeof notification.useNotification>[0]) => { notify = api.open };

export const notifyError = (props: ArgsProps) => notify({ type: 'error', ...props });

export const notifySuccess = (props: ArgsProps) => notify({ type: 'success', ...props });