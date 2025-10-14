import { toast } from "react-toastify";
import { config, errToast } from "../../utils";
import { handleSiteLoader } from "./authAction";
import bidHistorySlice from "../slice/bidHistorySlice";
import { axiosAuth } from "../../utils/axios/axios";
import { DOMAIN } from "../../utils/constants";
export const bidHistoryAction = bidHistorySlice.actions;
const { error } = toast;

export const fetchPropertyBiddersList = (
    property_id,
    page = 1,
    page_size = 10,
    isSeller = false
) => {
    return async (dispatch, getState) => {
        if (!property_id) {
            error("Provide valid PropertyId");
            return;
        }
        const state = getState();
        const user_id = state.auth.user?.user_id || null;

        try {
            if (!property_id) {
                error("Provide valid PropertyId");
                return;
            }
            const response = await axiosAuth.post(
                `/api-bid/auction-bidders/`,
                {
                    user_id,
                    property_id,
                    site_id: localStorage.getItem("site_id"),
                    page,
                    page_size,
                },
                config
            );
            const { data, status } = response;
            if (status === 200 && data.error === 0) {
                dispatch(
                    isSeller
                        ? bidHistoryAction.handleSellerBidderHistory({
                              data: data?.data?.data,
                              total: data?.data?.total,
                          })
                        : bidHistoryAction.handleBidders(data?.data)
                );
            } else error(data.msg);
        } catch (err) {
            errToast(err);
        }
    };
};

export const fetchPropertyBidsHistory = (
    property_id,
    page = 1,
    page_size = 10,
    isSeller = false
) => {
    return async (dispatch, getState) => {
        if (!property_id) {
            error("Provide valid PropertyId");
            return;
        }
        const state = getState();
        const user_id = state.auth.user?.user_id || null;
        dispatch(handleSiteLoader(true));
        try {
            const res = await axiosAuth.post(
                `api-bid/subdomain-bid-history/`,
                {
                    user_id,
                    property_id,
                    site_id: DOMAIN,
                    page,
                    page_size,
                },
                config
            );
            const { data, status } = res;
            if (status === 200 && data.error === 0) {
                dispatch(
                    isSeller
                        ? bidHistoryAction.handleSellerBidHistory({
                              data: data?.data?.new_data,
                              total: data?.data?.total,
                          })
                        : bidHistoryAction.handleBids(data?.data)
                );
            } else error(data.msg);
            return res.data;
        } catch (err) {
            errToast(err);
        } finally {
            dispatch(handleSiteLoader(false));
        }
    };
};

export const fetchPropertyOffersHistory = (
    property_id,
    page = 1,
    page_size = 10,
    isSeller = false
) => {
    return async (dispatch, getState) => {
        if (!property_id) {
            error("Provide valid PropertyId");
            return;
        }
        const state = getState();
        const user_id = state.auth.user?.user_id || null;

        try {
            if (!property_id) {
                error("Provide valid PropertyId");
                return;
            }
            const response = await axiosAuth.post(
                `/api-bid/auction-offers/`,
                {
                    user_id,
                    property_id,
                    isSeller,
                    site_id: localStorage.getItem("site_id"),
                    page,
                    page_size,
                },
                config
            );
            const { data, status } = response;
            if (status === 200 && data.error === 0) {
                dispatch(
                    isSeller
                        ? bidHistoryAction.handleSellerOffersHistory({
                              data: data?.data?.data,
                              total: data?.data?.total,
                          })
                        : bidHistoryAction.handleOffers(data?.data)
                );
            } else error(data.msg);
        } catch (err) {
            errToast(err);
        }
    };
};
