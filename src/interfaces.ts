export interface User {
  id: string;
  name: string;
}

export type AppContext = {
  map: google.maps.Map | null;
  isLoggedIn: boolean;
  user: User | null;
};
