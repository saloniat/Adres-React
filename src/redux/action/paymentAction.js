import { toast } from "react-toastify";
import { config } from "../../utils";
import { axiosAuth } from "../../utils/axios/axios";
import { setLoading, setPaymentDetails } from "../slice/paymentSlice";
import { getSecretByName } from "./keyVaultAction";

export const initiatePurchase = (paymentData) => {
    return async (dispatch, getState) => {
        const { amount, property_id, payment_type } = paymentData || {};
        const state = getState();
        const { lang } = state.translation;
        const user_id = state.auth.user?.user_id;
        try {
            dispatch(setLoading(true));
            let response = await axiosAuth({
                url: `/api-payments/generate-payment-tokenid/`,
                method: "post",
                data: {
                    action: "4",
                    version: "1.0.1",
                    currencyCode: "784",
                    servicedata: [
                        {
                            amount,
                            noOfTransactions: "1",
                            serviceId: process.env.REACT_APP_IS_AZURE_VAULT
                                ? process.env.REACT_APP_MAGNATI_SERVICE_ID
                                : await dispatch(
                                    getSecretByName(
                                        "REACT-APP-MAGNATI-SERVICE-ID"
                                    )
                                ),
                            merchantId: process.env.REACT_APP_IS_AZURE_VAULT
                                ? process.env.REACT_APP_MAGNATI_MERCHANT_ID
                                : await dispatch(
                                    getSecretByName(
                                        "REACT-APP-MAGNATI-MERCHANT-ID"
                                    )
                                ),
                        },
                    ],
                    langid: lang,
                    id: process.env.REACT_APP_IS_AZURE_VAULT
                        ? process.env.REACT_APP_MAGNATI_ID
                        : await dispatch(
                            getSecretByName("REACT-APP-MAGNATI-ID")
                        ),
                    password: process.env.REACT_APP_IS_AZURE_VAULT
                        ? process.env.REACT_APP_MAGNATI_PASSWORD
                        : await dispatch(
                            getSecretByName("REACT-APP-MAGNATI-PASSWORD")
                        ),
                    errorURL: process.env.REACT_APP_IS_AZURE_VAULT
                        ? process.env.REACT_APP_MAGNATI_ERROR_URL
                        : await dispatch(
                            getSecretByName("REACT-APP-MAGNATI-ERROR-URL")
                        ),
                    responseURL: process.env.REACT_APP_IS_AZURE_VAULT
                        ? process.env.REACT_APP_MAGNATI_RESPONSE_URL
                        : await dispatch(
                            getSecretByName("REACT-APP-MAGNATI-RESPONSE-URL")
                        ),
                    correlationid: `auth_${Date.now()}_${user_id}`,
                    ...(user_id && { udf2: user_id }),
                    ...(property_id && { udf1: property_id }),
                    udf3: location.pathname.slice(1),
                    udf4: location.pathname.slice(1),
                    udf5: payment_type || ""
                },
                ...config,
            });
            const { data } = response?.data || {};
            const { status, tokenid, errorText } = data || {};
            if (response?.status === 200) {
                if (status === "1") {
                    const paymentId = tokenid.split(":")[0];
                    const urlStartIndex = tokenid.indexOf("https");
                    const paymentUrl = tokenid.substring(urlStartIndex);
                    dispatch(setPaymentDetails({ paymentUrl, paymentId }));
                    toast.info(
                        sessionStorage.getItem("i18nextLng") === "en"
                            ? "Please wait while we redirect you to the secure payment page. Do not refresh or close this window."
                            : "يرجى الانتظار ريثما يتم تحويلك إلى صفحة الدفع الآمنة. لا تقم بتحديث أو إغلاق هذه النافذة."
                    );
                } else toast.error(errorText);
            }
            return status;
        } catch (err) {
            console.log(err.message);
            toast.error(
                sessionStorage.getItem("i18nextLng") === "en"
                    ? "Payment initiation failed. Please try again later."
                    : "فشل بدء الدفع. يُرجى المحاولة لاحقًا."
            );
        } finally {
            dispatch(setLoading(false));
        }
    };
};

// export const transactionStatus = (transactionData) => {
//     return async (dispatch) => {
//         const { transid } = transactionData || {};
//         try {
//             dispatch(setLoading(true));
//             const response = await axiosUnauth({
//                 baseURL: `${process.env.REACT_APP_MAGNATI_API_URL}`,
//                 url: `/mpayinquiryTransaction`,
//                 method: "post",
//                 data: {
//                     transid,
//                     action: "8",
//                     udf5: "PaymentID",
//                     id: process.env.REACT_APP_MAGNATI_ID,
//                     password: process.env.REACT_APP_MAGNATI_PASSWORD,
//                 },
//                 ...config,
//             });
//             const { status, errorText } = response.data || {};
//             if (status === "APPROVED")
//                 toast.success(
//                     "Payment Successful! Your transaction has been completed."
//                 );
//             else toast.error(errorText);
//             return status;
//         } catch (err) {
//             toast.error("! Please try again.");
//         } finally {
//             dispatch(setLoading(false));
//         }
//     };
// };
