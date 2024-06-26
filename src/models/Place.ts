export interface Place {
  id: string;
  name: string;
  vicinity: string;
  rating?: number;
  effectiveRating: number;
  opening_hours?: {
    isOpen: () => boolean;
    weekday_text?: string[] | undefined;
  };
  photos?: {
    height: number;
    width: number;
    photo_reference: string;
    html_attributions: string[];
  }[];
  type: string;
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
}
