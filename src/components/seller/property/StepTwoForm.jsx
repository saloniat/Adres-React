import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ReactSelect from "../../common/ReactSelect";
import { StepTwoFormValidationSchema } from "../../../utils/validations/sellerValidation";
import {
    setCountries,
    setCities,
    setMunicipalities,
    setDistricts,
    setCommunitys,
    setProjects,
    setPropertyType,
    setFormStep,
    saveStepTwoData,
    resetCommunitys,
} from "../../../redux/action/sellerAction";
import useTranslationHook from "../../hooks/useTranslationHook";
import { ABUDHABICITYID } from "../../../utils/constants";
import Tooltip from "rc-tooltip";
const StepTwoForm = () => {
    const dispatch = useDispatch();
    const { t } = useTranslationHook();
    const lang = useSelector((state) => state.translation.lang);

    const {
        countries,
        cities,
        municipalities,
        districts,
        projects,
        communitys,
        propertyTypes,
        property: { stepTwoData },
    } = useSelector((state) => state.seller);

    useEffect(() => {
        if (!countries || countries?.length === 0) dispatch(setCountries());
        if (!cities || cities?.length === 0) dispatch(setCities());
        dispatch(setMunicipalities({ state_id: stepTwoData?.city }));
        if (!projects || projects?.length === 0)
            dispatch(setProjects(stepTwoData?.city));
        if (!propertyTypes || propertyTypes?.length === 0)
            dispatch(setPropertyType());
        //eslint-disable-next-line
    }, [stepTwoData?.city]);

    const handleFormStep = (step) => {
        dispatch(setFormStep(step));
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleBack = (step) => {
        dispatch(saveStepTwoData(getValues()));
        handleFormStep(step);
    };

    const onSubmit = (data) => {
        dispatch(saveStepTwoData(data));
        handleFormStep(3);
    };

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm({
        resolver: yupResolver(StepTwoFormValidationSchema),
        defaultValues: stepTwoData,
    });
    return (
        <section className="property-wrap">
            <div className="container py-5">
                <div className="row justify-content-md-center">
                    <div className="col-lg-8">
                        <div className="counter">{t("2/4")}</div>
                        <h5 className="display-5 mb-3">
                            {t("Property Details")}
                        </h5>
                        <ul className="property-progress">
                            <li className="full"></li>
                            <li className="active"></li>
                            <li></li>
                            <li></li>
                        </ul>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className=""
                            autoComplete="off"
                            autoCapitalize="off"
                        >
                            <div className="prop-bdr">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <label
                                                htmlFor="country"
                                                className="form-label"
                                            >
                                                {t("Country")}
                                            </label>
                                            <ReactSelect
                                                name="country"
                                                control={control}
                                                options={countries}
                                                isDisabled={true}
                                                placeholder={t(
                                                    "Select a country"
                                                )}
                                                className="select"
                                            />
                                            {errors.country && (
                                                <p className="text-danger">
                                                    {t(errors.country.message)}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <label
                                                htmlFor="city"
                                                className="form-label"
                                            >
                                                {t("City")}
                                            </label>
                                            <ReactSelect
                                                name="city"
                                                control={control}
                                                options={cities}
                                                isDisabled={true}
                                                placeholder={t("Select a city")}
                                                className="select"
                                            />
                                            {errors.city && (
                                                <p className="text-danger">
                                                    {t(errors.city.message)}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <label
                                                htmlFor="municipality"
                                                className="form-label"
                                            >
                                                {t("Municipality")}
                                            </label>
                                            <ReactSelect
                                                name="municipality"
                                                control={control}
                                                options={municipalities}
                                                isSearchable={true}
                                                placeholder={t(
                                                    "Select a municipality"
                                                )}
                                                className="select"
                                                onChange={({ value }) => {
                                                    dispatch(
                                                        setDistricts({
                                                            municipality_id:
                                                                value,
                                                        })
                                                    );
                                                    dispatch(resetCommunitys());
                                                }}
                                                getOptionLabel={(label) =>
                                                    t(
                                                        lang === "en"
                                                            ? label?.label ||
                                                                  label
                                                            : label.label_ar ||
                                                                  ""
                                                    )
                                                }
                                            />
                                            {errors.municipality && (
                                                <p className="text-danger">
                                                    {t(
                                                        errors.municipality
                                                            .message
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <label
                                                htmlFor="district"
                                                className="form-label"
                                            >
                                                {t("District")}
                                            </label>
                                            <ReactSelect
                                                name="district"
                                                control={control}
                                                options={districts}
                                                isSearchable={true}
                                                placeholder={t(
                                                    "Select a district"
                                                )}
                                                className="select"
                                                onChange={({ value }) => {
                                                    dispatch(
                                                        setCommunitys({
                                                            district_id: value,
                                                        })
                                                    );
                                                }}
                                                getOptionLabel={(label) =>
                                                    t(
                                                        lang === "en"
                                                            ? label?.label ||
                                                                  label
                                                            : label.label_ar ||
                                                                  ""
                                                    )
                                                }
                                            />
                                            {errors.district && (
                                                <p className="text-danger">
                                                    {t(errors.district.message)}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {Number(stepTwoData.city) ===
                                    ABUDHABICITYID ? (
                                        <div className="col-md-6">
                                            <div className="mb-4">
                                                <label
                                                    htmlFor="community"
                                                    className="form-label"
                                                >
                                                    {t("Community")}
                                                </label>
                                                <ReactSelect
                                                    name="community"
                                                    control={control}
                                                    options={communitys}
                                                    isSearchable={true}
                                                    placeholder={t(
                                                        "Select community"
                                                    )}
                                                    className="select"
                                                    getOptionLabel={(label) =>
                                                        t(
                                                            lang === "en"
                                                                ? label?.label ||
                                                                      label
                                                                : label.label_ar ||
                                                                      ""
                                                        )
                                                    }
                                                />
                                                {errors.community && (
                                                    <p className="text-danger">
                                                        {t(
                                                            errors.community
                                                                .message
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="col-md-6">
                                            <div className="mb-4">
                                                <label
                                                    htmlFor="community"
                                                    className="form-label"
                                                >
                                                    {t("Community")}
                                                </label>
                                                <input
                                                    {...register("community")}
                                                    type="text"
                                                    className="form-control"
                                                    placeholder={t(
                                                        "Enter community name"
                                                    )}
                                                />
                                                {errors.community && (
                                                    <p className="text-danger">
                                                        {t(
                                                            errors.community
                                                                .message
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <label
                                                htmlFor="project"
                                                className="form-label"
                                            >
                                                {t("Project")}
                                            </label>
                                            <ReactSelect
                                                name="project"
                                                control={control}
                                                options={projects}
                                                isSearchable={true}
                                                // isCreatable={true}
                                                placeholder={t(
                                                    "Select a project"
                                                )}
                                                className="select"
                                            />
                                            {errors.project && (
                                                <p className="text-danger">
                                                    {t(errors.project.message)}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <label
                                                htmlFor="property_name"
                                                className="form-label"
                                            >
                                                {t("Property Name")}
                                            </label>
                                            <input
                                                {...register("property_name")}
                                                type="text"
                                                className="form-control"
                                                placeholder={t(
                                                    "Enter property name"
                                                )}
                                            />
                                            {errors.property_name && (
                                                <p className="text-danger">
                                                    {t(
                                                        errors.property_name
                                                            .message
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <label
                                                htmlFor="property_name_ar"
                                                className="form-label"
                                            >
                                                {t("Property Name in Arabic")}
                                            </label>
                                            <input
                                                {...register(
                                                    "property_name_ar"
                                                )}
                                                type="text"
                                                className="form-control"
                                                placeholder={t(
                                                    "Enter property name in Arabic"
                                                )}
                                            />
                                            {errors.property_name_ar && (
                                                <p className="text-danger">
                                                    {t(
                                                        errors.property_name_ar
                                                            .message
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <label
                                                htmlFor="propertytype"
                                                className="form-label"
                                            >
                                                {t("Property Type")}
                                            </label>
                                            <ReactSelect
                                                name="propertyType"
                                                control={control}
                                                options={propertyTypes}
                                                isSearchable={true}
                                                placeholder={t(
                                                    "Select Property Type"
                                                )}
                                                className="select"
                                            />
                                            {errors.propertyType && (
                                                <p className="text-danger">
                                                    {t(
                                                        errors.propertyType
                                                            .message
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <label
                                                htmlFor="building"
                                                className="form-label"
                                            >
                                                {t("Building")}
                                            </label>
                                            <input
                                                {...register("building")}
                                                type="text"
                                                className="form-control"
                                                placeholder={t(
                                                    "Enter building name or number"
                                                )}
                                            />
                                            {errors.building && (
                                                <p className="text-danger">
                                                    {t(errors.building.message)}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="mb-4">
                                            <label
                                                htmlFor="map_url"
                                                className="form-label"
                                            >

                                                {t("Map URL")}
                                                <Tooltip
                                                    overlay={
                                                        <span>
                                                            Only Google Maps URLs are supported
                                                        </span>
                                                    }
                                                    placement="right"
                                                >
                                                    <span
                                                        className="ms-2 text-info"
                                                        data-tooltip-id={`my-tooltip-mapurl`}
                                                    >
                                                        <i className="fas fa-info-circle"></i>
                                                    </span>
                                                </Tooltip>
                                                
                                            </label>
                                            <input
                                                {...register("map_url")}
                                                type="url"
                                                className="form-control"
                                                placeholder={t("Enter map url")}
                                            />
                                            {errors.map_url && (
                                                <p className="text-danger">
                                                    {t(errors.map_url.message)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <button
                                        type="button"
                                        className="btn btn-sky btn-lg"
                                        onClick={() => handleBack(1)}
                                    >
                                        <i className="fa-solid fa-angle-left mr4"></i>
                                        {t("Back")}{" "}
                                    </button>
                                </div>
                                <div className="col-md-6 right">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg"
                                    >
                                        {t("Next")}{" "}
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

export default StepTwoForm;
