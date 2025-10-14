import React, { useEffect, useState } from "react";
import {
    FacebookShareButton,
    TwitterShareButton,
    LinkedinShareButton,
    WhatsappShareButton,
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon,
    WhatsappIcon,
} from "react-share";
import useTranslationHook from "../hooks/useTranslationHook";
import { Link } from "react-router-dom";

const ShareButton = ({ shareUrl, title, icon, name }) => {
    const { t } = useTranslationHook();

    const [showShareOptions, setShowShareOptions] = useState(false);

    useEffect(() => {
        return () => {
            setShowShareOptions(false);
        };
    }, []);
    const handleShare = () => {
        setShowShareOptions((prev) => !prev);
    };

    return (
        <div style={{ position: "relative" }}>
            {icon ? (
                <Link to="" onClick={handleShare}>
                    <i className={`fas ${icon}`}></i>
                    {t(name)}
                </Link>
            ) : (
                <button onClick={handleShare}>
                    <img src="/img/share-icon.svg" alt="Share" />
                </button>
            )}

            {showShareOptions && (
                <div className="share-social">
                    <FacebookShareButton url={shareUrl} quote={title}>
                        <FacebookIcon size={32} round />
                    </FacebookShareButton>

                    <TwitterShareButton url={shareUrl} title={title}>
                        <TwitterIcon size={32} round />
                    </TwitterShareButton>

                    <LinkedinShareButton url={shareUrl} title={title}>
                        <LinkedinIcon size={32} round />
                    </LinkedinShareButton>

                    <WhatsappShareButton url={shareUrl} title={title}>
                        <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                </div>
            )}
        </div>
    );
};

export default ShareButton;
