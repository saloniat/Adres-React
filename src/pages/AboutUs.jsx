import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import parse from "html-react-parser";
import Layout from "../components/common/layout/Index";
import { useDispatch, useSelector } from "react-redux";
import { handleTermsAndConditions } from "../redux/action/terms&ConditionsAction";
import useTranslationHook from "../components/hooks/useTranslationHook";

function AboutUs() {
    const dispatch = useDispatch();
    let lang = useSelector((state) => state.translation.lang);
    const { t } = useTranslationHook();

    const aboutUsData = useSelector(
        (state) => state.termsAndConditions.aboutUsData
    );
    useEffect(() => {
        if (!Object.keys(aboutUsData).length) {
            dispatch(
                handleTermsAndConditions({
                    site_id: 3,
                    slug: "about-us",
                })
            );
        }
    }, []);

    return (
        <>
            <Helmet>
                <meta name="keywords" content={aboutUsData?.meta_key_word} />
                <meta
                    name="description"
                    content={aboutUsData?.meta_description}
                />
                <title>{aboutUsData?.meta_title}</title>
            </Helmet>

            <Layout>
                <section className="privacy-wrap">
                    <div className="container py-5">
                        <div className="row justify-content-md-center">
                            <div className="col-lg-10">
                                <h2>{t(aboutUsData?.page_title)}</h2>

                                <div className="privacy-box">
                                    <p>
                                        {parse(
                                            lang === "en"
                                                ? aboutUsData?.page_content ||
                                                      ""
                                                : aboutUsData?.page_content_ar ||
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

export default AboutUs;
