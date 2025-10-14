import React from "react";
import { createSlug, formatPrice } from "../../../helpers";
import { Link } from "react-router-dom";
import useTranslationHook from "../../hooks/useTranslationHook";
import { useSelector } from "react-redux";

const FeaturedCard = ({ ele }) => {
    const { t } = useTranslationHook();
    let lang = useSelector((state) => state.translation.lang);

    return (
        <li>
            <div className="gradient">
                <figure className="ratio ratio-4x3">
                    <img
                        src={`${process.env.REACT_APP_AZURE_BLOB_URL}${ele.project_image?.bucket_name || "developer_project_image"}/${ele.project_image?.file_name || "default_project.jpg"}`}
                        alt={
                            lang === "en"
                                ? ele.project_name
                                : ele.project_name_ar || ""
                        }
                    />
                </figure>
                <figcaption>
                    <div className="status">
                        <span>{t(ele.project_status)}</span>
                    </div>

                    <div className="project-content">
                        <h5>
                            {t(
                                lang === "en"
                                    ? ele.project_name
                                    : ele.project_name_ar || ""
                            )}
                        </h5>
                        <ol className="pro-list">
                            <li>
                                <span>{t("Starting price")}</span>
                                {t("Amount", {
                                    amount: formatPrice(
                                        ele.starting_price,
                                        lang
                                    ),
                                })}
                            </li>
                            <li>
                                <span>{t("No. of units")}</span>
                                {t(ele.total_units)}
                            </li>
                            <li>
                                <span
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    data-bs-title="Tooltip on top"
                                >
                                    {t("Property type")}
                                </span>
                                <div className="">
                                    {ele.project_type
                                        .map((item) => t(item))
                                        .join(" | ")}
                                </div>
                            </li>
                        </ol>

                        <Link
                            to={`/project-detail/${createSlug(ele.id, ele.project_uri)}`}
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

export default FeaturedCard;
