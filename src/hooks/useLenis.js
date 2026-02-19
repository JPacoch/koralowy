import { useEffect, useRef } from 'react';

export function useLenis() {
    const lenisRef = useRef(null);

    useEffect(() => {
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) return;

        import('lenis').then(({ default: Lenis }) => {
            const lenis = new Lenis({
                lerp: 0.08,
                wheelMultiplier: 1.0,
                touchMultiplier: 1.0,
                smoothWheel: true,
            });

            lenisRef.current = lenis;

            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }

            requestAnimationFrame(raf);
        });

        return () => {
            if (lenisRef.current) {
                lenisRef.current.destroy();
                lenisRef.current = null;
            }
        };
    }, []);

    return lenisRef;
}
