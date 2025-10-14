import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { toggleFavouriteStatus } from "../../../redux/slice/buyerSlice";
import { removeFavourite } from "../../../redux/slice/profileSlice";
import { togglePropertyLike } from "../../../redux/action/sellerAction";
import { toggleBidFavouriteStatus } from "../../../redux/slice/bidSlice";
import DOMPurify from "dompurify";
import {
    ABUDHABICITYID,
    SELLER_PROPERTY_STATUS,
} from "../../../utils/constants";
import { Link } from "react-router-dom";
import { guessDateTime } from "../../../utils/dateUtils";
import {
    formatPrice,
    formatNumber,
    createSlug,
    getPropertyStatus,
} from "../../../helpers";
import AuctionBidding from "./right-panel/AuctionBidding";
import FloorPlanModal from "../../developerProject/projectDetail/FloorPlanModal";
import Gallery from "./Gallery";
import ShareButton from "../../common/ShareButton";
import SocketService from "../../../Service/SocketService";
import useTranslationHook from "../../hooks/useTranslationHook";
import {
    handleChat,
    handleSelectedUser,
    setIsChatInitiated,
    setSellerDetail,
} from "../../../redux/slice/inboxSlice";
import {
    handleContactUsModal,
    handleRetractBidModal,
} from "../../../redux/slice/modalSlice";
import ContactUsModal from "../../common/ContactUsModal";
import SimilarProperties from "./SimilarProperties";
import RetractBidModal from "./right-panel/modals/RetractBidModal";
import { SaleTrendChart } from "../../common/SaleTrendChart";
import { AveragePriceChart } from "../../common/AveragePriceChart";
import AreaComparision from "../../common/AreaComparision";
import PaymentFailureModal from "./right-panel/modals/PaymentFailureModal";
const Details = ({ propertyDetail }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslationHook();
    let lang = useSelector((state) => state.translation.lang);

    const modalRef = useRef(null);
    const {
        id: propertyId,
        project_name,
        project_name_ar,
        property_name_ar,
        property_pic,
        property_doc,
        property_video,
        description,
        description_ar,
        construction_status_name,
        property_name,
        state,
        country,
        community,
        community_ar,
        is_map_view,
        square_footage,
        beds,
        baths,
        amenities,
        tags,
        property_project_data: projectData,
        added_on,
        deposit_amount,
        listed_by,
        property_setting,
        is_favourite,
        property_auction_data,
        agent_id,
        property_for,
        is_chat_initiated,
        seller_status_id,
        seller_status_name,
        city,
        map_url: googleMapsUrl,
        payment_failed_status,
        payment_failed_message,
        payment_error_text,
        reg_transaction_id,
        purchase_forefit_status,
    } = propertyDetail;
    const { account: isSeller } = useSelector((state) => state.profile);
    const retractBidModal = useSelector((state) => state.modal.retractBidModal);

    const getStatus = (id, name) => ({
        label: id !== 27 ? name : "loading...",
        className:
            id === 27 || id === 28
                ? "active"
                : id === 29
                    ? "upcomingclr"
                    : "grayclr",
    });

    const [propertyCurrentStatus, setPropertyCurrentStatus] = useState(
        getStatus(seller_status_id, seller_status_name)
    );
    const [showFailureModal, setShowFailureModal] = useState(false);
    useEffect(() => {
        setShowFailureModal(!!payment_failed_status);
    }, [payment_failed_status]);
    const [isLiked, setIsLiked] = useState(is_favourite || false);
    const [purchaseForefitStatus, setPurchaseForefitStatus] = useState(
        purchase_forefit_status || null
    );
    const [offerUserId, setOfferedUserId] = useState(null)
    const [isRetracted, setIsRetracted] = useState(false);
    const [statusMessage, setStatusMessage] = useState(0);
    const user = useSelector((state) => state.auth.user);
    const { isConnected } = useSelector((state) => state.socket);
    const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
    const [selectedImage, setSelectedImage] = useState(null);
    const sanitizedDescription = () => ({
        __html: DOMPurify.sanitize(
            lang === "en" ? description : description_ar || ""
        ),
    });


    useEffect(() => {
        if (!isAuthenticated) {
            toast.info(t("Please sign in to contact the seller."));
            navigate("/sign-in");
            return;
        }
        const queryParams = new URLSearchParams(location.search);
        const buyNow = queryParams.get('buy_now');
        if (buyNow === "false") {
            setShowFailureModal(true)
            queryParams.delete('buy_now');
            navigate(
                {
                    pathname: location.pathname.endsWith('/')
                        ? location.pathname.slice(0, -1)
                        : location.pathname,
                    search: queryParams.toString() ? `?${queryParams.toString()}` : '',
                },
                { replace: true }
            )
        }
    }, [isAuthenticated, location.search, location.pathname, navigate,])


    const floorPlan =
        property_doc?.filter((doc) => doc.upload_identifier === 3)?.[0] ?? null;
    const openGoogleMaps = () => {
        if (!googleMapsUrl) return;
        window.open(googleMapsUrl, "_blank");
    };
    const address = `${property_name}, ${lang === "en" ? community : community_ar || ""}, ${state}, ${country}`;

    const submitReaction = () => {
        setIsLiked((prev) => !prev);
        dispatch(toggleFavouriteStatus(propertyId));
        dispatch(toggleBidFavouriteStatus(propertyId));
        const formData = {
            domain: 3,
            property: propertyId,
            ...(user?.user_id && { user: Number(user.user_id) }),
        };
        dispatch(togglePropertyLike(formData));
        toast.success(
            t(`${isLiked ? "Removed from" : "Added to"} favourite list`),
            {
                autoClose: 1000,
            }
        );
    };

    const handleReaction = (e) => {
        e.stopPropagation();
        if (user?.user_id) {
            if (!isLiked) submitReaction();
            else new window.bootstrap.Modal(modalRef.current).show();
        } else navigate("/sign-in");
    };

    const handleModalConfirm = () => {
        window.bootstrap.Modal.getInstance(modalRef.current).hide();
        if (is_favourite) dispatch(removeFavourite(propertyId));
        submitReaction();
    };

    const handleModalCancel = () => {
        window.bootstrap.Modal.getInstance(modalRef.current).hide();
    };

    useEffect(() => {
        SocketService.on("checkBid", ({ error, data }) => {
            if (!error) setOfferedUserId(data?.offerer_user_id)
            if (!error && propertyDetail?.seller_status_id === 27) {
                setPurchaseForefitStatus(data?.purchase_forefit_status);
                setPropertyCurrentStatus(
                    getPropertyStatus(
                        data?.listing_status_id,
                        data?.start_time_left_hr,
                        data?.time_left_hr,
                        data?.reserve_amount <= data?.high_bid_amt,
                        isSeller
                    )
                );
                const is_selected_highest_bid = data?.is_selected_highest_bid;
                const isReserveMet =
                    data?.reserve_amount !== undefined &&
                        data?.high_bid_amt !== undefined
                        ? data.reserve_amount <= data.high_bid_amt
                        : false;

                if (
                    data?.time_left_hr < 0 &&
                    data?.my_max_bid_val &&
                    isSeller === 0
                ) {
                    setStatusMessage(
                        isReserveMet || is_selected_highest_bid
                            ? data.max_bidder_user_id === Number(user?.user_id)
                                ? 1
                                : 0
                            : 2
                    );
                }
            }
        });
    }, [isConnected]);

    const handleSellerCotact = () => {
        !isAuthenticated &&
            toast.info(t("Please sign in to contact the seller."));

        const sellerData = {
            name: listed_by?.first_name,
            property_id: propertyId,
            seller_id: agent_id,
            profile_image: listed_by?.profile_image,
            is_chat_initiated: is_chat_initiated,
        };
        dispatch(setSellerDetail(sellerData));
        if (!sellerData.is_chat_initiated) {
            dispatch(setIsChatInitiated(1));
        } else {
            dispatch(setIsChatInitiated(2));
        }
        dispatch(handleSelectedUser(""));
        dispatch(handleChat([]));
        !isAuthenticated
            ? navigate("/sign-in?redirect=/inbox")
            : navigate("/inbox");
    };

    return (
        <React.Fragment>
            <Gallery
                images={[
                    ...(property_pic?.map((img) => img) || []),
                    ...(property_video?.map((vid) => vid) || []),
                ]}
            />
            <section className="details-wrap pb-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            {(statusMessage !== 0 ||
                                (purchaseForefitStatus ||
                                    purchase_forefit_status) === 2 ||
                                (String(offerUserId) === user?.user_id)) && (
                                    <div
                                        className={`alert alert-${statusMessage === 1 || String(offerUserId) === user?.user_id ? "success" : (purchaseForefitStatus || purchase_forefit_status) === 2 ? "skylight" : "danger"}`}
                                    >
                                        {`${statusMessage === 1 || String(offerUserId) === user?.user_id ? (purchaseForefitStatus || purchase_forefit_status === 1 || String(offerUserId) === user?.user_id ? t("Sold! Your highest bid won the property. Our representative will contact you to proceed.") : "You won the highest bid! 🥳") : (purchaseForefitStatus || purchase_forefit_status) === 2 ? t("Forfeit request placed successfully") : t("Auction is closed and the property is pending review.")}`}
                                    </div>
                                )}
                        </div>

                        <div className="col-lg-8">
                            <div className="product-details space">
                                <div className="tags-box">
                                    <div className="tags">
                                        <ul>
                                            {isSeller === 1 &&
                                                Number(property_for) === 2 && (
                                                    <li className="redclr">
                                                        {t("Live")}
                                                    </li>
                                                )}
                                            <li
                                                className={
                                                    propertyCurrentStatus?.className
                                                }
                                            >
                                                {t(
                                                    propertyCurrentStatus?.label
                                                ) || ""}
                                            </li>

                                            <li className="blueclr">
                                                {t(construction_status_name) ||
                                                    ""}
                                            </li>
                                            {tags.map((tag, index) => (
                                                <li
                                                    className="blueclr"
                                                    key={index}
                                                >
                                                    <img
                                                        src={`${process.env.REACT_APP_AZURE_BLOB_URL}${tag?.icon}`}
                                                        alt=""
                                                    />
                                                    {t(tag.label) || ""}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="tags-types">
                                        <ul>
                                            <li>
                                                <ShareButton
                                                    shareUrl={
                                                        window.location.href
                                                    }
                                                    title={t(property_name)}
                                                />
                                            </li>

                                            <li>
                                                <button
                                                    onClick={handleReaction}
                                                >
                                                    <img
                                                        src={`/img/${isLiked ? "heart-icon-r" : "heart-icon"}.svg`}
                                                        alt=""
                                                    />
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <h3>
                                    {lang === "en"
                                        ? property_name
                                        : property_name_ar || ""}
                                </h3>
                                <div className="location">
                                    <span className="map-icon">
                                        <img src="/img/map-icon.svg" alt="" />
                                    </span>
                                    {t(state)},{" "}
                                    {t(
                                        lang === "en" ? community : community_ar
                                    )}
                                    {is_map_view && (
                                        <button
                                            onClick={() => openGoogleMaps()}
                                            style={{ color: "#027BFF" }}
                                        >
                                            {t("Map View")}
                                        </button>
                                    )}
                                </div>

                                <div className="types">
                                    <ul>
                                        <li>
                                            <img
                                                src="/img/ruler-icon.svg"
                                                alt=""
                                            />{" "}
                                            {t("Square Feet", {
                                                squareFeet: square_footage || 0,
                                            })}
                                        </li>
                                        <li>
                                            <img
                                                src="/img/bed-icon.svg"
                                                alt=""
                                            />{" "}
                                            {beds === 0
                                                ? t("Studio")
                                                : t("Number Of Bedrooms", {
                                                    beds,
                                                })}
                                        </li>
                                        <li>
                                            <img
                                                src="/img/bath-icon.svg"
                                                alt=""
                                            />{" "}
                                            {t("Number Of Bathrooms", {
                                                baths,
                                            })}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="additional-details space">
                                <h6>{t("Additional Details")}</h6>

                                {/*Amenities*/}
                                <div className="heading-text">
                                    {t("Amenities")}
                                </div>
                                <ul className="amenities">
                                    {amenities?.length > 0 ? (
                                        amenities?.map((amenity, index) => (
                                            <li key={index}>
                                                {t(amenity?.feature_name)}
                                            </li>
                                        ))
                                    ) : (
                                        <li>{t("No Amenities")}</li>
                                    )}
                                </ul>
                                <div className="add-item">
                                    {
                                        projectData?.developer_name && <div className="block">
                                            <h6>
                                                <span>{t("Developer")}</span>
                                                {t(projectData?.developer_name) ||
                                                    ""}
                                            </h6>
                                        </div>
                                    }
                                    {(construction_status_name !== "Ready" && (project_name || project_name_ar)) ? (
                                        <div className="block">
                                            <h6>
                                                <span>
                                                    {t("Handover Date")}
                                                </span>
                                                {guessDateTime(
                                                    projectData?.completion_date,
                                                    "DD-MM-YYYY",
                                                    0,
                                                    lang
                                                )}
                                            </h6>
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                    <div className="block">
                                        <h6>
                                            <span>{t("Project")}</span>
                                            {t(
                                                lang === "en"
                                                    ? project_name
                                                    : project_name_ar || ""
                                            ) || t("Not Applicable")}
                                        </h6>
                                    </div>
                                    <div className="block">
                                        <h6>
                                            <span>{t("Added Date")}</span>
                                            {guessDateTime(
                                                added_on,
                                                "DD-MM-YYYY",
                                                0,
                                                lang
                                            )}
                                        </h6>
                                    </div>
                                    <div className="block">
                                        <h6>
                                            <span>{t("Auction ID")}</span>
                                            {t(
                                                property_auction_data?.[0]
                                                    ?.auction_unique_id
                                            )}
                                        </h6>
                                    </div>
                                    {floorPlan?.doc_file_name && (
                                        <div className="block">
                                            <h6>
                                                <span>{t("Floor Plan")}</span>
                                                <button
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#planModal"
                                                    onClick={() =>
                                                        setSelectedImage(
                                                            `${process.env.REACT_APP_AZURE_BLOB_URL}${floorPlan?.bucket_name}/${floorPlan?.doc_file_name}`
                                                        )
                                                    }
                                                    className="view"
                                                >
                                                    <img
                                                        src="/img/floor-icon.svg"
                                                        alt=""
                                                    />
                                                    {t("View Floor Plan")}
                                                </button>
                                            </h6>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="fee-details space">
                                <h6>{t("Fees & Charges")}</h6>
                                <ul>
                                    <li>
                                        <span>{t("Service Fee")}:</span>{" "}
                                        {t("Service Fee Percentage", {
                                            serviceFeePercentage:
                                                property_setting?.service_fee,
                                        })}
                                    </li>
                                    <li>
                                        <span>{t("Deposit")}:</span>
                                        {` ${t("Amount", {
                                            amount: formatNumber(
                                                deposit_amount,
                                                lang
                                            ),
                                        })} `}
                                        {t(
                                            "refundable if your bid is not successful"
                                        )}
                                    </li>
                                    <li>
                                        <span>{t("Auction Fee")}:</span>
                                        {` ${t("Amount", {
                                            amount: formatNumber(
                                                property_setting?.auction_fee,
                                                lang
                                            ),
                                        })} ${t("non-refundable")}`}
                                    </li>
                                </ul>
                            </div>

                            <div className="space">
                                <h6>{t("Description")}</h6>
                                <div
                                    dangerouslySetInnerHTML={sanitizedDescription()}
                                />
                            </div>

                            <div className="contact-seller-wrap space">
                                <h6>{t("Contact Seller")}</h6>
                                <div className="sellerBlock">
                                    <div className="profile">
                                        <div className="img">
                                            <img
                                                src="/img/profile.svg"
                                                alt=""
                                            />
                                        </div>
                                        <span>
                                            {`${t(listed_by?.first_name)} ${t(listed_by?.last_name !== "NA" ? listed_by?.last_name : "" || "")}`}
                                        </span>
                                    </div>
                                    <div className="contact">
                                        <Link
                                            to=""
                                            onClick={() =>
                                                (window.location.href = `tel:${listed_by?.phone_no || ""}`)
                                            }
                                        >
                                            <img src="/img/phone.svg" alt="" />
                                        </Link>
                                        <button
                                            onClick={() => handleSellerCotact()}
                                            disabled={
                                                Number(user?.user_id) ===
                                                    agent_id
                                                    ? true
                                                    : false
                                            }
                                        >
                                            <img
                                                src="/img/message.svg"
                                                alt=""
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {Number(city) === ABUDHABICITYID && (
                                <div className="analytics-wrap space">
                                    <h6>{t("Analytics Area")}</h6>
                                    <AreaComparision />
                                    <div className="priceanalytic mb10">
                                        <h3>{t("Sale trend")}</h3>
                                        <p>
                                            {t(
                                                "View the listing price trends of similar properties"
                                            )}
                                        </p>
                                        <SaleTrendChart />
                                    </div>

                                    <div className="priceanalytic">
                                        <h3>{t("Average Price")}</h3>
                                        <p>
                                            {t(
                                                "View the average price trends of similar properties"
                                            )}
                                        </p>
                                        <AveragePriceChart />
                                    </div>
                                </div>
                            )}

                            {propertyDetail?.project_id && (
                                <div className="project-details-wrap space">
                                    <h6>{t("Project Details")}</h6>
                                    <div className="project-image">
                                        <figure>
                                            <img
                                                className="slide-fixed"
                                                src="/img/trans-3x2.png"
                                                alt="Transparent"
                                            />
                                            <img
                                                className="slide-img"
                                                src={`${process.env.REACT_APP_AZURE_BLOB_URL}${projectData?.bucket_name || "developer_project_image"}/${projectData?.doc_file_name || "default_project.jpg"}`}
                                                alt="project-image"
                                            />
                                        </figure>
                                        <div className="project-banner-content">
                                            <div className="status">
                                                <a href="/link">
                                                    {t(
                                                        projectData?.project_status
                                                    )}
                                                </a>
                                            </div>
                                            <div className="living">
                                                <h4>
                                                    {t(
                                                        lang === "en"
                                                            ? projectData?.project_name
                                                            : projectData?.project_name_ar ||
                                                            ""
                                                    )}
                                                </h4>
                                                <div className="livingContent">
                                                    <div className="block">
                                                        {t("Starting price")}
                                                        <strong>
                                                            {t("Amount", {
                                                                amount: formatPrice(
                                                                    projectData?.starting_price,
                                                                    lang
                                                                ),
                                                            })}
                                                        </strong>
                                                    </div>
                                                    <div className="block">
                                                        {t("Property type")}
                                                        <strong>
                                                            {projectData?.property_types
                                                                ?.map((item) =>
                                                                    t(`${item}`)
                                                                )
                                                                .join(" | ")}
                                                        </strong>
                                                    </div>
                                                    <div className="block">
                                                        {t("No. of units")}
                                                        <strong>
                                                            {t(
                                                                projectData?.total_units
                                                            )}
                                                        </strong>
                                                    </div>
                                                </div>
                                                <div className="learnmore">
                                                    <Link
                                                        target="_blank"
                                                        to={`/project-detail/${createSlug(projectData?.id, projectData?.project_uri)}`}
                                                        className="btn btn-blank btn-sm"
                                                    >
                                                        {t("Learn More")}
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        {propertyDetail?.seller_status_id ===
                            SELLER_PROPERTY_STATUS["ON_AUCTION"] && (
                                <AuctionBidding />
                            )}
                        <SimilarProperties />
                    </div>
                    <FloorPlanModal image={selectedImage} />
                </div>
                <div className="modal fade" ref={modalRef} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h6 className="modal-title">
                                    {t("Remove from favourite?")}
                                </h6>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p className="mb0 sky-text">
                                    {t(
                                        "Are you sure about removing it from your favourite collections?"
                                    )}
                                </p>
                            </div>
                            <div className="d-flex">
                                <button
                                    className="btn btn-sky btn-md width50"
                                    onClick={handleModalCancel}
                                >
                                    {t("Cancel")}
                                </button>
                                <button
                                    className="btn btn-primary btn-md width50"
                                    onClick={handleModalConfirm}
                                >
                                    {t("Remove")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <ContactUsModal
                    title={"Anything on your mind? Just reach out!"}
                    content={
                        "our support team is available 9am - 6pm Sunday to Saturday."
                    }
                    handleModalCancel={() =>
                        dispatch(handleContactUsModal(false))
                    }
                    handleModalOpen={() => dispatch(handleContactUsModal(true))}
                />
                {retractBidModal && (
                    <RetractBidModal
                        show={() => dispatch(handleRetractBidModal(true))}
                        onClose={() => dispatch(handleRetractBidModal(false))}
                        isRetractBid={isRetracted}
                        setIsRetractBid={setIsRetracted}
                    />
                )}

                {showFailureModal && (
                    <PaymentFailureModal
                        show={showFailureModal}
                        onClose={() => setShowFailureModal(false)}
                        transactionId={reg_transaction_id}
                        failureMsg={payment_failed_message}
                        paymentErrorText={payment_error_text}
                    />
                )}
            </section>
        </React.Fragment>
    );
};

export default Details;
