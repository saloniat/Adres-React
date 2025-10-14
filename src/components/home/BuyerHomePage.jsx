import React, { lazy, Suspense } from "react";
import Bids from "./section/Bids";
import LiveAuction from "./section/LiveAuction";
import Shimmer from "../common/shimmer/Shimmer";
import AuctionWon from "./section/AuctionWon";
import { useSelector } from "react-redux";
import Banner from "./section/Banner";
import Insight from "./section/Insight";

const ReadyToSell = lazy(() => import("./section/ReadyToSell"));
const OtherProject = lazy(() => import("./section/OtherProject"));
const DiscoverAuction = lazy(() => import("./section/DiscoverAuction"));
const FeaturedProjects = lazy(() => import("./section/FeaturedProjects"));

const BuyerHomePage = () => {
    const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

    return (
        <>
            {!isAuthenticated && <Banner />}
            {isAuthenticated && <AuctionWon />}
            {isAuthenticated && <Bids />}
            {isAuthenticated && <LiveAuction />}
            <Suspense
                fallback={[1, 2, 3].map((element, index) => (
                    <Shimmer
                        key={index}
                        type="rectangle"
                        width="31%"
                        height="50vh"
                        borderRadius="10%"
                    />
                ))}
            >
                <DiscoverAuction />
            </Suspense>
            <ReadyToSell />
            {!isAuthenticated && <Insight />}
            <Suspense
                fallback={[1, 2].map((element, index) => (
                    <Shimmer
                        key={index}
                        type="rectangle"
                        width="48%"
                        height="50vh"
                        borderRadius="10%"
                    />
                ))}
            >
                <FeaturedProjects />
            </Suspense>
            <Suspense
                fallback={[1, 2, 3].map((element, index) => (
                    <Shimmer
                        key={index}
                        type="rectangle"
                        width="31%"
                        height="50vh"
                        borderRadius="10%"
                    />
                ))}
            >
                <OtherProject />
            </Suspense>
        </>
    );
};

export default BuyerHomePage;
