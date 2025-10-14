import React, {
    useEffect,
    useState,
    useRef,
    useCallback,
    useMemo,
} from "react";
import GoogleMap from "../../common/GoogleMap";
import useTranslationHook from "../../hooks/useTranslationHook";

const Location = ({
    projectName,
    projectLatitude,
    projectLongitude,
    projectNearByPlaces,
}) => {
    const { t } = useTranslationHook();

    const [selectedPlaceType, setSelectedPlaceType] = useState("SHOPPING"),
        mapRef = useRef(null),
        markersRef = useRef([]),
        createMapOptions = useMemo(
            () => ({
                styles: [
                    {
                        featureType: "all",
                        elementType: "geometry",
                        stylers: [{ color: "#F8F9FA" }],
                    },
                    {
                        featureType: "all",
                        elementType: "labels.text.fill",
                        stylers: [{ color: "#000000" }],
                    },
                    {
                        featureType: "all",
                        elementType: "labels.text.stroke",
                        stylers: [{ color: "#ffffff" }],
                    },
                    {
                        featureType: "water",
                        elementType: "geometry",
                        stylers: [{ color: "#c9c9c9" }],
                    },
                    {
                        featureType: "road",
                        elementType: "geometry",
                        stylers: [{ color: "#d6d6d6" }],
                    },
                    {
                        featureType: "landscape",
                        elementType: "geometry",
                        stylers: [{ color: "#ffffff" }],
                    },
                ],
                disableDefaultUI: true,
                zoomControl: true,
                mapTypeControl: true,
                streetViewControl: true,
                rotateControl: true,
                fullscreenControl: true,
                zoom: 15,
                minZoom: 5,
                maxZoom: 50,
                keyboardShortcuts: true,
                mapTypeId: "roadmap",
            }),
            []
        ),
        placesByType = useMemo(() => {
            const groupedPlaces = {
                SHOPPING: [],
                SCHOOL: [],
                HOSPITAL: [],
                LIFESTYLE: [],
            };
            projectNearByPlaces?.forEach((place) => {
                if (!place?.places_json) return;
                try {
                    const parsedPlaces = JSON.parse(place?.places_json);
                    if (!groupedPlaces[place?.place_type]) {
                        groupedPlaces[place?.place_type] = [];
                    } else {
                        groupedPlaces[place?.place_type].push(...parsedPlaces);
                    }
                } catch (error) {
                    console.error(
                        `Failed to parse JSON for place: ${place?.places_json}`,
                        error
                    );
                }
            });

            return groupedPlaces;
        }, [projectNearByPlaces]),
        placeTypes = useMemo(
            () => [
                {
                    type: "SHOPPING",
                    label: "Shopping",
                    count: placesByType.SHOPPING.length,
                },
                {
                    type: "SCHOOL",
                    label: "Schools",
                    count: placesByType.SCHOOL.length,
                },
                {
                    type: "HOSPITAL",
                    label: "Hospitals",
                    count: placesByType.HOSPITAL.length,
                },
                {
                    type: "LIFESTYLE",
                    label: "Lifestyle",
                    count: placesByType.LIFESTYLE.length,
                },
            ],
            [placesByType]
        ),
        updateMarkers = useCallback(
            (map, maps) => {
                markersRef.current.forEach((marker) => marker?.setMap(null));
                markersRef.current = [];
                const currentPlaces = placesByType[selectedPlaceType] || [];
                currentPlaces.forEach((markerData) => {
                    const marker = new maps.Marker({
                        position: {
                            lat: markerData?.lat,
                            lng: markerData?.lng,
                        },
                        title: markerData.name,
                        icon: {
                            url: markerData.icon,
                            scaledSize: new maps.Size(30, 30),
                            origin: new maps.Point(0, 0),
                            anchor: new maps.Point(15, 30),
                        },
                        map,
                    });
                    markersRef?.current?.push(marker);
                });
            },
            [selectedPlaceType, placesByType]
        ),
        handleGoogleApiLoaded = (map, maps) => {
            if (!map || !maps) {
                console.error("Google Maps API failed to load");
                return;
            }
            mapRef.current = map;
            new maps.Marker({
                position: { lat: projectLatitude, lng: projectLongitude },
                map,
                title: projectName,
            });
            updateMarkers(map, maps);
        };

    useEffect(() => {
        if (mapRef?.current) {
            updateMarkers(mapRef?.current, window.google.maps);
        }
    }, [selectedPlaceType, updateMarkers]);

    return (
        <div className="location-box space">
            <h4>{t("Location")}</h4>
            <figure>
                <GoogleMap
                    center={{ lat: projectLatitude, lng: projectLongitude }}
                    zoom={15}
                    width="100%"
                    height="65vh"
                    createMapOptions={createMapOptions}
                    handleGoogleApiLoaded={handleGoogleApiLoaded}
                />
            </figure>

            <ul>
                {placeTypes.map(({ type, label, count }) => (
                    <li
                        key={type}
                        className={selectedPlaceType === type ? "active" : ""}
                    >
                        <button onClick={() => setSelectedPlaceType(type)}>
                            <h6>
                                {t(label)}
                                <span>
                                    {t("No. Of Places", {
                                        count,
                                    })}
                                </span>
                            </h6>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Location;
