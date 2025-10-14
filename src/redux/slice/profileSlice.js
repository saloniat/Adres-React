import { createSlice } from "@reduxjs/toolkit";
import { ACCOUNT, FAVOURITE_WISHLIST_TABS } from "../../utils/constants";
const initialState = {
    account: ACCOUNT.Buyer,
    isProfileEdit: false,
    isPlayBidSound: false,
    isPersonalInfoUpdate: false,
    favourite: {
        data: [],
        favouriteLoading: false,
        activeTab: FAVOURITE_WISHLIST_TABS[0].key,
    },
    watchlist: {
        data: [],
        watchlistLoading: false,
        activeTab: FAVOURITE_WISHLIST_TABS[0].key,
        clearAllWatchlist: false,
        selectedProperty: "",
    },
    page: {
        currentPage: 1,
        pageSize: 12,
    },
    total: 0,
    showOptModal: false,
};

export const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        handleTogglePlayBidSound: (state, action) => {
            state.isPlayBidSound = action.payload;
        },
        handleSwitchAccount: (state, action) => {
            return {
                ...state,
                account: action.payload,
            };
        },
        handleProfileEdit: (state, action) => {
            return {
                ...state,
                isProfileEdit: action.payload,
            };
        },
        handlePersonalInfoUpdate: (state, action) => {
            return {
                ...state,
                isPersonalInfoUpdate: action.payload,
            };
        },
        handleFavouritePageAction: (state, { payload }) => {
            const { data, activeTab, favouriteLoading, total } = payload;
            return {
                ...state,
                favourite: {
                    ...state.favourite,
                    ...(data && { data }),
                    ...(activeTab && { activeTab }),
                    ...("favouriteLoading" in payload && { favouriteLoading }),
                },
                total: total,
                ...(activeTab && {
                    page: {
                        ...state.page,
                        currentPage: 1,
                    },
                }),
            };
        },
        removeFavourite: (state, { payload }) => {
            const updatedFavourites = state.favourite.data?.filter(
                (ele) => ele.property !== payload
            );
            return {
                ...state,
                favourite: {
                    ...state.favourite,
                    data: updatedFavourites,
                },
            };
        },
        handleWatchlistPageAction: (state, { payload }) => {
            const {
                data,
                activeTab,
                watchlistLoading,
                clearAllWatchlist,
                total,
                selectedProperty,
            } = payload;
            return {
                ...state,
                watchlist: {
                    ...state.watchlist,
                    ...(data && { data }),
                    ...(activeTab && { activeTab }),
                    ...("clearAllWatchlist" in payload && clearAllWatchlist),
                    ...("watchlistLoading" in payload && { watchlistLoading }),
                    ...(selectedProperty && { selectedProperty }),
                },
                total: total,
                ...(activeTab && {
                    page: {
                        ...state.page,
                        currentPage: 1,
                    },
                }),
            };
        },
        removeFromWatchlist: (state, { payload }) => {
            const updatedWatchlist = state.watchlist.data?.filter(
                (ele) => ele.property_id !== payload
            );
            return {
                ...state,
                watchlist: {
                    ...state.watchlist,
                    data: updatedWatchlist,
                },
            };
        },
        setPage: (state, action) => {
            return {
                ...state,
                page: {
                    ...state.page,
                    currentPage: action.payload,
                },
            };
        },
        handleOtpModal: (state, action) => {
            return {
                ...state,
                showOptModal: action.payload,
            };
        },
    },
});

export const {
    setPage,
    removeFavourite,
    removeFromWatchlist,
    handleWatchlistPageAction,
    handleFavouritePageAction,
    handlePersonalInfoUpdate,
    handleOtpModal,
} = profileSlice.actions;
export default profileSlice;
