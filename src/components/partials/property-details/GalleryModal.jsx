import React, { Fragment, useEffect } from "react";
import useTranslationHook from "../../hooks/useTranslationHook";

const GalleryModal = ({ modalId, images }) => {
    const { t } = useTranslationHook();

    useEffect(() => {
        const handleModalShown = () => {
            const carousel = document.querySelector("#carousel");
            const slider = document.querySelector("#slider");

            if (carousel && slider) {
                window.$("#carousel").flexslider({
                    animation: "slide",
                    controlNav: false,
                    animationLoop: false,
                    slideshow: false,
                    itemWidth: 132,
                    itemMargin: 10,
                    asNavFor: "#slider",
                });

                window.$("#slider").flexslider({
                    animation: "slide",
                    controlNav: false,
                    animationLoop: false,
                    slideshow: false,
                    sync: "#carousel",
                });

                // console.log("Initialize carousel and slider");
            }
        };

        const modal = document.getElementById(modalId);
        modal?.addEventListener("shown.bs.modal", handleModalShown);

        return () => {
            modal?.removeEventListener("shown.bs.modal", handleModalShown);
        };
    }, [modalId]);

    return (
        <div
            className="modal fade gallary-modal"
            id={modalId}
            tabIndex="-1"
            aria-labelledby={`${modalId}Label`}
            aria-hidden="true"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    ></button>
                    <div className="modal-body">
                        <section className="slider">
                            <div className="gallaryslider">
                                <div id="slider" className="flexslider">
                                    <ul className="slides">
                                        {images?.map((image, index) => (
                                            <li key={index}>
                                                {/\.(jpg|jpeg|png|gif|bmp|svg|webp|jfif)$/i.test(
                                                    image
                                                ) ? (
                                                    <Fragment>
                                                        <img
                                                            className="slide-fixed" src="/img/trans16x9.png" alt="project"
                                                        />
                                                        <img
                                                            className="slide-img"
                                                            src={image}
                                                            alt={`Slide ${index + 1}`}
                                                        />
                                                    </Fragment>
                                                ) : (
                                                    // eslint-disable-next-line jsx-a11y/media-has-caption
                                                    <Fragment>
                                                        <img
                                                            className="slide-fixed" src="/img/trans16x9.png" alt="project"
                                                        />
                                                        <video
                                                            controls
                                                            width="100%"
                                                            className="slide-img"
                                                        >
                                                            <source
                                                                src={image}
                                                                type={image.type}
                                                            />
                                                            {t(
                                                                "Your browser does not support the video tag."
                                                            )}
                                                        </video>
                                                    </Fragment>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div id="carousel" className="flexslider">
                                    <ul className="slides">
                                        {images?.map((image, index) => (
                                            <li key={index}>
                                                {/\.(jpg|jpeg|png|gif|bmp|svg|webp|jfif)$/i.test(
                                                    image
                                                ) ? (
                                                    <Fragment>
                                                        <img
                                                        className="slide-fixed" src="/img/trans16x9.png" alt="project"
                                                    />
                                                    <img
                                                        src={image}
                                                        className="slide-img"
                                                        alt={`Thumbnail ${index + 1}`}
                                                    />
                                                    </Fragment>
                                                ) : (
                                                    // eslint-disable-next-line jsx-a11y/media-has-caption
                                                    <Fragment>
                                                        <img
                                                        className="slide-fixed" src="/img/trans16x9.png" alt="project"
                                                    />
                                                        <video
                                                            controls
                                                            width="100%"
                                                            className="slide-img"
                                                        >
                                                            <source
                                                                src={image}
                                                                type={image.type}
                                                            />
                                                            {t(
                                                                "Your browser does not support the video tag."
                                                            )}
                                                        </video>
                                                    </Fragment>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default GalleryModal;
