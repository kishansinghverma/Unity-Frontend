

export const getDateComponent = (dateValue: string | Date) => {
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear().toString()
    const time = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    return { day, month, time, year };
}
