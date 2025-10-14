import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    clearProjectProperty,
    fetchProjectProperty,
} from "../../../redux/action/developerProjectAction";
import { createSlug, formatNumber, formatPrice } from "../../../helpers";
import { ACCOUNT } from "../../../utils/constants";
import useTranslationHook from "../../hooks/useTranslationHook";
import CardTimer from "../../common/CardTimer";
import useSocketSync from "../../hooks/useSocketSync";

const ProjectProperties = ({ project_id, limit }) => {
    const { t } = useTranslationHook();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { slug } = useParams();
    const user = useSelector((state) => state.auth.user);
    const account = useSelector((state) => state.profile.account);
    let lang = useSelector((state) => state.translation.lang);
    const { data: properties, total } = useSelector(
        (state) => state.project.projectProperties
    );

    const [propertyCurrentStatus, setPropertyCurrentStatus] = useState(
        properties?.map(() => ({
            label: "Loading...",
            className: "active",
        }))
    );

    const updatePropertyStatus = (index, newStatus) => {
        setPropertyCurrentStatus((prevState) => {
            const updatedState = [...prevState]; // Copy existing state
            updatedState[index] = newStatus; // Update specific property status
            return updatedState;
        });
    };

    useEffect(() => {
        if (!project_id || isNaN(Number(project_id))) {
            toast.error(t("Invalid project id"));
            return navigate("/not-found");
        }
        dispatch(
            fetchProjectProperty({
                user_id: user?.user_id,
                project_id,
                page_size: 3,
                ...(account === ACCOUNT.Buyer && { seller_status: 27 }),
            })
        );
    }, [project_id, limit]);

    const syncData = useSocketSync(
        properties,
        user?.user_id,
        "projectPropertySync"
    );
    return total === 0 ? null : (
        <div className="similarProperties-wrap">
            <h5>
                {t("Project Properties")}
                <Link
                    to={`/project-properties/${project_id}`}
                    state={{
                        slug: slug,
                        project_name: properties[0]?.project_name,
                    }}
                    className="see-link"
                    onClick={() => dispatch(clearProjectProperty())}
                >
                    {t("See all")}
                    <img src="/img/arrow-right.svg" alt="arrow" />
                </Link>
            </h5>

            <ul className="discover-list">
                {properties?.map(
                    (
                        {
                            id,
                            is_favourite,
                            property_name,
                            property_name_ar,
                            state_name,
                            community,
                            community_ar,
                            country,
                            bidding_start,
                            bidding_end,
                            status_id,
                            property_image: { image, bucket_name },
                            deposit_amount,
                        },
                        index
                    ) => {
                        const socketData = syncData[index];
                        return (
                            <li key={index}>
                                <figure>
                                    <Link
                                        to={`/property/detail/${createSlug(id, `${property_name || ""} ${country}`)}`}
                                    >
                                        <img
                                            className="slide-fixed"
                                            src="/img/trans-3x2.png"
                                            alt=""
                                        />
                                        <img
                                            className="slide-img"
                                            src={`${process.env.REACT_APP_AZURE_BLOB_URL}${image && bucket_name ? `${bucket_name}/${image}` : "property_image/default_property.jpg"}`}
                                            alt="Property Pic"
                                        />
                                        <div className="top">
                                            <div className="status-info">
                                                <span className="total-bid">
                                                    {t(
                                                        "discover card total bids",
                                                        {
                                                            totalBids:
                                                                socketData?.bid_count ||
                                                                0,
                                                        }
                                                    )}
                                                </span>

                                                <span
                                                    className={
                                                        propertyCurrentStatus[
                                                            index
                                                        ]?.className
                                                    }
                                                >
                                                    {
                                                        propertyCurrentStatus[
                                                            index
                                                        ]?.label
                                                    }
                                                </span>
                                            </div>
                                            <div className="like-btn">
                                                <button>
                                                    <img
                                                        src={`/img/${is_favourite ? "heart-icon-r.svg" : "heart-icon.svg"}`}
                                                        alt="Heart Icon"
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="bottom">
                                            {propertyCurrentStatus[index]
                                                ?.label !== "Closed" && (
                                                <div className="high-bid">
                                                    <small>
                                                        {syncData?.bid_count
                                                            ? t("Highest Bid")
                                                            : t(
                                                                  "Starting Price"
                                                              )}
                                                    </small>
                                                    <h6>
                                                        {t("Amount", {
                                                            amount: formatNumber(
                                                                socketData?.high_bid_amt ||
                                                                    socketData?.start_price ||
                                                                    0,
                                                                lang
                                                            ),
                                                        })}
                                                    </h6>
                                                </div>
                                            )}
                                            {syncData && (
                                                <CardTimer
                                                    data={{
                                                        start_date:
                                                            bidding_start,
                                                        end_date: bidding_end,
                                                        listing_status_id:
                                                            status_id,
                                                    }}
                                                    onStatusChange={(
                                                        newStatus
                                                    ) =>
                                                        updatePropertyStatus(
                                                            index,
                                                            newStatus
                                                        )
                                                    }
                                                />
                                            )}
                                        </div>
                                    </Link>
                                </figure>

                                <figcaption>
                                    <h6>
                                        {t(
                                            lang === "en"
                                                ? property_name || ""
                                                : property_name_ar || ""
                                        )}
                                    </h6>
                                    <div className="location">
                                        <span className="map-icon">
                                            <img
                                                src="/img/map-icon.svg"
                                                alt=""
                                            />
                                        </span>
                                        {`${t(state_name)}, ${t(lang === "en" ? community : community_ar || "")}`}
                                    </div>
                                    <div className="deposit-text">
                                        {t("Deposit")}:{" "}
                                        <span>
                                            {t("Amount", {
                                                amount: formatPrice(
                                                    deposit_amount,
                                                    lang
                                                ),
                                            })}
                                        </span>
                                    </div>
                                </figcaption>
                            </li>
                        );
                    }
                )}
            </ul>
        </div>
    );
};

export default ProjectProperties;
