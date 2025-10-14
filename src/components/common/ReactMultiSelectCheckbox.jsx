import React from "react";
import Select, { components } from "react-select";
import { Controller } from "react-hook-form";
import useTranslationHook from "../hooks/useTranslationHook";
import { useSelector } from "react-redux";
import { toEasternArabicNumerals } from "../../helpers";

const CustomOption = (props) => {
    const { isSelected, label } = props;
    const { t } = useTranslationHook();

    return (
        <components.Option {...props}>
            <input
                type="checkbox"
                checked={isSelected}
                onChange={() => null}
                style={{ marginRight: 10 }}
            />
            {t(label)}
        </components.Option>
    );
};

const CustomValueContainer = ({ children, ...props }) => {
    const { getValue, selectProps } = props;
    const selected = getValue();
    const count = selected.length;
    const { t } = useTranslationHook();
    const lang = useSelector((state) => state.translation.lang);

    return (
        <components.ValueContainer {...props}>
            <div
                style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    height: "100%",
                }}
                onClick={selectProps.onMenuOpen}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        selectProps.onMenuOpen();
                    }
                }}
                tabIndex={0}
                role="button"
                aria-expanded={selectProps.menuIsOpen}
            >
                {count > 0
                    ? t("Selected Count", {
                          count: toEasternArabicNumerals(count, lang),
                      })
                    : t("None selected")}
            </div>
            {children[1]}
        </components.ValueContainer>
    );
};

const ReactMultiSelectCheckbox = ({
    options,
    placeholder = "",
    isDisabled = false,
    className = "",
    name,
    defaultValue = [],
    control,
    isSearchable = false,
}) => {
    const { t } = useTranslationHook();

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            render={({ field }) => (
                <Select
                    {...field}
                    options={options}
                    isMulti
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    className={className}
                    onChange={(selected) => field.onChange(selected || [])}
                    components={{
                        IndicatorSeparator: () => null,
                        ClearIndicator: () => null,
                        Option: CustomOption,
                        ValueContainer: CustomValueContainer,
                    }}
                    placeholder={placeholder || t("None selected")}
                    isDisabled={isDisabled}
                    isSearchable={isSearchable}
                    value={field.value || []}
                    styles={{
                        placeholder: (base) => ({
                            ...base,
                            color: "#aaa",
                        }),
                    }}
                />
            )}
        />
    );
};

export default ReactMultiSelectCheckbox;
