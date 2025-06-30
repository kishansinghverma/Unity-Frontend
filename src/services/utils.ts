export const parseDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        throw new Error("Invalid date value");
    }
    return date;
};

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const { day, month } = getDateComponent(date);
    return `${day} ${month} `;
}

export const getDateComponent = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear().toString()
    const time = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    return { day, month, time, year };
}
