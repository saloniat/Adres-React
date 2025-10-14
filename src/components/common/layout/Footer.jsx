import React from "react";
import useTranslationHook from "../../hooks/useTranslationHook";
import { Link } from "react-router-dom";
import { handleContactUsModal } from "../../../redux/slice/modalSlice";
import { useDispatch } from "react-redux";
import ContactUsModal from "../ContactUsModal";

const Footer = () => {
    const { t } = useTranslationHook();
    const dispatch = useDispatch();
    const quickLinksFirst = [
        {
            label: "About Us",
            url: "/about-us",
        },
        {
            label: "Contact Us",
            onClick: (e) => {
                e.preventDefault();
                dispatch(handleContactUsModal(true));
            },
            url: "",
        },
        // {
        //     label: "Clients",
        //     url: "/clients",
        // },
        {
            label: "Terms & Conditions",
            url: "/terms-and-condition",
        },
    ];
    const quickLinksSecond = [
        {
            label: "Privacy Policy",
            url: "/privacy-policy",
        },
        {
            label: "FAQs",
            url: "/faq",
        },
        // {
        //     label: "Blog",
        //     url: "/blog",
        // },
    ];
    const socialLink = [
        {
            className: "fab fa-facebook-f",
            url: "https://www.facebook.com",
        },
        {
            className: "fa-brands fa-x-twitter",
            url: "https://www.twitter.com",
        },
        {
            className: "fa-brands fa-instagram",
            url: "https://www.instagram.com",
        },
    ];
    return (
        <footer className="footer ">
            <div className="container">
                <div className="row">
                    <div className="col-lg-5 col-md-6">
                        <h2 className="mb-4">
                            <img src="/img/logo-f.svg" alt="Auction Logo" />
                        </h2>
                        <p className="mb-4">
                            {t("Our trusted platform for seamless property")}{" "}
                            <br />
                            {t("auctions. Buy, sell, and bid with confidence.")}
                        </p>
                        <div className="social-links d-flex">
                            {socialLink.map((item, index) => {
                                return (
                                    <Link
                                        className="mr-4"
                                        key={index + item.className}
                                        to={item?.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <i className={item.className}></i>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="col-lg-2 col-md-6">
                        {quickLinksFirst.map((item, index) => {
                            return (
                                <Link
                                    className="btn-link"
                                    to={item?.url}
                                    key={index + item.label}
                                    onClick={item?.onClick}
                                >
                                    {t(`${item.label}`)}
                                </Link>
                            );
                        })}
                    </div>
                    <div className="col-lg-2 col-md-6">
                        {quickLinksSecond.map((item, index) => {
                            return (
                                <Link
                                    className="btn-link"
                                    to={item?.url}
                                    key={index + item.label}
                                >
                                    {t(`${item.label}`)}
                                </Link>
                            );
                        })}
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <div className="app-btns">
                            <a
                                href="void:(0)"
                                onClick={(e) => e.preventDefault()}
                                className="app-link mb-3"
                            >
                                <img src="/img/appstore-icon.svg" alt="" />
                            </a>
                            <a
                                href="void:(0)"
                                onClick={(e) => e.preventDefault()}
                                className="app-link"
                            >
                                <img src="/img/googleplay-icon.svg" alt="" />
                            </a>
                        </div>
                    </div>
                </div>
                <ContactUsModal
                    title={"Anything on your mind? Just reach out!"}
                    content={
                        "our support team is available 9am - 6pm Sunday to Saturday."
                    }
                    handleModalCancel={() =>
                        dispatch(handleContactUsModal(false))
                    }
                    handleModalOpen={() => dispatch(handleContactUsModal(true))}
                />
            </div>

            <div className="container">
                <div className="col-lg-12">
                    <div className="copyright">
                        {t("© Copyright 2024 HandyHub. All rights reserved.")}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
