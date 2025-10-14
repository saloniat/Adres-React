import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ element, account }) => {
    const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
    const accountType = useSelector((state) => state.profile?.account);

    return isAuthenticated ? (
        account.includes(accountType) ? (
            element
        ) : (
            <Navigate to="/" />
        )
    ) : (
        <Navigate to="/" />
    );
};

export default PrivateRoute;
