import developerProjectSlice from "../slice/developerProjectSlice";
import { toast } from "react-toastify";
import { config, errToast } from "../../utils";
import { handleSiteLoader } from "./authAction";
import { axiosAuth, axiosUnauth } from "../../utils/axios/axios";
const { error } = toast;

export const developerProjectAction = developerProjectSlice.actions;

export const clearProjectDetail = () => {
    return async (dispatch) => {
        dispatch(developerProjectAction.handleClearProjectDetail());
    };
};

export const fetchProjectStatus = () => {
    return async (dispatch, getState) => {
        try {
            const state = getState();
            const isAuthenticated = state.auth.isAuthenticated;
            const res = await (isAuthenticated ? axiosAuth : axiosUnauth).post(
                `/api-settings/lookup-developer-project-status-listing/`,
                config
            );
            const { data, status } = res;
            if (status === 200 && data.error === 0) {
                dispatch(
                    developerProjectAction.handleProjectStatus(
                        data.data.map((item) => ({
                            value: item.id,
                            label: item.status_name,
                        }))
                    )
                );
            } else error(data.msg);
            return res.data;
        } catch (err) {
            errToast(err);
            dispatch(handleSiteLoader(false));
        }
    };
};

export const fetchProjectList = (filters, signal) => {
    return async (dispatch, getState) => {
        const state = getState();
        const isAuthenticated = state.auth.isAuthenticated;
        try {
            const res = await (isAuthenticated ? axiosAuth : axiosUnauth).post(
                `/api-project/subdomain-project-listing/`,
                {
                    site_id: localStorage.getItem("site_id") || 3,
                    ...filters,
                },
                {
                    signal, // Correct placement
                }
            );

            const { data, status } = res;
            if (status === 200) {
                if (data.error === 0) {
                    const projectList = data?.data || { total: 0, data: [] };

                    if ("is_featured" in filters) {
                        if (filters.is_featured === 1) {
                            dispatch(
                                developerProjectAction.handleFeaturedProjects(
                                    projectList
                                )
                            );
                        } else {
                            dispatch(
                                developerProjectAction.handleOtherProjects(
                                    projectList
                                )
                            );
                        }
                    } else {
                        dispatch(
                            developerProjectAction.handleProjectList(
                                projectList
                            )
                        );
                    }
                } else {
                    error(data.msg);
                }
            } else {
                error(data.msg);
            }
            return res.data;
        } catch (err) {
            if (err.name !== "CanceledError" && err.name !== "AbortError") {
                errToast(err);
            }
        }
    };
};

export const fetchProjectDetail = (filters, signal = {}) => {
    return async (dispatch, getState) => {
        dispatch(handleSiteLoader(true));
        const state = getState();
        const isAuthenticated = state.auth.isAuthenticated;
        try {
            const res = await (isAuthenticated ? axiosAuth : axiosUnauth).post(
                `/api-project/subdomain-project-detail/`,
                { site_id: localStorage.getItem("site_id") || 3, ...filters },
                config,
                signal
            );
            const { data, status } = res;
            if (status === 200 && data.error === 0) {
                const projectDetail = data?.data[0] || null;
                dispatch(
                    developerProjectAction.handleProjectDetail(projectDetail)
                );
            } else error(data.msg);
            dispatch(handleSiteLoader(false));
            return res.data;
        } catch (err) {
            errToast(err);
            dispatch(handleSiteLoader(false));
        }
    };
};

export const fetchProjectProperty = (formdata, signal = {}) => {
    return async (dispatch, getState) => {
        const state = getState();
        const isAuthenticated = state.auth.isAuthenticated;
        try {
            const res = await (isAuthenticated ? axiosAuth : axiosUnauth).post(
                `/api-property/project-property-listing/`,
                formdata,
                config,
                signal
            );
            const { data, status } = res;
            if (status === 200 && data.error === 0) {
                const projectProperty = data?.data || null;
                dispatch(
                    developerProjectAction.handleProjectProperty(
                        projectProperty
                    )
                );
            } else error(data.msg);
            return res.data;
        } catch (err) {
            errToast(err);
        }
    };
};

export const fetchFeaturedProject = (property) => {
    return async (dispatch) => {
        dispatch(developerProjectAction.handleFeaturedProjects(property));
    };
};

export const fetchOthersProject = (property) => {
    return async (dispatch) => {
        dispatch(developerProjectAction.handleOtherProjects(property));
    };
};

export const handlePage = (val) => {
    return async (dispatch) => {
        dispatch(developerProjectAction.handlePage(val));
    };
};

//clear project properties
export const clearProjectProperty = () => {
    return async (dispatch) => {
        dispatch(developerProjectAction.handleClearProjectProperty());
    };
};
