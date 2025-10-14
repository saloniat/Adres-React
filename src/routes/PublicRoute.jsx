import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ element }) => {
    const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
    const isProcessIncomplete = useSelector(
        (state) => state.auth?.user?.isProcessIncomplete
    );

    return isAuthenticated && !isProcessIncomplete ? (
        <Navigate to="/" />
    ) : (
        element
    );
};

export default PublicRoute;
