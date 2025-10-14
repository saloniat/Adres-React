import React, { useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, loadUser } from "../../redux/action/authAction";
import { Link } from "react-router-dom";
import Breadcrumb from "../common/Breadcrumb";
import MediaUpload from "../common/MediaUpload";
import {
    handleSwitchAccount,
    uploadProfilePic,
    handleProfileUpdate,
} from "../../redux/action/profileAction";
import { ACCOUNT, accountStatus, PROFILE_IMG } from "../../utils/constants";
import { documentType, profileLinks, profileTabs } from "../../helpers";
import { useForm } from "react-hook-form";
import { handleAccountStatus } from "../../redux/action/verificationAction";
import useTranslationHook from "../hooks/useTranslationHook";
import { toast } from "react-toastify";

const Setting = () => {
    const { control } = useForm();
    const user = useSelector((state) => state.auth.user);
    const account = useSelector((state) => state.profile.account);
    const dispatch = useDispatch();
    const { t } = useTranslationHook();

    const handleAccount = () => {
        switch (account) {
            case 0:
                toast.info("Account has been switched to Seller mode.");
                dispatch(handleSwitchAccount(ACCOUNT.Seller));
                sessionStorage.setItem("Account", ACCOUNT.Seller);
                break;
            default:
                toast.info("Account has been switched to Buyer mode.");
                dispatch(handleSwitchAccount(ACCOUNT.Buyer));
                sessionStorage.setItem("Account", ACCOUNT.Buyer);
                break;
        }
    };
    const handleImgUpload = (file) => {
        const formData = new FormData();
        formData.append("user_id", user.user_id);
        formData.append("site_id", user.site_id);
        formData.append("document_type", documentType);
        formData.append("bucket_name", "profile_image");
        formData.append("upload_data", file);
        dispatch(uploadProfilePic(formData)).then((res) => {
            if (res.status === 200) {
                if (res.data.error === 0) {
                    const uploadId = res.data.data.upload_id;
                    const profileData = {
                        site_id: user.site_id,
                        user_id: user.user_id,
                        profile_image: uploadId,
                        first_name: user.first_name,
                        email: user.email,
                        phone_no: user.phone_no,
                        phone_country_code: user.phone_country_code,
                    };
                    dispatch(handleProfileUpdate(profileData));
                }
            }
        });
    };

    const ProfileLinks = useMemo(() => {
        return profileLinks.filter(
            (item) => item.name !== "Dashboard" || user?.user_type === 2
        );
    }, [user]);

    const handleClick = () => {
        if (user?.is_account_verified === accountStatus.success) {
            dispatch(handleAccountStatus(accountStatus.success));
        } else if (user?.is_account_verified === accountStatus.under_review) {
            dispatch(
                loadUser({
                    site_id: user.site_id,
                    user_id: user.user_id,
                })
            ).then((res) => {
                if (res?.error === 0) {
                    dispatch(handleAccountStatus(res.data.is_account_verified));
                }
            });
        } else dispatch(handleAccountStatus(""));
    };

    return (
        <>
            <Breadcrumb
                links={[
                    { url: "/", name: t("Home") },
                    { url: "", name: t("Profile") },
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
                                <div className="profile-pic">
                                    <figure>
                                        <img
                                            src={
                                                user?.profile_image?.bucket_name
                                                    ? `${process.env.REACT_APP_AZURE_BLOB_URL}${user?.profile_image?.bucket_name}/${user?.profile_image?.doc_file_name}`
                                                    : "/img/default.jpg"
                                            }
                                            alt=""
                                        />
                                        <div className="profile-uplaod">
                                            <MediaUpload
                                                handleChange={handleImgUpload}
                                                types={PROFILE_IMG.AllowTypes}
                                                control={control}
                                                name="profile_pic"
                                            />
                                        </div>
                                    </figure>
                                    <div className="profile-name">
                                        <h5>
                                            {t(user?.first_name)}
                                            {user?.is_account_verified ===
                                                accountStatus.success && (
                                                <img
                                                    src="/img/blue-check.svg"
                                                    alt=""
                                                />
                                            )}
                                        </h5>
                                    </div>
                                    <div className="text-center">
                                        <Link
                                            to="/"
                                            onClick={handleAccount}
                                            className="btn btn-primary btn-lg"
                                        >
                                            <img
                                                src="/img/switch-icon.svg"
                                                alt="Switch Icon"
                                            />{" "}
                                            {t("Switch Account")}
                                        </Link>
                                    </div>
                                </div>
                                {user?.is_account_verified &&
                                    user?.is_account_verified !==
                                        accountStatus.success && (
                                        <div className="verified-box">
                                            <div className="alert alert-rejected">
                                                <img
                                                    src="/img/info-icon-ornge.svg"
                                                    alt="Info Icon"
                                                />
                                                {user.is_account_verified ===
                                                    accountStatus.not_verify &&
                                                    t(
                                                        "Your account is not verified"
                                                    )}
                                                {user.is_account_verified ===
                                                    accountStatus.under_review &&
                                                    t(
                                                        "Your account is under review"
                                                    )}
                                                {user.is_account_verified ===
                                                    accountStatus.unsuccess &&
                                                    t(
                                                        "We couldn’t verify your account. Please try again."
                                                    )}
                                            </div>
                                            <Link
                                                to="/verify"
                                                className="verify-btn"
                                                onClick={handleClick}
                                            >
                                                {user.is_account_verified ===
                                                accountStatus.not_verify
                                                    ? t("Verify Now")
                                                    : user.is_account_verified ===
                                                        accountStatus.under_review
                                                      ? t("View Current Status")
                                                      : t("Retry Verification")}
                                            </Link>
                                        </div>
                                    )}
                                <ul
                                    className={`profile-tabs ${account === ACCOUNT.Seller ? "justify-content-center" : ""}`}
                                >
                                    {profileTabs
                                        ?.filter((ele) => {
                                            return (
                                                account === ACCOUNT.Buyer ||
                                                ele.name === "Inbox"
                                            );
                                        })
                                        .map((ele) => (
                                            <li key={ele.name}>
                                                <Link to={ele.url}>
                                                    <img
                                                        src={ele.img}
                                                        alt={ele.alt}
                                                    />
                                                    {t(ele.name)}
                                                </Link>
                                            </li>
                                        ))}
                                </ul>
                                <ul className="profile-links">
                                    {ProfileLinks.map((item, index) =>
                                        item.url !== "" ? (
                                            <li key={index}>
                                                <Link to={item.url}>
                                                    {t(item.name)}
                                                </Link>
                                            </li>
                                        ) : (
                                            <li key={index}>
                                                <Link
                                                    to=""
                                                    onClick={() => {
                                                        dispatch(
                                                            handleSwitchAccount(
                                                                ACCOUNT.Buyer
                                                            )
                                                        );
                                                        dispatch(logout());
                                                    }}
                                                >
                                                    {t(item.name)}
                                                </Link>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Setting;
