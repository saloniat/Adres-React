import { numericArray } from "../helpers";

//  api success messages
export const API_RESPONSE_MESSAGES = {
    OtpSent: "OTP Sent Successfully",
};

//signup form
export const SignUpStep = {
    step_1: 1,
    step_2: 2,
    step_3: 3,
    step_4: 4,
};
export const PasswordStrength = {
    Weak: "Weak",
    Good: "Good",
    Strong: "Strong",
};

export const BUYER_NAV_ITEMS = {
    DISCOVER: { label: "Discover", url: "/discover" },
    MY_BIDS: { label: "My Bids", url: "/bids" },
    EVENTS: { label: "Auction Calendar", url: "/events" },
    PROJECTS: {
        label: "Projects",
        url: "/projects",
        detailPageUrl: "/project-detail",
    },
};

export const SELLER_NAV_ITEMS = {
    PROPERTIES: { label: "My Properties", url: "/my-properties" },
    MY_AUCTIONS: { label: "My Auctions", url: "/my-auctions" },
    EVENTS: { label: "Auction Calendar", url: "/events" },
};

export const FAVOURITE_WISHLIST_TABS = [
    { label: "Active", key: "active" },
    { label: "Upcoming", key: "upcoming_listing" },
    { label: "Closing Soon", key: "closing_soon_listing" },
    { label: "Recently Closed", key: "recently_closed_listing" },
];
export const DISCOVER_TABS = [
    { label: "Active", key: "active_listing" },
    { label: "Upcoming", key: "upcoming_listing" },
    { label: "Closing Soon", key: "closing_soon_listing" },
    { label: "Recently Closed", key: "recently_closed_listing" },
];

export const PROJECT_PROPERTY_TABS = [
    { key: "all", label: "All" },
    { key: "active_listing", label: "Active" },
    { key: "closing_soon_listing", label: "Closing Soon" },
    { key: "upcoming_listing", label: "Upcoming" },
];

export const BID_TABS = [
    { key: "active", label: "Active" },
    { key: "live", label: "Live" },
    { key: "closed", label: "Closed" },
    { key: "won", label: "Won" },
];

export const MY_PROPERTIES_TABS = [
    { key: "All", label: "All" },
    { key: "UNDER_REVIEW", label: "Under Review" },
    { key: "READY_FOR_PUBLISH", label: "Ready for Publish" },
    { key: "ON_AUCTION", label: "On Auction" },
    { key: "CLOSED", label: "Closed" },
];

export const SELLER_MY_AUCTION_TABS = [
    { key: "1", label: "Active" },
    { key: "coming_soon", label: "Upcoming" },
    // { key: "Live", label: "Ready for Publish" },
    { key: "closed_listing", label: "Closed" },
];

export const MY_AUCTION_TABS = [
    { key: "Regular", label: "Regular" },
    { key: "Live", label: "Live" },
];

export const MY_PRO_STATUS_CLASS = {
    READY: "Ready for Publish",
    UNDER_REVIEW: "Under Review",
    ON_AUCTION: "On Auction",
    RETURNED_FOR_UPDATE: "Returned for Update",
};

export const PROFILE_IMG = {
    AllowTypes: ["jpeg", "png", "jpg", "jfif"],
};

export const ACCOUNT = {
    Buyer: 0,
    Seller: 1,
};

export const PROFILE_SETTING_SLUG = {
    info: "info",
    doc: "doc",
    account: "account",
};

export const VERIFICATION_STEP = {
    step_1: 1,
    step_2: 2,
    step_3: 3,
    step_4: 4,
    step_5: 5,
};
export const accountStatus = {
    under_review: 24,
    success: 25,
    unsuccess: 26,
    not_verify: 31,
};

export const SELLER_PROPERTY_STATUS = {
    UNDER_REVIEW: 24,
    ON_AUCTION: 27,
    READY_TO_PUBLISH: 28,
    READY_FOR_PUBLISH: 28,
    RETURNED_FOR_UPDATE: 29,
    CLOSED: 9,
    All: -1 // Exceptional Case
};

export const supportedLngs = ["ar", "en"];

export const STATUS_OPTIONS = [
    {
        value: 1,
        label: "Active",
    },
    {
        value: 2,
        label: "Inactive",
    },
];

export const discoverTabs = [
    { key: "regular", label: "Regular", propertyFor: 1 },
    { key: "live", label: "Live", propertyFor: 2 },
    {
        key: "recently_closed_listing",
        label: "Recently Closed",
        propertyFor: "",
    },
];

export const discoverFilters = [
    {
        name: "city",
        options: [],
        placeholder: "City",
        isMulti: false,
    },
    {
        name: "municipality",
        options: [],
        placeholder: "Municipality",
        isMulti: false,
    },
    {
        name: "district",
        options: [],
        placeholder: "District",
        isMulti: false,
    },
    {
        name: "filter_beds",
        options: [
            {
                value: "0",
                label: "Studio",
            },
            ...numericArray,
        ],
        placeholder: "Bedrooms",
        isMulti: true,
    },
    {
        name: "filter_baths",
        options: numericArray,
        placeholder: "Bathrooms",
        isMulti: true,
    },
    {
        name: "property_type",
        options: [],
        placeholder: "Property Type",
        isMulti: false,
    },
    {
        name: "construction_status",
        options: [],
        placeholder: "Construction Status",
        isMulti: false,
    },
];

export const projectFilters = [
    {
        name: "city",
        options: [],
        placeholder: "City",
    },
    {
        name: "municipality",
        options: [],
        placeholder: "Municipality",
    },
    {
        name: "district",
        options: [],
        placeholder: "District",
    },
    {
        name: "status",
        options: [],
        placeholder: "Status",
    },
];

export const VACANCY_OPTIONS = {
    1: "Rented",
    2: "Vacant",
};

export const ALLOWED_IMAGE_TYPES = [
    "image/jpeg", // .jpeg, .jpg
    "image/png", // .png
    "image/gif", // .gif
    "image/webp", // .webp
    "image/bmp", // .bmp
    // "image/tiff", // .tiff, .tif
    // "image/x-icon", // .ico
    // "image/svg+xml", // .svg
    // "image/heif", // .heif
    // "image/heic", // .heic
];

export const ALLOWED_VIDEO_TYPES = [
    "video/mp4", // .mp4
    "video/webm", // .webm
    "video/ogg", // .ogv
    "video/avi", // .avi
    "video/mpeg", // .mpeg, .mpg
    "video/quicktime", // .mov
];

export const ALLOWED_DOCUMENT_TYPES = [
    "application/pdf", // .pdf
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/vnd.oasis.opendocument.text", // .odt (OpenDocument)
    "application/rtf", // .rtf
    "text/plain", // .txt
];

export const checkAuctionStatus = (statusId) =>
    [
        SELLER_PROPERTY_STATUS.ON_AUCTION,
        SELLER_PROPERTY_STATUS.READY_TO_PUBLISH,
    ].includes(statusId);

export const AUCTION_STATUS = {
    not_started: { label: "Starts In", value: 1 },
    coming_soon: { label: "Starts In", value: 1 },
    running: { label: "Ends In", value: 2 },
    nearby_to_close: { label: "Ends In", value: 2 },
    expired: { label: "Auction Ended", value: 3 },
    recently_closed: { label: "Auction Ended", value: 3 },
};

export const DOMAIN = 3;
export const accountVerificationMessage = {
    24: "Your account is under review",
    25: "Your account is verified",
    26: "We couldn’t verify your account. Please try again.",
    31: "Your account is not verified",
};

export const ABUDHABICITYID = 83;

export const RECENTLY_CLOSED_LISTING = "recently_closed_listing";
export const REGULAR = "regular";
export const PUT_IT_ON_AUCTION = "Put it on Auction";
