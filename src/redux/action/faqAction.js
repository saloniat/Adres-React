import { handleSiteLoader } from "./authAction";
import { axiosAuth, axiosUnauth } from "../../utils/axios/axios";
import { config, errToast } from "../../utils";
import { handleFaqData } from "../slice/faqSlice";

export const handleFaq = (formData) => {
    return async (dispatch, getState) => {
        dispatch(handleSiteLoader(true));
        const state = getState();
        const isAuthenticated = state.auth.isAuthenticated;

        try {
            const response = await (
                isAuthenticated ? axiosAuth : axiosUnauth
            ).post(`/api-faq/faq-listing/`, formData, config);
            if (response.status === 200 && response.data.error === 0) {
                dispatch(handleFaqData(response.data.data));
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
