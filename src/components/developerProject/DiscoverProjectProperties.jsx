import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import useSocketSync from "../hooks/useSocketSync";
import Breadcrumb from "../common/Breadcrumb";
import Tabs from "../common/Tabs";
import ReactSelect from "../common/ReactSelect";
import { createSlug, getTotalPages, numericArray } from "../../helpers";
import DiscoverCard from "../home/common/DiscoverCard";
import {
    clearProjectProperty,
    fetchProjectProperty,
    handlePage,
} from "../../redux/action/developerProjectAction";
import Shimmer from "../common/shimmer/Shimmer";
import {
    ACCOUNT,
    PROJECT_PROPERTY_TABS,
    STATUS_OPTIONS,
} from "../../utils/constants";
import { Pagination } from "../common/Pagination";
import { setPropertyType } from "../../redux/action/sellerAction";
import {
    resetActiveTab,
    setActiveTab,
} from "../../redux/slice/developerProjectSlice";
import useTranslationHook from "../hooks/useTranslationHook";

const DiscoverProjectProperties = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { t } = useTranslationHook();
    const lang = useSelector((state) => state.translation.lang);

    const { id } = useParams();

    const [state, setState] = useState({
        propertyTypeLoading: false,
        status: "",
        property_type: "",
        beds: "",
        baths: "",
    });
    const account = useSelector((state) => state.profile.account);
    const user = useSelector((state) => state.auth.user);

    const { status, property_type, beds, baths } = state;

    const {
        data: properties,
        total,
        activeTab,
    } = useSelector((state) => state.project.projectProperties);
    const projectPropertiesLoading = useSelector(
        (state) => state.project.projectPropertiesLoading
    );
    const propertyTypes = useSelector((state) => state.seller.propertyTypes);
    const page = useSelector((state) => state.project.page);
    const loading = useSelector((state) => state.auth.siteLoader);

    const totalPages = getTotalPages(total, page.pageSize);

    const FILTERS = [
        {
            name: "property_type",
            options: propertyTypes,
            placeholder: "Property type",
        },
        { name: "status", options: STATUS_OPTIONS, placeholder: "Status" },
        {
            name: "beds",
            options: numericArray,
            placeholder: "Bedrooms",
        },
        {
            name: "baths",
            options: numericArray,
            placeholder: "Bathrooms",
        },
    ];

    useEffect(() => {
        return () => {
            dispatch(clearProjectProperty());
            dispatch(resetActiveTab());
        };
    }, []);

    useEffect(() => {
        if (!id || isNaN(Number(id))) {
            toast.error(t("Invalid project id"));
            return navigate("/not-found");
        }
        if (projectPropertiesLoading) {
            dispatch(
                fetchProjectProperty({
                    project_id: id,
                    page: page.currentPage,
                    ...(status && { status }),
                    ...(property_type && { property_type }),
                    ...(beds && { beds }),
                    ...(baths && { baths }),
                    ...(activeTab !== PROJECT_PROPERTY_TABS[0].key && {
                        filter: activeTab,
                    }),
                    ...(account === ACCOUNT.Buyer && { seller_status: 27 }),
                    user_id: user?.user_id,
                })
            );
        }

        //eslint-disable-next-line
    }, [projectPropertiesLoading]);

    const handlePageChange = (page) => {
        dispatch(handlePage(page));
        dispatch(clearProjectProperty());
    };

    const handleChange = (e, name) => {
        setState((prev) => ({
            ...prev,
            [name]: e.value,
        }));
        dispatch(clearProjectProperty());
    };

    const handlePropertyTypeDropdownOpen = async () => {
        if (!propertyTypes?.length) {
            setState((prev) => ({
                ...prev,
                propertyTypeLoading: true,
            }));
            await dispatch(setPropertyType());
            setState((prev) => ({
                ...prev,
                propertyTypeLoading: false,
            }));
        }
    };
    const syncData = useSocketSync(
        properties,
        user?.user_id,
        "projectPropertyList"
    );
    return (
        <>
            <Breadcrumb
                links={[
                    { url: "/", name: t("Home") },
                    { url: "/projects", name: t("Projects") },
                    {
                        url: `/project-detail/${createSlug(id, `${location.state?.slug}`)}`,
                        name: t(
                            (location.state?.project_name ?? properties)
                                ? lang === "en"
                                    ? properties?.[0]?.project_name
                                    : properties?.[0]?.project_name_ar || ""
                                : ""
                        ),
                    },
                    {
                        url: "",
                        name: `Properties Under  ${t(
                            (location?.state?.project_name.split(" ")[0] ??
                                properties)
                                ? lang === "en"
                                    ? properties?.[0]?.project_name?.split(
                                          " "
                                      )[0]
                                    : properties?.[0]?.project_name_ar.split(
                                          " "
                                      )[0] || ""
                                : ""
                        )}`,
                    },
                ]}
            />
            <section className="discover-wrap">
                <div className="container py-5">
                    <div className="row">
                        <div
                            className="col-lg-12 wow fadeInUp"
                            data-wow-delay="0.5s"
                        >
                            <h2 className="display-2">
                                {t("Properties Under")}{" "}
                                {t(
                                    properties
                                        ? lang === "en"
                                            ? properties?.[0]?.project_name?.split(
                                                  " "
                                              )[0]
                                            : properties?.[0]?.project_name_ar.split(
                                                  " "
                                              )[0] || ""
                                        : ""
                                )}
                            </h2>
                            <ul className="filters-wrap space">
                                {FILTERS?.map((ele, ind) => (
                                    <li
                                        key={ind}
                                        className={
                                            FILTERS.length - 1 === ind
                                                ? "width25"
                                                : ""
                                        }
                                    >
                                        <ReactSelect
                                            name={ele.name}
                                            options={
                                                state.propertyTypeLoading
                                                    ? []
                                                    : ele.options
                                            }
                                            placeholder={t(ele.placeholder)}
                                            className="select"
                                            onChange={(e) =>
                                                handleChange(e, ele.name)
                                            }
                                            onMenuOpen={
                                                ind === 0 &&
                                                handlePropertyTypeDropdownOpen
                                            }
                                            isLoading={
                                                ind === 0 &&
                                                state.propertyTypeLoading
                                            }
                                            loadingMessage={() =>
                                                t("Loading...")
                                            }
                                        />
                                    </li>
                                ))}
                            </ul>
                            {loading ? (
                                [1, 2, 3].map((element, index) => (
                                    <Shimmer
                                        key={index}
                                        type="rectangle"
                                        width="31%"
                                        height="50vh"
                                        borderRadius="10%"
                                    />
                                ))
                            ) : (
                                <Tabs
                                    tab={PROJECT_PROPERTY_TABS}
                                    data={properties}
                                    Component={DiscoverCard}
                                    className="discover-list"
                                    activeTab={activeTab}
                                    fetchData={(key) => {
                                        dispatch(setActiveTab(key));
                                        dispatch(clearProjectProperty());
                                    }}
                                    isLoading={projectPropertiesLoading}
                                    syncData={syncData}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </section>
            {total > 0 && (
                <Pagination
                    currentPage={page.currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </>
    );
};

export default DiscoverProjectProperties;
