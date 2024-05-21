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
} from "./Components/Map/MapUtils";
import Header from "Components/Header/Header";

const App: React.FC = () => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [localAttractions, setLocalAttractions] = useState<Place[]>([]);
  const [selectedType, setSelectedType] = useState<string>("restaurant");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

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

  function handleTypeChange(type: string) {
    setSelectedType(type);
  }

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
          onMapReady={(mapInstance: google.maps.Map) => {
            setMap(mapInstance);
            onMapReady(
              mapInstance,
              markers,
              setMarkers,
              setLocalAttractions,
              selectedType
            );
          }}
          onMarkerClick={(position: google.maps.LatLng) => {
            addMarker(position, map, markers, setMarkers);
            searchNearbyPlaces(
              position,
              map,
              setLocalAttractions,
              selectedType
            );
          }}
          selectedType={selectedType}
          setMap={setMap}
          map={map}
        />
        <LocalAttractionsList
          list={localAttractions}
          onPlaceClick={(place) => setSelectedPlace(place)}
        />
      </div>
    </div>
  );
};

export default App;
