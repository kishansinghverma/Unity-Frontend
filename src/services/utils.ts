export const parseDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        throw new Error("Invalid date value");
    }
    return date;
};

export const formatDate = (date: Date) => {
    const { day, month, year } = getDateComponent(date);
    return `${day}-${month}-${year}`;
}

export const getDateComponent = (date: Date) => {
    const day = date.getDate().toString();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear().toString()
    const time = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    return { day, month, time, year };
}
