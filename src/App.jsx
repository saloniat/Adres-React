import React, { useEffect, useLayoutEffect, useState } from "react";
import AppRouter from "./routes/AppRouter";
import { ToastContainer, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "rc-tooltip/assets/bootstrap.css";
import Loader from "./components/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { fetchToken } from "./redux/action/authAction";
import BackToTopArrow from "./components/common/BackToTopArrow";
import useNotifications from "./components/hooks/useNotifications";
import SyncReduxAcrossTabs from "./redux/SyncReduxAcrossTabs";

function App() {
    const dispatch = useDispatch();
    const [tokenVerified, setTokenVerified] = useState(null);
    const lang = useSelector((state) => state.translation.lang);
    useNotifications(); // Custom hook for handle notification service

    useLayoutEffect(() => {
        const oldLink = document.getElementById(`lang-css`);
        const link = document.createElement("link");
        link.id = `lang-css`;
        link.rel = "stylesheet";
        link.href = lang === "en" ? "/css/style.css" : "/css/style.ar.css";
        link.onload = () => {
            if (oldLink) document.head.removeChild(oldLink);
        };
        document.head.appendChild(link);
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === "en" ? "ltr" : "rtl";
    }, [lang]);

    useLayoutEffect(() => {
        Promise.all([dispatch(fetchToken())]).then(() => {
            setTokenVerified(true);
        });
        // eslint-disable-next-line
    }, []);

    if (tokenVerified === null) {
        return <Loader />;
    }

    return (
        <>
            <SyncReduxAcrossTabs />
            <ToastContainer
                theme="colored"
                position="top-right"
                transition={Flip}
                autoClose={5000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover={false}
                style={{ marginTop: 50 }}
            />
            <AppRouter />
            <Loader />
            <BackToTopArrow />
        </>
    );
}

export default App;
