import { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import flag from "../../../../../helpers/images/flag.png";

const Map = ({ markers, draggable=false, getEvent={} }: any) => {

    const [Markers, setMarkers] = useState<any>([]);
    const [activeMarker, setActiveMarker] = useState(null);
    const [Center, setCenter] = useState<any>({
        lat: 20.5937,
        lng: 78.9629
    });
    const [zoom, setzoom] = useState<number>(6);
    const mapType = "satellite";

    const containerStyle = {
        height: '345px',
        width: '100%'
    };

    const handleActiveMarker = (marker: any) => {
        if (marker === activeMarker) {
            return;
        }
        setActiveMarker(marker);
    };

    const onMarkerDragEnd = (event: any) => {
        getEvent(event);
    };

    useEffect(() => {
        let coordinates = markers.length > 0 ? markers.filter((marker: any) => marker.coordinates) : [];
        if(coordinates.length > 0){
            let CenterCoordinates= coordinates[0].coordinates.split(',')
            setCenter({
                lat: parseFloat(CenterCoordinates[0]),
                lng: parseFloat(CenterCoordinates[1])
            });
            let zoom_coordinates = coordinates[0];
            zoom_coordinates.locationName ? setzoom(6) : zoom_coordinates.branchName ? setzoom(7) : zoom_coordinates.facilityName ? setzoom(8) : zoom_coordinates.buildingName ? setzoom(9) : zoom_coordinates.new_location ? setzoom(4) : setzoom(zoom+1);
            setMarkers(coordinates);
        }
    }, [markers])

    return (
        // <LoadScript googleMapsApiKey="AIzaSyBBv6shA-pBM0e9KydvwubSY55chq0gqS8">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={Center}
                zoom={zoom}
                mapContainerClassName='rounded-xl'
                // mapTypeId={mapType}
            >
                {Markers.map((marker: any, index: any) => {
                    const coordinates = marker.coordinates.split(',');
                    const lat = parseFloat(coordinates[0]);
                    const lng = parseFloat(coordinates[1]);
                    return <Marker
                        icon={flag}
                        draggable={draggable}
                        onDragEnd={onMarkerDragEnd}
                        key={index}
                        position={{
                            lat: lat,
                            lng: lng
                        }}
                        onClick={() => handleActiveMarker(index)}
                    >
                        {activeMarker === index ? (
                            <InfoWindow onCloseClick={() => setActiveMarker(null)} >
                                <div>{marker.new_location || marker.locationName || marker.branchName|| marker.facilityName }</div>
                            </InfoWindow>
                        ) : null}
                    </Marker>
                })}
            </GoogleMap>
        // </LoadScript>
    )
};

export default Map;
