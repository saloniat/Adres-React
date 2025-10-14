import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setFormStep, saveProperty } from "../../../redux/action/sellerAction";
import { ABUDHABICITYID, VACANCY_OPTIONS } from "../../../utils/constants";
import { guessDateTime } from "../../../utils/dateUtils";
import useTranslationHook from "../../hooks/useTranslationHook";
import { formatEID, toEasternArabicNumerals } from "../../../helpers";
import { resetSellerListingProperties } from "../../../redux/slice/sellerSlice";

const PropertyReview = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslationHook();

    const { id } = useParams();

    const account_verification_type = useSelector(
        (state) => state.auth.user.account_verification_type
    );
    let lang = useSelector((state) => state.translation.lang);
    const {
        countries,
        cities,
        municipalities,
        districts,
        projects,
        propertyTypes,
        constructionStatus,
        communitys,
    } = useSelector((state) => state.seller);

    const { stepFourData, stepOneData, stepTwoData, stepThreeData } =
        useSelector((state) => state.seller.property);

    const { documents, gallery } = stepFourData || {};
    const handleFormStep = (step) => {
        dispatch(setFormStep(step));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const submitProperty = () => {
        const formData = {
            step: 1,
            owners: stepOneData,
            ...(id && { property_id: id }),
            property_pic: [
                ...(gallery?.coverImage ? [gallery.coverImage] : []),
                ...(gallery?.propertyImage || []),
            ],
            property_video: gallery?.video ? [gallery.video] : [],
            property_documents: [documents?.floorPlans, documents?.titleDeed],
            ...stepTwoData,
            ...stepThreeData,
        };

        dispatch(resetSellerListingProperties());
        dispatch(saveProperty(formData, navigate));
    };
    return (
        <section className="property-wrap">
            <div className="container py-5">
                <div className="row justify-content-md-center">
                    <div className="col-lg-10">
                        <div className="counter">{t("5/5")}</div>
                        <h5 className="display-5 mb-3">{t("Review")}</h5>
                        <ul className="property-progress">
                            {[...Array(4)].map((_, i) => (
                                <li key={i} className="full"></li>
                            ))}
                            <li className="active"></li>
                        </ul>

                        <div className="prop-bdr">
                            <div
                                className="prop-accordian accordion accordion-flush"
                                id="accordionFlushExample"
                            >
                                <AccordionItem
                                    id="ownership-collapseOne"
                                    title={t("Ownership Info")}
                                >
                                    {stepOneData?.map((owner, index) => (
                                        <div
                                            className="types"
                                            key={owner.id || index}
                                        >
                                            <PropertyDetailBlock
                                                label={t("Owner Number", {
                                                    index: toEasternArabicNumerals(
                                                        index + 1,
                                                        lang
                                                    ),
                                                })}
                                                value={t(owner.ownerName)}
                                            />
                                            <PropertyDetailBlock
                                                label={t("Nationality")}
                                                value={t(
                                                    countries.find(
                                                        (item) =>
                                                            item.value ===
                                                            (owner?.owner_nationality ||
                                                                Number(
                                                                    owner?.nationality
                                                                ))
                                                    )?.label ||
                                                    t("Not Applicable")
                                                )}
                                            />
                                            <PropertyDetailBlock
                                                label={
                                                    owner.useEID === "false"
                                                        ? t("Passport")
                                                        : t("EID")
                                                }
                                                value={
                                                    owner.useEID === "false"
                                                        ? t(owner.passport)
                                                        : t(formatEID(owner.eid))
                                                }
                                            />
                                            <PropertyDetailBlock
                                                label={t("Date of Birth")}
                                                value={
                                                    t(owner.dob) ||
                                                    t("DD/MM/YYYY")
                                                }
                                            />
                                            <PropertyDetailBlock
                                                label={t("Phone Number")}
                                                value={`+${t(owner.phone)}`}
                                            />
                                            <PropertyDetailBlock
                                                label={t("Email ID")}
                                                value={t(owner.email)}
                                            />
                                            <PropertyDetailBlock
                                                label={t("Property Share")}
                                                value={`${t(owner.sharePercentage)}%`}
                                            />
                                        </div>
                                    ))}
                                </AccordionItem>

                                <AccordionItem
                                    id="property-collapseTwo"
                                    title={t("Property Details")}
                                >
                                    <div className="types">
                                        <PropertyDetailBlock
                                            label={t("Country")}
                                            value={t(
                                                getLabel(
                                                    countries,
                                                    stepTwoData?.country
                                                )
                                            )}
                                        />
                                        <PropertyDetailBlock
                                            label={t("City")}
                                            value={t(
                                                getLabel(
                                                    cities,
                                                    stepTwoData?.city
                                                )
                                            )}
                                        />
                                        <PropertyDetailBlock
                                            label={t("Municipality")}
                                            value={t(
                                                getLabel(
                                                    municipalities,
                                                    stepTwoData?.municipality,
                                                    lang
                                                )
                                            )}
                                        />
                                        <PropertyDetailBlock
                                            label={t("District")}
                                            value={t(
                                                getLabel(
                                                    districts,
                                                    stepTwoData?.district,
                                                    lang
                                                )
                                            )}
                                        />
                                        <PropertyDetailBlock
                                            label={t("Community")}
                                            value={t(
                                                Number(stepTwoData.city) ===
                                                    ABUDHABICITYID
                                                    ? getLabel(
                                                        communitys,
                                                        stepTwoData?.community,
                                                        lang
                                                    )
                                                    : stepTwoData?.community
                                            )}
                                        />
                                        <PropertyDetailBlock
                                            label={t("Project")}
                                            value={t(
                                                getLabel(
                                                    projects,
                                                    stepTwoData?.project
                                                )
                                            )}
                                        />

                                        <PropertyDetailBlock
                                            label={t("Property Name")}
                                            value={t(
                                                stepTwoData?.property_name
                                            )}
                                        />

                                        <PropertyDetailBlock
                                            label={t("Property Name in Arabic")}
                                            value={t(
                                                stepTwoData?.property_name_ar
                                            )}
                                        />

                                        <PropertyDetailBlock
                                            label={t("Property Type")}
                                            value={t(
                                                getLabel(
                                                    propertyTypes,
                                                    stepTwoData?.propertyType
                                                )
                                            )}
                                        />
                                        <PropertyDetailBlock
                                            label={t("Building")}
                                            value={t(stepTwoData?.building)}
                                        />
                                    </div>
                                </AccordionItem>

                                <AccordionItem
                                    id="property-collapseThree"
                                    title={t("Property Features")}
                                >
                                    <div className="types">
                                        <PropertyDetailBlock
                                            label={t("Area Size")}
                                            value={toEasternArabicNumerals(
                                                stepThreeData?.areaSize,
                                                lang
                                            )}
                                        />
                                        <PropertyDetailBlock
                                            label={t(
                                                "Number Of Bedrooms Label"
                                            )}
                                            value={
                                                parseInt(
                                                    stepThreeData?.numOfBedrooms
                                                ) === 0
                                                    ? t("Studio")
                                                    : toEasternArabicNumerals(
                                                        stepThreeData?.numOfBedrooms,
                                                        lang
                                                    )
                                            }
                                        />
                                        <PropertyDetailBlock
                                            label={t(
                                                "Number of Bathrooms Label"
                                            )}
                                            value={toEasternArabicNumerals(
                                                stepThreeData?.numOfBathrooms,
                                                lang
                                            )}
                                        />
                                        <PropertyDetailBlock
                                            label={t("Number of Parkings")}
                                            value={toEasternArabicNumerals(
                                                stepThreeData?.numOfParkings,
                                                lang
                                            )}
                                        />
                                        <PropertyDetailBlock
                                            label={t("Vacancy")}
                                            value={t(
                                                VACANCY_OPTIONS[
                                                stepThreeData?.vacancy
                                                ] || "Not Applicable"
                                            )}
                                        />
                                        {stepThreeData?.vacancy === 1 &&
                                            stepThreeData?.rentalTill && (
                                                <PropertyDetailBlock
                                                    label={t("Rental Date")}
                                                    value={guessDateTime(
                                                        stepThreeData.rentalTill,
                                                        "DD MMM YYYY",
                                                        0,
                                                        lang
                                                    )}
                                                />
                                            )}
                                        <PropertyDetailBlock
                                            label={t("Construction Status")}
                                            value={t(
                                                getLabel(
                                                    constructionStatus,
                                                    stepThreeData?.constructionStatus
                                                )
                                            )}
                                        />
                                        <PropertyDetailBlock
                                            label={t("Description")}
                                            value={stepThreeData?.description}
                                            isFullBlock
                                        />

                                        <PropertyDetailBlock
                                            label={t("Description in Arabic")}
                                            value={
                                                stepThreeData?.description_ar
                                            }
                                            isFullBlock
                                        />

                                        <PropertyDetailBlock
                                            label={t("Amenities")}
                                            value={stepThreeData?.amenities}
                                            isFullBlock
                                            isList
                                        />
                                        <PropertyDetailBlock
                                            label={t("Tags")}
                                            value={
                                                Array.isArray(
                                                    stepThreeData?.tags
                                                ) && stepThreeData?.tags.length
                                                    ? stepThreeData?.tags
                                                    : t("None selected")
                                            }
                                            isFullBlock={
                                                Array.isArray(
                                                    stepThreeData?.tags
                                                ) && stepThreeData?.tags.length
                                                    ? true
                                                    : false
                                            }
                                            isList={
                                                Array.isArray(
                                                    stepThreeData?.tags
                                                ) && stepThreeData?.tags.length
                                                    ? true
                                                    : false
                                            }
                                        />
                                    </div>
                                </AccordionItem>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <button
                                    onClick={() => handleFormStep(4)}
                                    className="btn btn-sky btn-lg"
                                >
                                    <i className="fa-solid fa-angle-left mr4"></i>{" "}
                                    {t("Back")}
                                </button>
                            </div>
                            <div className="col-md-6 right">
                                <button
                                    onClick={submitProperty}
                                    className="btn btn-primary btn-lg"
                                >
                                    {t("Submit")}{" "}
                                    <i className="fa-solid fa-angle-right ml4"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const AccordionItem = ({ id, title, children }) => (
    <div className="accordion-item">
        <h2 className="accordion-header">
            <button
                className="accordion-button fw-semibold"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#${id}`}
            >
                {title}
            </button>
        </h2>
        <div
            id={id}
            className="accordion-collapse collapse show"
            data-bs-parent="#accordionFlushExample"
        >
            <div className="accordion-body">{children}</div>
        </div>
    </div>
);

const PropertyDetailBlock = ({
    label,
    value,
    isFullBlock = false,
    isList = false,
}) => {
    const { t } = useTranslationHook();
    return (
        <div className={`block ${isFullBlock ? "full-block" : ""}`}>
            <h6>
                <span>{label}</span>{" "}
                {!isList
                    ? (
                        <span
                            style={{ all: "unset" }}
                            dangerouslySetInnerHTML={{ __html: value }}
                        />
                    ) || t("Not Applicable")
                    : ""}
            </h6>
            <ul className="amenities">
                {isList &&
                    value?.length &&
                    value?.map((value) => (
                        <li key={value?.value}>{t(value?.label)}</li>
                    ))}
            </ul>
        </div>
    );
};

const getLabel = (list, value, lang) => {
    let temp = list?.find((item) => String(item.value) === String(value));
    return (
        (!temp
            ? ""
            : !lang
                ? temp.label
                : lang === "en"
                    ? temp.label
                    : temp.label_ar) || "Not Applicable"
    );
};

export default PropertyReview;
