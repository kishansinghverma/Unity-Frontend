import dayjs from "dayjs";
import { normalizeToMinute } from "../../../../../engine/helpers/dateTimeHelper";
import { Nullable, WithId } from "../../../../../engine/models/types";
import { AppRecord, BankRecord, LocationRecord } from "./contracts/models";

const colorPair = [
    'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/60',
    'text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-800/50',
    'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-800/50',
    'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-800/50',
    'text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-800/50',
    'text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-800/50',
    'text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-800/50',
    'text-lime-600 dark:text-lime-400 bg-lime-100 dark:bg-lime-800/50',
    'text-teal-600 dark:text-teal-400 bg-teal-100 dark:bg-teal-800/50',
    'text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-800/50'
];

export const getIconBackground = (bankName: string) => {
    if (bankName === 'SBI')
        return 'bg-sky-100/80 dark:bg-sky-800/50'
    if (bankName === 'HDFC')
        return 'bg-pink-100 dark:bg-pink-800/40'
    if (bankName === 'ICICI CC')
        return 'bg-orange-100 dark:bg-orange-600/30'
    if (bankName === 'SBI CC')
        return 'bg-purple-100/80 dark:bg-purple-300/20'
    if (bankName === 'UPI Lite')
        return 'bg-orange-100/70'

    return colorPair[Math.floor(Math.random() * colorPair.length)]
}

export const getColorPair = (seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    const index = Math.abs(hash) % colorPair.length;
    return colorPair[index];
};

export const getAppRecordMatches = (bankRecord: WithId<BankRecord>, appRecords: WithId<AppRecord>[]) => {
    return appRecords.filter(entry =>
        entry.amount === bankRecord?.amount && dayjs(bankRecord.date).format('DD/MMM') === dayjs(entry.date).format('DD/MMM'));
}

export const getLocationRecordMatches = (bankRecord: Nullable<WithId<BankRecord>>, appRecord: Nullable<WithId<AppRecord>>, locationRecords: WithId<LocationRecord>[]) => {
    if (appRecord?._id) {
        const appRecordTimeNormalized = normalizeToMinute(appRecord?.date)
        const locationRecord = locationRecords.find(t => appRecordTimeNormalized === normalizeToMinute(t.dateTime));
        if (locationRecord) return [locationRecord];

        const delta = (5 * 60 * 1000);
        const upperDelta = appRecordTimeNormalized + delta;
        const lowerDelta = appRecordTimeNormalized - delta;
        return locationRecords.filter(t => normalizeToMinute(t.dateTime) >= lowerDelta && normalizeToMinute(t.dateTime) <= upperDelta);
    }
    else {
        return locationRecords.filter(t => dayjs(t.dateTime).isSame(bankRecord?.date, 'day'));
    }
}

export const getHash = (date: Date, amount: number, description?: string) => {
    const input = `${date.toISOString()}|${description}|${amount}`;
    let hash = 5381;
    for (let i = 0; i < input.length; i++) {
        hash = (hash * 33) ^ input.charCodeAt(i);
    }
    return hash >>> 0;
}
