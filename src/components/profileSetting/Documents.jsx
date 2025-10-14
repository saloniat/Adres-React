import React, { useEffect, useState } from "react";
import Breadcrumb from "../common/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import { handleProfileEdit } from "../../redux/action/profileAction";
import DocumentItem from "./DocumentItem";
import Button from "../common/Button";
import { handleVerificationDocument } from "../../redux/action/verificationAction";
import { accountStatus } from "../../utils/constants";
import useTranslationHook from "../hooks/useTranslationHook";
import { authAction } from "../../redux/action/profileAction";

const Documents = () => {
    const dispatch = useDispatch();
    const [state, setState] = useState({
        uploadedFile: "",
        documents: [],
        fileNames: {},
        file: {},
        error: false,
    });

    const isProfileEdit = useSelector((state) => state.profile.isProfileEdit);
    const user = useSelector((state) => state.auth.user);
    const { t } = useTranslationHook();

    useEffect(() => {
        dispatch(handleProfileEdit(false));
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        let doc = [];
        if (user?.account_verification_type === 1) {
            doc = [
                {
                    title: t("Emirates ID Front"),
                    fileName:
                        user?.account_verification_image?.front_eid
                            ?.doc_file_name,
                    bucketName:
                        user?.account_verification_image?.front_eid.bucket_name,
                },
                {
                    title: t("Emirates ID Back"),
                    fileName:
                        user?.account_verification_image?.back_eid
                            ?.doc_file_name,
                    bucketName:
                        user?.account_verification_image?.back_eid.bucket_name,
                },
            ];
        } else if (user?.account_verification_type === 2) {
            doc = [
                {
                    title: t("Passport"),
                    fileName:
                        user?.account_verification_image?.passport
                            ?.doc_file_name,
                    bucketName:
                        user?.account_verification_image?.passport.bucket_name,
                },
            ];
        }
        setState((prev) => ({
            ...prev,
            documents: doc,
        }));
    }, [user]);

    const handleClick = () => {
        if (isProfileEdit) {
            const allFilesUploaded = state.documents.every(
                (doc) => state.file[doc.title]
            );

            if (!allFilesUploaded) {
                setState((prev) => ({
                    ...prev,
                    error: true,
                }));
                return;
            } else {
                setState((prev) => ({
                    ...prev,
                    error: false,
                }));
                handleFileUpload();
            }
        } else {
            if (user?.is_account_verified === accountStatus.success) {
                dispatch(handleProfileEdit(false));
            } else {
                setState((prev) => ({
                    ...prev,
                    fileNames: {},
                    file: {},
                    error: false,
                }));
                dispatch(handleProfileEdit(!isProfileEdit));
            }
        }
    };

    const handleVerificationDoc = async (formData) => {
        const res = await dispatch(handleVerificationDocument(formData));
        if (res.status === 200 && res.data.error === 0) {
            dispatch(handleProfileEdit(false));
            dispatch(authAction.handleUserLoading(true));
        }
    };
    const handleFileUpload = () => {
        const formData = new FormData();
        formData.append("user", user.user_id);
        formData.append("site_id", user.site_id);
        formData.append("is_update", 1);
        if (user?.account_verification_type === 1) {
            formData.append("front_eid", state.file["Emirates ID Front"]);
            formData.append("back_eid", state.file["Emirates ID Back"]);
            formData.append("verification_type", 1);
        } else if (user?.account_verification_type === 2) {
            formData.append("passport", state.file.Passport);
            formData.append("verification_type", 2);
        }
        handleVerificationDoc(formData);
    };
    return (
        <>
            <Breadcrumb
                links={[
                    { url: "/", name: t("Home") },
                    { url: "/profile-setting", name: t("Profile") },
                    { url: "", name: t("My Documents") },
                ]}
            />
            <section className="profile-section">
                <div className="container py-5">
                    <div className="row justify-content-md-center">
                        <div
                            className="col-lg-8 wow fadeInUp"
                            data-wow-delay="0.5s"
                        >
                            <div className="profile-wrap">
                                <div className="profile-top">
                                    <h2>{t("My Documents")}</h2>
                                    {state.documents?.length > 0 && (
                                        <Button
                                            label={
                                                isProfileEdit
                                                    ? t("Save")
                                                    : t("Edit")
                                            }
                                            type="button"
                                            className="btn btn-primary btn-md"
                                            onClick={() => handleClick()}
                                            disabled={
                                                !isProfileEdit &&
                                                user?.is_account_verified ===
                                                    accountStatus.success
                                            }
                                        />
                                    )}
                                </div>
                                <div className="basicInfo">
                                    <h4>{t("Documents")}</h4>
                                    {state.documents?.length > 0 ? (
                                        <ul className="documentList">
                                            {state.documents?.map(
                                                (doc, index) => (
                                                    <DocumentItem
                                                        key={index}
                                                        isProfileEdit={
                                                            isProfileEdit
                                                        }
                                                        doc={doc}
                                                        uploadIcon="/img/upload-icon.svg"
                                                        viewIcon="/img/eye.svg"
                                                        setState={setState}
                                                        state={state}
                                                    />
                                                )
                                            )}
                                        </ul>
                                    ) : (
                                        t("No Documents Uploaded")
                                    )}
                                    {state.error && (
                                        <p className="text-danger">
                                            {t(
                                                " Please upload all documents before saving."
                                            )}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Documents;
