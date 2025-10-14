import React from "react";
import { useController } from "react-hook-form";

const Checkbox = ({
    name,
    control,
    id,
    className,
    labelClassName,
    label,
    rules,
    ...rest
}) => {
    const {
        field: { value, onChange, onBlur },
        fieldState: { error },
    } = useController({
        name,
        control,
        rules,
        defaultValue: false,
    });

    return (
        <div>
            <input
                id={id}
                name={name}
                className={className}
                checked={value}
                onChange={onChange}
                onBlur={onBlur}
                {...rest}
            />
            <label htmlFor={id} className={labelClassName}>
                {label}
            </label>
            {error && <p className="error-message">{error.message}</p>}
        </div>
    );
};

export default Checkbox;
