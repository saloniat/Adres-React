import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./datepicker.css";
import App from "./App";
import "./helpers/i18N/index";
import reportWebVitals from "./reportWebVitals";
import store from "./redux/store";
import { Provider } from "react-redux";
import SocketInitializer from "./components/common/SocketInitializer";
import "react-toastify/dist/ReactToastify.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { configureMoment } from "./utils/moment/momentConfig";

const state = store.getState();
const lang = state.translation.lang;
configureMoment(lang);
const root = ReactDOM.createRoot(document.getElementById("root"));
console.log = () => {};
root.render(
    // <React.StrictMode>
    <Provider store={store}>
        <SocketInitializer />
        <App />
    </Provider>
    // </React.StrictMode>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
