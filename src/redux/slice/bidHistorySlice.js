import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    bidders: {},
    bids: {},
    offers: {},
    sellerBids: {},
    sellerBidders: {},
    sellerOffers: {},
    pagination: {
        bidders: {},
        bids: {},
    },
    highestBidder: {
        name: "",
        amount: 0,
    },
    parentProperty: null,
};

export const bidHistorySlice = createSlice({
    name: "bidHistory",
    initialState,
    reducers: {
        handleSellerBidHistory(state, action) {
            state.sellerBids = action.payload;
        },
        handleSellerOffersHistory(state, action) {
            state.sellerOffers = action.payload;
        },
        handleSellerBidderHistory(state, action) {
            state.sellerBidders = action.payload;
        },
        handleBidders(state, action) {
            const {
                property_detail: { id: propertyId },
                data: bidders,
                total,
                currentPage,
                pageSize = 10,
            } = action.payload;

            const existingBidders = state.bidders[propertyId] || [];
            const newBidders = bidders.filter(
                (bidder) =>
                    !existingBidders.some(
                        (existing) => existing.id === bidder.id
                    )
            );
            return {
                ...state,
                bidders: {
                    ...state.bidders,
                    [propertyId]: [...existingBidders, ...newBidders],
                },
                pagination: {
                    ...state.pagination,
                    bidders: {
                        ...state.pagination.bidders,
                        [propertyId]: { total, pageSize, currentPage },
                    },
                },
            };
        },
        handleBids(state, action) {
            const {
                property_detail: { id: propertyId },
                new_data: bidHistory,
                total,
                currentPage,
                pageSize = 10,
            } = action.payload;

            const existingBids = state.bids[propertyId] || [];
            const newBids = bidHistory.filter(
                (bid) =>
                    !existingBids.some((existing) => existing.id === bid.id)
            );

            return {
                ...state,
                bids: {
                    ...state.bids,
                    [propertyId]: [...existingBids, ...newBids],
                },
                pagination: {
                    ...state.pagination,
                    bids: {
                        ...state.pagination.bids,
                        [propertyId]: { total, pageSize, currentPage },
                    },
                },
            };
        },
        handleOffers(state, action) {
            const {
                property_detail: { id: propertyId },
                data: offerHistory,
                total,
                currentPage,
                pageSize = 10,
            } = action.payload;

            const existingOffers = state.offers[propertyId] || [];
            const newOffers = offerHistory.filter(
                (bid) =>
                    !existingOffers.some((existing) => existing.id === bid.id)
            );
            return {
                ...state,
                offers: {
                    ...state.offers,
                    [propertyId]: [...existingOffers, ...newOffers],
                },
                pagination: {
                    ...state.pagination,
                    offers: {
                        ...state.pagination.offers,
                        [propertyId]: { total, pageSize, currentPage },
                    },
                },
            };
        },
        handleHighestBidder(state, action) {
            return {
                ...state,
                highestBidder: {
                    ...state.highestBidder,
                    ...action.payload,
                },
            };
        },
        handleParentProperty(state, action) {
            return {
                ...state,
                ...initialState,
                parentProperty: action.payload,
            };
        },
    },
});

export const { handleParentProperty } = bidHistorySlice.actions;

export default bidHistorySlice;
