import React, { useState, useRef } from "react";
import DOMPurify from "dompurify";
import {
    FacebookShareButton,
    TwitterShareButton,
    LinkedinShareButton,
    WhatsappShareButton,
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon,
    WhatsappIcon,
} from "react-share";
import Facilities from "./Facilities";
import FloorPlans from "./FloorPlans";
import Location from "./Location";
import ProjectProperties from "./ProjectProperties";
import { guessDateTime } from "../../../utils/dateUtils";
import useTranslationHook from "../../hooks/useTranslationHook";
import { useSelector } from "react-redux";
const Details = ({ details }) => {
    const [showShareOptions, setShowShareOptions] = useState(false);
    const handleShare = () => {
        setShowShareOptions((prev) => !prev);
    };
    const { project_brochure } = details || {},
        locationBoxRef = useRef(null),
        scrollToSection = () => {
            if (locationBoxRef.current) {
                locationBoxRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        };
    let lang = useSelector((state) => state.translation.lang);
    const sanitizedDescription = () => ({
        __html: DOMPurify.sanitize(
            lang === "en"
                ? details?.project_desc
                : details?.project_desc_ar || ""
        ),
    });
    const shareUrl = window.location.href;
    const title =
        lang === "en" ? details?.project_name : details?.project_name_ar || "";
    const { t } = useTranslationHook();

    return (
        <section className="details-wrap pb-5">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8">
                        <div className="project-details space">
                            <div className="tags-box">
                                <div className="tags">
                                    <ul>
                                        <li className="ltblueclr">
                                            {t(details?.project_status)}
                                        </li>
                                    </ul>
                                </div>

                                <div className="tags-types">
                                    <ul>
                                        <li>
                                            <button onClick={handleShare}>
                                                <img
                                                    src="/img/share-icon.svg"
                                                    alt="Share"
                                                />
                                            </button>
                                        </li>
                                    </ul>
                                    {showShareOptions && (
                                        <div
                                            style={{
                                                marginTop: "10px",
                                                display: "flex",
                                                gap: "10px",
                                                position: "absolute",
                                            }}
                                        >
                                            <FacebookShareButton
                                                url={shareUrl}
                                                quote={t(title)}
                                            >
                                                <FacebookIcon size={32} round />
                                            </FacebookShareButton>

                                            <TwitterShareButton
                                                url={shareUrl}
                                                title={t(title)}
                                            >
                                                <TwitterIcon size={32} round />
                                            </TwitterShareButton>

                                            <LinkedinShareButton
                                                url={shareUrl}
                                                title={t(title)}
                                            >
                                                <LinkedinIcon size={32} round />
                                            </LinkedinShareButton>

                                            <WhatsappShareButton
                                                url={shareUrl}
                                                title={t(title)}
                                            >
                                                <WhatsappIcon size={32} round />
                                            </WhatsappShareButton>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <h3>
                                {lang === "en"
                                    ? details?.project_name
                                    : details?.project_name_ar || ""}
                            </h3>
                            <div className="location">
                                <span className="map-icon">
                                    <img src="/img/map-icon.svg" alt="" />
                                </span>
                                {t(details?.project_location)}
                                {details?.is_map_view && (
                                    <button
                                        style={{ color: "#027BFF" }}
                                        onClick={scrollToSection}
                                    >
                                        {t("Map View")}
                                    </button>
                                )}
                            </div>

                            <div className="types">
                                <div className="block">
                                    <h6>
                                        <span>{t("Total Units Label")}</span>
                                        {t(details?.total_units)}
                                    </h6>
                                </div>
                                <div className="block">
                                    <h6>
                                        <span>{t("Units for sale")}</span>
                                        {details?.units_for_sale}
                                    </h6>
                                </div>
                                <div className="block">
                                    <h6>
                                        <span>{t("Completion date")}</span>
                                        {`${guessDateTime(details?.completion_date, "D-M-YYYY", 0, lang)}`}
                                    </h6>
                                </div>
                                <div className="block">
                                    <h6>
                                        <span>{t("Unit types")}</span>
                                        {t(details?.units_type)}
                                    </h6>
                                </div>
                                <div className="block">
                                    <h6>
                                        <span>{t("Property size")}</span>
                                        {t(details?.property_size)}
                                    </h6>
                                </div>
                                <div className="block">
                                    <h6>
                                        <span>{t("Property types")}</span>
                                        {details?.project_type
                                            ?.map((item) => t(item))
                                            .join(" /")}
                                    </h6>
                                </div>
                            </div>
                        </div>
                        <div className="luxury-wrap space">
                            <h6>{t("Best Luxury Properties")}</h6>
                            <div
                                dangerouslySetInnerHTML={sanitizedDescription()}
                            />
                            {/*project_brochure*/}
                            {project_brochure?.length > 0 && (
                                <a
                                    href={`${process.env.REACT_APP_AZURE_BLOB_URL}${project_brochure[0]?.bucket_name}/${project_brochure[0]?.doc_file_name}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-sky btn-md"
                                >
                                    <img
                                        src="/img/book-icon.svg"
                                        alt="View Brochure"
                                    />
                                    {t("View Brochure")}
                                </a>
                            )}
                        </div>
                        {/*project_facility*/}
                        {details?.project_facility?.length > 0 && (
                            <Facilities
                                facilities={details?.project_facility}
                            />
                        )}
                        {/*project_floor_plans*/}
                        <FloorPlans
                            projectFloorPlans={details?.project_floor_plans}
                            locationBoxRef={locationBoxRef}
                        />
                        {/*project_location*/}


                        <Location
                            projectLatitude={
                                details?.latitude
                                    ? Number(details?.latitude)
                                    : 25.1972
                            }
                            projectLongitude={
                                details?.longitude
                                    ? Number(details?.longitude)
                                    : 55.2744
                            }
                            projectNearByPlaces={
                                details?.project_near_by_places
                            }
                            projectName={
                                lang === "en"
                                    ? details?.project_name
                                    : details?.project_name_ar || ""
                            }
                        />
                    </div>
                    <div className="col-lg-4">&nbsp;</div>
                    <ProjectProperties project_id={details?.id} limit={3} />
                </div>
            </div>
        </section>
    );
};

export default Details;
