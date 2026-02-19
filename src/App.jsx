import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Download, Upload, Sun, Moon, Palette } from 'lucide-react';
import { usePalettes } from './hooks/usePalettes';
import { useLenis } from './hooks/useLenis';
import { useToast } from './hooks/useToast';
import PaletteGrid from './components/PaletteGrid';
import AddPaletteModal from './components/AddPaletteModal';

export default function App() {
    const [theme, setTheme] = useState('dark');
    const [modalOpen, setModalOpen] = useState(false);
    const { palettes, loading, error, addPalette, deletePalette, exportPalettes, importPalettes } = usePalettes();
    const { showToast, ToastContainer } = useToast();
    const importRef = useRef(null);

    useLenis();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
    }, []);

    const handleCopy = useCallback((hex, color) => {
        showToast(hex, color);
    }, [showToast]);

    const handleImport = useCallback(async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            await importPalettes(file);
            showToast('Import successful', '#4ade80');
        } catch {
            showToast('Import failed', '#f87272');
        }
        e.target.value = '';
    }, [importPalettes, showToast]);

    return (
        <div>
            {/* Header */}
            <header className="header">
                <a className="header-logo" href="/" aria-label="Koralowy home">
                    <div className="header-logo-mark">
                        <Palette size={16} color="#fff" />
                    </div>
                    <span className="header-logo-text">Koralowy</span>
                </a>

                <nav className="header-actions">
                    {/* Import hidden file input */}
                    <input
                        ref={importRef}
                        type="file"
                        accept=".json"
                        style={{ display: 'none' }}
                        onChange={handleImport}
                        id="import-file-input"
                    />

                    <motion.button
                        className="btn btn-ghost"
                        onClick={() => importRef.current?.click()}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        title="Import palettes"
                        aria-label="Import palettes from JSON"
                    >
                        <Upload size={14} />
                        <span>Import</span>
                    </motion.button>

                    <motion.button
                        className="btn btn-ghost"
                        onClick={exportPalettes}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        title="Export palettes"
                        aria-label="Export palettes to JSON"
                    >
                        <Download size={14} />
                        <span>Export</span>
                    </motion.button>

                    <motion.button
                        className="btn btn-primary"
                        onClick={() => setModalOpen(true)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                        aria-label="Add new palette"
                    >
                        <Plus size={16} />
                        <span>New Palette</span>
                    </motion.button>

                    <button
                        className="btn-icon"
                        onClick={toggleTheme}
                        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        title="Toggle theme"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.span
                                key={theme}
                                initial={{ opacity: 0, rotate: -30 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                exit={{ opacity: 0, rotate: 30 }}
                                transition={{ duration: 0.18 }}
                                style={{ display: 'flex' }}
                            >
                                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                            </motion.span>
                        </AnimatePresence>
                    </button>
                </nav>
            </header>

            {/* Main content */}
            <main className="page-wrapper">
                {/* Hero */}
                <motion.section
                    className="hero"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                >
                    <div className="hero-eyebrow">
                        <Palette size={11} />
                        Free Color Palettes
                    </div>
                    <h1 className="hero-title">
                        Beautiful colors,<br />beautifully organized.
                    </h1>
                    <p className="hero-subtitle">
                        Craft, collect, and share stunning color palettes.
                        Hover any swatch to preview and copy its hex code instantly.
                    </p>
                </motion.section>

                {/* Toolbar */}
                <motion.div
                    className="toolbar"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                >
                    <p className="toolbar-count">
                        {loading
                            ? 'Loading…'
                            : <><strong>{palettes.length}</strong> palette{palettes.length !== 1 ? 's' : ''}</>
                        }
                    </p>
                </motion.div>

                {/* Error state */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            padding: '16px 20px',
                            background: 'rgba(248, 114, 114, 0.12)',
                            border: '1px solid rgba(248, 114, 114, 0.3)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--danger)',
                            marginBottom: 24,
                            fontSize: '0.875rem',
                        }}
                    >
                        ⚠️ {error} — Make sure the API server is running (<code>npm run dev</code>).
                    </motion.div>
                )}

                {/* Grid */}
                <PaletteGrid
                    palettes={palettes}
                    loading={loading}
                    onDelete={deletePalette}
                    onCopy={handleCopy}
                />
            </main>

            {/* Add palette modal */}
            <AddPaletteModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onAdd={addPalette}
            />

            {/* Toast notifications */}
            {ToastContainer}
        </div>
    );
}
