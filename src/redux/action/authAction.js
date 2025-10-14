import authSlice from "../slice/authSlice";
import { toast } from "react-toastify";
import { config, errToast } from "../../utils";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import { API_RESPONSE_MESSAGES } from "../../utils/constants";
import { handleSwitchAccount } from "./profileAction";
import { googleUserType } from "../../helpers";
import { axiosAuth, axiosUnauth } from "../../utils/axios/axios";
import TokenManager from "../../utils/axios/tokenManager";
import { toggleNotification } from "../slice/notificationSlice";
import setAuthToken from "../../utils/axios/setAuthToken";

export const authAction = authSlice.actions;

export const logout = () => {
    return async (dispatch, getState) => {
        dispatch(handleSiteLoader(true));
        const state = getState();
        const { access_token, user } = state.auth;
        axiosAuth.post("/api-users/logout/", { user_id: 3 });
        if (access_token && user?.user_id) {
            const res = await axiosAuth.post(
                `/api-users/revoke-token/`,
                { token: access_token, user_id: user.user_id },
                config
            );
            const { status } = res;

            if (status === 200) {
                // Clear tokens first to prevent any refresh attempts
                const tokenManager = TokenManager.getInstance();
                tokenManager.clearTokens();
                dispatch(authAction.logout());
                // window.location.reload();
            }
        }
        dispatch(handleSiteLoader(false));
    };
};

export const handleSiteLoader = (val) => {
    return async (dispatch) => {
        dispatch(authAction.handleSiteLoader(val));
    };
};

export const fetchToken = () => {
    return async (dispatch) => {
        try {
            // console.log("i am fetch TOken");

            const tokenManager = TokenManager.getInstance();
            const validToken = await tokenManager.getValidToken();
            // console.log("i am fetch TOken", validToken);

            if (validToken) {
                const loadUserData = {
                    site_id: localStorage.getItem("site_id"),
                    user_id: localStorage.getItem("user_id"),
                };
                // If we have a valid token, load the user
                await dispatch(loadUser(loadUserData));

                // Update Redux store with current tokens
                const { access_token, refresh_token } =
                    tokenManager.getTokenData() || {};
                dispatch(
                    authAction.loadToken({
                        access_token,
                        refresh_token,
                    })
                );
            } else {
                // No valid token available, logout
                dispatch(
                    authAction.loadToken({
                        access_token: "",
                        refresh_token: "",
                        isAuthenticated: false,
                    })
                );
                dispatch(authAction.logout());
            }
        } catch (error) {
            // console.log("test");
            // Token refresh failed or other error
            dispatch(
                authAction.loadToken({
                    access_token: "",
                    refresh_token: "",
                    isAuthenticated: false,
                })
            );
            dispatch(authAction.logout());
        }
    };
};

export const handleSignUpStep = (val) => {
    return async (dispatch) => {
        dispatch(authAction.handleSignUpStep(val));
    };
};

export const registerUser = (formData) => {
    return async (dispatch) => {
        dispatch(authAction.handleSiteLoader(true));
        try {
            const res = await axiosUnauth.post(
                `/api-users/subdomain-registration/`,
                formData,
                config
            );
            const { data, status } = res;
            if (status === 200) {
                if (data?.error === 0) {
                    const { login_data } = data?.data || {};
                    const {
                        auth_token: { access_token, refresh_token },
                        user_id,
                        site_id,
                        ...rest
                    } = login_data;
                    // Initialize TokenManager with the new tokens
                    const tokenManager = TokenManager.getInstance();
                    tokenManager.setTokens({
                        access_token,
                        refresh_token,
                        expiresAt: Date.now() + 10 * 60 * 1000, // 10 mins expiry
                    });
                    localStorage.setItem("access_token", access_token);
                    localStorage.setItem("refresh_token", refresh_token);
                    localStorage.setItem("user_id", user_id);
                    localStorage.setItem("site_id", site_id);
                    dispatch(
                        authAction.loadUser({
                            ...rest,
                            isProcessIncomplete: true,
                            user_id,
                            site_id,
                        })
                    );
                    dispatch(
                        authAction.loadToken({
                            access_token,
                            refresh_token,
                        })
                    );
                    dispatch(authAction.handleSignUpStep(4));
                    toast.success(data.msg);
                } else {
                    toast.error(data.msg);
                }
            } else toast.error(data.msg);
            dispatch(authAction.handleSiteLoader(false));
            return res.data;
        } catch (err) {
            errToast(err);
            dispatch(authAction.handleSiteLoader(false));
        }
    };
};

export const login = (formData, navigate, redirectUrl = "", t) => {
    const { rememberMe, ...rest } = formData;
    return async (dispatch) => {
        dispatch(authAction.handleSiteLoader(true));
        try {
            const res = await axiosUnauth.post(
                `/api-users/subdomain-login/`,
                rest,
                config
            );
            const { data, status } = res;
            if (status === 200 && data?.error === 0) {
                const {
                    auth_token: { access_token, refresh_token },
                    user_id,
                    site_id,
                    user_type,
                    allow_notifications,
                    ...rest
                } = data.data;

                if (user_type === 1) {
                    Cookies.get("email") && Cookies.remove("email");
                    Cookies.get("password") && Cookies.remove("password");
                    if (rememberMe) {
                        Cookies.set(
                            "email",
                            CryptoJS.AES.encrypt(
                                `${formData.email}`,
                                `${process.env.REACT_APP_ENCRYPT_DECRYPT_KEY}`
                            ).toString(),
                            { expires: 90 }
                        );
                        Cookies.set(
                            "password",
                            CryptoJS.AES.encrypt(
                                `${formData.password}`,
                                `${process.env.REACT_APP_ENCRYPT_DECRYPT_KEY}`
                            ).toString(),
                            { expires: 90 }
                        );

                        localStorage.setItem("access_token", access_token);
                        localStorage.setItem("refresh_token", refresh_token);
                        sessionStorage.setItem("Account", 0);
                        // setTimeout(() => navigate(redirectUrl || "/"));
                    } else {
                        sessionStorage.setItem("access_token", access_token);
                        sessionStorage.setItem("refresh_token", refresh_token);
                    }

                    // Initialize TokenManager with the new tokens
                    const tokenManager = TokenManager.getInstance();
                    tokenManager.setTokens({
                        access_token,
                        refresh_token,
                        expiresAt: Date.now() + 10 * 60 * 1000, // 10 mins expiry
                    });

                    localStorage.setItem("user_id", user_id);
                    localStorage.setItem("site_id", site_id);
                    toast.success(t(data.msg));
                    dispatch(toggleNotification(allow_notifications));
                    dispatch(
                        authAction.loadUser({
                            ...rest,
                            user_id,
                            site_id,
                            ...(redirectUrl && {
                                isProcessIncomplete: true,
                            }),
                        })
                    );
                    dispatch(
                        authAction.loadToken({ access_token, refresh_token })
                    );
                    sessionStorage.setItem(
                        "Account",
                        redirectUrl &&
                            redirectUrl.includes(
                                "/my-properties?createAuction=true"
                            )
                            ? 1
                            : 0
                    );
                    dispatch(
                        handleSwitchAccount(
                            redirectUrl &&
                                redirectUrl.includes(
                                    "/my-properties?createAuction=true"
                                )
                                ? 1
                                : 0
                        )
                    );
                    navigate(redirectUrl || "/");
                } else {
                    window.location.href = `${process.env.REACT_APP_ADMIN_URL}/admin/admin-login/?token=${access_token}`;
                    return;
                }
            } else {
                toast.error(t(data.msg));
            }
            return res.data;
        } catch (err) {
            errToast(err);
        } finally {
            dispatch(authAction.handleSiteLoader(false));
        }
    };
};

export const loadUser = (formData) => {
    return async (dispatch) => {
        dispatch(authAction.handleSiteLoader(true));
        const tokenManager = TokenManager.getInstance();

        try {
            const res = await axiosAuth.post(
                `/api-users/user-profile-detail/`,
                formData,
                config
            );
            const { data, status } = res;
            if (status === 200 && data.error === 0) {
                if (data.msg === "User not exist.") {
                    dispatch(logout());
                    return;
                }

                const { allow_notifications, ...rest } = data.data;
                const { access_token, refresh_token } =
                    tokenManager.getTokenData();
                dispatch(toggleNotification(allow_notifications));
                dispatch(authAction.loadToken({ access_token, refresh_token }));
                dispatch(authAction.loadUser({ ...rest, ...formData }));
                sessionStorage.getItem("Account") &&
                    dispatch(
                        handleSwitchAccount(
                            Number(sessionStorage.getItem("Account"))
                        )
                    );
            } else {
                toast.error(data.msg);
            }
            dispatch(authAction.handleSiteLoader(false));
            return res.data;
        } catch (err) {
            if (err.status === 401) {
                dispatch(logout());
                return;
            }
            errToast(err);
            dispatch(authAction.handleSiteLoader(false));
        }
    };
};

export const forgotPassword = (formData, t) => {
    return async (dispatch) => {
        dispatch(authAction.handleSiteLoader(true));
        try {
            const res = await axiosUnauth.post(
                `/api-users/subdomain-forgot-password/`,
                formData,
                config
            );
            const { data, status } = res;
            if (status === 200) {
                if (data?.error === 0) {
                    dispatch(authAction.resetLinkSend(true));
                    toast.success(t(data.msg));
                } else {
                    dispatch(handleNoRemainAttempt(true));
                    toast.info(t(data.msg));
                }
            } else toast.error(t(data.msg));
            dispatch(authAction.handleSiteLoader(false));
            return res.data;
        } catch (err) {
            errToast(err);
            dispatch(authAction.handleSiteLoader(false));
        }
    };
};

export const resetLinkSend = (val) => {
    return async (dispatch) => {
        dispatch(authAction.resetLinkSend(val));
    };
};

export const resetPassword = (formData, t) => {
    return async (dispatch) => {
        dispatch(authAction.handleSiteLoader(true));
        try {
            const res = await axiosUnauth.post(
                `/api-users/subdomain-reset-password/`,
                formData,
                config
            );
            const { data, status } = res;
            if (status === 200) {
                if (data?.error === 0) {
                    dispatch(authAction.resetPwdSucc(true));
                } else toast.error(t(data.msg));
            } else toast.error(t(data.msg));
            dispatch(authAction.handleSiteLoader(false));
            return res.data;
        } catch (err) {
            errToast(err);
            dispatch(authAction.handleSiteLoader(false));
        }
    };
};

export const resetPwdSucc = (val) => {
    return async (dispatch) => {
        dispatch(authAction.resetPwdSucc(val));
    };
};

export const socialLogin = (formData, navigate) => {
    return async (dispatch) => {
        dispatch(authAction.handleSiteLoader(true));
        try {
            const { data, status } = await axiosUnauth.post(
                `/api-users/social-signup/`,
                formData,
                config
            );
            const { user_id, status_id, signup_source, signup_step } =
                data?.data || {};
            if (status === 200) {
                if (status_id === 2) {
                    dispatch(handleSignUpStep(signup_step));
                    dispatch(
                        authAction.loadUser({
                            user_id,
                            status_id,
                            signup_source,
                        })
                    );
                    navigate("/sign-up");
                } else {
                    if (data?.error === 0) {
                        const {
                            auth_token: { access_token, refresh_token },
                            user_id,
                            site_id,
                            user_type,
                            allow_notifications,
                            ...rest
                        } = data.data;
                        // Initialize TokenManager with the new tokens
                        if (user_type === 1) {
                            const tokenManager = TokenManager.getInstance();
                            tokenManager.setTokens({
                                access_token,
                                refresh_token,
                                expiresAt: Date.now() + 10 * 60 * 1000, // 10 mins expiry
                            });
                            sessionStorage.setItem(
                                "access_token",
                                access_token || ""
                            );
                            sessionStorage.setItem(
                                "refresh_token",
                                refresh_token || ""
                            );
                            localStorage.setItem("user_id", user_id);
                            localStorage.setItem("site_id", site_id);
                            toast.success(data.msg);
                            navigate("/");
                            dispatch(toggleNotification(allow_notifications));
                            dispatch(
                                authAction.loadUser({
                                    ...rest,
                                    user_id,
                                    site_id,
                                })
                            );
                            dispatch(
                                authAction.loadToken({
                                    access_token,
                                    refresh_token,
                                })
                            );
                        } else {
                            window.location.href = `${process.env.REACT_APP_ADMIN_URL}/admin/admin-login/?token=${access_token}`;
                            return;
                        }
                    } else {
                        toast.error(data.msg);
                    }
                }
            } else {
                toast.error(data.msg);
            }
            return { data, status };
        } catch (err) {
            errToast(err);
        } finally {
            dispatch(authAction.handleSiteLoader(false));
        }
    };
};

//send otp through sms
export const sendOTP = (formData, t) => {
    return async (dispatch, getState) => {
        const {
            auth: { user },
        } = getState();
        const state = getState();
        const { phone_no: mobile_number, phone_country_code } = formData || {};
        if (Boolean(mobile_number?.startsWith(`+${phone_country_code}`))) {
            toast.error(
                t("Please enter your phone number without the country code.")
            );
            return;
        }
        dispatch(authAction.handleSiteLoader(true));
        const access_token = state.auth.access_token;
        const { signup_source, phone_no } = user || {};
        access_token && setAuthToken(process.env.REACT_APP_STATIC_TOKEN, false);
        try {
            const res = await axiosUnauth({
                method: "post",
                url:
                    [googleUserType].includes(signup_source) || phone_no
                        ? `/api-users/send-otp/`
                        : `/api-users/temp-registration/`,
                data: formData,
                ...config,
            });
            const { data, status } = res;
            if (status === 200) {
                if (data?.error === 0) {
                    dispatch(
                        authAction.handleTempUserId(data?.data?.temp_user_id)
                    );
                    if (
                        data?.data?.next_step === 3 &&
                        data.msg === "Mobile Verified."
                    ) {
                        toast.info(
                            t(
                                "Mobile verification already completed for this number."
                            )
                        );
                        dispatch(authAction.handleSignUpStep(3));
                        dispatch(authAction.handleSiteLoader(false));
                        return;
                    }
                    dispatch(authAction.handleSignUpStep(2));
                    if (phone_no && phone_no !== formData?.phone_no) {
                        toast.info(
                            t(
                                "OTP sent successfully. Please verify it to complete your profile update."
                            )
                        );
                    } else {
                        toast.success(t(API_RESPONSE_MESSAGES.OtpSent));
                    }
                } else {
                    toast.info(data.msg);
                    dispatch(handleNoRemainAttempt(true));
                }
            } else toast.error(data.msg);
            access_token && setAuthToken(access_token, true);
            dispatch(authAction.handleSiteLoader(false));
            return res.data;
        } catch (err) {
            errToast(err);
            dispatch(authAction.handleSiteLoader(false));
        }
    };
};

//verify the sms otp
export const verifyOTP = (formData, t) => {
    return async (dispatch, getState) => {
        const {
            auth: { user },
        } = getState();
        dispatch(authAction.handleSiteLoader(true));
        const { signup_source } = user || {};
        try {
            const res = await axiosUnauth({
                method: "post",
                url: [googleUserType].includes(signup_source)
                    ? `/api-users/verify-otp/`
                    : `/api-users/temp-verify-otp/`,
                data: formData,
                ...config,
            });
            const { data, status } = res;
            if (status === 200 && data?.error === 0) {
                dispatch(
                    authAction.handleSignUpStep(
                        [googleUserType].includes(signup_source) ? 4 : 3
                    )
                );
                toast.success(t(data.msg));
                dispatch(authAction.handleSiteLoader(false));
                return { status, data };
            } else toast.error(t(data.msg));
            dispatch(authAction.handleSiteLoader(false));

            return res.data;
        } catch (err) {
            errToast(err);
            dispatch(authAction.handleSiteLoader(false));
        }
    };
};

export const handleNoRemainAttempt = (val) => {
    return async (dispatch) => {
        dispatch(authAction.handleNoRemainAttempt(val));
    };
};

export const handlePaymentPage = (formData) => {
    return async (dispatch) => {
        dispatch(authAction.handleSiteLoader(true));
        try {
            const { status, data } = await axiosUnauth.post(
                `/api-users/user-payment-details/`,
                formData,
                config
            );
            dispatch(authAction.handleSiteLoader(false));
            return { status, data };
        } catch (err) {
            errToast(err);
            dispatch(authAction.handleSiteLoader(false));
        }
    };
};

export const handleUserActivation = (formData, navigate, redirectUrl = "") => {
    return async (dispatch) => {
        dispatch(authAction.handleSiteLoader(true));
        try {
            const { status, data } = await axiosUnauth.post(
                `/api-users/user-activation/`,
                formData,
                config
            );
            if (status === 200) {
                if (data?.data?.auth_token) {
                    const {
                        auth_token: { access_token, refresh_token },
                        user_id,
                        site_id,
                        ...rest
                    } = data.data;
                    const tokenManager = TokenManager.getInstance();
                    tokenManager.setTokens({
                        access_token,
                        refresh_token,
                        expiresAt: Date.now() + 10 * 60 * 1000, // 10 mins expiry
                    });
                    sessionStorage.setItem("access_token", access_token || "");
                    sessionStorage.setItem(
                        "refresh_token",
                        refresh_token || ""
                    );
                    localStorage.setItem("user_id", user_id);
                    localStorage.setItem("site_id", site_id);
                    toast.success(data.msg);
                    dispatch(
                        authAction.loadUser({ ...rest, user_id, site_id })
                    );
                    dispatch(
                        authAction.loadToken({
                            access_token,
                            refresh_token,
                        })
                    );
                    if (navigate) navigate(redirectUrl || "/");
                } else {
                    toast.error(data.msg);
                }
            } else {
                toast.error(data.msg);
            }
            dispatch(authAction.handleSiteLoader(false));
            return { status, data };
        } catch (err) {
            errToast(err);
            dispatch(authAction.handleSiteLoader(false));
        }
    };
};

export const handlePropertyStatistics = (formData) => {
    return async (dispatch) => {
        try {
            dispatch(authAction.setPropertyStatsLoading(true));
            const payload = formData ?? {};
            const response = await axiosUnauth.post(
                '/api-property/property-stat/',
                payload,
                config
            );
            const { status, data } = response || {};
            if (status === 200 && data?.error === 0) {
                dispatch(authAction.setPropertyStats(data.data))
            }
            dispatch(authAction.setPropertyStatsLoading(false));
            return { status, data };
        } catch (error) {
            errToast(error);
            dispatch(authAction.setPropertyStatsLoading(false));
        }
    };
};
