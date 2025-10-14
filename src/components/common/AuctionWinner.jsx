import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import SocketService from "../../Service/SocketService";
import { DOMAIN } from "../../utils/constants";
import StartBuyingProcessModal from "./StartBuyingProcessModal";
import ForefitModal from "./ForefitModal";
import { formatNumber } from "../../helpers";
import useTranslationHook from "../hooks/useTranslationHook";
const AuctionWinner = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [socketData, setSocketData] = useState(null);
    const user = useSelector((state) => state.auth.user);
    const { isConnected } = useSelector((state) => state.socket);
    const [showStartBuyingModal, setShowStartBuyingModal] = useState(false);
    const [showForefitModal, setShowForefitModal] = useState(false);
    const { t } = useTranslationHook();

    const propertyDetail = useSelector(
        (state) => state.seller.property.propertyData
    );
    const property_id = Number(propertyDetail?.id);
    const purchase_forefit_status = Number(
        propertyDetail?.purchase_forefit_status
    );
    const syncEmitData = useMemo(
        () => ({
            property_id: propertyDetail?.id,
            user_id: user?.user_id || "",
            auction_id: propertyDetail?.property_auction_data?.[0]?.id,
            domain_id: DOMAIN,
        }),
        [propertyDetail, user?.user_id]
    );

    const [isPurchased, setIsPurchased] = useState(false);
    const [isForeFitted, setIsForeFitted] = useState(false);
    useEffect(() => {
        if (purchase_forefit_status) {
            setIsPurchased(purchase_forefit_status === 1);
            setIsForeFitted(purchase_forefit_status === 2);
        }
    }, [purchase_forefit_status]);

    useEffect(() => {
        if (!isConnected || !property_id) return;
        SocketService.send("checkBid", syncEmitData);
        SocketService.on("re-sync", ({ data }) => {
            if (!data || !syncEmitData) return;
            const updatedData = {
                ...data,
                user_id: syncEmitData.user_id,
                property_id: syncEmitData.property_id || data.property_id,
                auction_id: syncEmitData.auction_id || data.auction_id,
            };
            SocketService.send("checkBid", updatedData);
        });
        // Listen for WebSocket data
        SocketService.on("checkBid", ({ code, error, data }) => {
            if (error) {
                console.error(error);
                return;
            }
            if (Number(data?.property_id) === property_id) setSocketData(data);
        });
    }, [property_id, isConnected, syncEmitData]);

    const handleStartBuyingClick = () => {
        if (!user?.user_id) {
            navigate(`/sign-in?redirect=${location.pathname}`);
        } else {
            setShowStartBuyingModal(true);
        }
    };
    const handleForefitClick = () => {
        if (!user?.user_id) {
            navigate(`/sign-in?redirect=${location.pathname}`);
        } else {
            setShowForefitModal(true);
        }
    };
    // high_bid_amt
    return (
        <section className="bidwon-wrap">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12">
                        <div className="bidwon-text">
                            <p>
                                <img src="img/hummer.png" alt="hummer" />
                            </p>
                            <h3>
                                {t("Congratulations, You Won!")}
                                <span>
                                    {t(
                                        "You've successfully won the auction. Get ready to finalize your new property!"
                                    )}
                                </span>
                            </h3>
                            <ul>
                                <li>
                                    <span>{t("Buyer")}</span>
                                    <span className="r-text">
                                        {socketData?.bidder_name || ""}
                                    </span>
                                </li>
                                <li>
                                    <span>{t("Bid Price")}</span>
                                    {socketData?.my_max_bid_val && (
                                        <span className="r-text">
                                            {formatNumber(
                                                socketData?.my_max_bid_val || 0
                                            )}
                                        </span>
                                    )}
                                </li>
                            </ul>
                            <div className="alert alert-primary">
                                <img
                                    src="img/info-icon.svg"
                                    alt="info"
                                    className="ml4"
                                />
                                {t(
                                    "You must act within 2-3 days; otherwise, you risk losing this auction, and the deposit will be deducted."
                                )}
                            </div>
                            <div className="d-flex justify-content-between">
                                <button
                                    onClick={() => navigate(`/`)}
                                    className="btn btn-sky"
                                >
                                    {t("Go Back to Homepage")}
                                </button>
                                <div>
                                    <button
                                        onClick={handleForefitClick}
                                        className="btn btn-sky mr-1"
                                        disabled={
                                            isPurchased ||
                                            isForeFitted ||
                                            !socketData
                                        }
                                    >
                                        {isForeFitted
                                            ? t("Forefit Requested")
                                            : t("Forefit")}
                                    </button>
                                    <button
                                        onClick={handleStartBuyingClick}
                                        className={`btn btn-green ${
                                            isPurchased ||
                                            isForeFitted ||
                                            !socketData
                                                ? "disabled"
                                                : ""
                                        }`}
                                        disabled={
                                            isPurchased ||
                                            isForeFitted ||
                                            !socketData
                                        }
                                    >
                                        {t(
                                            isPurchased
                                                ? "Purchase Process Requested"
                                                : "Start Purchase Process"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <StartBuyingProcessModal
                show={showStartBuyingModal}
                onClose={() => setShowStartBuyingModal(false)}
                property={propertyDetail?.id}
                isPurchased={isPurchased}
                setIsPurchased={setIsPurchased}
                setIsForeFitted={setIsForeFitted}
                bidPrice={socketData?.my_max_bid_val}
            />

            <ForefitModal
                show={showForefitModal}
                onClose={() => setShowForefitModal(false)}
                property={propertyDetail?.id}
                isForeFitted={isForeFitted}
                setIsPurchased={setIsPurchased}
                setIsForeFitted={setIsForeFitted}
                bidPrice={socketData?.my_max_bid_val}
            />
        </section>
    );
};

export default AuctionWinner;
