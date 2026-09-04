import type { SiteContent } from "@/i18n/schema";
import { useContent } from "@/i18n/locale-provider";
import type { CarId } from "./media";

export type CarCopy = {
  frameCaptions: Record<string, string>;
  note?: string;
};

/** One line of the offer template, with the dealer's own words kept intact. */
export type OfferLine = {
  /** The claim, in this locale. */
  text: string;
  /** Their own wording, in the language they published it in. */
  quote: string;
};

/**
 * Every one of their listings carries the identical caption with the model
 * swapped, so the shared schema's per-item copy is nearly empty and the
 * interesting content sits in one offer block, one roster comparison, and a
 * contact section that has to say which of five numbers is published where.
 */
export type DriveInContent = SiteContent & {
  hero: SiteContent["hero"] & {
    lensAlt: string;
    lensCaption: string;
    lensHint: string;
    counts: { value: string; label: string }[];
  };
  floor: {
    eyebrow: string;
    heading: string;
    intro: string;
    viewPost: string;
    newLabel: string;
    availableLabel: string;
    noPhoto: string;
    sourceLabels: { instagram: string; facebook: string };
    cars: Record<CarId, CarCopy>;
  };
  offer: {
    eyebrow: string;
    heading: string;
    intro: string;
    lines: OfferLine[];
    hotlinesLabel: string;
    hotlinesNote: string;
  };
  roster: {
    eyebrow: string;
    heading: string;
    body: string[];
    highlightsLabel: string;
    floorLabel: string;
    cardsLabel: string;
    cardsNote: string;
  };
  contact: SiteContent["contact"] & {
    numbers: { value: string; label: string; href: string }[];
    addressNote: string;
  };
};

export function useDriveIn() {
  return useContent() as DriveInContent;
}
