import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createSlug } from "../../../helpers";
import { fetchProjectList } from "../../../redux/action/developerProjectAction";
import Shimmer from "../../common/shimmer/Shimmer";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useTranslationHook from "../../hooks/useTranslationHook";
import useWindowDimensions from "../../hooks/useWindowDimension";

const OtherProject = () => {
    const dispatch = useDispatch();
    const windowDimension = useWindowDimensions();
    const projectSlideRef = useRef(null);
    const areasSlideRef = useRef(null);
    const otherProjects = useSelector((state) => state.project.otherProjects);
    const otherProjectLoading = useSelector(
        (state) => state.project.otherProjectLoading
    );
    const [byAreas] = useState([]);
    const [activeTab, setActiveTab] = useState("projects");
    const { t } = useTranslationHook();
    let lang = useSelector((state) => state.translation.lang);

    const slidesToScrollCount = (width) => {
        if (width <= 768) return 1;
        else if (width > 768 && width <= 1024) return 2;
        else if (width > 1024 && width <= 1280) return 3;
        else return 4;
    };

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: slidesToScrollCount(windowDimension.width),
        slidesToScroll: slidesToScrollCount(windowDimension.width),
    };
    useEffect(() => {
        if (otherProjectLoading) {
            dispatch(
                fetchProjectList({
                    page: 1,
                    is_featured: 2, // get other projects
                })
            );
        }
        //eslint-disable-next-line
    }, [otherProjectLoading]);

    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
    };
    return (
        <section className="other-pro-wrap">
            <div className="container pb-5">
                <div className="row">
                    <div
                        className="col-lg-12 wow fadeInUp"
                        data-wow-delay="0.5s"
                    >
                        <div className="main-heading">
                            <h3>
                                <span>{t("Other Project")}</span>
                            </h3>
                        </div>
                        <ul
                            className="nav nav-pills mb-3"
                            id="pills-tab"
                            role="tablist"
                        >
                            <li className="nav-item " role="presentation">
                                <button
                                    className={`nav-link ${
                                        activeTab === "projects" && "active"
                                    }`}
                                    onClick={() => handleTabChange("projects")}
                                >
                                    {t("Projects")}
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                {/* <button
                                    className={`nav-link ${
                                        activeTab === "areas" && "active"
                                    }`}
                                    onClick={() => handleTabChange("areas")}
                                >
                                    By Areas
                                </button> */}
                            </li>
                        </ul>
                        <div className="tab-content" id="pills-tabContent">
                            <div
                                className={`tab-pane fade ${
                                    activeTab === "projects" && "show active"
                                }`}
                            >
                                {otherProjectLoading ? (
                                    [1, 2, 3].map((element, index) => (
                                        <Shimmer
                                            key={index}
                                            type="rectangle"
                                            width="31%"
                                            height="50vh"
                                            borderRadius="10%"
                                        />
                                    ))
                                ) : Array.isArray(otherProjects?.data) &&
                                  otherProjects?.data?.length > 0 ? (
                                    <ul
                                        className="project-slide"
                                        ref={projectSlideRef}
                                    >
                                        <Slider {...settings}>
                                            {otherProjects.data.map(
                                                (ele, ind) => (
                                                    <li key={ind}>
                                                        <Link
                                                            to={`/project-detail/${createSlug(ele.id, ele.project_uri)}`}
                                                        >
                                                            <figure className="ratio ratio-3x2">
                                                                <img
                                                                    src={`${process.env.REACT_APP_AZURE_BLOB_URL}${ele.project_image?.bucket_name || "developer_project_image"}/${ele.project_image?.file_name || "default_project.jpg"}`}
                                                                    alt={t(
                                                                        lang ===
                                                                            "en"
                                                                            ? ele.project_name
                                                                            : ele.project_name_ar ||
                                                                                  ""
                                                                    )}
                                                                />
                                                            </figure>
                                                            <figcaption>
                                                                <h6>
                                                                    {t(
                                                                        lang ===
                                                                            "en"
                                                                            ? ele.project_name
                                                                            : ele.project_name_ar ||
                                                                                  ""
                                                                    )}
                                                                    <span>
                                                                        {t(
                                                                            "Total Units",
                                                                            {
                                                                                units: ele.total_units,
                                                                            }
                                                                        )}
                                                                    </span>
                                                                </h6>
                                                            </figcaption>
                                                        </Link>
                                                    </li>
                                                )
                                            )}
                                        </Slider>
                                    </ul>
                                ) : (
                                    <div className="full text-center">
                                        <img
                                            src="/img/no-property-found.png"
                                            alt={t("No project found")}
                                        />
                                        <h6>{t("No project found")}</h6>
                                    </div>
                                )}
                            </div>
                            <div
                                className={`tab-pane fade ${
                                    activeTab === "areas" && "show active"
                                }`}
                            >
                                {byAreas?.length > 0 ? (
                                    <ul
                                        className="areas-slide"
                                        ref={areasSlideRef}
                                    >
                                        {byAreas?.map((ele, ind) => (
                                            <li key={ind}>
                                                <a
                                                    href="void:(0)"
                                                    onClick={(e) =>
                                                        e.preventDefault()
                                                    }
                                                >
                                                    <figure className="ratio ratio-3x2">
                                                        <img
                                                            src={`${process.env.REACT_APP_AZURE_BLOB_URL}${ele.project_image?.bucket_name || "developer_project_image"}/${ele.project_image?.file_name || "default_project.jpg"}`}
                                                            alt={t(
                                                                lang === "en"
                                                                    ? ele.project_name
                                                                    : ele.project_name_ar ||
                                                                          ""
                                                            )}
                                                        />
                                                    </figure>
                                                    <figcaption>
                                                        <h6>
                                                            {t(
                                                                lang === "en"
                                                                    ? ele.project_name
                                                                    : ele.project_name_ar ||
                                                                          ""
                                                            )}
                                                            <span>
                                                                {t(
                                                                    "Total Units",
                                                                    {
                                                                        units: ele.total_units,
                                                                    }
                                                                )}
                                                            </span>
                                                        </h6>
                                                    </figcaption>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="full text-center">
                                        <img
                                            src="/img/no-property-found.png"
                                            alt={t("No project found")}
                                        />
                                        <h6>{t("No project found")}</h6>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
export default OtherProject;
