import React, { forwardRef } from "react";
import Select, { components } from "react-select";
import CreatableSelect from "react-select/creatable";
import { Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addNewProjectOption } from "../../redux/action/sellerAction";
import useTranslationHook from "../hooks/useTranslationHook";
const ReactSelect = forwardRef(
    (
        {
            options,
            onChange,
            value,
            isMulti = false,
            placeholder = "",
            isSearchable = false,
            isDisabled = false,
            className = "",
            control,
            name,
            defaultValue,
            showDropdownIndicator = true,
            showClearIndicator = true,
            isCreatable = false,
            isClearable = false,
            ...rest
        },
        ref
    ) => {
        const dispatch = useDispatch(); // Get Redux dispatcher
        const { t } = useTranslationHook();

        const handleSelectChange = (selected) => {
            const selectedValue = selected;

            if (onChange) {
                onChange(selectedValue);
            }
        };

        const handleCreate = (inputValue) => {
            const newOption = { label: inputValue, value: inputValue };
            dispatch(addNewProjectOption(newOption));
            handleSelectChange(isMulti ? [...value, newOption] : newOption);
        };

        const SelectComponent = isCreatable ? CreatableSelect : Select;

        if (control) {
            return (
                <Controller
                    name={name}
                    control={control}
                    defaultValue={defaultValue}
                    render={({ field }) => (
                        <SelectComponent
                            {...field}
                            options={options}
                            isMulti={isMulti}
                            placeholder={placeholder}
                            isSearchable={isSearchable}
                            isDisabled={isDisabled}
                            className={className}
                            getOptionLabel={(label) => t(label?.label || label)}
                            ref={ref}
                            components={{
                                IndicatorSeparator: () => null,
                                ...(showDropdownIndicator
                                    ? {}
                                    : { DropdownIndicator: () => null }),
                                ...(showClearIndicator
                                    ? {}
                                    : { ClearIndicator: () => null }),
                            }}
                            onChange={(selected) => {
                                const selectedValue = isMulti
                                    ? selected.map((item) => item.value)
                                    : selected.value;
                                field.onChange(selectedValue);
                                handleSelectChange(selected);
                            }}
                            onCreateOption={
                                isCreatable ? handleCreate : undefined
                            }
                            value={
                                isMulti
                                    ? options.filter((option) =>
                                          field.value?.includes(option.value)
                                      )
                                    : options.find(
                                          (option) =>
                                              String(option.value) ===
                                              String(field.value)
                                      ) || null
                            }
                            {...rest}
                        />
                    )}
                />
            );
        }

        return (
            <Select
                options={options}
                onChange={handleSelectChange}
                onCreateOption={isCreatable ? handleCreate : undefined}
                value={value}
                isMulti={isMulti}
                closeMenuOnSelect={isMulti ? false : true}
                getOptionLabel={(label) => t(label.label)}
                placeholder={placeholder}
                isSearchable={isSearchable}
                isDisabled={isDisabled}
                className={className}
                ref={ref}
                isClearable={isClearable}
                components={{
                    IndicatorSeparator: () => null,
                }}
                {...rest}
            />
        );
    }
);

ReactSelect.displayName = "ReactSelect";

export default ReactSelect;
