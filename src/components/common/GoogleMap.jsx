import React from "react";
import GoogleMapReact from "google-map-react";

const GoogleMap = ({
    center,
    zoom = 10,
    width = "100%",
    height = "100vh",
    createMapOptions = {},
    handleGoogleApiLoaded,
}) => {
    const defaultCenter = center || { lat: 25.1972, lng: 55.2744 };
    return (
        <div style={{ height, width }}>
            <GoogleMapReact
                defaultZoom={zoom}
                defaultCenter={defaultCenter}
                yesIWantToUseGoogleMapApiInternals
                bootstrapURLKeys={{
                    key: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
                }}
                {...(Object.keys(createMapOptions).length && {
                    options: createMapOptions,
                })}
                {...(handleGoogleApiLoaded && {
                    onGoogleApiLoaded: ({ map, maps }) =>
                        handleGoogleApiLoaded(map, maps),
                })}
            ></GoogleMapReact>
        </div>
    );
};

export default GoogleMap;
