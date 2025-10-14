import React from "react";
import { Link } from "react-router-dom";
import useTranslationHook from "../hooks/useTranslationHook";

const Breadcrumb = ({ links }) => {
    const { t } = useTranslationHook();

    return (
        <div className="breadcrumb-wrap">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <nav
                            style={{ "--bs-breadcrumb-divider": "'>'" }}
                            aria-label="breadcrumb"
                        >
                            <ol className="breadcrumb">
                                {links.map((link, index) =>
                                    link?.url !== "" ? (
                                        <li
                                            key={index}
                                            className="breadcrumb-item"
                                        >
                                            <Link to={link?.url}>
                                                {t(link?.name)}
                                            </Link>
                                        </li>
                                    ) : (
                                        <li
                                            key={index}
                                            className="breadcrumb-item active"
                                            aria-current="page"
                                        >
                                            <span>{t(link?.name)}</span>
                                        </li>
                                    )
                                )}
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Breadcrumb;
