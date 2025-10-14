import { useEffect, useState } from "react";
import SocketService from "../../Service/SocketService";
import { DOMAIN } from "../../utils/constants";

const useSocketSync = (propertyData, user_id = null, emitterName = "sync") => {
    const [syncData, setSyncData] = useState([]);

    useEffect(() => {
        if (!propertyData || propertyData?.length === 0) {
            setSyncData([]);
            return;
        }
        const syncEmitData = propertyData?.map(
            ({ property_id, auction_id }) => ({
                property_id,
                domain_id: DOMAIN,
                auction_id,
                user_id,
            })
        );
        const sync = () => {
            SocketService.send("sync", { data: syncEmitData, emitterName });
        };

        sync(); // Initial call
        const intervalId = setInterval(sync, 5000);

        const handleSync = ({ error, data }) => {
            if (error) {
                console.error(error);
                return;
            }
            data = data.filter((item) => item !== null);
            setSyncData((prevData) =>
                prevData.length === data.length &&
                prevData.every((item, index) => item === data[index])
                    ? prevData
                    : [...data]
            );
        };

        // Listen for WebSocket data
        SocketService.on(emitterName, handleSync);

        return () => {
            clearInterval(intervalId);
            SocketService.off(emitterName, handleSync);
        };
    }, [propertyData, user_id, emitterName]);

    return syncData;
};

export default useSocketSync;
