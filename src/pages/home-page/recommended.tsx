import { MoveRight } from "lucide-react";

export function Recommended({ narrative, isLoading }: { narrative: string; isLoading: boolean }) {
  const ARTICLES = [
    {
      title: "5 Ways to Reduce Stress During Your Cycle",
      img: "https://images.unsplash.com/photo-1499728603263-13726abce5fd?w=400&q=70",
    },
    {
      title: "Best Nutrition Tips for Better Energy",
      img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=70",
    },
    {
      title: "How Sleep Affects Hormonal Balance",
      img: "https://images.unsplash.com/photo-1520206183501-b80df61043c2?w=400&q=70",
    },
  ];

  return (
    <div>
      <h2 className="text-[#FB3179] font-bold mb-1 bg-[#F3F4F6]">Recommended for You</h2>
      {isLoading ? (
        <div className="h-3 bg-rose-100 rounded animate-pulse w-2/3 mb-3" />
      ) : narrative ? (
        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{narrative}</p>
      ) : null}
<div className="grid grid-cols-2 lg:grid-cols-3 gap-4 bg-[#F3F4F6]">
        {ARTICLES.map((it) => (
          <article
            key={it.title}
            className="bg-white p-2 rounded-sm overflow-hidden shadow-sm border border-border/50 hover:shadow-md transition-shadow"
          >
            <img src={it.img} alt={it.title} loading="lazy" className="w-full rounded h-32 object-cover" />
            <div className="mt-2">
              <h3 className="font-bold text-sm text-[#000000]leading-snug">{it.title}</h3>
              <button className="mt-2 text-sm text-[#B32070] font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">
                Read more <MoveRight className="size-3" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}