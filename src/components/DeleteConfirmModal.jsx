import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, X } from 'lucide-react';

export default function DeleteConfirmModal({ palette, onConfirm, onCancel }) {
    const isOpen = !!palette;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
                >
                    <motion.div
                        className="modal-panel"
                        style={{ maxWidth: 400 }}
                        initial={{ opacity: 0, y: 32, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 24, scale: 0.96 }}
                        transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="delete-dialog-title"
                    >
                        {/* Icon */}
                        <div style={{
                            width: 48, height: 48, borderRadius: 14,
                            background: 'rgba(248, 114, 114, 0.12)',
                            border: '1px solid rgba(248, 114, 114, 0.25)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: 20,
                        }}>
                            <Trash2 size={20} color="var(--danger)" />
                        </div>

                        <h2 id="delete-dialog-title" style={{
                            fontSize: '1.2rem', fontWeight: 800,
                            letterSpacing: '-0.02em', marginBottom: 8,
                        }}>
                            Delete palette?
                        </h2>

                        <p style={{
                            fontSize: '0.9rem', color: 'var(--text-secondary)',
                            lineHeight: 1.55, marginBottom: 28,
                        }}>
                            <strong style={{ color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                                {palette?.name}
                            </strong>{' '}
                            will be permanently removed. This cannot be undone.
                        </p>

                        {/* Color preview */}
                        {palette && (
                            <div style={{
                                display: 'flex', height: 36, borderRadius: 10,
                                overflow: 'hidden', marginBottom: 28,
                                border: '1px solid var(--border)',
                            }}>
                                {palette.colors.map((c, i) => (
                                    <div key={i} style={{ flex: 1, background: c }} />
                                ))}
                            </div>
                        )}

                        <div className="modal-footer" style={{ borderTop: '1px solid var(--border)', paddingTop: 20, marginTop: 0 }}>
                            <button className="btn btn-ghost" onClick={onCancel}>
                                Cancel
                            </button>
                            <motion.button
                                className="btn"
                                onClick={onConfirm}
                                style={{
                                    background: 'var(--danger)',
                                    color: '#fff',
                                    boxShadow: '0 0 20px rgba(248, 114, 114, 0.3)',
                                }}
                                whileHover={{ scale: 1.02, boxShadow: '0 0 28px rgba(248, 114, 114, 0.45)' }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <Trash2 size={14} />
                                Delete
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
