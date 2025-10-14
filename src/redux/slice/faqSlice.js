import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    buyerData: {
        data: [],
        page: 1,
        totalPage: 1,
        pageSize: 5,
        buyerDataLoading: true,
    },
    sellerData: {
        data: [],
        page: 1,
        totalPage: 1,
        pageSize: 10,
        sellerDataLoading: true,
    },
    tabIndex: 1,
};

export const faqSlice = createSlice({
    name: "faq",
    initialState,
    reducers: {
        handleTabIndex: (state, action) => {
            return {
                ...state,
                tabIndex: action.payload,
            };
        },
        handlePage: (state, action) => {
            return {
                ...state,
                ...(state.tabIndex === 1 && {
                    buyerData: {
                        ...state.buyerData,
                        page: action.payload,
                        buyerDataLoading: true,
                    },
                }),

                ...(state.tabIndex === 2 && {
                    sellerData: {
                        ...state.sellerData,
                        page: action.payload,
                        sellerDataLoading: true,
                    },
                }),
            };
        },
        handleFaqData: (state, action) => {
            return {
                ...state,
                ...(state.tabIndex === 1 && {
                    buyerData: {
                        ...state.buyerData,
                        data: action.payload.data,
                        ...(action.payload.total && {
                            totalPage:
                                Math.floor(
                                    action.payload.total /
                                        state.buyerData.pageSize
                                ) +
                                (action.payload.total %
                                    state.buyerData.pageSize >
                                0
                                    ? 1
                                    : 0),
                        }),
                        buyerDataLoading: false,
                    },
                }),
                ...(state.tabIndex === 2 && {
                    sellerData: {
                        ...state.sellerData,
                        data: action.payload.data,
                        ...(action.payload.total && {
                            totalPage:
                                Math.floor(
                                    action.payload.total /
                                        state.sellerData.pageSize
                                ) +
                                (action.payload.total %
                                    state.sellerData.pageSize >
                                0
                                    ? 1
                                    : 0),
                        }),
                        sellerDataLoading: false,
                    },
                }),
            };
        },
    },
});

export const { handleTabIndex, handlePage, handleFaqData } = faqSlice.actions;
export default faqSlice;
