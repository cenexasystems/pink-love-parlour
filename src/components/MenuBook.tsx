import React, { useEffect, useState } from "react";
import logo from "@/assets/logo.png";
import { supabase } from "@/integrations/supabase/client";

type ComboItem = {
  id: string;
  page: number;
  services: string[];
  price: string;
  sort_order: number;
};

type IndividualRow = {
  id: string;
  side: string;
  category: string;
  name: string;
  price: string;
  sort_order: number;
};

const waCombo = (services: string[], price: string) =>
  `https://wa.me/919840874966?text=${encodeURIComponent(
    `Hi Pink Love Beauty Studio! 🌸 I would like to book the package: ${services.join(" + ")} (${price}). Please check availability.`,
  )}`;

const waService = (name: string, price: string) =>
  `https://wa.me/919840874966?text=${encodeURIComponent(
    `Hi Pink Love Beauty Studio! 🌸 I would like to book the individual service: ${name} (₹${price}). Please check availability.`,
  )}`;

export function MenuBook() {
  const [activeTab, setActiveTab] = useState<"combos" | "alacarte">("combos");
  const [combos, setCombos] = useState<ComboItem[]>([]);
  const [individuals, setIndividuals] = useState<IndividualRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [c, i] = await Promise.all([
        supabase.from("combo_items").select("*").order("page").order("sort_order"),
        supabase.from("individual_services").select("*").order("side").order("category").order("sort_order"),
      ]);
      if (c.data) setCombos(c.data as ComboItem[]);
      if (i.data) setIndividuals(i.data as IndividualRow[]);
      setLoading(false);
    })();
  }, []);

  const leftCombos = combos.filter((c) => c.page === 1);
  const rightCombos = combos.filter((c) => c.page === 2);

  const groupBy = (rows: IndividualRow[], side: string) => {
    const out: Record<string, IndividualRow[]> = {};
    rows.filter((r) => r.side === side).forEach((r) => {
      (out[r.category] ||= []).push(r);
    });
    return out;
  };
  const leftCats = groupBy(individuals, "left");
  const rightCats = groupBy(individuals, "right");

  const renderComboList = (list: ComboItem[]) => (
    <div className="grid grid-cols-1 gap-5">
      {list.map((item) => (
        <a
          key={item.id}
          href={waCombo(item.services, item.price)}
          target="_blank"
          rel="noreferrer"
          className="group relative block p-5 sm:p-6 rounded-2xl border-2 border-dashed border-rose-200 hover:border-[color:var(--rose)] hover:bg-[color:var(--blush)]/10 transition-all duration-300 shadow-[var(--shadow-soft)] hover:shadow-md hover:-translate-y-0.5"
        >
          <span className="absolute top-1.5 left-3 text-sm sm:text-base text-rose-300/70 font-serif font-bold">“</span>
          <span className="absolute bottom-1.5 right-3 text-sm sm:text-base text-rose-300/70 font-serif font-bold">”</span>
          <div className="flex flex-col h-full justify-between gap-4">
            <div className="space-y-1">
              {item.services.map((svc, idx) => (
                <div key={idx} className="font-display text-sm sm:text-base tracking-wider text-foreground font-bold uppercase leading-tight group-hover:text-[color:var(--rose)] transition-colors">
                  {svc}
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-2.5 border-t border-rose-100">
              <span className="text-[10px] sm:text-xs text-[color:var(--rose)] font-extrabold opacity-75 group-hover:opacity-100 transition-opacity">💬 Tap to book on WhatsApp</span>
              <span className="font-display text-base sm:text-lg text-[color:var(--rose)] font-extrabold bg-[color:var(--blush)] px-3 py-1 rounded-xl border border-[color:var(--rose)]/15 group-hover:bg-[color:var(--rose)] group-hover:text-white transition-all shadow-sm">
                {item.price}
              </span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );

  const renderCategoryList = (cats: Record<string, IndividualRow[]>) => (
    <div className="space-y-10">
      {Object.entries(cats).map(([category, items]) => (
        <div key={category} className="space-y-4">
          <h3 className="font-display text-2xl text-[color:var(--rose)] uppercase tracking-wider font-semibold border-b border-[color:var(--rose)]/20 pb-2">
            {category}
          </h3>
          <div className="space-y-3.5">
            {items.map((item) => (
              <a
                key={item.id}
                href={waService(item.name, item.price)}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between hover:text-[color:var(--rose)] transition-all py-2 cursor-pointer"
              >
                <span className="font-display font-semibold text-sm sm:text-base tracking-wide uppercase">{item.name}</span>
                <span className="flex-grow border-b border-dotted border-rose-300/40 mx-2 group-hover:border-rose-400" />
                <span className="font-display font-bold text-xs sm:text-sm text-[color:var(--rose)] bg-[color:var(--blush)] px-2.5 py-0.5 rounded-lg border border-[color:var(--rose)]/10 group-hover:bg-[color:var(--rose)] group-hover:text-white transition-all whitespace-nowrap">
                  {item.price}
                </span>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section id="menu" className="relative z-10 px-6 py-20 bg-gradient-to-b from-[color:var(--blush)]/20 to-background overflow-hidden">
      <div className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-[color:var(--rose)] opacity-10 blur-3xl" />
      <div className="absolute -right-20 bottom-20 h-96 w-96 rounded-full bg-[color:var(--gold)] opacity-10 blur-3xl" />

      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-10">
          <p className="font-script text-4xl text-[color:var(--rose)]">our menu card</p>
          <h2 className="font-display text-5xl sm:text-6xl mt-2 tracking-tight">Interactive Menu Book</h2>
          <p className="mt-4 text-foreground/80 max-w-2xl mx-auto text-base sm:text-lg">
            Browse our package offers and tap any card to book directly on WhatsApp.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-full bg-[color:var(--blush)]/60 p-1.5 border border-[color:var(--rose)]/30 shadow-md">
            <button
              onClick={() => setActiveTab("combos")}
              className={`rounded-full px-6 sm:px-8 py-2.5 text-sm sm:text-base font-bold transition-all duration-300 ${
                activeTab === "combos"
                  ? "bg-gradient-to-r from-[color:var(--rose)] to-[color:var(--petal)] text-white shadow-md scale-105"
                  : "text-foreground hover:text-[color:var(--rose)]"
              }`}
            >
              Value Combos
            </button>
            <button
              onClick={() => setActiveTab("alacarte")}
              className={`rounded-full px-6 sm:px-8 py-2.5 text-sm sm:text-base font-bold transition-all duration-300 ${
                activeTab === "alacarte"
                  ? "bg-gradient-to-r from-[color:var(--rose)] to-[color:var(--petal)] text-white shadow-md scale-105"
                  : "text-foreground hover:text-[color:var(--rose)]"
              }`}
            >
              Individual Services
            </button>
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl rounded-[2.5rem] bg-card p-6 sm:p-8 lg:p-10 shadow-[0_25px_60px_rgba(219,112,147,0.18)] border border-[color:var(--rose)]/15 backdrop-blur-md">
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1.5 bg-gradient-to-r from-black/15 via-transparent to-black/15 -translate-x-1/2 z-20" />
          <div className="flex flex-col lg:flex-row lg:justify-between items-center mb-8 pb-6 border-b border-foreground/10 gap-4">
            <div className="flex items-center gap-4">
              <img src={logo} alt="Pink Love Beauty Studio Logo" width={44} height={44} className="h-11 w-11 rounded-full object-cover shadow-[var(--shadow-soft)] border border-rose-200/50" />
              <div className="flex items-center gap-3">
                <span className="font-display text-2xl text-[color:var(--rose)] tracking-wider uppercase font-semibold">Pink Love</span>
                <span className="h-5 w-px bg-foreground/35" />
                <span className="text-sm uppercase tracking-widest text-foreground font-semibold">Beauty Saloon & Bridal Studio</span>
              </div>
            </div>
            <div className="text-xs sm:text-sm text-[color:var(--rose)] tracking-widest uppercase font-semibold bg-[color:var(--blush)] px-4 py-1.5 rounded-full border border-[color:var(--rose)]/20 shadow-sm">
              📍 Maraimalai Nagar / Kattankulathur
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-foreground/60">Loading menu…</div>
          ) : activeTab === "combos" ? (
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 relative">
              <div className="pr-0 lg:pr-6 lg:border-r lg:border-foreground/5">
                <h3 className="font-display text-2xl text-[color:var(--rose)] mb-6 uppercase tracking-wider font-semibold border-b border-[color:var(--rose)]/20 pb-2">
                  Value Combos — Page 1
                </h3>
                {renderComboList(leftCombos)}
              </div>
              <div className="pl-0 lg:pl-6">
                <h3 className="font-display text-2xl text-[color:var(--rose)] mb-6 uppercase tracking-wider font-semibold border-b border-[color:var(--rose)]/20 pb-2">
                  Value Combos & Specials — Page 2
                </h3>
                {renderComboList(rightCombos)}
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 relative">
              <div className="pr-0 lg:pr-6 lg:border-r lg:border-foreground/5">{renderCategoryList(leftCats)}</div>
              <div className="pl-0 lg:pl-6">{renderCategoryList(rightCats)}</div>
            </div>
          )}
        </div>

        <div className="text-center mt-10">
          <p className="text-xs sm:text-sm text-foreground/60 leading-relaxed font-medium">
            * All bookings are confirmed instantly via WhatsApp. Address: No.29, NH1 Thiruvalluvar Salai, Maraimalai Nagar - 603 209.
          </p>
        </div>
      </div>
    </section>
  );
}
