import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import DOMPurify from "dompurify";
import { createSlug } from "../../../helpers";
import {
    ABUDHABICITYID,
    SELLER_PROPERTY_STATUS,
} from "../../../utils/constants";
import { guessDateTime } from "../../../utils/dateUtils";
import { getPropertyStatus } from "../../../helpers";
import AuctionBidding from "./right-panel/AuctionBidding";
import FloorPlanModal from "../../developerProject/projectDetail/FloorPlanModal";
import Gallery from "../../partials/property-details/Gallery";
import ShareButton from "../../common/ShareButton";
import SocketService from "../../../Service/SocketService";
import useTranslationHook from "../../hooks/useTranslationHook";
import { SaleTrendChart } from "../../common/SaleTrendChart";
import { AveragePriceChart } from "../../common/AveragePriceChart";
import AreaComparision from "../../common/AreaComparision";
const Details = ({ propertyDetail }) => {
    const { t } = useTranslationHook();
    let lang = useSelector((state) => state.translation.lang);

    const {
        project_name,
        project_name_ar,
        property_name_ar,
        property_pic,
        property_doc,
        property_video,
        construction_status_name,
        property_name,
        state,
        country,
        community,
        community_ar,
        is_map_view,
        description,
        description_ar,
        square_footage,
        beds,
        baths,
        amenities,
        tags,
        property_project_data: projectData,
        added_on,
        property_auction_data,
        property_for,
        seller_status_id,
        seller_status_name,
        city,
        map_url: googleMapsUrl,
    } = propertyDetail;
    const { account: isSeller } = useSelector((state) => state.profile);

    const sanitizedDescription = () => ({
        __html: DOMPurify.sanitize(
            lang === "en" ? description : description_ar || ""
        ),
    });
    const getStatus = (id, name) => ({
        label: id !== 27 ? name : "loading...",
        className:
            id === 27 || id === 28
                ? "active"
                : id === 29
                    ? "upcomingclr"
                    : "grayclr",
    });

    const [propertyCurrentStatus, setPropertyCurrentStatus] = useState(
        getStatus(seller_status_id, seller_status_name)
    );

    const [statusMessage, setStatusMessage] = useState(0);
    const user = useSelector((state) => state.auth.user);
    const { isConnected } = useSelector((state) => state.socket);
    const [selectedImage, setSelectedImage] = useState(null);
    const floorPlan =
        property_doc?.filter((doc) => doc.upload_identifier === 3)?.[0] ?? null;
    const openGoogleMaps = () => {
        if (!googleMapsUrl) return;
        window.open(googleMapsUrl, "_blank");
    };

    useEffect(() => {
        SocketService.on("checkBid", ({ error, data }) => {
            if (!error && propertyDetail?.seller_status_id === 27) {
                if (data?.offerer_offer_status == 1) {
                    setPropertyCurrentStatus({
                        label: "Closed",
                        className: "grayclr",
                    });
                } else {
                    setPropertyCurrentStatus(
                        getPropertyStatus(
                            data?.listing_status_id,
                            data?.start_time_left_hr,
                            data?.time_left_hr,
                            data?.reserve_amount <= data?.high_bid_amt,
                            isSeller
                        )
                    );
                    const isReserveMet =
                        data?.reserve_amount !== undefined &&
                            data?.high_bid_amt !== undefined
                            ? data.reserve_amount <= data.high_bid_amt
                            : false;

                    if (
                        data?.time_left_hr < 0 &&
                        data?.my_max_bid_val &&
                        isSeller === 0
                    ) {
                        setStatusMessage(
                            isReserveMet
                                ? data.max_bidder_user_id ===
                                    Number(user?.user_id)
                                    ? 1
                                    : 0
                                : 2
                        );
                    }
                }
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConnected]);

    return (
        <React.Fragment>
            <Gallery
                images={[
                    ...(property_pic?.map((img) => img) || []),
                    ...(property_video?.map((vid) => vid) || []),
                ]}
            />
            <section className="details-wrap pb-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="product-details">
                                <div className="tags-box">
                                    <div className="tags">
                                        <ul>
                                            {isSeller === 1 &&
                                                Number(property_for) === 2 && (
                                                    <li className="redclr">
                                                        Live
                                                    </li>
                                                )}
                                            {propertyCurrentStatus?.label && (
                                                <li
                                                    className={
                                                        propertyCurrentStatus?.className
                                                    }
                                                >
                                                    {t(
                                                        propertyCurrentStatus?.label
                                                    ) || ""}
                                                </li>
                                            )}
                                            <li className="blueclr">
                                                {t(construction_status_name) ||
                                                    ""}
                                            </li>
                                            {tags.map((tag, index) => (
                                                <li
                                                    className="blueclr"
                                                    key={index}
                                                >
                                                    <img
                                                        src={`${process.env.REACT_APP_AZURE_BLOB_URL}${tag?.icon}`}
                                                        alt=""
                                                    />
                                                    {t(tag.label) || ""}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="tags-types">
                                        <ul>
                                            <li>
                                                <ShareButton
                                                    shareUrl={
                                                        window.location.href
                                                    }
                                                    title={t(property_name)}
                                                />
                                            </li>
                                        </ul>
                                    </div>

                                    {propertyDetail?.seller_status_id ===
                                        28 && (
                                            <div className="col-lg-4">
                                                <div className="sidebar">
                                                    <Link
                                                        to={`/seller/auction/detail/${createSlug(propertyDetail?.id, `${propertyDetail?.property_name} ${propertyDetail?.country}`)}`}
                                                    >
                                                        <button className="btn btn-primary btn-lg btn-full">
                                                            {t("Put it on Auction")}
                                                        </button>
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                </div>
                                <h3>
                                    {lang === "en"
                                        ? property_name
                                        : property_name_ar || ""}
                                </h3>
                                <div className="types">
                                    <ul>
                                        <li>
                                            <img
                                                src="/img/ruler-icon.svg"
                                                alt=""
                                            />{" "}
                                            {t("Square Feet", {
                                                squareFeet: square_footage || 0,
                                            })}
                                        </li>
                                        <li>
                                            <img
                                                src="/img/bed-icon.svg"
                                                alt=""
                                            />{" "}
                                            {beds === 0
                                                ? t("Studio")
                                                : t("Number Of Bedrooms", {
                                                    beds,
                                                })}
                                        </li>
                                        <li>
                                            <img
                                                src="/img/bath-icon.svg"
                                                alt=""
                                            />{" "}
                                            {t("Number Of Bathrooms", {
                                                baths,
                                            })}
                                        </li>
                                        <li>
                                            <div className="location">
                                                <span className="map-icon">
                                                    <img
                                                        src="img/map-icon.svg"
                                                        alt=""
                                                    />
                                                </span>
                                                {t(state)},{" "}
                                                {t(
                                                    lang === "en"
                                                        ? community
                                                        : community_ar || ""
                                                )}{" "}
                                                {is_map_view && (
                                                    <button
                                                        onClick={() =>
                                                            openGoogleMaps()
                                                        }
                                                        style={{
                                                            color: "#027BFF",
                                                        }}
                                                    >
                                                        {t("Map View")}
                                                    </button>
                                                )}
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        {propertyDetail?.seller_status_id ===
                            SELLER_PROPERTY_STATUS["ON_AUCTION"] && (
                                <AuctionBidding />
                            )}

                        <div className="col-lg-12">
                            <div
                                className="bid-accordian accordion accordion-flush"
                                id="accordionFlushExample"
                            >
                                <div className="accordion-item">
                                    <h2 className="accordion-header">
                                        <button
                                            className="accordion-button"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#ownership-collapseOne"
                                            aria-expanded="true"
                                            aria-controls="ownership-collapseOne"
                                        >
                                            {t("Additional Property Details")}
                                        </button>
                                    </h2>
                                    <div
                                        id="ownership-collapseOne"
                                        className="accordion-collapse collapse show"
                                        data-bs-parent="#accordionFlushExample"
                                    >
                                        <div className="accordion-body">
                                            <div className="additional-details space">
                                                <div className="heading-text">
                                                    {t("Amenities")}
                                                </div>

                                                <ul className="amenities">
                                                    {amenities?.length > 0 ? (
                                                        amenities?.map(
                                                            (
                                                                amenity,
                                                                index
                                                            ) => (
                                                                <li key={index}>
                                                                    {t(
                                                                        amenity?.feature_name
                                                                    )}
                                                                </li>
                                                            )
                                                        )
                                                    ) : (
                                                        <li>
                                                            {t("No Amenities")}
                                                        </li>
                                                    )}
                                                </ul>

                                                <div className="add-item">
                                                    {
                                                        projectData?.developer_name && <div className="block">
                                                            <h6>
                                                                <span>
                                                                    {t("Developer")}
                                                                </span>
                                                                {t(projectData.developer_name)}
                                                            </h6>
                                                        </div>
                                                    }
                                                    {
                                                        (construction_status_name !== "Ready" && (project_name || project_name_ar)) && <div className="block">
                                                            <h6>
                                                                <span>
                                                                    {t(
                                                                        "Handover Date"
                                                                    )}
                                                                </span>
                                                                {guessDateTime(
                                                                    projectData?.completion_date,
                                                                    "DD-MM-YYYY",
                                                                    0,
                                                                    lang
                                                                )}
                                                            </h6>
                                                        </div>
                                                    }
                                                    <div className="block">
                                                        <h6>
                                                            <span>
                                                                {t("Project")}
                                                            </span>
                                                            {t(
                                                                lang === "en"
                                                                    ? project_name
                                                                    : project_name_ar ||
                                                                    ""
                                                            ) ||
                                                                t(
                                                                    "Not Applicable"
                                                                )}
                                                        </h6>
                                                    </div>
                                                    <div className="block">
                                                        <h6>
                                                            <span>
                                                                {t(
                                                                    "Added Date"
                                                                )}
                                                            </span>
                                                            {guessDateTime(
                                                                added_on,
                                                                "DD-MM-YYYY",
                                                                0,
                                                                lang
                                                            )}
                                                        </h6>
                                                    </div>
                                                    <div className="block">
                                                        <h6>
                                                            <span>
                                                                {t(
                                                                    "Auction ID"
                                                                )}
                                                            </span>
                                                            {t(
                                                                property_auction_data?.[0]
                                                                    ?.auction_unique_id
                                                            )}
                                                        </h6>
                                                    </div>
                                                    <div className="block">
                                                        <h6>
                                                            <span>
                                                                {t(
                                                                    "Floor Plan"
                                                                )}
                                                            </span>
                                                            {
                                                                floorPlan?.doc_file_name ?
                                                                    <button
                                                                        data-bs-toggle="modal"
                                                                        data-bs-target="#planModal"
                                                                        onClick={() =>
                                                                            setSelectedImage(
                                                                                `${process.env.REACT_APP_AZURE_BLOB_URL}${floorPlan?.bucket_name}/${floorPlan?.doc_file_name}`
                                                                            )
                                                                        }
                                                                        className="view"
                                                                    >
                                                                        <img
                                                                            src="/img/floor-icon.svg"
                                                                            alt=""
                                                                        />
                                                                        {t(
                                                                            "View Floor Plan"
                                                                        )}
                                                                    </button>
                                                                    : <p>
                                                                        {t("No floor plan available for this property")}
                                                                    </p>
                                                            }
                                                        </h6>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space">
                                                <h6>{t("Description")}</h6>
                                                <div
                                                    dangerouslySetInnerHTML={sanitizedDescription()}
                                                />
                                            </div>

                                            {Number(city) ===
                                                ABUDHABICITYID && (
                                                    <div className="analytics-wrap space">
                                                        <h6>
                                                            {t("Analytics Area")}
                                                        </h6>
                                                        <AreaComparision />
                                                        <div className="priceanalytic mb10">
                                                            <h3>
                                                                {t("Sale trend")}
                                                            </h3>
                                                            <p>
                                                                {t(
                                                                    "View the listing price trends of similar properties"
                                                                )}
                                                            </p>
                                                            <SaleTrendChart />
                                                        </div>

                                                        <div className="priceanalytic">
                                                            <h3>
                                                                {t("Average Price")}
                                                            </h3>
                                                            <p>
                                                                {t(
                                                                    "View the average price trends of similar properties"
                                                                )}
                                                            </p>
                                                            <AveragePriceChart />
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <FloorPlanModal image={selectedImage} />
                </div>
            </section>
        </React.Fragment>
    );
};

export default Details;
