import { createSlice } from "@reduxjs/toolkit";
import { DISCOVER_TABS } from "../../utils/constants";
const initialState = {
    tabData: {},
    isFetched: {},
    homeDiscoverLoading: false,
    activeTab: DISCOVER_TABS[0].key,
    runCount: 0,
    homeLiveAuction: [],
    homeLiveAuctionLoading: true,
    wonAuction: [],
    dislikedId: 0,
};

export const buyerSlice = createSlice({
    name: "buyer",
    initialState,
    reducers: {
        setHomeDiscoverLoading: (state, { payload }) => {
            return {
                ...state,
                homeDiscoverLoading: payload,
            };
        },
        setTabData: (state, { payload }) => {
            const { tab, data } = payload;
            state.tabData[tab] = data;
            //commenting the below line because We want the data to reload on every click to prevent relying on previously fetched data.
            // state.isFetched[tab] = true;
        },
        setActiveTab: (state, { payload }) => {
            return {
                ...state,
                activeTab: payload,
            };
        },
        resetTabData: () => {
            return initialState;
        },
        toggleFavouriteStatus: (state, { payload }) => {
            const updatedTabData = state.tabData[state.activeTab]?.map(
                (ele) => ({
                    ...ele,
                    ...(ele.id === payload && {
                        is_favourite: !ele.is_favourite,
                    }),
                })
            );
            return {
                ...state,
                tabData: {
                    ...state.tabData,
                    [state.activeTab]: updatedTabData,
                },
            };
        },
        increamentRunCount: (state) => {
            state.runCount += 1;
        },
        setHomeLiveAucData: (state, { payload }) => {
            const { total, data } = payload;
            return {
                ...state,
                total,
                homeLiveAuction: data,
                homeLiveAuctionLoading: false,
            };
        },
        setWonAuctionData: (state, { payload }) => {
            return {
                ...state,
                wonAuction: payload,
            };
        },
        handleHomeLiveAucLoading: (state, { payload }) => {
            return {
                ...state,
                homeLiveAuctionLoading: payload,
            };
        },
        handleDislikedId: (state, { payload }) => {
            return {
                ...state,
                dislikedId: payload.id,
                ...(payload.data && {
                    wonAuction: {
                        ...state.wonAuction,
                        data: payload.data,
                    },
                }),
            };
        },
    },
});
export const {
    setHomeDiscoverLoading,
    toggleFavouriteStatus,
    setActiveTab,
    setTabData,
    resetTabData,
    increamentRunCount,
    setHomeLiveAucData,
    handleHomeLiveAucLoading,
    handleDislikedId,
} = buyerSlice.actions;
export default buyerSlice;
