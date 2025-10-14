import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
    access_token: "",
    refresh_token: "",
    siteLoader: false,
    signUpStep: 1,
    user: null,
    userLoading: true,
    tokenLoading: true,
    resetLinkSend: false,
    isResetPwdSucc: false,
    remainNoAttempt: false,
    tempUserId: "",
    signup_source: 0,
    propertyStats: {
        loading: true,
        auction_value: 0,
        sold_property_count: 0,
        total_property_count: 0,
        available_auction_count: 0,
    }
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loadToken: (state, action) => {
            const { access_token, refresh_token } = action.payload;
            return {
                ...state,
                access_token: access_token,
                refresh_token: refresh_token,
                isAuthenticated: true,
                ...("isAuthenticated" in action.payload && {
                    isAuthenticated: action.payload.isAuthenticated,
                }),
                tokenLoading: false,
            };
        },
        logout: () => {
            localStorage.removeItem("access_token");
            sessionStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            sessionStorage.removeItem("refresh_token");
            localStorage.removeItem("site_id");
            localStorage.removeItem("user_id");
            sessionStorage.removeItem("Account");
            return {
                ...initialState,
            };
        },
        handleSiteLoader: (state, action) => {
            return {
                ...state,
                siteLoader: action.payload,
            };
        },
        handleSignUpStep: (state, action) => {
            return {
                ...state,
                signUpStep: action.payload,
            };
        },
        registerUser: () => {
            return {
                ...initialState,
            };
        },
        loadUser: (state, { payload }) => {
            return {
                ...state,
                user: {
                    ...state.user,
                    ...payload,
                },
                userLoading: false,
            };
        },
        resetLinkSend: (state, action) => {
            return {
                ...state,
                isResetLinkSend: action.payload,
            };
        },
        resetPwdSucc: (state, action) => {
            return {
                ...state,
                isResetPwdSucc: action.payload,
            };
        },
        handleNoRemainAttempt: (state, action) => {
            return {
                ...state,
                remainNoAttempt: action.payload,
            };
        },
        handleTempUserId: (state, action) => {
            return {
                ...state,
                tempUserId: action.payload,
            };
        },
        handleTempUserId: (state, action) => {
            return {
                ...state,
                tempUserId: action.payload,
            };
        },
        handleUserLoading: (state, action) => {
            return {
                ...state,
                userLoading: action.payload,
            };
        },
        setPropertyStats: (state, action) => {
            return {
                ...state,
                propertyStats: {
                    ...state.propertyStats,
                    ...action.payload
                }
            }
        },
        setPropertyStatsLoading: (state, action) => {
            return {
                ...state,
                propertyStats: {
                    ...state.propertyStats,
                    loading: action.payload
                }
            }
        },
    },
});

export default authSlice;
