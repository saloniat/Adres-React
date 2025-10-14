import React, { forwardRef } from "react";
import useTranslationHook from "../../hooks/useTranslationHook";
function InputComponent(
    { id, label, labelClassname, name, classname, register, errors, ...rest },
    ref
) {
    const { t } = useTranslationHook();
    const { minLength, maxLength, ...props } = rest;
    return (
        <>
            {label && (
                <label htmlFor={id} className={labelClassname}>
                    {label}
                </label>
            )}

            <input
                ref={ref}
                className={classname}
                autoComplete="new-password"
                {...register(name)}
                {...props}
            />
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
const Input = forwardRef(InputComponent);

export default Input;
