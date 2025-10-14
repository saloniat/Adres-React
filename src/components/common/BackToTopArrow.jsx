import React from "react";

const BackToTopArrow = () => {
    return (
        <a
            href="void:{0}"
            onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="btn btn-lg btn-primary btn-lg-square rounded-circle back-to-top"
        >
            <i className="bi bi-arrow-up"></i>
        </a>
    );
};

export default BackToTopArrow;
