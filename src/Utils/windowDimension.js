import { useState, useEffect, useCallback } from "react";
import { throttle } from "./memoization";

function getWindowDimensions() {
    const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
    return {
        windowWidth,
        windowHeight,
    };
}

export default function useWindowDimensions() {

    const [windowDimensions, setWindowDimensions] = useState(
        getWindowDimensions()
    );
    
    useEffect(() => {
        const handleResize = throttle(() => {
            setWindowDimensions(getWindowDimensions());
        }, 250);

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowDimensions;
}
