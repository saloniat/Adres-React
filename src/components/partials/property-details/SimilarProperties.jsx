import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSimilarProperties } from "../../../redux/action/sellerAction";
import useSocketSync from "../../hooks/useSocketSync";
import DiscoverCard from "../../home/common/DiscoverCard";
import useTranslationHook from "../../hooks/useTranslationHook";
const SimilarProperties = () => {
    const dispatch = useDispatch();
    const { id: property_id } = useParams();
    const { similarProperty } = useSelector((state) => state.seller);
    const user = useSelector((state) => state.auth.user);
    const { t } = useTranslationHook();

    useEffect(() => {
        if (!property_id || isNaN(Number(property_id))) {
            console.error("Invalid property id");
        }
        dispatch(
            fetchSimilarProperties({
                property_id,
            })
        );
        //eslint-disable-next-line
    }, [property_id]);
    const syncData = useSocketSync(
        similarProperty,
        user?.user_id,
        "similarPropertySync"
    );
    if (!similarProperty?.length) return null;
    return (
        <div className="similarProperties-wrap space">
            <h5>{t("Similar Properties")}</h5>
            <ul className="discover-list">
                {similarProperty?.map((property, index) => (
                    <DiscoverCard
                        ele={property}
                        syncData={
                            syncData?.filter(
                                ({ property_id }) =>
                                    property_id ===
                                    Number(property?.property_id)
                            )?.[0]
                        }
                        key={index}
                    />
                ))}
            </ul>
        </div>
    );
};

export default SimilarProperties;
