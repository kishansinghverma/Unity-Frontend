import { StringUtils } from "./helpers/stringHelper";
import { Fetchable } from "./models/types";
import { NotificationDescriptions, NotificationMessages } from "./services/notificationService";

export const FetchableDefault: Fetchable<any[]> = {
    contents: [],
    isLoading: true,
    error: StringUtils.empty
}

export const DefaultMessages: NotificationMessages = {
    pending: 'Executing Operation',
    success: 'Operation Completed',
    error: 'Operation Failed'
};

export const DefaultDescriptions: NotificationDescriptions = {
    pending: 'Processing the Task...',
    success: 'Task Completed Successfully.',
    error: 'Unable to Complete the Task!'
}