import type { DriveInContent } from "./schema-ext";
import { HOTLINES, PROFILE } from "./media";

export const en: DriveInContent = {
  locale: "en",
  dir: "ltr",

  brand: {
    name: "Drive In Motors",
    shortName: "Drive In Motors",
    tagline: "Drive your dream",
  },

  nav: [
    { label: "The floor", href: "#floor" },
    { label: "The offer", href: "#offer" },
    { label: "The roster", href: "#roster" },
    { label: "Visit", href: "#contact" },
  ],

  hero: {
    eyebrow: "Nasr City · Cairo",
    headline: "Everything on this floor is new",
    sub: "Four cars, every one of them a 2026 model, every one of them described as available now in our showroom. Three are marques that barely existed in Egypt five years ago — Jetour, Kaiyi, Changan — and all three were photographed at the kerb outside their own sign, two of them after dark with the lamps lit. There is no used stock here and no mileage anywhere in the account.",
    primaryCta: "Call a hotline",
    secondaryCta: "See the floor",
    lensAlt:
      "A lens array showing three of their cars in the same place: which one you see depends on the angle you look from, exactly as a lenticular print behaves.",
    lensCaption:
      "Three of their photographs, made from nearly the same spot on their own kerb, interleaved under one array of cylindrical lenses. The strips are refracted per pixel rather than cross-faded, so the picture changes with the angle you are looking from — including the colour fringing a real lenticular gives you at the switch.",
    lensHint: "Move across it, or drag",
    counts: [
      { value: PROFILE.igPosts, label: "posts on Instagram" },
      { value: "6", label: "render logged out" },
      { value: PROFILE.igFollowing, label: "accounts they follow" },
      { value: PROFILE.fbFollowers, label: "followers on Facebook" },
    ],
  },

  about: { heading: "Drive In Motors", body: [] },
  services: { heading: "The floor", items: [] },
  gallery: { heading: "The floor", items: [] },

  floor: {
    eyebrow: "The floor",
    heading: "Four listings, one sentence between them",
    intro:
      "Every listing they publish says the same thing: the model, Model 2026, available now in our showroom. No price, no mileage, no trim. What follows is the model line and the photographs, and nothing has been added to either.",
    viewPost: "Open the post",
    newLabel: "Model 2026",
    availableLabel: "Available now in our showroom",
    noPhoto:
      "Published on Facebook in the identical template, as a video. No still frame was sourced, so this listing is carried without a photograph rather than illustrated with a press render that is not theirs.",
    sourceLabels: { instagram: "Instagram", facebook: "Facebook" },
    cars: {
      jetour: {
        frameCaptions: {
          front: "At the kerb in daylight, under their own fascia. The plate holder carries the first hotline.",
          wheel: "One wheel, close — the only detail frame in the listing.",
        },
        note: "The only one of the three shot in daylight, and the only frame in the account that shows the street the showroom is on.",
      },
      changan: {
        frameCaptions: {
          front: "After dark, with the sign and the LED ribbon under it doing all the lighting.",
          door: "The door card, lit by the interior lamp alone.",
        },
      },
      kaiyi: {
        frameCaptions: {
          front: "The same stretch of kerb, the same hour, a different car.",
          lamp: "The headlamp, close enough to read the signature.",
        },
      },
      octavia: { frameCaptions: {} },
    },
  },

  offer: {
    eyebrow: "The offer",
    heading: "One offer, attached to every car",
    intro:
      "The caption template does not change between listings. These are its lines, in the order they appear, in the language each was published in.",
    lines: [
      { text: "Available now in our showroom.", quote: "available now in our showroom" },
      { text: "Drive your dream.", quote: "Drive your Dream ⚜️" },
      { text: "We will contact you shortly.", quote: "وسيتم التواصل معك في اقرب وقت" },
      {
        text: "You can trade your old car in for a new one.",
        quote: "متاح إستبدال عربيتك القديمة بـ عربية جديدة",
      },
      {
        text: "Administrative fees free, insurance free — on the older offer cards.",
        quote: "مصروفات اداريه هديه و تامين هديه",
      },
    ],
    hotlinesLabel: "Three hotlines and a landline, on every caption",
    hotlinesNote:
      "A fifth number is published in both account bios and appears in none of the captions. All five reach the same showroom.",
  },

  roster: {
    eyebrow: "The roster",
    heading: "The marques they advertise and the marques on the floor are different lists",
    body: [
      "Their Instagram story highlights are a marque index, and it names four: mercides, Jeep, Renault, MG — spelled the way their own account spells them. Not one of those four appears in anything that renders logged out.",
      "What does appear is Jetour, Changan, Kaiyi and a Škoda: three Chinese marques and one Czech one, all 2026. A Soueast sits parked behind the Jetour in their own daylight frame, making a fifth marque nobody has posted about.",
    ],
    highlightsLabel: "In the highlights",
    floorLabel: "On the floor",
    cardsLabel: "In the older offer cards",
    cardsNote:
      "Their earlier posts are offer cards rather than photographs: a manufacturer press render of a car dropped onto the same backdrop every time — the same concrete arch, the same sky, the same trees behind six different cars. Those images are named here and not reproduced, because they are neither their photographs nor a picture of their showroom.",
  },

  contact: {
    heading: "Visit",
    addressLabel: "Address",
    address: "6 Negaty Serag Street, Nasr City, next to El Serag Mall, Cairo",
    addressNote:
      "The same address in both accounts — written out in Arabic on Facebook, and transliterated into English in the Instagram bio.",
    phoneLabel: "Phone",
    phones: [...HOTLINES, PROFILE.landline, PROFILE.bioPhone],
    numbers: [
      { value: HOTLINES[0], label: "Hotline — in every caption", href: "tel:+201225211119" },
      { value: HOTLINES[1], label: "Hotline — in every caption", href: "tel:+201202744484" },
      { value: HOTLINES[2], label: "Hotline — in every caption", href: "tel:+201201319994" },
      { value: PROFILE.landline, label: "Landline — in every caption", href: PROFILE.landlineHref },
      { value: PROFILE.bioPhone, label: "In both bios, in no caption", href: PROFILE.bioPhoneHref },
    ],
    mapsUrl: PROFILE.maps,
    instagramUrl: PROFILE.instagram,
    facebookUrl: PROFILE.facebook,
    cta: "Call a hotline",
  },

  footer: {
    disclaimer:
      "A concept design, built as a demonstration. Not an official Drive In Motors site and not affiliated with them. All photography, marks and quoted copy belong to Drive In Motors; captions are quoted as published.",
    rights: "Concept by Claude",
  },

  a11y: {
    toggleLanguage: "التبديل إلى العربية",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
};
