import Home from "../pages/Home";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import ForgotPswd from "../pages/ForgotPswd";
import ResetPswd from "../pages/ResetPswd";
import ProfileSetting from "../pages/ProfileSetting";
import DeveloperProject from "../pages/DeveloperProject";
import ProjectDetail from "../pages/ProjectDetail";
import EventsPage from "../pages/EventsPage";
import MyProperties from "../pages/MyProperties";
import AccountVerify from "../pages/AccountVerify";
import AddPropertyDetail from "../pages/seller/AddPropertyDetail";
import PropertySuccess from "../components/seller/property/PropertySuccess";
import EmailVerification from "../components/profileSetting/EmailVerification";
import NotificationDetail from "../pages/NotificationDetail";
import AddAuctionDetail from "../pages/seller/AddAuctionDetail";
import PropertyDetail from "../pages/PropertyDetail";
import PropertiesUnderProject from "../pages/PropertiesUnderProject";
import DiscoverProperties from "../pages/DiscoverProperties";
import PropertiesOnBid from "../pages/PropertiesOnBid";
import { favouritesUrl, notificationListUrl } from "../helpers";
import NotificationPage from "../pages/NotificationPage";
import Inbox from "../pages/Inbox";
import Logout from "../pages/Logout";
import LiveFeed from "../pages/LiveFeed";
import TermsAndCondition from "../pages/TermsAndCondition";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import LiveAuctionWon from "../pages/LiveAuctionWon";
import MyAuctions from "../pages/MyAuctions";
import AboutUs from "../pages/AboutUs";
import Faq from "../pages/Faq";
import Clients from "../pages/Clients";
import Blog from "../pages/Blog";
import WonAuction from "../pages/WonAuction";
import CloseLiveOutbid from "../pages/CloseLiveOutbid";

const routes = {
    publicRoutes: [
        {
            path: "/sign-in",
            element: <SignIn />,
        },
        {
            path: "/sign-up",
            element: <SignUp />,
        },
        {
            path: "/forgot-password",
            element: <ForgotPswd />,
        },
        {
            path: "/reset-password",
            element: <ResetPswd />,
        },
    ],
    privateRoutes: [
        {
            path: "/my-properties",
            element: <MyProperties />,
            account: [1],
        },
        {
            path: "/my-auctions",
            element: <MyAuctions />,
            account: [0, 1],
        },
        {
            path: "/profile-setting/:slug?",
            element: <ProfileSetting />,
            account: [0, 1],
        },
        {
            path: "/seller/property/detail/:id/:slug?/",
            element: <PropertyDetail />,
            account: [0, 1],
        },
        {
            path: "/seller/property/:id?/:slug?/",
            element: <AddPropertyDetail />,
            account: [1, 0],
        },
        {
            path: "/seller/auction/detail/:id/:slug?/",
            element: <AddAuctionDetail />,
            account: [0, 1],
        },
        {
            path: "/seller/property/success/",
            element: <PropertySuccess />,
            account: [1],
        },
        {
            path: "/logout",
            element: <Logout />,
            role: [2, 4, 5],
            account: [0, 1],
        },
        {
            path: "/verify",
            element: <AccountVerify />,
            account: [0, 1],
        },
        {
            path: "/email-verifications/",
            element: <EmailVerification />,
            account: [0, 1],
        },
        {
            path: notificationListUrl,
            element: <NotificationPage />,
            account: [0, 1],
        },
        {
            path: "/bids",
            element: <PropertiesOnBid />,
            account: [0],
        },
        {
            path: "/my-watchlist",
            element: <ProfileSetting />,
            account: [0],
        },
        {
            path: "/inbox",
            element: <Inbox />,
            account: [0, 1],
        },
        {
            path: "/events",
            element: <EventsPage />,
            account: [0, 1],
        },
        {
            path: "/notification/:id",
            element: <NotificationDetail />,
            account: [0, 1],
        },
        {
            path: "/won-auction/",
            element: <WonAuction />,
            account: [0],
        },
        {
            path: "/auction-winner/:id/:slug?/",
            element: <LiveAuctionWon />,
            account: [0],
        },
        {
            path: favouritesUrl,
            element: <ProfileSetting />,
            account: [0],
        },
    ],
    commonRoutes: [
        {
            path: "/",
            element: <Home />,
            account: [0, 1],
        },
        {
            path: "/projects",
            element: <DeveloperProject />,
            account: [0],
        },
        {
            path: "/project-detail/:id/:slug/",
            element: <ProjectDetail />,
            account: [0],
        },

        {
            path: "/property/detail/:id/:slug?/",
            element: <PropertyDetail />,
            account: [0, 1],
        },
        {
            path: "/project-properties/:id",
            element: <PropertiesUnderProject />,
            account: [0],
        },
        {
            path: "/discover",
            element: <DiscoverProperties />,
            account: [0],
        },
        {
            path: "/email-verifications/",
            element: <EmailVerification />,
            account: [0, 1],
        },
        {
            path: "/live-feed/:id/:slug?/",
            element: <LiveFeed />,
            account: [0],
        },
        {
            path: "/close-live-outbid",
            element: <CloseLiveOutbid />,
            account: [0],
        },
        {
            path: "/terms-and-condition",
            element: <TermsAndCondition />,
            account: [0, 1],
        },
        {
            path: "/privacy-policy",
            element: <PrivacyPolicy />,
            account: [0, 1],
        },
        {
            path: "/about-us",
            element: <AboutUs />,
            account: [0, 1],
        },
        {
            path: "/clients",
            element: <Clients />,
            account: [0, 1],
        },
        {
            path: "/blog",
            element: <Blog />,
            account: [0, 1],
        },
        {
            path: "/faq",
            element: <Faq />,
            account: [0, 1],
        },
    ],
};

export default routes;
