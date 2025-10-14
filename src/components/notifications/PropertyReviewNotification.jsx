import React, { useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { guessDateTime } from "../../utils/dateUtils";
import {
    fetchPropertyDetail,
    resetProperty,
    setCountries,
} from "../../redux/action/sellerAction";
import { VACANCY_OPTIONS, checkAuctionStatus } from "../../utils/constants";
import { createSlug } from "../../helpers";
import useTranslationHook from "../hooks/useTranslationHook";
const PropertyDetails = ({ propertyId }) => {
    const dispatch = useDispatch();
    const { t } = useTranslationHook();
    const countries = useSelector((state) => state.seller.countries);

    const propertyData = useSelector(
        (state) => state.seller.property.propertyData
    );
    const account_verification_type = useSelector(
        (state) => state.auth.user?.account_verification_type
    );
    useEffect(() => {
        dispatch(resetProperty());
        dispatch(fetchPropertyDetail(propertyId));
        //eslint-disable-next-line
    }, [propertyId]);
    const slug = createSlug(
        propertyData?.id,
        `${propertyData?.property_name} ${propertyData?.country}`
    );

    const isAuction = checkAuctionStatus(propertyData?.seller_status_id);
    let lang = useSelector((state) => state.translation.lang);

    useLayoutEffect(() => {
        if (!countries || countries?.length === 0) dispatch(setCountries());
    }, []);

    return (
        <section className="propertyR-wrap py-5">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="heading">
                            <h2>{t("Property Details")}</h2>
                            <Link
                                to={
                                    isAuction
                                        ? `/seller/auction/detail/${slug}`
                                        : `/seller/property/${slug}`
                                }
                                className="btn btn-primary btn-md"
                            >
                                {isAuction
                                    ? t(`Edit Auction`)
                                    : t(`Edit Submission`)}
                            </Link>
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div className="alert alert-rejected" role="alert">
                            <img src="/img/info-icon-ornge.svg" alt="" />
                            {t("Notification Content", {
                                msg:
                                    propertyData?.seller_status_id === 29
                                        ? t("has been returned for updates.")
                                        : propertyData?.seller_status_id === 28
                                            ? t("is ready for publish.")
                                            : propertyData?.seller_status_id ===
                                                27
                                                ? t("is now live on auction.")
                                                : t("is under review."),
                            })}
                        </div>
                    </div>
                    {propertyData?.seller_status_id === 29 &&
                        propertyData?.seller_property_return_reason && (
                            <Feedback
                                returnReason={
                                    propertyData?.seller_property_return_reason
                                }
                                t={t}
                            />
                        )}
                    <div className="reviews-details">
                        <h5>{t("Ownership Info")}</h5>
                        <div className="add-item">
                            {console.info({ propertyData })}
                            {propertyData?.owners?.map((owner, index) => (
                                <OwnershipInfo
                                    key={index}
                                    index={index + 1}
                                    owner={owner}
                                    accountVerificationType={
                                        account_verification_type
                                    }
                                    t={t}
                                    lang={lang}
                                    countries={countries}
                                />
                            ))}
                        </div>
                    </div>
                    <hr />
                    <ReviewsDetails title={t("Property Details")}>
                        <PropertyDetailsInfo
                            country={propertyData?.country}
                            city={propertyData?.state}
                            municipality={
                                lang === "en"
                                    ? propertyData?.municipality
                                    : propertyData?.municipality_ar || ""
                            }
                            community={
                                lang == "en"
                                    ? propertyData?.community
                                    : propertyData?.community_ar
                            }
                            projectName={
                                lang === "en"
                                    ? propertyData?.project_name
                                    : propertyData?.project_name_ar || ""
                            }
                            propertyType={propertyData?.property_type}
                            propertyName={propertyData?.property_name}
                            propertyNameArabic={propertyData?.property_name_ar}
                            building={propertyData?.building}
                            t={t}
                        />
                    </ReviewsDetails>
                    <hr />
                    <ReviewsDetails title={t("Property Features")}>
                        <PropertyFeatures
                            areaSize={propertyData?.square_footage}
                            beds={propertyData?.beds}
                            baths={propertyData?.baths}
                            parking={
                                propertyData?.number_of_outdoor_parking_spaces
                            }
                            vacancy={VACANCY_OPTIONS[propertyData?.vacancy]}
                            rentalTill={propertyData?.rental_till}
                            constructionStatus={
                                propertyData?.construction_status_name
                            }
                            description={propertyData?.description}
                            descriptionArabic={propertyData?.description_ar}
                            amenities={propertyData?.amenities}
                            tags={propertyData?.tags}
                            t={t}
                            lang={lang}
                        />
                    </ReviewsDetails>
                    <hr />
                    <Uploads
                        property_doc={propertyData?.property_doc}
                        property_video={propertyData?.property_video}
                        property_pic={propertyData?.property_pic}
                        t={t}
                    />
                </div>
            </div>
        </section>
    );
};

const handleViewMedia = (href = null) => {
    href && window.open(href, "_blank");
};

const Feedback = ({ returnReason, t }) => (
    <div className="col-lg-12">
        <div className="feedback-msg mb-5">
            <div className="icon">
                <img src="/img/info-icon-ornge.svg" alt="" />
            </div>
            <h6>{t("Feedback")}</h6>
            <p>{t(returnReason || "")}</p>
        </div>
    </div>
);

const ReviewsDetails = ({ title, children }) => (
    <div className="reviews-details">
        <h5>{title}</h5>
        <div className="add-item">{children}</div>
    </div>
);

const OwnershipInfo = ({ index, owner, t, lang, countries }) => {
    return (
        <>
            <div className="block">
                <h6>
                    <span>
                        {t("Owner Number", {
                            index,
                        })}
                    </span>{" "}
                    {t(owner?.ownerName)}
                </h6>
            </div>
            <div className="block">
                <h6>
                    <span>{t("Nationality")}</span>{" "}
                    {t(
                        countries.find(
                            (item) => item.value === owner?.owner_nationality
                        )?.label || t("Not Applicable")
                    )}
                </h6>
            </div>
            <div className="block">
                <h6>
                    <span>
                        {" "}
                        {owner.useEID === "true" ? t("EID") : t("Passport")}
                    </span>{" "}
                    {owner.useEID === "true"
                        ? t(owner?.eid)
                        : t(owner?.passport)}
                </h6>
            </div>
            <div className="block">
                <h6>
                    <span>{t("Date of Birth")}</span>{" "}
                    {guessDateTime(owner?.dob, "DD-MM-YYYY", 0, lang)}
                </h6>
            </div>
            <div className="block">
                <h6>
                    <span>{t("Phone number")}</span> {t(owner?.phone)}
                </h6>
            </div>
            <div className="block">
                <h6>
                    <span>{t("Email ID")}</span> {t(owner?.email)}
                </h6>
            </div>
            <div className="block">
                <h6>
                    <span>{t("Property Share")}</span>{" "}
                    {t(owner?.sharePercentage)}%
                </h6>
            </div>
        </>
    );
};

const PropertyDetailsInfo = ({
    country,
    city,
    municipality,
    community,
    propertyType,
    projectName,
    propertyName,
    propertyNameArabic,
    building,
    t,
}) => (
    <>
        {[
            { label: "Country", value: country || "" },
            { label: "City", value: city || "" },
            { label: "Municipality", value: municipality || "" },
            { label: "Project", value: projectName },
            { label: "Community", value: community },
            { label: "Property Type", value: propertyType },
            { label: "Property Name", value: propertyName },
            { label: "Property Name in Arabic", value: propertyNameArabic },
            { label: "Building Number", value: building },
        ].map((item, index) => (
            <div className="block" key={index}>
                <h6>
                    <span>{t(item.label)}</span> {t(item.value)}
                </h6>
            </div>
        ))}
    </>
);

const PropertyFeatures = ({
    constructionStatus,
    areaSize,
    parking,
    beds,
    baths,
    vacancy,
    rentalTill,
    description,
    descriptionArabic,
    amenities,
    tags,
    t,
    lang,
}) => (
    <>
        {[
            { label: "Area Size", value: areaSize },
            {
                label: "Number of Bedrooms",
                value: beds || "Studio",
            },
            { label: "Number of Bathrooms Label", value: baths },
            { label: "Number of Parking's", value: parking },
            { label: "Vacancy", value: vacancy },
            {
                label: "Rental Date",
                value: rentalTill
                    ? guessDateTime(new Date(rentalTill), "D MMM YYYY", 0, lang)
                    : t("NA"),
            },
            { label: "Construction Status", value: constructionStatus },
        ].map((item, index) => (
            <div className="block" key={index}>
                <h6>
                    <span>{t(item.label)}</span> {t(item.value)}
                </h6>
            </div>
        ))}
        <div className="block full-block">
            <h6>
                <span>{t("Description")}</span>
                {/* {t(description)} */}
                <span style={{ all: "unset" }} dangerouslySetInnerHTML={{ __html: t(description) }}></span>
            </h6>
        </div>
        <div className="block full-block">
            <h6>
                <span>{t("Description in Arabic")}</span>
                {/* {t(descriptionArabic)} */}
                <span style={{ all: "unset" }} dangerouslySetInnerHTML={{ __html: t(descriptionArabic) }}></span>

            </h6>
        </div>
        <div className="block full-block mb0">
            <h6>
                <span>{t("Amenities")}</span>
            </h6>
            <ul className="amenities">
                {amenities?.map((amenity, index) => (
                    <li key={index}>{t(amenity?.feature_name)}</li>
                ))}
            </ul>
        </div>
        <div className="block full-block mb0">
            <h6>
                <span>{t("Tags")}</span>
            </h6>
            <ul className="amenities">
                {tags?.map((tag, index) => (
                    <li key={index}>{t(tag?.label)}</li>
                ))}
            </ul>
        </div>
    </>
);

const Uploads = ({ property_doc, property_video, property_pic, t }) => {
    return (
        <div className="reviews-details">
            <h5>{t("Uploads")}</h5>
            <UploadList
                title={"Documents"}
                items={["Title Deed", "Floor Plans"]}
                icon="/img/doc-icon.svg"
                media={[
                    property_doc?.filter(
                        (item) => item.upload_identifier === 4
                    ),
                    property_doc?.filter(
                        (item) => item.upload_identifier === 3
                    ),
                ]}
                t={t}
            />
            <UploadList
                title="Images"
                items={["Cover Image", "Property Image", "Video"]}
                icon="/img/image-iconB.svg"
                media={[
                    property_pic?.filter(
                        (item) => item.upload_identifier === 1
                    ),
                    property_pic?.filter(
                        (item) => item.upload_identifier === 2
                    ),
                    property_video,
                ]}
                t={t}
            />
        </div>
    );
};

const UploadList = ({ title, items, icon, media, t }) => {
    return (
        <div className="clearfix pb-4">
            <h6>{t(title)}</h6>
            <ul className="doc-list">
                {items.map((item, index) =>
                    item === "Property Image" ? (
                        media[index]?.map((element, index) => (
                            <li key={index}>
                                <div className="item">
                                    <div className="block">
                                        <div className="icon">
                                            <img src={icon} alt="" />
                                        </div>
                                        <h6>
                                            {t(item)}
                                            <span key={index}>
                                                {t(element?.doc_file_name)}
                                            </span>
                                        </h6>
                                    </div>
                                    <div className="block">
                                        <button
                                            onClick={() =>
                                                handleViewMedia(
                                                    element?.bucket_name
                                                        ? `${process.env.REACT_APP_AZURE_BLOB_URL}${element?.bucket_name}/${element?.doc_file_name}`
                                                        : null
                                                )
                                            }
                                            className="btn btn-white"
                                        >
                                            {t("View")}{" "}
                                            <img
                                                src="/img/eye.svg"
                                                alt="Eye Icon"
                                            />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li key={index}>
                            <div className="item">
                                <div className="block">
                                    <div className="icon">
                                        <img src={icon} alt="" />
                                    </div>
                                    <h6>
                                        {t(item)}
                                        {media[index]?.map((element, index) => (
                                            <span key={index}>
                                                {t(element?.doc_file_name)}
                                            </span>
                                        ))}
                                    </h6>
                                </div>
                                <div className="block">
                                    {media[index]?.[0]?.bucket_name && (
                                        <button
                                            onClick={() =>
                                                handleViewMedia(
                                                    media[index]?.[0]
                                                        ?.bucket_name
                                                        ? `${process.env.REACT_APP_AZURE_BLOB_URL}${media[index]?.[0]?.bucket_name}/${media[index]?.[0]?.doc_file_name}`
                                                        : null
                                                )
                                            }
                                            className="btn btn-white"
                                        >
                                            {t("View")}{" "}
                                            <img
                                                src="/img/eye.svg"
                                                alt="Eye Icon"
                                            />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </li>
                    )
                )}
            </ul>
        </div>
    );
};

export default PropertyDetails;
