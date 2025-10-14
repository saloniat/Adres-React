// SyncReduxAcrossTabs.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const syncChannel = new BroadcastChannel("redux_sync_channel");

function SyncReduxAcrossTabs() {
    const dispatch = useDispatch();

    useEffect(() => {
        syncChannel.onmessage = (event) => {
            const { action } = event.data;

            // Re-dispatch the received action, marked to avoid rebroadcasting
            dispatch({ ...action, _fromBroadcast: true });
        };

        return () => {
            syncChannel.close();
        };
    }, []);

    return null;
}

export default SyncReduxAcrossTabs;
