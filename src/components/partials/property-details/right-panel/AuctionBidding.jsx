import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import SecureProperty from "./SecureProperty";
import AuctionTimer from "./AuctionTimer";
import HighestBid from "./HighestBid";
import ComparableProperties from "./ComparableProperties";
import CustomButton from "./CustomButton";
import HelpSection from "./HelpSection";
import Shimmer from "../../../common/shimmer/Shimmer";
import SocketService from "../../../../Service/SocketService";
import PlaceBidModal from "./modals/PlaceBidModal";
import RegisterInterestModal from "./modals/RegisterInterestModal";
import VerifyAccountModal from "./modals/VerifyAccountModal";
import BidHistory from "./BidHistory";
import {
    ABUDHABICITYID,
    accountStatus,
    DOMAIN,
} from "../../../../utils/constants";
import useDidMountEffect from "../../../hooks/useDidMountEffect";
import { setShowPlaceBidModal } from "../../../../redux/slice/sellerSlice";
import { removeQueryParam } from "../../../../utils";
import useIPAddress from "../../../hooks/useIPAddress";
import { handleSiteLoader } from "../../../../redux/action/authAction";
import useTranslationHook from "../../../hooks/useTranslationHook";
import StartBuyingProcessModal from "../../../common/StartBuyingProcessModal";
import ForefitModal from "../../../common/ForefitModal";
import { handleContactUsModal } from "../../../../redux/slice/modalSlice";
import { createSlug, formatPrice } from "../../../../helpers";
import { toast } from "react-toastify";
const AuctionBidding = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const isSeller = useSelector((state) => state.profile.account);
    const { t } = useTranslationHook();
    const lang = useSelector((state) => state.translation.lang);

    const {
        id,
        id: property_id,
        property_auction_data,
        is_register_interest,
        is_auto_bid_enabled,
        reg_auto_bid_amount,
        min_bid_amount,
        reg_bid_amount: bid_amount,
        is_approved,
        registration_id,
        is_bid_transaction,
        reg_transaction_status,
        purchase_forefit_status,
        property_name,
        country,
        is_remember_interest,
        city,
        agent_id,
        property_for,
        property_status,
        property_setting,
    } = useSelector((state) => state.seller.property.propertyData);

    const [isPurchased, setIsPurchased] = useState(false);
    const [isForeFitted, setIsForeFitted] = useState(false);
    useEffect(() => {
        if (purchase_forefit_status) {
            setIsPurchased(purchase_forefit_status === 1);
            setIsForeFitted(purchase_forefit_status === 2);
        }
        //eslint-disable-next-line
    }, [purchase_forefit_status]);

    const { showPlaceBidModal } = useSelector((state) => state.seller.property);
    const { ip } = useIPAddress();
    const user = useSelector((state) => state.auth.user);
    const { isConnected } = useSelector((state) => state.socket);
    const [isRegisteredInterset, setIsRegisteredInterest] =
        useState(is_register_interest);

    const [biddingData, setBiddingData] = useState(null);
    const [auctionStatus, setAuctionStatus] = useState(null);
    const [showRegisterInterestModal, setShowRegisterInterestModal] =
        useState(false);
    const [showPopUp, setShowPopUp] = useState(true);
    const [accountVerifiedModal, setAccountVerifiedModal] = useState(false);
    const [showStartBuyingModal, setShowStartBuyingModal] = useState(false);
    const [showForefitModal, setShowForefitModal] = useState(false);
    const prevAuctionStatus = useRef(null);

    const auction_id = property_auction_data[0]?.id;
    const bid_increments = property_auction_data[0]?.bid_increments;
    const start_price = property_auction_data[0]?.start_price;
    const reserveAmount = biddingData?.reserve_amount;
    const highBidAmt = biddingData?.high_bid_amt;
    const isReserveMet = reserveAmount <= highBidAmt;
    const is_selected_highest_bid = biddingData?.is_selected_highest_bid;
    const offerer_user_id = biddingData?.offerer_user_id;
    const listing_status_name = biddingData?.listing_status_name;
    const showFinalHighestBidderMessage =
        parseInt(user?.user_id) === biddingData?.max_bidder_user_id &&
        isSeller === 0 &&
        (isReserveMet || is_selected_highest_bid) &&
        auctionStatus === 3;
    const syncEmitData = useMemo(
        () => ({
            property_id,
            user_id: user?.user_id || "",
            auction_id,
            domain_id: 3,
        }),
        [property_id, user, auction_id]
    );

    useEffect(() => {
        SocketService.send("checkBid", syncEmitData);
        SocketService.send("re-sync", syncEmitData);
        //eslint-disable-next-line
    }, [isPurchased, isForeFitted]);

    // Fetch auction bidding data and sync every 5 seconds
    useEffect(() => {
        if (!isConnected) return;

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
            setShowPopUp(
                !data?.my_max_bid_val ||
                    (data?.is_last_bid_retracted && is_approved === 2)
            );
            setBiddingData(data);
        });

        // if (auctionStatus == 3) return;

        // Sync data every 5 seconds
        const intervalId = setInterval(() => {
            SocketService.send("checkBid", syncEmitData);
        }, 5000);

        // First-time data sync
        SocketService.send("checkBid", syncEmitData);
        // Cleanup: Clear interval on unmount
        return () => {
            clearInterval(intervalId);
            // SocketService.off("checkBid", handleCheckBid);
        };
        //eslint-disable-next-line
    }, [isConnected, auctionStatus, syncEmitData]);
    if (auctionStatus === 3 && biddingData?.auction_status === 1) {
        SocketService.send("checkAuction", { domain_id: DOMAIN });
    }
    const handleAuctionStatus = (statusValue) => setAuctionStatus(statusValue);
    const handlePlaceBidClick = (e) => {
        e.stopPropagation();
        if (!user?.user_id) {
            navigate(
                `/sign-in?redirect=${encodeURIComponent(location.pathname)}`
            );
        } else {
            if (property_for == 2) {
                navigate(
                    `/live-feed/${createSlug(id, `${property_name} ${country}`)}`
                );
                return;
            }
            if (biddingData && biddingData?.auction_status === 2) {
                toast.info(
                    t(
                        "Auction has been stopped. No further bids will be accepted."
                    )
                );
                return;
            }
            if (
                (user?.user_account_verification ||
                    user?.is_account_verified) !== accountStatus?.success
            ) {
                setAccountVerifiedModal(true);
                return;
            }

            dispatch(setShowPlaceBidModal(true));
        }
    };

    const handleRegisterInterestClick = () => {
        if (!user?.user_id) {
            navigate(`/sign-in?redirect=${location.pathname}`);
        } else {
            setShowRegisterInterestModal(true);
        }
    };

    const isBiddingDataEmpty = useMemo(
        () => !biddingData || Object.keys(biddingData).length === 0,
        [biddingData]
    );

    useDidMountEffect(() => {
        if (
            (!biddingData?.is_last_bid_retracted && is_approved !== 2) ||
            !auctionStatus ||
            auctionStatus === 3 ||
            isBiddingDataEmpty ||
            !showPopUp ||
            !is_bid_transaction ||
            is_approved !== 2 ||
            !reg_transaction_status
        ) {
            return;
        }
        if (!isConnected) {
            dispatch(handleSiteLoader(true));
            return;
        }
        dispatch(handleSiteLoader(false));
        const bidType =
            is_auto_bid_enabled && reg_auto_bid_amount
                ? "setAutoBid"
                : "addNewBid";
        const bidData = {
            auction_id,
            bid_amount,
            domain_id: 3,
            property_id,
            registration_id,
            user_id: user?.user_id,
            bid_increment: bid_increments,
            ip_address: ip || "127.0.0.1",
            auto_bid_amount: reg_auto_bid_amount,
            min_bid_amount: parseInt(min_bid_amount ?? start_price),
        };
        if (reg_transaction_status === 34) {
            SocketService.send(bidType, bidData);
        } else if (reg_transaction_status === 4) {
            // Handle other status if needed
        }
    }, [isConnected, isBiddingDataEmpty, auctionStatus, showPopUp]);

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
    const isPropertyCreator = agent_id == user?.user_id;

    useEffect(() => {
        if (prevAuctionStatus.current === 2 && auctionStatus === 3) {
            SocketService.send("checkBid", syncEmitData);
        }
        prevAuctionStatus.current = auctionStatus;
        // eslint-disable-next-line
    }, [auctionStatus]);

    return (
        <div className="col-lg-4">
            <div className="sidebar">
                {!isPropertyCreator &&
                    auctionStatus === 1 &&
                    property_auction_data?.[0]?.sell_at_full_amount_status &&
                    property_auction_data?.[0]?.full_amount && (
                        <SecureProperty />
                    )}

                <h5>{t("Auction Details")}</h5>

                {((auctionStatus === 3 && biddingData?.closing_statuss_name) ||
                    String(offerer_user_id) === user?.user_id) && (
                    <CustomButton
                        label={
                            isForeFitted
                                ? t("Forfeited")
                                : t(
                                      biddingData?.closing_statuss_name ||
                                          listing_status_name
                                  )
                        }
                        className={isForeFitted ? "btn-lgtred" : "btn-lgtgreen"}
                        disabled={true}
                    />
                )}

                {biddingData ? (
                    <AuctionTimer
                        onStatusChange={handleAuctionStatus}
                        data={biddingData}
                    />
                ) : (
                    <Shimmer
                        type="rectangle"
                        width="100%"
                        height="20vh"
                        borderRadius="5%"
                    />
                )}

                <HighestBid
                    data={biddingData}
                    auctionStatus={auctionStatus}
                    isForeFitted={isForeFitted}
                />

                {auctionStatus !== 3 && Number(city) === ABUDHABICITYID && (
                    <ComparableProperties data={biddingData} />
                )}

                {!isPropertyCreator &&
                    isSeller === 0 &&
                    auctionStatus !== 3 &&
                    biddingData?.max_bidder_user_id ===
                        parseInt(user?.user_id) && (
                        <div className="leading-stripe success">
                            <i className="fa-solid fa-angles-up"></i>{" "}
                            {t("You’re Leading")}
                        </div>
                    )}

                {!isPropertyCreator &&
                    isSeller === 0 &&
                    auctionStatus !== 3 &&
                    user?.user_id &&
                    biddingData?.my_max_bid_val &&
                    biddingData?.max_bidder_user_id !==
                        parseInt(user?.user_id) && (
                        <div className="leading-stripe danger">
                            <i className="fa-solid fa-angles-down"></i>{" "}
                            {t("Out of the Lead")}
                        </div>
                    )}

                {!isPropertyCreator &&
                    isSeller === 0 &&
                    auctionStatus === 1 && (
                        <CustomButton
                            label="Register Interest"
                            className="btn-primary"
                            onClick={handleRegisterInterestClick}
                            disabled={isRegisteredInterset}
                        />
                    )}

                {!isPropertyCreator &&
                    isSeller === 0 &&
                    auctionStatus === 2 && (
                        <CustomButton
                            label={
                                biddingData?.my_max_bid_val
                                    ? t("Raise my bid")
                                    : t(
                                          property_for === 2
                                              ? "Join Auction"
                                              : "Place a bid"
                                      )
                            }
                            image="/img/raise-icon.svg"
                            className="btn btn-primary"
                            onClick={handlePlaceBidClick}
                        />
                    )}

                {showFinalHighestBidderMessage && (
                    <>
                        <CustomButton
                            onClick={handleStartBuyingClick}
                            label={t(
                                isPurchased ? "Purchase Requested" : "Proceed"
                            )}
                            className="btn-primary"
                            disabled={isPurchased || isForeFitted}
                        />
                        <CustomButton
                            onClick={handleForefitClick}
                            label={t(
                                isForeFitted ? "Forfeit Requested" : "Forfeit"
                            )}
                            parentClassName="mbottom"
                            className="btn-sky"
                            disabled={isPurchased || isForeFitted}
                        />
                    </>
                )}

                {((isSeller === 0 && !showFinalHighestBidderMessage) ||
                    (isSeller === 1 &&
                        auctionStatus === 3 &&
                        (isReserveMet || is_selected_highest_bid))) && (
                    <CustomButton
                        label="Contact Us"
                        parentClassName={
                            isSeller !== 1 &&
                            (!isReserveMet || !is_selected_highest_bid)
                                ? "mbottom"
                                : ""
                        }
                        className={`${isSeller ? "btn-primary" : "btn-white"} mbottom`}
                        onClick={() => dispatch(handleContactUsModal(true))}
                    />
                )}
                {/* {isSeller === 0 && auctionStatus !== 3 && <HelpSection />} */}
            </div>

            {isConnected && biddingData && auctionStatus !== 3 && (
                <PlaceBidModal
                    show={showPlaceBidModal}
                    onClose={() => dispatch(setShowPlaceBidModal(false))}
                    data={biddingData}
                    user={user}
                    auction_id={auction_id}
                />
            )}

            {auctionStatus === 1 && (
                <RegisterInterestModal
                    show={showRegisterInterestModal}
                    onClose={() => setShowRegisterInterestModal(false)}
                    property={id}
                    setIsRegisteredInterest={setIsRegisteredInterest}
                    rememberMeFlag={is_remember_interest}
                />
            )}

            <VerifyAccountModal
                show={accountVerifiedModal}
                onClose={() => setAccountVerifiedModal(false)}
            />

            <StartBuyingProcessModal
                show={showStartBuyingModal}
                onClose={() => setShowStartBuyingModal(false)}
                property={property_id}
                isPurchased={isPurchased}
                setIsPurchased={setIsPurchased}
                setIsForeFitted={setIsForeFitted}
                bidPrice={biddingData?.my_max_bid_val}
            />

            <ForefitModal
                show={showForefitModal}
                onClose={() => setShowForefitModal(false)}
                property={property_id}
                isForeFitted={isForeFitted}
                setIsPurchased={setIsPurchased}
                setIsForeFitted={setIsForeFitted}
                bidPrice={biddingData?.my_max_bid_val}
            />
            {user?.user_id && isSeller === 0 && (
                <BidHistory
                    propertyId={id}
                    auctionStatus={auctionStatus}
                    isBidder={biddingData?.my_max_bid_val}
                    start_date={biddingData?.start_date}
                    end_date={biddingData?.end_date}
                    show_reverse_not_met={
                        property_setting
                            ? property_setting?.show_reverse_not_met
                            : false
                    }
                    isReserveMet={isReserveMet}
                    isForeFitted={isForeFitted}
                />
            )}
        </div>
    );
};

export default AuctionBidding;
