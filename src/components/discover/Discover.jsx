import React, { useEffect, useMemo, useRef } from "react";
import ReactSelect from "../common/ReactSelect";
import Tabs from "../common/Tabs";
import DiscoverCard from "../home/common/DiscoverCard";
import { Pagination } from "../common/Pagination";
import { discoverFilters, discoverTabs } from "../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { handleDiscoverAuctions } from "../../redux/action/buyerAction";
import {
    handleDiscoverLoading,
    resetFilter,
    setActiveTab,
    setDiscoverData,
    setFilter,
    setPage,
} from "../../redux/slice/discoverSlice";
import SearchInput from "../common/SearchInput";
import { getTotalPages } from "../../helpers";
import useTranslationHook from "../hooks/useTranslationHook";
import useSocketSync from "../hooks/useSocketSync";
import {
    sellerAction,
    setCities,
    setConstructionStatus,
    setDistricts,
    setMunicipalities,
    setPropertyType,
} from "../../redux/action/sellerAction";

const Discover = () => {
    const dispatch = useDispatch();
    const { t } = useTranslationHook();

    const user = useSelector((state) => state.auth.user);
    const activeTab = useSelector((state) => state.discover.activeTab);
    const discoverData = useSelector((state) => state.discover.discoverData);
    const construction_status = useSelector(
        (state) => state.discover.construction_status
    );
    const city = useSelector((state) => state.discover.city);
    const municipality = useSelector((state) => state.discover.municipality);
    const district = useSelector((state) => state.discover.district);
    const property_type = useSelector((state) => state.discover.property_type);

    const cities = useSelector((state) => state.seller.cities);
    const municipalities = useSelector((state) => state.seller.municipalities);
    const districts = useSelector((state) => state.seller.districts);
    const propertyTypes = useSelector((state) => state.seller.propertyTypes);
    const constructionStatus = useSelector(
        (state) => state.seller.constructionStatus
    );

    const filter_beds = useSelector((state) => state.discover.filter_beds);
    const filter_baths = useSelector((state) => state.discover.filter_baths);
    // const search = useSelector((state) => state.discover.search);
    const total = useSelector((state) => state.discover.total);
    const pageSize = useSelector((state) => state.discover.page.pageSize);
    const currentPage = useSelector((state) => state.discover.page.currentPage);
    const discoverLoading = useSelector(
        (state) => state.discover.discoverLoading
    );

    const totalPages = useMemo(() => {
        return getTotalPages(total, pageSize);
    }, [total, pageSize]);

    useEffect(() => {
        if (!constructionStatus || constructionStatus.length === 0) {
            dispatch(setConstructionStatus());
        }
        if (!propertyTypes || propertyTypes?.length === 0)
            dispatch(setPropertyType());
        if (!cities || cities?.length === 0) dispatch(setCities());
        return () => dispatch(resetFilter());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (city) {
            dispatch(sellerAction.handleSetMunicipalities([]));
            dispatch(sellerAction.handleSetDistricts([]));
            dispatch(setMunicipalities({ state_id: city }));
            dispatch(
                setFilter({
                    municipality: null,
                    district: null,
                })
            );
        }
    }, [city]);

    useEffect(() => {
        if (municipality) {
            dispatch(sellerAction.handleSetDistricts([]));
            dispatch(setDistricts({ municipality_id: municipality }));
            dispatch(
                setFilter({
                    district: null,
                })
            );
        }
    }, [municipality]);

    const latestCallRef = useRef(0);

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        const callId = Date.now();
        latestCallRef.current = callId;

        (async () => {
            dispatch(handleDiscoverLoading(true));

            const response = await dispatch(
                handleDiscoverAuctions(
                    {
                        site_id: 3,
                        page: currentPage,
                        page_size: pageSize,
                        short_by: "",
                        sort_order: "asc",
                        ...(filter_beds.length && {
                            filter_beds: filter_beds.map((item) => item.value),
                        }),
                        ...(filter_baths.length && {
                            filter_baths: filter_baths.map(
                                (item) => item.value
                            ),
                        }),
                        ...(construction_status && { construction_status }),
                        ...(city && { city }),
                        ...(district && { district }),
                        ...(municipality && { municipality }),
                        ...(property_type && { property_type }),
                        ...(user?.user_id && {
                            user_id: Number(user.user_id),
                        }),
                        ...(activeTab !== discoverTabs[2].key && {
                            property_for: discoverTabs.find(
                                (tab) => tab.key === activeTab
                            )?.propertyFor,
                        }),
                        ...(activeTab === discoverTabs[2].key && {
                            filter: discoverTabs[2].key,
                        }),
                        ...(activeTab === discoverTabs[1].key && {
                            is_admin: 1,
                        }),
                    },
                    signal
                )
            );

            if (callId === latestCallRef.current) {
                const { data } = response || {};
                dispatch(
                    setDiscoverData({
                        data: data?.data || [],
                        total: data?.total || 0,
                    })
                );
                dispatch(handleDiscoverLoading(false));
            }
        })();

        return () => {
            abortController.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        activeTab,
        currentPage,
        construction_status,
        city,
        municipality,
        district,
        JSON.stringify(filter_beds),
        JSON.stringify(filter_baths),
        property_type,
    ]);

    const syncData = useSocketSync(discoverData, user?.user_id, "discoverSync");
    return (
        <section className="discover-wrap">
            <div className="container py-5">
                <div className="row">
                    <div
                        className="col-lg-12 wow fadeInUp"
                        data-wow-delay="0.5s"
                    >
                        <h2 className="display-2">
                            {t("Find Your Property!")}
                        </h2>
                        <ul className="filters-wrap space">
                            {/* <li>
                                isMulti<SearchInput
                                    onSearch={(query) =>
                                        dispatch(setFilter({ search: query }))
                                    }
                                    minChars={3}
                                    searchBoxClassName="form-control"
                                    placeholder={t(
                                        "Enter desired city or district"
                                    )}
                                    reset={search === "" ? true : false}
                                />
                            </li> */}
                            {discoverFilters?.map((ele, ind) => {
                                const options =
                                    ele.name === "district"
                                        ? districts
                                        : ele.name === "municipality"
                                          ? municipalities
                                          : ele.name === "city"
                                            ? cities
                                            : ele.name === "property_type"
                                              ? propertyTypes
                                              : ele.name ===
                                                  "construction_status"
                                                ? constructionStatus
                                                : ele.options;
                                const selectedValue =
                                    ele.name === "filter_beds"
                                        ? filter_beds
                                        : ele.name === "filter_baths"
                                          ? filter_baths
                                          : options.find(
                                                (opt) =>
                                                    opt.value ===
                                                    (ele.name === "district"
                                                        ? district
                                                        : ele.name ===
                                                            "municipality"
                                                          ? municipality
                                                          : ele.name === "city"
                                                            ? city
                                                            : ele.name ===
                                                                "property_type"
                                                              ? property_type
                                                              : construction_status)
                                            ) || "";
                                return (
                                    <li key={ind}>
                                        <ReactSelect
                                            name={ele.name}
                                            isMulti={ele.isMulti}
                                            isClearable={false}
                                            options={options}
                                            isSearchable={true}
                                            placeholder={t(ele.placeholder)}
                                            className="select"
                                            value={selectedValue}
                                            onChange={(dropDownValues) => {
                                                let value = ele.isMulti
                                                    ? dropDownValues
                                                    : dropDownValues.value;
                                                dispatch(
                                                    setFilter({
                                                        [ele.name]: value,
                                                    })
                                                );
                                            }}
                                        />
                                    </li>
                                );
                            })}
                            <li>
                                <button
                                    title={t("Clear all filters")}
                                    disabled={
                                        // !search &&
                                        !filter_baths &&
                                        !filter_beds &&
                                        !construction_status &&
                                        !property_type &&
                                        !city &&
                                        !municipality &&
                                        !district
                                    }
                                    onClick={() => {
                                        dispatch(resetFilter());
                                        dispatch(
                                            sellerAction.handleSetMunicipalities(
                                                []
                                            )
                                        );
                                        dispatch(
                                            sellerAction.handleSetDistricts([])
                                        );
                                    }}
                                >
                                    <img
                                        src="/img/close-gray.svg"
                                        alt={t("Clear all filters")}
                                    />
                                </button>
                            </li>
                        </ul>
                        <Tabs
                            data={discoverData}
                            tab={discoverTabs}
                            Component={DiscoverCard}
                            className="discover-list"
                            activeTab={activeTab}
                            isLoading={discoverLoading}
                            fetchData={(key) => dispatch(setActiveTab(key))}
                            syncData={syncData}
                        />
                        {!discoverLoading && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={(page) => dispatch(setPage(page))}
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Discover;
