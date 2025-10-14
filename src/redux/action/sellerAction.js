import { toast } from "react-toastify";
import { config, errToast } from "../../utils";
import { handleSiteLoader } from "./authAction";
import sellerSlice from "../slice/sellerSlice";
import { guessDateTime } from "../../utils/dateUtils";
import { parseISO, format } from "date-fns";
import { axiosAuth, axiosUnauth } from "../../utils/axios/axios";
import { sendNotification } from "../../components/notifications/NotificationService";
import { ABUDHABICITYID, DOMAIN } from "../../utils/constants";
export const sellerAction = sellerSlice.actions;
const { error, success } = toast;

export const setFormStep = (step, navigate = null) => {
    return async (dispatch) => {
        dispatch(sellerAction.handleSetFormStep(step));
        if (navigate) navigate("/seller/property/");
    };
};

export const uploadSellerPropertyMedia = (
    formData,
    storeData,
    setUploadProgress,
    setShowProgressBar
) => {
    return async (dispatch) => {
        dispatch(handleSiteLoader(true));
        setShowProgressBar(true);
        try {
            const res = await axiosAuth.post(
                `/api-property/seller-upload-property-media/`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    onUploadProgress: (progressEvent) => {
                        const percent = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setUploadProgress(percent < 90 ? percent : 90);
                    },
                }
            );
            const { data, status } = res;
            if (status === 200) {
                setUploadProgress(100);
                if (data.error === 0) {
                    const { doc_file_name, upload_id } = data?.data || [];
                    if (doc_file_name && upload_id) {
                        storeData.data.doc_file_name = doc_file_name;
                        storeData.data.upload_id = upload_id;
                        dispatch(
                            sellerAction.handleSaveStepFourData(storeData)
                        );
                    }
                } else {
                    error(data.msg);
                }
            } else error(data.msg);
            return res.data;
        } catch (err) {
            errToast(err);
        } finally {
            setUploadProgress(0);
            dispatch(handleSiteLoader(false));
            setShowProgressBar(false);
        }
    };
};

export const setAuctionFormStep = (step, navigate = null) => {
    return async (dispatch) => {
        dispatch(sellerAction.handleAuctionFormStep(step));
        if (navigate) navigate("/seller/property/");
    };
};

export const fetchListingStatus = () => {
    return async (dispatch, getState) => {
        try {
            const payload = {
                site_id: DOMAIN,
                object_id: 14,
            };

            const response = await axiosAuth.post(
                `/api-settings/lookup-status-listing/`,
                payload,
                config
            );
            const { data, status } = response;
            if (status === 200) {
                if (data.error === 0) {
                    const statusList =
                        data?.data
                            ?.filter(
                                (status) => status.id !== 1 && status.id !== 2
                            )
                            ?.map((status) => ({
                                value: status.id,
                                label: status.status_name,
                            })) ?? [];
                    dispatch(sellerAction.handleSetAuctionStaus(statusList));
                } else {
                    error(data.msg);
                }
            } else error(data.msg);
            return response.data;
        } catch (err) {
            errToast(err);
        }
    };
};

export const fetchSellerProperties = (seller_status = false) => {
    return async (_, getState) => {
        try {
            const state = getState();
            const user = state.auth.user?.user_id || null;
            const payload = {
                site_id: DOMAIN,
                agent_id: user,
                source_page: "my_property"
            };
            if (seller_status) {
                // seller status 9 is for closed tab
                payload[
                    seller_status === 9 ? "status" :
                        seller_status === -1 ? "filter_all" :
                            "seller_status"
                ] = seller_status === -1 ? "all" : seller_status;
            }
            const response = await axiosAuth.post(
                `/api-property/seller-dashboard-property-listing/`,
                payload,
                config
            );
            return response.data;
        } catch (err) {
            errToast(err);
        }
    };
};

export const fetchSellerAuctions = (activeTab = false) => {
    return async (_, getState) => {
        try {
            const state = getState();
            const user = state.auth.user?.user_id || null;
            const payload = {
                site_id: DOMAIN,
                agent_id: user,
                my_auction: 1,
            };
            if (activeTab === "1") payload.status = 1;
            if (activeTab !== "1") payload.filter = activeTab;
            const response = await axiosAuth.post(
                `/api-property/seller-dashboard-property-listing/`,
                payload,
                config
            );
            return response.data;
        } catch (err) {
            errToast(err);
        }
    };
};

export const bidRegistration = (formData) => {
    return async (dispatch, getState) => {
        handleSiteLoader(true);
        const state = getState();
        const user = state.auth.user?.user_id || null;
        if (!user && !formData?.property_id) {
            errToast("not authorized to access");
            return;
        }
        formData["user"] = user;
        try {
            const res = await axiosAuth.post(
                `/api-bid/front-bid-registration/`,
                formData,
                config
            );
            const { data, status } = res;
            if (status === 200) {
                if (data.error === 0) {
                    return data?.data || {};
                } else {
                    return false;
                }
            } else error(data.msg);
            return res.data;
        } catch (err) {
            errToast(err);
        } finally {
            handleSiteLoader(false);
        }
    };
};

export const fetchPropertyDetail = (
    property_id,
    navigate = null,
    detailsPage = false
) => {
    return async (dispatch, getState) => {
        if (!property_id) {
            error("Provide valid PropertyId");
            return;
        }
        const state = getState();
        const isSeller = state.profile.account;
        const user = state.auth.user?.user_id || null;
        const isAuthenticated = state.auth.isAuthenticated;
        if (isSeller === 1 && !user) {
            errToast("Seller ID is required for sellers.");
            return;
        }
        const payload = {
            property_id,
            ...(user ? { user_id: user } : {}),
            ...(isSeller === 1 ? { agent_id: user } : {}),
        };
        dispatch(handleSiteLoader(true));
        dispatch(sellerAction.handleResetProperty());
        try {
            const res = await (isAuthenticated ? axiosAuth : axiosUnauth).post(
                `/api-property/front-property-detail/`,
                payload,
                config
            );
            const { data, status } = res;
            if (status === 200) {
                if (data.error === 0) {
                    const propertyData = data?.data;
                    dispatch(sellerAction.handlePropertyData(propertyData));
                    const {
                        owners = [],
                        tags = [],
                        property_name,
                        property_name_ar,
                        country_id: country,
                        state_id: city,
                        municipality_id: municipality,
                        district_id: district,
                        project_id: project,
                        community,
                        property_type_id: propertyType,
                        building,
                        square_footage: areaSize,
                        beds: numOfBedrooms,
                        baths: numOfBathrooms,
                        number_of_outdoor_parking_spaces: numOfParkings,
                        vacancy,
                        rental_till: rentalTill,
                        construction_status_id: constructionStatus,
                        amenities = [],
                        description,
                        description_ar,
                        property_pic,
                        property_video,
                        property_doc,
                        property_auction_data,
                        deposit_amount,
                        map_url,
                    } = propertyData;

                    if (property_auction_data?.length) {
                        const auction_data = property_auction_data[0];
                        //eslint-disable-next-line
                        const { id, auction_id, ...rest } = auction_data || {};
                        const auctionStartDate =
                            auction_data.start_date || new Date();
                        const parsedStartDate =
                            typeof auctionStartDate === "string"
                                ? parseISO(auctionStartDate)
                                : auctionStartDate;
                        const auctionEndDate =
                            auction_data.end_date || new Date();
                        const parsedEndDate =
                            typeof auctionEndDate === "string"
                                ? parseISO(auctionEndDate)
                                : auctionEndDate;
                        dispatch(
                            sellerAction.handleAuctionStepOneData({
                                ...rest,
                                buyer_preference: String(
                                    auction_data.buyer_preference || 1
                                ),
                                start_date: format(
                                    parsedStartDate,
                                    "yyyy-MM-dd"
                                ),
                                start_time: format(parsedStartDate, "HH:mm"),
                                end_date: format(parsedEndDate, "yyyy-MM-dd"),
                                end_time: format(parsedEndDate, "HH:mm"),
                                deposit_amount,
                            })
                        );
                    }
                    dispatch(
                        sellerAction.handleSaveStepOneData(
                            owners.map((item) => ({
                                ...item,
                                nationality: item.owner_nationality,
                            }))
                        )
                    );
                    dispatch(
                        sellerAction.handleSaveStepTwoData({
                            property_name,
                            property_name_ar,
                            country,
                            city,
                            municipality,
                            district,
                            project,
                            community,
                            propertyType,
                            building,
                            map_url,
                        })
                    );
                    dispatch(
                        sellerAction.handleSaveStepThreeData({
                            areaSize,
                            numOfBedrooms,
                            numOfBathrooms,
                            numOfParkings,
                            vacancy: `${vacancy}`,
                            rentalTill: rentalTill
                                ? guessDateTime(
                                    new Date(rentalTill),
                                    "YYYY-MM-DD"
                                )
                                : null,
                            constructionStatus: constructionStatus,
                            amenities: amenities.map(
                                ({ feature_id, feature_name }) => {
                                    return {
                                        label: feature_name,
                                        value: "" + feature_id,
                                    };
                                }
                            ),
                            tags: tags.map(({ value, label }) => ({
                                label,
                                value: String(value),
                            })),
                            description,
                            description_ar,
                        })
                    );
                    if (property_video?.length > 0) {
                        dispatch(
                            sellerAction.handleSaveStepFourData({
                                section: "gallery",
                                property: "video",
                                operation: "add",
                                data: property_video[0],
                                index: null,
                            })
                        );
                    }
                    const coverImage = property_pic?.filter(
                        (item) => item.upload_identifier === 1
                    );
                    const propertyImage = property_pic?.filter(
                        (item) => item.upload_identifier === 2
                    );
                    if (coverImage?.length > 0) {
                        dispatch(
                            sellerAction.handleSaveStepFourData({
                                section: "gallery",
                                property: "coverImage",
                                operation: "add",
                                data: coverImage[0],
                                index: null,
                            })
                        );
                    }
                    propertyImage?.map((image) => {
                        dispatch(
                            sellerAction.handleSaveStepFourData({
                                section: "gallery",
                                property: "propertyImage",
                                operation: "add",
                                data: image,
                                index: null,
                            })
                        );
                    });
                    const titleDeed = property_doc?.filter(
                        (item) => item.upload_identifier === 4
                    );
                    if (titleDeed?.length > 0) {
                        dispatch(
                            sellerAction.handleSaveStepFourData({
                                section: "documents",
                                property: "titleDeed",
                                operation: "add",
                                data: titleDeed[0],
                                index: null,
                            })
                        );
                    }
                    const floorPlans = property_doc?.filter(
                        (item) => item.upload_identifier === 3
                    );
                    if (floorPlans?.length > 0) {
                        dispatch(
                            sellerAction.handleSaveStepFourData({
                                section: "documents",
                                property: "floorPlans",
                                operation: "add",
                                data: floorPlans[0],
                                index: null,
                            })
                        );
                    }
                    if (municipality)
                        dispatch(
                            setDistricts({ municipality_id: municipality })
                        );
                    if (Number(city) === ABUDHABICITYID && district)
                        dispatch(setCommunitys({ district_id: district }));
                    dispatch(sellerAction.handleSetFormStep(1));
                    if (navigate) navigate("/seller/property/");
                } else {
                    error(data.msg);
                    if (navigate && detailsPage) navigate("/not-found");
                }
            } else error(data.msg);
            return res.data;
        } catch (err) {
            errToast(err);
        } finally {
            dispatch(handleSiteLoader(false));
        }
    };
};

export const setCountries = () => {
    return async (dispatch) => {
        dispatch(handleSiteLoader(true));
        try {
            const res = await axiosAuth.post(
                `/api-settings/get-country/`,
                config
            );
            const { data, status } = res;
            if (status === 200) {
                if (data.error === 0) {
                    const countries =
                        data?.data?.map((country) => ({
                            value: country.id,
                            label: country.country_name,
                        })) ?? [];
                    dispatch(sellerAction.handleSetCountries(countries));
                } else {
                    error(data.msg);
                }
            } else error(data.msg);
            return res.data;
        } catch (err) {
            errToast(err);
        } finally {
            dispatch(handleSiteLoader(false));
        }
    };
};

export const setCities = () => {
    return async (dispatch, getState) => {
        dispatch(handleSiteLoader(true));
        const isAuthenticated = getState().auth.isAuthenticated;
        try {
            const res = await (isAuthenticated ? axiosAuth : axiosUnauth).post(
                `/api-settings/get-state/`,
                config
            );
            const { data, status } = res;
            if (status === 200) {
                if (data.error === 0) {
                    const cities =
                        data?.data?.map((city) => ({
                            value: city.id,
                            label: city.state_name,
                        })) ?? [];
                    dispatch(sellerAction.handleSetCities(cities));
                } else {
                    error(data.msg);
                }
            } else error(data.msg);
            return res.data;
        } catch (err) {
            errToast(err);
        } finally {
            dispatch(handleSiteLoader(false));
        }
    };
};

export const setMunicipalities = (formData) => {
    return async (dispatch, getState) => {
        dispatch(handleSiteLoader(true));
        const isAuthenticated = getState().auth.isAuthenticated;

        try {
            const res = await (isAuthenticated ? axiosAuth : axiosUnauth).post(
                `/api-settings/get-munciplity/`,
                formData,
                config
            );
            const { data, status } = res;
            if (status === 200) {
                if (data.error === 0) {
                    const municipalities =
                        data?.data?.map((municipality) => ({
                            value: municipality.id,
                            label: municipality.municipality_name,
                            label_ar: municipality.municipality_name_ar,
                        })) ?? [];
                    dispatch(
                        sellerAction.handleSetMunicipalities(municipalities)
                    );
                } else {
                    error(data.msg);
                }
            } else error(data.msg);
            return res.data;
        } catch (err) {
            errToast(err);
        } finally {
            dispatch(handleSiteLoader(false));
        }
    };
};

export const setDistricts = (formData) => {
    return async (dispatch, getState) => {
        dispatch(handleSiteLoader(true));
        const state = getState();
        const isAuthenticated = state.auth.isAuthenticated;
        try {
            const res = await (isAuthenticated ? axiosAuth : axiosUnauth).post(
                `/api-settings/get-district/`,
                formData,
                config
            );
            const { data, status } = res;
            if (status === 200) {
                if (data.error === 0) {
                    const districts =
                        data?.data?.map((district) => ({
                            value: district.id,
                            label: district.district_name,
                            label_ar: district.district_name_ar,
                        })) ?? [];
                    dispatch(sellerAction.handleSetDistricts(districts));
                } else {
                    error(data.msg);
                }
            } else error(data.msg);
            return res.data;
        } catch (err) {
            errToast(err);
        } finally {
            dispatch(handleSiteLoader(false));
        }
    };
};

export const setCommunitys = (formData) => {
    return async (dispatch, getState) => {
        dispatch(handleSiteLoader(true));
        const state = getState();
        const isAuthenticated = state.auth.isAuthenticated;
        try {
            const res = await (isAuthenticated ? axiosAuth : axiosUnauth).post(
                `/api-settings/get-community/`,
                formData,
                config
            );
            const { data, status } = res;
            if (status === 200) {
                if (data.error === 0) {
                    const communities =
                        data?.data?.map((community) => ({
                            value: community.community_name,
                            label: community.community_name,
                            label_ar: community.community_name_ar,
                        })) ?? [];
                    dispatch(sellerAction.handleSetCommunitys(communities));
                } else {
                    error(data.msg);
                }
            } else error(data.msg);
            return res.data;
        } catch (err) {
            errToast(err);
        } finally {
            dispatch(handleSiteLoader(false));
        }
    };
};

export const setProjects = (city_id = "") => {
    return async (dispatch, getState) => {
        dispatch(handleSiteLoader(true));
        const state = getState();
        const isAuthenticated = state.auth.isAuthenticated;
        const user_id = state.auth.user?.user_id || null;
        const payload = { site_id: DOMAIN || 3 };
        if (city_id) payload.city_id = city_id;
        if (user_id) payload.user_id = user_id;
        try {
            const res = await (isAuthenticated ? axiosAuth : axiosUnauth).post(
                `/api-project/project-list/`,
                payload,
                config
            );
            const { data, status } = res;
            if (status === 200) {
                if (data.error === 0) {
                    const projects =
                        data?.data?.map((project) => ({
                            value: project.id,
                            label: project.project_name,
                        })) ?? [];
                    dispatch(sellerAction.handleSetProjects(projects));
                } else {
                    error(data.msg);
                }
            } else error(data.msg);
            return res.data;
        } catch (err) {
            errToast(err);
        } finally {
            dispatch(handleSiteLoader(false));
        }
    };
};

export const setAmenities = () => {
    return async (dispatch) => {
        dispatch(handleSiteLoader(true));
        try {
            const res = await axiosAuth.post(
                "/api-project/get-facility/",
                config
            );
            const { data, status } = res;
            if (status === 200) {
                if (data.error === 0) {
                    const amenities =
                        data?.data?.map((amenities) => ({
                            value: "" + amenities.id,
                            label: amenities.name,
                        })) ?? [];
                    dispatch(sellerAction.handleSetAmenities(amenities));
                } else {
                    error(data.msg);
                }
            } else error(data.msg);
            return res.data;
        } catch (err) {
            errToast(err);
        } finally {
            dispatch(handleSiteLoader(false));
        }
    };
};

export const setTags = () => {
    return async (dispatch) => {
        dispatch(handleSiteLoader(true));
        try {
            const res = await axiosAuth.post("/api-settings/get-tags/", config);
            const { data, status } = res;
            if (status === 200) {
                if (data.error === 0) {
                    const tags =
                        data?.data?.map((tags) => ({
                            value: "" + tags.id,
                            label: tags.tag,
                        })) ?? [];
                    dispatch(sellerAction.handleSetTags(tags));
                } else {
                    error(data.msg);
                }
            } else error(data.msg);
            return res.data;
        } catch (err) {
            errToast(err);
        } finally {
            dispatch(handleSiteLoader(false));
        }
    };
};

export const setPropertyType = () => {
    return async (dispatch, getState) => {
        // dispatch(handleSiteLoader(true));
        const isAuthenticated = getState().auth.isAuthenticated;
        try {
            const res = await (isAuthenticated ? axiosAuth : axiosUnauth).post(
                `/api-settings/get-property-type/`,
                config
            );
            const { data, status } = res;
            if (status === 200) {
                if (data.error === 0) {
                    const propertyTypes =
                        data?.data?.map((property) => ({
                            value: property.id,
                            label: property.property_type,
                        })) ?? [];
                    dispatch(sellerAction.handleSetPropertyType(propertyTypes));
                } else {
                    error(data.msg);
                }
            } else error(data.msg);
            return res.data;
        } catch (err) {
            errToast(err);
        } finally {
            // dispatch(handleSiteLoader(false));
        }
    };
};

export const setConstructionStatus = () => {
    return async (dispatch, getState) => {
        dispatch(handleSiteLoader(true));
        const isAuthenticated = getState().auth.isAuthenticated;
        try {
            const res = await (isAuthenticated ? axiosAuth : axiosUnauth).post(
                `/api-settings/lookup-status-listing/`,
                { object_id: 26 },
                config
            );
            const { data, status } = res;
            if (status === 200) {
                if (data.error === 0) {
                    const constructionStatus =
                        data?.data?.map((construction) => ({
                            value: construction.id,
                            label: construction.status_name,
                        })) ?? [];
                    dispatch(
                        sellerAction.handleSetConstructionStatus(
                            constructionStatus
                        )
                    );
                } else {
                    error(data.msg);
                }
            } else error(data.msg);
            return res.data;
        } catch (err) {
            errToast(err);
        } finally {
            dispatch(handleSiteLoader(false));
        }
    };
};

export const setPropertyCity = (city) => {
    return async (dispatch) => {
        dispatch(sellerAction.handleSetPropertyCity(city));
    };
};

export const saveStepOneData = (data) => {
    return async (dispatch) => {
        dispatch(sellerAction.handleSaveStepOneData(data));
    };
};

export const saveStepTwoData = (data) => {
    return async (dispatch) => {
        dispatch(sellerAction.handleSaveStepTwoData(data));
    };
};

export const saveStepThreeData = (data) => {
    return async (dispatch) => {
        dispatch(sellerAction.handleSaveStepThreeData(data));
    };
};

export const saveStepFourData = (data) => {
    return async (dispatch) => {
        dispatch(sellerAction.handleSaveStepFourData(data));
    };
};

export const addNewProjectOption = (data) => {
    return async (dispatch) => {
        dispatch(sellerAction.handleAddNewProjectOption(data));
    };
};

export const resetProperty = (data) => {
    return async (dispatch) => {
        dispatch(sellerAction.handleResetProperty(data));
    };
};

export const resetDistricts = () => {
    return async (dispatch) => {
        dispatch(sellerAction.handleSetDistricts([]));
    };
};

export const resetCommunitys = () => {
    return async (dispatch) => {
        dispatch(sellerAction.handleSetCommunitys([]));
    };
};

export const saveProperty = (formData, navigate = null) => {
    return async (dispatch, getState) => {
        dispatch(handleSiteLoader(true));
        try {
            const state = getState();
            const user_id = state.auth.user?.user_id || null;
            const res = await axiosAuth.post(
                `/api-property/add-property-seller/`,
                {
                    site_id: DOMAIN,
                    user_id,
                    ...formData,
                },
                config
            );
            const { data, status } = res;
            if (status === 200) {
                if (data.error === 0) {
                    success(data.msg);
                    sendNotification();
                    if (navigate && !formData.property_id) {
                        navigate("/seller/property/success/");
                    } else {
                        navigate("/my-properties/");
                    }
                } else {
                    error(data.msg);
                }
            } else error(data.msg);
            return res.data;
        } catch (err) {
            errToast(err);
        } finally {
            dispatch(handleSiteLoader(false));
        }
    };
};

export const saveAuction = (formData, navigate = null) => {
    return async (dispatch, getState) => {
        dispatch(handleSiteLoader(true));
        try {
            const state = getState();
            const user_id = state.auth.user?.user_id || null;
            const res = await axiosAuth.post(
                `/api-property/add-property-seller/`,
                {
                    site_id: DOMAIN,
                    user_id,
                    ...formData,
                },
                config
            );
            const { data, status } = res;
            if (status === 200) {
                if (data.error === 0) {
                    success(data.msg);
                    formData?.step === 2 && sendNotification();
                } else {
                    error(data.msg);
                }
                if (navigate && !data.error)
                    navigate("/seller/property/success#auction");
            } else error(data.msg);
            dispatch(handleSiteLoader(false));
            return res.data;
        } catch (err) {
            errToast(err);
            dispatch(handleSiteLoader(false));
        }
    };
};

export const togglePropertyLike = (formData) => {
    return async (dispatch, getState) => {
        const state = getState();
        const isAuthenticated = state.auth.isAuthenticated;
        try {
            const { status, data } = await (
                isAuthenticated ? axiosAuth : axiosUnauth
            ).post(`/api-property/make-favourite-property/`, formData, config);
            if (status === 200 && data.error === 0) sendNotification();
            return { status, data };
        } catch (err) {
            errToast(err);
        }
    };
};

export const buyNowProperty = (property_id) => {
    return async (dispatch, getState) => {
        handleSiteLoader(true);
        const state = getState();
        const user_id = state.auth.user?.user_id || null;
        try {
            const { status, data } = await axiosAuth.post(
                `/api-property/buy-now-property/`,
                { property_id, user_id, site_id: DOMAIN },
                config
            );
            if (status === 200) {
                if (data.error === 0) {
                    success(data.msg);
                } else {
                    error(data.msg);
                }
            } else error(data.msg);
            return { status, data };
        } catch (err) {
            errToast(err);
        } finally {
            handleSiteLoader(false);
        }
    };
};

export const StartPurchaseOrForefitProperty = (
    property_id,
    process_type = 1
) => {
    return async (dispatch, getState) => {
        handleSiteLoader(true);
        const state = getState();
        const user_id = state.auth.user?.user_id || null;
        try {
            const { status, data } = await axiosAuth.post(
                `/api-bid/start-purchase-or-forefit-property/`,
                { property_id, user_id, site_id: DOMAIN, process_type },
                config
            );
            if (status === 200) {
                if (data.error === 0) {
                    success(data.msg);
                } else {
                    error(data.msg);
                }
            } else error(data.msg);
            return { status, data };
        } catch (err) {
            errToast(err);
        } finally {
            handleSiteLoader(false);
        }
    };
};

export const fetchSimilarProperties = ({
    property_id,
    page = 1,
    page_size = 3,
}) => {
    return async (dispatch, getState) => {
        try {
            const state = getState();
            const isAuthenticated = state.auth.isAuthenticated;
            const user = state.auth.user?.user_id || null;
            const payload = {
                property_id,
                domain_id: DOMAIN,
                page,
                page_size,
            };
            if (user) payload.user_id = user;
            const response = await (
                isAuthenticated ? axiosAuth : axiosUnauth
            ).post(`/api-property/similar-property/`, payload, config);
            const { data, status } = response;
            if (status === 200) {
                if (data.error === 0) {
                    dispatch(
                        sellerAction.handleSimilarProperty(data?.data?.data)
                    );
                } else {
                    return false;
                }
            } else error(data.msg);
            return response.data;
        } catch (err) {
            errToast(err);
        }
    };
};

export const relistingProperty = (formData) => {
    return async (dispatch, getState) => {
        try {
            dispatch(handleSiteLoader(true));
            const response = await axiosAuth.post(
                `/api-property/property-relist/`,
                formData,
                config
            );
            const { data, status } = response;
            if (status === 200) {
                if (data.error === 0) {
                } else {
                    error(data.msg);
                }
            } else error(data.msg);
            return response.data;
        } catch (err) {
            errToast(err);
        } finally {
            dispatch(handleSiteLoader(false));
        }
    };
};
