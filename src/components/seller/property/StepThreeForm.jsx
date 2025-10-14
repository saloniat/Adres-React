import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { StepThreeFormValidationSchema } from "../../../utils/validations/sellerValidation";
import DateSelector from "../../home/common/DateSelector";
import ReactSelect from "../../common/ReactSelect";
import ReactMultiSelectCheckbox from "../../common/ReactMultiSelectCheckbox";
import NumericInput from "../../common/form/NumericInput";
import {
    setFormStep,
    setConstructionStatus,
    setAmenities,
    setTags,
    saveStepThreeData,
} from "../../../redux/action/sellerAction";
import { guessDateTime } from "../../../utils/dateUtils";
import useTranslationHook from "../../hooks/useTranslationHook";
import TextEditor from "../../common/TextEditor";
import { toEasternArabicNumerals } from "../../../helpers";
const StepThreeForm = () => {
    const dispatch = useDispatch();
    const { t } = useTranslationHook();
    const lang = useSelector((state) => state.translation.lang);
    const stepThreeData = useSelector(
        (state) => state.seller.property.stepThreeData
    );
    const { amenities, tags, constructionStatus } = useSelector(
        (state) => state.seller
    );
    useEffect(() => {
        if (!amenities || amenities?.length === 0) {
            dispatch(setAmenities());
        }
        if (!tags || tags?.length === 0) {
            dispatch(setTags());
        }
        if (!constructionStatus || constructionStatus.length === 0) {
            dispatch(setConstructionStatus());
        }
    }, []);

    const handleFormStep = (step) => {
        dispatch(setFormStep(step));
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleBack = (step) => {
        dispatch(saveStepThreeData(getValues()));
        handleFormStep(step);
    };
    const onSubmit = (data) => {
        const rentalTill = data?.rentalTill;
        if (rentalTill) {
            data.rentalTill = guessDateTime(new Date(rentalTill), "YYYY-MM-DD");
        }
        dispatch(saveStepThreeData(data));
        handleFormStep(4);
    };
    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        watch,
        setValue,
    } = useForm({
        resolver: yupResolver(StepThreeFormValidationSchema),
        defaultValues: stepThreeData,
    });
    const numericArray = Array.from({ length: 30 }, (_, index) => ({
        value: index + 1,
        label: index + 1,
    }));
    const selectedAmenities = watch("amenities") || [];
    const selectedTags = watch("tags") || [];
    const handleRemoveAmenity = (value) => {
        const updatedAmenities = selectedAmenities.filter(
            (amenity) => amenity.value !== value
        );
        setValue("amenities", updatedAmenities);
    };

    const handleRemoveTag = (value) => {
        const updatedTags = selectedTags.filter((tag) => tag.value !== value);
        setValue("tags", updatedTags);
    };
    return (
        <section className="property-wrap">
            <div className="container py-5">
                <div className="row justify-content-md-center">
                    <div className="col-lg-8">
                        <div className="counter">{t("3/4")}</div>
                        <h5 className="display-5 mb-3">
                            {t("Property Features")}
                        </h5>
                        <ul className="property-progress">
                            {[...Array(2)].map((_, i) => (
                                <li key={i} className="full"></li>
                            ))}
                            <li className="active"></li>
                            <li></li>
                        </ul>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            autoComplete="off"
                            autoCapitalize="off"
                        >
                            <div className="prop-bdr">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <label
                                                htmlFor="areasize"
                                                className="form-label"
                                            >
                                                {t("Area Size (sq ft)")}
                                            </label>
                                            <NumericInput
                                                register={register}
                                                placeholder={t(
                                                    "Enter area size (sq ft)"
                                                )}
                                                name="areaSize"
                                                allowDecimal={true}
                                            />
                                            {errors.areaSize && (
                                                <p className="text-danger">
                                                    {t(errors.areaSize.message)}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <label
                                                htmlFor="numberofbedroom"
                                                className="form-label"
                                            >
                                                {t("Number Of Bedrooms Label")}
                                            </label>
                                            <ReactSelect
                                                name="numOfBedrooms"
                                                control={control}
                                                options={[
                                                    {
                                                        value: 0,
                                                        label: t("Studio"),
                                                    },
                                                    ...numericArray,
                                                ]}
                                                isSearchable={false}
                                                placeholder={t(
                                                    "Select Bedrooms"
                                                )}
                                                className="select"
                                                getOptionLabel={(label) =>
                                                    toEasternArabicNumerals(
                                                        label?.label || label,
                                                        lang
                                                    )
                                                }
                                            />
                                            {errors.numOfBedrooms && (
                                                <p className="text-danger">
                                                    {t(
                                                        errors.numOfBedrooms
                                                            .message
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="clear">
                                            <label
                                                htmlFor="numberofbathrooms"
                                                className="form-label"
                                            >
                                                {t("Number of Bathrooms Label")}
                                            </label>
                                            <ReactSelect
                                                name="numOfBathrooms"
                                                control={control}
                                                options={numericArray}
                                                isSearchable={false}
                                                placeholder={t(
                                                    "Select Bathroom"
                                                )}
                                                className="select"
                                                getOptionLabel={(label) =>
                                                    toEasternArabicNumerals(
                                                        label?.label || label,
                                                        lang
                                                    )
                                                }
                                            />
                                            {errors.numOfBathrooms && (
                                                <p className="text-danger">
                                                    {t(
                                                        errors.numOfBathrooms
                                                            .message
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="clear">
                                            <label
                                                htmlFor="numberofparkings"
                                                className="form-label"
                                            >
                                                {t("Number of Parkings")}
                                            </label>
                                            <ReactSelect
                                                name="numOfParkings"
                                                control={control}
                                                options={[
                                                    {
                                                        value: 0,
                                                        label: "0",
                                                    },
                                                    ...numericArray,
                                                ]}
                                                isSearchable={false}
                                                placeholder={t(
                                                    "Select Parkings"
                                                )}
                                                className="select"
                                                getOptionLabel={(label) =>
                                                    toEasternArabicNumerals(
                                                        label?.label || label,
                                                        lang
                                                    )
                                                }
                                            />
                                            {errors.numOfParkings && (
                                                <p className="text-danger">
                                                    {t(
                                                        errors.numOfParkings
                                                            .message
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <hr />
                                    </div>

                                    <div className="col-md-6">
                                        <div className="clear">
                                            <label
                                                htmlFor="vacancy"
                                                className="form-label"
                                            >
                                                {t("Vacancy")}
                                            </label>
                                            <div className="vacancy-type">
                                                <div className="check">
                                                    <input
                                                        type="radio"
                                                        className="css-radio"
                                                        id="rented"
                                                        name="vacancy"
                                                        value="1"
                                                        {...register("vacancy")}
                                                    />
                                                    <label
                                                        htmlFor="rented"
                                                        className="css-labell"
                                                    >
                                                        {t("Rented")}
                                                    </label>
                                                </div>
                                                <div className="check">
                                                    <input
                                                        type="radio"
                                                        className="css-radio"
                                                        id="vacant"
                                                        name="vacancy"
                                                        value="2"
                                                        {...register("vacancy")}
                                                    />
                                                    <label
                                                        htmlFor="vacant"
                                                        className="css-labell"
                                                    >
                                                        {t("Vacant")}
                                                    </label>
                                                </div>
                                            </div>
                                            {errors.vacancy && (
                                                <p className="text-danger">
                                                    {t(errors.vacancy.message)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {parseInt(watch("vacancy")) === 1 && (
                                        <>
                                            <div className="col-md-6">
                                                &nbsp;
                                            </div>

                                            <div className="col-md-6">
                                                <div className="clear">
                                                    <label
                                                        htmlFor="rentaltill"
                                                        className="form-label"
                                                    >
                                                        {t("Rental Till")}
                                                    </label>
                                                    <DateSelector
                                                        control={control}
                                                        name="rentalTill"
                                                        className="form-control"
                                                        placeholderText={t(
                                                            "Select a date"
                                                        )}
                                                        dateFormat="yyyy-MM-dd"
                                                        showYearDropdown
                                                        scrollableMonthYearDropdown
                                                    />
                                                    {errors.rentalTill && (
                                                        <p className="text-danger">
                                                            {t(
                                                                errors
                                                                    .rentalTill
                                                                    .message
                                                            )}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                &nbsp;
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="col-md-12">
                                    <hr />
                                </div>

                                <div className="col-md-6">
                                    <div className="clear">
                                        <label
                                            htmlFor="constructionstatus"
                                            className="form-label"
                                        >
                                            {t("Construction Status")}
                                        </label>
                                        <ReactSelect
                                            name="constructionStatus"
                                            control={control}
                                            options={constructionStatus}
                                            isSearchable={true}
                                            placeholder={t("Select a status")}
                                            className="select"
                                        />
                                        {errors.constructionStatus && (
                                            <p className="text-danger">
                                                {t(
                                                    errors.constructionStatus
                                                        .message
                                                )}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="col-md-12">
                                    <hr />
                                </div>

                                <div className="col-md-6">
                                    <div className="clear">
                                        <label
                                            htmlFor="amenities"
                                            className="form-label"
                                        >
                                            {t("Amenities")}
                                        </label>
                                        <div className="multiselect">
                                            <ReactMultiSelectCheckbox
                                                name="amenities"
                                                control={control}
                                                options={amenities || []}
                                                placeholder={t("None selected")}
                                                className="select"
                                            />
                                        </div>
                                        {errors.amenities && (
                                            <p className="text-danger">
                                                {t(errors.amenities.message)}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="col-md-12 mb-4">
                                    <div className="ame-heading pt-3">
                                        {watch("amenities")?.length > 0
                                            ? t("Selected amenities")
                                            : t("None selected")}
                                    </div>
                                    {watch("amenities")?.length > 0 && (
                                        <ul className="amenities">
                                            {watch("amenities")?.map(
                                                (amenity, index) => (
                                                    <li key={index}>
                                                        {t(amenity?.label)}
                                                        <button
                                                            type="button"
                                                            className="delete"
                                                            onClick={() =>
                                                                handleRemoveAmenity(
                                                                    amenity?.value
                                                                )
                                                            }
                                                        >
                                                            <img
                                                                src="/img/close.svg"
                                                                alt="Remove"
                                                            />
                                                        </button>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    )}
                                </div>

                                <div className="col-md-6">
                                    <div className="clear">
                                        <label
                                            htmlFor="tags"
                                            className="form-label"
                                        >
                                            {t("Property tags")}
                                        </label>
                                        <div className="multiselect">
                                            <ReactMultiSelectCheckbox
                                                name="tags"
                                                control={control}
                                                options={tags || []}
                                                placeholder={t("None selected")}
                                                className="select"
                                            />
                                        </div>
                                        {errors.tags && (
                                            <p className="text-danger">
                                                {t(errors.tags.message)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-12 mb-4">
                                    <div className="ame-heading pt-3">
                                        {watch("tags")?.length > 0
                                            ? t("Selected tags")
                                            : t("None selected")}
                                    </div>
                                    {watch("tags")?.length > 0 && (
                                        <ul className="amenities">
                                            {watch("tags")?.map(
                                                (tag, index) => (
                                                    <li key={index}>
                                                        {t(tag?.label)}
                                                        <button
                                                            type="button"
                                                            className="delete"
                                                            onClick={() =>
                                                                handleRemoveTag(
                                                                    tag?.value
                                                                )
                                                            }
                                                        >
                                                            <img
                                                                src="/img/close.svg"
                                                                alt="Remove"
                                                            />
                                                        </button>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    )}
                                </div>

                                <div className="col-md-12">
                                    <div className="mb-4">
                                        <label
                                            htmlFor="description"
                                            className="form-label"
                                        >
                                            {t("Description")}
                                        </label>
                                        {/* <textarea
                                            className="form-control"
                                            placeholder={t(
                                                "Describe your property"
                                            )}
                                            {...register("description")}
                                        /> */}
                                        <TextEditor
                                            key={lang}
                                            name={"description"}
                                            control={control}
                                            defaultValue={""}
                                            // className="form-control"
                                            placeholder={t(
                                                "Describe your property"
                                            )}
                                        />
                                        {errors.description && (
                                            <p className="text-danger">
                                                {t(errors.description.message)}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="col-md-12">
                                    <div className="mb-4">
                                        <label
                                            htmlFor="description_ar"
                                            className="form-label"
                                        >
                                            {t("Description in Arabic")}
                                        </label>
                                        {/* <textarea
                                            className="form-control"
                                            placeholder={t(
                                                "Describe your property in Arabic"
                                            )}
                                            {...register("description_ar")}
                                        /> */}
                                        <TextEditor
                                            key={lang}
                                            name={"description_ar"}
                                            className="arabic-text"
                                            control={control}
                                            defaultValue={""}
                                            // className="form-control"
                                            placeholder={t(
                                                "Describe your property in Arabic"
                                            )}
                                        />
                                        {errors.description_ar && (
                                            <p className="text-danger">
                                                {t(
                                                    errors.description_ar
                                                        .message
                                                )}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <button
                                        type="button"
                                        onClick={() => handleBack(2)}
                                        className="btn btn-sky btn-lg"
                                    >
                                        {" "}
                                        <i className="fa-solid fa-angle-left mr4"></i>
                                        {t("Back")}
                                    </button>
                                </div>
                                <div className="col-md-6 right">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg"
                                    >
                                        {t("Next")}
                                        <i className="fa-solid fa-angle-right ml4"></i>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StepThreeForm;
