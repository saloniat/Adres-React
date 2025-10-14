import React, { useEffect } from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { createSlug } from "../../../helpers";
import { formatPrice } from "../../../helpers";
import { useDispatch } from "react-redux";
import useTranslationHook from "../../hooks/useTranslationHook";
import { fetchWinningProperty } from "../../../redux/action/buyerAction";
import WonCard from "./WonCard";
const AuctionWon = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const wonAuctions = useSelector((state) => state.buyer.wonAuction?.data);
    const totalWonAuctions = useSelector(
        (state) => state.buyer.wonAuction?.total
    );
    const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
    const { t } = useTranslationHook();
    const lang = useSelector((state) => state.translation.lang);

    useEffect(() => {
        if (user?.user_id) dispatch(fetchWinningProperty());
    }, [user?.user_id]);

    if (!isAuthenticated || !Array.isArray(wonAuctions) || !wonAuctions?.length)
        return <></>;
    return (
        <section className="wonauction-wrap">
            <div className="container pb-5">
                <div className="row">
                    <div
                        className="col-lg-12 wow fadeInUp"
                        data-wow-delay="0.5s"
                    >
                        <div className="main-heading">
                            <h3>
                                <span>{t("You've Won the Auction!")}</span>
                            </h3>
                            {totalWonAuctions > 2 && (
                                <Link
                                    className="see-link"
                                    to="/won-auction"
                                    data-discover="true"
                                >
                                    {t("See all")}{" "}
                                    <img
                                        src="img/arrow-r.svg"
                                        alt="arrow right"
                                    />
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="col-lg-12">
                        <ul className="wonauction-list">
                            {wonAuctions?.slice(0, 2).map((ele, ind) => (
                                <React.Fragment key={ind}>
                                    <WonCard
                                        ele={ele}
                                        index={ind}
                                        wonAuctions={wonAuctions}
                                        t={t}
                                        lang={lang}
                                    />
                                </React.Fragment>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AuctionWon;
