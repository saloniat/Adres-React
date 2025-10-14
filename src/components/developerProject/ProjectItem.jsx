import React from "react";
import { Link } from "react-router-dom";
import { createSlug, formatPrice } from "../../helpers";
import useTranslationHook from "../hooks/useTranslationHook";
import { useSelector } from "react-redux";

const ProjectItem = ({ project }) => {
    const { t } = useTranslationHook();
    let lang = useSelector((state) => state.translation.lang);

    const {
        id,
        project_name,
        project_name_ar,
        project_uri,
        project_status,
        project_type,
        starting_price,
        total_units,
        project_image,
    } = project;
    return (
        <li>
            <div className="gradient">
                <figure className="ratio ratio-1x1">
                    <img
                        src={`${process.env.REACT_APP_AZURE_BLOB_URL}${project_image?.bucket_name || "developer_project_image"}/${project_image?.file_name || "default_project.jpg"}`}
                        alt={
                            lang === "en" ? project_name : project_name_ar || ""
                        }
                    />
                </figure>
                <figcaption className="space">
                    <div className="status">
                        <span>{t(project_status)}</span>
                    </div>
                    <div className="project-content">
                        <h5>
                            {t(
                                lang === "en"
                                    ? project_name
                                    : project_name_ar || ""
                            )}
                        </h5>
                        <ol className="pro-list">
                            <li>
                                <span>{t("Starting price")}</span>
                                {formatPrice(starting_price, lang)}
                            </li>
                            <li>
                                <span>{t("No. of units")}</span>{" "}
                                {t(total_units)}
                            </li>
                            <li
                                data-toggle="tooltip"
                                data-placement="top"
                                title={(project_type || [])
                                    .map((item) => t(`${item}`))
                                    .join(" | ")}
                            >
                                <span>{t("Property type")}</span>
                                {(project_type || [])
                                    .slice(0, 2)
                                    .map((item) => t(`${item}`))
                                    .join(" | ")}
                                {`${(project_type || []).length > 2 ? "..." : ""}`}
                            </li>
                        </ol>
                        <Link
                            to={`/project-detail/${createSlug(id, project_uri)}`}
                            className="btn btn-blank btn-sm"
                        >
                            {t("Learn More")}
                        </Link>
                    </div>
                </figcaption>
            </div>
        </li>
    );
};

export default ProjectItem;
