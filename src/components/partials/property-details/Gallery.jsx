import useTranslationHook from "../../hooks/useTranslationHook";
import GalleryModal from "./GalleryModal";
import useWindowDimensions from "../../hooks/useWindowDimension";
const Gallery = ({ images }) => {
    const imagesUrls = images?.map(
        (image) =>
            `${process.env.REACT_APP_AZURE_BLOB_URL}${image?.bucket_name}/${image?.doc_file_name}`
    );
    const { t } = useTranslationHook();
    const windowDimension = useWindowDimensions();
    const noOfSlideToShow =
        windowDimension.width <= 991 ? [0] : [0, 1, 2, 3, 4];
    return (
        <section className="gallery-wrap">
            <div className="container">
                <div className="row">
                    <div className="gallery-box">
                        {noOfSlideToShow?.map((index) => (
                            <div
                                key={index}
                                className={`slide slide-${index + 1} ${noOfSlideToShow.length === 1 ? "shadoww" : ""}`}
                            >
                                <img
                                    className="slide-fixed"
                                    src="/img/slide-1-trans.png"
                                    alt="project"
                                />
                                <img
                                    className="slide-img"
                                    src={
                                        imagesUrls[index]
                                            ? `${imagesUrls[index]}`
                                            : `/img/slide-1.jpg`
                                    }
                                    alt="project"
                                />
                                {noOfSlideToShow.length - 1 === index && (
                                    <button
                                        type="button"
                                        className="allpic open-modal-btn"
                                        data-bs-toggle="modal"
                                        data-bs-target={`#gallaryModal`}
                                    >
                                        {t("Show All Photos")}
                                    </button>
                                )}
                            </div>
                        ))}
                        <GalleryModal
                            modalId={`gallaryModal`}
                            images={
                                imagesUrls.length > 0
                                    ? imagesUrls
                                    : ["/img/slide-1.jpg"]
                            }
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Gallery;
