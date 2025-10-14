// broadcastMiddleware.js
const channel = new BroadcastChannel("redux_sync_channel");

export const broadcastMiddleware = (store) => (next) => (action) => {
    const result = next(action);

    // Broadcast all actions that are not already broadcasted
    if (!action._fromBroadcast) {
        // Optional: Filter out Redux internal actions if needed (e.g., '@@redux/INIT')
        if (!action.type.startsWith("@@")) {
            channel.postMessage({
                action,
            });
        }
    }

    return result;
};
