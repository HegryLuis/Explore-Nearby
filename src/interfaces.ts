import { Place } from "models/Place";

export interface User {
  id: string;
  name: string;
}

export type AppContext = {
  map: google.maps.Map | null;
  isLoggedIn: boolean;
  user: User | null;
  selectedPlace: Place | null;
  markers: google.maps.Marker[];
  detailedPlacesData: any[];
  setDetailedPlacesData: React.Dispatch<React.SetStateAction<any[]>>;
  setSelectedPlace: React.Dispatch<React.SetStateAction<Place | null>>;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setMarkers: React.Dispatch<React.SetStateAction<google.maps.Marker[]>>;
  fetchFavouritePlaces: (
    userId: string,
    setDetailedPlacesData: React.Dispatch<React.SetStateAction<any[]>>
  ) => Promise<void>;
};
