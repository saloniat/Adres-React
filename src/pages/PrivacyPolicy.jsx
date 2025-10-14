import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import parse from "html-react-parser";
import Layout from "../components/common/layout/Index";
import { useDispatch, useSelector } from "react-redux";
import { handleTermsAndConditions } from "../redux/action/terms&ConditionsAction";
import useTranslationHook from "../components/hooks/useTranslationHook";

function PrivacyPolicy() {
    const dispatch = useDispatch();
    let lang = useSelector((state) => state.translation.lang);
    const { t } = useTranslationHook();

    const privacyPolicyData = useSelector(
        (state) => state.termsAndConditions.privacyPolicyData
    );
    useEffect(() => {
        if (!privacyPolicyData) {
            dispatch(
                handleTermsAndConditions({
                    site_id: 3,
                    slug: "privacy-policy",
                })
            );
        }
    }, []);

    return (
        <>
            <Helmet>
                <meta
                    name="keywords"
                    content={privacyPolicyData?.meta_key_word}
                />
                <meta
                    name="description"
                    content={privacyPolicyData?.meta_description}
                />
                <title>{privacyPolicyData?.meta_title}</title>
            </Helmet>

            <Layout>
                <section className="privacy-wrap">
                    <div className="container py-5">
                        <div className="row justify-content-md-center">
                            <div className="col-lg-10">
                                <h2>{t(privacyPolicyData?.page_title)}</h2>

                                <div className="privacy-box">
                                    <p>
                                        {parse(
                                            lang === "en"
                                                ? privacyPolicyData?.page_content ||
                                                      ""
                                                : privacyPolicyData?.page_content_ar ||
                                                      ""
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </Layout>
        </>
    );
}

export default PrivacyPolicy;
