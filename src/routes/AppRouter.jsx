import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import routes from "./Routes";
import PageNotFound from "../pages/PageNotFound";
import ScrollToTop from "../components/common/ScrollToTop";
import { useSelector } from "react-redux";

const AppRouter = () => {
    const user = useSelector((state) => state.auth.user);
    const accountType = useSelector((state) => state.profile.account);

    return (
        <Router>
            <ScrollToTop>
                <Routes>
                    {routes.commonRoutes.map(
                        ({ path, element, children, account }) =>
                            account.includes(accountType) ? (
                                <Route key={path} path={path} element={element}>
                                    {children &&
                                        children.map((childRoute) => (
                                            <Route
                                                key={childRoute.path}
                                                path={childRoute.path}
                                                element={childRoute.element}
                                            />
                                        ))}
                                </Route>
                            ) : (
                                <Route
                                    key={path}
                                    path={path}
                                    element={<Navigate to="/" replace />}
                                />
                            )
                    )}
                    {/* Render Public Routes */}
                    {routes.publicRoutes.map(({ path, element, children }) => (
                        <Route
                            key={path}
                            path={path}
                            element={<PublicRoute element={element} />}
                        >
                            {children &&
                                children.map((childRoute) => (
                                    <Route
                                        key={childRoute.path}
                                        path={childRoute.path}
                                        element={childRoute.element}
                                    />
                                ))}
                        </Route>
                    ))}

                    {/* Render Private Routes */}
                    {routes.privateRoutes.map(
                        ({ path, element, children, role, account }) =>
                            role &&
                            user?.user_type &&
                            !role.includes(user?.user_type) ? (
                                <Route
                                    key={path}
                                    path={"*"}
                                    element={<PageNotFound />}
                                />
                            ) : (
                                <Route
                                    key={path}
                                    path={path}
                                    element={
                                        <PrivateRoute
                                            element={element}
                                            account={account}
                                        />
                                    }
                                >
                                    {children &&
                                        children.map((childRoute) => (
                                            <Route
                                                key={childRoute.path}
                                                path={childRoute.path}
                                                element={childRoute.element}
                                            />
                                        ))}
                                </Route>
                            )
                    )}
                    <Route path={"*"} element={<PageNotFound />} />
                </Routes>
            </ScrollToTop>
        </Router>
    );
};

export default AppRouter;
