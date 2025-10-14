import React, { useEffect } from "react";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";
import useTranslationHook from "../hooks/useTranslationHook";

export const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    shouldScroll = true,
}) => {
    const { t } = useTranslationHook();

    useEffect(() => {
        if (!shouldScroll) return;
        window.scrollTo(0, 0);
    }, [currentPage]);

    return (
        <div className="pagination-wrap pb-5">
            <ResponsivePagination
                current={currentPage}
                total={totalPages}
                onPageChange={onPageChange}
            />
        </div>
    );
};
