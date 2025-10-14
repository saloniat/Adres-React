import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Shimmer from "../../common/shimmer/Shimmer";
import FeaturedCard from "../common/FeaturedCard";
import { fetchProjectList } from "../../../redux/action/developerProjectAction";
import useTranslationHook from "../../hooks/useTranslationHook";

const FeaturedProjects = () => {
    const dispatch = useDispatch();
    const { t } = useTranslationHook();

    const featuredProjects = useSelector(
        (state) => state.project.featuredProjects
    );
    const featuredProjectLoading = useSelector(
        (state) => state.project.featuredProjectLoading
    );
    useEffect(() => {
        if (featuredProjectLoading) {
            dispatch(
                fetchProjectList({
                    page: 1,
                    is_featured: 1, // get featured projects
                })
            );
        }
        //eslint-disable-next-line
    }, [featuredProjectLoading]);
    return (
        <section className="featured-wrap">
            <div className="container pb-5">
                <div className="row">
                    <div
                        className="col-lg-12 wow fadeInUp"
                        data-wow-delay="0.4s"
                    >
                        <div className="main-heading">
                            <h3>
                                <span>{t("Featured Projects")}</span>
                            </h3>
                            <Link to="/projects" className="see-link">
                                {t("See all")}{" "}
                                <img src="img/arrow-r.svg" alt="arrow right" />
                            </Link>
                        </div>

                        <ul className="project-list">
                            {featuredProjectLoading ? (
                                [1, 2].map((element, index) => (
                                    <Shimmer
                                        key={index}
                                        type="rectangle"
                                        width="48%"
                                        height="50vh"
                                        borderRadius="10%"
                                    />
                                ))
                            ) : Array.isArray(featuredProjects?.data) &&
                              featuredProjects?.data?.length > 0 ? (
                                featuredProjects.data
                                    ?.slice(0, 2)
                                    .map((ele, ind) => (
                                        <FeaturedCard ele={ele} key={ind} />
                                    ))
                            ) : (
                                <li className="full text-center">
                                    <img
                                        src="/img/no-property-found.png"
                                        alt={t("No featured projects found")}
                                    />
                                    <h6>{t("No featured projects found")}</h6>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedProjects;
