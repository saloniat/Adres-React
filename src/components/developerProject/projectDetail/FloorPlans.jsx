import React, { useEffect, useRef, useState } from "react";
import FloorPlanModal from "./FloorPlanModal";
import useTranslationHook from "../../hooks/useTranslationHook";
import { toEasternArabicNumerals } from "../../../helpers";
import { useSelector } from "react-redux";

const FloorPlans = ({ projectFloorPlans, locationBoxRef }) => {
    const [showAllPlans, setShowAllPlans] = useState({});
    const planRefs = useRef({});
    const lang = useSelector((state) => state.translation.lang);
    const [selectedImage, setSelectedImage] = useState(null);
    const handleViewMore = (projectId) => {
        setShowAllPlans((prev) => ({
            ...prev,
            [projectId]: !prev[projectId],
        }));
    };
    const handleButtonClick = (src) => {
        setSelectedImage(src);
    };
    useEffect(() => {
        Object.keys(planRefs.current).forEach((projectId) => {
            const planElement = planRefs.current[projectId];
            // if (planElement) {
            //     if (showAllPlans[projectId]) {
            //         planElement.style.height = `${planElement.scrollHeight}px`;
            //     } else {
            //         planElement.style.height = "400px";
            //     }
            // }
        });
    }, [showAllPlans]);
    const { t } = useTranslationHook();

    return (
        <div className="floorplan-box space">
            <h6>{t("Floor Plans")}</h6>

            <ul className="nav nav-pills mb-4" id="pills-tab1" role="tablist">
                {projectFloorPlans?.map((project, index) => (
                    <li
                        className="nav-item"
                        role="presentation"
                        key={project?.id}
                    >
                        <button
                            className={`nav-link ${index === 0 ? "active" : ""}`}
                            id={`${project?.project_type_name?.toLowerCase()}-tab`}
                            data-bs-toggle="pill"
                            data-bs-target={`#${project?.project_type_name?.toLowerCase()}-home`}
                            type="button"
                            role="tab"
                            aria-selected={index === 0 ? "true" : "false"}
                            onClick={() => setShowAllPlans(() => ({}))}
                        >
                            {t(project?.project_type_name)}
                        </button>
                    </li>
                ))}
            </ul>

            <div className="tab-content" id="pills-tabContent1">
                {projectFloorPlans?.map((project, index) => (
                    <div
                        className={`tab-pane fade ${index === 0 ? "show active" : ""}`}
                        id={`${project?.project_type_name?.toLowerCase()}-home`}
                        role="tabpanel"
                        aria-labelledby={`${project?.project_type_name?.toLowerCase()}-home`}
                        key={project?.id}
                    >
                        {project?.floor_plans?.length > 0 ? (
                            <ul
                                className={`type-plan ${showAllPlans[project.id] ? "open" : ""}`}
                                ref={(el) =>
                                    (planRefs.current[project.id] = el)
                                }
                                style={{
                                    maxHeight: showAllPlans[project.id]
                                        ? `${planRefs.current[project.id]?.scrollHeight}px`
                                        : "410px",
                                    overflow: "hidden",
                                    transition: "max-height 0.6s ease",
                                }}
                            >
                                {project.floor_plans.map((floor) => (
                                    <li key={floor?.id}>
                                        <h6>
                                            {floor?.floor_heading}
                                            <span>
                                                {t("Number Of Bedrooms", {
                                                    beds: toEasternArabicNumerals(
                                                        floor?.floor_bed_rooms,
                                                        lang
                                                    ),
                                                })}
                                                <br />
                                                {t(
                                                    "Number Of Available Units",
                                                    {
                                                        units: toEasternArabicNumerals(
                                                            floor?.floor_available_units,
                                                            lang
                                                        ),
                                                    }
                                                )}
                                                {/* {`${floor?.floor_available_units} Available units`} */}
                                            </span>
                                            <em>
                                                {t(floor?.floor_bedroom_desc)}{" "}
                                                <span>
                                                    {t("Square Feet", {
                                                        squareFeet:
                                                            toEasternArabicNumerals(
                                                                floor?.floor_area,
                                                                lang
                                                            ),
                                                    })}
                                                </span>
                                            </em>
                                        </h6>
                                        <figure>
                                            <button
                                                type="button"
                                                data-bs-toggle="modal"
                                                data-bs-target="#planModal"
                                                onClick={() =>
                                                    handleButtonClick(
                                                        `${process.env.REACT_APP_AZURE_BLOB_URL}${floor.upload_details.bucket_name}/${floor.upload_details.doc_file_name}`
                                                    )
                                                }
                                            >
                                                <img
                                                    src={`${process.env.REACT_APP_AZURE_BLOB_URL}${floor?.upload_details?.bucket_name}/${floor?.upload_details?.doc_file_name}`}
                                                    alt={`${floor?.floor_heading}`}
                                                />
                                            </button>
                                        </figure>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>
                                {t("No Floor Plans Available For Project", {
                                    project_type_name:
                                        project?.project_type_name,
                                })}
                            </p>
                        )}
                        {project?.floor_plans?.length > 4 && (
                            <button
                                className="view-link"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewMore(project?.id);
                                }}
                            >
                                {showAllPlans[project?.id]
                                    ? t("View Less")
                                    : t("View More")}
                            </button>
                        )}
                    </div>
                ))}
            </div>
            <FloorPlanModal modalId={`gallaryModal`} image={selectedImage} />
            <div ref={locationBoxRef}></div>
        </div>
    );
};

export default FloorPlans;
