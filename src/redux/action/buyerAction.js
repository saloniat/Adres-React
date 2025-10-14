import { config, errToast } from "../../utils";
import { toast } from "react-toastify";
import buyerSlice from "../slice/buyerSlice";
import { isCancel } from "axios";
import { axiosAuth, axiosUnauth } from "../../utils/axios/axios";
import { handleSiteLoader } from "./authAction";
import { DOMAIN } from "../../utils/constants";

export const buyerAction = buyerSlice.actions;
export const handleDiscoverAuctions = (formData, signal) => {
    return async (dispatch, getState) => {
        const state = getState();
        const isAuthenticated = state.auth.isAuthenticated;
        try {
            const response = await (isAuthenticated ? axiosAuth : axiosUnauth)({
                url: "/api-property/front-property-listing/",
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

export const registerPropertyInterest = (property, remember_me = false) => {
    return async (dispatch, getState) => {
        handleSiteLoader(true);
        const state = getState();
        const user = state.auth.user?.user_id || null;
        try {
            const res = await axiosAuth.post(
                `/api-property/register-property-interest/`,
                { property, remember_me, user },
                config
            );
            const { data, status } = res;
            if (status === 200) {
                if (data.error === 0) {
                    toast.success(data.msg);
                    return true;
                } else {
                    errToast(data.msg);
                }
            } else errToast(data.msg);
            return false;
        } catch (err) {
            errToast(err);
        } finally {
            handleSiteLoader(false);
        }
    };
};

export const fetchWinningProperty = (page = 1, page_size = 2) => {
    return async (dispatch, getState) => {
        handleSiteLoader(true);
        const state = getState();
        const user = state.auth.user?.user_id || null;
        try {
            const res = await axiosAuth.post(
                `/api-property/buyer-won-listing/`,
                { user_id: user, site_id: DOMAIN, page, page_size },
                config
            );
            const { data, status } = res;
            if (status === 200) {
                if (data.error === 0) {
                    const total = data?.data?.total;
                    const wonData = data?.data?.data;
                    dispatch(
                        buyerAction.setWonAuctionData({ total, data: wonData })
                    );
                    return true;
                } else {
                    errToast(data.msg);
                }
            } else errToast(data.msg);
            return false;
        } catch (err) {
            errToast(err);
        } finally {
            handleSiteLoader(false);
        }
    };
};

export const retractBidBuyer = (property_id) => {
    return async (dispatch, getState) => {
        handleSiteLoader(true);
        const state = getState();
        const user_id = state.auth.user?.user_id || null;
        try {
            const { status, data } = await axiosAuth.post(
                `/api-bid/retract-bid-buyer/`,
                { property_id, user_id, site_id: DOMAIN },
                config
            );
            if (status === 200) {
                if (data.error === 0) {
                    toast.success(data.msg);
                } else {
                    errToast(data.msg);
                }
            } else errToast(data.msg);
            return { status, data };
        } catch (err) {
            errToast(err);
        } finally {
            handleSiteLoader(false);
        }
    };
};

export const fetchQuantaAPIData = (endPoint) => {
    return async (dispatch, getState) => {
        try {
            const state = getState(),
                propertyData = state?.seller?.property?.propertyData,
                isAuthenticated = state.auth.isAuthenticated;

            const formData = {
                endpoint: endPoint,
                quanta_data: {
                    municipality: propertyData?.municipality,
                    district: propertyData?.district,
                    community: propertyData?.community,
                    project: propertyData?.project_name,
                    propertyLayout: `${propertyData?.beds} beds`,
                    propertyType:
                        propertyData?.property_project_data?.property_types?.join(
                            " / "
                        ),
                },
            };

            const { status, data } = await (
                isAuthenticated ? axiosAuth : axiosUnauth
            )({
                url: `/api-property/get-quanta-data/`,
                method: "post",
                data: formData,
                ...config,
            });
            if (status === 200 || status === 201) {
                return data?.data;
            } else errToast(data.msg);
        } catch (err) {
            // if (!isCancel(err)) errToast(err);
            console.log("Error fetching Quanta API data:", err);
        }
    };
};

export const updateFailedPaymentStatus = (transactionId) => {
    return async (dispatch, getState) => {
        try {
            const state = getState(),
                isAuthenticated = state.auth.isAuthenticated,
                user = state.auth.user?.user_id || null;

            const formData = {
                transactionId,
                user_id: user,
                site_id: DOMAIN,
            };

            const { status, data } = await (
                isAuthenticated ? axiosAuth : axiosUnauth
            )({
                url: `/api-bid/update-failed-payment-status/`,
                method: "post",
                data: formData,
                ...config,
            });
            if (status === 200 || status === 201) {
                return data?.data;
            } else errToast(data.msg);
        } catch (err) {
            console.log("Error fetching Quanta API data:", err);
        }
    };
};
