import {useState, useEffect, useRef} from 'react';

export function useThrottle(value, delay=500) {
    const [throttleValue, setThrottleValue] = useState(value);
    const lastValue = useRef(0);
    useEffect(() => {
        const now = Date.now();
        if(now - lastValue.current >= delay) {
            setThrottleValue(value);
            lastValue.current = now;
        }
    }, [value,delay]);
    return throttleValue;
}