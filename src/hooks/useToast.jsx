import { useState, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

function Toast({ id, hex, color, onDone }) {
    return (
        <motion.div
            className="toast"
            key={id}
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            onAnimationComplete={(def) => {
            }}
        >
            <span className="toast-color-dot" style={{ background: color }} />
            <span>Copied <strong>{hex}</strong></span>
        </motion.div>
    );
}

export function useToast() {
    const [toasts, setToasts] = useState([]);
    const timerRef = useRef({});

    const showToast = useCallback((hex, color) => {
        const id = Date.now();
        setToasts((prev) => [...prev.slice(-2), { id, hex, color }]);

        timerRef.current[id] = setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 1600);
    }, []);

    const ToastContainer = (
        <div className="toast-container">
            <AnimatePresence mode="popLayout">
                {toasts.map((t) => (
                    <Toast key={t.id} {...t} />
                ))}
            </AnimatePresence>
        </div>
    );

    return { showToast, ToastContainer };
}
