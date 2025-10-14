import React, { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchProjectStatus,
    fetchProjectList,
} from "../../redux/action/developerProjectAction";
import ProjectItem from "./ProjectItem";
import { Link } from "react-router-dom";
import Shimmer from "../common/shimmer/Shimmer";
import {
    handleClearProjectList,
    handlePage,
    resetFilter,
    resetPagination,
    setFilter,
} from "../../redux/slice/developerProjectSlice";
import useTranslationHook from "../hooks/useTranslationHook";
import { Pagination } from "../common/Pagination";
import { getTotalPages } from "../../helpers";
import ReactSelect from "../common/ReactSelect";
import { projectFilters } from "../../utils/constants";
import {
    sellerAction,
    setCities,
    setDistricts,
    setMunicipalities,
} from "../../redux/action/sellerAction";

const ProjectList = () => {
    const dispatch = useDispatch();
    const { t } = useTranslationHook();

    const projectStatus = useSelector((state) => state.project.projectStatus);
    const { data: projectList } = useSelector(
        (state) => state.project.projectList
    );
    const projectListLoading = useSelector(
        (state) => state.project.projectListLoading
    );
    const city = useSelector((state) => state.project.city);
    const municipality = useSelector((state) => state.project.municipality);
    const district = useSelector((state) => state.project.district);
    const status = useSelector((state) => state.project.status);

    const cities = useSelector((state) => state.seller.cities);
    const municipalities = useSelector((state) => state.seller.municipalities);
    const districts = useSelector((state) => state.seller.districts);

    const total = useSelector((state) => state.project.projectList.total);
    const page = useSelector((state) => state.project.page.currentPage);
    const page_size = useSelector((state) => state.project.page.pageSize);

    useEffect(() => {
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

    const totalPages = useMemo(() => {
        return getTotalPages(total, page_size);
    }, [total, page_size]);

    useEffect(() => {
        return () => dispatch(resetPagination());
    }, []);

    useEffect(() => {
        dispatch(fetchProjectStatus());
    }, []);

    const debounceTimerRef = useRef(null);
    const abortControllerRef = useRef(null);

    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    useEffect(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        dispatch(handleClearProjectList());
        dispatch(
            fetchProjectList(
                {
                    ...(status && { status }),
                    ...(city && { city }),
                    ...(municipality && { municipality }),
                    ...(district && { district }),
                    page,
                    page_size,
                },
                controller.signal
            )
        );

        return () => {
            controller.abort();
        };
    }, [status, page, page_size, city, municipality, district]);

    return (
        <section className="project-wrap">
            <div className="container py-4">
                <div className="row g-4 align-items-center">
                    <div
                        className="col-lg-12 wow fadeInUp"
                        data-wow-delay="0.5s"
                    >
                        <h2 className="display-2">{t("Our Projects")}</h2>
                        <ul className="filters-wrap">
                            {projectFilters?.map((ele, ind) => {
                                const options =
                                    ele.name === "status"
                                        ? projectStatus
                                        : ele.name === "district"
                                          ? districts
                                          : ele.name === "municipality"
                                            ? municipalities
                                            : ele.name === "city"
                                              ? cities
                                              : ele.options;
                                const selectedValue =
                                    options.find(
                                        (opt) =>
                                            opt.value ===
                                            (ele.name === "status"
                                                ? status
                                                : ele.name === "district"
                                                  ? district
                                                  : ele.name === "municipality"
                                                    ? municipality
                                                    : city)
                                    ) || "";
                                return (
                                    <li key={ind}>
                                        <ReactSelect
                                            name={ele.name}
                                            options={options}
                                            isSearchable={true}
                                            placeholder={t(ele.placeholder)}
                                            className="select"
                                            value={selectedValue}
                                            onChange={({ value }) =>
                                                dispatch(
                                                    setFilter({
                                                        [ele.name]: value,
                                                    })
                                                )
                                            }
                                        />
                                    </li>
                                );
                            })}
                            <li>
                                <button
                                    title={t("Clear all filters")}
                                    disabled={
                                        !city &&
                                        !municipality &&
                                        !district &&
                                        !status
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
                        <ul className="project-list">
                            {projectListLoading ? (
                                [1, 2, 3].map((element, index) => (
                                    <Shimmer
                                        key={index}
                                        type="rectangle"
                                        width="31%"
                                        height="50vh"
                                        borderRadius="10%"
                                    />
                                ))
                            ) : projectList.length > 0 ? (
                                projectList.map((project, index) => (
                                    <ProjectItem
                                        key={index}
                                        project={project}
                                    />
                                ))
                            ) : (
                                <li className="full text-center">
                                    <img
                                        src="/img/no-property-found.png"
                                        alt={t("No projects found")}
                                    />
                                    <h6>{t("No projects found")}</h6>
                                </li>
                            )}
                        </ul>
                        {!projectListLoading && (
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={(page) =>
                                    dispatch(handlePage(page))
                                }
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProjectList;
