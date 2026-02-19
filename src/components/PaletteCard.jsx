import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Trash2 } from 'lucide-react';

function getContrastColor(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.55 ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.9)';
}

function Swatch({ color, onCopy }) {
    const [hovered, setHovered] = useState(false);

    const handleCopy = useCallback((e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(color).catch(() => { });
        onCopy(color, color);
    }, [color, onCopy]);

    return (
        <div
            className="swatch"
            style={{ background: color }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <button
                className="swatch-copy-btn"
                onClick={handleCopy}
                title={`Copy ${color}`}
                aria-label={`Copy hex ${color}`}
            >
                <Copy size={11} />
            </button>

            <div className="swatch-tooltip">
                <span className="hex-display">{color.toUpperCase()}</span>
            </div>
        </div>
    );
}

const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 340, damping: 28 },
    },
};

export default function PaletteCard({ palette, index, onDelete, onCopy }) {
    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleDelete = useCallback((e) => {
        e.stopPropagation();
        if (confirmDelete) {
            onDelete(index);
        } else {
            setConfirmDelete(true);
            setTimeout(() => setConfirmDelete(false), 2000);
        }
    }, [confirmDelete, index, onDelete]);

    return (
        <motion.article
            className="palette-card"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            layout
            style={{ '--card-index': index }}
        >
            <div className="swatch-strip" aria-label={`${palette.name} color palette`}>
                {palette.colors.map((color, i) => (
                    <Swatch
                        key={`${color}-${i}`}
                        color={color}
                        onCopy={onCopy}
                    />
                ))}
            </div>

            <div className="card-footer">
                <span className="card-name" title={palette.name}>
                    {palette.name}
                </span>
                <div className="card-meta">
                    <span className="card-color-count">{palette.colors.length}</span>
                    <button
                        className="card-delete-btn"
                        onClick={handleDelete}
                        title={confirmDelete ? 'Click again to confirm' : 'Delete palette'}
                        aria-label="Delete palette"
                        style={confirmDelete ? { opacity: 1, color: 'var(--danger)' } : {}}
                    >
                        <Trash2 size={13} />
                    </button>
                </div>
            </div>
        </motion.article>
    );
}
