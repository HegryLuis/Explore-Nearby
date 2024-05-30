import React from "react";
import { Place } from "../../models/Place";
import { useApp } from "context";
import axios from "axios";
import "./LocalAttractionInfo.css";
import { getRatingClass } from "Components/Map/MapUtils";

const addFavouritePlace = async (user_id: string, place_id: string) => {
  try {
    const response = await axios.post(
      "http://localhost:3001/favourite-places",
      {
        user_id,
        place_id,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error adding favourite place:", error.response.data);
    throw error;
  }
};

const LocalAttractionInfo: React.FC<{
  place: Place;
  onClick: () => void;
}> = ({ place }) => {
  const { user, fetchFavouritePlaces, setDetailedPlacesData } = useApp();

  const handleAddFavouritePlace = async (place_id: string) => {
    if (user) {
      try {
        await addFavouritePlace(user.id, place_id);
        fetchFavouritePlaces(user.id, setDetailedPlacesData);
      } catch (error) {
        console.error("Cannot add favourite place: ", error);
      }
    } else {
      console.error("User is not logged in");
    }
  };

  return (
    <div className="local-attraction-info">
      <div className="text-info">
        <h2>{place.name}</h2>
        <p className="address">Address: {place.vicinity}</p>
        {place.rating && (
          <p className={`rating ${getRatingClass(place.rating)}`}>
            Rating: {place.rating}
          </p>
        )}

        {place.opening_hours && (
          <div className="opening-hours">
            <p className={place.opening_hours.isOpen() ? "open" : "closed"}>
              Open Now: {place.opening_hours.isOpen() ? "Yes" : "No"}
            </p>

            {place.opening_hours && place.opening_hours.weekday_text && (
              <div>
                <p>Weekday Text:</p>
                <p>
                  {place.opening_hours.weekday_text.map((text, index) => (
                    <span key={index}>
                      {text}
                      {index !==
                        place.opening_hours!.weekday_text!.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="place-buttons">
          <button
            onClick={() => {
              handleAddFavouritePlace(place.id);
            }}
          >
            Add to your list
          </button>
        </div>
      </div>

      {place.photos && (
        <div className="photo">
          {place.photos.map((photo, index) => (
            <img
              key={index}
              src={photo.photo_reference}
              alt={`Photo ${index}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LocalAttractionInfo;
