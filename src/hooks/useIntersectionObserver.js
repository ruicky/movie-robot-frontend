import { useState, useEffect, useMemo } from 'react';

export const useIntersectionObserver = (ref, options) => {
    const [entry, updateEntry] = useState({});
    const [node, setNode] = useState(null);

    const observer = useMemo(
        () =>
            new window.IntersectionObserver(([entry]) => updateEntry(entry), options),
        [options]
    );

    useEffect(() => {
        const { current: currentRef } = ref;
        setNode(currentRef);
    }, [ref]);

    useEffect(() => {
        if (observer && node) {
            observer.observe(node);

            return () => {
                observer.unobserve(node);
            };
        }
    }, [node, observer]);

    return entry;
}