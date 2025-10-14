import { toast } from "react-toastify";
import { config, configMultipart, errToast } from "../../utils";
import profileSlice, {
    handlePersonalInfoUpdate,
    handleWatchlistPageAction,
    removeFromWatchlist,
} from "../slice/profileSlice";
import authSlice from "../slice/authSlice";
import { handleSiteLoader } from "./authAction";
import { isCancel } from "axios";
import setAuthToken from "../../utils/axios/setAuthToken";
import { axiosAuth, axiosUnauth } from "../../utils/axios/axios";
import { sendNotification } from "../../components/notifications/NotificationService";
import { handleClearWatchListModal } from "../slice/modalSlice";

export const profileAction = profileSlice.actions;
export const authAction = authSlice.actions;

export const handleSwitchAccount = (val) => {
    return async (dispatch) => {
        dispatch(profileAction.handleSwitchAccount(val));
    };
};

export const handleTogglePlayBidSound = (val) => {
    return async (dispatch) => {
        dispatch(profileAction.handleTogglePlayBidSound(val));
    };
};

export const handleUploadImage = (file, filename) => {
    return async (dispatch) => {
        dispatch(handleSiteLoader(true));
        let response;
        try {
            const sasUrl = `https://${process.env.REACT_APP_AZURE_ACCOUNT_NAME_CLIENT}.blob.core.windows.net/${process.env.REACT_APP_AZURE_CONTAINER_NAME_CLIENT}`;

            const blobUrl = `${sasUrl}/${filename}?${process.env.REACT_APP_AZURE_SAS_TOKEN}`;

            response = await fetch(blobUrl, {
                method: "PUT",
                headers: {
                    "x-ms-blob-type": "BlockBlob",
                    "Content-Type": file.type,
                },

                body: file,
            });
            if (!response.ok || response.status !== 201) {
                toast.error(
                    sessionStorage.getItem("i18nextLng") === "en"
                        ? "Failed to upload image."
                        : "فشل تحميل الصورة."
                );
                dispatch(handleSiteLoader(false));
                return;
            }
            dispatch(handleSiteLoader(false));
            return response;
        } catch (err) {
            errToast(err);
            dispatch(handleSiteLoader(false));
        }
    };
};

export const handleFileUpload = (formData) => {
    return async (dispatch) => {
        dispatch(handleSiteLoader(true));
        try {
            const response = await axiosAuth.post(
                `/api-users/upload-file/`,
                formData,
                config
            );
            if (response.status === 200) {
                if (response.data.error === 0) {
                    dispatch(handleSiteLoader(false));
                } else {
                    toast.error(response.data.msg);
                }
            } else toast.error(response.data.msg);
            dispatch(handleSiteLoader(false));
            return response;
        } catch (err) {
            errToast(err);
            dispatch(handleSiteLoader(false));
        }
    };
};

export const getProfilePic = (formData, user) => {
    return async (dispatch) => {
        dispatch(handleSiteLoader(true));
        try {
            const { status, data } = await axiosAuth.post(
                `/api-users/profile-image/`,
                formData,
                config
            );
            if (status === 200) {
                if (data.error === 0) {
                    dispatch(
                        authAction.loadUser({
                            ...user,
                            profile_image: data.data?.profile_image,
                        })
                    );
                    dispatch(handleSiteLoader(false));
                } else toast.error(data.msg);
            } else toast.error(data.msg);
            dispatch(handleSiteLoader(false));

            return { status, data };
        } catch (err) {
            errToast(err);
            dispatch(handleSiteLoader(false));
        }
    };
};

export const handleProfileEdit = (val) => {
    return async (dispatch) => {
        dispatch(profileAction.handleProfileEdit(val));
    };
};

export const handleChangePwd = (formData, handleFormReset) => {
    return async (dispatch) => {
        dispatch(handleSiteLoader(true));
        try {
            const response = await axiosAuth.post(
                `/api-users/change-password/`,
                formData,
                config
            );
            if (response.status === 200) {
                if (response.data.error === 0) {
                    sendNotification();
                    toast.success(response.data?.msg);
                    handleFormReset();
                    dispatch(handleProfileEdit(false));
                } else {
                    toast.error(response.data?.msg);
                }
            } else toast.error(response.data?.msg);
            dispatch(handleSiteLoader(false));
            return response;
        } catch (err) {
            errToast(err);
            dispatch(handleSiteLoader(false));
        }
    };
};

export const handleProfileUpdate = (formData, isEmailChanged) => {
    return async (dispatch) => {
        dispatch(handleSiteLoader(true));
        try {
            const response = await axiosAuth.post(
                `/api-users/profile-update/`,
                formData,
                config
            );
            if (response.status === 200 && response.data.error === 0) {
                dispatch(
                    authAction.loadUser({
                        email: formData.email,
                        phone_no: formData.phone_no,
                        first_name: formData.first_name,
                        phone_country_code: formData.phone_country_code,
                        ...(formData.profile_image && {
                            profile_image: response.data.data.profile_image,
                        }),
                        ...(isEmailChanged && {
                            is_email_verified: false,
                        }),
                    })
                );
                sendNotification();
                dispatch(profileAction.handleProfileEdit(false));
                dispatch(handlePersonalInfoUpdate(true));
            } else toast.error(response.data?.msg);
            dispatch(handleSiteLoader(false));
            return response;
        } catch (err) {
            errToast(err);
            dispatch(handleSiteLoader(false));
        }
    };
};

export const sendEmailVerifyLink = (formData) => {
    return async (dispatch) => {
        dispatch(handleSiteLoader(true));
        try {
            const response = await axiosAuth.post(
                `/api-users/send-email-verification/`,
                formData,
                config
            );
            if (response.status === 200) {
                if (response.data.error === 0) {
                    toast.success(response.data?.msg);
                } else {
                    toast.error(response.data?.msg);
                }
            } else toast.error(response.data?.msg);
            dispatch(handleSiteLoader(false));
            return response;
        } catch (err) {
            errToast(err);
            dispatch(handleSiteLoader(false));
        }
    };
};

export const handleEmailVerification = (formData) => {
    return async (dispatch, getState) => {
        dispatch(handleSiteLoader(true));
        const state = getState();
        const access_token = state.auth.access_token;
        // if a user is login and then we set static token for api call then will rovoke the static api call and set access token in headers
        access_token && setAuthToken(process.env.REACT_APP_STATIC_TOKEN, false);
        try {
            const response = await axiosUnauth.post(
                `/api-users/email-verification/`,
                formData,
                config
            );
            access_token && setAuthToken(access_token, true);
            dispatch(handleSiteLoader(false));
            return response;
        } catch (err) {
            errToast(err);
            dispatch(handleSiteLoader(false));
        }
    };
};

export const uploadProfilePic = (formData) => {
    return async (dispatch) => {
        dispatch(handleSiteLoader(true));
        try {
            const response = await axiosAuth.post(
                `/api-users/upload-to-bucket/`,
                formData,
                configMultipart
            );
            if (response.status === 200 && response.data.error !== 0) {
                toast.error(response.data.msg);
            }
            dispatch(handleSiteLoader(false));
            return response;
        } catch (err) {
            errToast(err);
            dispatch(handleSiteLoader(false));
        }
    };
};

export const fetchFavouriteList = (formData, signal) => {
    return async () => {
        try {
            const response = await axiosAuth({
                url: "/api-property/favourite-property-listing/",
                method: "post",
                data: formData,
                ...config,
                ...(signal ? { signal } : {}),
            });
            return response.data;
        } catch (err) {
            if (!isCancel(err)) errToast(err);
        }
    };
};

// add view properties in watchlist
export const handleViewProperty = (formData) => {
    return async () => {
        try {
            const response = await axiosAuth({
                url: "/api-property/add-property-view/",
                method: "post",
                data: formData,
                ...config,
            });
            return response.data;
        } catch (err) {
            errToast(err);
        }
    };
};

//fetch  watchlist
export const fetchWatchList = (formData, signal) => {
    return async () => {
        try {
            const response = await axiosAuth({
                url: "/api-property/user-property-view/",
                method: "post",
                data: formData,
                ...config,
                ...(signal ? { signal } : {}),
            });
            return response.data;
        } catch (err) {
            if (!isCancel(err)) errToast(err);
        }
    };
};

// remove watchlist
export const handleDeleteFromWatchlist = (formData) => {
    return async (dispatch, getState) => {
        const state = getState();
        const selectedProperty = state.profile.watchlist.selectedProperty;
        try {
            const response = await axiosAuth.post(
                `/api-users/remove-watchlist/`,
                formData,
                config
            );
            if (response.status === 200 && response.data.error === 0) {
                if (Object.keys(formData).includes("clear_all")) {
                    dispatch(
                        handleWatchlistPageAction({
                            clearAllWatchlist: { data: [] },
                        })
                    );
                    toast.success(
                        sessionStorage.getItem("i18nextLng") === "en"
                            ? "Your watchlist has been cleared successfully!"
                            : "لقد تم مسح قائمة المراقبة الخاصة بك بنجاح!"
                    );
                } else {
                    dispatch(removeFromWatchlist(selectedProperty));
                    toast.success(
                        sessionStorage.getItem("i18nextLng") === "en"
                            ? "Removed from watchlist"
                            : "تمت إزالته من قائمة المراقبة"
                    );
                }
            } else {
                toast.error(response.data.msg);
            }
            return response;
        } catch (err) {
            errToast(err);
        } finally {
            dispatch(handleClearWatchListModal(false));
        }
    };
};

// verify otp while update profile
export const handleProfileOtpVerify = (formData) => {
    return async (dispatch, getState) => {
        const state = getState();
        const access_token = state.auth.access_token;
        access_token && setAuthToken(process.env.REACT_APP_STATIC_TOKEN, false);
        dispatch(handleSiteLoader(true));
        try {
            const response = await axiosUnauth.post(
                `/api-users/profile-verify-otp/`,
                formData,
                config
            );
            if (response.status === 200 && response.data.error !== 0) {
                toast.error(response.data.msg);
            }
            dispatch(handleSiteLoader(false));
            access_token && setAuthToken(access_token, true);
            return response;
        } catch (err) {
            errToast(err);
            dispatch(handleSiteLoader(false));
            access_token && setAuthToken(access_token, true);
        }
    };
};
