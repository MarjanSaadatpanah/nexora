// components/LazyLoad.jsx
import { useState, useEffect, useRef } from 'react';

const LazyLoad = ({ children, placeholderHeight = "400px" }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: '100px', // Load when 100px away from viewport
                threshold: 0.1,
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (observer) {
                observer.disconnect();
            }
        };
    }, []);

    return (
        <div ref={ref} style={{ minHeight: isVisible ? 'auto' : placeholderHeight }}>
            {isVisible ? children : (
                <div className="flex items-center justify-center h-full">
                    <div className="animate-pulse text-gray-500">Loading chart...</div>
                </div>
            )}
        </div>
    );
};

export default LazyLoad;