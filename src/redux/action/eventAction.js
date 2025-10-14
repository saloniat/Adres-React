import { toast } from "react-toastify";
import { config, errToast } from "../../utils";
import { axiosAuth, axiosUnauth } from "../../utils/axios/axios";
import { formatPrice } from "../../helpers";
import { handlePropertyEvent } from "../slice/eventSlice";
import { handleSiteLoader } from "./authAction";
const { error } = toast;

//fetch properties under events
export const fetchPropertyEvent = (formdata, signal = {}, lang = "en") => {
    return async (dispatch, getState) => {
        dispatch(handleSiteLoader(true));
        const state = getState();
        const isAuthenticated = state.auth.isAuthenticated;
        try {
            const res = await (isAuthenticated ? axiosAuth : axiosUnauth).post(
                `/api-property/property-event/`,
                formdata,
                config,
                signal
            );
            const { data, status } = res;
            if (status === 200 && data.error === 0) {
                if (data?.data?.data?.length > 0) {
                    const events = data?.data?.data.map((ele) => {
                        return {
                            id: ele.id,
                            title: ele.property_name,
                            country: ele.country,
                            start: ele.bidding_start,
                            end: ele.bidding_end,
                            price: formatPrice(ele.property_price, lang),
                            liked: ele.is_favourite,
                            property_image: ele?.property_image,
                            status: ele?.status,
                            title_ar: ele.property_name_ar,
                        };
                    });
                    dispatch(
                        handlePropertyEvent({
                            data: data.data.data,
                            total: data.data.total,
                            events,
                        })
                    );
                }
            } else error(data.msg);
            dispatch(handleSiteLoader(false));
            return res.data;
        } catch (err) {
            errToast(err);
            dispatch(handleSiteLoader(false));
        }
    };
};
