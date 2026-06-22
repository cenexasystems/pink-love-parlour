import React, { useState } from "react";
import logo from "@/assets/logo.png";

type MenuItem = {
  services: string[];
  price: string;
};

type IndividualItem = {
  name: string;
  price: string;
};

type IndividualCategory = {
  categoryName: string;
  items: IndividualItem[];
};

const LEFT_PAGE_ITEMS: MenuItem[] = [
  {
    services: ["GOLD FACIAL", "D-TAN (FACE + NECK)", "PEDICURE"],
    price: "₹1500",
  },
  {
    services: ["WINEFACIAL", "OILMASSAGE", "WAXING", "BASICHAIRCUT"],
    price: "₹1750",
  },
  {
    services: ["D-TANOR WAXING", "HAIR SPA", "CLEANUP", "PEDICURE"],
    price: "₹1850",
  },
  {
    services: ["CLEANUP", "D-TAN", "BASICHAIRCUT", "EYEBROW THREADING"],
    price: "₹550",
  },
  {
    services: ["BASICFACIAL", "D-TAN", "EYEBROW THREADING"],
    price: "₹700",
  },
  {
    services: ["HYDRAFACIAL", "D-TAN", "EYEBROW THREADING"],
    price: "₹1999",
  },
  {
    services: ["D-TAN", "WAXING"],
    price: "₹450",
  },
];

const RIGHT_PAGE_ITEMS: MenuItem[] = [
  {
    services: ["D-TAN", "EYEBROW THREADING", "UPPERLIIP THREADING", "GUNSHOT"],
    price: "₹500",
  },
  {
    services: ["D-TAN", "RICA WAXING"],
    price: "₹750",
  },
  {
    services: ["GUNSHOT"],
    price: "₹250",
  },
  {
    services: ["CLEANUP", "D-TAN", "BASICHAIRCUT", "EYEBROW THREADING"],
    price: "₹550",
  },
  {
    services: ["HAIRCOLOUR", "CLEANUP", "EYEBROW THREADING", "BASICHAIRCUT"],
    price: "₹600",
  },
  {
    services: ["BASICFACIAL", "D-TAN", "EYEBROW THREADING"],
    price: "₹700",
  },
  {
    services: ["FACIAL", "WHITENING", "BRIGHTENING", "GLOWING"],
    price: "₹1500 each",
  },
  {
    services: ["HAIRCUT", "LAYERCUT", "STEPCUT"],
    price: "₹500 each",
  },
  {
    services: ["HAIRWASH", "BUTTERFLY HAIRCUT"],
    price: "₹800",
  },
];

const LEFT_INDIVIDUAL_CATEGORIES: IndividualCategory[] = [
  {
    categoryName: "Threading",
    items: [
      { name: "Eye brow", price: "50" },
      { name: "Upper lip", price: "20" },
      { name: "Four head", price: "20" },
      { name: "Chin", price: "20" },
    ],
  },
  {
    categoryName: "Treatment",
    items: [
      { name: "Smoothning", price: "3000 to 10000" },
      { name: "Anti dandruff", price: "1500 to 2500" },
      { name: "Lise treatment", price: "2000 to 3500" },
      { name: "Hair colouring", price: "500 to 3000" },
      { name: "Keratin", price: "5000 to 15000" },
      { name: "Botex", price: "5000 to 15000" },
    ],
  },
  {
    categoryName: "Prepleating Saree",
    items: [
      { name: "Basic Saree Prepleating", price: "399" },
      { name: "Advance Saree Prepleating", price: "700" },
      { name: "Floppy Saree Prepleating", price: "1000" },
    ],
  },
];

const RIGHT_INDIVIDUAL_CATEGORIES: IndividualCategory[] = [
  {
    categoryName: "Hair Cut",
    items: [
      { name: "Straight cut", price: "200" },
      { name: "U Cut", price: "300" },
      { name: "V Cut", price: "300" },
      { name: "Layer Cut", price: "500" },
      { name: "Feather Cut", price: "800" },
      { name: "Butterfly Cut", price: "1200" },
      { name: "Mushroom Cut", price: "200" },
      { name: "Baby shalini cut", price: "250" },
      { name: "Boy Cut Baby", price: "100" },
    ],
  },
  {
    categoryName: "Bridal Package",
    items: [
      { name: "Kryolan", price: "7000" },
      { name: "Mac", price: "12000" },
      { name: "Hd", price: "15000" },
      { name: "Sweat Proof", price: "20000" },
      { name: "Water Proof", price: "20000" },
      { name: "Airbrush Makeup", price: "25000" },
    ],
  },
  {
    categoryName: "Party Makeup 2,000 / 3,000 / 4,000",
    items: [
      { name: "Lite Makeup", price: "1500 - 2500" },
      { name: "Engagement", price: "7k, 8k, 10, 12k, 15k" },
      { name: "Puberty Makeup", price: "6k, 8k, 10k, 12k, 15k" },
      { name: "Baby Shower Makeup", price: "6k, 8k, 10k, 12k, 15k" },
    ],
  },
];

export function MenuBook() {
  const [activeTab, setActiveTab] = useState<"combos" | "alacarte">("combos");

  const getWhatsAppLinkForCombo = (services: string[], price: string) => {
    const text = encodeURIComponent(
      `Hi Pink Love Beauty Studio! 🌸 I would like to book the package: ${services.join(" + ")} (${price}). Please check availability.`
    );
    return `https://wa.me/919840874966?text=${text}`;
  };

  const getWhatsAppLinkForService = (name: string, price: string) => {
    const text = encodeURIComponent(
      `Hi Pink Love Beauty Studio! 🌸 I would like to book the individual service: ${name} (₹${price}). Please check availability.`
    );
    return `https://wa.me/919840874966?text=${text}`;
  };

  return (
    <section id="menu" className="relative z-10 px-6 py-20 bg-gradient-to-b from-[color:var(--blush)]/20 to-background overflow-hidden">
      {/* Decorative background glow */}
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

        {/* Dynamic Navigation Switch in the Upper Book Section */}
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

        {/* The Physical Flip Book Simulation (Extended max-w-7xl, left and right) */}
        <div className="relative mx-auto max-w-7xl rounded-[2.5rem] bg-card p-6 sm:p-8 lg:p-10 shadow-[0_25px_60px_rgba(219,112,147,0.18)] border border-[color:var(--rose)]/15 backdrop-blur-md">
          {/* Spine indicator for Book look */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1.5 bg-gradient-to-r from-black/15 via-transparent to-black/15 -translate-x-1/2 z-20" />
          
          {/* Header info */}
          <div className="flex flex-col lg:flex-row lg:justify-between items-center mb-8 pb-6 border-b border-foreground/10 gap-4">
            <div className="flex items-center gap-4">
              <img
                src={logo}
                alt="Pink Love Beauty Studio Logo"
                width={44}
                height={44}
                className="h-11 w-11 rounded-full object-cover shadow-[var(--shadow-soft)] border border-rose-200/50"
              />
              <div className="flex items-center gap-3">
                <span className="font-display text-2xl text-[color:var(--rose)] tracking-wider uppercase font-semibold">
                  Pink Love
                </span>
                <span className="h-5 w-px bg-foreground/35" />
                <span className="text-sm uppercase tracking-widest text-foreground font-semibold">
                  Beauty Saloon & Bridal Studio
                </span>
              </div>
            </div>
            <div className="text-xs sm:text-sm text-[color:var(--rose)] tracking-widest uppercase font-semibold bg-[color:var(--blush)] px-4 py-1.5 rounded-full border border-[color:var(--rose)]/20 shadow-sm">
              📍 Maraimalai Nagar / Kattankulathur
            </div>
          </div>

          {activeTab === "combos" ? (
            /* ==================== COMBO PACKAGES TAB ==================== */
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 relative">
              {/* Left Page (Image 1 Packages) */}
              <div className="pr-0 lg:pr-6 lg:border-r lg:border-foreground/5">
                <h3 className="font-display text-2xl text-[color:var(--rose)] mb-6 uppercase tracking-wider font-semibold border-b border-[color:var(--rose)]/20 pb-2">
                  Value Combos — Page 1
                </h3>
                <div className="grid grid-cols-1 gap-5">
                  {LEFT_PAGE_ITEMS.map((item, i) => (
                    <a
                      key={i}
                      href={getWhatsAppLinkForCombo(item.services, item.price)}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative block p-5 sm:p-6 rounded-2xl border-2 border-dashed border-rose-200 hover:border-[color:var(--rose)] hover:bg-[color:var(--blush)]/10 transition-all duration-300 shadow-[var(--shadow-soft)] hover:shadow-md hover:-translate-y-0.5"
                    >
                      <span className="absolute top-1.5 left-3 text-sm sm:text-base text-rose-300/70 font-serif font-bold">“</span>
                      <span className="absolute bottom-1.5 right-3 text-sm sm:text-base text-rose-300/70 font-serif font-bold">”</span>

                      <div className="flex flex-col h-full justify-between gap-4">
                        <div className="space-y-1">
                          {item.services.map((svc, idx) => (
                            <div
                              key={idx}
                              className="font-display text-sm sm:text-base tracking-wider text-foreground font-bold uppercase leading-tight group-hover:text-[color:var(--rose)] transition-colors"
                            >
                              {svc}
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center pt-2.5 border-t border-rose-100">
                          <span className="text-[10px] sm:text-xs text-[color:var(--rose)] font-extrabold opacity-75 group-hover:opacity-100 transition-opacity">
                            💬 Tap to book on WhatsApp
                          </span>
                          <span className="font-display text-base sm:text-lg text-[color:var(--rose)] font-extrabold bg-[color:var(--blush)] px-3 py-1 rounded-xl border border-[color:var(--rose)]/15 group-hover:bg-[color:var(--rose)] group-hover:text-white transition-all shadow-sm">
                            {item.price}
                          </span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Right Page (Image 2 Packages) */}
              <div className="pl-0 lg:pl-6">
                <h3 className="font-display text-2xl text-[color:var(--rose)] mb-6 uppercase tracking-wider font-semibold border-b border-[color:var(--rose)]/20 pb-2">
                  Value Combos & Specials — Page 2
                </h3>
                <div className="grid grid-cols-1 gap-5">
                  {RIGHT_PAGE_ITEMS.map((item, i) => (
                    <a
                      key={i}
                      href={getWhatsAppLinkForCombo(item.services, item.price)}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative block p-5 sm:p-6 rounded-2xl border-2 border-dashed border-rose-200 hover:border-[color:var(--rose)] hover:bg-[color:var(--blush)]/10 transition-all duration-300 shadow-[var(--shadow-soft)] hover:shadow-md hover:-translate-y-0.5"
                    >
                      <span className="absolute top-1.5 left-3 text-sm sm:text-base text-rose-300/70 font-serif font-bold">“</span>
                      <span className="absolute bottom-1.5 right-3 text-sm sm:text-base text-rose-300/70 font-serif font-bold">”</span>

                      <div className="flex flex-col h-full justify-between gap-4">
                        <div className="space-y-1">
                          {item.services.map((svc, idx) => (
                            <div
                              key={idx}
                              className="font-display text-sm sm:text-base tracking-wider text-foreground font-bold uppercase leading-tight group-hover:text-[color:var(--rose)] transition-colors"
                            >
                              {svc}
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center pt-2.5 border-t border-rose-100">
                          <span className="text-[10px] sm:text-xs text-[color:var(--rose)] font-extrabold opacity-75 group-hover:opacity-100 transition-opacity">
                            💬 Tap to book on WhatsApp
                          </span>
                          <span className="font-display text-base sm:text-lg text-[color:var(--rose)] font-extrabold bg-[color:var(--blush)] px-3 py-1 rounded-xl border border-[color:var(--rose)]/15 group-hover:bg-[color:var(--rose)] group-hover:text-white transition-all shadow-sm">
                            {item.price}
                          </span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* ==================== INDIVIDUAL SERVICES TAB ==================== */
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 relative">
              {/* Left Page (Threading, Treatment, Prepleating Saree) */}
              <div className="pr-0 lg:pr-6 lg:border-r lg:border-foreground/5 space-y-10">
                {LEFT_INDIVIDUAL_CATEGORIES.map((cat, ci) => (
                  <div key={ci} className="space-y-4">
                    <h3 className="font-display text-2xl text-[color:var(--rose)] uppercase tracking-wider font-semibold border-b border-[color:var(--rose)]/20 pb-2">
                      {cat.categoryName}
                    </h3>
                    <div className="space-y-3.5">
                      {cat.items.map((item, ii) => (
                        <a
                          key={ii}
                          href={getWhatsAppLinkForService(item.name, item.price)}
                          target="_blank"
                          rel="noreferrer"
                          className="group flex items-baseline justify-between hover:text-[color:var(--rose)] transition-all py-1.5 block cursor-pointer"
                        >
                          <span className="font-display font-semibold text-sm sm:text-base tracking-wide uppercase">
                            {item.name}
                          </span>
                          <span className="flex-grow border-b border-dotted border-rose-300/40 mx-2 relative top-[-4px] group-hover:border-rose-400" />
                          <span className="font-display font-bold text-xs sm:text-sm text-[color:var(--rose)] bg-[color:var(--blush)] px-2.5 py-0.5 rounded-lg border border-[color:var(--rose)]/10 group-hover:bg-[color:var(--rose)] group-hover:text-white transition-all whitespace-nowrap">
                            {item.price}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Page (Hair Cut, Bridal Package, Party Makeup) */}
              <div className="pl-0 lg:pl-6 space-y-10">
                {RIGHT_INDIVIDUAL_CATEGORIES.map((cat, ci) => (
                  <div key={ci} className="space-y-4">
                    <h3 className="font-display text-2xl text-[color:var(--rose)] uppercase tracking-wider font-semibold border-b border-[color:var(--rose)]/20 pb-2">
                      {cat.categoryName}
                    </h3>
                    <div className="space-y-3.5">
                      {cat.items.map((item, ii) => (
                        <a
                          key={ii}
                          href={getWhatsAppLinkForService(item.name, item.price)}
                          target="_blank"
                          rel="noreferrer"
                          className="group flex items-baseline justify-between hover:text-[color:var(--rose)] transition-all py-1.5 block cursor-pointer"
                        >
                          <span className="font-display font-semibold text-sm sm:text-base tracking-wide uppercase">
                            {item.name}
                          </span>
                          <span className="flex-grow border-b border-dotted border-rose-300/40 mx-2 relative top-[-4px] group-hover:border-rose-400" />
                          <span className="font-display font-bold text-xs sm:text-sm text-[color:var(--rose)] bg-[color:var(--blush)] px-2.5 py-0.5 rounded-lg border border-[color:var(--rose)]/10 group-hover:bg-[color:var(--rose)] group-hover:text-white transition-all whitespace-nowrap">
                            {item.price}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Address Footer / Disclaimer */}
        <div className="text-center mt-10">
          <p className="text-xs sm:text-sm text-foreground/60 leading-relaxed font-medium">
            * All bookings are confirmed instantly via WhatsApp. Address: No.29, NH1 Thiruvalluvar Salai, Maraimalai Nagar - 603 209.
          </p>
        </div>
      </div>
    </section>
  );
}
