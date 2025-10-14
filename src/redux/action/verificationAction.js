import { toast } from "react-toastify";
import verificationSlice from "../slice/verificationSlice";
import { handleSiteLoader } from "./authAction";
import { configMultipart, errToast } from "../../utils";
import { sendNotification } from "../../components/notifications/NotificationService";
import { axiosAuth } from "../../utils/axios/axios";

export const verificationAction = verificationSlice.actions;

export const handleVerificationStep = (val) => {
    return async (dispatch) => {
        dispatch(verificationAction.handleVerificationStep(val));
    };
};
export const updateFileUploadStatus = (val) => {
    return async (dispatch) => {
        dispatch(verificationAction.updateFileUploadStatus(val));
    };
};
export const handleAccountStatus = (val) => {
    return async (dispatch) => {
        dispatch(verificationAction.handleAccountStatus(val));
    };
};

export const handleVerificationDocument = (formData) => {
    return async (dispatch) => {
        dispatch(handleSiteLoader(true));
        try {
            const response = await axiosAuth.post(
                `/api-users/account-verifications/`,
                formData,
                configMultipart
            );
            const { status, data } = response || {};
            if (status === 200 && data.error === 0) {
                sendNotification();
                toast.success(data.msg);
            } else toast.error(data.msg);
            dispatch(handleSiteLoader(false));
            return response;
        } catch (err) {
            errToast(err);
            dispatch(handleSiteLoader(false));
        }
    };
};
