"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactElement,
  type ReactNode,
} from "react";
import { useLocale } from "@/i18n/locale-provider";
import { useDriveIn } from "@/content/schema-ext";
import { FLOOR, HOTLINES, LENTICULAR, PROFILE, type Car } from "@/content/media";
import { LensArray } from "@/components/webgl/lens-array";

/* ---------------------------------------------------------------- motion -- */

function useOnScreen<T extends HTMLElement>(rootMargin = "-5% 0px -5% 0px") {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reveal = () => node.setAttribute("data-seen", "");
    if (typeof IntersectionObserver === "undefined") {
      reveal();
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          reveal();
          io.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [rootMargin]);
  return ref;
}

const delayVar = (d: number) => ({ "--turn-delay": `${d}ms` }) as CSSProperties;

const PHRASING = new Set(["p", "h1", "h2", "h3", "h4", "span", "li", "figcaption", "dt", "dd"]);

/**
 * This site's arrival: the angle. Content starts turned away from the reader
 * on the vertical axis and swings round to face them, hinged on the reading
 * edge — because the whole page turns on what you see from where you stand.
 *
 * `className` goes on the OUTER element: it positions the block and it is what
 * the observer watches. `innerClassName` arranges the children, which live one
 * level down inside the rotated wrapper. Transforming the observed element
 * would move its own intersection rectangle mid-reveal.
 */
function Turn({
  children,
  className,
  innerClassName,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  delay?: number;
  as?: ElementType;
}) {
  const ref = useOnScreen<HTMLElement>();
  const C = Tag as unknown as (p: Record<string, unknown>) => ReactElement;
  const Inner = PHRASING.has(String(Tag)) ? "span" : "div";
  return (
    <C ref={ref} data-turn="" className={className} style={delayVar(delay)}>
      <Inner data-turn-inner="" className={`block h-full ${innerClassName ?? ""}`}>
        {children}
      </Inner>
    </C>
  );
}

/* ------------------------------------------------------------------- mark -- */

/** Their mark, redrawn from the channel letters over their shopfront: three
 *  nested round-capped strokes, a D built out of tyre tracks. */
function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 88 100" className={className} aria-hidden focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round">
        <path d="M12,20 H46 A30,30 0 0 1 46,80 H12" />
        <path d="M24,34 H46 A16,16 0 0 1 46,66 H24" />
        <path d="M34,45 H45 A5,5 0 0 1 45,55 H34" />
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------- nav -- */

export function Nav() {
  const c = useDriveIn();
  const { locale, toggleLocale } = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-night-3 bg-night/92 backdrop-blur-md">
      <div className="mx-auto flex h-[4.2rem] max-w-6xl items-center justify-between px-5 lg:px-8">
        <a href="#top" className="flex shrink-0 items-center gap-2.5" aria-label={c.brand.name}>
          <Mark className="h-6 w-[1.32rem] shrink-0 text-amber" />
          <span className="signmark text-[1rem] text-ice">{c.brand.shortName}</span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {c.nav.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="fine text-steel transition-colors hover:text-beam"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`tel:+201225211119`}
            className="bidi tnum hidden text-[0.86rem] text-steel transition-colors hover:text-beam lg:block"
          >
            {HOTLINES[0]}
          </a>
          <button
            onClick={toggleLocale}
            className="label border border-steel px-2.5 py-1.5 text-ice transition-colors hover:border-beam hover:text-beam"
            aria-label={c.a11y.toggleLanguage}
          >
            {locale === "en" ? "ع" : "EN"}
          </button>
          <button
            className="border border-steel p-2 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? c.a11y.closeMenu : c.a11y.openMenu}
            aria-expanded={open}
          >
            <span className="block h-[1.5px] w-4 bg-ice" />
            <span className="mt-1 block h-[1.5px] w-4 bg-ice" />
          </button>
        </div>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t border-night-3 bg-night px-5 py-3 md:hidden">
          {c.nav.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="py-2 text-[0.92rem] text-steel"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

/* ------------------------------------------------------------------- hero -- */

function Hero() {
  const c = useDriveIn();
  return (
    <section id="top" className="relative pt-[4.2rem]">
      <div className="mx-auto max-w-6xl px-5 pt-10 pb-16 lg:px-8 lg:pt-14 lg:pb-24">
        <Turn as="p" className="label">
          {c.hero.eyebrow}
        </Turn>

        <div className="mt-6 grid items-start gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14">
          <div className="min-w-0">
            <Turn as="h1" className="text-hero sign m-hero text-ice" delay={60}>
              {c.hero.headline}
            </Turn>
            <Turn className="text-lead mt-7 max-w-[50ch] leading-[1.85] text-steel" delay={140}>
              {c.hero.sub}
            </Turn>
            <Turn className="mt-9" innerClassName="flex flex-wrap items-center gap-3" delay={220}>
              <a
                href={`tel:+201225211119`}
                className="bg-amber px-6 py-3 text-[0.9rem] font-medium text-night transition-opacity hover:opacity-85"
              >
                {c.hero.primaryCta}
              </a>
              <a
                href="#floor"
                className="border border-steel px-6 py-3 text-[0.9rem] text-ice transition-colors hover:border-beam hover:text-beam"
              >
                {c.hero.secondaryCta}
              </a>
            </Turn>
          </div>

          {/* min-w-0: the WebGL canvas is a replaced element whose intrinsic
              (drawing-buffer) width becomes this grid item's automatic minimum
              size, which forced the single-column mobile track ~40px past the
              container. minmax(0,…) does the same job for the desktop columns. */}
          <div className="min-w-0">
            <Turn delay={100} className="relative aspect-[4/5] w-full border border-night-3">
              <LensArray
                sources={LENTICULAR.map((l) => l.src)}
                className="h-full w-full"
                alt={c.hero.lensAlt}
                fallback={LENTICULAR[0].src}
              />
            </Turn>
            <p className="fine mt-3 text-steel">
              <span className="label me-2 inline text-beam">{c.hero.lensHint}</span>
              {c.hero.lensCaption}
            </p>
          </div>
        </div>

        <Turn
          className="mt-14 border-t border-night-3 pt-8"
          innerClassName="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4"
          delay={300}
        >
          {c.hero.counts.map((s) => (
            <div key={s.label}>
              <div className="sign tnum text-[2.4rem] text-beam">{s.value}</div>
              <div className="fine mt-2 text-steel">{s.label}</div>
            </div>
          ))}
        </Turn>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ floor -- */

function CarEntry({ car, index }: { car: Car; index: number }) {
  const c = useDriveIn();
  const copy = c.floor.cars[car.id];
  const title = `${car.marque} ${car.model}`;

  return (
    <Turn
      as="article"
      className="border-t border-night-3 pt-10 first:border-t-0 first:pt-0"
      delay={(index % 2) * 60}
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-12">
        <div>
          <div className="label">{String(index + 1).padStart(2, "0")}</div>
          <h3 className="latin signmark mt-2 text-[1.9rem] text-ice">{title}</h3>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="chip chip-loc border border-beam px-2.5 py-1 text-beam">
              {c.floor.newLabel}
            </span>
            <span className="chip chip-loc border border-night-3 px-2.5 py-1 text-steel">
              {c.floor.sourceLabels[car.from]}
            </span>
          </div>
          <p className="mt-5 text-[0.95rem] leading-[1.8] text-steel">
            {c.floor.availableLabel}
          </p>

          {copy.note && (
            <p className="fine mt-5 border-s-2 border-amber ps-4 text-steel">{copy.note}</p>
          )}

          {car.frames.length === 0 && (
            <p className="fine mt-5 border-s-2 border-night-3 ps-4 text-steel">{c.floor.noPhoto}</p>
          )}

          {car.postUrl && (
            <a
              href={car.postUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="fine mt-5 inline-block text-ice underline decoration-ice/40 underline-offset-4 transition-colors hover:text-beam"
            >
              {c.floor.viewPost}
            </a>
          )}
        </div>

        {car.frames.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {car.frames.map((f, i) => (
              <figure key={f.src}>
                <div className="aspect-[4/5] overflow-hidden bg-night-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={f.src}
                    alt={title}
                    className="h-full w-full object-cover"
                    loading={index === 0 && i === 0 ? "eager" : "lazy"}
                  />
                </div>
                <figcaption className="fine mt-2.5 text-steel">
                  {copy.frameCaptions[f.key]}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </Turn>
  );
}

function Floor() {
  const c = useDriveIn();
  return (
    <section id="floor" className="border-t border-night-3 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Turn as="p" className="label">
          {c.floor.eyebrow}
        </Turn>
        <Turn as="h2" className="text-display sign m-head mt-4 text-ice" delay={60}>
          {c.floor.heading}
        </Turn>
        <Turn className="text-lead mt-5 max-w-[62ch] leading-[1.85] text-steel" delay={120}>
          {c.floor.intro}
        </Turn>

        <div className="mt-14 space-y-12">
          {FLOOR.map((car, i) => (
            <CarEntry key={car.id} car={car} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ offer -- */

function Offer() {
  const c = useDriveIn();
  return (
    <section id="offer" className="border-t border-night-3 py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Turn as="p" className="label">
          {c.offer.eyebrow}
        </Turn>
        <Turn as="h2" className="text-display sign m-head mt-4 text-ice" delay={60}>
          {c.offer.heading}
        </Turn>
        <Turn className="text-lead mt-5 max-w-[62ch] leading-[1.85] text-steel" delay={120}>
          {c.offer.intro}
        </Turn>

        <div className="mt-12 divide-y divide-night-3 border-y border-night-3">
          {c.offer.lines.map((line, i) => (
            <Turn key={line.quote} className="py-5" delay={160 + i * 50}>
              <div className="grid gap-2 sm:grid-cols-[1fr_1fr] sm:gap-8">
                <p className="text-[1.02rem] leading-[1.7] text-ice">{line.text}</p>
                <p className="bidi arabic fine text-steel">{line.quote}</p>
              </div>
            </Turn>
          ))}
        </div>

        <Turn className="mt-12" delay={420}>
          <div className="label">{c.offer.hotlinesLabel}</div>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {[...HOTLINES, PROFILE.landline].map((n) => (
              <span
                key={n}
                className="bidi tnum border border-night-3 px-3 py-2 text-[0.95rem] text-ice"
              >
                {n}
              </span>
            ))}
          </div>
          <p className="fine mt-4 max-w-[62ch] text-steel">{c.offer.hotlinesNote}</p>
        </Turn>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- roster -- */

function Roster() {
  const c = useDriveIn();
  const floorMarques = [...new Set(FLOOR.map((car) => car.marque))];
  return (
    <section id="roster" className="border-t border-night-3 py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Turn as="p" className="label">
          {c.roster.eyebrow}
        </Turn>
        <Turn as="h2" className="text-display sign m-head-wide mt-4 text-ice" delay={60}>
          {c.roster.heading}
        </Turn>
        <Turn className="mt-6 max-w-[62ch]" innerClassName="space-y-5" delay={120}>
          {c.roster.body.map((p, i) => (
            <p key={i} className="text-[0.96rem] leading-[1.85] text-steel">
              {p}
            </p>
          ))}
        </Turn>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Turn delay={180}>
            <div className="label">{c.roster.highlightsLabel}</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {PROFILE.highlights.map((h) => (
                <span
                  key={h}
                  className="chip chip-verbatim border border-night-3 px-3 py-1.5 text-steel"
                >
                  {h}
                </span>
              ))}
            </div>
          </Turn>

          <Turn delay={240}>
            <div className="label">{c.roster.floorLabel}</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {floorMarques.map((m) => (
                <span key={m} className="chip border border-beam px-3 py-1.5 text-beam">
                  {m}
                </span>
              ))}
            </div>
          </Turn>

          <Turn delay={300}>
            <div className="label">{c.roster.cardsLabel}</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {PROFILE.cardCars.map((m) => (
                <span key={m} className="chip border border-night-3 px-3 py-1.5 text-steel">
                  {m}
                </span>
              ))}
            </div>
          </Turn>
        </div>

        <Turn as="p" className="fine mt-10 max-w-[70ch] border-s-2 border-amber ps-4 text-steel" delay={360}>
          {c.roster.cardsNote}
        </Turn>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- contact -- */

function Contact() {
  const c = useDriveIn();
  return (
    <section id="contact" className="border-t border-night-3 py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Turn as="h2" className="text-display sign text-ice">
          {c.contact.heading}
        </Turn>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16">
          <Turn delay={60}>
            <div className="label">{c.contact.addressLabel}</div>
            <p className="bidi mt-3 text-[1.02rem] leading-relaxed text-ice">{c.contact.address}</p>
            <p className="fine mt-3 text-steel">{c.contact.addressNote}</p>
            <a
              href={c.contact.mapsUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="fine mt-4 inline-block text-ice underline decoration-ice/40 underline-offset-4 hover:text-beam"
            >
              Google Maps
            </a>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={`tel:+201225211119`}
                className="inline-block bg-amber px-6 py-3 text-[0.9rem] font-medium text-night transition-opacity hover:opacity-85"
              >
                {c.contact.cta}
              </a>
              <a
                href={c.contact.instagramUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="fine text-steel underline decoration-steel/40 underline-offset-4 hover:text-beam"
              >
                <span className="bidi">@{PROFILE.instagramHandle}</span>
              </a>
              <a
                href={c.contact.facebookUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="fine text-steel underline decoration-steel/40 underline-offset-4 hover:text-beam"
              >
                <span className="bidi">{PROFILE.facebookHandle}</span>
              </a>
            </div>
          </Turn>

          <Turn delay={140}>
            <div className="label">{c.contact.phoneLabel}</div>
            <div className="mt-4 divide-y divide-night-3 border-y border-night-3">
              {c.contact.numbers.map((n) => (
                <a
                  key={n.value}
                  href={n.href}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3 transition-colors hover:text-beam"
                >
                  <span className="bidi tnum text-[1.05rem] text-ice">{n.value}</span>
                  <span className="fine text-steel">{n.label}</span>
                </a>
              ))}
            </div>
          </Turn>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- footer -- */

export function Footer() {
  const c = useDriveIn();
  return (
    <footer className="border-t border-night-3 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 sm:flex-row sm:items-start sm:justify-between lg:px-8">
        <div className="flex shrink-0 items-center gap-2.5">
          <Mark className="h-5 w-[1.1rem] shrink-0 text-amber" />
          <span className="signmark text-[0.95rem] text-ice">{c.brand.shortName}</span>
        </div>
        <p className="fine max-w-[58ch] text-steel">{c.footer.disclaimer}</p>
        <p className="fine shrink-0 text-steel">{c.footer.rights}</p>
      </div>
    </footer>
  );
}

/* --------------------------------------------------------------- sections -- */

export function Sections() {
  return (
    <main>
      <Hero />
      <Floor />
      <Offer />
      <Roster />
      <Contact />
    </main>
  );
}
