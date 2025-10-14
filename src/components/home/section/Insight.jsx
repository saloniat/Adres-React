import React, { useEffect } from 'react'
import useTranslationHook from '../../hooks/useTranslationHook';
import { handlePropertyStatistics } from '../../../redux/action/authAction';
import { useDispatch, useSelector } from 'react-redux';

const Insight = () => {
    const dispatch = useDispatch()
    const { t } = useTranslationHook();
    const propertyStats = useSelector(state => state.auth.propertyStats)

    const { auction_value, available_auction_count, sold_property_count, total_property_count, loading } = propertyStats || {};

    useEffect(() => {
        if (!loading) return;
        dispatch(handlePropertyStatistics());
    }, [loading])

    return (
        <section className="insight-wrap">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6">
                        <figure>
                            <img src="img/insight-pic.png" alt="" />
                        </figure>
                    </div>
                    <div className="col-lg-6">
                        <h3>
                            {t("Insights into Real Estate Auction Dynamics")}
                        </h3>
                        <p>
                            {t("Bid on high-quality, one-of-a-kind finds in this exceptional selection of special objects.")}
                        </p>

                        <ul>
                            <li>
                                <div className="icon">
                                    <img src="img/property-sold-icon.svg" alt="" />
                                </div>
                                <h4>
                                    {sold_property_count}
                                    <sup>
                                        +
                                    </sup>
                                </h4>
                                <p>
                                    {t("Properties sold")}
                                </p>
                            </li>
                            <li>
                                <div className="icon">
                                    <img src="img/total-property-icon.svg" alt="" />
                                </div>
                                <h4>
                                    {total_property_count}
                                    <sup>
                                        +
                                    </sup>
                                </h4>
                                <p>
                                    {t("Total Properties")}
                                </p>
                            </li>
                            <li>
                                <div className="icon">
                                    <img src="img/available-auction-icon.svg" alt="" />
                                </div>
                                <h4>
                                    {available_auction_count}
                                    <sup>
                                        +
                                    </sup>
                                </h4>
                                <p>
                                    {t("Available Auctions")}
                                </p>
                            </li>
                            <li>
                                <div className="icon">
                                    <img src="img/auction-value-icon.svg" alt="" />
                                </div>
                                <h4>
                                    {Math.floor(auction_value / 1000)}K
                                    <sup>
                                        +
                                    </sup>
                                </h4>
                                <p>
                                    {t("Auctions Value")}
                                </p>
                            </li>
                        </ul>

                    </div>
                </div>
            </div>
        </section>
    )
}

export default Insight
