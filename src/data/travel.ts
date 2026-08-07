import cali from "@/assets/travel/cali.jpg";
import canada from "@/assets/travel/canada.jpeg";
import coex from "@/assets/travel/coex.png";
import hotram from "@/assets/travel/meliahotram.png";
import gangnam from "@/assets/travel/gangnam.png";
import hochiminh from "@/assets/travel/hochiminh.jpg";
import japan from "@/assets/travel/japan.png";
import kyoto from "@/assets/travel/kyoto.jpg";
import liberty from "@/assets/travel/liberty.png";
import mirage from "@/assets/travel/mirage.png";
import osaka from "@/assets/travel/osaka.jpg";
import pier from "@/assets/travel/pier.png";
import punta from "@/assets/travel/punta.jpg";
import sandiego from "@/assets/travel/sandiego.png";
import santamonica from "@/assets/travel/santamonica.jpg";
import seoul from "@/assets/travel/seoul.jpg";
import taipei101 from "@/assets/travel/taipei101.png";
import taiwan from "@/assets/travel/taiwan.jpg";

export type TravelPhoto = {
  place: string;
  src: string;
  fit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  position?: string;
};

export type TravelDestination = {
  id: string;
  label: string;
  country: string;
  coordinates: { lat: number; lng: number };
  pinOffset?: { x: number; y: number };
  photos: TravelPhoto[];
};

export const travelDestinations: TravelDestination[] = [
  {
    id: "california",
    label: "California",
    country: "United States",
    coordinates: { lat: 36.78, lng: -119.42 },
    photos: [
      { place: "San Diego, California", src: cali },
      { place: "La Jolla, San Diego", src: sandiego },
      { place: "Santa Monica Pier, California", src: santamonica },
    ],
  },
  {
    id: "new-york-city",
    label: "New York City",
    country: "United States",
    coordinates: { lat: 40.71, lng: -74.01 },
    pinOffset: { x: 4, y: -4 },
    photos: [
      { place: "Statue of Liberty, New York", src: liberty },
      { place: "New York City waterfront", src: pier },
    ],
  },
  {
    id: "canada",
    label: "Canada",
    country: "Canada",
    coordinates: { lat: 46.8121, lng: -71.2061 },
    pinOffset: { x: 22, y: -20 },
    photos: [
      {
        place: "Édifice Gérard-D.-Levesque, Québec City",
        src: canada,
        fit: "cover",
        position: "center 22%",
      },
    ],
  },
  {
    id: "dominican-republic",
    label: "Dominican Republic",
    country: "Dominican Republic",
    coordinates: { lat: 18.74, lng: -70.16 },
    photos: [
      { place: "Punta Cana, Dominican Republic", src: punta },
      { place: "Majestic Mirage Resort, Punta Cana", src: mirage },
    ],
  },
  {
    id: "vietnam",
    label: "Vietnam",
    country: "Vietnam",
    coordinates: { lat: 14.06, lng: 108.28 },
    photos: [
      { place: "Ho Chi Minh City, Vietnam", src: hochiminh },
      { place: "Melia Ho Tram Beach Resort, Vietnam", src: hotram },
    ],
  },
  {
    id: "south-korea",
    label: "South Korea",
    country: "South Korea",
    coordinates: { lat: 35.91, lng: 127.77 },
    pinOffset: { x: -4, y: -5 },
    photos: [
      { place: "Seoul, South Korea", src: seoul },
      { place: "Starfield Library, Seoul", src: coex },
      { place: "Gangnam, Seoul", src: gangnam },
    ],
  },
  {
    id: "japan",
    label: "Japan",
    country: "Japan",
    coordinates: { lat: 36.2, lng: 138.25 },
    pinOffset: { x: 8, y: -5 },
    photos: [
      { place: "Kyoto, Japan", src: kyoto },
      { place: "Osaka, Japan", src: osaka },
      { place: "Namba Yasaka Shrine, Osaka", src: japan },
    ],
  },
  {
    id: "taiwan",
    label: "Taiwan",
    country: "Taiwan",
    coordinates: { lat: 23.7, lng: 120.96 },
    pinOffset: { x: -2, y: 8 },
    photos: [
      { place: "Jiufen, Taiwan", src: taiwan },
      { place: "Taipei 101, Taiwan", src: taipei101 },
    ],
  },
];

export const travelWishlist = ["Switzerland", "France", "Czech Republic"];
