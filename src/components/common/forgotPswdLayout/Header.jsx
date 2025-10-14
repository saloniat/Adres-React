import React from "react";
import { Link } from "react-router-dom";
import ReactSelect from "../ReactSelect";
import { languages } from "../../../helpers";
import { configureMoment } from "../../../utils/moment/momentConfig";
import translationSlice from "../../../redux/slice/translationSlice";
import useTranslationHook from "../../hooks/useTranslationHook";
import { useDispatch, useSelector } from "react-redux";

const { handleLanguageSwitch } = translationSlice.actions;

const Header = () => {
    const { changeLanguage } = useTranslationHook();
    let lang = useSelector((state) => state.translation.lang);
    const dispatch = useDispatch();

    return (
        <header className="header position-relative p-0">
            <div className="container">
                <div className="logo-con center">
                    <Link to={"/"}>
                        <img src="/img/logo.svg" alt="Property Auction Logo" />
                    </Link>
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
            </div>
        </header>
    );
};
export default Header;
