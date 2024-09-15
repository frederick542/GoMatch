import Toast, { ToastShowParams } from "react-native-toast-message";

export default function ToastService() {
    const baseProps: ToastShowParams = {
        autoHide: true,
        visibilityTime: 2000,
        position: 'top'
    }
    const error = (title: string, detail?: string) => {
        Toast.show({
            type: 'error',
            text1: title,
            text2: detail,
            ...baseProps
        })
    }
    const success = (title: string, detail?: string) => {
        Toast.show({
            type: 'success',
            text1: title,
            text2: detail,
            ...baseProps
        })
    }
    const info = (title: string, detail?: string) => {
        Toast.show({
            type: 'info',
            text1: title,
            text2: detail,
            ...baseProps
        })
    }
    return { error, success, info }
}