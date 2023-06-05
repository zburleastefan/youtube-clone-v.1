import React from "react";

function useWindowSize() {
    const [windowSize, setWindowSize] = React.useState({
        width: 0,
        height: 0,
    });

    React.useEffect(() => {
        // only execute all the code below in client side
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }
        
        // Add event listener
        window.addEventListener("resize", handleResize);
        // Call handler right away so state gets updated with initial window size
        handleResize();
        
        // Remove event listener
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return windowSize;
}

export default useWindowSize;