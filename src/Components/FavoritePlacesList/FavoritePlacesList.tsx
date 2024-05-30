import React, { useEffect, useState } from "react";
import axios from "axios";
import { useApp } from "context";
import { Place } from "models/Place";
import "./FavoritePlacesList.css";
import {
  getRatingClass,
  addMarker,
  clearMarkers,
} from "Components/Map/MapUtils";

const FavoritePlacesList: React.FC = () => {
  const {
    user,
    map,
    markers,
    setMarkers,
    detailedPlacesData,
    setDetailedPlacesData,
  } = useApp();
  const [detailedPlaces, setDetailedPlaces] = useState<Place[]>([]);

  useEffect(() => {
    const fetchFavoritePlaces = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `http://localhost:3001/users/${user.id}/favourite-places`
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

    fetchFavoritePlaces();
  }, [user]);

  useEffect(() => {
    const transformedDetailedPlaces = detailedPlacesData.map(
      (placeData: any) => ({
        id: placeData.result.place_id,
        name: placeData.result.name,
        vicinity: placeData.result.vicinity,
        rating: placeData.result.rating,
        opening_hours: placeData.result.opening_hours,
        type: placeData.type,
        geometry: placeData.geometry,
      })
    );

    setDetailedPlaces(transformedDetailedPlaces);
  }, [detailedPlacesData]);

  const handleShowInMap = (place: Place) => {
    if (map) {
      clearMarkers(markers, setMarkers);
      const position = new google.maps.LatLng(
        place.geometry.location.lat(),
        place.geometry.location.lng()
      );
      addMarker(position, map, markers, setMarkers);
      map.panTo(position);
    }
  };

  return (
    <div className="favorite-places-list">
      <h2>Your Favourite Places:</h2>
      {detailedPlaces.length > 0 ? (
        <ul>
          <div className="text-info">
            {detailedPlaces.map((place: Place) => (
              <li key={place.id}>
                <h2>{place.name}</h2>
                <p className="address">Address: {place.vicinity}</p>
                {place.rating && (
                  <p className={`rating ${getRatingClass(place.rating)}`}>
                    Rating: {place.rating}
                  </p>
                )}
                {place.opening_hours && (
                  <p className="opening-hours">
                    Open now:{" "}
                    {place.opening_hours.isOpen
                      ? place.opening_hours.isOpen()
                        ? "Yes"
                        : "No"
                      : "Not indicated"}
                  </p>
                )}
              </li>
            ))}
          </div>
        </ul>
      ) : (
        <p>You don't have any favorite places yet</p>
      )}
    </div>
  );
};

export default FavoritePlacesList;
