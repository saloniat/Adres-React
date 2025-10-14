import React, { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Breadcrumb from "../common/Breadcrumb";
import Tabs from "../common/Tabs";
import { SELLER_MY_AUCTION_TABS } from "../../utils/constants";
import Card from "./Card";
import { fetchSellerAuctions } from "../../redux/action/sellerAction";
import {
    FetchSellerAuctionProperties,
    resetSellerAuctionProperties,
    setAuctionListingPage,
    setAuctionActiveTab,
} from "../../redux/slice/sellerSlice";
import { getTotalPages } from "../../helpers";
import { Pagination } from "../common/Pagination";
import useTranslationHook from "../hooks/useTranslationHook";
import useSocketSync from "../hooks/useSocketSync";
const Auctions = () => {
    const dispatch = useDispatch();
    const { t } = useTranslationHook();
    const allTab = useSelector(
        (state) => state.seller?.properties.auction.data
    );
    const total = useSelector(
        (state) => state.seller?.properties.auction.total
    );
    const pageSize = useSelector(
        (state) => state.seller?.properties.auction.pageSize
    );
    const currentPage = useSelector(
        (state) => state.seller?.properties.auction.currentPage
    );
    const activeTab = useSelector(
        (state) => state.seller?.properties.auction.activeTab
    );
    const sellerAuctionPropertiesDataLoading = useSelector(
        (state) => state.seller.sellerAuctionPropertiesDataLoading
    );
    const [data, setData] = useState([]);

    const totalPages = useMemo(() => {
        return getTotalPages(total, pageSize);
    }, [total, pageSize]);

    useEffect(() => {
        setData(allTab);
    }, [allTab, activeTab, currentPage]);

    useEffect(() => {
        sellerAuctionPropertiesDataLoading &&
            dispatch(fetchSellerAuctions(activeTab)).then((response) => {
                const { data } = response || {};
                if (data?.data) dispatch(FetchSellerAuctionProperties(data));
            });
        // }
        //eslint-disable-next-line
    }, [sellerAuctionPropertiesDataLoading, activeTab]);

    useEffect(() => {
        return () => dispatch(resetSellerAuctionProperties());
        //eslint-disable-next-line
    }, []);
    const user = useSelector((state) => state.auth.user, shallowEqual);
    const syncData = useSocketSync(data, user?.user_id, "seller_auction");
    return (
        <>
            <Breadcrumb
                links={[
                    { url: "/", name: t("Home") },
                    { url: "", name: t("My Auctions") },
                ]}
            />
            <section className="discover-wrap">
                <div className="container py-5">
                    <div className="row">
                        <div
                            className="col-lg-12 wow wow fadeInUp"
                            data-wow-delay="0.5s"
                        >
                            <div className="main-heading">
                                <h3>{t("My Auctions")}</h3>
                            </div>
                            <Tabs
                                tab={SELLER_MY_AUCTION_TABS}
                                data={data}
                                Component={Card}
                                className="discover-list"
                                activeTab={activeTab}
                                fetchData={(key) =>
                                    dispatch(setAuctionActiveTab(key))
                                }
                                syncData={syncData}
                                isLoading={sellerAuctionPropertiesDataLoading}
                                isAuction={true}
                            />
                            {!sellerAuctionPropertiesDataLoading && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={(page) =>
                                        dispatch(setAuctionListingPage(page))
                                    }
                                />
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Auctions;
