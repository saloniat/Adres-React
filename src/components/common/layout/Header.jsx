import React, { useMemo } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Button from "../Button";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { authAction, handleSignUpStep } from "../../../redux/action/authAction";
import { BUYER_NAV_ITEMS, isHomePagePath, SELLER_NAV_ITEMS } from "../../../utils/constants";
import useTranslationHook from "../../hooks/useTranslationHook";
import translationSlice from "../../../redux/slice/translationSlice";
import ReactSelect from "../ReactSelect";
import { languages } from "../../../helpers";
import { toast } from "react-toastify";
import { handleToggleModal } from "../../../redux/slice/modalSlice";
import Notification from "../../notifications/Notification";
import { ACCOUNT } from "../../../utils/constants";
import { configureMoment } from "../../../utils/moment/momentConfig";

const { handleLanguageSwitch } = translationSlice.actions;

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { t, changeLanguage } = useTranslationHook();
    const totalCount = useSelector(
        (state) => state.notification.totalCount,
        shallowEqual
    );
    const commonModal = useSelector(
        (state) => state.modal.commonModal,
        shallowEqual
    );
    const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
    const tokenLoading = useSelector((state) => state.auth.tokenLoading);
    const lang = useSelector((state) => state.translation.lang);
    const account = useSelector((state) => state.profile.account);
    const user = useSelector((state) => state.auth.user);
    const navItems = useMemo(() => {
        return isAuthenticated && account === ACCOUNT.Seller
            ? SELLER_NAV_ITEMS
            : BUYER_NAV_ITEMS;
    }, [account, isAuthenticated]);
    const isHomePagePath = location.pathname === "/";
    return (
        <header className={`header ${(!isHomePagePath || isAuthenticated) ? 'position-relative' : 'home-header'} p-0`}>
            <nav className="navbar navbar-expand-lg navbar-light">
                <div className="container">
                    <Link to="/" className="navbar-brand p-0">
                        <img
                            src={`/img/${(!isHomePagePath || isAuthenticated) ? 'logo' : 'logo-f'}.svg`}
                            className="logo"
                            alt="Auction Logo"
                        />
                        <img
                            src="/img/favicon.svg"
                            className="logoicon"
                            alt="Auction Logo"
                        />
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarCollapse"
                    >
                        <span className="fa fa-bars"></span>
                    </button>
                    <div
                        className="collapse navbar-collapse ms-4"
                        id="navbarCollapse"
                    >
                        <div className="navbar-nav py-0">
                            {Object.entries(navItems)
                                .filter(
                                    ([key]) =>
                                        !(
                                            key === "MY_BIDS" &&
                                            (location.pathname.includes(
                                                "privacy-policy"
                                            ) ||
                                                location.pathname.includes(
                                                    "terms-and-condition"
                                                ))
                                        )
                                )
                                .map(
                                    (
                                        [key, { label, url, detailPageUrl }],
                                        ind
                                    ) => (
                                        <Link
                                            key={key}
                                            to={
                                                ind === 1
                                                    ? isAuthenticated
                                                        ? account ===
                                                            ACCOUNT.Buyer
                                                            ? "/bids"
                                                            : "/my-auctions"
                                                        : `/sign-in?redirect=/bids`
                                                    : ind === 2
                                                        ? isAuthenticated
                                                            ? "/events"
                                                            : `/sign-in?redirect=/events`
                                                        : url
                                            }
                                            className={`nav-item nav-link ${(location.pathname.includes(
                                                url
                                            ) ||
                                                location.pathname.includes(
                                                    detailPageUrl
                                                )) &&
                                                url.trim() !== "/"
                                                ? "active"
                                                : ""
                                                }`}
                                            onClick={() => {
                                                if (
                                                    ind === 1 &&
                                                    !isAuthenticated
                                                ) {
                                                    toast.info(
                                                        t(
                                                            "You need to log in to access 'My Bids'. Please sign in to continue.",
                                                            {
                                                                toastId:
                                                                    "Bid_sign_toast",
                                                            }
                                                        )
                                                    );
                                                } else if (
                                                    ind === 2 &&
                                                    !isAuthenticated
                                                ) {
                                                    toast.info(
                                                        t(
                                                            "You need to log in to access 'Events'. Please sign in to continue.",
                                                            {
                                                                toastId:
                                                                    "Event_sign_toast",
                                                            }
                                                        )
                                                    );
                                                }
                                            }}
                                        >
                                            {t(`${label}`)}
                                        </Link>
                                    )
                                )}
                        </div>
                    </div>
                    {isAuthenticated && !tokenLoading ? (
                        <>
                            <ul className="after-login">
                                <li>
                                    <button
                                        onClick={() =>
                                            dispatch(
                                                handleToggleModal({
                                                    commonModal: true,
                                                })
                                            )
                                        }
                                    >
                                        <span className="notification-icon">
                                            <img
                                                src="/img/notification-icon.svg"
                                                alt="notification icon"
                                            />
                                            {Number(totalCount) > 0 && (
                                                <span className="notification-alert"></span>
                                            )}
                                        </span>
                                    </button>
                                    {commonModal && <Notification />}
                                </li>
                                <li>
                                    <Link
                                        to="/profile-setting"
                                        onClick={() => {
                                            dispatch(
                                                authAction.handleUserLoading(
                                                    true
                                                )
                                            );
                                        }}
                                    >
                                        <span className="usr-icon">
                                            <img
                                                src={
                                                    user?.profile_image
                                                        ?.bucket_name
                                                        ? `${process.env.REACT_APP_AZURE_BLOB_URL}${user?.profile_image?.bucket_name}/${user?.profile_image?.doc_file_name}`
                                                        : "/img/default.jpg"
                                                }
                                                alt=""
                                            />
                                        </span>
                                    </Link>
                                    <span className="circle online"></span>
                                </li>
                            </ul>
                        </>
                    ) : (
                        <Button
                            label={
                                location.pathname.includes("sign-in")
                                    ? t("Sign up")
                                    : t("Login")
                            }
                            type="submit"
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                                if (location.pathname.includes("sign-in")) {
                                    dispatch(handleSignUpStep(1));
                                    dispatch(authAction.loadUser(null));
                                    navigate("/sign-up");
                                } else {
                                    navigate("/sign-in");
                                }
                            }}
                        />
                    )}

                    <div className="lan">
                        <ReactSelect
                            name="langTranslation"
                            options={languages}
                            value={languages.find(
                                ({ value }) => value === lang
                            )}
                            onChange={({ value }) => {
                                changeLanguage(value);
                                configureMoment(value);
                                dispatch(handleLanguageSwitch(value));
                            }}
                            className="select"
                        />
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
