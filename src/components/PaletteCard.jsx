import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Trash2 } from 'lucide-react';

function Swatch({ color, onCopy }) {
    const handleCopy = useCallback((e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(color).catch(() => { });
        onCopy(color, color);
    }, [color, onCopy]);

    return (
        <div
            className="swatch"
            style={{ background: color }}
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

export default function PaletteCard({ palette, index, onDeleteRequest, onCopy }) {
    const handleDelete = useCallback((e) => {
        e.stopPropagation();
        onDeleteRequest(palette, index);
    }, [palette, index, onDeleteRequest]);

    return (
        <motion.article
            className="palette-card"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            layout
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
                        title="Delete palette"
                        aria-label="Delete palette"
                    >
                        <Trash2 size={13} />
                    </button>
                </div>
            </div>
        </motion.article>
    );
}
