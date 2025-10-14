import React from "react";

const NumericInput = ({
    name,
    placeholder,
    register,
    allowDecimal = false,
    readOnly = false,
}) => {
    const validationPattern = allowDecimal
        ? {
              value: /^[0-9]*\.?[0-9]*$/,
              message: "Only numeric or decimal values are allowed",
          }
        : {
              value: /^[0-9]+$/,
              message: "Only numeric values are allowed",
          };

    return (
        <input
            {...register(name, {
                pattern: validationPattern,
            })}
            type="text"
            className="form-control"
            placeholder={placeholder}
            readOnly={readOnly}
            onInput={(e) => {
                if (readOnly) return;
                const regex = allowDecimal ? /[^0-9.]/g : /[^0-9]/g;
                let value = e.target.value.replace(regex, "");

                if (allowDecimal) {
                    const parts = value.split(".");
                    if (parts.length > 2) {
                        value = parts[0] + "." + parts.slice(1).join("");
                    }
                }

                e.target.value = value;
            }}
        />
    );
};

export default NumericInput;
