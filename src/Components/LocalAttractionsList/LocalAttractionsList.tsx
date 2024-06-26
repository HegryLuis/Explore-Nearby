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
  const [sortByRatingDesc, setSortByRatingDesc] = useState(false);

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

  const sortedList = [...list].sort((a, b) => {
    if (sortByRatingDesc) {
      return b.effectiveRating - a.effectiveRating; // сортировка по убыванию
    } else {
      return a.effectiveRating - b.effectiveRating; // сортировка по возрастанию
    }
  });

  return (
    <div className="slider-main">
      <div className="slider-title">
        <h2>Local Attractions: </h2>

        <div className="sort-options custom-placeType">
          <label>
            <input
              type="radio"
              name="sort"
              value="asc"
              checked={!sortByRatingDesc}
              onChange={() => setSortByRatingDesc(false)}
            />
            <div className="sort__label custom-placeType__label">
              <strong>Sort by Rating Ascending</strong>
            </div>
          </label>
          <label>
            <input
              type="radio"
              name="sort"
              value="desc"
              checked={sortByRatingDesc}
              onChange={() => setSortByRatingDesc(true)}
            />
            <div className="sort__label custom-placeType__label">
              <strong>Sort by Rating Descending</strong>
            </div>
          </label>
        </div>

        <div className="slide-counter">
          {list.length > 0 && (
            <p>
              {currentIndex + 1} / {list.length}
            </p>
          )}
        </div>
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
            {sortedList.map((place: Place, index: number) => (
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
