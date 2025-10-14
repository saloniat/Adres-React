import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import parse from "html-react-parser";
import Layout from "../components/common/layout/Index";
import { useDispatch, useSelector } from "react-redux";
import { handleTermsAndConditions } from "../redux/action/terms&ConditionsAction";
import useTranslationHook from "../components/hooks/useTranslationHook";

function TermsAndCondition() {
    const dispatch = useDispatch();
    const termsAndConditionsData = useSelector(
        (state) => state.termsAndConditions.termsAndConditionsData
    );
    let lang = useSelector((state) => state.translation.lang);
    const { t } = useTranslationHook();
    useEffect(() => {
        if (!termsAndConditionsData) {
            dispatch(
                handleTermsAndConditions({
                    site_id: 3,
                    slug: "terms-and-conditions",
                })
            );
        }
    }, []);

    return (
        <>
            <Helmet>
                <meta
                    name="keywords"
                    content={termsAndConditionsData?.meta_key_word}
                />
                <meta
                    name="description"
                    content={termsAndConditionsData?.meta_description}
                />
                <title>{termsAndConditionsData?.meta_title}</title>
            </Helmet>

            <Layout>
                <section className="privacy-wrap">
                    <div className="container py-5">
                        <div className="row justify-content-md-center">
                            <div className="col-lg-10">
                                <h2>
                                    {t(
                                        lang === "en"
                                            ? termsAndConditionsData?.page_title
                                            : termsAndConditionsData?.page_title
                                    )}
                                </h2>
                                <div className="privacy-box">
                                    {parse(
                                        lang === "en"
                                            ? termsAndConditionsData?.page_content ||
                                                  ""
                                            : termsAndConditionsData?.page_content_ar ||
                                                  ""
                                    )}
                                    {/* <div className="row">
                                        <div className="col-lg-3">
                                            <ul className="terms-link">
                                                {state.map(
                                                    ({
                                                        menuTitle,
                                                        status,
                                                        id,
                                                    }) => (
                                                        <li
                                                            key={id}
                                                            {...(status && {
                                                                className:
                                                                    "active",
                                                            })}
                                                            onClick={() =>
                                                                setState(
                                                                    (prev) =>
                                                                        prev.map(
                                                                            (
                                                                                item
                                                                            ) => ({
                                                                                ...item,
                                                                                status:
                                                                                    item.id ===
                                                                                    id
                                                                                        ? true
                                                                                        : false,
                                                                            })
                                                                        )
                                                                )
                                                            }
                                                        >
                                                            {menuTitle}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                        <div className="col-lg-9">
                                            {state.map(
                                                ({ status, render }) =>
                                                    status && render
                                            )}
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </Layout>
        </>
    );
}

export default TermsAndCondition;
