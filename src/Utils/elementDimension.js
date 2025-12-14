import { useState, useCallback, useEffect } from "react";
import { throttle } from "./memoization";

export default function useResize(myRef) {
    const [elWidth, setElWidth] = useState(0);
    const [elHeight, setElHeight] = useState(0);

    const handleResize = useCallback(() => {
        if (myRef.current) {
            setElWidth(myRef.current.offsetWidth);
            setElHeight(myRef.current.offsetHeight);
        }
    }, [myRef]);

    const throttledResize = useCallback(throttle(handleResize, 250), [handleResize]);

    useEffect(() => {
        // Get initial dimensions
        handleResize();
        
        window.addEventListener("load", throttledResize);
        window.addEventListener("resize", throttledResize);

        return () => {
            window.removeEventListener("load", throttledResize);
            window.removeEventListener("resize", throttledResize);
        };
    }, [handleResize, throttledResize]);

    return { elWidth, elHeight };
}
