import { createSlice } from "@reduxjs/toolkit";
import { discoverTabs } from "../../utils/constants";
const initialState = {
    total: 0,
    search: "",
    discoverData: [],
    filter_beds: [],
    filter_baths: [],
    construction_status: null,
    city: null,
    municipality: null,
    district: null,
    property_type: null,
    discoverLoading: false,
    page: {
        pageSize: 12,
        currentPage: 1,
    },
    activeTab: discoverTabs[0].key,
};

export const discoverSlice = createSlice({
    name: "discover",
    initialState,
    reducers: {
        setPage: (state, { payload }) => {
            return {
                ...state,
                page: {
                    ...state.page,
                    currentPage: payload,
                },
            };
        },
        setFilter: (state, { payload }) => {
            const {
                construction_status,
                search,
                filter_beds,
                filter_baths,
                property_type,
                city,
                district,
                municipality,
            } = payload;
            return {
                ...state,
                ...("search" in payload && { search }),
                ...("construction_status" in payload && {
                    construction_status,
                }),
                ...("city" in payload && { city }),
                ...("municipality" in payload && { municipality }),
                ...("district" in payload && { district }),
                ...("property_type" in payload && { property_type }),
                ...("filter_beds" in payload && { filter_beds }),
                ...("filter_baths" in payload && { filter_baths }),
                page: {
                    ...state.page,
                    currentPage: 1,
                },
            };
        },
        setDiscoverData: (state, { payload }) => {
            const { total, data } = payload;
            return {
                ...state,
                total,
                discoverData: data,
            };
        },
        handleDiscoverLoading: (state, { payload }) => {
            return {
                ...state,
                discoverLoading: payload,
            };
        },
        setActiveTab: (state, { payload }) => {
            return {
                ...state,
                activeTab: payload,
            };
        },
        resetFilter: () => {
            return initialState;
        },
    },
});
export const discoverAction = discoverSlice.actions;
export const {
    setPage,
    setFilter,
    resetFilter,
    setActiveTab,
    setDiscoverData,
    handleDiscoverLoading,
} = discoverSlice.actions;
export default discoverSlice;
