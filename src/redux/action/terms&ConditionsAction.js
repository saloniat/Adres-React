import { toast } from "react-toastify";
import { config, errToast } from "../../utils";
import {
    setAboutUsData,
    setPrivacyPolicy,
    setTermsAndConditions,
} from "../slice/terms&ConditionsSlice";
import { handleSiteLoader } from "./authAction";
import { axiosAuth, axiosUnauth } from "../../utils/axios/axios";

export const handleTermsAndConditions = (formData) => {
    return async (dispatch, getState) => {
        dispatch(handleSiteLoader(true));
        const state = getState();
        const isAuthenticated = state.auth.isAuthenticated;

        try {
            const response = await (
                isAuthenticated ? axiosAuth : axiosUnauth
            ).post(`/api-cms/get-page/`, formData, config);
            if (response.status === 200 && response.data.error === 0) {
                if (formData.slug === "terms-and-conditions") {
                    dispatch(setTermsAndConditions(response.data?.data));
                } else if (formData.slug === "about-us") {
                    dispatch(setAboutUsData(response.data?.data));
                } else {
                    dispatch(setPrivacyPolicy(response.data?.data));
                }
                dispatch(handleSiteLoader(false));
            } else toast.error(response.data.msg);
            dispatch(handleSiteLoader(false));
            return response;
        } catch (err) {
            errToast(err);
            dispatch(handleSiteLoader(false));
        }
    };
};
