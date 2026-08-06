import cali from "@/assets/travel/cali.jpg";
import hochiminh from "@/assets/travel/hochiminh.jpg";
import kyoto from "@/assets/travel/kyoto.jpg";
import osaka from "@/assets/travel/osaka.jpg";
import punta from "@/assets/travel/punta.jpg";
import seoul from "@/assets/travel/seoul.jpg";
import taiwan from "@/assets/travel/taiwan.jpg";

export type TravelPhoto = {
  place: string;
  src?: string;
};

// Best-guess place names from the filenames — adjust freely.
export const travelPhotos: TravelPhoto[] = [
  { place: "San Diego, California", src: cali },
  { place: "Ho Chi Minh City, Vietnam", src: hochiminh },
  { place: "Kyoto, Japan", src: kyoto },
  { place: "Osaka, Japan", src: osaka },
  { place: "Punta Cana, Dominican Republic", src: punta },
  { place: "Seoul, South Korea", src: seoul },
  { place: "Jiufen, Taiwan", src: taiwan },
];
