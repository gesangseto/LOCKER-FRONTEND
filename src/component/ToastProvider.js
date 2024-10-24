import { createContext, useContext, useRef } from 'react';
import { Toast } from 'primereact/toast';

const ToastContext = createContext();

export function useToast() {
    return useContext(ToastContext);
}

export function ToastProvider({ children }) {
    const toastRef = useRef(null);

    const showToast = ({ type, message, options }) => {
        toastRef.current.show({ severity: type || 'success', summary: message, ...options });
    };

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            <Toast ref={toastRef} />
        </ToastContext.Provider>
    );
}
