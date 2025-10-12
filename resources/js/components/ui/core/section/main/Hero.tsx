"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { Link } from "@inertiajs/react";
import { buttonVariants } from "@/components/ui/fragments/shadcn-ui/button";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/fragments/shadcn-ui/spinner";
import LogoCloudDemoPage from "@/components/ui/fragments/animate-ui/marquee-brands";

interface SectionData {
  text: string;
  img: string;
}

interface AnimatedSectionsProps {
  sections?: SectionData[];
  className?: string;
  headerTitle?: string;
  autoplay?: boolean;
  delay?: number; // ms
  pauseOnHover?: boolean;
}

interface SectionData {
  text: string;
  img: string;
  description?: string;
}

const defaultSections: SectionData[] = [
  {
    // Fashion / New arrivals
    text: "NEW SUMMER COLLECTION",
    img:
      "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=1600&q=80",
    description:
      "Discover lightweight silhouettes and bright prints — crafted for comfort and style. Shop new arrivals and get ready for sunny days.",
  },
  {
    // Big sale / discount
    text: "SUMMER SALE — UP TO 50% OFF",
    img:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1600&q=80",
    description:
      "Limited time: grab bestsellers at half price. Stocks are limited — add favourites to cart before they disappear.",
  },
  {
    // Free shipping / logistics
    text: "FREE SHIPPING OVER Rp200.000",
    img:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1600&q=80",
    description:
      "Enjoy fast & free delivery on orders above Rp200.000. Track your package easily and get it delivered safely to your door.",
  },
  {
    // Sustainable / organic / brand story
    text: "SUSTAINABLE & ORGANIC PRODUCTS",
    img:
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1600&q=80",
    description:
      "Shop responsibly — sourced from eco-friendly materials and ethical producers. Quality you can trust, impact you can feel.",
  },
];

const Hero: React.FC<AnimatedSectionsProps> = ({
  sections = defaultSections,
  className = "",
  autoplay = true,
  delay = 3000,
  pauseOnHover = true,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const splitHeadingsRef = useRef<SplitText[]>([]);
  const currentIndexRef = useRef<number>(-1);
  const animatingRef = useRef<boolean>(false);
  const sectionsRefs = useRef<HTMLElement[]>([]);
  const imagesRefs = useRef<HTMLDivElement[]>([]);
  const outerRefs = useRef<HTMLDivElement[]>([]);
  const innerRefs = useRef<HTMLDivElement[]>([]);
  const headingRefs = useRef<HTMLHeadingElement[]>([]);
  const counterCurrentRef = useRef<HTMLSpanElement | null>(null);
  const counterNextRef = useRef<HTMLSpanElement | null>(null);
  const counterCurrentSplitRef = useRef<SplitText | null>(null);
  const counterNextSplitRef = useRef<SplitText | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pausedRef = useRef<boolean>(false);

  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // preload images
  useEffect(() => {
    let mounted = true;
    let loaded = 0;
    sections.forEach((section) => {
      const img = new Image();
      img.src = section.img;
      img.onload = () => {
        loaded++;
        if (mounted && loaded === sections.length) setImagesLoaded(true);
      };
      img.onerror = () => {
        loaded++;
        if (mounted && loaded === sections.length) setImagesLoaded(true);
      };
    });
    return () => {
      mounted = false;
    };
  }, [sections]);

  // gotoSection: handle the animation between slides
  const gotoSection = useCallback((index: number, direction: number) => {
    if (!containerRef.current || animatingRef.current) return;

    const sectionsElements = sectionsRefs.current as Element[];
    const images = imagesRefs.current as Element[];
    const outerWrappers = outerRefs.current as Element[];
    const innerWrappers = innerRefs.current as Element[];

    const wrap = gsap.utils.wrap(0, sectionsElements.length);
    index = wrap(index);
    animatingRef.current = true;

    const fromTop = direction === -1;
    const dFactor = fromTop ? -1 : 1;

    const tl = gsap.timeline({
      defaults: { duration: 1.25, ease: "power1.inOut" },
      onComplete: () => {
        animatingRef.current = false;
      },
    });

    timelineRef.current = tl;

    if (currentIndexRef.current >= 0) {
      gsap.set(sectionsElements[currentIndexRef.current], { zIndex: 0 });
      tl.to(images[currentIndexRef.current], { xPercent: -15 * dFactor }).set(
        sectionsElements[currentIndexRef.current],
        { autoAlpha: 0 }
      );
    }

    gsap.set(sectionsElements[index], { autoAlpha: 1, zIndex: 1 });

    tl.fromTo(
      [outerWrappers[index], innerWrappers[index]],
      {
        xPercent: (i: number) => (i ? -100 * dFactor : 100 * dFactor),
      },
      { xPercent: 0 },
      0
    ).fromTo(images[index], { xPercent: 15 * dFactor }, { xPercent: 0 }, 0);

    if (splitHeadingsRef.current[index] && splitHeadingsRef.current[index].lines) {
      const lines = splitHeadingsRef.current[index].lines;
      gsap.set(lines, { opacity: 0, yPercent: 100 });
      tl.to(
        lines,
        {
          opacity: 1,
          yPercent: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: { each: 0.1, from: "start" },
        },
        0.4
      );
    }

    // counter animation
    if (counterCurrentRef.current && counterNextRef.current) {
      if (!counterCurrentSplitRef.current) {
        counterCurrentSplitRef.current = new SplitText(counterCurrentRef.current, {
          type: "lines",
          linesClass: "line",
          mask: "lines",
        });
      }

      counterNextRef.current.textContent = String(index + 1);
      gsap.set(counterNextRef.current, { opacity: 1 });

      if (counterNextSplitRef.current) {
        counterNextSplitRef.current.revert();
        counterNextSplitRef.current = null;
      }
      counterNextSplitRef.current = new SplitText(counterNextRef.current, {
        type: "lines",
        linesClass: "line",
        mask: "lines",
      });

      const currentLines = counterCurrentSplitRef.current?.lines || [];
      const nextLines = counterNextSplitRef.current?.lines || [];

      gsap.set(currentLines, { opacity: 1, yPercent: 0 });
      gsap.set(nextLines, { opacity: 1, yPercent: 100 * dFactor });

      tl.to(
        currentLines,
        {
          yPercent: -100 * dFactor,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          stagger: { each: 0.1, from: "start" },
        },
        0.4
      );
      tl.to(
        nextLines,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          stagger: { each: 0.1, from: "start" },
        },
        0.4
      ).add(() => {
        if (counterCurrentSplitRef.current) {
          counterCurrentSplitRef.current.revert();
          counterCurrentSplitRef.current = null;
        }
        if (counterNextSplitRef.current) {
          counterNextSplitRef.current.revert();
          counterNextSplitRef.current = null;
        }
        if (counterCurrentRef.current && counterNextRef.current) {
          counterCurrentRef.current.textContent = counterNextRef.current.textContent;
        }
        gsap.set(counterNextRef.current, { opacity: 0, clearProps: "all" });
      });
    }

    currentIndexRef.current = index;
    setCurrentIndex(index);
  }, []);

  // autoplay controls
  const startAuto = useCallback(() => {
    if (!autoplay) return;
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      if (pausedRef.current || animatingRef.current) return;
      gotoSection(currentIndexRef.current + 1, 1);
    }, delay);
  }, [autoplay, delay, gotoSection]);

  const stopAuto = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // initialize GSAP and split text, and set up autoplay when images loaded
  useGSAP(
    () => {
      if (!containerRef.current || !imagesLoaded) return;

      gsap.registerPlugin(SplitText);

      const headings = headingRefs.current as HTMLElement[];
      const outerWrappers = outerRefs.current as Element[];
      const innerWrappers = innerRefs.current as Element[];

      splitHeadingsRef.current = headings.map(
        (heading) =>
          new SplitText(heading, {
            type: "lines",
            linesClass: "line",
            mask: "lines",
          })
      );

      gsap.set(outerWrappers, { xPercent: 100 });
      gsap.set(innerWrappers, { xPercent: -100 });

      // show first slide
      gotoSection(0, 1);

      // start autoplay after initial display
      startAuto();

      return () => {
        // cleanup handled in outer cleanup useEffect below
      };
    },
    { scope: containerRef, dependencies: [sections.length, imagesLoaded] }
  );

  // cleanup on unmount
  useEffect(() => {
    return () => {
      stopAuto();
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
      splitHeadingsRef.current.forEach((split) => {
        if (split && typeof split.revert === "function") split.revert();
      });
      splitHeadingsRef.current = [];
      if (counterCurrentSplitRef.current && typeof counterCurrentSplitRef.current.revert === "function") {
        counterCurrentSplitRef.current.revert();
        counterCurrentSplitRef.current = null;
      }
      if (counterNextSplitRef.current && typeof counterNextSplitRef.current.revert === "function") {
        counterNextSplitRef.current.revert();
        counterNextSplitRef.current = null;
      }
    };
  }, [stopAuto]);

  // pause/resume handlers for hover & touch (useful for mobile)
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !pauseOnHover) return;

    const onEnter = () => {
      pausedRef.current = true;
      stopAuto();
    };
    const onLeave = () => {
      pausedRef.current = false;
      startAuto();
    };
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("touchstart", onEnter, { passive: true });
    el.addEventListener("touchend", onLeave, { passive: true });

    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("touchstart", onEnter);
      el.removeEventListener("touchend", onLeave);
    };
  }, [pauseOnHover, startAuto, stopAuto]);

  return (
    <section className="w-full px-4 lg:min-h-dvh flex flex-col content-start relative items-center rounded-lg">
      <div className="rounded-t-2xl relative w-full flex content-center items-end bg-secondary overflow-hidden">
        <div className="rounded-b-2xl relative w-full h-[40svh] md:h-[85lvh] flex content-center items-end bg-secondary overflow-hidden">
          <div className="absolute right-1/2 left-1/2 transform -translate-1/2 top-1/2 bottom-1/2">
            {!imagesLoaded ? <Spinner className="size-12 text-primary" /> : null}
          </div>

          <div
            ref={containerRef}
            className={`h-full w-full overflow-hidden text-white ${className}`}
          >
            {/* Thumbnails & counter (sr-only / small preview) */}
            <div className="sr-only absolute bottom-4 sm:left-1/4 md:left-1/5 left-1/3 lg:right-6 z-30 flex flex-col md:flex-row items-center gap-4">
              <div className="flex gap-2">
                {sections.map((section, i) => (
                  <div
                    key={`thumb-${i}`}
                    className="w-12 h-8 rounded overflow-hidden relative cursor-pointer transition-transform duration-300"
                    onClick={() => {
                      if (currentIndex !== i && !animatingRef.current) {
                        const direction = i > currentIndex ? 1 : -1;
                        gotoSection(i, direction);
                      }
                    }}
                  >
                    <img src={section.img} alt={`Section ${i + 1}`} className="w-full h-full object-cover" />
                    <div
                      className={`absolute inset-0 bg-black transition-opacity duration-1000 ease-in-out ${
                        currentIndex !== i ? "opacity-50" : "opacity-0"
                      }`}
                    />
                  </div>
                ))}
              </div>

              <div className="text-xs md:text-sm tracking-wider flex items-center gap-1">
                <div className="relative overflow-hidden h-[1em] leading-[1em] min-w-[0.8em]">
                  <span ref={counterCurrentRef} className="block">
                    1
                  </span>
                  <span ref={counterNextRef} className="block absolute left-0 top-0 opacity-0">
                    2
                  </span>
                </div>
                <span className="opacity-70">/ {sections.length}</span>
              </div>
            </div>

            {sections.map((section, i) => (
              <section
                key={`section-${i}`}
                className="absolute top-0 right-0 h-full w-full invisible"
                ref={(el) => {
                  if (el) sectionsRefs.current[i] = el;
                }}
              >
                <div
                  className="outer w-full h-full overflow-hidden"
                  ref={(el) => {
                    if (el) outerRefs.current[i] = el;
                  }}
                >
                  <div
                    className="inner w-full h-full overflow-hidden"
                    ref={(el) => {
                      if (el) innerRefs.current[i] = el;
                    }}
                  >
                    <div
                      className="bg flex items-center px-10 md:px-10 lg:px-20 absolute top-0 h-full w-full bg-cover bg-center"
                      ref={(el) => {
                        if (el) imagesRefs.current[i] = el;
                      }}
                      style={{
                        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.8) 100%), url("${section.img}")`,
                      }}
                    >
                      <header className="max-w-xs w-full m-auto md:max-w-xl text-center flex flex-col gap-y-1.5 md:gap-y-5">
                        <h2
                          className="section-heading text-3xl md:text-6xl line-clamp-2 uppercase text-white font-extrabold  leading-none z-10"
                          ref={(el) => {
                            if (el) headingRefs.current[i] = el;
                          }}
                        >
                          {section.text}
                        </h2>
                        <p className="text-accent/70 sr-only md:sr-only line-clamp-2 text-[1.8svh] md:text-lg">
                          {section.description}
                        </p>

                        <div className="mt-3 md:mt-6 w-fit m-auto gap-2 md:gap-4 flex items-center">
                          <Link href={"/products"} className={cn(buttonVariants({ variant: "default" }), "font-bold uppercase m-auto text-xs md:text-sm w-fit md:py-6 md:px-8")}>
                            Order Now
                          </Link>
                          <Link href={"/products"} className={cn(buttonVariants({ variant: "secondary" }), "font-bold uppercase m-auto text-xs md:text-sm w-fit md:py-6 md:px-8")}>
                            Make Shop
                          </Link>
                        </div>
                      </header>
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-5 py-2 md:py-7 bg-secondary rounded-b-2xl w-full">
        <div className="overflow-x-hidden max-w-6xl m-auto w-full">
          <LogoCloudDemoPage />
        </div>
      </div>
    </section>
  );
};

export default Hero;
