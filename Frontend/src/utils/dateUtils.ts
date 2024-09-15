export function getTimeDiffYear(date: Date | undefined) {
    if (!date) return 0;
    const now = new Date();
    return now.getFullYear() - date.getFullYear();
}

export function formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    };
    return date.toLocaleDateString('en-GB', options);
}

export function isSameDate(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function getTimeDiffFormatted(date: Date) {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = diff / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;
    const weeks = days / 7;
    const months = days / 30;
    const years = days / 365;

    if (minutes < 60) {
        return `${Math.max(Math.floor(minutes), 1)} min`;
    } else if (hours < 24) {
        return `${Math.floor(hours)} hour`;
    } else if (days < 7) {
        return `${Math.floor(days)} day`;
    } else if (weeks < 4) {
        return `${Math.floor(weeks)} week`;
    } else if (months < 12) {
        return `${Math.floor(months)} month`;
    } else {
        return `${Math.floor(years)} year`;
    }

}