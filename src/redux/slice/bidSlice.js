import { createSlice } from "@reduxjs/toolkit";
import { BID_TABS } from "../../utils/constants";
const initialState = {
    total: 0,
    bidData: [],
    bidLoading: true,
    homeBidData: [],
    homeBidLoading: true,
    page: {
        pageSize: 12,
        currentPage: 1,
    },
    activeTab: BID_TABS[0].key,
};

export const bidSlice = createSlice({
    name: "bid",
    initialState,
    reducers: {
        setPage: (state, { payload }) => {
            return {
                ...state,
                page: {
                    ...state.page,
                    currentPage: payload,
                },
                bidLoading: true,
            };
        },
        setBidData: (state, { payload }) => {
            const { total, data } = payload;
            return {
                ...state,
                total,
                bidData: data,
                bidLoading: false,
            };
        },
        handleBidLoading: (state, { payload }) => {
            return {
                ...state,
                bidLoading: payload,
            };
        },
        setHomeBidData: (state, { payload }) => {
            const { total, data } = payload;
            return {
                ...state,
                total,
                homeBidData: data,
                homeBidLoading: false,
            };
        },
        handleHomeBidLoading: (state, { payload }) => {
            return {
                ...state,
                homeBidLoading: payload,
            };
        },
        resetFilter: () => {
            return initialState;
        },
        toggleBidFavouriteStatus: (state, { payload }) => {
            const data = state.bidData.map((ele) =>
                ele.id === payload
                    ? { ...ele, is_favourite: !ele.is_favourite }
                    : ele
            );
            const homeData = state.homeBidData.map((ele) =>
                ele.id === payload
                    ? { ...ele, is_favourite: !ele.is_favourite }
                    : ele
            );
            return {
                ...state,
                bidData: data,
                homeBidData: homeData,
            };
        },
        setActiveTab: (state, { payload }) => {
            return {
                ...state,
                activeTab: payload,
                page: {
                    ...state.page,
                    currentPage: 1,
                },
            };
        },
    },
});
export const {
    setPage,
    resetFilter,
    setBidData,
    handleBidLoading,
    setHomeBidData,
    handleHomeBidLoading,
    setActiveTab,
    toggleBidFavouriteStatus,
} = bidSlice.actions;
export default bidSlice;
