import React from "react";

const Card = ({
    header,
    images,
    content,
    footer,
    onClick,
    cardClassName = "card",
    cardBodyClassName = "card-body",
    cardImageClassName = "card-image",
    cardHeaderClassName = "card-header",
    cardFooterClassName = "card-footer",
    cardContentClassName = "card-content",
    cardImageContainerClassName = "card-images",
}) => {
    return (
        <div
            className={cardClassName}
            onClick={onClick}
            style={onClick ? { cursor: "pointer" } : {}}
        >
            {header && <div className={cardHeaderClassName}>{header}</div>}
            {images && images.length > 0 && (
                <div className={cardImageContainerClassName}>
                    {images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Card image ${index + 1}`}
                            className={cardImageClassName}
                        />
                    ))}
                </div>
            )}
            <div className={cardBodyClassName}>
                <p className={cardContentClassName}>{content}</p>
            </div>
            {footer && <div className={cardFooterClassName}>{footer}</div>}
        </div>
    );
};

export default Card;
