import { useState } from "react";
import ToastService from "../services/toastService";

interface UseAsyncHandlerResult<T> {
    loading: boolean;
    executeAsync: (...args: any[]) => Promise<T | undefined>;
}

export default function useAsyncHandler<T>(asyncFunction: (...args: any[]) => Promise<T>, successMessage?: string): UseAsyncHandlerResult<T> {
    const toastService = ToastService();
    const [loading, setLoading] = useState(false);

    async function executeAsync(...args: any[]): Promise<T | undefined> {
        if (loading) {
            return
        }
        setLoading(true);
        try {
            const result = await asyncFunction(...args);
            if (successMessage) {
                toastService.success(successMessage);
            }
            return result;
        } catch (error: any) {
            toastService.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    return {
        loading,
        executeAsync
    };
}
