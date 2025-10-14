import React, { useEffect, useState } from "react";
import { accountStatus } from "../../utils/constants";
import MyPropertiesCard from "./common/MyPropertiesCard";
import { useNavigate } from "react-router-dom";
import { fetchSellerProperties } from "../../redux/action/sellerAction";
import { useDispatch, useSelector } from "react-redux";
import Shimmer from "../common/shimmer/Shimmer";
import AddPropertyModal from "../seller/property/AddPropertyModal";
import {
    FetchSellerHomeProperties,
    resetAuctionTab,
    resetSellerHomeProperties,
    resetSellerListingProperties,
    // setAuctionActiveTab,
} from "../../redux/slice/sellerSlice";
import useTranslationHook from "../hooks/useTranslationHook";

const SellerHomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const properties = useSelector(
        (state) => state.seller.properties.home.properties
    );
    // const activeTab = useSelector(
    //     (state) => state.seller.properties.home.auction.activeTab
    // );
    // const data = useSelector(
    //     (state) => state.seller.properties.home.auction.data
    // );

    const isAccountVerified = useSelector((state) => {
        const user = state.auth?.user;
        return user?.user_account_verification || user?.is_account_verified;
    });

    const sellerHomePropertiesDataLoading = useSelector(
        (state) => state.seller.sellerHomePropertiesDataLoading
    );
    const { t } = useTranslationHook();

    useEffect(() => {
        return () => {
            dispatch(resetSellerHomeProperties());
        };
    }, []);

    useEffect(() => {
        if (sellerHomePropertiesDataLoading) {
            dispatch(fetchSellerProperties()).then((response) => {
                const { data } = response || {};
                if (data?.data) dispatch(FetchSellerHomeProperties(data));
            });
        }
        //eslint-disable-next-line
    }, [sellerHomePropertiesDataLoading]);

    const [state, setState] = useState({
        // auctionData: data,
        isModalOpen: false,
    });

    useEffect(() => {
        dispatch(resetAuctionTab());
    }, []);

    // useEffect(() => {
    //     setState((prev) => ({
    //         ...prev,
    //         auctionData: data.filter((ele) => ele.status === activeTab),
    //     }));
    // }, [activeTab]);

    return (
        <>
            <section className="bids-wrap">
                <div className="container pb-5">
                    <div className="row">
                        <div
                            className="col-lg-12 wow fadeInUp"
                            data-wow-delay="0.5s"
                        >
                            <div className="main-heading">
                                <h3>
                                    <span>{t("My Properties")}</span>
                                </h3>
                                {properties?.data?.length > 2 ? (
                                    <button
                                        className="see-link"
                                        onClick={() => {
                                            navigate("my-properties");
                                            dispatch(
                                                resetSellerListingProperties()
                                            );
                                        }}
                                    >
                                        {t("See all")}
                                        <img
                                            src="img/arrow-r.svg"
                                            alt="arrow right"
                                        />
                                    </button>
                                ) : (
                                    <div
                                        className="tooltip-wrapper"
                                        data-toggle="tooltip"
                                        data-placement="top"
                                        title={
                                            isAccountVerified !==
                                            accountStatus.success
                                                ? t(
                                                      "Please verified your account to proceed."
                                                  )
                                                : ""
                                        }
                                    >
                                        <button
                                            className="btn btn-primary btn-md"
                                            disabled={
                                                isAccountVerified !==
                                                accountStatus.success
                                            }
                                            onClick={() =>
                                                setState((prev) => ({
                                                    ...prev,
                                                    isModalOpen: true,
                                                }))
                                            }
                                        >
                                            {t("Add Property")}
                                            <img
                                                src="/img/plus-icon.svg"
                                                alt="Plus Icon"
                                                className="ml4"
                                            />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <ul className="bids-list">
                                {sellerHomePropertiesDataLoading ? (
                                    <li className="bidfull">
                                        {[1, 2].map((element, index) => (
                                            <Shimmer
                                                key={index}
                                                type="rectangle"
                                                height="50vh"
                                                borderRadius="10%"
                                            />
                                        ))}
                                    </li>
                                ) : properties?.data?.length > 0 ? (
                                    properties.data
                                        ?.slice(0, 2)
                                        .map((ele, ind) => (
                                            <MyPropertiesCard
                                                ele={ele}
                                                key={ind}
                                            />
                                        ))
                                ) : (
                                    <li className="full text-center">
                                        <img
                                            src="/img/no-property-found.png"
                                            alt={t("No properties found")}
                                        />
                                        <h6>{t("No properties found")}</h6>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
            {state.isModalOpen && (
                <AddPropertyModal
                    onClose={() =>
                        setState((prev) => ({
                            ...prev,
                            isModalOpen: false,
                        }))
                    }
                />
            )}
        </>
    );
};

export default SellerHomePage;
