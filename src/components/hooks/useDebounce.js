import { useState, useEffect } from "react";

const useDebounce = ({ query = "", delay = 500 }) => {
    const [debouncedValue, setDebouncedValue] = useState(query);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(query.trim());
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [query, delay]);
    return debouncedValue;
};

export default useDebounce;
