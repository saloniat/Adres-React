import { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import useDidMountEffect from "../hooks/useDidMountEffect";

const SearchInput = ({
    onSearch,
    delay = 500,
    minChars = 3,
    placeholder = "Search...",
    searchBoxClassName,
    reset,
}) => {
    const [inputValue, setInputValue] = useState("");

    const debouncedValue = useDebounce({
        delay,
        query: inputValue,
    });

    useDidMountEffect(() => {
        if (debouncedValue.length >= minChars) onSearch(debouncedValue);
        else if (debouncedValue === "") onSearch("");
    }, [debouncedValue]);

    useEffect(() => {
        if (reset) setInputValue("");
    }, [reset]);

    return (
        <input
            type="text"
            value={inputValue}
            placeholder={placeholder}
            onChange={(e) => setInputValue(e.target.value)}
            {...(searchBoxClassName && { className: searchBoxClassName })}
        />
    );
};

export default SearchInput;
