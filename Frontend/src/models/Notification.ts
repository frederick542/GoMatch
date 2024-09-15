export default interface Notification {
    id: string;
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
}