import * as Yup from "yup";
import { emailRegExp } from "../../helpers";
import moment from "moment";
export const StepOneFormValidationSchema = (account_verification_type) =>
    Yup.object({
        owners: Yup.array()
            .of(
                Yup.object({
                    ownerName: Yup.string()
                        .required("Owner name is required")
                        .min(
                            3,
                            "Owner name must be at least 3 characters long"
                        )
                        .matches(
                            /^(?:[^a-zA-Z]*[a-zA-Z]){3,}.*$/, "Name must contain at least 3 letters"
                        ),
                    nationality: Yup.string().required(
                        "Nationality is required"
                    ),
                    eid: Yup.string()
                        .nullable()
                        .when("useEID", {
                            // is: () => account_verification_type === 1,
                            is: (useEID) => useEID === "true",
                            then: (schema) =>
                                schema
                                    .required("EID is required")
                                    .test(
                                        "starts-with-784",
                                        "EID must start with 784",
                                        value => !value || value.startsWith("784")
                                    )
                                    .transform((value) => value.replace(/\D/g, "")) // normalize
                                    .matches(/^\d{15}$/, "EID must be in the format 784-XXXX-XXXXXXX-X")
                            // .matches(
                            //     /^784-\d{4}-\d{7}-\d{1}$/,
                            //     "EID must be in the format 784-XXXX-XXXXXXX-X"
                            // )
                            ,
                            otherwise: (schema) =>
                                schema.notRequired().nullable(),
                        })
                    ,
                    passport: Yup.string()
                        .nullable()
                        .when("useEID", {
                            is: (useEID) => useEID === "false",
                            then: (schema) =>
                                schema
                                    .required("Passport is required")
                                    .matches(
                                        /^[a-zA-Z0-9]+$/,
                                        "Passport must be alphanumeric"
                                    ),
                        }),
                    dob: Yup.date().required("Date of birth is required"),
                    phone: Yup.string()
                        .required("Phone number is required")
                        .matches(
                            /^(?:\+?971)?5\d{8}$/,
                            "Phone number must be in the format +971 5XX XXX XXX"
                        )
                        .required("Phone number is required"),
                    email: Yup.string()
                        .required("Email address is required")
                        .matches(emailRegExp, "Invalid email format"),
                    sharePercentage: Yup.number()
                        .typeError("Share percentage is required")
                        .required("Share percentage is required")
                        .min(0, "Value must be at least 0%")
                        .max(100, "Value cannot exceed 100%")
                        .test(
                            "decimal-places",
                            "Share percentage must have at most 2 decimal places",
                            (value) =>
                                value === undefined ||
                                /^\d+(\.\d{1,2})?$/.test(value.toString())
                        ),
                })
            )
            .min(1, "Atleast one owner is required"),
    })
        .test("unique-eid", null, function ({ owners = [] }) {
            const seen = new Map();
            const errors = [];
            owners.forEach((emp, index) => {
                const eid = emp.eid?.trim();
                if (!eid) return;
                if (seen.has(eid)) {
                    errors.push(
                        this.createError({
                            path: `owners[${index}].eid`,
                            message: "EID must be unique",
                        })
                    );
                } else {
                    seen.set(eid, index);
                }
            });
            return errors.length > 0 ? new Yup.ValidationError(errors) : true;
        })

export const StepTwoFormValidationSchema = Yup.object({
    country: Yup.string().required("Country is required"),
    city: Yup.string().required("City is required"),
    municipality: Yup.string().required("Municipality is required"),
    district: Yup.string().required("District is required"),
    // project: Yup.string().required("Project name is required"),
    property_name: Yup.string().trim().required("Property name is required").matches(
        /^(?:[^a-zA-Z]*[a-zA-Z]){3,}.*$/, "Property name must contain at least 3 letters"
    ),
    property_name_ar: Yup.string().trim()
        .required("Property name in Arabic is required")
        .test('is-arabic', 'Please enter Arabic characters only', value =>
            /^[\u0600-\u06FF\s]+$/.test(value || '')
        ),
    community: Yup.string().trim().required("Community name is required"),
    propertyType: Yup.string().required("Property type is required"),
    building: Yup.string().required("Building name or number is required"),
    map_url: Yup.string().required("Map url is required"),
    map_url: Yup.string()
        .required("Map url is required")
        .matches(
            /^(https?:\/\/)?(www\.)?(google\.com\/maps|goo\.gl\/maps|maps\.app\.goo\.gl|2gis\.ae|2gis\.com|bing\.com\/maps|here\.com\/maps|openstreetmap\.org)(\/|\?).+$/i,
            "Enter a valid map URL"
        ),
});

export const StepThreeFormValidationSchema = Yup.object({
    areaSize: Yup.string().required("Area size is required"),
    numOfBedrooms: Yup.string().required("Number of bedrooms is required"),
    numOfBathrooms: Yup.string().required("Number of bathrooms is required"),
    numOfParkings: Yup.string().required("Number of parkings is required"),
    vacancy: Yup.string().required("Please select vacancy status"),
    rentalTill: Yup.date()
        .nullable()
        .when("vacancy", (vacancy, schema) => {
            return vacancy == "1"
                ? schema.required("Rental till date is required")
                : schema;
        }),
    constructionStatus: Yup.string().required(
        "Construction status is required"
    ),
    amenities: Yup.array()
        .of(
            Yup.object().shape({
                value: Yup.string().required("Value is required"),
                label: Yup.string().required("Label is required"),
            })
        )
        .min(1, "Atleast one amenity must be selected")
        .required("Please select amenities"),
    // tags: Yup.array()
    //     .of(
    //         Yup.object().shape({
    //             value: Yup.string().required("Value is required"),
    //             label: Yup.string().required("Label is required"),
    //         })
    //     )
    //     .min(1, "Atleast one tag must be selected")
    //     .required("Please select tags"),
    description: Yup.string().test(
        "is-not-empty",
        "Description is required",
        (value) => {
            const plain = value?.replace(/<[^>]+>/g, "").trim();
            return !!plain;
        }
    ),
    description_ar: Yup.string().test(
        "is-not-empty",
        "Description in Arabic is required",
        (value) => {
            const plain = value?.replace(/<[^>]+>/g, "").trim();
            return !!plain;
        }
    )
        .test('is-arabic', 'Please enter Arabic characters only', value => {
            const plain = value?.replace(/<[^>]+>/g, "").trim();
            if (!plain) return true;
            return /^[\u0600-\u06FF0-9@#%!&.,?;:()\[\]{}\- ]+$/.test(plain)
        })
    ,
});

export const StepOneAuctionFormValidationSchema = Yup.object({
    start_price: Yup.string().required("Minimum starting Price is required"),
    deposit_amount: Yup.string().required("Deposit price is required"),
    reserve_amount: Yup.string().required("Reserved price is required"),
    buyer_preference: Yup.string().required("Buyer Preference is required"),

    // bid_increment_status: Yup.boolean()
    //     .oneOf([true], "Bid increment status must be true")
    //     .required("Bid increment status is required"),

    sell_at_full_amount_status: Yup.boolean(),

    bid_increments: Yup.string().required("Bid amount is required"),

    full_amount: Yup.string().when("sell_at_full_amount_status", {
        is: true,
        then: () => Yup.string().required("Full amount is required"),
        otherwise: () => Yup.string().notRequired(),
    }),

    start_date: Yup.string().required("Starting date is required"),
    start_time: Yup.string().required("Starting time is required"),
    end_date: Yup.string().required("Ending date is required"),

    end_time: Yup.string()
        .required("Ending time is required")
        .test(
            "is-after-start-time",
            "End time must be after start time when start and end dates are the same",
            function (value) {
                const { start_date, end_date, start_time } = this.parent;

                if (!start_date || !end_date || !start_time || !value)
                    return true;

                const isSameDay =
                    moment(start_date).format("YYYY-MM-DD") ===
                    moment(end_date).format("YYYY-MM-DD");

                const start = moment(start_time, "HH:mm");
                const end = moment(value, "HH:mm");

                if (isSameDay && end.isSameOrBefore(start)) {
                    return false;
                }

                return true;
            }
        ),
});
