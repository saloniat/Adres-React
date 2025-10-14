import useTranslationHook from "../../hooks/useTranslationHook";

const FloorPlanModal = ({ image }) => {
    const { t } = useTranslationHook();
    const isPDF = image?.toLowerCase().endsWith(".pdf");

    return (
        <div
            className="modal fade planmodal"
            id="planModal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                            {t("Full View Plan")}
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body pb0">
                        {isPDF ? (
                            <figure>
                                <iframe
                                    src={`https://docs.google.com/gview?url=${encodeURIComponent(image)}&embedded=true`}
                                    width="100%"
                                    height="500px"
                                    title="PDF Viewer"
                                    frameBorder="0"
                                ></iframe>
                            </figure>
                        ) : (
                            <figure>
                                <img
                                    src={image}
                                    alt="Preview"
                                    style={{ maxWidth: "100%" }}
                                />
                            </figure>
                        )}
                        {/* <figure>
                            <img src={image} alt="" />
                        </figure> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FloorPlanModal;
