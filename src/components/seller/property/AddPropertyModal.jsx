import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ReactSelect from "../../common/ReactSelect";
import {
    setCities,
    setPropertyCity,
    resetProperty,
    setFormStep,
} from "../../../redux/action/sellerAction";
import useTranslationHook from "../../hooks/useTranslationHook";

const AddPropertyModal = ({ onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedCity, setSelectedCity] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const cities = useSelector((state) => state.seller.cities);
    const loading = useSelector((state) => state.auth.siteLoader);
    const { t } = useTranslationHook();

    useEffect(() => {
        dispatch(resetProperty());
        if (!cities || cities.length === 0) dispatch(setCities());
        //eslint-disable-next-line
    }, [cities]);

    const handleCityChange = (city) => {
        if (errorMessage) setErrorMessage("");
        setSelectedCity([city]);
    };

    const handleConfirmModal = () => {
        if (!selectedCity.length) {
            setErrorMessage(t("Please select a city before confirming."));
            return;
        }
        const city = selectedCity[0]?.value;
        if (!city) {
            setErrorMessage(t("Choose City Label"));
            return;
        }
        dispatch(setPropertyCity(city));
        dispatch(setFormStep(1, navigate));
        onClose();
    };
    return (
        <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog modal-dialog-centered modal-md">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{t("Add Property")}</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-4">
                            <label htmlFor="city-select" className="form-label">
                                {t("Choose City Label")}
                            </label>
                            <ReactSelect
                                isDisabled={!cities?.length}
                                options={cities || []}
                                placeholder={
                                    loading
                                        ? t("Loading Cities")
                                        : !cities?.length
                                          ? t("There are no cities available")
                                          : t("Choose City Label")
                                }
                                isSearchable={true}
                                value={selectedCity}
                                onChange={handleCityChange}
                                className="select"
                            />
                        </div>
                        {errorMessage && (
                            <p className="text-danger">{t(errorMessage)}</p>
                        )}
                        {/* {selectedCity[0]?.value === 83 && (
                            <div className="badge badge-info">
                                <img
                                    src="/img/info-icon.svg"
                                    alt="Info Icon"
                                    className="mr4"
                                />
                                {t(
                                    "You will be redirected to Dari to set the property on auction"
                                )}
                            </div>
                        )} */}
                    </div>
                    <div className="modal-footer">
                        <div className="row">
                            <div className="col-md-6">
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-md btn-full"
                                    onClick={onClose}
                                >
                                    {t("Cancel")}
                                </button>
                            </div>
                            <div className="col-md-6 mmt-10">
                                <button
                                    className="btn btn-primary btn-md btn-full"
                                    onClick={handleConfirmModal}
                                >
                                    {t("Confirm")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddPropertyModal;
