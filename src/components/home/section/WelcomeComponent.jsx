import React from "react";
import { useSelector } from "react-redux";
import useTranslationHook from "../../hooks/useTranslationHook";
import AutoTranslatedText from "../../common/Translation/AutoTranslateText";

const WelcomeComponent = () => {
    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
    const tokenLoading = useSelector((state) => state.auth.tokenLoading);
    let lang = useSelector((state) => state.translation.lang);
    const { t } = useTranslationHook();

    return (
        <section className="welcome-wrap">
            <div className="container py-5">
                <div className="row">
                    <div
                        className="col-lg-12 wow fadeInUp"
                        data-wow-delay="0.5s"
                    >
                        {isAuthenticated && !tokenLoading && (
                            <div className="welcome-box">
                                <h3>
                                    <em>{t("Welcome Back,")}</em>{" "}
                                    {t("name", {
                                        name: `${user?.first_name}`,
                                    })}
                                    {/* <AutoTranslatedText
                                        text={`${user?.first_name}`}
                                        targetLang={lang}
                                    /> */}
                                    !
                                    <span>
                                        {t(
                                            "Ready to explore exclusive auctions?"
                                        )}
                                    </span>
                                </h3>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WelcomeComponent;
