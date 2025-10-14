import React from "react";
import { useDispatch, useSelector } from "react-redux";
import FileUploadItem from "./FileUploadItem";
import { setFormStep } from "../../../redux/action/sellerAction";
import useTranslationHook from "../../hooks/useTranslationHook";

const PropertyUpload = () => {
    const dispatch = useDispatch();
    const { t } = useTranslationHook();

    const { documents, gallery } = useSelector(
        (state) => state.seller.property.stepFourData
    ),
        handleFormStep = (step) => {
            dispatch(setFormStep(step));
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        },
        isFormValid = () => {
            return (
                documents?.titleDeed &&
                // documents?.floorPlans &&
                gallery?.coverImage &&
                gallery?.propertyImage?.length >= 5
            );
        };

    const submitProperty = () => {
        handleFormStep(5);
    };

    return (
        <section className="property-wrap">
            <div className="container py-5">
                <div className="row justify-content-md-center">
                    <div className="col-lg-8">
                        <div className="counter">{t("4/5")}</div>
                        <h5 className="display-5 mb-3">{t("Uploads")}</h5>
                        <ul className="property-progress">
                            {[...Array(3)].map((_, i) => (
                                <li key={i} className="full"></li>
                            ))}
                            <li className="active"></li>
                        </ul>
                        <div className="prop-bdr">
                            <div className="row pb-4">
                                <div className="col-md-12">
                                    <h6>{t("Documents")}</h6>
                                    <ul className="doc-list">
                                        <FileUploadItem
                                            iconSrc="/img/documents-icon.svg"
                                            title={t("Title Deed")}
                                            required={true}
                                            subtitle={
                                                !documents?.titleDeed &&
                                                t("1 Image Required")
                                            }
                                            bucketName="deed"
                                            section="documents"
                                            property="titleDeed"
                                            docType="12"
                                            documents={documents?.titleDeed}
                                            allowMultiple={false}
                                            uploadIdentifier="4"
                                        />
                                        <FileUploadItem
                                            iconSrc="/img/rulerW-icon.svg"
                                            title={t("Floor Plans")}
                                            subtitle={
                                                !documents?.floorPlans &&
                                                t("1 Image Required")
                                            }
                                            bucketName="floor_plans"
                                            section="documents"
                                            property="floorPlans"
                                            docType="12"
                                            documents={documents?.floorPlans}
                                            allowMultiple={false}
                                            uploadIdentifier="3"
                                        />
                                    </ul>
                                </div>
                                <div className="col-md-12">
                                    <hr />
                                </div>
                                <div className="col-md-12">
                                    <h6>{t("Gallery")}</h6>
                                    <ul className="gallery-list">
                                        <FileUploadItem
                                            iconSrc="/img/image-icon.svg"
                                            title={t("Cover Image")}
                                            required={true}
                                            subtitle={
                                                !gallery?.coverImage &&
                                                t("1 Image Required")
                                            }
                                            bucketName="property_image"
                                            section="gallery"
                                            property="coverImage"
                                            documents={gallery?.coverImage}
                                            docType="13"
                                            imageOnly={true}
                                            allowMultiple={false}
                                            uploadIdentifier="1"
                                        />
                                        <FileUploadItem
                                            iconSrc="/img/image-icon.svg"
                                            title={t("Property Images")}
                                            required={true}
                                            subtitle={
                                                gallery?.propertyImage?.length <
                                                    5
                                                    ? t(
                                                        "File Upload Subtitle Required Msg",
                                                        {
                                                            dynamicValueFirst:
                                                                5 -
                                                                gallery
                                                                    ?.propertyImage
                                                                    ?.length,
                                                            dynamicValueSecond:
                                                                5 -
                                                                    gallery
                                                                        ?.propertyImage
                                                                        ?.length >
                                                                    1
                                                                    ? "s"
                                                                    : "",
                                                        }
                                                    )
                                                    : ""
                                            }
                                            bucketName="property_image"
                                            section="gallery"
                                            property="propertyImage"
                                            documents={gallery?.propertyImage}
                                            docType="13"
                                            imageOnly={true}
                                            allowMultiple={true}
                                            uploadIdentifier="2"
                                        />
                                        <FileUploadItem
                                            iconSrc="/img/video-icon.svg"
                                            title={t("Video")}
                                            subtitle={t("mp4 or MOV")}
                                            bucketName="property_image"
                                            section="gallery"
                                            property="video"
                                            documents={gallery?.video}
                                            docType="13"
                                            videoOnly={true}
                                            allowMultiple={false}
                                        />
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <button
                                    onClick={() => {
                                        handleFormStep(3);
                                    }}
                                    className="btn btn-sky btn-lg"
                                >
                                    <i className="fa-solid fa-angle-left mr4"></i>
                                    {t("Back")}
                                </button>
                            </div>
                            <div className="col-md-6 right">
                                <button
                                    onClick={submitProperty}
                                    className="btn btn-primary btn-lg"
                                    disabled={!isFormValid()}
                                >
                                    {t("Next")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PropertyUpload;
