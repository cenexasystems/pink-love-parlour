import React, { useEffect, useState } from "react";
import logo from "@/assets/logo.png";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  ShoppingBag, 
  X, 
  Minus, 
  Plus, 
  Trash2, 
  User, 
  Sparkles, 
  Scissors,
  Check
} from "lucide-react";

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

type CartItem = {
  id: string;
  name: string;
  price: string;
  quantity: number;
  type: "combo" | "individual";
};

const DEFAULT_COMBOS: ComboItem[] = [
  // Page 1
  { id: "c1", page: 1, services: ["GOLD FACIAL", "D-TAN (FACE + NECK)", "PEDICURE"], price: "₹1500", sort_order: 0 },
  { id: "c2", page: 1, services: ["WINEFACIAL", "OILMASSAGE", "WAXING", "BASICHAIRCUT"], price: "₹1750", sort_order: 1 },
  { id: "c3", page: 1, services: ["D-TANOR WAXING", "HAIR SPA", "CLEANUP", "PEDICURE"], price: "₹1850", sort_order: 2 },
  { id: "c4", page: 1, services: ["CLEANUP", "D-TAN", "BASICHAIRCUT", "EYEBROW THREADING"], price: "₹550", sort_order: 3 },
  { id: "c5", page: 1, services: ["BASICFACIAL", "D-TAN", "EYEBROW THREADING"], price: "₹700", sort_order: 4 },
  { id: "c6", page: 1, services: ["HYDRAFACIAL", "D-TAN", "EYEBROW THREADING"], price: "₹1999", sort_order: 5 },
  { id: "c7", page: 1, services: ["D-TAN", "WAXING"], price: "₹450", sort_order: 6 },
  // Page 2
  { id: "c8", page: 2, services: ["D-TAN", "EYEBROW THREADING", "UPPERLIIP THREADING", "GUNSHOT"], price: "₹500", sort_order: 0 },
  { id: "c9", page: 2, services: ["D-TAN", "RICA WAXING"], price: "₹750", sort_order: 1 },
  { id: "c10", page: 2, services: ["GUNSHOT"], price: "₹250", sort_order: 2 },
  { id: "c11", page: 2, services: ["CLEANUP", "D-TAN", "BASICHAIRCUT", "EYEBROW THREADING"], price: "₹550", sort_order: 3 },
  { id: "c12", page: 2, services: ["HAIRCOLOUR", "CLEANUP", "EYEBROW THREADING", "BASICHAIRCUT"], price: "₹600", sort_order: 4 },
  { id: "c13", page: 2, services: ["BASICFACIAL", "D-TAN", "EYEBROW THREADING"], price: "₹700", sort_order: 5 },
  { id: "c14", page: 2, services: ["FACIAL", "WHITENING", "BRIGHTENING", "GLOWING"], price: "₹1500 each", sort_order: 6 },
  { id: "c15", page: 2, services: ["HAIRCUT", "LAYERCUT", "STEPCUT"], price: "₹500 each", sort_order: 7 },
  { id: "c16", page: 2, services: ["HAIRWASH", "BUTTERFLY HAIRCUT"], price: "₹800", sort_order: 8 }
];

const DEFAULT_INDIVIDUALS: IndividualRow[] = [
  // Threading (Left)
  { id: "i1", side: "left", category: "Threading", name: "Eye brow", price: "50", sort_order: 0 },
  { id: "i2", side: "left", category: "Threading", name: "Upper lip", price: "20", sort_order: 1 },
  { id: "i3", side: "left", category: "Threading", name: "Four head", price: "20", sort_order: 2 },
  { id: "i4", side: "left", category: "Threading", name: "Chin", price: "20", sort_order: 3 },
  // Treatment (Left)
  { id: "i5", side: "left", category: "Treatment", name: "Smoothning", price: "3000 to 10000", sort_order: 4 },
  { id: "i6", side: "left", category: "Treatment", name: "Anti dandruff", price: "1500 to 2500", sort_order: 5 },
  { id: "i7", side: "left", category: "Treatment", name: "Lise treatment", price: "2000 to 3500", sort_order: 6 },
  { id: "i8", side: "left", category: "Treatment", name: "Hair colouring", price: "500 to 3000", sort_order: 7 },
  { id: "i9", side: "left", category: "Treatment", name: "Keratin", price: "5000 to 15000", sort_order: 8 },
  { id: "i10", side: "left", category: "Treatment", name: "Botex", price: "5000 to 15000", sort_order: 9 },
  // Prepleating Saree (Left)
  { id: "i11", side: "left", category: "Prepleating Saree", name: "Basic Saree Prepleating", price: "399", sort_order: 10 },
  { id: "i12", side: "left", category: "Prepleating Saree", name: "Advance Saree Prepleating", price: "700", sort_order: 11 },
  { id: "i13", side: "left", category: "Prepleating Saree", name: "Floppy Saree Prepleating", price: "1000", sort_order: 12 },
  // Hair Cut (Right)
  { id: "i14", side: "right", category: "Hair Cut", name: "Straight cut", price: "200", sort_order: 13 },
  { id: "i15", side: "right", category: "Hair Cut", name: "U Cut", price: "300", sort_order: 14 },
  { id: "i16", side: "right", category: "Hair Cut", name: "V Cut", price: "300", sort_order: 15 },
  { id: "i17", side: "right", category: "Hair Cut", name: "Layer Cut", price: "500", sort_order: 16 },
  { id: "i18", side: "right", category: "Hair Cut", name: "Feather Cut", price: "800", sort_order: 17 },
  { id: "i19", side: "right", category: "Hair Cut", name: "Butterfly Cut", price: "1200", sort_order: 18 },
  { id: "i20", side: "right", category: "Hair Cut", name: "Mushroom Cut", price: "200", sort_order: 19 },
  { id: "i21", side: "right", category: "Hair Cut", name: "Baby shalini cut", price: "250", sort_order: 20 },
  { id: "i22", side: "right", category: "Hair Cut", name: "Boy Cut Baby", price: "100", sort_order: 21 },
  // Bridal Package (Right)
  { id: "i23", side: "right", category: "Bridal Package", name: "Kryolan", price: "7000", sort_order: 22 },
  { id: "i24", side: "right", category: "Bridal Package", name: "Mac", price: "12000", sort_order: 23 },
  { id: "i25", side: "right", category: "Bridal Package", name: "Hd", price: "15000", sort_order: 24 },
  { id: "i26", side: "right", category: "Bridal Package", name: "Sweat Proof", price: "20000", sort_order: 25 },
  { id: "i27", side: "right", category: "Bridal Package", name: "Water Proof", price: "20000", sort_order: 26 },
  { id: "i28", side: "right", category: "Bridal Package", name: "Airbrush Makeup", price: "25000", sort_order: 27 },
  // Party Makeup (Right)
  { id: "i29", side: "right", category: "Party Makeup", name: "Lite Makeup", price: "1500 - 2500", sort_order: 28 },
  { id: "i30", side: "right", category: "Party Makeup", name: "Engagement", price: "7k, 8k, 10, 12k, 15k", sort_order: 29 },
  { id: "i31", side: "right", category: "Party Makeup", name: "Puberty Makeup", price: "6k, 8k, 10k, 12k, 15k", sort_order: 30 },
  { id: "i32", side: "right", category: "Party Makeup", name: "Baby Shower Makeup", price: "6k, 8k, 10k, 12k, 15k", sort_order: 31 }
];

export interface MenuBookProps {
  cart: CartItem[];
  onAddToCart: (id: string, name: string, price: string, type: "combo" | "individual") => void;
}

export function MenuBook({ cart, onAddToCart }: MenuBookProps) {
  const [activeTab, setActiveTab] = useState<"combos" | "alacarte">("combos");
  const [combos, setCombos] = useState<ComboItem[]>([]);
  const [individuals, setIndividuals] = useState<IndividualRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [c, i] = await Promise.all([
          supabase.from("combo_items").select("*").order("page").order("created_at"),
          supabase.from("individual_services").select("*").order("side").order("category").order("created_at"),
        ]);
        if (c.data && c.data.length > 0) {
          setCombos(c.data as ComboItem[]);
        } else {
          setCombos(DEFAULT_COMBOS);
        }
        if (i.data && i.data.length > 0) {
          setIndividuals(i.data as IndividualRow[]);
        } else {
          setIndividuals(DEFAULT_INDIVIDUALS);
        }
      } catch (e) {
        console.error("Supabase failed to load menu, using defaults:", e);
        setCombos(DEFAULT_COMBOS);
        setIndividuals(DEFAULT_INDIVIDUALS);
      } finally {
        setLoading(false);
      }
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
      {list.map((item) => {
        const inCart = cart.find((c) => c.id === item.id);
        const name = item.services.join(" + ");
        return (
          <div
            key={item.id}
            className="group relative block p-5 sm:p-6 rounded-2xl border-2 border-dashed border-rose-200 hover:border-[color:var(--rose)] hover:bg-[color:var(--blush)]/10 transition-all duration-300 shadow-[var(--shadow-soft)]"
          >
            <span className="absolute top-1.5 left-3 text-sm sm:text-base text-rose-300/70 font-serif font-bold">“</span>
            <span className="absolute bottom-1.5 right-3 text-sm sm:text-base text-rose-300/70 font-serif font-bold">”</span>
            <div className="flex flex-col h-full justify-between gap-4">
              <div className="space-y-1">
                {item.services.map((svc, idx) => (
                  <div key={idx} className="font-display text-sm sm:text-base tracking-wider text-foreground font-bold uppercase leading-tight">
                    {svc}
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-rose-100/60">
                <span className="font-sans font-bold text-lg sm:text-xl md:text-2xl text-rose-700 bg-rose-50/80 px-4 py-1.5 rounded-xl border border-rose-200 shadow-xs tracking-tight">
                  {item.price}
                </span>
                
                <button
                  onClick={() => onAddToCart(item.id, name, item.price, "combo")}
                  className={`font-display text-xs sm:text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-sm border cursor-pointer flex items-center gap-1.5 ${
                    inCart 
                      ? "bg-emerald-500 hover:bg-emerald-600 border-emerald-500 text-white" 
                      : "bg-[color:var(--rose)] hover:bg-[color:var(--rose)]/90 border-[color:var(--rose)] text-white"
                  }`}
                >
                  {inCart ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Added ({inCart.quantity})
                    </>
                  ) : (
                    "+ Add to List"
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })}
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
            {items.map((item) => {
              const inCart = cart.find((c) => c.id === item.id);
              const displayPrice = item.price.startsWith("₹") ? item.price : `₹${item.price}`;
              return (
                <div
                  key={item.id}
                  className="group flex items-center justify-between py-2.5 border-b border-rose-100/30 px-1 hover:bg-rose-50/15 rounded-lg transition-all"
                >
                  <span className="font-display font-semibold text-sm sm:text-base tracking-wide uppercase max-w-[50%] leading-snug">{item.name}</span>
                  <span className="flex-grow border-b border-dotted border-rose-300/40 mx-3" />
                  <div className="flex items-center gap-2.5">
                    <span className="font-sans font-bold text-sm sm:text-base md:text-lg text-rose-700 bg-rose-50/80 px-3 py-1 rounded-lg border border-rose-200/50 shadow-xs whitespace-nowrap tracking-tight">
                      {displayPrice}
                    </span>
                    <button
                      onClick={() => onAddToCart(item.id, item.name, displayPrice, "individual")}
                      className={`font-display text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-lg transition-all shadow-sm border cursor-pointer ${
                        inCart
                          ? "bg-emerald-500 hover:bg-emerald-600 border-emerald-500 text-white"
                          : "bg-[color:var(--rose)] hover:bg-[color:var(--rose)]/90 border-[color:var(--rose)] text-white"
                      }`}
                    >
                      {inCart ? `Added (${inCart.quantity})` : "+ Add"}
                    </button>
                  </div>
                </div>
              );
            })}
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
          <p className="mt-4 text-foreground/80 max-w-2xl mx-auto text-base sm:text-lg font-medium">
            🌸 Add your favorite packages and services to your <span className="text-[color:var(--rose)] font-bold">Booking List</span>, then tap the floating cart to proceed to WhatsApp!
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-full bg-[color:var(--blush)]/60 p-1.5 border border-[color:var(--rose)]/30 shadow-md">
            <button
              onClick={() => setActiveTab("combos")}
              className={`rounded-full px-6 sm:px-8 py-2.5 text-sm sm:text-base font-bold transition-all duration-300 cursor-pointer ${
                activeTab === "combos"
                  ? "bg-gradient-to-r from-[color:var(--rose)] to-[color:var(--petal)] text-white shadow-md scale-105"
                  : "text-foreground hover:text-[color:var(--rose)]"
              }`}
            >
              Value Combos
            </button>
            <button
              onClick={() => setActiveTab("alacarte")}
              className={`rounded-full px-6 sm:px-8 py-2.5 text-sm sm:text-base font-bold transition-all duration-300 cursor-pointer ${
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
