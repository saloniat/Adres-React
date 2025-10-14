import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    handleVerificationStep,
    handleVerificationDocument,
    handleAccountStatus,
} from "../../redux/action/verificationAction";
import { VERIFICATION_STEP } from "../../utils/constants";
import { useForm } from "react-hook-form";
import RadioButton from "../common/form/RadioButton";
import { verificationFormFields } from "../../helpers";
import Button from "../common/Button";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { loadUser } from "../../redux/action/authAction";
import useTranslationHook from "../hooks/useTranslationHook";

const VerifyAccStep = () => {
    const { t } = useTranslationHook();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const dispatch = useDispatch();
    const under_review = 24;

    const [state, setState] = useState({
        uaeResident: null,
        fileNames: {},
        file: {},
        error: false,
        uploadFileId: {
            frontId: "",
            backId: "",
            passportId: "",
        },
        fileInputRefs: {},
    });
    const verification_step = useSelector(
        (state) => state.verification.verification_step
    );
    const user = useSelector((state) => state.auth.user);

    const renderProgress = (verification_step) => {
        switch (verification_step) {
            case 2:
                return (
                    <>
                        <li className="active"></li>
                        <li></li>
                        <li></li>
                    </>
                );

            case 3:
                return (
                    <>
                        <li className="full"></li>
                        <li className="active"></li>
                        <li></li>
                    </>
                );
            case 4:
                return (
                    <>
                        <li className="full"></li>
                        <li className="full"></li>
                        <li className="active"></li>
                    </>
                );
            default:
                return null;
        }
    };

    const renderRadioBtn = (item, t) => (
        <>
            <h6>{t(item.heading)}</h6>
            <ul className="verify-list mb-5" key={item.id}>
                {item?.radioBtnField?.map((field) => (
                    <li key={`${item.id}-${field.id}`}>
                        <RadioButton
                            type={item.type}
                            id={field.id}
                            name={item.name}
                            value={t(field.value)}
                            label={t(field.label)}
                            labelClassName={item.labelClassname}
                            className={item.classname}
                            register={register}
                            errors={errors}
                            {...register(item.name, {
                                required: t("This field is required"),
                            })}
                        />
                    </li>
                ))}
                {errors?.uae_resident && (
                    <div className="required font14">
                        {t(errors.uae_resident?.message)}
                    </div>
                )}
            </ul>
        </>
    );

    const renderUploadBtn = (item, t) => (
        <>
            {item.uploadBtn.map((ele, index) => (
                <Fragment key={`${item.id}-${ele.name}`}>
                    <h6>{t(ele.heading)}</h6>
                    {state.fileNames[ele.name] &&
                        (ele.progressStatus ? (
                            <ul className="verify-progress-success">
                                <li className="active"></li>
                                <li></li>
                                <li></li>
                            </ul>
                        ) : (
                            <ol className="pdf-list">
                                <li>
                                    <div className="icon">
                                        <img src="/img/doc-icon.svg" alt="" />
                                    </div>
                                    <h6>
                                        {t(
                                            state.fileNames[ele.name] ||
                                                "No file uploaded"
                                        )}
                                    </h6>
                                    <Link
                                        to=""
                                        onClick={() => {
                                            handleDelete(ele.name);
                                        }}
                                        className="delete-icon"
                                    >
                                        <img
                                            src="/img/delete-icon.svg"
                                            alt=""
                                        />
                                    </Link>
                                </li>
                            </ol>
                        ))}
                    <div
                        className={
                            ele.name === "upload_Front_EID"
                                ? "mb-3"
                                : "clearfix mb-5"
                        }
                    >
                        <div className="doc-uplaod">
                            <button
                                className="btn btn-sky btn-full"
                                disabled={state.fileNames[ele.name]}
                            >
                                {t(ele.label)}
                                <img
                                    src={
                                        state.fileNames[ele.name]
                                            ? "/img/upload-icon-w.svg"
                                            : "/img/upload-icon.svg"
                                    }
                                    alt="Uplaod Icon"
                                    className="ml4"
                                />
                            </button>
                            <input
                                type="file"
                                name="myfile"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        handleFile(file, ele.name, index);
                                    }
                                }}
                                disabled={state.fileNames[ele.name]}
                                ref={(input) =>
                                    (state.fileInputRefs[ele.name] = input)
                                }
                            />
                        </div>
                        {state.error && !state.fileNames[ele.name] && (
                            <span className="required font14">
                                {t("Please upload a file to continue.")}
                            </span>
                        )}
                    </div>
                </Fragment>
            ))}
        </>
    );

    const renderFormField = (item, t) => {
        switch (true) {
            case item.option_type_display === "RadioButton":
                return (
                    <Fragment key={item.id}>{renderRadioBtn(item, t)}</Fragment>
                );
            case item.option_type_display === "UploadButton" &&
                state.uaeResident === "no":
                return (
                    <Fragment key={item.id}>
                        {renderUploadBtn(item, t)}
                    </Fragment>
                );
            case item.option_type_display === "UploadButtonEID" &&
                state.uaeResident === "yes":
                return (
                    <Fragment key={item.id}>
                        {renderUploadBtn(item, t)}
                    </Fragment>
                );
            default:
                return null;
        }
    };

    const handleDelete = (filename) => {
        setState((prevState) => {
            if (prevState.fileInputRefs[filename]) {
                prevState.fileInputRefs[filename].value = "";
            }

            return {
                ...prevState,
                fileNames: Object.fromEntries(
                    Object.entries(prevState.fileNames).filter(
                        ([key]) => key !== filename
                    )
                ),
                file: Object.fromEntries(
                    Object.entries(prevState.file).filter(
                        ([key]) => key !== filename
                    )
                ),
            };
        });
    };

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
        }));
    };

    const handleDocUpload = async (formData) => {
        const res = await dispatch(handleVerificationDocument(formData));
        if (res.status === 200 && res.data.error === 0) {
            dispatch(handleAccountStatus(under_review));
            window.location.reload();
        }
    };

    const handleVerification = () => {
        const formData = new FormData();
        formData.append("user", user.user_id);
        formData.append("site_id", user.site_id);
        if (state.uaeResident === "yes") {
            formData.append("front_eid", state.file.upload_Front_EID);
            formData.append("back_eid", state.file.upload_Back_EID);
            formData.append("verification_type", 1);
            handleDocUpload(formData);
        } else {
            formData.append("passport", state.file.passport);
            formData.append("verification_type", 2);
            handleDocUpload(formData);
        }
    };

    const validateRequiredFiles = (
        verification_step,
        state,
        verificationFormFields
    ) => {
        let hasError = false;

        verificationFormFields
            ?.filter(
                (item) =>
                    item.step === verification_step &&
                    (item.option_type_display === "UploadButton" ||
                        item.option_type_display === "UploadButtonEID")
            )
            .forEach((item) => {
                item.uploadBtn.forEach((ele) => {
                    if (state.uaeResident === "no") {
                        if (
                            ele.name === "passport" &&
                            !state.fileNames[ele.name]
                        ) {
                            hasError = true;
                        }
                    } else {
                        if (
                            (ele.name === "upload_Front_EID" &&
                                !state.fileNames[ele.name]) ||
                            (ele.name === "upload_Back_EID" &&
                                !state.fileNames[ele.name])
                        ) {
                            hasError = true;
                        }
                    }
                });
            });

        return hasError;
    };

    const onSubmit = (data) => {
        const hasError = validateRequiredFiles(
            verification_step,
            state,
            verificationFormFields
        );

        if (hasError) {
            setState((prev) => ({
                ...prev,
                error: true,
            }));
            return;
        }

        switch (verification_step) {
            case VERIFICATION_STEP.step_2:
                if (data.uae_resident !== state.uaeResident)
                    setState((prev) => ({
                        ...prev,
                        fileNames: {},
                        file: {},
                        uploadFileId: {
                            frontId: "",
                            backId: "",
                            passportId: "",
                        },
                    }));
                if (data.uae_resident === "yes") {
                    setState((prev) => ({
                        ...prev,
                        uaeResident: "yes",
                    }));
                } else {
                    setState((prev) => ({
                        ...prev,
                        uaeResident: "no",
                    }));
                }
                dispatch(handleVerificationStep(3));
                break;

            case VERIFICATION_STEP.step_3:
                handleVerification();
                break;

            default:
                break;
        }
    };

    return (
        <>
            <section className="verify-process-wrap">
                <div className="container py-5">
                    <div className="row justify-content-md-center">
                        <div
                            className="col-lg-6 wow fadeInUp"
                            data-wow-delay="0.5s"
                        >
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                autoComplete="off"
                                autoCapitalize="off"
                            >
                                <div className="verify-box">
                                    <h5>
                                        {t("Verify Your Account")}
                                        <span>
                                            {t(
                                                "Follow these steps to verify your account and start bidding."
                                            )}
                                        </span>
                                    </h5>

                                    <ul className="verify-progress">
                                        {renderProgress(verification_step)}
                                    </ul>
                                    {verificationFormFields
                                        ?.filter(
                                            (item) =>
                                                item.step === verification_step
                                        )
                                        .map((item) =>
                                            renderFormField(item, t)
                                        )}

                                    <div className="row">
                                        <div className="col-md-6">
                                            <Button
                                                className="btn btn-sky btn-lg"
                                                type="button"
                                                onClick={() => {
                                                    dispatch(
                                                        handleVerificationStep(
                                                            verification_step -
                                                                1
                                                        )
                                                    );
                                                    setState((prev) => ({
                                                        ...prev,
                                                        error: false,
                                                    }));
                                                }}
                                                label={t("Back")}
                                                backIconClassName="fa-solid fa-angle-left mr4"
                                            />
                                        </div>
                                        <div className="col-md-6 right">
                                            <Button
                                                className="btn btn-primary btn-lg"
                                                type="submit"
                                                label={t("Next")}
                                                nextIconClassName="fa-solid fa-angle-right ml4"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default VerifyAccStep;
