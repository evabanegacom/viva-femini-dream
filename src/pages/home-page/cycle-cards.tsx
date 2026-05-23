import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CalendarCheck, Loader2 } from "lucide-react";
import { InlineError } from "./shared";

export function CycleHighlight({ tips, cycleDay, isLoading, error, onRetry }: {
  tips: { icon: string; title: string; body: string; note: string; bg: string }[];
  cycleDay: number; isLoading: boolean; error?: Error | null; onRetry?: () => void;
}) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    centerMode: true,
    centerPadding: "150px",
    autoplay: true,
    autoplaySpeed: 3500,
    pauseOnHover: true,
    arrows: false,
    className: "cycle-highlight-slider",
    responsive: [
      {
        breakpoint: 1024,
        settings: { centerPadding: "80px" },
      },
      {
        breakpoint: 768,
        settings: { centerPadding: "50px" },
      },
      {
        breakpoint: 480,
        settings: {
          // Disable centerMode on mobile so no scale overflow
          centerMode: false,
          centerPadding: "0px",
        },
      },
    ],
  };

  return (
    // overflow-hidden on the card clips any bleed from scale transforms
    <div className="bg-white rounded-3xl p-5 md:p-3 shadow-sm border border-border/50 overflow-hidden">
      {/* Header */}
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

      {error ? (
        <InlineError message="Failed to load highlights" onRetry={onRetry} />
      ) : isLoading ? (
        <div className="w-full h-48 rounded-3xl bg-rose-50 animate-pulse" />
      ) : (
        /*
          -mx-5 cancels card padding so the track fills the full card width.
          overflow-hidden on the parent clips anything that bleeds outside.
        */
        <div className="-mx-5 md:-mx-3">
          <Slider {...settings}>
            {tips.map((t, index) => (
              <div key={index} className="px-2 pb-4 pt-1">
                <div
                  style={{ background: t.bg }}
                  className="rounded-3xl p-5 flex flex-col shadow-md"
                >
                  <div className="text-4xl mb-4">{t.icon}</div>
                  <h3 className="font-semibold text-xl mb-3 text-[#0F172A]">
                    {t.title}
                  </h3>
                  <p className="text-[15px] text-[#0F172A] leading-relaxed flex-1">
                    {t.body}
                  </p>
                  <div className="mt-5 bg-white/90 backdrop-blur-sm rounded-3xl p-3.5 text-xs font-medium">
                    💜 {t.note}
                  </div>
                </div>
              </div>
            ))}
          </Slider>

          <style>{`
            /* Inactive slides fade back */
            .cycle-highlight-slider .slick-slide {
              transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1),
                          opacity 0.5s ease;
              opacity: 0.5;
            }

            /* Active (center) slide zooms forward */
            .cycle-highlight-slider .slick-center {
              opacity: 1;
              transform: scale(1.05);
              z-index: 10;
            }

            /*
              Mobile: centerMode is disabled in responsive settings above,
              so no scale transform is applied. Reset everything to avoid
              any leftover transform from wider breakpoints.
            */
            @media (max-width: 480px) {
              .cycle-highlight-slider .slick-slide {
                opacity: 1 !important;
                transform: none !important;
              }
              .cycle-highlight-slider .slick-center {
                transform: none !important;
              }
            }

            /* Dots */
            .cycle-highlight-slider .slick-dots {
              bottom: -2px;
            }
            .cycle-highlight-slider .slick-dots li button:before {
              color: #FB3179;
              opacity: 0.3;
              font-size: 8px;
            }
            .cycle-highlight-slider .slick-dots li.slick-active button:before {
              opacity: 1;
              color: #FB3179;
            }
          `}</style>
        </div>
      )}
    </div>
  );
}