import React from "react";
import { useParams } from "react-router-dom";
import NotificationComponents from "./NotificationComponents";
import useTranslationHook from "../hooks/useTranslationHook";

const NotificationDetails = ({ notifications }) => {
    const { id } = useParams();
    const { t } = useTranslationHook();

    const notification = { type: "property_review" }; //notifications.find(n => n.id === id);
    const propertyId = id;
    if (!notification) {
        return <p>{t("Notification not found.")}</p>;
    }

    const NotificationComponent = NotificationComponents[notification.type];

    if (!NotificationComponent) {
        return <p>{t("Unsupported notification type.")}</p>;
    }

    return (
        <NotificationComponent
            propertyId={propertyId}
            content={notification.content}
        />
    );
};

export default NotificationDetails;
