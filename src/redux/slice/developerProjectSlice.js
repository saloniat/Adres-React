import { createSlice } from "@reduxjs/toolkit";
import { PROJECT_PROPERTY_TABS } from "../../utils/constants";

const initialState = {
    projectStatus: [],
    projectList: { total: 0, data: [] },
    projectListLoading: true,
    projectProperties: {
        total: 0,
        data: [],
        activeTab: PROJECT_PROPERTY_TABS[0].key,
    },
    projectPropertiesLoading: true,
    projectDetail: null,
    siteLoader: false,
    featuredProjects: { total: 0, data: [] },
    featuredProjectLoading: true,
    otherProjects: { total: 0, data: [] },
    otherProjectLoading: true,
    projectsLoading: true,
    page: {
        currentPage: 1,
        pageSize: 12,
    },
    city: null,
    municipality: null,
    district: null,
    status: null,
};

export const developerProjectSlice = createSlice({
    name: "developerProject",
    initialState,
    reducers: {
        handleSiteLoader: (state, action) => {
            return {
                ...state,
                siteLoader: action.payload,
            };
        },
        handleProjectStatus: (state, action) => {
            return {
                ...state,
                projectStatus: action.payload,
            };
        },
        handleProjectList: (state, action) => {
            return {
                ...state,
                projectList: action.payload,
                projectListLoading: false,
            };
        },
        handleClearProjectList: (state) => {
            return {
                ...state,
                projectListLoading: true,
            };
        },
        handleProjectDetail: (state, action) => {
            return {
                ...state,
                projectDetail: action.payload,
            };
        },
        handleProjectProperty: (state, action) => {
            const { total, data } = action.payload;
            return {
                ...state,
                projectPropertiesLoading: false,
                projectProperties: {
                    ...state.projectProperties,
                    total,
                    data,
                },
            };
        },
        handleClearProjectProperty: (state) => {
            return {
                ...state,
                projectPropertiesLoading: true,
            };
        },
        handleClearProjectDetail: (state) => {
            return {
                ...state,
                projectDetail: null,
            };
        },
        handleFeaturedProjects: (state, action) => {
            return {
                ...state,
                featuredProjects: action.payload,
                featuredProjectLoading: false,
            };
        },
        handleOtherProjects: (state, action) => {
            return {
                ...state,
                otherProjects: action.payload,
                otherProjectLoading: false,
            };
        },
        handlePage: (state, action) => {
            return {
                ...state,
                page: {
                    ...state.page,
                    currentPage: action.payload,
                },
            };
        },
        setActiveTab: (state, { payload }) => {
            return {
                ...state,
                projectProperties: {
                    ...state.projectProperties,
                    activeTab: payload,
                },
            };
        },
        resetActiveTab: (state) => {
            return {
                ...state,
                projectProperties: initialState.projectProperties,
            };
        },
        resetPagination: (state) => {
            return {
                ...state,
                page: initialState.page,
            };
        },
        setFilter: (state, { payload }) => {
            const { city, district, municipality, status } = payload;
            return {
                ...state,
                ...("city" in payload && { city }),
                ...("municipality" in payload && { municipality }),
                ...("district" in payload && { district }),
                ...("status" in payload && { status }),

                page: {
                    ...state.page,
                    currentPage: 1,
                },
            };
        },
        resetFilter: (state) => {
            return {
                ...state,
                city: null,
                municipality: null,
                district: null,
                status: null,
                page: {
                    ...state.page,
                },
            };
        },
    },
});

export const {
    setActiveTab,
    resetActiveTab,
    handleClearProjectList,
    handlePage,
    resetPagination,
    resetFilter,
    setFilter,
} = developerProjectSlice.actions;
export default developerProjectSlice;
