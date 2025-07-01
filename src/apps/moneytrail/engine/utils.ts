import dayjs from "dayjs";
import { Nullable, WithId } from "../../../engine/models/types";
import { BankEntry, DraftEntry, PhonepeEntry } from "./models/types";

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

const normalizeToMinute = (date: Date | string | undefined) => dayjs(date).startOf('minute').valueOf();

export const getPhonePeMatches = (bankEntry: WithId<BankEntry>, phonePeEntries: WithId<PhonepeEntry>[]) => {
    return phonePeEntries.filter(entry =>
        entry.amount === bankEntry?.amount && dayjs(bankEntry.date).format('DD/MMM') === dayjs(entry.date).format('DD/MMM'));
}

export const getIconBackground = (bankName: string) => {
    if (bankName === 'SBI')
        return 'bg-sky-100/80 dark:bg-sky-800/50'
    if (bankName === 'HDFC')
        return 'bg-pink-100 dark:bg-pink-800/40'

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

export const getDraftMatches = (phonePeEntry: WithId<PhonepeEntry>, draftEntries: WithId<DraftEntry>[]) => {
    const phonePeTimeNormalized = normalizeToMinute(phonePeEntry?.date)
    const draftEntry = draftEntries.find(t => phonePeTimeNormalized === normalizeToMinute(t.dateTime));
    if (draftEntry) return [draftEntry];

    const delta = (5 * 60 * 1000);
    const upperDelta = phonePeTimeNormalized + delta;
    const lowerDelta = phonePeTimeNormalized - delta;
    return draftEntries.filter(t => normalizeToMinute(t.dateTime) >= lowerDelta && normalizeToMinute(t.dateTime) <= upperDelta);
}