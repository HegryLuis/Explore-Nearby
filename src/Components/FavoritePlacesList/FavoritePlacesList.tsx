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
        opening_hours: {
          isOpen:
            placeData.result.opening_hours &&
            placeData.result.opening_hours.open_now !== undefined
              ? placeData.result.opening_hours.open_now
              : null,
          weekday_text: placeData.result.opening_hours?.weekday_text,
        },
        rating: placeData.result.rating,
        effectiveRating: 0,
        type: placeData.type,
        geometry: placeData.result.geometry,
      })
    );

    setDetailedPlaces(transformedDetailedPlaces);
  }, [detailedPlacesData]);

  const handleShowInMap = (place: Place) => {
    console.log(place);
    if (place.geometry && place.geometry.location) {
      if (map) {
        clearMarkers(markers, setMarkers);
        const position = {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
        } as google.maps.LatLng;
        addMarker(position, map, markers, setMarkers);
        map.panTo(position);
      }
    } else {
      console.error("Invalid place object:", place);
    }
  };

  const handleDelete = async (id: string) => {
    if (user) {
      try {
        await axios.delete(
          `http://localhost:3001/users/${user.id}/favourite-places/${id}`
        );

        setDetailedPlaces((prevPlaces) =>
          prevPlaces.filter((place) => place.id !== id)
        );
      } catch (error) {
        console.error(error);
      }
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
                <div className="place-block">
                  <h2>{place.name}</h2>
                  <p className="address">Address: {place.vicinity}</p>
                  {place.rating && (
                    <p className={`rating ${getRatingClass(place.rating)}`}>
                      Rating: {place.rating}
                    </p>
                  )}
                  {place.opening_hours?.weekday_text && (
                    <div className="weekday-text">
                      <p>Weekday hours:</p>
                      <p className="weekday">
                        {place.opening_hours.weekday_text.map(
                          (weekday: string, index: number) => (
                            <span key={index}>{weekday}</span>
                          )
                        )}
                      </p>
                    </div>
                  )}
                </div>
                <div className="place-btn">
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(place.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 490.646 490.646"
                    >
                      <g>
                        <g>
                          <path
                            fill="#fff"
                            d="M399.179 67.285l-74.794 0.033L324.356 0 166.214 0.066l0.029 67.318-74.802 0.033 0.025 62.914h307.739z M198.28 32.11l94.03-0.041 0.017 35.262-94.03 0.041z"
                          />
                          <path
                            fill="#fff"
                            d="M91.465 490.646h307.739V146.359H91.465V490.646z M317.461 193.372h16.028v250.259h-16.028V193.372z M237.321 193.372h16.028v250.259h-16.028V193.372z M157.18 193.372h16.028v250.259H157.18V193.372z"
                          />
                        </g>
                      </g>
                    </svg>
                  </button>
                  <button
                    className="show-btn"
                    onClick={() => handleShowInMap(place)}
                  >
                    <svg
                      width="25"
                      height="25"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#ffffff"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.291 21.706 12 21l-.709.706zM12 21l.708.706a1 1 0 0 1-1.417 0l-.006-.007-.017-.017-.062-.063a47.708 47.708 0 0 1-1.04-1.106 49.562 49.562 0 0 1-2.456-2.908c-.892-1.15-1.804-2.45-2.497-3.734C4.535 12.612 4 11.248 4 10c0-4.539 3.592-8 8-8 4.408 0 8 3.461 8 8 0 1.248-.535 2.612-1.213 3.87-.693 1.286-1.604 2.585-2.497 3.735a49.583 49.583 0 0 1-3.496 4.014l-.062.063-.017.017-.006.006L12 21zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
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
