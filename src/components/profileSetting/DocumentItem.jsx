import React from "react";
import { Link } from "react-router-dom";
import useTranslationHook from "../hooks/useTranslationHook";

const DocumentItem = ({ isProfileEdit, doc, viewIcon, setState, state }) => {
    const { t } = useTranslationHook();

    const handleFile = (file, name) => {
        setState((prev) => ({
            ...prev,
            fileNames: {
                ...prev.fileNames,
                [name]: file.name,
            },
            file: {
                ...prev.file,
                [name]: file,
            },
            error: false,
        }));
    };
    return (
        <li className={isProfileEdit ? "active" : ""}>
            <div className="doc-left">
                <div className="icon">
                    {isProfileEdit ? null : (
                        <img src="/img/documents.svg" alt="Document Icon" />
                    )}
                </div>
                <div className="text-content">
                    <span className="title">{t(doc.title)}</span>
                    <a
                        href="void:(0)"
                        className="file-name"
                        onClick={(e) => e.preventDefault()}
                    >
                        {!isProfileEdit
                            ? t(doc.fileName)
                            : t(state?.fileNames[doc.title]) || ""}
                    </a>
                </div>
            </div>
            <div className="doc-right">
                {isProfileEdit ? (
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
                                accept=".pdf,.doc,.docx,image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        handleFile(file, doc.title);
                                    }
                                }}
                            />
                        </div>
                    </div>
                ) : (
                    <Link
                        to={`${process.env.REACT_APP_AZURE_BLOB_URL}${doc?.bucketName}/${doc?.fileName}`}
                        className="btn btn-white"
                        target="_blank"
                    >
                        {t("View")} <img src={viewIcon} alt="View Icon" />
                    </Link>
                )}
            </div>
        </li>
    );
};

export default DocumentItem;
