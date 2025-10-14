import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { handleEmailVerification } from "../../redux/action/profileAction";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader/Loader";
import useTranslationHook from "../hooks/useTranslationHook";
import { CommonLayout } from "../../pages/AccountVerify";
import Shimmer from "../common/shimmer/Shimmer";
import { authAction } from "../../redux/action/authAction";

const EmailVerification = () => {
    const dispatch = useDispatch();
    const [state, setState] = useState({
        loading: true,
        success: null,
    });
    const [searchParams] = useSearchParams();
    const user = useSelector((state) => state.auth.user);
    const verification_code = searchParams.get("token");
    const { t } = useTranslationHook();

    const navigate = useNavigate();
    useEffect(() => {
        if (!verification_code) {
            navigate("/");
            return;
        }
    }, []);

    useEffect(() => {
        dispatch(handleEmailVerification({ verification_code }))
            .then((res) => {
                if (res.status === 200 && res.data.error === 0) {
                    dispatch(
                        authAction.loadUser({
                            ...user,
                            is_email_verified: true,
                        })
                    );
                    setState((prev) => ({
                        ...prev,
                        loading: false,
                        success: true,
                    }));
                } else {
                    setState((prev) => ({
                        ...prev,
                        loading: false,
                        success: false,
                    }));
                }
            })
            .catch(() => {
                setState((prev) => ({
                    ...prev,
                    loading: false,
                    success: false,
                }));
            });
        //eslint-disable-next-line
    }, []);

    if (state.siteLoader && state.success === null) {
        return <Loader />;
    }

    return (
        <CommonLayout>
            <section className="login-wrap forgot-pwd">
                <div className="container py-5">
                    <div className="row justify-content-md-center">
                        <div
                            className="col-lg-6 wow fadeInUp"
                            data-wow-delay="0.5s"
                        >
                            <div className="payment-box">
                                {state.loading ? (
                                    <Shimmer
                                        key={"1"}
                                        type="rectangle"
                                        borderRadius={"50px"}
                                        width="100px"
                                        height="100px"
                                    />
                                ) : (
                                    <div className="payment-check">
                                        <img
                                            src={
                                                state.success
                                                    ? "/img/payment-check.svg"
                                                    : "/img/close-l.svg"
                                            }
                                            alt={
                                                state.success
                                                    ? "Payment Check"
                                                    : "Payment Cross"
                                            }
                                        />
                                    </div>
                                )}
                                {state.loading ? (
                                    <Shimmer
                                        key={"2"}
                                        type="rectangle"
                                        width="100%"
                                        height="150px"
                                    />
                                ) : (
                                    <>
                                        <h4 className="display-4 mb-4">
                                            {!state.success
                                                ? t(
                                                      "Your email verification failed. Please try again or request a new verification link."
                                                  )
                                                : t(
                                                      "Your email has been verified successfully!"
                                                  )}
                                        </h4>
                                    </>
                                )}
                                {state.loading ? (
                                    <Shimmer
                                        key={"3"}
                                        type="rectangle"
                                        width="100%"
                                        borderRadius={"30px"}
                                        height="50px"
                                    />
                                ) : (
                                    <>
                                        <div className="mb-4">
                                            <Link
                                                to="/"
                                                className="btn btn-primary btn-lg btn-full"
                                            >
                                                {t("Return to Home screen")}
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </CommonLayout>
    );
};

export default EmailVerification;
