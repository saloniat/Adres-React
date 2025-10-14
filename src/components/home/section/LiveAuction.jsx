import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import LiveCard from "../common/LiveCard";
import { setHomeLiveAucData } from "../../../redux/slice/buyerSlice";
import { handleDiscoverAuctions } from "../../../redux/action/buyerAction";
import Shimmer from "../../common/shimmer/Shimmer";
import useSocketSync from "../../hooks/useSocketSync";
import useTranslationHook from "../../hooks/useTranslationHook";
import { Link } from "react-router-dom";
import { setActiveTab } from "../../../redux/slice/discoverSlice";
import Slider from "react-slick";
import useWindowDimensions from "../../hooks/useWindowDimension";
import { createSlug, formatPrice } from "../../../helpers";
import CardTimer from "../../common/CardTimer";

const LiveAuction = () => {
    const dispatch = useDispatch();
    const { t } = useTranslationHook();
    const windowDimension = useWindowDimensions();

    const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
    const homeBidData = useSelector((state) => state.bid.homeBidData);
    const user = useSelector((state) => state.auth.user);
    const homeLiveAuction = useSelector((state) => state.buyer.homeLiveAuction);
    const homeLiveAuctionLoading = useSelector(
        (state) => state.buyer.homeLiveAuctionLoading
    );

    const [proeprtyCurrentStatus, setProeprtyCurrentStatus] = useState({
        label: "Loading...",
        className: "active",
    });

    const slidesToScrollCount = (width) => {
        return 1;
    };

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: slidesToScrollCount(windowDimension.width),
        slidesToScroll: slidesToScrollCount(windowDimension.width),
    };
    useEffect(
        () => {
            const abortController = new AbortController();
            const signal = abortController.signal;

            (async () => {
                const response = await dispatch(
                    handleDiscoverAuctions(
                        {
                            site_id: 3,
                            page_size: 2,
                            short_by: "",
                            sort_order: "asc",
                            ...(user?.user_id && {
                                user_id: Number(user.user_id),
                            }),
                            is_admin: 1,
                            property_for: 2, // for live auction
                        },
                        signal
                    )
                );
                const { data } = response || {};
                dispatch(
                    setHomeLiveAucData({
                        data: data?.data ? data.data : [],
                        total: data?.total ? data.total : 0,
                    })
                );
            })();

            return () => {
                abortController.abort();
            };
        },
        //eslint-disable-next-line
        []
    );
    const syncData = useSocketSync(
        homeLiveAuction,
        user?.user_id,
        "liveAuction"
    );
    // if (!homeLiveAuction?.length) return null;
    const lang = useSelector((state) => state.translation.lang);

    return (
        isAuthenticated ?
            <section className={`liveauction-wrap ${!isAuthenticated ? "pt-5" : ""}`} >
                <div className="container pb-5">
                    <div className="row">
                        <div
                            className={`col-lg-12 ${!isAuthenticated
                                ? "wow fadeInUp"
                                : !homeBidData?.length > 0
                                    ? ""
                                    : "wow fadeInUp"
                                } `}
                            {...(!isAuthenticated
                                ? { "data-wow-delay": "0.5s" }
                                : !homeBidData?.length
                                    ? {}
                                    : { "data-wow-delay": "0.5s" })}
                        >
                            <div className="main-heading">
                                <h3>
                                    <span>{t("Live Auction")}</span>
                                </h3>
                                <Link
                                    to="/discover"
                                    className="see-link"
                                    onClick={() => {
                                        dispatch(setActiveTab("live"));
                                    }}
                                >
                                    {t("See all")}{" "}
                                    <img src="img/arrow-r.svg" alt="arrow right" />
                                </Link>
                            </div>

                            {homeLiveAuctionLoading ? (
                                [1, 2].map((element, index) => (
                                    <Shimmer
                                        key={index}
                                        type="rectangle"
                                        width="48%"
                                        height="50vh"
                                        borderRadius="10%"
                                    />
                                ))
                            ) : (
                                <ul className="auction-list">
                                    {homeLiveAuction?.length ? (
                                        homeLiveAuction?.map((ele, ind) => (
                                            <LiveCard
                                                ele={ele}
                                                key={ind}
                                                syncData={
                                                    syncData?.filter(
                                                        ({ property_id }) =>
                                                            property_id === ele?.id
                                                    )?.[0]
                                                }
                                            />
                                        ))
                                    ) : (
                                        <li className="full text-center">
                                            <img
                                                src="/img/no-property-found.png"
                                                alt={t("No live auction found")}
                                            />
                                            <h6>{t("No live auction found")}</h6>
                                        </li>
                                    )}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </section> :
            <>
                {homeLiveAuction?.length > 0 && <div className="main-heading">
                    <h3>
                        <span>
                            {t("Live Auction")}
                        </span>
                    </h3>
                </div>}
                {homeLiveAuctionLoading ? (
                    [1].map((element, index) => (
                        <Shimmer
                            key={index}
                            type="rectangle"
                            width="48%"
                            height="50vh"
                            borderRadius="10%"
                        />
                    ))
                ) : Array.isArray(homeLiveAuction) &&
                homeLiveAuction?.length > 0 && (
                    <ul className="live-auction-slider">
                        <Slider {...settings}>
                            {
                                homeLiveAuction?.map((ele, ind) => {
                                    const slug = createSlug(
                                        ele?.property || ele?.id,
                                        `${ele?.property_name} ${ele?.country}`
                                    );
                                    const socketData = syncData?.filter(
                                        ({ property_id }) =>
                                            property_id === ele?.id
                                    )?.[0]
                                    return <li>
                                        <figure>
                                            <img className="slide-fixed" src="img/prop-trans.png" alt="" />
                                            <img className="slide-img" src={`${process.env.REACT_APP_AZURE_BLOB_URL}${ele.property_image?.image && ele.property_image?.bucket_name ? `${ele.property_image.bucket_name}/${ele.property_image.image}` : "property_image/default_property.jpg"}`} alt="" />
                                        </figure>
                                        <figcaption>
                                            <div className="status-info">
                                                <span className="total-bid">
                                                    {t("discover card total bids", {
                                                        totalBids: socketData?.bid_count || 0,
                                                    })}
                                                </span>
                                                <span className="status"><em></em>{t("Live")}</span>
                                            </div>
                                            <h5>
                                                {lang === "en"
                                                    ? ele?.property_name
                                                    : ele?.property_name_ar || ""}
                                            </h5>
                                            <div className="bid-end">
                                                <CardTimer
                                                    data={socketData}
                                                    isLiveCard={true}
                                                    onStatusChange={setProeprtyCurrentStatus}
                                                />

                                            </div>
                                            <div className="apk">
                                                <div className="apk-text">
                                                    {t(ele?.property_type || "")} <span>|</span>
                                                    {t(ele?.construction_status_name || "")}
                                                </div>
                                                <Link to={`/property/detail/${slug}`} className="prp-link">{t("Property Details")} <i
                                                    className="fa-solid fa-chevron-right"></i></Link>
                                            </div>
                                            <div className="bid-box">
                                                <div className="high-bid">
                                                    <small>
                                                        {socketData?.bid_count
                                                            ? t("Highest Bid")
                                                            : t("Starting Price")}
                                                    </small>
                                                    <h5>
                                                        {socketData
                                                            ? t("Amount", {
                                                                amount: `${formatPrice(
                                                                    socketData?.bid_count
                                                                        ? socketData?.high_bid_amt
                                                                        : socketData?.start_price,
                                                                    lang
                                                                )}`,
                                                            })
                                                            : t("Loading...")}
                                                    </h5>
                                                </div>
                                                <div className="timer">
                                                    <Link to={`/live-feed/${slug}`} className="btn btn-white">{socketData?.my_max_bid_val
                                                        ? t("Auction Joined")
                                                        : t("Join Auction")}</Link>
                                                </div>
                                            </div>
                                        </figcaption>
                                    </li>
                                })
                            }
                        </Slider>
                    </ul>
                )}
            </>
    );
};

export default LiveAuction;
