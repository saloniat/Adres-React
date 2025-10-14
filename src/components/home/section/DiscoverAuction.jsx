import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Tabs from "../../common/Tabs";
import {
    DISCOVER_TABS,
    DOMAIN,
    FAVOURITE_WISHLIST_TABS,
    RECENTLY_CLOSED_LISTING,
    REGULAR,
} from "../../../utils/constants";
import DiscoverCard from "../common/DiscoverCard";
import { handleDiscoverAuctions } from "../../../redux/action/buyerAction";

import {
    increamentRunCount,
    resetTabData,
    setActiveTab,
    setHomeDiscoverLoading,
    setTabData,
} from "../../../redux/slice/buyerSlice";
import { favouritesUrl, getTotalPages, watchlistUrl } from "../../../helpers";
import {
    handleFavouritePageAction,
    handleWatchlistPageAction,
    setPage,
} from "../../../redux/slice/profileSlice";
import {
    fetchFavouriteList,
    fetchWatchList,
    handleDeleteFromWatchlist,
} from "../../../redux/action/profileAction";
import { Pagination } from "../../common/Pagination";
import DeleteConfirmationModal from "../../common/DeleteConfirmationModal";
import {
    handleClearWatchListModal,
    handleDeleteConfirmationModal,
} from "../../../redux/slice/modalSlice";
import useSocketSync from "../../hooks/useSocketSync";
import useTranslationHook from "../../hooks/useTranslationHook";
import { discoverAction } from "../../../redux/slice/discoverSlice";

const DiscoverAuction = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { t } = useTranslationHook();

    const isFavourite = useMemo(
        () => location.pathname.includes(favouritesUrl),
        [location.pathname]
    );
    const isWatchlist = useMemo(
        () => location.pathname.includes(watchlistUrl),
        [location.pathname]
    );
    const sectionTitle = isFavourite
        ? "Favourite Properties"
        : isWatchlist
          ? "My Watchlist"
          : "Discover Auctions";
    const [resetComplete, setResetComplete] = useState(false);
    const user = useSelector((state) => state.auth.user, shallowEqual);
    const currentPage = useSelector((state) => state.profile.page.currentPage);
    const pageSize = useSelector((state) => state.profile.page.pageSize);
    const selectedProperty = useSelector(
        (state) => state.profile.watchlist.selectedProperty
    );
    const total = useSelector((state) => state.profile.total);
    const homeLiveAuction = useSelector((state) => state.buyer.homeLiveAuction);
    const clearWatchListModal = useSelector(
        (state) => state.modal.clearWatchListModal
    );
    // The isFetched flag is used to determine whether the data has already been loaded.
    const isFetched = useSelector(
        (state) => state.buyer.isFetched,
        shallowEqual
    );
    const runCount = useSelector((state) => state.buyer.runCount, shallowEqual);
    const homeDiscoverLoading = useSelector((state) =>
        isFavourite
            ? state.profile.favourite.favouriteLoading
            : isWatchlist
              ? state.profile.watchlist.watchlistLoading
              : state.buyer.homeDiscoverLoading
    );
    const activeTab = useSelector((state) =>
        isFavourite
            ? state.profile.favourite.activeTab
            : isWatchlist
              ? state.profile.watchlist.activeTab
              : state.buyer.activeTab
    );
    const tabData = useSelector((state) =>
        isFavourite
            ? state.profile.favourite.data
            : isWatchlist
              ? state.profile.watchlist.data
              : state.buyer.tabData[activeTab]
    );
    const totalPages = useMemo(() => {
        return getTotalPages(total, pageSize);
    }, [total, pageSize]);

    useEffect(() => {
        if (user && runCount === 0) {
            dispatch(resetTabData());
            setResetComplete(false);
            dispatch(increamentRunCount());
        }
    }, [user]);

    useEffect(() => {
        return () =>
            dispatch(
                isFavourite
                    ? handleFavouritePageAction({
                          activeTab: FAVOURITE_WISHLIST_TABS[0].key,
                      })
                    : isWatchlist
                      ? handleWatchlistPageAction({
                            activeTab: FAVOURITE_WISHLIST_TABS[0].key,
                        })
                      : setActiveTab(DISCOVER_TABS[0].key)
            );
        //eslint-disable-next-line
    }, [isFavourite, isWatchlist]);

    useEffect(() => {
        if (!resetComplete) {
            setResetComplete(true);
            return;
        }
        const abortController = new AbortController();
        const signal = abortController.signal;
        (async () => {
            if (isFetched[activeTab] && !isFavourite && !isWatchlist) return;
            dispatch(
                isFavourite
                    ? handleFavouritePageAction({ favouriteLoading: true })
                    : isWatchlist
                      ? dispatch(
                            handleWatchlistPageAction({
                                watchlistLoading: true,
                            })
                        )
                      : setHomeDiscoverLoading(true)
            );
            const response = await dispatch(
                isFavourite
                    ? fetchFavouriteList(
                          {
                              domain: DOMAIN,
                              page_size: pageSize,
                              page: currentPage,
                              search: "",
                              //   ...(activeTab !==
                              //   FAVOURITE_WISHLIST_TABS[0].key && {
                              filter: activeTab,
                              //   }),
                              ...(user?.user_id && {
                                  user: Number(user.user_id),
                              }),
                          },
                          signal
                      )
                    : isWatchlist
                      ? fetchWatchList(
                            {
                                page_size: pageSize,
                                page: currentPage,
                                // ...(activeTab !==
                                //     FAVOURITE_WISHLIST_TABS[0].key && {
                                filter: activeTab,
                                // }),
                                ...(user?.user_id && {
                                    user_id: Number(user.user_id),
                                }),
                                ...(user?.site_id && {
                                    site_id: Number(user.site_id),
                                }),
                            },
                            signal
                        )
                      : handleDiscoverAuctions(
                            {
                                site_id: 3,
                                page_size: 6,
                                search: "",
                                short_by: "",
                                sort_order: "asc",
                                filter: activeTab,
                                ...(user?.user_id && {
                                    user_id: Number(user.user_id),
                                }),
                            },
                            signal
                        )
            );

            dispatch(
                isFavourite
                    ? handleFavouritePageAction({
                          favouriteLoading: false,
                      })
                    : isWatchlist
                      ? handleWatchlistPageAction({
                            watchlistLoading: false,
                        })
                      : setHomeDiscoverLoading(false)
            );
            if (response?.data?.data) {
                dispatch(
                    isFavourite
                        ? handleFavouritePageAction({
                              data: response.data.data,
                              total: response.data?.total
                                  ? response.data.total
                                  : 0,
                          })
                        : isWatchlist
                          ? handleWatchlistPageAction({
                                data: response.data.data,
                                total: response.data?.total
                                    ? response.data.total
                                    : 0,
                            })
                          : setTabData({
                                tab: activeTab,
                                data: response.data.data,
                            })
                );
            }
        })();
        return () => abortController.abort();
        //eslint-disable-next-line
    }, [activeTab, isFavourite, isWatchlist, currentPage, resetComplete]);

    const handleTabChange = useCallback(
        (key) => {
            dispatch(
                isFavourite
                    ? handleFavouritePageAction({
                          activeTab: key,
                      })
                    : isWatchlist
                      ? handleWatchlistPageAction({
                            activeTab: key,
                        })
                      : setActiveTab(key)
            );
        },
        //eslint-disable-next-line
        [isFavourite, isWatchlist]
    );
    const handleModalConfirm = () => {
        const formData = {
            domain_id: 3,
            user_id: user.user_id,
            property_id: selectedProperty,
        };
        dispatch(handleDeleteFromWatchlist(formData));
        dispatch(handleDeleteConfirmationModal(false));
    };
    const handleClearAll = () => {
        const formData = {
            domain_id: 3,
            user_id: user.user_id,
            clear_all: 1,
        };
        dispatch(handleDeleteFromWatchlist(formData));
    };

    const syncData = useSocketSync(tabData, user?.user_id, "discoverSync");

    return (
        <>
            <section
                className={`discover-wrap ${sectionTitle === "Discover Auctions" && !homeLiveAuction?.length ? "pt-5" : ""}`}
            >
                <div
                    className={`container ${isFavourite || isWatchlist ? "py-5" : "pb-5"}`}
                >
                    <div className="row">
                        <div
                            className={`col-lg-12 ${
                                !homeLiveAuction?.length ? "" : "wow fadeInUp"
                            } `}
                            {...(!homeLiveAuction?.length
                                ? {}
                                : { "data-wow-delay": "0.5s" })}
                        >
                            <div className="main-heading">
                                <h3>
                                    <span
                                        {...((isFavourite || isWatchlist) && {
                                            className: "favTitle",
                                        })}
                                    >
                                        {t(sectionTitle)}
                                    </span>
                                </h3>
                                {isWatchlist && (
                                    <button
                                        className="btn btn-primary"
                                        disabled={!tabData?.length}
                                        onClick={() =>
                                            dispatch(
                                                handleClearWatchListModal(true)
                                            )
                                        }
                                    >
                                        {t("Clear All")}
                                    </button>
                                )}
                            </div>
                            <Tabs
                                tab={
                                    isFavourite || isWatchlist
                                        ? FAVOURITE_WISHLIST_TABS
                                        : DISCOVER_TABS
                                }
                                data={tabData}
                                Component={DiscoverCard}
                                className="discover-list"
                                activeTab={activeTab}
                                isLoading={homeDiscoverLoading}
                                fetchData={handleTabChange}
                                syncData={syncData}
                            />
                            {!isFavourite && !isWatchlist && (
                                <div
                                    className="col-lg-12 center"
                                    onClick={() => {
                                        if (
                                            activeTab ===
                                            RECENTLY_CLOSED_LISTING
                                        ) {
                                            dispatch(
                                                discoverAction.setActiveTab(
                                                    RECENTLY_CLOSED_LISTING
                                                )
                                            );
                                        } else {
                                            dispatch(
                                                discoverAction.setActiveTab(
                                                    REGULAR
                                                )
                                            );
                                        }
                                    }}
                                >
                                    <Link
                                        to="/discover"
                                        className="btn btn-primary btn-lg"
                                    >
                                        {t("Explore More Properties")}
                                    </Link>
                                </div>
                            )}
                            {(isWatchlist || isFavourite) &&
                                !homeDiscoverLoading && (
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={(page) =>
                                            dispatch(setPage(page))
                                        }
                                    />
                                )}
                        </div>
                    </div>
                </div>
            </section>

            <DeleteConfirmationModal
                title={t("Remove from watchlist?")}
                content={t(
                    "Are you sure about removing it from your watchlist collections?"
                )}
                handleModalCancel={() =>
                    dispatch(handleDeleteConfirmationModal(false))
                }
                handleModalConfirm={() => {
                    handleModalConfirm();
                }}
            />
            {/* clear watchlist Modal */}
            <DeleteConfirmationModal
                show={clearWatchListModal}
                title={t("Delete All Watchlist Items?")}
                content={t(
                    "This action will remove all properties from your watchlist. This cannot be undone."
                )}
                handleModalCancel={() =>
                    dispatch(handleClearWatchListModal(false))
                }
                handleModalConfirm={() => {
                    handleClearAll();
                }}
            />
        </>
    );
};

export default DiscoverAuction;
