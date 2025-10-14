import { useEffect, useCallback } from "react";
import SocketService from "../../Service/SocketService";
const useSocketListener = (events = [], callback) => {
    const stableCallback = useCallback(callback, []);

    useEffect(() => {
        // Attach event listeners
        events.forEach((event) => SocketService.on(event, stableCallback));

        return () => {
            // Cleanup event listeners on unmount
            events.forEach((event) => SocketService.off(event, stableCallback));
        };
    }, [events, stableCallback]);
};

export default useSocketListener;
