import { useCallback } from "react";

const useScrollToElement = (behavior = "smooth") => {
    const scrollToElement = useCallback(
        (elementId) => {
            const element = document.getElementById(elementId);
            if (element) {
                element.scrollIntoView({ behavior });
            }
        },
        [behavior]
    );
    return scrollToElement;
};
export default useScrollToElement;
