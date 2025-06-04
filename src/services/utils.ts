export const formatDateTime = (dateString: string): { day: string, month: string, time: string } => {
    try {
        const dateObj = new Date(dateString);
        if (isNaN(dateObj.getTime())) {
            throw new Error("Invalid date value");
        }
        const day = dateObj.getDate().toString();
        const month = dateObj.toLocaleString('default', { month: 'short' });
        const time = dateObj.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        return { day, month, time };
    } catch (error) {
        console.error("Error parsing date:", dateString, error);
        return { day: "??", month: "???", time: "--:-- --" };
    }
};
