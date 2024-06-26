import React, { useEffect, useState } from "react";
import "./App.css";
import LocalAttractionsList from "./Components/LocalAttractionsList/LocalAttractionsList";
import { Place } from "./models/Place";
import Map from "./Components/Map/Map";
import {
  addMarker,
  searchNearbyPlaces,
  hideMarkers,
  showMarkers,
  deleteMarkers,
  onMapReady,
  capitalizeFirstLetter,
  clearMarkers,
  fetchFavouritePlaces,
} from "./Components/Map/MapUtils";
import Header from "Components/Header/Header";
import { Provider } from "context";
import { User } from "interfaces";
import FavoritePlacesList from "Components/FavoritePlacesList/FavoritePlacesList";

const App: React.FC = () => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [localAttractions, setLocalAttractions] = useState<Place[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [detailedPlacesData, setDetailedPlacesData] = useState<any[]>([]);
  const [radius, setRadius] = useState<number>(1);
  const [radiusInput, setRadiusInput] = useState<string>("1");

  const placeTypes = [
    "restaurant",
    "cafe",
    "bar",
    "museum",
    "park",
    "store",
    "zoo",
    //...
  ];

  useEffect(() => {
    console.log("Selected type = ", selectedType);
    console.log("local attractions: ", localAttractions);
  }, [selectedType]);

  function handleTypeChange(type: string) {
    setLocalAttractions([]);
    setSelectedType(type);
  }

  const handleMarkerClick = (position: google.maps.LatLng) => {
    if (map) {
      addMarker(position, map, markers, setMarkers);
      searchNearbyPlaces(
        position,
        map,
        setLocalAttractions,
        selectedType,
        radius
      );
    }
  };

  const handleMapClick = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    onMapReady(
      mapInstance,
      markers,
      setMarkers,
      setLocalAttractions,
      selectedType,
      radius
    );
  };

  // Обработчик изменения значения радиуса
  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (
      value === "" ||
      (/^\d+$/.test(value) &&
        parseInt(value, 10) >= 1 &&
        parseInt(value, 10) <= 50)
    ) {
      setRadiusInput(value);
      const parsedValue = parseInt(value, 10);
      if (!isNaN(parsedValue)) {
        setRadius(parsedValue);
      }
    }
  };

  useEffect(() => {
    if (selectedPlace && map) {
      const position = new google.maps.LatLng(
        selectedPlace.geometry.location.lat(),
        selectedPlace.geometry.location.lng()
      );
      clearMarkers(markers, setMarkers);
      addMarker(position, map, markers, setMarkers);
      map.panTo(position);
    }
  }, [selectedPlace]);

  return (
    <Provider
      value={{
        map,
        isLoggedIn,
        user,
        markers,
        selectedPlace,
        detailedPlacesData,
        setDetailedPlacesData,
        setSelectedPlace,
        setIsLoggedIn,
        setUser,
        setMarkers,
        fetchFavouritePlaces,
      }}
    >
      <div className="App">
        <Header />
        <div className="filters">
          <h3 className="filters-title">Select Place Types</h3>
          <div className="placeType-filter">
            {placeTypes.map((type) => (
              <div className="custom-placeType" key={type}>
                <label key={type}>
                  <input
                    type="radio"
                    name="placeType"
                    value={type}
                    checked={selectedType === type}
                    onChange={() => handleTypeChange(type)}
                  />
                  <div className="custom-placeType__label">
                    <strong>{capitalizeFirstLetter(type)}</strong>
                  </div>
                </label>
              </div>
            ))}
          </div>

          <div className="radius-filter">
            <label htmlFor="radius">
              <strong>Radius (km) : </strong>
            </label>
            <input
              type="number"
              id="radius"
              name="radius"
              min="1"
              max="50"
              value={radiusInput}
              onChange={handleRadiusChange}
            />
          </div>
        </div>

        <div className="buttons">
          <button id="hide-markers" onClick={() => hideMarkers(markers)}>
            Hide Markers
          </button>
          <button id="show-markers" onClick={() => showMarkers(markers, map)}>
            Show Markers
          </button>
          <button
            id="delete-markers"
            onClick={() =>
              deleteMarkers(markers, setMarkers, setLocalAttractions)
            }
          >
            Delete Markers
          </button>
        </div>

        <div className="main-app">
          <Map
            onMapReady={handleMapClick}
            onMarkerClick={handleMarkerClick}
            selectedType={selectedType}
            setMap={setMap}
            map={map}
            radius={radius}
          />
          <LocalAttractionsList
            list={localAttractions}
            onPlaceClick={(place) => setSelectedPlace(place)}
          />
        </div>
        {isLoggedIn && <FavoritePlacesList />}
      </div>
    </Provider>
  );
};

export default App;
