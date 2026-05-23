import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CalendarCheck, Loader2 } from "lucide-react";
import { InlineError } from "./shared";
import { useState, useEffect } from "react";

export function CycleHighlight({ tips, cycleDay, isLoading, error, onRetry }: {
  tips: { icon: string; title: string; body: string; note: string; bg: string }[];
  cycleDay: number; isLoading: boolean; error?: Error | null; onRetry?: () => void;
}) {
  const [sliderKey, setSliderKey] = useState(0);
  const [width, setWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      setWidth(window.innerWidth);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setSliderKey(k => k + 1);
      }, 150);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeout);
    };
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    centerMode: true,
    centerPadding:
  width <= 480
    ? "55px"
    : width <= 768
    ? "80px"
    : "150px",
    autoplay: true,
    autoplaySpeed: 3500,
    pauseOnHover: true,
    arrows: false,
    className: "cycle-highlight-slider",
    responsive: [
      { breakpoint: 1024, settings: { centerPadding: "80px" } },
      { breakpoint: 768, settings: { centerPadding: "50px" } },
      { breakpoint: 480, settings: { centerPadding: "20px" } },
    ],
  };

  return (
    <div className="bg-white rounded-3xl p-5 md:p-3 shadow-sm border border-border/50">
      <Header cycleDay={cycleDay} isLoading={isLoading} />

      {error ? (
        <InlineError message="Failed to load highlights" onRetry={onRetry} />
      ) : isLoading ? (
        <div className="w-full h-80 rounded-3xl bg-rose-50 animate-pulse" />
      ) : (
<div className="-mx-5 md:-mx-3 relative mt-14" style={{ overflowX: 'clip' }}>
              {/* This wrapper gives the slider its own stacking context */}
          <div className="relative z-10">
            <Slider key={sliderKey} {...settings}>
              {tips.map((t, i) => (
                <div key={i} className="px-2 pb-6">
                  <Card t={t} />
                </div>
              ))}
            </Slider>
          </div>

          <style>{`
            .cycle-highlight-slider .slick-slide {
              transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
              z-index: 5;
              opacity: 0.65;
            }

            .cycle-highlight-slider {
  overflow: visible !important;
}

.cycle-highlight-slider .slick-list,
.cycle-highlight-slider .slick-track {
  overflow: visible !important;
}

            .cycle-highlight-slider .slick-center {
              opacity: 1;
              z-index: 50 !important;           /* Much higher z-index */
              transform: scale(1.08) translateY(-12px) !important;
            }

            /* Mobile - Stronger lift */
            @media (max-width: 480px) {
              .cycle-highlight-slider .slick-center {
                transform: scale(1.12) translateY(-22px) !important;
                z-index: 50 !important;
              }
            }

            /* Ensure slider track & list also respect high z-index */
            .cycle-highlight-slider .slick-list,
            .cycle-highlight-slider .slick-track {
              z-index: 10;
            }

            .cycle-highlight-slider .slick-dots {
              bottom: -4px;
              z-index: 20;
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

function Header({ cycleDay, isLoading }: { cycleDay: number; isLoading: boolean }) {
  return (
    <div className="flex items-center text-center flex-col justify-center gap-2 mb-6">
      <div>
        <h2 className="font-bold text-xl text-[#FB3179]">Cycle Highlight</h2>
        <p className="text-sm text-[#0F172A] text-center">
          Understand your cycle and take care during peak days
        </p>
      </div>
      <span className="text-xs px-3 py-1.5 rounded-full bg-[#FFABC938] text-[#FB3179] font-bold">
        {isLoading ? (
          <span className="flex items-center gap-1">
            <Loader2 className="size-3 animate-spin" /> Loading...
          </span>
        ) : (
          <div className="flex items-center gap-1">
            <CalendarCheck className="size-3 text-[#FB3179]" />
            <span>Day {cycleDay}</span>
          </div>
        )}
      </span>
    </div>
  );
}

function Card({ t }: { t: { icon: string; title: string; body: string; note: string; bg: string } }) {
  return (
    <div 
      style={{ background: t.bg }} 
      className="mx-auto w-full max-w-[360px] rounded p-5 flex flex-col shadow-md"
    >
      <div className="text-4xl mb-4">{t.icon}</div>
      <h3 className="font-semibold text-xl mb-3 text-[#0F172A]">{t.title}</h3>
      <p className="text-[15px] text-[#0F172A] leading-relaxed flex-1">{t.body}</p>
      <div className="mt-5 bg-white/90 backdrop-blur-sm rounded-3xl p-3.5 text-xs font-medium">
        💜 {t.note}
      </div>
    </div>
  );
}