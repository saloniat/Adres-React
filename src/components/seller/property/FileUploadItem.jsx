import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
    uploadSellerPropertyMedia,
    saveStepFourData,
} from "../../../redux/action/sellerAction";
import { Link } from "react-router-dom";
import {
    ALLOWED_IMAGE_TYPES,
    ALLOWED_DOCUMENT_TYPES,
    ALLOWED_VIDEO_TYPES,
} from "../../../utils/constants";
import useTranslationHook from "../../hooks/useTranslationHook";
import { validateFileSignature } from "../../../helpers";
const FileUploadItem = ({
    iconSrc,
    title,
    subtitle,
    required = false,
    imageOnly = false,
    videoOnly = false,
    section = "documents",
    property,
    bucketName = "profile_image",
    allowMultiple = false,
    documents,
    uploadIdentifier = 5,
    docType = "12",
}) => {
    const dispatch = useDispatch();
    const { t } = useTranslationHook();

    const [showProgressBar, setShowProgressBar] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const handleFileChange = async (e) => {
        const selectedFiles = Array.from(e.target.files || []);
        const filteredFiles = selectedFiles.filter((file) => {
            if (videoOnly) return ALLOWED_VIDEO_TYPES.includes(file.type);
            if (imageOnly) return ALLOWED_IMAGE_TYPES.includes(file.type);
            return [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES].includes(
                file.type
            );
        });

        // const validFiles = filteredFiles.filter(file => file.size > 1024);
        const validFiles = [];
        for (const file of filteredFiles) {
            if (file.size < 1024) {
                continue;
            }
            const isValid = await validateFileSignature(file);
            if (!isValid) {
                continue;
            }
            validFiles.push(file);
        }

        if (validFiles.length !== selectedFiles.length) {
            // toast.error(t("File rejected due to invalid format or 0 KB size."));
            toast.error("File rejected: invalid format, too small, or unsupported content.");
            e.target.value = "";
            return;
        }
        const filesLength = selectedFiles.length;
        if (!filesLength) return;
        try {
            for (const [index, file] of selectedFiles.entries()) {
                await handleUploadImage(file, index + 1, filesLength);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            toast.error(t("Error uploading file") + ": " + error.message);
        }
        e.target.value = "";
    };
    const handleUploadImage = async (file, index = 0, filesLength = 0) => {
        try {
            const formData = new FormData();
            formData.append("site_id", localStorage.getItem("site_id") || "");
            formData.append("user", localStorage.getItem("user_id") || "");
            formData.append("doc_type", docType);
            formData.append("bucket_name", bucketName);
            formData.append("media", file);
            const storeData = {
                section,
                property,
                operation: "add",
                data: {
                    bucket_name: bucketName,
                    upload_id: null,
                    doc_file_name: null,
                    upload_identifier: uploadIdentifier,
                },
                index: null,
            };
            dispatch(
                uploadSellerPropertyMedia(
                    formData,
                    storeData,
                    setUploadProgress,
                    setShowProgressBar
                )
            ).then((payload) => {
                if (payload?.error === 0 && index === filesLength)
                    toast.success(payload.msg);
            });
        } catch (err) {
            console.error("Error uploading file:", err);
            toast.error(t("Error uploading file") + ": " + err.message);
        }
    };

    const handleDeleteImage = (index = null) => {
        if (!index) {
            console.log(t("Please select a valid image to delete."));
            return;
        }
        const data = {
            section,
            property,
            operation: "remove",
            data: {},
            index,
        };
        dispatch(saveStepFourData(data));
    };
    const renderDocuments = () => {
        if (property === "propertyImage" && Array.isArray(documents)) {
            return documents.map((image, index) => (
                <li key={index}>
                    <div className="icon">
                        <img src="/img/doc-icon.svg" alt="Document Icon" />
                    </div>
                    <h6>
                        <Link
                            to={`${process.env.REACT_APP_AZURE_BLOB_URL}${image?.bucket_name}/${image?.doc_file_name}`}
                            target="_blank"
                        >
                            {t(image?.doc_file_name) || t("Filename.pdf")}
                        </Link>
                    </h6>
                    <button
                        className="delete-icon"
                        onClick={() => handleDeleteImage(image?.upload_id)}
                    >
                        <img src="/img/delete-icon.svg" alt="Delete Icon" />
                    </button>
                </li>
            ));
        } else if (documents) {
            return (
                <li>
                    <div className="icon">
                        <img
                            src={
                                property === "video"
                                    ? "/img/video-iconB.svg"
                                    : property === "titleDeed"
                                        ? "/img/doc-icon.svg"
                                        : "/img/image-iconB.svg"
                            }
                            alt="Document Icon"
                        />
                    </div>
                    <h6>
                        <Link
                            to={`${process.env.REACT_APP_AZURE_BLOB_URL}${documents?.bucket_name}/${documents?.doc_file_name}`}
                            target="_blank"
                        >
                            {t(documents.doc_file_name)}
                        </Link>
                    </h6>
                    <button
                        className="delete-icon"
                        onClick={() => handleDeleteImage(documents?.upload_id)}
                    >
                        <img src="/img/delete-icon.svg" alt="Delete Icon" />
                    </button>
                </li>
            );
        }
        return null;
    };

    return (
        <li>
            <div className="item">
                <div className="block">
                    <div className="icon">
                        <img src={iconSrc} alt="Upload Icon" />
                    </div>
                    <h6>
                        {title} {required && "*"}
                        <span>{subtitle}</span>
                        <div
                            className="progress"
                            style={{
                                visibility: showProgressBar
                                    ? "visible"
                                    : "hidden",
                            }}
                        >
                            <div
                                className="progress-bar"
                                role="progressbar"
                                style={{ width: `${uploadProgress}%` }}
                                aria-valuenow={uploadProgress}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            ></div>
                        </div>
                    </h6>
                </div>
                <div className="block">
                    <div className="doc-upload">
                        <button className="btn btn-white">
                            {t("Upload")}
                            <img
                                src="/img/upload-icon.svg"
                                alt="Upload Icon"
                                className="ml4"
                            />
                        </button>
                        <input
                            type="file"
                            name="myfile"
                            accept={
                                videoOnly
                                    ? "video/*"
                                    : imageOnly
                                        ? "image/*"
                                        : ".pdf,.doc,.docx,image/*"
                            }
                            multiple={allowMultiple}
                            onChange={handleFileChange}
                        />
                    </div>
                </div>
            </div>
            <ol className="pdf-list">{renderDocuments()}</ol>
        </li>
    );
};

export default FileUploadItem;
