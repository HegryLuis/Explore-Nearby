import React, { useState, useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface MapProps {
  onMapReady: (map: google.maps.Map) => void;
  onMarkerClick: (position: google.maps.LatLng) => void;
  setMap: (map: google.maps.Map) => void;
  map: google.maps.Map | null;
  selectedType: string;
}

const Map: React.FC<MapProps> = ({
  onMapReady,
  onMarkerClick,
  selectedType,
  setMap,
  map,
}) => {
  useEffect(() => {
    const initMap = (): void => {
      const myLatlng = { lat: 50.4501, lng: 30.5234 }; // Kyiv

      const map = new google.maps.Map(
        document.getElementById("map") as HTMLElement,
        {
          zoom: 12,
          center: myLatlng,
        }
      );

      map.addListener("click", (event: google.maps.MapMouseEvent) => {
        const clickedLatlng = event.latLng;
        onMarkerClick(clickedLatlng);
      });

      onMapReady(map);
      setMap(map);
    };

    const loader = new Loader({
      apiKey: "AIzaSyAeNVLCxgGFmlH1ylCKI8m2ohs3IcyM52A",
      version: "weekly",
      libraries: ["places"],
    });

    loader.load().then(() => {
      initMap();
    });
  }, []);

  useEffect(() => {
    if (map) {
      onMapReady(map);
    }
  }, [selectedType]);

  return <div id="map" style={{ width: "100%", height: "500px" }} />;
};

export default Map;
