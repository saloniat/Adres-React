import axiosAuth, { axiosUnauth } from "./axios";

const setAuthToken = (token, auth) => {
    if (token) {
        // Adding header type for HTTP Request
        (auth ? axiosAuth : axiosUnauth).defaults.headers.common[
            "Authorization"
        ] = (auth ? "Bearer " : "Token ") + token;
    } else {
        delete (auth ? axiosAuth : axiosUnauth).defaults.headers.common[
            "Authorization"
        ];
    }
};

export default setAuthToken;
