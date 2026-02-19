import { motion, AnimatePresence } from 'framer-motion';
import PaletteCard from './PaletteCard';

const gridVariants = {
    visible: {
        transition: {
            staggerChildren: 0.06,
            delayChildren: 0.1,
        },
    },
};

const SkeletonCard = () => (
    <div className="skeleton-card">
        <div className="skeleton-strip" />
        <div className="skeleton-footer" />
    </div>
);

export default function PaletteGrid({ palettes, loading, onDelete, onCopy }) {
    if (loading) {
        return (
            <div className="palette-grid">
                {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        );
    }

    if (!palettes.length) {
        return (
            <div className="palette-grid">
                <div className="empty-state">
                    <div className="empty-state-icon">🎨</div>
                    <h3>No palettes yet</h3>
                    <p>Add your first color palette to get started.</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            className="palette-grid"
            variants={gridVariants}
            initial="hidden"
            animate="visible"
        >
            <AnimatePresence mode="sync">
                {palettes.map((palette, index) => (
                    <PaletteCard
                        key={`${palette.name}-${index}`}
                        palette={palette}
                        index={index}
                        onDelete={onDelete}
                        onCopy={onCopy}
                    />
                ))}
            </AnimatePresence>
        </motion.div>
    );
}
