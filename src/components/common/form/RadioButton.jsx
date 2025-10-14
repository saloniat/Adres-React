import React, { forwardRef } from "react";

const Radio = (
    {
        id,
        name,
        value,
        type,
        label,
        className,
        labelClassName,
        register,
        validationRules,
        ...rest
    },
    ref
) => {
    return (
        <div>
            <input
                type={type}
                className={className}
                id={id}
                name={name}
                value={value}
                {...register(name, validationRules)}
                {...rest}
                ref={ref}
            />
            <label htmlFor={id} className={labelClassName}>
                {label}
            </label>
        </div>
    );
};
const RadioButton = forwardRef(Radio);

export default RadioButton;
