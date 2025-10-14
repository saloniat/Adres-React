import React from "react";
import { Helmet } from "react-helmet";
import Layout from "../components/common/layout/Index";
import useTranslationHook from "../components/hooks/useTranslationHook";
import { Link } from "react-router-dom";

function Blog() {
    const { t } = useTranslationHook();

    return (
        <>
            <Helmet>
                <meta
                    name="keywords"
                    content={t(
                        "Bidhome-Adres, CRE, brokers, investment, commercial real estate, sales, auction"
                    )}
                />
                <meta
                    name="description"
                    content={t(
                        "Bidhome-Adres brings buyers, sellers, and brokers together to efficiently market and close commercial real estate deals in online CRE auctions."
                    )}
                />
                <title>{t("Blog")}</title>
            </Helmet>

            <Layout>
                <section className="privacy-wrap">
                    <div className="container py-5">
                        <div className="row justify-content-md-center">
                            <div className="col-lg-6 text-center">
                                <h2>{t("We're Coming Soon")}</h2>
                                <p>
                                    {t(
                                        "Our blog is coming soon! Get ready to explore expert insights, bidding tips, platform updates, and success stories from the world of online auctions. Whether you're new to auctions or a seasoned pro, our upcoming blog will offer valuable content to help you navigate and succeed in the online auction space. Stay tuned — exciting updates are on the way!"
                                    )}
                                </p>
                                <Link to={"/"}>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                    >
                                        {t("Back to home")}
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </Layout>
        </>
    );
}

export default Blog;
