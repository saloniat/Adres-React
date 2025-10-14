import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import Layout from "../components/common/layout/Index";
import Setting from "../components/profileSetting/Setting";
import { useLocation, useParams } from "react-router-dom";
import PersonalInfo from "../components/profileSetting/PersonalInfo";
import { PROFILE_SETTING_SLUG } from "../utils/constants";
import Documents from "../components/profileSetting/Documents";
import Account from "../components/profileSetting/Account";
import { favouritesUrl, watchlistUrl } from "../helpers";
import Breadcrumb from "../components/common/Breadcrumb";
import DiscoverAuction from "../components/home/section/DiscoverAuction";
import Header from "../components/common/layout/Header";
import useTranslationHook from "../components/hooks/useTranslationHook";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../redux/action/authAction";

function CommonLayout({ children, showHeader = false }) {
    const { t } = useTranslationHook();
    const location = useLocation();

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
                <title>
                    {location.pathname === favouritesUrl
                        ? t("Favourites Properties")
                        : location.pathname === watchlistUrl
                          ? t("My Watchlist")
                          : t("Profile")}
                </title>
            </Helmet>
            {showHeader ? (
                <>
                    <Header /> {children}
                </>
            ) : (
                <Layout>{children}</Layout>
            )}
        </>
    );
}

const ProfileSetting = () => {
    const { slug } = useParams();
    const { pathname } = useLocation();
    const { t } = useTranslationHook();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const userLoading = useSelector((state) => state.auth.userLoading);

    const settingsMapping = {
        [PROFILE_SETTING_SLUG.info]: <PersonalInfo />,
        [PROFILE_SETTING_SLUG.doc]: <Documents />,
        [PROFILE_SETTING_SLUG.account]: <Account />,
    };

    useEffect(() => {
        userLoading &&
            dispatch(
                loadUser({
                    site_id: user?.site_id,
                    user_id: user?.user_id,
                })
            );
    }, [userLoading]);

    return (
        <CommonLayout showHeader={!!slug}>
            {settingsMapping[slug] ? (
                settingsMapping[slug]
            ) : (
                <>
                    {pathname === favouritesUrl && (
                        <Breadcrumb
                            links={[
                                { url: "/", name: t("Home") },
                                { url: "/profile-setting", name: t("Profile") },
                                { url: "", name: t("Favourites Properties") },
                            ]}
                        />
                    )}
                    {pathname === watchlistUrl && (
                        <Breadcrumb
                            links={[
                                { url: "/", name: t("Home") },
                                { url: "/profile-setting", name: t("Profile") },
                                { url: "", name: t("My Watchlist") },
                            ]}
                        />
                    )}
                    {pathname === favouritesUrl || pathname === watchlistUrl ? (
                        <DiscoverAuction />
                    ) : (
                        <Setting />
                    )}
                </>
            )}
        </CommonLayout>
    );
};

export default ProfileSetting;
