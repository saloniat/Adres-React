import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import Layout from "../components/common/layout/Index";
import { useDispatch, useSelector } from "react-redux";
import useTranslationHook from "../components/hooks/useTranslationHook";
import { handleFaq } from "../redux/action/faqAction";
import { Pagination } from "../components/common/Pagination";
import { handlePage, handleTabIndex } from "../redux/slice/faqSlice";
import DOMPurify from "dompurify";

function Faq() {
    const tabIndex = useSelector((state) => state.faq.tabIndex);
    const site_id = useSelector((state) => state.auth?.user?.site_id);
    const user_id = useSelector((state) => state.auth?.user?.user_id);
    const buyerPage = useSelector((state) => state.faq?.buyerData.page);
    const sellerPage = useSelector((state) => state.faq?.sellerData.page);
    const buyerPageSize = useSelector((state) => state.faq?.buyerData.pageSize);
    const sellerPageSize = useSelector(
        (state) => state.faq?.sellerData.pageSize
    );
    const buyerTotalPage = useSelector(
        (state) => state.faq?.buyerData.totalPage
    );
    const sellerTotalPage = useSelector(
        (state) => state.faq?.sellerData.totalPage
    );
    const buyerDataLoading = useSelector(
        (state) => state.faq?.buyerData.buyerDataLoading
    );
    const sellerDataLoading = useSelector(
        (state) => state.faq?.sellerData.sellerDataLoading
    );

    const buyerData = useSelector((state) => state.faq?.buyerData.data);
    const sellerData = useSelector((state) => state.faq?.sellerData.data);

    const page = tabIndex === 1 ? buyerPage : sellerPage;
    const pageSize = tabIndex === 1 ? buyerPageSize : sellerPageSize;
    const totalPage = tabIndex === 1 ? buyerTotalPage : sellerTotalPage;
    const lang = useSelector((state) => state.translation.lang);
    const { t } = useTranslationHook();
    const tabs = [
        {
            label: "Buyer",
            id: "buyer",
            index: 1,
        },
        {
            label: "Seller",
            id: "seller",
            index: 2,
        },
    ];
    const dispatch = useDispatch();
    useEffect(() => {
        if (
            (tabIndex === 1 && buyerDataLoading) ||
            (tabIndex === 2 && sellerDataLoading)
        ) {
            dispatch(
                handleFaq({
                    site_id: site_id || 3,
                    faq_type: tabIndex,
                    user: Number(user_id || ""),
                    page,
                    page_size: pageSize,
                })
            );
        }
    }, [tabIndex, buyerPage, sellerPage]);
    const handlePageChange = (page) => {
        dispatch(handlePage(page));
    };
    const sanitizedText = (text) => ({
        __html: DOMPurify.sanitize(text),
    });
    const onTabClick = (index) => {
        dispatch(handleTabIndex(index));
    };
    return (
        <>
            <Helmet>
                <meta
                    name="keywords"
                    content="Bidhome-Adres, CRE, brokers, investment, commercial real estate, sales, auction"
                />
                <meta
                    name="description"
                    content="Bidhome-Adres brings buyers, sellers, and brokers together to efficiently market and close commercial real estate deals in online CRE auctions."
                />
                <title>Property Auction - faq</title>
            </Helmet>
            <Layout>
                <div className="faq-banner">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <h2>
                                    {t("Frequently Asked")}{" "}
                                    <span>{t("Questions")}</span>
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="tabs-header">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-12 col-md-12">
                                <ul
                                    className="nav nav-tabs"
                                    id="myTab"
                                    role="tablist"
                                >
                                    {tabs.map((item, key) => {
                                        return (
                                            <li
                                                className="nav-item"
                                                key={key}
                                                role="presentation"
                                                onClick={() =>
                                                    onTabClick(item.index)
                                                }
                                            >
                                                <button
                                                    className={`nav-link ${tabIndex === item.index ? "active" : ""}`}
                                                    id={`${item.id}-tab`}
                                                    data-bs-toggle="tab"
                                                    data-bs-target={`#${item.id}`}
                                                    type="button"
                                                    role="tab"
                                                    aria-controls={`${item.id}`}
                                                    aria-selected="true"
                                                >
                                                    {t(item.label)}
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="tabs-body">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12 col-md-12">
                                <div className="tab-content" id="myTabContent">
                                    <div
                                        className={`tab-pane fade show active`}
                                        id="buyer"
                                        role="tabpanel"
                                        aria-labelledby="buyer-tab"
                                    >
                                        {buyerData.length ? (
                                            <div
                                                className="accordion"
                                                id="accordionExample"
                                            >
                                                {buyerData.map(
                                                    (item, index) => {
                                                        const question =
                                                            sanitizedText(
                                                                lang === "en"
                                                                    ? item.question
                                                                    : item.question_ar ||
                                                                          ""
                                                            );
                                                        const answer =
                                                            sanitizedText(
                                                                lang === "en"
                                                                    ? item.answer
                                                                    : item.answer_ar ||
                                                                          ""
                                                            );
                                                        return (
                                                            <div
                                                                className="accordion-item"
                                                                key={index}
                                                            >
                                                                <h2
                                                                    className="accordion-header"
                                                                    id={`headingOne_${item.id}`}
                                                                >
                                                                    <button
                                                                        className={`accordion-button ${index > 0 ? "collapsed" : ""}`}
                                                                        type="button"
                                                                        data-bs-toggle="collapse"
                                                                        data-bs-target={`#collapseOne_${item.id}`}
                                                                        aria-expanded="true"
                                                                        aria-controls={`collapseOne_${item.id}`}
                                                                        dangerouslySetInnerHTML={
                                                                            question
                                                                        }
                                                                    ></button>
                                                                </h2>
                                                                <div
                                                                    id={`collapseOne_${item.id}`}
                                                                    className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`}
                                                                    aria-labelledby={`headingOne_${item.id}`}
                                                                    data-bs-parent="#accordionExample"
                                                                >
                                                                    <div
                                                                        className="accordion-body"
                                                                        dangerouslySetInnerHTML={
                                                                            answer
                                                                        }
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <p>
                                                    <img
                                                        src="img/no-property-found.png"
                                                        alt=""
                                                    />
                                                </p>
                                                <h4>{t("No Record Found")}</h4>
                                            </div>
                                        )}
                                    </div>

                                    <div
                                        className="tab-pane fade"
                                        id="seller"
                                        role="tabpanel"
                                        aria-labelledby="seller-tab"
                                    >
                                        <div
                                            className="accordion"
                                            id="accordionExample"
                                        >
                                            {sellerData.length ? (
                                                sellerData.map(
                                                    (item, index) => {
                                                        const question =
                                                            sanitizedText(
                                                                lang === "en"
                                                                    ? item.question
                                                                    : item.question_ar ||
                                                                          ""
                                                            );
                                                        const answer =
                                                            sanitizedText(
                                                                lang === "en"
                                                                    ? item.answer
                                                                    : item.answer_ar ||
                                                                          ""
                                                            );
                                                        return (
                                                            <div
                                                                className="accordion-item"
                                                                key={index}
                                                            >
                                                                <h2
                                                                    className="accordion-header"
                                                                    id={`headingOne_${item.id}`}
                                                                >
                                                                    <button
                                                                        className="accordion-button"
                                                                        type="button"
                                                                        data-bs-toggle="collapse"
                                                                        data-bs-target={`#collapseOne_${item.id}`}
                                                                        aria-expanded="true"
                                                                        aria-controls={`collapseOne_${item.id}`}
                                                                        dangerouslySetInnerHTML={
                                                                            question
                                                                        }
                                                                    ></button>
                                                                </h2>
                                                                <div
                                                                    id={`collapseOne_${item.id}`}
                                                                    className="accordion-collapse collapse"
                                                                    aria-labelledby={`headingOne_${item.id}`}
                                                                    data-bs-parent="#accordionExample"
                                                                >
                                                                    <div
                                                                        className="accordion-body"
                                                                        dangerouslySetInnerHTML={
                                                                            answer
                                                                        }
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                )
                                            ) : (
                                                <div className="text-center">
                                                    <p>
                                                        <img
                                                            src="img/no-property-found.png"
                                                            alt=""
                                                        />
                                                    </p>
                                                    <h4>
                                                        {t("No Record Found")}
                                                    </h4>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {totalPage > 1 && (
                    <Pagination
                        currentPage={page}
                        totalPages={totalPage}
                        onPageChange={handlePageChange}
                    />
                )}
            </Layout>
            <></>
        </>
    );
}

export default Faq;
