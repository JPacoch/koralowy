import { useState, useEffect, useCallback } from 'react';

// todo - swap API_BASE to convex endpoint
const API_BASE = '/api/palettes';

export function usePalettes() {
    const [palettes, setPalettes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPalettes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(API_BASE);
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setPalettes(data);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPalettes();
    }, [fetchPalettes]);

    const addPalette = useCallback(async (palette) => {
        const res = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(palette),
        });
        if (!res.ok) throw new Error('Failed to add palette');
        await fetchPalettes();
    }, [fetchPalettes]);

    const deletePalette = useCallback(async (index) => {
        const res = await fetch(`${API_BASE}/${index}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete palette');
        await fetchPalettes();
    }, [fetchPalettes]);

    const exportPalettes = useCallback(() => {
        const blob = new Blob([JSON.stringify(palettes, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'palettes.json';
        a.click();
        URL.revokeObjectURL(url);
    }, [palettes]);

    const importPalettes = useCallback(async (file) => {
        const text = await file.text();
        const data = JSON.parse(text);
        if (!Array.isArray(data)) throw new Error('Invalid palette file');
        const res = await fetch(API_BASE, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to import');
        await fetchPalettes();
    }, [fetchPalettes]);

    return { palettes, loading, error, addPalette, deletePalette, exportPalettes, importPalettes, refetch: fetchPalettes };
}
