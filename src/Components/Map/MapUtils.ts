import { Place } from "../../models/Place";
import axios from "axios";

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

const getPlaceDetailsById = async (placeId: string): Promise<Place | null> => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=AIzaSyAeNVLCxgGFmlH1ylCKI8m2ohs3IcyM52A`
    );

    const result = response.data.result;

    const place: Place = {
      id: result.place_id,
      name: result.name,
      vicinity: result.vicinity || "",
      rating: result.rating,
      opening_hours: result.opening_hours
        ? {
            isOpen: result.opening_hours.open_now,
            weekday_text: result.opening_hours.weekday_text,
          }
        : undefined,
      photos: result.photos?.map((photo: any) => ({
        height: photo.height,
        width: photo.width,
        photo_reference: photo.photo_reference,
        html_attributions: photo.html_attributions,
      })),
      type: result.types,
      geometry: result.geometry,
    };

    return place;
  } catch (error) {
    console.error("Error fetching place details:", error);
    return null;
  }
};

const getRatingClass = (rating: number | undefined) => {
  if (rating === undefined) return "";
  if (rating >= 0 && rating < 2) return "low-rating";
  if (rating >= 2 && rating < 3.5) return "medium-rating";
  if (rating >= 3.5 && rating <= 5) return "high-rating";
  return "";
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

  console.log("Requesting nearby places with type:", type);

  service.nearbySearch(request, async (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      const places: Place[] = [];
      for (const result of results) {
        try {
          if (result.types && result.types.includes(type)) {
            const placeDetails = await getPlaceDetails(
              result.place_id!,
              service
            );
            console.log(`Result = ${result.name} = `, result);
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
          }
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
  const handleClick = (event: google.maps.MapMouseEvent) => {
    const clickedLatlng = event.latLng;

    if (clickedLatlng) {
      addMarker(clickedLatlng, map, markers, setMarkers);
      searchNearbyPlaces(clickedLatlng, map, setLocalAttractions, selectedType);
    }
  };

  google.maps.event.clearListeners(map, "click");

  map.addListener("click", handleClick);
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

const fetchFavouritePlaces = async (
  userId: string,
  setDetailedPlacesData: React.Dispatch<React.SetStateAction<any[]>>
) => {
  if (userId) {
    try {
      const response = await axios.get(
        `http://localhost:3001/users/${userId}/favourite-places`
      );
      const favoritePlaces = response.data;

      const detailedPlacesPromises = favoritePlaces.map(
        async (favoritePlace: { place_id: string }) => {
          try {
            const detailedResponse = await axios.get(
              `http://localhost:3001/place-details?placeId=${favoritePlace.place_id}&apiKey=AIzaSyAeNVLCxgGFmlH1ylCKI8m2ohs3IcyM52A`
            );
            return detailedResponse.data;
          } catch (error) {
            console.error(
              "Error fetching details for place:",
              favoritePlace.place_id
            );
            return null;
          }
        }
      );

      const detailedPlacesData = await Promise.all(detailedPlacesPromises);
      const filteredDetailedPlacesData = detailedPlacesData.filter(
        (place: any) => place !== null
      );

      setDetailedPlacesData(filteredDetailedPlacesData);
    } catch (error) {
      console.error("Error fetching favorite places:", error);
    }
  }
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
  getPlaceDetailsById,
  getRatingClass,
  fetchFavouritePlaces,
};
