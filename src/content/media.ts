/**
 * Drive In Motors sell brand-new cars, which makes them the first dealer in
 * this series whose entire floor is current-model-year stock rather than used
 * imports — and three of the four marques on it (Jetour, Kaiyi, Changan)
 * barely existed in Egypt five years ago.
 *
 * Six Instagram posts render logged out. Three carry captions and real
 * photographs made at the kerb outside their own sign; three are older offer
 * cards with no caption at all. Facebook — where they have twenty times the
 * following — carries a fourth listing in the identical template.
 *
 * Every caption is the same template with the model swapped, which is why the
 * offer is a section of its own rather than a line under each car.
 */

export type CarId = "jetour" | "changan" | "kaiyi" | "octavia";

export type Frame = { src: string; key: string };

export type Car = {
  id: CarId;
  marque: string;
  model: string;
  /** Every listing says "Model 2026". */
  year: string;
  /** Where the listing was published. */
  from: "instagram" | "facebook";
  frames: Frame[];
  postUrl?: string;
};

const post = (code: string) => `https://www.instagram.com/p/${code}/`;

export const FLOOR: Car[] = [
  {
    id: "jetour",
    marque: "Jetour",
    model: "X70 Plus",
    year: "2026",
    from: "instagram",
    postUrl: post("DX4N9BiDzOm"),
    frames: [
      { src: "/media/jetour-front.jpg", key: "front" },
      { src: "/media/jetour-wheel.jpg", key: "wheel" },
    ],
  },
  {
    id: "changan",
    marque: "Changan",
    model: "Eado Plus",
    year: "2026",
    from: "instagram",
    postUrl: post("DXZOmh9jEF4"),
    frames: [
      { src: "/media/changan-front.jpg", key: "front" },
      { src: "/media/changan-door.jpg", key: "door" },
    ],
  },
  {
    id: "kaiyi",
    marque: "Kaiyi",
    model: "3 Pro",
    year: "2026",
    from: "instagram",
    postUrl: post("DXg7BrLDNOM"),
    frames: [
      { src: "/media/kaiyi-front.jpg", key: "front" },
      { src: "/media/kaiyi-lamp.jpg", key: "lamp" },
    ],
  },
  {
    // Published on Facebook in the same template, as a video. No still frame
    // was sourced, so the listing is carried without a photograph rather than
    // illustrated with somebody else's press render.
    id: "octavia",
    marque: "Škoda",
    model: "Octavia",
    year: "2026",
    from: "facebook",
    frames: [],
  },
];

/** The three frames the hero lens array interleaves. All three were made from
 *  nearly the same spot on their own kerb, which is what lets one surface hold
 *  all of them. */
export const LENTICULAR = [
  { src: "/media/lent-1.jpg", id: "jetour" as CarId },
  { src: "/media/lent-2.jpg", id: "changan" as CarId },
  { src: "/media/lent-3.jpg", id: "kaiyi" as CarId },
];

/** Every caption carries all four of these, in this order, above the address. */
export const HOTLINES = ["012 252 11119", "012 027 44484", "012 013 19994"] as const;

export const PROFILE = {
  instagram: "https://www.instagram.com/drivein.motors/",
  instagramHandle: "drivein.motors",
  facebook: "https://www.facebook.com/DriveInMotors1/",
  facebookHandle: "DriveInMotors1",
  maps: "https://maps.app.goo.gl/4sB41X4f43QK4AFa8",
  /** In every caption, under the three hotlines. */
  landline: "02 22751769",
  landlineHref: "tel:+20222751769",
  /** In both bios, and in neither caption. */
  bioPhone: "010 09339084",
  bioPhoneHref: "tel:+201009339084",
  igFollowers: "3,550",
  igFollowing: "0",
  igPosts: "162",
  fbFollowers: "76K",
  /** Story highlights, spelled exactly as their account spells them. */
  highlights: ["mercides", "Jeep", "Renault", "MG"],
  /** The six cars in the older offer cards — press renders, one shared
   *  backdrop, no caption on any of them. Named, never reproduced. */
  cardCars: [
    "Suzuki Swift",
    "Suzuki Dzire",
    "Kia Sportage",
    "Volkswagen Tiguan",
    "Nissan Sunny",
    "Chery Tiggo",
  ],
} as const;
