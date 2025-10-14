import React, {
    useEffect,
    useState,
    useMemo,
    useCallback,
    useRef,
} from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import useTranslationHook from "../../hooks/useTranslationHook";
import { formatPrice, createSlug } from "../../../helpers";
import SocketService from "../../../Service/SocketService";
import { ABUDHABICITYID, accountStatus, DOMAIN } from "../../../utils/constants";
import CardTimer from "../../common/CardTimer";
import VerifyAccountModal from "../../partials/property-details/right-panel/modals/VerifyAccountModal";
import PlaceBidModal from "../../partials/property-details/right-panel/modals/PlaceBidModal";
import { fetchPropertyBidsHistory } from "../../../redux/action/bidHistoryAction";
import useDidMountEffect from "../../hooks/useDidMountEffect";
import { handleSiteLoader } from "../../../redux/action/authAction";
import useIPAddress from "../../hooks/useIPAddress";
import { setShowPlaceBidModal } from "../../../redux/slice/sellerSlice";
import RegisterInterestModal from "../../partials/property-details/right-panel/modals/RegisterInterestModal";
import PaymentFailureModal from "../../partials/property-details/right-panel/modals/PaymentFailureModal";
import { handleTogglePlayBidSound } from "../../../redux/action/profileAction";
import ComparableProperties from "../../partials/property-details/right-panel/ComparableProperties";

const LiveFeedCard = () => {
    const { t } = useTranslationHook();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        draggable: true,
        cssEase: "linear",
        swipeToSlide: true,
        vertical: true,
        verticalSwiping: true,
    };

    let lang = useSelector((state) => state.translation.lang);
    const user = useSelector((state) => state.auth.user);
    const isSeller = useSelector((state) => state.profile.account);
    const isPlayBidSound = useSelector((state) => state.profile.isPlayBidSound);
    const { isConnected } = useSelector((state) => state.socket);
    const { showPlaceBidModal } = useSelector((state) => state.seller.property);
    const [liveData, setLiveData] = useState(null);
    const [bidHistory, setBidHistory] = useState([]);
    const [showPopUp, setShowPopUp] = useState(true);
    const [purchaseForefitStatus, setPurchaseForefitStatus] = useState(null);
    const [auctionStatus, setAuctionStatus] = useState(null);
    const [accountVerifiedModal, setAccountVerifiedModal] = useState(false);

    const prevAuctionStatus = useRef(null);

    const audioRef = useRef(null);
    const hasMounted = useRef(false);
    const intervalRef = useRef(null);

    const {
        id,
        id: property_id,
        property_auction_data,
        property_name,
        property_name_ar,
        property_type,
        construction_status_name,
        country,
        bid_count,
        is_auto_bid_enabled,
        reg_auto_bid_amount,
        min_bid_amount,
        reg_bid_amount: bid_amount,
        is_approved,
        registration_id,
        is_bid_transaction,
        reg_transaction_status,
        is_register_interest,
        is_remember_interest,
        payment_failed_status,
        payment_error_text,
        payment_failed_message,
        reg_transaction_id,
        city
    } = useSelector((state) => state.seller.property.propertyData || {});
    const [isRegisteredInterset, setIsRegisteredInterest] =
        useState(is_register_interest);

    const [showRegisterInterestModal, setShowRegisterInterestModal] =
        useState(false);
    const [showFailureModal, setShowFailureModal] = useState(false);

    useEffect(() => {
        setShowFailureModal(!!payment_failed_status);
    }, [payment_failed_status]);
    const auction_id = property_auction_data?.[0]?.id;
    const reserveAmount = liveData?.reserve_amount;
    const highBidAmt = liveData?.high_bid_amt;
    const isReserveMet = reserveAmount <= highBidAmt;
    const buyerMaxBidValue = liveData?.my_max_bid_val;

    const bid_increments = property_auction_data?.[0]?.bid_increments;
    const start_price = property_auction_data?.[0]?.start_price;
    const { ip } = useIPAddress();

    const showFinalHighestBidderMessage =
        Number(user?.user_id) === liveData?.max_bidder_user_id &&
        (isReserveMet || liveData?.is_selected_highest_bid) &&
        auctionStatus === 3;
    const syncEmitData = useMemo(
        () => ({
            property_id: id,
            user_id: user?.user_id || "",
            auction_id,
            domain_id: DOMAIN,
        }),
        [id, user?.user_id, auction_id]
    );

    const handleAuctionStatus = useCallback((statusValue) => {
        setAuctionStatus(statusValue);
    }, []);
    const handlePlaceBidClick = useCallback(
        (e) => {
            e.stopPropagation();
            if (!user?.user_id) {
                navigate(`/sign-in?redirect=${location.pathname}`);
            } else {
                if (
                    (user?.user_account_verification ||
                        user?.is_account_verified) !== accountStatus?.success
                ) {
                    setAccountVerifiedModal(true);
                    return;
                }

                dispatch(setShowPlaceBidModal(true));
            }
        },
        // eslint-disable-next-line
        [user, navigate]
    );

    useEffect(() => {
        setPurchaseForefitStatus(liveData?.purchase_forefit_status);
        // eslint-disable-next-line
    }, [liveData?.purchase_forefit_status]);

    useEffect(() => {
        if (is_register_interest) {
            setIsRegisteredInterest(is_register_interest);
        }
        // eslint-disable-next-line
    }, [is_register_interest]);

    // Fetch auction bidding data and sync every 5 seconds
    useEffect(() => {
        if (!isConnected || auctionStatus == 3) return;
        const fetchBidData = () => SocketService.send("checkBid", syncEmitData);
        fetchBidData();
        intervalRef.current = setInterval(fetchBidData, 5000);
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

        const handleCheckBid = ({ error, data }) => {
            if (error) return;
            if (data?.property_id === id) {
                setShowPopUp(
                    !data?.my_max_bid_val ||
                    (data?.is_last_bid_retracted && is_approved === 2)
                );
                setLiveData(data);
            }
        };
        // Listen for WebSocket data
        SocketService.on("checkBid", handleCheckBid);

        // Cleanup: Clear interval on unmount
        return () => {
            clearInterval(intervalRef.current);
        };
        // eslint-disable-next-line
    }, [isConnected, auctionStatus, syncEmitData]);

    useEffect(() => {
        if (property_id && user?.user_id)
            dispatch(fetchPropertyBidsHistory(property_id)).then((data) => {
                if (data?.error) return console.log(data?.error);
                setBidHistory(data?.data?.new_data);
            });
        // eslint-disable-next-line
    }, [id, user?.user_id]);

    useEffect(() => {
        if (!bidHistory || !highBidAmt) return;
        const latestBid = bidHistory[0]?.max_bid;

        if (
            property_id &&
            // user?.user_id &&
            Number(highBidAmt) !== Number(latestBid)
        ) {
            dispatch(fetchPropertyBidsHistory(property_id)).then((data) => {
                if (data?.error) return console.log(data?.error);
                setBidHistory(data?.data?.new_data);
            });
            if (
                hasMounted.current &&
                // liveData?.my_max_bid_val &&
                isPlayBidSound
            ) {
                playSound();
            }
            hasMounted.current = true;
        }
        // eslint-disable-next-line
    }, [highBidAmt]);

    const isLiveDataEmpty = useMemo(
        () => !liveData || Object.keys(liveData).length === 0,
        [liveData]
    );

    useDidMountEffect(() => {
        if (
            (!liveData?.is_last_bid_retracted && is_approved !== 2) ||
            !auctionStatus ||
            auctionStatus === 3 ||
            isLiveDataEmpty ||
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
            property_id: id,
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
    }, [isConnected, isLiveDataEmpty, auctionStatus, showPopUp]);

    const playSound = () => {
        if (audioRef.current) {
            audioRef.current.play().catch((error) => {
                console.log("Error playing audio:", error);
            });
        }
    };

    const handleRegisterInterestClick = () => {
        if (!user?.user_id) {
            navigate(`/sign-in?redirect=${location.pathname}`);
        } else {
            setShowRegisterInterestModal(true);
        }
    };

    useEffect(() => {
        if (
            liveData?.my_max_bid_val &&
            liveData?.max_bidder_user_id !== parseInt(user?.user_id) &&
            prevAuctionStatus.current === 2 &&
            auctionStatus === 3
        ) {
            navigate(`/close-live-outbid`);
        }
        prevAuctionStatus.current = auctionStatus;
        // eslint-disable-next-line
    }, [auctionStatus]);

    return (
        <section className="live-auction-wrap">
            <div className="container">
                <div className="row">
                    <div
                        className="col-lg-12 wow fadeInUp"
                        data-wow-delay="0.5s"
                    >
                        <ul className="bids-list">
                            <li>
                                <figure>
                                    <img
                                        className="slide-fixed"
                                        src="/img/trans-3x2.png"
                                        alt=""
                                    />
                                    <img
                                        className="slide-img"
                                        src="/img/discover-pic.jpg"
                                        alt="Dicover Pic"
                                    />

                                    <div className="top">
                                        <div className="status-info">
                                            {auctionStatus !== 1 && (
                                                <span className="total-bid">
                                                    {t(
                                                        "discover card total bids",
                                                        {
                                                            totalBids:
                                                                liveData?.bid_count ||
                                                                bid_count,
                                                        }
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                        {liveData?.bid_count > 0 && (
                                            <div className="like-btn">
                                                <button
                                                    onClick={() =>
                                                        dispatch(
                                                            handleTogglePlayBidSound(
                                                                !isPlayBidSound
                                                            )
                                                        )
                                                    }
                                                >
                                                    <img
                                                        src={
                                                            isPlayBidSound
                                                                ? "/img/unmute-icon.svg"
                                                                : "/img/mute-icon.svg"
                                                        }
                                                        alt=""
                                                    />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    {bidHistory?.length > 0 && (
                                        <>
                                            <div className="top-bids">
                                                <h6>{t("Top Bid")}</h6>
                                                <ul className="auction-slider">
                                                    <Slider {...settings}>
                                                        {bidHistory
                                                            // ?.slice(0, 100)
                                                            ?.map(
                                                                (
                                                                    bid,
                                                                    index
                                                                ) => {
                                                                    const HeadingTag = `h${Math.min(index + 2, 5)}`;

                                                                    return (
                                                                        <li
                                                                            key={
                                                                                index
                                                                            }
                                                                            className={
                                                                                index ===
                                                                                    0
                                                                                    ? "active"
                                                                                    : ""
                                                                            }
                                                                        >
                                                                            <HeadingTag>
                                                                                {buyerMaxBidValue ==
                                                                                    bid.start_bid && (
                                                                                        <span className="icon">
                                                                                            <img
                                                                                                src="/img/liveauctionbid.png"
                                                                                                alt=""
                                                                                            />
                                                                                        </span>
                                                                                    )}
                                                                                <span>
                                                                                    {t(
                                                                                        "Amount",
                                                                                        {
                                                                                            amount: formatPrice(
                                                                                                bid.start_bid,
                                                                                                lang
                                                                                            ),
                                                                                        }
                                                                                    )}
                                                                                </span>
                                                                                <span className="blur"></span>
                                                                            </HeadingTag>
                                                                        </li>
                                                                    );
                                                                }
                                                            )}
                                                    </Slider>
                                                </ul>
                                            </div>
                                        </>
                                    )}
                                </figure>
                                <figcaption>
                                    <h3>
                                        {t(
                                            lang === "en"
                                                ? property_name
                                                : property_name_ar || ""
                                        )}
                                    </h3>
                                    {liveData && (
                                        <CardTimer
                                            data={liveData}
                                            onStatusChange={handleAuctionStatus}
                                            isLiveCard={true}
                                        />
                                    )}
                                    {/* <div className="bottom">
                                        <div className="block">
                                            <span className="text">
                                                {t(
                                                    "Current comparable properties"
                                                )}
                                            </span>
                                            <span className="text-rgt green-text">
                                                {t("Less", {
                                                    less: 5,
                                                })}
                                            </span>
                                        </div>
                                    </div> */}

                                    {auctionStatus !== 3 && Number(city) === ABUDHABICITYID && (
                                        <ComparableProperties data={liveData} />
                                    )}

                                    <div className="bottom last">
                                        <div className="block">
                                            <span className="text">
                                                {t("Minimum price")}
                                            </span>
                                            <span className="text-rgt">
                                                {t("Amount", {
                                                    amount: `${formatPrice(
                                                        Number(
                                                            start_price || 0
                                                        ),
                                                        lang
                                                    )}`,
                                                })}
                                            </span>
                                        </div>
                                        <div className="block">
                                            <span className="text-left">
                                                {t(`${property_type || ""}`)}
                                                {construction_status_name
                                                    ? ` | `
                                                    : ""}
                                                {t(
                                                    `${construction_status_name || ""}`
                                                )}
                                            </span>
                                            <Link
                                                to={`/property/detail/${createSlug(id || "", `${property_name || ""} ${country || ""}`)}`}
                                            >
                                                <button className="p-link">
                                                    {t("Property Details")}{" "}
                                                    <img
                                                        src="/img/arrow-right.svg"
                                                        alt=""
                                                    />
                                                </button>
                                            </Link>
                                        </div>
                                    </div>

                                    {isSeller === 0 &&
                                        buyerMaxBidValue &&
                                        auctionStatus !== 3 &&
                                        liveData && (
                                            <div className="msg-status">
                                                <div
                                                    className={`msg ${liveData?.max_bidder_user_id === parseInt(user?.user_id) ? "success-msg" : "danger-msg"}`}
                                                >
                                                    <i
                                                        className={`fa-solid ${liveData?.max_bidder_user_id === parseInt(user?.user_id) ? "fa-angles-up" : "fa-angles-down"} mr4`}
                                                    ></i>{" "}
                                                    {t(
                                                        liveData?.max_bidder_user_id ===
                                                            parseInt(
                                                                user?.user_id
                                                            )
                                                            ? "You’re Leading"
                                                            : "Out of the Lead"
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                    {isSeller === 0 &&
                                        showFinalHighestBidderMessage && (
                                            <div className="msg-status">
                                                <div className="msg success-msg">
                                                    {purchaseForefitStatus === 1
                                                        ? t(
                                                            "Sold! Your highest bid won the property. Our representative will contact you to proceed."
                                                        )
                                                        : t(
                                                            "You won the highest bid! 🥳"
                                                        )}
                                                </div>
                                            </div>
                                        )}

                                    {auctionStatus == 3 &&
                                        isSeller === 0 &&
                                        buyerMaxBidValue &&
                                        !showFinalHighestBidderMessage && (
                                            <div className="msg-status">
                                                <div
                                                    className={`msg ${liveData?.closing_status_id == 9 ? "success-msg" : "danger-msg"}`}
                                                >
                                                    {liveData?.closing_statuss_name ||
                                                        t(
                                                            "Auction is closed and the property is pending review."
                                                        )}
                                                </div>
                                            </div>
                                        )}

                                    <div className="bid-btn">
                                        {showFinalHighestBidderMessage ? (
                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/auction-winner/${createSlug(id || "", `${property_name || ""} ${country || ""}`)}`
                                                    )
                                                }
                                                className="btn btn-primary btn-md btn-full"
                                            >
                                                {t("Start Purchase Process")}
                                            </button>
                                        ) : auctionStatus === 1 ? (
                                            <button
                                                className="btn btn-primary btn-md btn-full"
                                                onClick={
                                                    handleRegisterInterestClick
                                                }
                                                disabled={isRegisteredInterset}
                                            >
                                                {t("Register Interest")}
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-primary btn-md btn-full"
                                                disabled={auctionStatus !== 2}
                                                onClick={handlePlaceBidClick}
                                            >
                                                <img
                                                    src="/img/raise-icon.svg"
                                                    alt=""
                                                    className="mr4"
                                                />{" "}
                                                {t("Bid Now")}
                                            </button>
                                        )}
                                    </div>
                                </figcaption>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            {/* eslint-disable jsx-a11y/media-has-caption */}
            <audio
                ref={audioRef}
                src="/mp3/bid-alert.mp3"
                aria-label="Alert Sound"
                aria-hidden="true"
            />
            {/* eslint-enable jsx-a11y/media-has-caption */}

            {isConnected && liveData && auctionStatus !== 3 && (
                <PlaceBidModal
                    show={showPlaceBidModal}
                    onClose={() => dispatch(setShowPlaceBidModal(false))}
                    data={liveData}
                    user={user}
                    auction_id={auction_id}
                />
            )}
            <VerifyAccountModal
                show={accountVerifiedModal}
                onClose={() => setAccountVerifiedModal(false)}
            />
            {auctionStatus === 1 && (
                <RegisterInterestModal
                    show={showRegisterInterestModal}
                    onClose={() => setShowRegisterInterestModal(false)}
                    property={id}
                    setIsRegisteredInterest={setIsRegisteredInterest}
                    rememberMeFlag={is_remember_interest}
                />
            )}
            {showFailureModal && (
                <PaymentFailureModal
                    show={showFailureModal}
                    onClose={() => setShowFailureModal(false)}
                    transactionId={reg_transaction_id}
                    failureMsg={payment_failed_message}
                    paymentErrorText={payment_error_text}
                />
            )}
        </section>
    );
};

export default LiveFeedCard;
