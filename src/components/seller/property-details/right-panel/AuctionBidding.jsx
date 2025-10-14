import React, {
    useState,
    useEffect,
    useMemo,
    useRef,
    useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import AuctionTimer from "./AuctionTimer";
import Shimmer from "../../../common/shimmer/Shimmer";
import SocketService from "../../../../Service/SocketService";
import BidHistory from "./BidHistory";
import ComparableProperties from "../../../partials/property-details/right-panel/ComparableProperties";
import { ABUDHABICITYID, DOMAIN } from "../../../../utils/constants";
import useDidMountEffect from "../../../hooks/useDidMountEffect";
import useIPAddress from "../../../hooks/useIPAddress";
import { handleSiteLoader } from "../../../../redux/action/authAction";
import useTranslationHook from "../../../hooks/useTranslationHook";
import HighestBid from "./HighestBid";
import { createSlug } from "../../../../helpers";
import {
    handleContactUsModal,
    handleHighestBidderModal,
} from "../../../../redux/slice/modalSlice";
import CustomButton from "./CustomButton";
import HighestBidConfirmationModal from "./modals/HighestBidConfirmationModal";
import { relistingProperty } from "../../../../redux/action/sellerAction";
import { toast } from "react-toastify";
import Tooltip from "rc-tooltip";
import { handleParentProperty } from "../../../../redux/slice/bidHistorySlice";
const AuctionBidding = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isSeller = useSelector((state) => state.profile.account);
    const { t } = useTranslationHook();
    const {
        id,
        id: property_id,
        property_auction_data,
        is_auto_bid_enabled,
        reg_auto_bid_amount,
        min_bid_amount,
        reg_bid_amount: bid_amount,
        is_approved,
        registration_id,
        is_bid_transaction,
        reg_transaction_status,
        property_name,
        country,
        property_for,
        city,
        property_status,
        is_relisted,
        parent_id,
    } = useSelector((state) => state.seller.property.propertyData);
    const { parentProperty } = useSelector((state) => state.bidHistory);
    const { ip } = useIPAddress();
    const user = useSelector((state) => state.auth.user);
    const { isConnected } = useSelector((state) => state.socket);

    const [biddingData, setBiddingData] = useState(null);
    const [auctionStatus, setAuctionStatus] = useState(null);
    const [showPopUp, setShowPopUp] = useState(true);
    const prevAuctionStatus = useRef(null);

    const auction_id = property_auction_data[0]?.id;
    const bid_increments = property_auction_data[0]?.bid_increments;
    const start_price = property_auction_data[0]?.start_price;
    const reserveAmount = biddingData?.reserve_amount;
    const highBidAmt = biddingData?.high_bid_amt;
    const noOfBids = biddingData?.bid_count || 0;
    const isUserOfferAccepted = biddingData?.offerer_offer_status == 1;
    const is_selected_highest_bid = biddingData?.is_selected_highest_bid;
    const listing_status_id = biddingData?.listing_status_id;

    // const offerer_offer_amount = biddingData?.offerer_offer_amount || null;
    const isReserveMet =
        highBidAmt && reserveAmount ? reserveAmount <= highBidAmt : false;
    const syncEmitData = useMemo(
        () => ({
            property_id,
            user_id: user?.user_id || "",
            auction_id,
            domain_id: 3,
        }),
        [property_id, user, auction_id]
    );

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
        SocketService.on("checkBid", ({ error, data }) => {
            if (error) {
                console.error(error);
                return;
            }
            setShowPopUp(!data?.my_max_bid_val);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConnected, auctionStatus, syncEmitData]);
    if (auctionStatus === 3 && biddingData?.auction_status === 1) {
        SocketService.send("checkAuction", { domain_id: DOMAIN });
    }
    const handleAuctionStatus = (statusValue) => setAuctionStatus(statusValue);
    const isBiddingDataEmpty = useMemo(
        () => !biddingData || Object.keys(biddingData).length === 0,
        [biddingData]
    );
    // const propertySlug = createSlug(property_id, `${property_name} ${country}`);

    useDidMountEffect(() => {
        if (
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

    useEffect(() => {
        if (prevAuctionStatus.current === 2 && auctionStatus === 3) {
            SocketService.send("checkBid", syncEmitData);
        }
        prevAuctionStatus.current = auctionStatus;
        // eslint-disable-next-line
    }, [auctionStatus]);

    const handleChooseHighestBid = () => {
        dispatch(handleHighestBidderModal(true));
    };

    const confirmBtnClick = () => {
        const payload = {
            property_id,
            auction_id,
            user_id: user?.user_id,
            domain_id: DOMAIN,
            highest_bid_id: biddingData?.high_bid_id, // or another appropriate key
        };
        SocketService.send("choose-highest-bid", payload);
        dispatch(handleHighestBidderModal(false));
    };

    useEffect(() => {
        SocketService.on("choose-highest-bid", ({ error, data }) => {
            if (error) {
                console.error("Error choosing highest bid:", error);
                return;
            }
            // You can show a toast, confirmation modal, or redirect
            console.log("Highest bid chosen:", data);
        });

        return () => {
            SocketService.off("choose-highest-bid");
        };
    }, []);

    const handleParentPropertyBtnClick = useCallback(() => {
        dispatch(
            handleParentProperty(parentProperty === null ? parent_id : null)
        );
    }, [parentProperty]);

    return (
        <>
            <div className="col-lg-12 py-3">
                <div className="sidebar">
                    <h5>
                        {t(
                            property_for === 2
                                ? "Live Auction"
                                : "Auction Details"
                        )}
                    </h5>
                    {!isUserOfferAccepted &&
                        isSeller === 1 &&
                        auctionStatus === 3 &&
                        !isReserveMet &&
                        !is_selected_highest_bid && (
                            <div className="alert alert-primary">
                                {t(
                                    "Auction did not meet your reserve price, please check the offered price"
                                )}
                            </div>
                        )}
                    {auctionStatus === 3 &&
                        biddingData?.closing_statuss_name && (
                            <CustomButton
                                label={t(biddingData?.closing_statuss_name)}
                                className="btn-green"
                                disabled={true}
                            />
                        )}
                    <div className="sidebar-closed">
                        <div className="block">
                            <HighestBid
                                data={biddingData}
                                auctionStatus={auctionStatus}
                            />
                        </div>
                        <div className="block">
                            {isSeller === 1 &&
                                auctionStatus === 3 &&
                                isReserveMet && (
                                    <div className="alert alert-primary">
                                        <img src="img/info-icon.svg" alt="" />{" "}
                                        {t(
                                            "Our team will contact you shortly to proceed"
                                        )}
                                    </div>
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
                            {auctionStatus !== 3 &&
                                Number(city) === ABUDHABICITYID && (
                                    <ComparableProperties data={biddingData} />
                                )}
                            {/* upcoming auction button */}
                            {auctionStatus === 1 ||
                                auctionStatus === 2 ||
                                (auctionStatus === 3 && isReserveMet && (
                                    <div className="clearfix">
                                        <button
                                            className="btn btn-primary btn-full"
                                            onClick={() =>
                                                dispatch(
                                                    handleContactUsModal(true)
                                                )
                                            }
                                        >
                                            {t("Contact Us")}
                                        </button>
                                    </div>
                                ))}
                            {/* auction ended but reserve not met */}
                            {
                                auctionStatus === 3 &&
                                    !isReserveMet &&
                                    noOfBids > 0 && biddingData?.closing_statuss_name !== "Sold out" ? (
                                    <div className="d-flex">
                                        <Tooltip
                                            overlay={
                                                <span>
                                                    {t(
                                                        "The auction has already been reopened."
                                                    )}
                                                </span>
                                            }
                                            trigger={
                                                is_relisted ? ["hover"] : []
                                            }
                                            destroyTooltipOnHide
                                            placement="top"
                                        >
                                            <button
                                                style={{
                                                    pointerEvents: "auto",
                                                }}
                                                disabled={is_relisted}
                                                onClick={() => {
                                                    dispatch(
                                                        relistingProperty({
                                                            site_id: 3,
                                                            property_id:
                                                                property_id,
                                                            user_id: Number(
                                                                user?.user_id
                                                            ),
                                                        })
                                                    ).then((res) => {
                                                        if (res.error === 0) {
                                                            toast.success(
                                                                t(res.msg)
                                                            );
                                                            navigate(
                                                                "/seller/auction/detail/" +
                                                                createSlug(
                                                                    res
                                                                        ?.data
                                                                        ?.property_id,
                                                                    `${property_name} ${country}`
                                                                ),
                                                                {
                                                                    state: {
                                                                        is_reopen: 1,
                                                                    },
                                                                }
                                                            );
                                                        }
                                                    });
                                                    // navigate(
                                                    //     "/seller/auction/detail/" +
                                                    //         propertySlug,
                                                    //     {
                                                    //         state: {
                                                    //             is_reopen: 1,
                                                    //         },
                                                    //     }
                                                    // )
                                                }}
                                                className="btn btn-sky btn-full"
                                            >
                                                {t("Reopen the Auction")}
                                            </button>
                                        </Tooltip>

                                        {biddingData.high_bid_amt !== null && <button
                                            onClick={handleChooseHighestBid}
                                            className="btn btn-primary btn-full"
                                            disabled={is_selected_highest_bid}
                                        >
                                            {t("Choose Highest Bid")}
                                        </button>}
                                    </div>
                                ) : null
                                // <div className="d-flex">
                                //     <button
                                //         className="btn btn-sky btn-full"
                                //         onClick={() =>
                                //             dispatch(handleContactUsModal(true))
                                //         }
                                //     >
                                //         {t("Contact Us")}
                                //     </button>
                                // </div>
                            }

                            {/* auction ended but reserve not met and no bid placed */}
                            {((auctionStatus === 3 &&
                                !isReserveMet &&
                                !noOfBids) ||
                                listing_status_id === 8) && (
                                    <div className="d-flex">
                                        <button
                                            className="btn btn-sky btn-full"
                                            onClick={() =>
                                                dispatch(handleContactUsModal(true))
                                            }
                                        >
                                            {t("Contact Us")}
                                        </button>
                                        {((!isUserOfferAccepted ||
                                            listing_status_id === 8) && biddingData?.closing_statuss_name !== "Sold out") && (
                                                <Tooltip
                                                    overlay={
                                                        <span>
                                                            {t(
                                                                "The property has already been relisted."
                                                            )}
                                                        </span>
                                                    }
                                                    trigger={
                                                        is_relisted ? ["hover"] : []
                                                    }
                                                    destroyTooltipOnHide
                                                    placement="top"
                                                >
                                                    <button
                                                        style={{
                                                            pointerEvents: "auto",
                                                        }}
                                                        disabled={is_relisted}
                                                        onClick={
                                                            () => {
                                                                dispatch(
                                                                    relistingProperty({
                                                                        site_id: 3,
                                                                        property_id:
                                                                            property_id,
                                                                        user_id: Number(
                                                                            user?.user_id
                                                                        ),
                                                                    })
                                                                ).then((res) => {
                                                                    if (
                                                                        res.error === 0
                                                                    ) {
                                                                        toast.success(
                                                                            t(res.msg)
                                                                        );
                                                                        navigate(
                                                                            "/seller/auction/detail/" +
                                                                            createSlug(
                                                                                res
                                                                                    ?.data
                                                                                    ?.property_id,
                                                                                `${property_name} ${country}`
                                                                            ),
                                                                            {
                                                                                state: {
                                                                                    is_reopen: true,
                                                                                },
                                                                            }
                                                                        );
                                                                    }
                                                                });
                                                            }
                                                            // navigate(
                                                            //     "/seller/auction/detail/" +
                                                            //         propertySlug,
                                                            //     {
                                                            //         state: {
                                                            //             is_reopen: true,
                                                            //         },
                                                            //     }
                                                            // )
                                                        }
                                                        className="btn btn-primary btn-full"
                                                    >
                                                        {t("Relist Property")}
                                                    </button>
                                                </Tooltip>
                                            )}
                                    </div>
                                )}
                            {parent_id ? (
                                <div className="d-flex pt-3">
                                    <button
                                        className="btn btn-sky btn-full"
                                        onClick={handleParentPropertyBtnClick}
                                    >
                                        {t(
                                            !parentProperty
                                                ? "View Old Bidding History"
                                                : "View New Bidding History"
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </div>

                {user?.user_id && isSeller === 1 && biddingData && (
                    <BidHistory
                        propertyId={id}
                        auctionStatus={auctionStatus}
                        biddingData={biddingData}
                    />
                )}
                <HighestBidConfirmationModal
                    confirmBtnClick={confirmBtnClick}
                />
            </div>
        </>
    );
};

export default AuctionBidding;
