import React, { useState } from "react";
import { Place } from "../../models/Place";
import "./LocalAttractionsList.css";

const getRatingClass = (rating: number | undefined) => {
  if (rating === undefined) return "";
  if (rating >= 0 && rating < 2) return "low-rating";
  if (rating >= 2 && rating < 3.5) return "medium-rating";
  if (rating >= 3.5 && rating <= 5) return "high-rating";
  return "";
};

const LocalAttractionInfo: React.FC<{ place: Place; onClick: () => void }> = ({
  place,
  onClick,
}) => {
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
          <button onClick={onClick}>Show in map</button>
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

const LocalAttractionsList: React.FC<{
  list: Place[];
  onPlaceClick: (place: Place) => void;
}> = ({ list, onPlaceClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === list.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? list.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="slider-main">
      <div className="slider-title">
        <h2>Local Attractions:</h2>
      </div>

      {list.length === 0 ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="slider-container">
          <button className="prev-button" onClick={prevSlide}>
            &#10094;
          </button>
          <div className="slider">
            {list.map((place: Place, index: number) => (
              <div
                key={index}
                className={`slide ${index === currentIndex ? "active" : ""}`}
              >
                <LocalAttractionInfo
                  place={place}
                  onClick={() => onPlaceClick(place)}
                />
              </div>
            ))}
          </div>
          <button className="next-button" onClick={nextSlide}>
            &#10095;
          </button>
        </div>
      )}

      {/* <div className="slider-container">
        <button className="prev-button" onClick={prevSlide}>
          &#10094;
        </button>
        <div className="slider">
          {list.map((place: Place, index: number) => (
            <div
              key={index}
              className={`slide ${index === currentIndex ? "active" : ""}`}
            >
              <LocalAttractionInfo
                place={place}
                onClick={() => onPlaceClick(place)}
              />
            </div>
          ))}
        </div>
        <button className="next-button" onClick={nextSlide}>
          &#10095;
        </button>
      </div> */}
    </div>
  );
};

export default LocalAttractionsList;
