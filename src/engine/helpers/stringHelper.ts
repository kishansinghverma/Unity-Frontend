export class StringUtils {
    static empty = '';

    static isNullOrEmpty = (value: string | null | undefined): boolean => (value === null || value === undefined || value.trim() === '');

    static capitalize = (value?: string) => {
        if (value === null || value === undefined) return null;
        if (value.trim() === this.empty) return this.empty;

        const capitalized = value.trim().split(/\s+/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
            .split('.').map(sentence => sentence.trimStart()).map(sentence => sentence.charAt(0).toUpperCase() + sentence.slice(1)).join('.');

        return capitalized;
    }
}