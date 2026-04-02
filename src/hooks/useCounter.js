import { useEffect, useState, useRef } from 'react'

function easeOutQuad(t) {
    return t * (2 - t);
}

export function useCounter(target, duration = 2000, start = false) {
    const [value, setValue] = useState(0);
    const startTimeRef = useRef(null);

    useEffect(() => {
        if (!start) return;

        let frameId;

        const animate = (time) => {
            if (!startTimeRef.current) {
                startTimeRef.current = time;
            }

            const progressRaw = Math.min((time - startTimeRef.current) / duration, 1);
            const progress = easeOutQuad(progressRaw);
            const current = Math.floor(progress * target);

            setValue(current);

            if (progress < 1) {
                frameId = requestAnimationFrame(animate);
            }
        }

        frameId = requestAnimationFrame(animate);
        return () => {
            cancelAnimationFrame(frameId);
        }
    }, [target, duration, start])

    return value;
}