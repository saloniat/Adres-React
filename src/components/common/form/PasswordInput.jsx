import React, { forwardRef } from "react";
import useTranslationHook from "../../hooks/useTranslationHook";

function PswdInput(
    {
        id,
        label,
        labelClassname,
        name,
        classname,
        register,
        errors,
        handleShowPwd,
        showPwd,
        onChange,
        ...rest
    },
    ref
) {
    const { t } = useTranslationHook();
    const { minLength, maxLength, type, ...props } = rest;

    return (
        <>
            {label && (
                <label htmlFor={id} className={labelClassname}>
                    {label}
                </label>
            )}
            <div className="position-relative">
                <button
                    type="button"
                    className="showpwd"
                    onClick={() => {
                        handleShowPwd();
                    }}
                >
                    {showPwd ? (
                        <i className="fa-regular fa-eye"></i>
                    ) : (
                        <i className="fa-regular fa-eye-slash"></i>
                    )}
                </button>
                <input
                    ref={ref}
                    className={classname}
                    onChange={onChange}
                    autoComplete={`new-${name}`}
                    type={showPwd ? "text" : "password"}
                    {...register(name)}
                    {...props}
                />
            </div>

            {errors?.[name] && (
                <span className="text-danger">
                    {t(errors[name].message, {
                        ...(minLength && { minLength }),
                        ...(maxLength && { maxLength }),
                    })}
                </span>
            )}
        </>
    );
}
const PasswordInput = forwardRef(PswdInput);

export default PasswordInput;
