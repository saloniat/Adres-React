import { createSlice } from "@reduxjs/toolkit";
import {
    MY_AUCTION_TABS,
    MY_PROPERTIES_TABS,
    SELLER_MY_AUCTION_TABS,
} from "../../utils/constants";

const initialState = {
    auctionStatus: [],
    constructionStatus: [],
    countries: [],
    amenities: [],
    tags: [],
    cities: [],
    municipalities: [],
    districts: [],
    projects: [],
    communitys: [],
    propertyTypes: [],
    similarProperty: [],
    properties: {
        home: {
            properties: {
                data: [],
            },
        },
        auction: {
            total: 0,
            data: [],
            pageSize: 12,
            currentPage: 1,
            activeTab: SELLER_MY_AUCTION_TABS[0].key,
        },
        listing: {
            total: 0,
            data: [],
            pageSize: 12,
            currentPage: 1,
            activeTab: MY_PROPERTIES_TABS[0].key,
        },
    },
    sellerHomePropertiesDataLoading: true,
    propertiesDataLoading: true,
    sellerAuctionPropertiesDataLoading: true,
    property: {
        step: null,
        modalStep: 1,
        showPlaceBidModal: false,
        propertyData: [],
        auction: {
            step: 1,
            isEdit: false,
            stepOneData: {
                start_price: null,
                deposit_amount: null,
                reserve_amount: null,
                buyer_preference: "1",
                full_amount: null,
                bid_increments: null,
                sell_at_full_amount_status: false,
                start_date: null,
                start_time: "00:00",
                end_date: null,
                end_time: "00:00",
                is_featured: "yes",
                bid_increment_status: true,
            },
        },
        stepOneData: [
            {
                ownerName: "",
                nationality: "",
                eid: "",
                dob: null,
                phone: "",
                email: "",
                sharePercentage: "",
                useEID: "true",
            },
        ],
        stepTwoData: {
            country: 4,
            property_name: null,
            property_name_ar: null,
            city: null,
            municipality: null,
            district: null,
            project: null,
            community: "",
            propertyType: null,
            building: "",
            map_url: null,
        },
        stepThreeData: {
            areaSize: "",
            numOfBedrooms: null,
            numOfBathrooms: null,
            numOfParkings: null,
            vacancy: null,
            rentalTill: null,
            constructionStatus: null,
            amenities: null,
            description: "",
            description_ar: "",
        },
        stepFourData: {
            documents: { titleDeed: null, floorPlans: null },
            gallery: { coverImage: null, propertyImage: [], video: null },
        },
    },
};

export const sellerSlice = createSlice({
    name: "seller",
    initialState,
    reducers: {
        handleSetFormStep(state, action) {
            state.property.step = action.payload;
        },
        handleAuctionFormStep(state, action) {
            return {
                ...state,
                property: {
                    ...state.property,
                    auction: {
                        ...state.property.auction,
                        step: action.payload,
                    },
                },
            };
        },
        FetchSellerHomeProperties: (state, action) => {
            const { data } = action.payload;
            return {
                ...state,
                properties: {
                    ...state.properties,
                    home: {
                        ...state.properties.home,
                        properties: {
                            data,
                        },
                    },
                },
                sellerHomePropertiesDataLoading: false,
            };
        },
        FetchSellerListingProperties: (state, action) => {
            const { data, total } = action.payload;
            return {
                ...state,
                properties: {
                    ...state.properties,
                    listing: {
                        ...state.properties.listing,
                        data,
                        total,
                    },
                },
                propertiesDataLoading: false,
            };
        },
        FetchSellerAuctionProperties: (state, action) => {
            const { data, total } = action.payload;
            return {
                ...state,
                properties: {
                    ...state.properties,
                    auction: {
                        ...state.properties.auction,
                        data,
                        total,
                    },
                },
                sellerAuctionPropertiesDataLoading: false,
            };
        },
        setAuctionListingPage: (state, { payload }) => {
            return {
                ...state,
                properties: {
                    ...state.properties,
                    listing: {
                        ...state.properties.auction,
                        currentPage: payload,
                    },
                },
            };
        },
        setPropertiesListingPage: (state, { payload }) => {
            return {
                ...state,
                properties: {
                    ...state.properties,
                    listing: {
                        ...state.properties.listing,
                        currentPage: payload,
                    },
                },
            };
        },
        resetSellerHomeProperties: (state) => {
            return {
                ...state,
                properties: {
                    ...state.properties,
                    home: {
                        ...initialState.properties.home,
                    },
                },
                sellerHomePropertiesDataLoading: true,
            };
        },
        resetSellerListingProperties: (state) => {
            return {
                ...state,
                properties: {
                    ...state.properties,
                    listing: initialState.properties.listing,
                },
                propertiesDataLoading: true,
            };
        },
        resetSellerAuctionProperties: (state) => {
            return {
                ...state,
                properties: {
                    ...state.properties,
                    listing: initialState.properties.auction,
                },
                sellerAuctionPropertiesDataLoading: true,
            };
        },
        resetAuctionTab: (state) => {
            return {
                ...state,
                properties: {
                    ...state.properties,
                    auction: {
                        ...state.properties.auction,
                        auction: initialState.properties.auction,
                    },
                },
            };
        },
        setAuctionActiveTab: (state, { payload }) => {
            return {
                ...state,
                properties: {
                    ...state.properties,
                    auction: {
                        ...state.properties.auction,
                        activeTab: payload,
                    },
                },
                sellerAuctionPropertiesDataLoading: true,
            };
        },
        setPropertiesActiveTab: (state, { payload }) => {
            return {
                ...state,
                properties: {
                    ...state.properties,
                    listing: {
                        ...state.properties.listing,
                        activeTab: payload,
                    },
                },
                propertiesDataLoading: true,
            };
        },
        handleSetAuctionStaus: (state, action) => {
            state.auctionStatus = action.payload;
        },
        handleSetCountries: (state, action) => {
            state.countries = action.payload;
        },
        handleSetCities: (state, action) => {
            state.cities = action.payload;
        },
        handleSetMunicipalities: (state, action) => {
            state.municipalities = action.payload;
        },
        handleSetDistricts: (state, action) => {
            state.districts = action.payload;
        },
        handleSetProjects: (state, action) => {
            state.projects = action.payload;
        },
        handleSetCommunitys: (state, action) => {
            state.communitys = action.payload;
        },
        handleSetTags: (state, action) => {
            state.tags = action.payload;
        },
        handleSetAmenities: (state, action) => {
            state.amenities = action.payload;
        },
        handleSetPropertyType: (state, action) => {
            state.propertyTypes = action.payload;
        },
        handleSimilarProperty: (state, action) => {
            state.similarProperty = action.payload;
        },
        handleSetConstructionStatus(state, action) {
            state.constructionStatus = action.payload;
        },
        handleSetPropertyCity(state, action) {
            state.property.stepTwoData.city = action.payload;
        },
        handlePropertyData(state, action) {
            return {
                ...state,
                property: {
                    ...state.property,
                    propertyData: action.payload,
                },
            };
        },
        handleEditOnAuction(state, action) {
            return {
                ...state,
                property: {
                    ...state.property,
                    auction: {
                        ...state.property.auction,
                        isEdit: action.payload,
                    },
                },
            };
        },
        handleAuctionStepOneData(state, action) {
            return {
                ...state,
                property: {
                    ...state.property,
                    auction: {
                        ...state.property.auction,
                        stepOneData: action.payload,
                    },
                },
            };
        },
        handleSaveStepOneData(state, action) {
            return {
                ...state,
                property: {
                    ...state.property,
                    stepOneData: action.payload,
                },
            };
        },
        handleSaveStepTwoData(state, action) {
            return {
                ...state,
                property: {
                    ...state.property,
                    stepTwoData: action.payload,
                },
            };
        },
        handleSaveStepThreeData(state, action) {
            return {
                ...state,
                property: {
                    ...state.property,
                    stepThreeData: action.payload,
                },
            };
        },
        handleSaveStepFourData(state, action) {
            const { section, operation, data, index, property } =
                action.payload;
            const stepFourData = { ...state.property.stepFourData };

            if (section === "gallery") {
                const currentGallery = { ...stepFourData.gallery };
                if (Array.isArray(currentGallery[property])) {
                    switch (operation) {
                        case "add":
                            currentGallery[property] = Array.from(
                                new Map(
                                    [...currentGallery[property], data].map(
                                        (item) => [item.upload_id, item]
                                    )
                                ).values()
                            );
                            break;
                        case "update":
                            if (
                                index !== null &&
                                index < currentGallery[property].length
                            ) {
                                currentGallery[property] = currentGallery[
                                    property
                                ].map((item, i) => (i === index ? data : item));
                            }
                            break;
                        case "remove":
                            if (Array.isArray(currentGallery[property])) {
                                currentGallery[property] = currentGallery[
                                    property
                                ].filter((item) => item.upload_id !== index);
                            } else {
                                currentGallery[property] = null;
                            }
                            break;
                        default:
                            console.error("Invalid operation for gallery");
                    }
                } else {
                    switch (operation) {
                        case "add":
                        case "update":
                            currentGallery[property] = data;
                            break;
                        case "remove":
                            currentGallery[property] = null;
                            break;
                        default:
                            console.error("Invalid operation for documents");
                    }
                }
                stepFourData.gallery = currentGallery;
            } else if (section === "documents") {
                const currentDocuments = { ...stepFourData.documents };

                switch (operation) {
                    case "add":
                    case "update":
                        currentDocuments[property] = data;
                        break;
                    case "remove":
                        currentDocuments[property] = null;
                        break;
                    default:
                        console.error("Invalid operation for documents");
                }
                stepFourData.documents = currentDocuments;
            }

            return {
                ...state,
                property: {
                    ...state.property,
                    stepFourData,
                },
            };
        },
        handleResetProperty(state) {
            state.property = initialState.property;
        },
        handleAddNewProjectOption(state, action) {
            return {
                ...state,
                projects: [...state.projects, action.payload],
            };
        },
        setModalStep(state, { payload }) {
            state.property.modalStep = payload;
        },
        setShowPlaceBidModal(state, { payload }) {
            state.property.showPlaceBidModal = payload;
        },
    },
});

export const {
    setModalStep,
    resetAuctionTab,
    handleEditOnAuction,
    setAuctionActiveTab,
    setShowPlaceBidModal,
    setPropertiesActiveTab,
    setPropertiesListingPage,
    setAuctionListingPage,
    FetchSellerHomeProperties,
    FetchSellerListingProperties,
    FetchSellerAuctionProperties,
    resetSellerListingProperties,
    resetSellerAuctionProperties,
    handleAuctionFormStep,
    resetSellerHomeProperties,
} = sellerSlice.actions;
export default sellerSlice;
