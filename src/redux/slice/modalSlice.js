import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    commonModal: false,
    deleteConfirmationModal: false,
    contactUsModal: false,
    retractBidModal: false,
    clearWatchListModal: false,
    highestBidderModal: false,
    auctionWonDeleteConfirmation: false,
    myBidDislikeConfirmation: false,
    activeBidDislikeConfirmation: false,
};

export const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        handleToggleModal: (state, { payload }) => {
            return {
                ...state,
                ...("commonModal" in payload && {
                    commonModal: payload.commonModal,
                }),
            };
        },
        handleDeleteConfirmationModal: (state, action) => {
            return {
                ...state,
                deleteConfirmationModal: action.payload,
            };
        },
        handleContactUsModal: (state, action) => {
            return {
                ...state,
                contactUsModal: action.payload,
            };
        },

        handleRetractBidModal: (state, action) => {
            return {
                ...state,
                retractBidModal: action.payload,
            };
        },
        handleClearWatchListModal: (state, action) => {
            return {
                ...state,
                clearWatchListModal: action.payload,
            };
        },
        handleHighestBidderModal: (state, action) => {
            return {
                ...state,
                highestBidderModal: action.payload,
            };
        },
        handleAuctionWonDeleteConfirmation: (state, action) => {
            return {
                ...state,
                auctionWonDeleteConfirmation: action.payload,
            };
        },
        handleMyBidDislikeConfirmation: (state, action) => {
            return {
                ...state,
                myBidDislikeConfirmation: action.payload,
            };
        },
    },
});

export const {
    handleToggleModal,
    handleDeleteConfirmationModal,
    handleContactUsModal,
    handleRetractBidModal,
    handleClearWatchListModal,
    handleHighestBidderModal,
    handleAuctionWonDeleteConfirmation,
    handleMyBidDislikeConfirmation,
} = modalSlice.actions;
export default modalSlice;
