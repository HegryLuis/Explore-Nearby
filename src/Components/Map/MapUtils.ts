import { Place } from "../../models/Place";

const addMarker = (
  position: google.maps.LatLng | google.maps.LatLngLiteral,
  map: google.maps.Map | null,
  markers: google.maps.Marker[],
  setMarkers: React.Dispatch<React.SetStateAction<google.maps.Marker[]>>
) => {
  if (map) {
    const marker = new google.maps.Marker({ position, map: map });
    setMarkers((prevMarkers) => [...prevMarkers, marker]);
  }
};

const getPlaceDetails = (
  placeId: string,
  service: google.maps.places.PlacesService
): Promise<google.maps.places.PlaceResult> => {
  return new Promise((resolve, reject) => {
    service.getDetails({ placeId }, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place) {
        resolve(place);
      } else {
        reject(status);
      }
    });
  });
};

const searchNearbyPlaces = async (
  latLng: google.maps.LatLng,
  map: google.maps.Map | null,
  setLocalAttractions: React.Dispatch<React.SetStateAction<Place[]>>,
  type: string
) => {
  if (!map) {
    return;
  }

  const service = new google.maps.places.PlacesService(map);

  const request = {
    location: latLng,
    radius: 1000, // Radius in meters
    type: type,
  };

  service.nearbySearch(request, async (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      const places: Place[] = [];
      for (const result of results) {
        try {
          const placeDetails = await getPlaceDetails(result.place_id!, service);
          const place: Place = {
            id: result.place_id!,
            name: result.name!,
            vicinity: result.vicinity || "",
            rating: result.rating,
            opening_hours: placeDetails.opening_hours
              ? {
                  isOpen: placeDetails.opening_hours.isOpen,
                  weekday_text: placeDetails.opening_hours.weekday_text,
                }
              : undefined,
            photos: result.photos?.map((photo) => ({
              height: photo.height,
              width: photo.width,
              photo_reference: photo.getUrl({
                maxWidth: photo.width,
                maxHeight: photo.height,
              }),
              html_attributions: photo.html_attributions,
            })),
            type: type,
            geometry: result.geometry!,
          };
          places.push(place);
        } catch (error) {
          console.error("Error fetching place details:", error);
        }
      }
      setLocalAttractions(places);
    } else {
      console.error("Error fetching nearby places:", status);
    }
  });
};

function setMapOnAll(
  markers: google.maps.Marker[],
  map: google.maps.Map | null
) {
  markers.forEach((marker) => {
    marker.setMap(map);
  });
}

const hideMarkers = (markers: google.maps.Marker[]) => {
  console.log("Hide");
  setMapOnAll(markers, null);
};

const showMarkers = (
  markers: google.maps.Marker[],
  map: google.maps.Map | null
) => {
  console.log("Show");
  setMapOnAll(markers, map);
};

const deleteMarkers = (
  markers: google.maps.Marker[],
  setMarkers: React.Dispatch<React.SetStateAction<google.maps.Marker[]>>,
  setLocalAttractions: React.Dispatch<React.SetStateAction<Place[]>>
) => {
  console.log("Delete");
  setMapOnAll(markers, null);
  setMarkers([]);
  setLocalAttractions([]);
};

const onMapReady = (
  map: google.maps.Map,
  markers: google.maps.Marker[],
  setMarkers: React.Dispatch<React.SetStateAction<google.maps.Marker[]>>,
  setLocalAttractions: React.Dispatch<React.SetStateAction<Place[]>>,
  selectedType: string
) => {
  map.addListener("click", (event: google.maps.MapMouseEvent) => {
    const clickedLatlng = event.latLng;
    if (clickedLatlng) {
      addMarker(clickedLatlng, map, markers, setMarkers);
      searchNearbyPlaces(clickedLatlng, map, setLocalAttractions, selectedType);
    }
  });
};

const clearMarkers = (
  markers: google.maps.Marker[],
  setMarkers: React.Dispatch<React.SetStateAction<google.maps.Marker[]>>
) => {
  markers.forEach((marker) => marker.setMap(null));
  setMarkers([]);
};

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export {
  addMarker,
  searchNearbyPlaces,
  hideMarkers,
  showMarkers,
  deleteMarkers,
  onMapReady,
  capitalizeFirstLetter,
  clearMarkers,
};
