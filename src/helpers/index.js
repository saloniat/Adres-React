import moment from "moment";

export const emailRegExp =
    // eslint-disable-next-line
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const onlyAlaphaRegExp = /^[a-zA-Z\s]+$/;
export const weakRegExp = /^(?=.*[0-9]).{6,}$/;
export const goodRegExp = /^(?=.*[a-z]).{6,}$/;
export const strongRegExp = /^(?=.*[!,%,&,@,#,$,^,*,?,_,~,<,>,]).{6,}$/;
export const onlyNumericRegExp = /^\d+$/;

export const signupFormFields = [
    {
        id: 1,
        option_type_display: "Input",
        step: 1,
        label: "Phone Number",
        labelClassname: "form-label",
        name: "phoneNo",
        classname: "form-control",
        placeholder: "Phone Number",
        type: "tel",
    },
    {
        id: 3,
        option_type_display: "OtpInput",
        step: 2,
        inputField: [
            { name: "otpDigit1" },
            { name: "otpDigit2" },
            { name: "otpDigit3" },
            { name: "otpDigit4" },
        ],
        classname: "form-control",
        type: "text",
    },
    {
        id: 4,
        option_type_display: "Input",
        step: 3,
        label: "Full Name",
        labelClassname: "form-label",
        name: "name",
        classname: "form-control",
        placeholder: "Enter your full name",
        type: "text",
        minLength: 5,
        maxLength: 30,
    },
    {
        id: 5,
        option_type_display: "Input",
        step: 3,
        label: "Email",
        labelClassname: "form-label",
        name: "email",
        classname: "form-control",
        placeholder: "Enter your email",
        type: "email",
    },
    {
        id: 6,
        option_type_display: "Input",
        step: 3,
        label: "Password",
        labelClassname: "form-label",
        name: "password",
        classname: "form-control",
        type: "password",
        minLength: 6,
        maxLength: 12,
    },
    {
        id: 7,
        option_type_display: "Input",
        step: 3,
        label: "Confirm Password",
        labelClassname: "form-label",
        name: "confirmPassword",
        classname: "form-control",
        type: "password",
    },
];

export const capitalize = (str) =>
    (str && String(str[0]).toUpperCase() + String(str).slice(1)) || "";

export const decodeJwtToken = (token) => {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
};

export const formatPrice = (amount, locale = "en", raw = false) => {
    if (!amount && amount !== 0) return amount;
    amount = Number(amount);

    const currencySymbol = locale === "ar" ? "د.إ" : "AED";

    const truncate = (val, decimals) => {
        const factor = 10 ** decimals;
        return Math.floor(val * factor) / factor;
    };

    const formatTruncated = (val) => {
        const truncated = truncate(val, 3);
        return truncated % 1 === 0
            ? truncated.toString()
            : truncated.toFixed(3).replace(/\.?0+$/, "");
    };

    if (raw) {
        return `${currencySymbol} ${formatTruncated(amount)}`;
    }

    if (amount >= 1e6) {
        return `${currencySymbol} ${formatTruncated(amount / 1e6)}M`;
    }

    if (amount >= 1e3) {
        return `${currencySymbol} ${formatTruncated(amount / 1e3)}K`;
    }

    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "AED",
        minimumFractionDigits: 0,
    }).format(amount);
};

export const formatNumber = (num, locale = "en") =>
    new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "AED",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(num);

export const documentType = 9;

export const createSlug = (projectId, projectName) => {
    const toSlug = (text) =>
        text
            ?.toLowerCase()
            ?.trim()
            ?.replace(/[^a-z0-9]+/g, "-")
            ?.replace(/^-+|-+$/g, "");

    const projectSlug = toSlug(projectName);
    return `${projectId}/${projectSlug}`;
};

export const generateUniqueFileName = (file) => {
    const timestamp = Date.now();
    const fileNameWithoutExtension =
        file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
    const fileExtension = file.name.split(".").pop();
    return `${timestamp}_${fileNameWithoutExtension}.${fileExtension}`;
};

export const formatEID = (value) => {
    const digits = value.replace(/\D/g, "");
    const formatted = digits
        .slice(0, 15)
        .replace(
            /^(\d{3})(\d{0,4})(\d{0,7})(\d{0,1})$/,
            (match, p1, p2, p3, p4) =>
                [p1, p2, p3, p4].filter(Boolean).join("-")
        );
    return formatted;
};

export const googleUserType = 2;

export const profileLinks = [
    { name: "Personal Information", url: "/profile-setting/info" },
    { name: "My Documents", url: "/profile-setting/doc" },
    { name: "Account Settings", url: "/profile-setting/account" },
    {
        name: "Dashboard",
        url: `${process.env.REACT_APP_ADMIN_URL}/admin/dashboard/`,
    },
    { name: "Logout", url: "" },
];
export const favouritesUrl = "/favourites";
export const watchlistUrl = "/my-watchlist";
export const notificationListUrl = "/notification-list";

export const profileTabs = [
    {
        name: "My Watchlist",
        url: "/my-watchlist",
        img: "/img/eye-icon.svg",
        alt: "Watchlist Icon",
    },
    {
        name: "Inbox",
        url: "/inbox",
        img: "/img/inbox-icon.svg",
        alt: "Inbox Icon",
    },
    // {
    //     name: "Wallet",
    //     url: "",
    //     img: "/img/wallet-icon.svg",
    //     alt: "Wallet Icon",
    // },
    {
        name: "Favourites",
        url: favouritesUrl,
        img: "/img/favourites-icon.svg",
        alt: "Favourites Icon",
    },
];

export const handleKeyDown = (event) => {
    const char = event.key;
    const allowedKeys = [
        "Tab",
        "Backspace",
        "ArrowLeft",
        "ArrowRight",
        "Delete",
    ];

    const isCtrlA = event.ctrlKey && char.toLowerCase() === "a";
    const isCtrlC = event.ctrlKey && char.toLowerCase() === "c";
    const isCtrlV = event.ctrlKey && char.toLowerCase() === "v";
    const isCtrlX = event.ctrlKey && char.toLowerCase() === "x";
    const isCtrlZ = event.ctrlKey && char.toLowerCase() === "z";

    const isNumber = onlyNumericRegExp.test(char);

    if (
        isCtrlA ||
        isCtrlC ||
        isCtrlV ||
        isCtrlX ||
        isCtrlZ ||
        allowedKeys.includes(char) ||
        isNumber
    ) {
        return;
    }

    event.preventDefault();
};

export const initializeIntlTelInput = async ({
    inputRef,
    countryCode,
    setState,
}) => {
    try {
        await loadDynamicAsset(
            "script",
            "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/intlTelInput-jquery.min.js",
            "intlTelInputScript"
        );
        await loadDynamicAsset(
            "stylesheet",
            "/css/intlTelInput.css",
            "intlTelInputStylesheet"
        );

        if (window.$ && inputRef.current) {
            // const countryData = window.intlTelInputGlobals.getCountryData();
            // const normalizedCode = countryCode;
            // const country = countryData.find(
            //     (data) => data.dialCode == normalizedCode
            // )?.iso2;
            const iti = window.$(inputRef.current).intlTelInput({
                onlyCountries: ["ae"],
                initialCountry: "ae",
                separateDialCode: true,
                utilsScript:
                    "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/utils.js",
            });

            const selectedCountryData = iti.intlTelInput(
                "getSelectedCountryData"
            );

            setState((prev) => ({
                ...prev,
                countryCode: selectedCountryData.dialCode,
            }));

            window.$(inputRef.current).on("countrychange", () => {
                inputRef.current.value = "";
                const updatedCountryData = iti.intlTelInput(
                    "getSelectedCountryData"
                );
                setState((prev) => ({
                    ...prev,
                    countryCode: updatedCountryData.dialCode,
                }));
            });
        }
    } catch (error) {
        console.error("Error initializing intl-tel-input:", error);
    }
};

const loadDynamicAsset = async (type, url, id) => {
    if (document.getElementById(id)) {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        let element;

        if (type === "script") {
            element = document.createElement("script");
            element.src = url;
            element.async = true;
        } else if (type === "stylesheet") {
            element = document.createElement("link");
            element.rel = "stylesheet";
            element.href = url;
        }

        element.id = id;

        element.onload = resolve;
        element.onerror = () => reject(new Error(`Failed to load ${url}`));

        if (type === "script") {
            document.body.appendChild(element);
        } else if (type === "stylesheet") {
            document.head.appendChild(element);
        }
    });
};

export const verificationFormFields = [
    {
        id: 2,
        option_type_display: "RadioButton",
        step: 2,
        heading: "Are you UAE Resident?",
        name: "uae_resident",
        radioBtnField: [
            {
                id: "yes",
                value: "yes",
                label: "Yes, I’m a UAE resident",
            },
            {
                id: "no",
                value: "no",
                label: "No, I’m not",
            },
        ],
        labelClassname: "css-labell",
        classname: "css-radio",
        type: "radio",
    },
    {
        id: 3,
        option_type_display: "UploadButton",
        step: 3,
        uploadBtn: [
            {
                heading: "Upload passport",
                name: "passport",
                label: "Upload Front",
            },
        ],
    },
    {
        id: 4,
        option_type_display: "UploadButtonEID",
        step: 3,
        uploadBtn: [
            {
                heading: "Upload Front of EID",
                name: "upload_Front_EID",
                label: "Upload Front",
            },
            {
                heading: "Upload Back of EID",
                name: "upload_Back_EID",
                label: "Upload Back",
            },
        ],
    },
];

export const generateAmounts = () => {
    const result = [];
    let current = 1000;
    while (current <= 5000) {
        result.push({ label: current, value: current });
        current += 1000;
    }
    current = 10000;
    while (current <= 50000) {
        result.push({ label: current, value: current });
        current += 5000;
    }
    return result;
};

export const languages = [
    {
        label: "English",
        value: "en",
    },
    {
        label: "Arabic",
        value: "ar",
    },
];
export const numericArray = Array.from({ length: 30 }, (_, index) => ({
    value: index + 1,
    label: index + 1,
}));

export const getTotalPages = (totalRecord, pageSize) => {
    return (
        Math.floor(totalRecord / pageSize) +
        (totalRecord % pageSize > 0 ? 1 : 0)
    );
};

export const maskName = (name, visibleChars = 4) => {
    if (!name) return "";
    return name.length > visibleChars
        ? name.slice(0, visibleChars) + "*".repeat(name.length - visibleChars)
        : name;
};

export const getPropertyStatus = (
    property_status,
    start_time,
    end_left,
    isReserveMet = false,
    isSeller = 0,
    isTilesPage = false
) => {
    if (property_status && Number(property_status) !== 1)
        return {
            label:
                isReserveMet || isSeller === 0
                    ? isTilesPage
                        ? "Closed"
                        : "Closed"
                    : null,
            className:
                isReserveMet || isSeller === 0
                    ? isTilesPage
                        ? "danger"
                        : "grayclr"
                    : "upcomingclr",
        };
    if (end_left < 0)
        return {
            label:
                isReserveMet || isSeller === 0
                    ? isTilesPage
                        ? "Closed"
                        : "Closed"
                    : null,
            className:
                isReserveMet || isSeller === 0
                    ? isTilesPage
                        ? "danger"
                        : "grayclr"
                    : "upcomingclr",
        }; // The proeprty has already ended
    if (start_time > 0)
        return {
            label: "Upcoming",
            className: isTilesPage ? "status" : "upcomingclr",
        }; // proeprty hasn't started yet
    if (end_left <= 172800 && end_left > 0)
        return {
            label: "Closing Soon",
            className: isTilesPage ? "danger" : "redclr",
        }; // Less than or equal to 2 hours left
    return { label: "Active", className: isTilesPage ? "status" : "active" }; // Otherwise, it's active
};

export const otpModalFields = [
    {
        id: 1,
        inputField: [
            { name: "otpDigit1" },
            { name: "otpDigit2" },
            { name: "otpDigit3" },
            { name: "otpDigit4" },
        ],
        classname: "form-control",
        type: "text",
    },
];

export function formatDurationByLocale(durationStr, locale = "en") {
    moment.locale(locale);

    // Parse the input string "3d 5h 49m"
    const matches = durationStr.match(
        /(?:(\d+)d)?\s*(?:(\d+)h)?\s*(?:(\d+)m)?/
    );
    if (!matches) return "";

    const days = parseInt(matches[1], 10) || 0;
    const hours = parseInt(matches[2], 10) || 0;
    const minutes = parseInt(matches[3], 10) || 0;

    // Map for English and Arabic labels
    const labels = {
        en: { d: "d", h: "h", m: "m" },
        ar: { d: "يوم", h: "ساعة", m: "دقيقة" },
        // ar: { d: "ي", h: "س", m: "د" }
    };

    const label = labels[locale] || labels["en"];

    // Build parts only if > 0
    const parts = [];
    if (days) parts.push(`${days} ${label.d}`);
    if (hours) parts.push(`${hours} ${label.h}`);
    if (minutes) parts.push(`${minutes} ${label.m}`);

    // Join with space
    return parts.join(" ");
}

// Handles digit conversion based on current language
export const toEasternArabicNumerals = (num, lang) => {
    if (lang !== "ar") return String(num); // Use Western digits for non-Arabic

    const easternDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return String(num).replace(/\d/g, (digit) => easternDigits[digit]);
};

export const removeDomain = (urlString) => {
    return urlString.replace(/^https?:\/\/[^\/]+/, "");
};

// export function addHtmlOnClickIfSellerHref(htmlString) {
//     return htmlString.replace(
//         /<a\s+([^>]*?href=["'][^"']*seller[^"']*["'])/gi,
//         '<a onclick="event.preventDefault()" $1'
//     );
// }

export function addHtmlOnClickToAllAnchors(htmlString) {
    return htmlString.replace(
        /<a\s+(?!.*onclick=["'])/gi,
        '<a onclick="event.preventDefault()" '
    );
}

export const validateFileSignature = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (!reader.result) return resolve(false);
            const arr = new Uint8Array(reader.result).subarray(0, 16);
            let header = "";
            for (let i = 0; i < arr.length; i++) {
                header += arr[i].toString(16).padStart(2, "0");
            }
            const imageSigs = ["ffd8ff", "89504e47", "47494638", "424d", "49492a00", "4d4d002a"];
            if (imageSigs.some(sig => header.startsWith(sig))) return resolve(true);

            if (header.startsWith("25504446")) return resolve(true);

            if (header.startsWith("d0cf11e0a1b11ae1")) return resolve(true);

            if (header.startsWith("504b0304")) return resolve(true);

            const text = new TextDecoder().decode(arr);
            if (text.includes("ftyp")) return resolve(true);

            if (header.startsWith("52494646")) return resolve(true);

            if (header.startsWith("1a45dfa3")) return resolve(true);

            return resolve(false);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file.slice(0, 16));
    });
};
