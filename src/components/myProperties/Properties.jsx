import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumb from "../common/Breadcrumb";
import Tabs from "../common/Tabs";
import {
    accountStatus,
    MY_PROPERTIES_TABS,
    SELLER_PROPERTY_STATUS,
} from "../../utils/constants";
import Card from "./Card";
import AddPropertyModal from "../seller/property/AddPropertyModal";
import { fetchSellerProperties } from "../../redux/action/sellerAction";
import {
    FetchSellerListingProperties,
    resetSellerListingProperties,
    setPropertiesActiveTab,
    setPropertiesListingPage,
} from "../../redux/slice/sellerSlice";
import { getTotalPages } from "../../helpers";
import { Pagination } from "../common/Pagination";
import useTranslationHook from "../hooks/useTranslationHook";

const Properties = () => {
    const dispatch = useDispatch();
    const { t } = useTranslationHook();

    const params = new URLSearchParams(location.search);
    const createAuction = params.get("createAuction");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const allTab = useSelector(
        (state) => state.seller?.properties.listing.data
    );
    const total = useSelector(
        (state) => state.seller?.properties.listing.total
    );
    const pageSize = useSelector(
        (state) => state.seller?.properties.listing.pageSize
    );
    const currentPage = useSelector(
        (state) => state.seller?.properties.listing.currentPage
    );
    const activeTab = useSelector(
        (state) => state.seller?.properties.listing.activeTab
    );
    const isAccountVerified = useSelector((state) => {
        const user = state.auth?.user;
        return user?.user_account_verification || user?.is_account_verified;
    });
    const propertiesDataLoading = useSelector(
        (state) => state.seller.propertiesDataLoading
    );
    const [data, setData] = useState([]);

    const totalPages = useMemo(() => {
        return getTotalPages(total, pageSize);
    }, [total, pageSize]);

    useEffect(() => {
        setData(allTab);
    }, [allTab, activeTab, currentPage]);

    useEffect(() => {
        propertiesDataLoading &&
            dispatch(
                fetchSellerProperties(SELLER_PROPERTY_STATUS[activeTab])
            ).then((response) => {
                const { data } = response || {};
                if (data?.data) dispatch(FetchSellerListingProperties(data));
            });
        // }
        //eslint-disable-next-line
    }, [propertiesDataLoading, activeTab]);

    useEffect(() => {
        dispatch(setPropertiesActiveTab(MY_PROPERTIES_TABS[0].key));
        if (createAuction) handleOpenModal();
        return () => dispatch(resetSellerListingProperties());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Breadcrumb
                links={[
                    { url: "/", name: t("Home") },
                    { url: "", name: t("My Properties") },
                ]}
            />
            <section className="discover-wrap">
                <div className="container py-5">
                    <div className="row">
                        <div
                            className="col-lg-12 wow fadeInUp"
                            data-wow-delay="0.5s"
                        >
                            <div className="main-heading">
                                <h3>{t("My Properties")}</h3>
                                {isAccountVerified ===
                                    accountStatus.success && (
                                    <button
                                        className="btn btn-primary btn-md"
                                        onClick={handleOpenModal}
                                    >
                                        {t("Add Property")}{" "}
                                        <img
                                            src="/img/plus-icon.svg"
                                            alt="Plus Icon"
                                            className="ml4"
                                        />
                                    </button>
                                )}
                            </div>
                            <Tabs
                                tab={MY_PROPERTIES_TABS}
                                data={data}
                                Component={Card}
                                className="property-list"
                                activeTab={activeTab}
                                fetchData={(key) =>
                                    dispatch(setPropertiesActiveTab(key))
                                }
                                isLoading={propertiesDataLoading}
                            />
                            {!propertiesDataLoading && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={(page) =>
                                        dispatch(setPropertiesListingPage(page))
                                    }
                                />
                            )}
                        </div>
                    </div>
                </div>
            </section>
            {isModalOpen && <AddPropertyModal onClose={handleCloseModal} />}
        </>
    );
};

export default Properties;
