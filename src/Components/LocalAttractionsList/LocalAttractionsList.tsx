import React, { useContext, useEffect, useState } from "react";
import { Place } from "../../models/Place";
import "./LocalAttractionsList.css";
import { useApp } from "context";
import LocalAttractionInfo from "Components/LocalAttractionInfo/LocalAttractionInfo";

const LocalAttractionsList: React.FC<{
  list: Place[];
  onPlaceClick: (place: Place) => void;
}> = ({ list, onPlaceClick }) => {
  const { setSelectedPlace } = useApp();
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

  useEffect(() => {
    if (list.length > 0 && setSelectedPlace) {
      setSelectedPlace(list[currentIndex]);
    }
  }, [currentIndex]);

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
    </div>
  );
};

export default LocalAttractionsList;
