import React, { useLayoutEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { formatPrice } from "../../../../helpers";
import { guessDateTime } from "../../../../utils/dateUtils";
import BuyNowModal from "./modals/BuyNowModal";
import useTranslationHook from "../../../hooks/useTranslationHook";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
    handleChat,
    handleSelectedUser,
    setIsChatInitiated,
    setSellerDetail,
} from "../../../../redux/slice/inboxSlice";
import { fetchPropertyOffersHistory } from "../../../../redux/action/bidHistoryAction";
import VerifyAccountModal from "./modals/VerifyAccountModal";
import { accountStatus } from "../../../../utils/constants";

const SecureProperty = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isSeller = useSelector((state) => state.profile.account);
    const { t } = useTranslationHook();

    const user = useSelector((state) => state.auth.user);
    let lang = useSelector((state) => state.translation.lang);
    const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

    const {
        property_auction_data,
        property_buy_now_status,
        listed_by,
        agent_id,
        id: propertyId,
        is_chat_initiated,
        buy_now_request,
    } = useSelector((state) => state.seller.property.propertyData);
    const [showBuyNowModal, setShowBuyNowModal] = useState(false);
    const [isBought, setIsBought] = useState(property_buy_now_status);
    const [accountVerifiedModal, setAccountVerifiedModal] = useState(false);


    useLayoutEffect(() => {
        dispatch(fetchPropertyOffersHistory(propertyId));
    }, [propertyId])

    useLayoutEffect(() => {
        if (!isAuthenticated) {
            toast.info(t("Please sign in to contact the seller."));
            navigate("/sign-in");
            return;
        }
        const queryParams = new URLSearchParams(location.search);
        const buyNow = queryParams.get('buy_now');
        if (buyNow === "true") {
            setIsBought(true);
            queryParams.delete('buy_now');
            navigate(
                {
                    pathname: location.pathname.endsWith('/')
                        ? location.pathname.slice(0, -1)
                        : location.pathname,
                    search: queryParams.toString() ? `?${queryParams.toString()}` : '',
                },
                { replace: true }
            )
            setShowBuyNowModal(true);
        }
    }, [isAuthenticated, location.search, location.pathname, navigate,])

    const handleSellerCotact = () => {
        if (!isAuthenticated) {
            toast.info(t("Please sign in to contact the seller."));
            navigate("/sign-in");
        } else {
            const sellerData = {
                name: listed_by?.first_name,
                property_id: propertyId,
                seller_id: agent_id,
                profile_image: listed_by?.profile_image,
                is_chat_initiated: is_chat_initiated,
            };
            dispatch(setSellerDetail(sellerData));
            if (!sellerData.is_chat_initiated) {
                dispatch(setIsChatInitiated(1));
            } else {
                dispatch(setIsChatInitiated(2));
            }
            dispatch(handleSelectedUser(""));
            dispatch(handleChat([]));
            navigate("/inbox");
        }
    };

    const handleBuyNow = (flag) => {
        // console.log("handleBuyNow called with flag:", flag);

        if (
            (user?.user_account_verification ||
                user?.is_account_verified) !== accountStatus?.success
        ) {
            setAccountVerifiedModal(true);
            return;
        }

        if (!isAuthenticated) {
            toast.info(t("Please sign in to contact the seller."));
            navigate("/sign-in");
        } else {
            setShowBuyNowModal(flag);
        }
    };

    return (
        <>
            <div className="secure-property">
                <h6>{t("Secure Your Property Now")}</h6>
                <p>
                    {t("Full price")}:{" "}
                    <strong>
                        {t("Amount", {
                            amount: formatPrice(
                                property_auction_data?.[0]?.full_amount,
                                lang
                            ),
                        })}
                    </strong>
                </p>
                <p>
                    {t("Deadline")}:{" "}
                    <strong>{`${t("Offer ends on", {
                        time: guessDateTime(
                            property_auction_data?.[0]?.start_date,
                            "MMM DD, YYYY",
                            0,
                            lang
                        ),
                    })}`}</strong>
                </p>
                <div className="buttons">
                    <button
                        className="btn btn-white btn-lg"
                        onClick={() => handleSellerCotact()}
                        disabled={
                            Number(user?.user_id) === agent_id ? true : false
                        }
                    >
                        {t("Contact Seller")}
                    </button>
                    <button
                        className="btn btn-primary btn-lg"
                        disabled={isBought}
                        onClick={() => handleBuyNow(true)}
                    >
                        {isBought ? t("Under Review") : t("Buy Now")}
                    </button>
                </div>
            </div>
            {user?.user_id && isSeller === 0 && (
                <BuyNowModal
                    show={showBuyNowModal}
                    onClose={() => handleBuyNow(false)}
                    isBought={isBought}
                    setIsBought={setIsBought}
                />
            )}
            {accountVerifiedModal &&
                <VerifyAccountModal
                    show={accountVerifiedModal}
                    onClose={() => setAccountVerifiedModal(false)}
                />
            }
        </>
    );
};

export default React.memo(SecureProperty);
