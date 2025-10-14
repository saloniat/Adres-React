import React from "react";
import useTranslationHook from "../../hooks/useTranslationHook";
import { Link } from "react-router-dom";
const Footer = () => {
    const { t } = useTranslationHook();
    const quickLinks = [
        {
            label: "Terms & Conditions",
            url: "/terms-and-condition",
        },
        {
            label: "Privacy Policy",
            url: "/privacy-policy",
        },
        {
            label: "FAQs",
        },
    ];
    return (
        <footer className="footer-small container-fluid">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 col-md-6">
                        <div className="links">
                            {quickLinks.map((item, _index) => {
                                return (
                                    <Link key={_index} to={item?.url}>
                                        {t(item.label)}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6 text-end">
                        <div className="copyright">
                            {t(
                                "© Copyright 2024 HandyHub. All rights reserved."
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
export default Footer;
