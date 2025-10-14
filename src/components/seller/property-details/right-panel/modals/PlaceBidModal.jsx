import React, { useState, useEffect, useCallback } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import SocketService from "../../../../../Service/SocketService";
import useSocketListener from "../../../../hooks/useSocketListener";
import useIPAddress from "../../../../hooks/useIPAddress";
import { Link } from "react-router-dom";
import { formatNumber } from "../../../../../helpers";
import { toast } from "react-toastify";
import { bidRegistration } from "../../../../../redux/action/sellerAction";
import { DOMAIN } from "../../../../../utils/constants";
import {
    setModalStep,
    setShowPlaceBidModal,
} from "../../../../../redux/slice/sellerSlice";
import useDidMountEffect from "../../../../hooks/useDidMountEffect";
import { initiatePurchase } from "../../../../../redux/action/paymentAction";
import useTranslationHook from "../../../../hooks/useTranslationHook";
import useCountdownTimer from "../../../../hooks/useCountdownTimer";
const PlaceBidModal = ({ show, onClose, data, user, auction_id }) => {
    const dispatch = useDispatch();
    const { modalStep } = useSelector((state) => state.seller.property);
    const {
        deposit_amount,
        registration_id,
        is_bid_transaction,
        is_approved,
        my_bid_count,
    } = useSelector((state) => state.seller.property.propertyData);
    const isLoading = useSelector(
        (state) => state.payment.isLoading,
        shallowEqual
    );
    const paymentId = useSelector(
        (state) => state.payment.paymentId,
        shallowEqual
    );
    const paymentUrl = useSelector(
        (state) => state.payment.paymentUrl,
        shallowEqual
    );
    const { ip } = useIPAddress();
    const { t } = useTranslationHook();
    const lang = useSelector((state) => state.translation.lang);
    const {
        property_id,
        bid_count,
        bid_increments,
        high_bid_amt,
        max_bidder_user_id,
        start_price,
        user_auto_bid_amount,
        my_max_bid_val,
        user_auto_bid_status,
        auction_status,
    } = data;
    const minBidAmount = !parseInt(high_bid_amt)
        ? parseInt(start_price)
        : parseInt(high_bid_amt ?? start_price) + parseInt(bid_increments);
    useEffect(() => {
        if (show) {
            setNextBidAmount(minBidAmount);
        }
    }, [high_bid_amt, start_price, bid_increments, show]);
    const initialState = {
        // modalStep: 1,
        nextBidAmount: minBidAmount,
        isAutoBidEnabled: !(
            !user_auto_bid_status || user_auto_bid_status === 2
        ),
        maxBid: user_auto_bid_amount | 0 || "",
        maxBidError: "",
        cardNumber: "",
        expDate: "",
        cvv: "",
        cardName: "",
    };
    const [bidInProgress, setBidInProgress] = useState(false);
    const [registrationId, setRegistrationId] = useState(registration_id);
    // const [modalStep, setModalStep] = useState(initialState?.modalStep);
    const [maxBid, setMaxBid] = useState(initialState?.maxBid);
    const [submittedBid, setSubmittedBid] = useState(null);
    const [maxBidError, setMaxBidError] = useState(initialState?.maxBidError);
    const [nextBidAmount, setNextBidAmount] = useState(
        initialState?.nextBidAmount
    );
    const [isAutoBidEnabled, setIsAutoBidEnabled] = useState(
        initialState?.isAutoBidEnabled
    );
    const changeInterval = parseInt(bid_increments);
    const depositAmount = formatNumber(deposit_amount, lang);
    const onBidChange = (operation) => {
        setNextBidAmount((prevAmount) =>
            operation === "increase"
                ? prevAmount + changeInterval
                : Math.max(minBidAmount, prevAmount - changeInterval)
        );
    };

    const emitData = {
        property_id,
        user_id: user?.user_id,
        auction_id,
        auto_bid_amount: maxBid,
        bid_amount: nextBidAmount,
        registration_id: registrationId,
        domain_id: 3,
        bid_increment: bid_increments,
        min_bid_amount: parseInt(high_bid_amt ?? start_price),
        ip_address: ip || "127.0.0.1",
    };

    const handleBidSubmit = async () => {
        if (auction_status && auction_status === 2) {
            toast.info(
                t("Auction has been stopped. No further bids will be accepted.")
            );
            return;
        }
        if (
            isAutoBidEnabled &&
            (!maxBid?.toString().trim() ||
                parseInt(maxBid) % parseInt(bid_increments) !== 0 ||
                parseInt(maxBid) < parseInt(nextBidAmount))
        ) {
            setMaxBidError(t("Max Bid Error Msg"));
            return;
        }

        setMaxBidError("");
        setSubmittedBid(nextBidAmount);

        if (
            !my_max_bid_val &&
            !is_bid_transaction &&
            is_approved !== 2 &&
            modalStep === 1
        ) {
            dispatch(setModalStep(2));
            return;
        }
        if (submittedBid !== nextBidAmount && modalStep !== 1) {
            toast.error(t("Please increase your bid."));
            dispatch(setModalStep(1));
            return;
        }

        if (bidInProgress) return;
        setBidInProgress(true);

        const emitBid = (regId) => {
            emitData.registration_id = regId;
            SocketService.send(
                isAutoBidEnabled &&
                    maxBid &&
                    maxBid !== parseInt(user_auto_bid_amount)
                    ? "setAutoBid"
                    : "addNewBid",
                emitData
            );
        };

        if (!registrationId || (!my_max_bid_val && modalStep === 1)) {
            try {
                const bidRegPayload = {
                    email: user?.email,
                    first_name: user?.first_name,
                    last_name: user?.last_name,
                    phone_no: user?.phone_no,
                    deposit_amount,
                    property_id,
                    domain: DOMAIN,
                    ip_address: ip || "127.0.0.1",
                };

                const bidResponse = await dispatch(
                    bidRegistration(bidRegPayload)
                );
                const { registration_id } = bidResponse;

                if (registration_id) {
                    setRegistrationId(registration_id);
                    emitBid(registration_id);
                } else {
                    toast.error(
                        t("Bid registration failed. Please try again.")
                    );
                }
            } catch (error) {
                toast.error(t("An error occurred while registering the bid."));
            }
        } else {
            emitBid(registrationId);
        }

        setBidInProgress(false);
    };

    const handleClose = () => {
        dispatch(setModalStep(1));
        setNextBidAmount(initialState.nextBidAmount);
        setIsAutoBidEnabled(initialState.isAutoBidEnabled);
        setMaxBid(initialState.maxBid);
        setMaxBidError(initialState.maxBidError);
        onClose();
    };

    const handleBidResponse = useCallback(({ error, msg }) => {
        if (error) {
            toast.error(msg);
        } else {
            dispatch(setShowPlaceBidModal(true));
            dispatch(setModalStep(4));
        }
        setBidInProgress(false);
        SocketService.send("checkBid", emitData);
    }, []);

    useSocketListener(["setAutoBid", "addNewBid"], handleBidResponse);

    const handleAutoBidToggle = (status) => {
        SocketService.send("toggleAutoBidStatus", {
            property_id,
            user_id: user?.user_id,
            domain_id: 3,
            status: status ? 1 : 2,
        });
    };
    const modalTitles = {
        1: "Place a Bid",
        2: "Bid Placement Information",
        3: "Deposit Processing",
    };

    useDidMountEffect(() => {
        if (paymentUrl && paymentId)
            window.location.href = `${paymentUrl}?PaymentID=${paymentId}`;
    }, [paymentId, paymentUrl]);

    const isListingActive = Number(data?.listing_status_id) === 1;
    const { days, hours, minutes, seconds } = useCountdownTimer(
        isListingActive ? data?.start_date : 0,
        isListingActive ? data?.end_date : 0
    );
    const auctionLeftTime =
        days > 0
            ? `${days}d ${hours}h ${minutes}m`
            : `${hours}h ${minutes}m ${seconds}s`;
    return (
        <div
            className={`modal fade place-bid-modal ${show ? "show d-block" : ""}`}
            tabIndex="-1"
            role="dialog"
        >
            <div className="modal-dialog modal-md modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5>{t(modalTitles[modalStep] ?? "")}</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={handleClose}
                            aria-label="Close"
                        ></button>
                    </div>

                    <div className="modal-body pb0">
                        {modalStep === 1 && (
                            <div className="placebid">
                                {bid_count && my_max_bid_val && (
                                    <Link
                                        className={`lead-btn ${parseInt(user?.user_id) === max_bidder_user_id ? "green" : ""}`}
                                    >
                                        <img
                                            src={
                                                parseInt(user?.user_id) ===
                                                    max_bidder_user_id
                                                    ? "/img/up-arrow-green.svg"
                                                    : "/img/down-arrow-red.svg"
                                            }
                                            alt=""
                                            className="mr4"
                                        />{" "}
                                        {parseInt(user?.user_id) ===
                                            max_bidder_user_id
                                            ? t("You’re Leading")
                                            : t("Out of the Lead")}
                                    </Link>
                                )}

                                <div className="price-block">
                                    <div className="price current-price">
                                        {t("Current price")}{" "}
                                        <span>
                                            {t("Amount", {
                                                amount: formatNumber(
                                                    high_bid_amt || start_price,
                                                    lang
                                                ),
                                            })}
                                        </span>
                                    </div>
                                    <div className="price increment-price">
                                        {t("Min increment")}{" "}
                                        <span>
                                            {t("Amount", {
                                                amount: formatNumber(
                                                    bid_increments,
                                                    lang
                                                ),
                                            })}
                                        </span>
                                    </div>
                                </div>

                                <div className="your-bid">
                                    <Link
                                        className="minus"
                                        onClick={() => onBidChange("decrease")}
                                    >
                                        <img src="/img/minus.svg" alt="" />
                                    </Link>
                                    <div className="bid">
                                        {t("Your Bid")}{" "}
                                        <span>
                                            {t("Amount", {
                                                amount: formatNumber(
                                                    nextBidAmount,
                                                    lang
                                                ),
                                            })}
                                        </span>
                                    </div>
                                    <Link
                                        className="plus"
                                        onClick={() => onBidChange("increase")}
                                    >
                                        <img src="/img/plus.svg" alt="" />
                                    </Link>
                                </div>
                                {data?.auto_bid && (
                                    <div className="autobid-block">
                                        <div className="auto-bid">
                                            <label
                                                htmlFor="autoBidToggle"
                                                className="label"
                                            >
                                                {t("Auto bid")}
                                            </label>
                                            <div className="form-check form-switch">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="flexSwitchCheckChecked"
                                                    checked={isAutoBidEnabled}
                                                    onChange={(e) => {
                                                        const value =
                                                            e.target.checked;
                                                        handleAutoBidToggle(
                                                            value
                                                        );
                                                        setIsAutoBidEnabled(
                                                            value
                                                        );
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="time-left">
                                            Time left:{" "}
                                            <span>{auctionLeftTime}</span>
                                        </div>
                                    </div>
                                )}

                                {isAutoBidEnabled && (
                                    <div className="max-bid">
                                        <label
                                            htmlFor="maxBidInput"
                                            className="form-label"
                                        >
                                            {t("Your Max Bid")}
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${maxBidError ? "is-invalid" : ""}`}
                                            id="maxBidInput"
                                            placeholder="Ex: 1,000,000"
                                            value={maxBid}
                                            onChange={(e) => {
                                                const value =
                                                    e.target.value.replace(
                                                        /[^0-9]/g,
                                                        ""
                                                    );
                                                setMaxBid(value);
                                            }}
                                        />
                                        {maxBidError && (
                                            <div className="text-danger">
                                                {maxBidError}
                                            </div>
                                        )}

                                        <p className="pt5">
                                            {t("Maximum Amount Place Bid Msg", {
                                                text: `"${t("Place Bid")}"`,
                                            })}
                                        </p>
                                    </div>
                                )}

                                <div className="button-action">
                                    <button
                                        type="button"
                                        className="btn btn-white btn-sky btn-md"
                                        onClick={handleClose}
                                    >
                                        {t("Cancel")}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-md"
                                        onClick={handleBidSubmit}
                                    >
                                        {t("Bid Now")}
                                    </button>
                                </div>
                            </div>
                        )}

                        {modalStep === 2 && (
                            <div className="placebid">
                                <div className="placement-info">
                                    {t("Deposit Amount Paragraph", {
                                        depositAmount,
                                    })}
                                </div>
                                <ul className="bidlist">
                                    <li>
                                        {t("Your new bid")}{" "}
                                        <span>
                                            {t("Amount", {
                                                amount: formatNumber(
                                                    parseInt(submittedBid),
                                                    lang
                                                ),
                                            })}
                                        </span>
                                    </li>
                                    <li>
                                        {t("Deposit Amount Label")}{" "}
                                        <span>
                                            {t("Amount", {
                                                amount: depositAmount,
                                            })}
                                        </span>
                                    </li>
                                    {isAutoBidEnabled && (
                                        <>
                                            <li>
                                                {t("Auto-Bid Enabled")}{" "}
                                                <span>
                                                    {t("Yes, up to AED", {
                                                        maxBid: formatNumber(
                                                            maxBid,
                                                            lang
                                                        ),
                                                    })}
                                                </span>
                                            </li>
                                            <li>
                                                <div className="alert alert-info">
                                                    <img
                                                        src="/img/info-icon.svg"
                                                        alt=""
                                                    />
                                                    {t(
                                                        "If another bidder outbids you, we’ll automatically increase your bid up to your maximum limit. rejected"
                                                    )}
                                                </div>
                                            </li>
                                        </>
                                    )}
                                </ul>
                                <div className="button-action">
                                    <button
                                        onClick={handleClose}
                                        type="button"
                                        className="btn btn-white btn-sky btn-lg"
                                    >
                                        {t("Cancel")}
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (
                                                !is_bid_transaction &&
                                                is_approved !== 2
                                            ) {
                                                const bidRegPayload = {
                                                    email: user?.email,
                                                    first_name:
                                                        user?.first_name,
                                                    last_name: user?.last_name,
                                                    phone_no: user?.phone_no,
                                                    deposit_amount,
                                                    property_id,
                                                    domain: DOMAIN,
                                                    ip_address:
                                                        ip || "127.0.0.1",
                                                    bid_amount: nextBidAmount,
                                                    ...(maxBid && {
                                                        auto_bid_amount: maxBid,
                                                    }),
                                                };

                                                const bidResponse =
                                                    await dispatch(
                                                        bidRegistration(
                                                            bidRegPayload
                                                        )
                                                    );
                                                const { is_already_payment, registration_id } = bidResponse;
                                                if (registration_id) {
                                                    if (!is_already_payment) {
                                                        sessionStorage.setItem(
                                                            "bid_count",
                                                            data?.is_last_bid_retracted ? 0 : my_bid_count
                                                        );
                                                        dispatch(
                                                            initiatePurchase({
                                                                property_id,
                                                                amount: Number(deposit_amount || 0),
                                                            })
                                                        );
                                                    } else {
                                                        handleBidSubmit()
                                                    }
                                                }
                                            }
                                        }}
                                        type="button"
                                        disabled={isLoading}
                                        className="btn btn-primary btn-lg"
                                    >
                                        {isLoading
                                            ? t("Processing...")
                                            : t("Confirm")}
                                    </button>
                                </div>
                            </div>
                        )}

                        {modalStep === 4 && (
                            <div className="placebid">
                                <figure className="tick">
                                    <img src="/img/check-L.svg" alt="" />
                                </figure>
                                <div className="bid-success">
                                    {t("Your bid has been placed successfully")}
                                    <span>
                                        {t(
                                            "Stay tuned for updates on the auction status."
                                        )}
                                    </span>
                                </div>
                                <ul className="bidlist">
                                    <li>
                                        {t("Your new bid")}{" "}
                                        <span>
                                            {t("Amount", {
                                                amount: formatNumber(
                                                    submittedBid ||
                                                    my_max_bid_val,
                                                    lang
                                                ),
                                            })}
                                        </span>
                                    </li>
                                    <li>
                                        {t("Deposit Amount Label")}{" "}
                                        <span>
                                            {t("Amount", {
                                                amount: depositAmount,
                                            })}
                                        </span>
                                    </li>
                                    <li>
                                        {t("Bid Increment")}{" "}
                                        <span>
                                            {formatNumber(
                                                parseInt(bid_increments)
                                            )}
                                        </span>
                                    </li>
                                    {isAutoBidEnabled && (
                                        <li>
                                            {t("Auto-Bid Enabled")}
                                            <span>
                                                {t("Up to Max Bid", {
                                                    maxBid: formatNumber(
                                                        maxBid,
                                                        lang
                                                    ),
                                                })}
                                            </span>
                                        </li>
                                    )}
                                </ul>

                                <div className="clearfix">
                                    <button
                                        onClick={handleClose}
                                        className="btn btn-primary btn-md btn-full"
                                    >
                                        {t("Return to Details")}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceBidModal;
