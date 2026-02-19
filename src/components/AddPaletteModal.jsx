import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus } from 'lucide-react';

const MIN_COLORS = 3;
const MAX_COLORS = 9;

const DEFAULT_COLORS = ['#8b6fff', '#c47fff', '#4ade80'];

function generateRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

export default function AddPaletteModal({ isOpen, onClose, onAdd }) {
    const [name, setName] = useState('');
    const [colors, setColors] = useState([...DEFAULT_COLORS]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);
    const nameInputRef = useRef(null);

    const handleClose = useCallback(() => {
        setName('');
        setColors([...DEFAULT_COLORS]);
        setError('');
        onClose();
    }, [onClose]);

    const handleColorChange = useCallback((index, value) => {
        setColors((prev) => {
            const next = [...prev];
            next[index] = value;
            return next;
        });
    }, []);

    const addColorSlot = useCallback(() => {
        if (colors.length >= MAX_COLORS) return;
        setColors((prev) => [...prev, generateRandomColor()]);
    }, [colors.length]);

    const removeColorSlot = useCallback((index) => {
        if (colors.length <= MIN_COLORS) return;
        setColors((prev) => prev.filter((_, i) => i !== index));
    }, [colors.length]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) { setError('Give your palette a name.'); return; }
        if (colors.length < MIN_COLORS) { setError(`Add at least ${MIN_COLORS} colors.`); return; }

        setLoading(true);
        setError('');
        try {
            await onAdd({ name: trimmed, colors });
            handleClose();
        } catch (err) {
            setError('Failed to save palette. Is the server running?');
        } finally {
            setLoading(false);
        }
    }, [name, colors, onAdd, handleClose]);

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.2 } },
        exit: { opacity: 0, transition: { duration: 0.18 } },
    };

    const panelVariants = {
        hidden: { opacity: 0, y: 48, scale: 0.96 },
        visible: {
            opacity: 1, y: 0, scale: 1,
            transition: { type: 'spring', stiffness: 380, damping: 30, delay: 0.04 },
        },
        exit: {
            opacity: 0, y: 32, scale: 0.96,
            transition: { duration: 0.15 },
        },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="modal-overlay"
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
                >
                    <motion.div
                        className="modal-panel"
                        variants={panelVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-title"
                    >
                        <div className="modal-header">
                            <h2 className="modal-title" id="modal-title">New Palette</h2>
                            <button className="modal-close" onClick={handleClose} aria-label="Close modal">
                                <X size={16} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="palette-name">Palette Name</label>
                                <input
                                    id="palette-name"
                                    ref={nameInputRef}
                                    className="form-input"
                                    type="text"
                                    placeholder="e.g. Misty Sunset"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    maxLength={48}
                                    autoFocus
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Colors
                                    <span className="color-slot-limit" style={{ marginLeft: 8 }}>
                                        {colors.length} / {MAX_COLORS}
                                    </span>
                                </label>

                                <div className="color-slots">
                                    <AnimatePresence mode="popLayout">
                                        {colors.map((color, i) => (
                                            <motion.div
                                                key={i}
                                                className="color-slot"
                                                initial={{ opacity: 0, scale: 0.7 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.7 }}
                                                transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                                                layout
                                            >
                                                <div
                                                    className="color-slot-swatch"
                                                    style={{ background: color }}
                                                >
                                                    <input
                                                        type="color"
                                                        value={color}
                                                        onChange={(e) => handleColorChange(i, e.target.value)}
                                                        aria-label={`Color ${i + 1}`}
                                                    />
                                                </div>
                                                <div className="color-slot-hex">{color.toUpperCase()}</div>
                                                {colors.length > MIN_COLORS && (
                                                    <button
                                                        type="button"
                                                        className="color-slot-remove"
                                                        onClick={() => removeColorSlot(i)}
                                                        aria-label={`Remove color ${i + 1}`}
                                                    >
                                                        <Minus size={9} />
                                                    </button>
                                                )}
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>

                                    {colors.length < MAX_COLORS && (
                                        <motion.button
                                            type="button"
                                            className="color-add-btn"
                                            onClick={addColorSlot}
                                            disabled={colors.length >= MAX_COLORS}
                                            title="Add color"
                                            aria-label="Add color slot"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Plus size={18} />
                                        </motion.button>
                                    )}
                                </div>

                                {/* Live preview strip */}
                                {colors.length > 0 && (
                                    <motion.div
                                        className="preview-strip"
                                        layout
                                        style={{ marginTop: 16 }}
                                    >
                                        {colors.map((color, i) => (
                                            <div
                                                key={i}
                                                className="preview-strip-color"
                                                style={{ background: color }}
                                            />
                                        ))}
                                    </motion.div>
                                )}
                            </div>

                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: 16 }}
                                >
                                    {error}
                                </motion.p>
                            )}

                            <div className="modal-footer">
                                <button type="button" className="btn btn-ghost" onClick={handleClose}>
                                    Cancel
                                </button>
                                <motion.button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                    whileHover={{ scale: loading ? 1 : 1.02 }}
                                    whileTap={{ scale: loading ? 1 : 0.97 }}
                                >
                                    {loading ? 'Saving…' : 'Add Palette'}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
