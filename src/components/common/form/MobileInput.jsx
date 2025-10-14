import React from "react";
import useTranslationHook from "../../hooks/useTranslationHook";

const MobileInput = ({
    id,
    className,
    label,
    labelClassname,
    inputRef,
    register,
    name,
    validationRules,
    errors,
    ...rest
}) => {
    const { t } = useTranslationHook();
    return (
        <>
            {label && (
                <label htmlFor={id} className={labelClassname}>
                    {label}
                </label>
            )}
            <input
                id={id}
                className={className}
                {...register(name, validationRules)}
                ref={(e) => {
                    register(name, validationRules).ref(e);
                    inputRef.current = e;
                }}
                {...rest}
            />
            {errors?.[name] && (
                <span className="text-danger">{t(errors[name].message)}</span>
            )}
        </>
    );
};

export default MobileInput;
