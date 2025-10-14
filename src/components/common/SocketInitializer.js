import { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { initSocket, disconnectSocket } from "../../redux/action/socketAction";

const SocketInitializer = () => {
    const dispatch = useDispatch();
    const isConnected = useSelector((state) => state.socket.isConnected);
    const user_id = useSelector(
        (state) => state.auth.user?.user_id,
        shallowEqual
    );
    useEffect(() => {
        if (!isConnected) {
            dispatch(initSocket());
        }
        return () => {
            if (isConnected) {
                dispatch(disconnectSocket());
            }
        };
    }, [isConnected, user_id]);

    return null;
};

export default SocketInitializer;
