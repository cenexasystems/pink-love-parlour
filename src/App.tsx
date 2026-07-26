import { useCallback, useEffect, useRef, useState } from "react";
import heroBride from "@/assets/hero-bride.jpg";
import serviceFacial from "@/assets/service-facial.jpg";
import serviceHair from "@/assets/service-hair.jpg";
import serviceJewelry from "@/assets/service-jewelry.jpg";
import g4 from "@/assets/gallery-4.jpg";
import logo from "@/assets/logo.png";
import { MenuBook } from "@/components/MenuBook";
import { supabase } from "@/integrations/supabase/client";
import { 
  ShoppingBag, 
  X, 
  Minus, 
  Plus, 
  Trash2, 
  User 
} from "lucide-react";

// Types
interface IgPost {
  id: string;
  media_type: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
  timestamp: string;
  localVideoUrl?: string;
  cloudinaryPublicId?: string;
}

interface GalleryImage {
  src: string;
  cloudinaryId?: string;
  alt: string;
  position?: number;
}

interface QuizOption {
  id: string;
  label: string;
  desc: string;
  icon: string;
}

interface LookMatch {
  title: string;
  price: string;
  desc: string;
  features: string[];
  waText: string;
}

const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "9840874966";
const WA_NUMBER_FORMATTED = `${WA_NUMBER.slice(0, 5)} ${WA_NUMBER.slice(5)}`;

// Data constants
const SERVICES = [
  {
    name: "HD Bridal Makeovers",
    desc: "Flawless HD & waterproof bridal makeup designed to last from mandap to reception.",
    img: "/services/bridal-makeup.png",
  },
  {
    name: "Korean Glass Skin Facials",
    desc: "Hydrafacials and glass-skin rituals for that dewy, lit-from-within glow.",
    img: "/services/facial-spa.png",
  },
  {
    name: "Hair Styling & Spa",
    desc: "Volumizing layers, advanced haircuts and nourishing hair spa treatments.",
    img: "/services/hair-styling.png",
  },
  {
    name: "Bridal Jewelry & Accessories",
    desc: "On-site selection of bridal jewelry, earrings and bangles to complete your look.",
    img: "/services/bridal-jewelry.png",
  },
];

const DEFAULT_GALLERY: GalleryImage[] = [
  {
    src: "",
    cloudinaryId: "v1782023965/WhatsApp_Image_2026-06-20_at_12.54.44_1_rjgdsw",
    alt: "Pink Love bridal makeup close-up and jewelry styling"
  },
  {
    src: "",
    cloudinaryId: "v1782023994/WhatsApp_Image_2026-06-20_at_12.54.43_1_sjgp4x",
    alt: "Bridal floral hair styling and traditional look"
  },
  {
    src: "",
    cloudinaryId: "v1782023986/WhatsApp_Image_2026-06-20_at_12.54.44_toqhbp",
    alt: "Gorgeous wedding look and makeup highlights"
  },
  {
    src: "",
    cloudinaryId: "v1782023979/WhatsApp_Image_2026-06-20_at_12.54.45_xqtej2",
    alt: "Saree pre-pleating and elegant drape detail"
  },
  {
    src: "",
    cloudinaryId: "v1782023975/WhatsApp_Image_2026-06-20_at_12.54.45_1_pzb8wx",
    alt: "Client review: radiant bridal look session"
  },
  {
    src: "",
    cloudinaryId: "v1782023965/WhatsApp_Image_2026-06-20_at_12.54.44_1_rjgdsw",
    alt: "Pink Love makeup session portrait"
  }
];

const OCCASIONS: QuizOption[] = [
  { id: "bridal", label: "Bridal Makeover", desc: "For your wedding or reception day.", icon: "👑" },
  { id: "party", label: "Party & Guest Glam", desc: "For birthdays, bridesmaids, & events.", icon: "✨" },
  { id: "skin", label: "Korean Glass-Skin & Facials", desc: "For that ultimate glowing skin treatment.", icon: "💧" },
  { id: "hair", label: "Hair Spa & Makeovers", desc: "For advanced hair styling & spa therapies.", icon: "💇‍♀️" },
];

const VIBES: Record<string, QuizOption[]> = {
  bridal: [
    { id: "royal", label: "Royal Traditional", desc: "Classic South Indian or North Indian rich look.", icon: "🔱" },
    { id: "dewy", label: "Korean Glass-Skin / Western", desc: "Minimalist, dewy, glowing, natural beauty.", icon: "✨" },
    { id: "bold", label: "High-Definition Bold Glam", desc: "Flawless HD matte base with defined eyes/lips.", icon: "💋" },
  ],
  party: [
    { id: "soft", label: "Soft Glow Glam", desc: "Subtle base with nude lips & natural eyeshadow.", icon: "🌸" },
    { id: "dramatic", label: "Dramatic Eye Glam", desc: "Stunning smokey eyes or glitter wings.", icon: "👁️" },
    { id: "classic", label: "Elegant Classic", desc: "Perfect red lip, winged eyeliner, neat hair.", icon: "💄" },
  ],
  skin: [
    { id: "dewy_skin", label: "Instantly Dewy Glass Skin", desc: "Korean skin booster facials for radiance.", icon: "✨" },
    { id: "plump", label: "Hydrated & Plump", desc: "Advanced hydrafacial to clear & moisturize.", icon: "💧" },
    { id: "detox", label: "Deep Cleanse & Gold Glow", desc: "Detoxify, remove tan, and brighten.", icon: "🌟" },
  ],
  hair: [
    { id: "waves", label: "Voluminous Waves", desc: "Bouncy curls, soft blowouts, and extensions.", icon: "🌀" },
    { id: "sleek", label: "Sleek & Silky Spa", desc: "Deep conditioning spa with straight finishes.", icon: "🍃" },
    { id: "traditional", label: "Traditional Flower Braids", desc: "Neat bridal braids with fresh jasmine.", icon: "🌼" },
  ],
};

const MATCHES: Record<string, Record<string, LookMatch>> = {
  bridal: {
    royal: {
      title: "Mac / Kryolan",
      price: "₹7,000 / ₹12,000",
      desc: "Traditional royal bridal makeovers utilizing professional Kryolan and MAC products. Specially designed to enhance your features for gorgeous South Indian and North Indian wedding celebrations.",
      features: [
        "Full face makeup using Kryolan or MAC",
        "Bridal hair styling & fresh flower setting",
        "Saree prepleating & drape setting",
        "Jewelry setting & placement"
      ],
      waText: "Hi Pink Love Studio! 🌸 I completed the Look Matcher and matched with the Bridal Package: 'Mac / Kryolan' (₹7,000 / ₹12,000). I'd love to check dates and package details!"
    },
    dewy: {
      title: "Airbrush Makeup",
      price: "₹25,000",
      desc: "The ultimate modern, dewy finish using state-of-the-art airbrush technology. Perfect for a flawless, lit-from-within glow that looks natural and behaves beautifully under HD cameras.",
      features: [
        "Full HD Airbrush makeup base",
        "Dewy glass-skin look prep",
        "Advanced bridal hair styling",
        "Luxury lash extensions & saree draping"
      ],
      waText: "Hi Pink Love Studio! 🌸 I completed the Look Matcher and matched with the 'Airbrush Makeup' (₹25,000). I'd love to check availability!"
    },
    bold: {
      title: "Hd / Sweat Proof / Water Proof",
      price: "₹15,000 - ₹20,000",
      desc: "High-definition bold makeup designed to resist sweat and moisture for up to 16 hours. Perfect for wedding stages and high-temperature outdoor setups.",
      features: [
        "Genuine HD base cosmetics",
        "100% Sweat-proof & Water-proof finish",
        "Defined eye drama & premium false lashes",
        "Traditional or contemporary hair design"
      ],
      waText: "Hi Pink Love Studio! 🌸 I completed the Look Matcher and matched with the Bridal Package: 'Hd / Sweat Proof / Water Proof' (₹15,000 - ₹20,000). I'd love to check details!"
    }
  },
  party: {
    soft: {
      title: "Lite Makeup",
      price: "₹1,500 - ₹2,500",
      desc: "A gorgeous, lightweight makeup and hair setup. Ideal for bridesmaids, birthday parties, or attending family gatherings.",
      features: [
        "Lightweight dewy base application",
        "Soft blush & natural lipstick",
        "Simple eye shimmer & mascara",
        "Simple hair styling (blow dry or curls)"
      ],
      waText: "Hi Pink Love Studio! 🌸 I completed the Look Matcher and matched with the 'Lite Makeup' (₹1,500 - ₹2,500). I'd like to book a session!"
    },
    dramatic: {
      title: "Engagement",
      price: "₹7k - ₹15k",
      desc: "Focuses on bold eyes, glitter lids, or smokey accents, matched with a flawless base and contemporary hair styling.",
      features: [
        "Flawless evening base makeup",
        "Dramatic/Smokey eye makeup",
        "Trendy hairstyle or half-updo",
        "Saree/Outfit draping assistance"
      ],
      waText: "Hi Pink Love Studio! 🌸 I completed the Look Matcher and matched with the 'Engagement' (7k, 8k, 10, 12k, 15k). I'd like to book this look!"
    },
    classic: {
      title: "Puberty Makeup / Baby Shower Makeup",
      price: "₹6k - ₹15k",
      desc: "Timeless sophistication featuring sharp winged eyeliner, classical red or nude lips, and a neat blow dry finish.",
      features: [
        "Clean semi-matte base makeup",
        "Classic winged liner & bold lip shade",
        "Volumizing blowout or sleek straight hair",
        "Outfit prepleating/draping assistance"
      ],
      waText: "Hi Pink Love Studio! 🌸 I completed the Look Matcher and matched with the 'Puberty Makeup / Baby Shower Makeup' (6k, 8k, 10k, 12k, 15k). I'd love to book this style!"
    }
  },
  skin: {
    dewy_skin: {
      title: "FACIAL + WHITENING + BRIGHTENING + GLOWING",
      price: "₹1,500 each",
      desc: "An intensive whitening and brightening facial to bring out a dewy, glowing complexion for upcoming celebrations.",
      features: [
        "Deep double cleansing",
        "Whitening scrub & tan-clear wrap",
        "Brightening massage therapy",
        "Instantly glowing facial pack"
      ],
      waText: "Hi Pink Love Studio! 🌸 I completed the Look Matcher and matched with the 'FACIAL + WHITENING + BRIGHTENING + GLOWING' (₹1,500 each). I'd like to schedule a session!"
    },
    plump: {
      title: "HYDRAFACIAL + D-TAN + EYEBROW THREADING",
      price: "₹1,999",
      desc: "Our best-selling hydration facial combo. Deeply exfoliates pores while infusing moisture for a plump, smooth glass-skin finish.",
      features: [
        "Vortex deep cleanse Hydrafacial",
        "Full-face D-Tan treatment",
        "Eyebrow threading alignment",
        "Hydrating glow serum massage"
      ],
      waText: "Hi Pink Love Studio! 🌸 I completed the Look Matcher and matched with the 'HYDRAFACIAL + D-TAN + EYEBROW THREADING' (₹1,999). I'd love to book it!"
    },
    detox: {
      title: "GOLD FACIAL + D-TAN (FACE + NECK) + PEDICURE",
      price: "₹1,500",
      desc: "A full skin detox and brighten combo. Removes tanning from the face and neck, and rejuvenates feet with a deep pedicure.",
      features: [
        "Genuine Gold Facial treatment",
        "Face + Neck D-Tan application",
        "Soothing foot pedicure session",
        "Anti-tan cell revitalization"
      ],
      waText: "Hi Pink Love Studio! 🌸 I completed the Look Matcher and matched with the 'GOLD FACIAL + D-TAN (FACE + NECK) + PEDICURE' (₹1,500). I'd love to book an appointment!"
    }
  },
  hair: {
    waves: {
      title: "HAIRWASH + BUTTERFLY HAIRCUT",
      price: "₹800",
      desc: "Transform your hair with bouncy, trendy layers. Includes a deep professional wash and iron-style finish.",
      features: [
        "Shampoo wash & conditioning",
        "Butterfly haircut styling",
        "Volumizing blowout curls",
        "Premium styling serum application"
      ],
      waText: "Hi Pink Love Studio! 🌸 I completed the Look Matcher and matched with the 'HAIRWASH + BUTTERFLY HAIRCUT' (₹800). I'd love to book this style!"
    },
    sleek: {
      title: "Smoothning / Keratin / Botex",
      price: "₹3,000 - ₹15,000",
      desc: "Eliminates frizz and creates long-lasting sleekness. Custom keratin or smoothing treatments tailored to your hair type.",
      features: [
        "Keratin-rich deep hair treatment",
        "Professional straight blow dry & iron finish",
        "Silk-shine protective serum application",
        "Post-treatment care counseling"
      ],
      waText: "Hi Pink Love Studio! 🌸 I completed the Look Matcher and matched with the Hair Treatment: 'Smoothning / Keratin / Botex' (₹3,000 - ₹15,000). I'd like to consult for my hair!"
    },
    traditional: {
      title: "Advance Saree Prepleating",
      price: "₹700",
      desc: "Traditional prepleating services paired with elegant hair setups. Perfect for school, college, or family celebrations.",
      features: [
        "Advance saree prepleating & box folding",
        "Draping & waist pin alignment",
        "Basic haircut & eyebrow threading",
        "Neat hair styling finish"
      ],
      waText: "Hi Pink Love Studio! 🌸 I completed the Look Matcher and matched with the 'Advance Saree Prepleating' (₹700). I'd love to book it!"
    }
  }
};

const BRANDS = [
  { name: "MAC Cosmetics", logo: "M·A·C" },
  { name: "Estée Lauder", logo: "ESTÉE LAUDER" },
  { name: "NARS Cosmetics", logo: "NARS" },
  { name: "Huda Beauty", logo: "HUDA BEAUTY" },
  { name: "Kryolan Professional", logo: "KRYOLAN" },
  { name: "Charlotte Tilbury", logo: "Charlotte Tilbury" },
  { name: "Anastasia Beverly Hills", logo: "ANASTASIA" },
  { name: "Laneige", logo: "LANEIGE" },
];

const CLOUDINARY_VIDEOS: IgPost[] = [
  {
    id: "c_vid_1",
    media_type: "VIDEO",
    permalink: "https://www.instagram.com/pinklove_beautystudio/",
    caption: "Experience premium bridal & beauty rituals at Pink Love Beauty Studio! 💖",
    timestamp: new Date().toISOString(),
    cloudinaryPublicId: import.meta.env.VITE_CLOUDINARY_VIDEO_1_ID || "v1782022649/WhatsApp_Video_2026-06-18_at_20.10.19_u02gvp",
  },
  {
    id: "c_vid_2",
    media_type: "VIDEO",
    permalink: "https://www.instagram.com/pinklove_beautystudio/",
    caption: "Flawless HD Makeup and elegant styling session for our beautiful bride! ✨💍",
    timestamp: new Date().toISOString(),
    cloudinaryPublicId: "v1782022984/WhatsApp_Video_2026-06-18_at_20.10.21_pgwcqd",
  },
  {
    id: "c_vid_3",
    media_type: "VIDEO",
    permalink: "https://www.instagram.com/pinklove_beautystudio/",
    caption: "Healthy hair transformation: Nourishing hair spa and styling finish. 💇‍♀️✨",
    timestamp: new Date().toISOString(),
    cloudinaryPublicId: "v1782023182/WhatsApp_Video_2026-06-18_at_20.10.22_zqvb5z",
  },
  {
    id: "c_vid_4",
    media_type: "VIDEO",
    permalink: "https://www.instagram.com/pinklove_beautystudio/",
    caption: "Professional haircut and custom layers for a fresh, volume look! 💇‍♀️💖",
    timestamp: new Date().toISOString(),
    cloudinaryPublicId: "v1782023428/WhatsApp_Video_2026-06-18_at_20.10.25_nqm7sw",
  },
  {
    id: "c_vid_5",
    media_type: "VIDEO",
    permalink: "https://www.instagram.com/pinklove_beautystudio/",
    caption: "Traditional South Indian bridal preparation and makeup highlights. 💍🌸",
    timestamp: new Date().toISOString(),
    cloudinaryPublicId: "v1782023413/WhatsApp_Video_2026-06-18_at_20.10.26_fex5zv",
  },
  {
    id: "c_vid_6",
    media_type: "VIDEO",
    permalink: "https://www.instagram.com/pinklove_beautystudio/",
    caption: "Flawless saree draping and styling to complete the perfect bridal look. 👗✨",
    timestamp: new Date().toISOString(),
    cloudinaryPublicId: "v1782023397/WhatsApp_Video_2026-06-18_at_20.10.27_mgksgd",
  },
];

const FAQ_ITEMS = [
  {
    q: "How do I book an appointment?",
    a: `Message us on WhatsApp at +91 ${WA_NUMBER_FORMATTED}. We recommend booking 1–2 weeks ahead for bridal packages.`,
  },
  {
    q: "Do you offer bridal makeup trials?",
    a: "Yes! We strongly recommend a bridal trial 1–2 weeks before your wedding day so we can perfect the look together.",
  },
  {
    q: "What does a bridal package cost?",
    a: "Pricing depends on the services chosen (HD makeup, hair, jewelry, etc.). Contact us on WhatsApp for a personalised quote.",
  },
  {
    q: "What is a Korean Glass Skin Facial?",
    a: "A multi-step hydrating treatment that cleanses, exfoliates and floods the skin with moisture for a dewy, mirror-like glow. The session takes 60–75 minutes.",
  },
  {
    q: "Where are you located?",
    a: "No 04 Udaiyaar Street, Ninnakarai Road, Kattankulathur, Tamil Nadu 603203 — easily accessible from SRM University and the GST Road corridor.",
  },
  {
    q: "What are your opening hours?",
    a: "Monday to Sunday: 10:00 AM – 9:00 PM.",
  },
];

const REVIEWS = [
  {
    name: "Priya Sundar",
    service: "HD Bridal Makeover",
    text: "Absolutely loved my HD bridal makeover! The makeup was flawless, felt lightweight, and lasted from the early morning mandap till the late-night reception. The team was so calm, friendly, and professional.",
    date: "2 weeks ago",
    stars: 5,
    tag: "Verified Bride"
  },
  {
    name: "Keerthana Rajesh",
    service: "Korean Glass Skin Facial",
    text: "Got the Korean Glass Skin facial and my skin was literally glowing for weeks! The studio has a wonderful clean, aesthetic vibe and the therapists pamper you with so much patience and care. Recommended!",
    date: "1 month ago",
    stars: 5,
    tag: "Skincare Guest"
  },
  {
    name: "Meera Krishnan",
    service: "Hair Spa & Butterfly Cut",
    text: "The butterfly haircut and the relaxing hair spa treatment were amazing. The volumizing layers look stunning. The studio feels super premium and the stylists really listen to what you want.",
    date: "3 weeks ago",
    stars: 5,
    tag: "Regular Client"
  },
  {
    name: "Ananya Venkatesh",
    service: "Engagement Makeup & Saree Prepleating",
    text: "Booked the engagement combo with saree prepleating. The saree drape was ready in literally 2 minutes, and the makeup stayed completely sweat-proof through the outdoor event. Thank you team Pink Love!",
    date: "2 months ago",
    stars: 5,
    tag: "Verified Guest"
  },
  {
    name: "Divya Karthik",
    service: "Hydrafacial & Grooming",
    text: "Super friendly staff, clean environment and very value-for-money combo packages. Booking via WhatsApp is extremely easy. This is definitely my go-to parlour in Kattankulathur now.",
    date: "1 month ago",
    stars: 5,
    tag: "Regular Client"
  },
  {
    name: "Shalini Chandran",
    service: "Advanced Hair Treatment",
    text: "Got global highlights and keratin treatment here. My hair feels incredibly soft, smooth, and healthy now. They use genuine professional products and explain every step clearly.",
    date: "5 days ago",
    stars: 5,
    tag: "Haircare Guest"
  }
];

const TIME_SLOTS = [
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
  "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM",
  "08:00 PM"
];

// Core App Layout Component
import { Admin } from "@/components/Admin";
import { CartPage } from "@/components/CartPage";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default function App() {
  if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
    return (
      <>
        <Admin />
        <Toaster closeButton position="top-right" />
      </>
    );
  }

  if (typeof window !== "undefined" && window.location.pathname.startsWith("/cart")) {
    return (
      <>
        <CartPage />
        <Toaster closeButton position="top-right" />
      </>
    );
  }

  if (typeof window !== "undefined" && window.location.pathname.startsWith("/gallery")) {
    return (
      <>
        <GalleryPage />
        <Toaster closeButton position="top-right" />
      </>
    );
  }

  const todayStr = (() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  })();

  const [cart, setCart] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pl_booking_cart");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [activeReel, setActiveReel] = useState<IgPost | null>(null);

  useEffect(() => {
    localStorage.setItem("pl_booking_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("pl_cart_change"));
  }, [cart]);

  useEffect(() => {
    if (activeReel !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeReel]);

  // Auto-scroll on mount if hash exists (e.g. returning from Cart Page)
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash;
      const  targetId = hash.replace("#", "");
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 150);
    }
  }, []);

  const addToCart = (id: string, name: string, price: string, type: "combo" | "individual") => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        toast.success(`Incremented quantity for ${name}`);
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      toast.success(`Added ${name} to your Booking List!`);
      return [...prev, { id, name, price, quantity: 1, type }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    toast.info("Removed service from booking list");
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item)));
  };

  return (
    <div className="relative overflow-x-hidden bg-background text-foreground pb-24 md:pb-0">
      <Toaster closeButton position="top-right" />
      <Petals />
      <Nav />
      <Hero />
      <Marquee />
      <About />
      <Certifications />
      <Services />
      <MenuBook cart={cart} onAddToCart={addToCart} />
      <LookFinder />
      <Gallery />
      <Reels onOpenReel={setActiveReel} />
      <Reviews />
      <FAQ />
      <Visit />
      <Footer />
      <MobileStickyNav />

      {/* Lightbox Video Modal at root level */}
      <VideoModal
        post={activeReel}
        isOpen={!!activeReel}
        onClose={() => setActiveReel(null)}
      />

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <a
          href="/cart"
          className="fixed bottom-[7.5rem] md:bottom-6 right-4 sm:right-6 z-[9999] bg-gradient-to-r from-[color:var(--rose)] to-[color:var(--petal)] text-white rounded-full p-4.5 shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border border-white/20 animate-pulse-gentle"
        >
          <div className="relative">
            <ShoppingBag className="w-6 h-6" />
            <span className="absolute -top-2.5 -right-2.5 bg-white text-[color:var(--rose)] font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-[color:var(--rose)]/20 shadow-md">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          <span className="font-display font-extrabold text-sm tracking-wide pr-1 hidden sm:inline">
            View Bookings
          </span>
        </a>
      )}
    </div>
  );
}


// Subcomponents
function Petals() {
  const [petals, setPetals] = useState<Array<{ left: number; delay: number; duration: number; size: number }>>([]);
  useEffect(() => {
    setPetals(
      Array.from({ length: 18 }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 12,
        duration: 14 + Math.random() * 14,
        size: 10 + Math.random() * 18,
      })),
    );
  }, []);
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {petals.map((p, i) => (
        <span
          key={i}
          className="absolute block rounded-full"
          style={{
            left: `${p.left}%`,
            top: "-10vh",
            width: p.size,
            height: p.size,
            background: "radial-gradient(circle at 30% 30%, var(--petal), var(--rose))",
            opacity: 0.55,
            filter: "blur(0.5px)",
            animation: `float-petal ${p.duration}s linear ${p.delay}s infinite`,
            borderRadius: "60% 40% 50% 50% / 50% 60% 40% 50%",
          }}
        />
      ))}
    </div>
  );
}

function Nav() {
  return (
    <header className="absolute top-0 left-0 w-full z-50 bg-gradient-to-b from-black/60 to-transparent pt-2">
      <div className="flex w-full items-center justify-between px-4 sm:px-10 lg:px-16 py-4 sm:py-6">
        <a href="#top" className="flex items-center gap-2 sm:gap-4">
          <img
            src={logo}
            alt="Pink Love Beauty Studio Logo"
            width={80}
            height={80}
            className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-full object-cover shadow-[var(--shadow-soft)] border border-white/20 transition-all duration-300"
          />
          <span className="flex flex-col leading-tight">
            <span className="font-script text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white">Pink Love</span>
            <span className="text-[8px] sm:text-[10px] md:text-xs tracking-[0.35em] uppercase text-white/70">Beauty Studio</span>
          </span>
        </a>
        <nav className="hidden lg:flex items-center gap-8 text-sm tracking-wide">
          {["About", "Services", "Menu", "Reviews", "Gallery", "Reels", "Visit"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="text-white/80 hover:text-white transition hover-underline-expand py-1 font-medium drop-shadow-md">
              {l}
            </a>
          ))}
        </nav>
        <a
          href="#menu"
          className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-white px-3.5 py-1.5 sm:px-6 sm:py-2.5 text-[10px] sm:text-sm text-black font-bold hover:bg-[color:var(--rose)] hover:text-white transition-all duration-300 shadow-lg hover:scale-105 active:scale-95 whitespace-nowrap"
        >
          Book Now
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative z-10 w-full min-h-[100svh] flex items-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/landing_page.mp4" type="video/mp4" />
        </video>
        {/* Elegant dark/rose overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-[color:var(--rose)] opacity-10 mix-blend-color" />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-10 lg:px-16 py-20 pt-36 sm:pt-40 md:pt-44 lg:pt-48 flex flex-col items-start justify-center text-left h-full">
        <div className="max-w-2xl flex flex-col items-start">
          <p className="text-white/80 uppercase tracking-[0.25em] text-[10px] sm:text-xs font-bold mb-8 animate-fade-up border-l-2 border-[color:var(--rose)] pl-4">
            Kattankulathur's Premier Beauty Studio
          </p>
          
          <h1 className="font-display text-4xl sm:text-6xl lg:text-[6.5rem] leading-[1.05] animate-fade-up text-white" style={{ animationDelay: "0.1s" }}>
            Where <span className="font-script text-[color:var(--rose)] text-5xl sm:text-7xl lg:text-[7.5rem] font-normal inline-block pr-2">elegance</span>
            <br />
            meets <em className="not-italic text-white">care.</em>
          </h1>
          
          <p className="mt-8 text-base sm:text-lg text-white/80 animate-fade-up font-light max-w-xl leading-relaxed" style={{ animationDelay: "0.2s" }}>
            A women-led aesthetic studio specializing in HD bridal makeovers, Korean glass-skin facials, and advanced styling.
          </p>
          
          <div className="mt-12 flex flex-col sm:flex-row gap-4 animate-fade-up w-full sm:w-auto" style={{ animationDelay: "0.3s" }}>
            <a
              href="#menu"
              className="inline-flex items-center justify-center bg-white text-black px-6 sm:px-10 py-3.5 sm:py-4 text-xs sm:text-sm uppercase tracking-widest font-bold hover:bg-[color:var(--rose)] hover:text-white transition-colors duration-300 shadow-xl w-full sm:w-auto"
            >
              Book a Consultation
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center border border-white/40 bg-black/20 backdrop-blur-sm text-white px-6 sm:px-10 py-3.5 sm:py-4 text-xs sm:text-sm uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-colors duration-300 w-full sm:w-auto"
            >
              Explore Services
            </a>
          </div>

          <dl className="mt-20 flex flex-wrap gap-x-12 gap-y-8 animate-fade-up border-t border-white/10 pt-8 w-full max-w-xl" style={{ animationDelay: "0.4s" }}>
            {[
              { k: "5.0★", v: "Google rating" },
              { k: "HD", v: "Bridal makeup" },
              { k: "All-in-1", v: "Beauty studio" },
            ].map((s) => (
              <div key={s.v} className="text-left">
                <dt className="font-display text-3xl sm:text-4xl text-[color:var(--rose)] font-bold">{s.k}</dt>
                <dd className="text-[10px] sm:text-xs uppercase tracking-widest text-white/70 mt-2 font-bold">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = ["HD Bridal Makeover", "Glass Skin Facial", "Hydrafacial", "Hair Spa", "Manicure & Pedicure", "Bridal Jewelry", "Korean Glow", "Advanced Haircuts"];
  return (
    <section className="relative z-10 border-y border-foreground/10 bg-[color:var(--blush)]/40 py-6 overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...items, ...items].map((t, i) => (
          <span key={i} className="mx-8 font-display text-2xl sm:text-3xl text-[color:var(--rose)]/80 flex items-center gap-8">
            {t} <span className="text-[color:var(--gold)]">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="relative z-10 px-6 py-24">
      <div className="mx-auto max-w-6xl grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 flex items-center gap-6">
          <img
            src={logo}
            alt="Pink Love Beauty Studio Logo"
            width={144}
            height={144}
            className="h-28 w-28 sm:h-36 sm:w-36 rounded-full object-cover shadow-[var(--shadow-petal)] border-2 border-[color:var(--rose)]/30 transition-transform duration-500 hover:scale-105"
          />
          <div>
            <p className="font-script text-3xl text-[color:var(--rose)]">our story</p>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl leading-tight">A studio built on love & glow.</h2>
          </div>
        </div>
        <div className="lg:col-span-7 space-y-5 text-foreground/75 text-lg leading-relaxed">
          <p>
            Welcome to <strong className="text-foreground">Pink Love Beauty</strong>, where elegance meets care.
            We offer a wide range of professional beauty services — from skincare and makeup to hair
            styling and bridal makeovers — all in a warm, relaxing environment.
          </p>
          <p>
            Pink Love Beauty Studio is a women-led aesthetic studio in Kattankulathur, specializing in
            flawless HD bridal makeovers, stylish haircuts, facials, and grooming. Let us pamper you
            with love, style, and a touch of pink perfection.
          </p>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="relative z-10 px-6 py-24 bg-gradient-to-b from-background to-[color:var(--blush)]/40">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
          <div>
            <p className="font-script text-3xl text-[color:var(--rose)]">what we do</p>
            <h2 className="font-display text-5xl sm:text-6xl mt-1">Signature services</h2>
          </div>
          <p className="max-w-md text-foreground/70">
            Every ritual is hand-crafted by our team of women artists — bridal, beauty, glow and glam.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((s, i) => (
            <article
              key={s.name}
              className="group relative overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-petal)] transition-all duration-500 hover:-translate-y-2"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={s.img}
                  alt={s.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[color:var(--rose)] mb-2">
                  <span>0{i + 1}</span> <span className="h-px w-8 bg-[color:var(--rose)]/40" />
                </div>
                <h3 className="font-display text-2xl leading-tight">{s.name}</h3>
                <p className="mt-2 text-sm text-foreground/70">{s.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function LookFinder() {
  const [step, setStep] = useState(1);
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);

  const handleOccasionSelect = (id: string) => {
    setSelectedOccasion(id);
    setSelectedVibe(null);
    setStep(2);
  };

  const handleVibeSelect = (id: string) => {
    setSelectedVibe(id);
    setStep(3);
  };

  const match = selectedOccasion && selectedVibe ? MATCHES[selectedOccasion]?.[selectedVibe] : null;

  return (
    <section id="look-finder" className="relative z-10 px-6 py-24 bg-gradient-to-b from-[color:var(--blush)]/20 to-background">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-14">
          <p className="font-script text-3xl text-[color:var(--rose)]">personalized glam</p>
          <h2 className="font-display text-5xl sm:text-6xl mt-1">Look Matcher</h2>
          <p className="mt-4 text-foreground/70 max-w-xl mx-auto">
            Answer two quick questions to find the perfect makeover or treatment package tailored for your exact style.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className={`h-2.5 rounded-full transition-all duration-300 ${step >= 1 ? 'w-10 bg-[color:var(--rose)]' : 'w-2.5 bg-foreground/10'}`} />
          <div className={`h-2.5 rounded-full transition-all duration-300 ${step >= 2 ? 'w-10 bg-[color:var(--rose)]' : 'w-2.5 bg-foreground/10'}`} />
          <div className={`h-2.5 rounded-full transition-all duration-300 ${step >= 3 ? 'w-10 bg-[color:var(--rose)]' : 'w-2.5 bg-foreground/10'}`} />
        </div>

        {/* Quiz Steps */}
        <div className="min-h-[380px] flex items-center justify-center">
          {step === 1 && (
            <div className="w-full animate-fade-in">
              <h3 className="text-xl sm:text-2xl font-display text-center mb-6 text-foreground/90">
                1. What is the occasion you are preparing for?
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {OCCASIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleOccasionSelect(opt.id)}
                    className="flex items-start gap-4 p-5 rounded-2xl bg-card border border-[color:var(--rose)]/15 text-left shadow-[var(--shadow-soft)] card-hover-lift"
                  >
                    <span className="text-3xl p-2.5 rounded-xl bg-[color:var(--blush)]/35">{opt.icon}</span>
                    <div>
                      <h4 className="font-semibold text-lg text-foreground">{opt.label}</h4>
                      <p className="text-xs text-foreground/60 mt-1">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && selectedOccasion && (
            <div className="w-full animate-fade-in">
              <button
                onClick={() => setStep(1)}
                className="text-xs text-[color:var(--rose)] hover:underline mb-4 inline-flex items-center gap-1 font-medium"
              >
                ← Back to Occasion
              </button>
              <h3 className="text-xl sm:text-2xl font-display text-center mb-6 text-foreground/90">
                2. Select your desired finish or vibe
              </h3>
              <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                {VIBES[selectedOccasion]?.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleVibeSelect(opt.id)}
                    className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-[color:var(--rose)]/15 shadow-[var(--shadow-soft)] card-hover-lift"
                  >
                    <span className="text-4xl mb-4 p-3 rounded-full bg-[color:var(--blush)]/35">{opt.icon}</span>
                    <h4 className="font-semibold text-base text-foreground leading-snug">{opt.label}</h4>
                    <p className="text-xs text-foreground/60 mt-2 line-clamp-2">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && match && (
            <div className="w-full animate-fade-in max-w-xl mx-auto">
              <div className="rounded-[32px] bg-card border border-[color:var(--rose)]/25 p-8 shadow-[0_20px_50px_rgba(219,112,147,0.08)] backdrop-blur relative overflow-hidden">
                {/* Gold tag */}
                <div className="absolute top-0 right-0 bg-[color:var(--gold)]/15 border-l border-b border-[color:var(--gold)]/20 px-4 py-1.5 rounded-bl-2xl text-[10px] uppercase tracking-widest text-[color:var(--gold)] font-bold">
                  Recommended Package
                </div>

                <p className="text-xs uppercase tracking-widest text-[color:var(--rose)] font-bold mb-1">Your Perfect Match</p>
                <h3 className="font-display text-3xl text-foreground leading-tight">{match.title}</h3>
                
                <div className="mt-3 inline-block px-3.5 py-1 rounded-full bg-[color:var(--blush)]/30 text-[color:var(--rose)] text-sm font-semibold">
                  Estimated Range: {match.price}
                </div>

                <p className="mt-4 text-sm text-foreground/75 leading-relaxed">
                  {match.desc}
                </p>

                <div className="mt-6 border-t border-[color:var(--rose)]/10 pt-6">
                  <h4 className="text-xs uppercase tracking-widest text-foreground/60 font-semibold mb-3">Package Highlights:</h4>
                  <ul className="space-y-2">
                    {match.features.map((f, index) => (
                      <li key={index} className="flex items-center gap-2.5 text-xs text-foreground/80">
                        <span className="text-[color:var(--gold)] font-bold text-sm">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <a
                    href={`https://api.whatsapp.com/send/?phone=91${WA_NUMBER}&text=${encodeURIComponent(match.waText)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center w-full gap-2 rounded-2xl bg-foreground hover:bg-[color:var(--rose)] text-background hover:text-white px-6 py-4 font-bold transition-all duration-300 shadow-[var(--shadow-soft)]"
                  >
                    💬 Secure this look on WhatsApp
                  </a>
                  <button
                    onClick={() => {
                      setStep(1);
                      setSelectedOccasion(null);
                      setSelectedVibe(null);
                    }}
                    className="mt-4 text-xs text-foreground/50 hover:text-[color:var(--rose)] transition font-medium text-center w-full block hover:underline"
                  >
                    ← Restart Look Matcher
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Brand Partners Showcase */}
        <div className="mt-20 border-t border-[color:var(--rose)]/10 pt-16">
          <p className="text-center text-xs font-bold tracking-[0.25em] text-foreground/50 uppercase mb-8">
            The premium brands we trust on you
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60">
            {BRANDS.map((b) => (
              <span
                key={b.name}
                className="font-display text-lg sm:text-xl font-bold tracking-[0.15em] text-foreground/70 hover:text-[color:var(--rose)] transition duration-300"
              >
                {b.logo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const getBentoClasses = (index: number) => {
  // A repeating layout pattern for a grid with 3 columns:
  // - Item 0: spans 2 columns, 2 rows (2x2)
  // - Item 1: spans 1 column, 1 row (1x1)
  // - Item 2: spans 1 column, 1 row (1x1)
  // - Subsequent items: standard 1x1 cells
  if (index === 0) {
    return "md:col-span-2 md:row-span-2 min-h-[300px] md:h-[496px]";
  }
  if (index === 1 || index === 2) {
    return "md:col-span-1 md:row-span-1 min-h-[200px] md:h-[240px]";
  }
  return "md:col-span-1 md:row-span-1 min-h-[200px] md:h-[240px]";
};

function Gallery() {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dwo6zs4ft";
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .order("position", { ascending: true })
        .limit(20);
      
      if (data && data.length > 0) {
        const mapped = data.map((item) => ({
          src: item.url,
          cloudinaryId: item.cloudinary_id || undefined,
          alt: item.alt,
          position: item.position,
        }));
        setGalleryImages(mapped);
      } else {
        setGalleryImages([]);
      }
    };
    fetchGallery();

    const channel = supabase
      .channel("gallery_live_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "gallery_images" },
        () => {
          fetchGallery();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Display exactly first 6 preview images (positions 0-5) in the main page grid
  const previewImages = Array.from({ length: 6 }, (_, i) => {
    const dbImage = galleryImages.find((img) => img.position === i);
    return dbImage || DEFAULT_GALLERY[i] || DEFAULT_GALLERY[0];
  });

  // Helper to parse category and alt text
  const parseImageCategoryAndAlt = (rawAlt: string): { category: string; alt: string } => {
    const match = rawAlt.match(/^\[(.*?)\]\s*(.*)$/);
    if (match) {
      const cat = match[1].trim().toUpperCase();
      const caption = match[2].trim();
      return { category: cat, alt: caption };
    }
    
    // Keyword auto-detection
    const lower = rawAlt.toLowerCase();
    if (lower.includes("bridal") || lower.includes("bride") || lower.includes("wedding") || lower.includes("groom")) {
      return { category: "BRIDAL", alt: rawAlt };
    }
    if (lower.includes("makeup") || lower.includes("glam") || lower.includes("look") || lower.includes("couture") || lower.includes("skin") || lower.includes("facial") || lower.includes("beauty")) {
      return { category: "MAKEUP", alt: rawAlt };
    }
    if (lower.includes("fashion") || lower.includes("dress") || lower.includes("gown") || lower.includes("saree") || lower.includes("sari") || lower.includes("model")) {
      return { category: "FASHION", alt: rawAlt };
    }
    if (lower.includes("embroidery") || lower.includes("blouse") || lower.includes("stitch") || lower.includes("pleat") || lower.includes("drape")) {
      return { category: "EMBROIDERY", alt: rawAlt };
    }
    if (lower.includes("craft") || lower.includes("jewelry") || lower.includes("accessory") || lower.includes("accessories") || lower.includes("hair") || lower.includes("flower") || lower.includes("floral")) {
      return { category: "CRAFTS", alt: rawAlt };
    }
    
    // Default to BRIDAL
    return { category: "BRIDAL", alt: rawAlt };
  };

  const processedImages = previewImages.map((img) => {
    const { category, alt } = parseImageCategoryAndAlt(img.alt);
    return {
      ...img,
      category,
      displayAlt: alt,
    };
  });

  // Lightbox navigation
  const showPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeImageIndex !== null) {
      setActiveImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : processedImages.length - 1));
    }
  };

  const showNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeImageIndex !== null) {
      setActiveImageIndex((prev) => (prev !== null && prev < processedImages.length - 1 ? prev + 1 : 0));
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeImageIndex === null) return;
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "Escape") setActiveImageIndex(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeImageIndex, processedImages]);

  // Image preloading effect to prevent switching lag
  useEffect(() => {
    if (activeImageIndex === null || processedImages.length === 0) return;
    const nextIdx = (activeImageIndex + 1) % processedImages.length;
    const prevIdx = (activeImageIndex - 1 + processedImages.length) % processedImages.length;
    
    [nextIdx, prevIdx].forEach((idx) => {
      const item = processedImages[idx];
      const url = item.cloudinaryId
        ? `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${item.cloudinaryId}`
        : item.src;
      if (url) {
        const img = new Image();
        img.src = url;
      }
    });
  }, [activeImageIndex, processedImages, cloudName]);

  // Lock body scroll when lightbox is active
  useEffect(() => {
    if (activeImageIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeImageIndex]);

  return (
    <section id="gallery" className="relative z-10 px-6 py-24 bg-gradient-to-b from-transparent via-rose-50/5 to-transparent">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-14">
          <p className="font-script text-3xl text-[color:var(--rose)]">our brides</p>
          <h2 className="font-display text-5xl sm:text-6xl">Pink love portfolio</h2>
        </div>
        
        {/* Responsive Grid Layout (6 Vertical Images: 3 up, 3 down on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {processedImages.map((item, i) => {
            const imageUrl = item.cloudinaryId
              ? `https://res.cloudinary.com/${cloudName}/image/upload/w_800,f_auto,q_auto/${item.cloudinaryId}`
              : item.src;

            return (
              <div
                key={i}
                onClick={() => setActiveImageIndex(i)}
                className="relative w-full aspect-[2/3] overflow-hidden rounded-3xl group shadow-[var(--shadow-soft)] transition-all duration-300 hover:shadow-[0_20px_40px_rgba(219,112,147,0.2)] bg-card cursor-pointer"
              >
                <img
                  src={imageUrl}
                  alt={item.displayAlt || `Pink Love bridal portfolio ${i + 1}`}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.2_0.1_5/0.7)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-amber-400 text-[10px] font-bold tracking-widest uppercase mb-1 block">
                    {item.category}
                  </span>
                  <p className="text-white font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {item.displayAlt}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* View Full Portfolio Button */}
        <div className="flex justify-center mt-12">
          <button
            onClick={() => {
              window.location.href = "/gallery";
            }}
            className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-8 py-4 font-bold text-sm tracking-wide shadow-lg shadow-rose-200/50 hover:shadow-rose-300/60 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 cursor-pointer border border-white/10"
          >
            🌸 View Full Gallery
          </button>
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeImageIndex !== null && (() => {
        const item = processedImages[activeImageIndex];
        const imageUrl = item.cloudinaryId
          ? `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${item.cloudinaryId}`
          : item.src;

        return (
          <div 
            className="fixed inset-0 z-[50000] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 select-none"
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveImageIndex(null)}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-[50001] w-10 h-10 md:w-12 md:h-12 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-amber-400 flex items-center justify-center transition-all duration-200 cursor-pointer border border-white/15 shadow-xl hover:scale-105 active:scale-95"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Left Arrow */}
            <button
              onClick={showPrev}
              className="absolute left-4 md:left-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-all duration-200 cursor-pointer border border-white/10 shadow-lg hover:scale-105 active:scale-95 z-20"
            >
              <span className="text-lg md:text-xl">←</span>
            </button>

            {/* Right Arrow */}
            <button
              onClick={showNext}
              className="absolute right-4 md:right-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-all duration-200 cursor-pointer border border-white/10 shadow-lg hover:scale-105 active:scale-95 z-20"
            >
              <span className="text-lg md:text-xl">→</span>
            </button>

            {/* Image Container */}
            <div 
              className="relative max-w-4xl max-h-[80vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                key={activeImageIndex}
                src={imageUrl}
                alt={item.displayAlt || "Full portfolio image"}
                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/10 transition-opacity duration-300 animate-fade-in"
              />
            </div>

            {/* Info / Alt Caption */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 md:gap-3 bg-black/40 px-4 md:px-6 py-2 rounded-full border border-white/5 backdrop-blur-sm max-w-[90vw] text-center">
              <span className="text-amber-400 text-[10px] md:text-xs font-bold tracking-widest uppercase">
                {item.category}
              </span>
              <span className="text-white/40 text-xs hidden xs:inline">|</span>
              <span className="text-white/95 text-xs md:text-sm font-semibold tracking-wide truncate max-w-[220px] sm:max-w-none">
                {item.displayAlt}
              </span>
            </div>
          </div>
        );
      })()}
    </section>
  );
}

function GalleryPage() {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dwo6zs4ft";
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      const { data } = await supabase
        .from("gallery_images")
        .select("*")
        .order("position", { ascending: true })
        .limit(20);
      
      if (data && data.length > 0) {
        const mapped = data.map((item) => ({
          src: item.url,
          cloudinaryId: item.cloudinary_id || undefined,
          alt: item.alt,
          position: item.position,
        }));
        setGalleryImages(mapped);
      }
    };
    fetchGallery();
  }, []);

  // Build the list of 20 slots
  const allSlots = Array.from({ length: 20 }, (_, i) => {
    const dbImage = galleryImages.find((img) => img.position === i);
    if (dbImage) return dbImage;
    if (i < 5) return DEFAULT_GALLERY[i];
    return null;
  });

  // Filter out null slots to get active images
  const activeImages = allSlots.filter((item): item is GalleryImage => item !== null);

  // Helper to parse category and alt text
  const parseImageCategoryAndAlt = (rawAlt: string): { category: string; alt: string } => {
    const match = rawAlt.match(/^\[(.*?)\]\s*(.*)$/);
    if (match) {
      const cat = match[1].trim().toUpperCase();
      const caption = match[2].trim();
      return { category: cat, alt: caption };
    }
    
    // Keyword auto-detection
    const lower = rawAlt.toLowerCase();
    if (lower.includes("bridal") || lower.includes("bride") || lower.includes("wedding") || lower.includes("groom")) {
      return { category: "BRIDAL", alt: rawAlt };
    }
    if (lower.includes("makeup") || lower.includes("glam") || lower.includes("look") || lower.includes("couture") || lower.includes("skin") || lower.includes("facial") || lower.includes("beauty")) {
      return { category: "MAKEUP", alt: rawAlt };
    }
    if (lower.includes("fashion") || lower.includes("dress") || lower.includes("gown") || lower.includes("saree") || lower.includes("sari") || lower.includes("model")) {
      return { category: "FASHION", alt: rawAlt };
    }
    if (lower.includes("embroidery") || lower.includes("blouse") || lower.includes("stitch") || lower.includes("pleat") || lower.includes("drape")) {
      return { category: "EMBROIDERY", alt: rawAlt };
    }
    if (lower.includes("craft") || lower.includes("jewelry") || lower.includes("accessory") || lower.includes("accessories") || lower.includes("hair") || lower.includes("flower") || lower.includes("floral")) {
      return { category: "CRAFTS", alt: rawAlt };
    }
    
    // Default to BRIDAL
    return { category: "BRIDAL", alt: rawAlt };
  };

  // Map and parse categories for all active images
  const processedImages = activeImages.map((img) => {
    const { category, alt } = parseImageCategoryAndAlt(img.alt);
    return {
      ...img,
      category,
      displayAlt: alt,
    };
  });

  // Lightbox navigation
  const showPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeImageIndex !== null) {
      setActiveImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : processedImages.length - 1));
    }
  };

  const showNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeImageIndex !== null) {
      setActiveImageIndex((prev) => (prev !== null && prev < processedImages.length - 1 ? prev + 1 : 0));
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeImageIndex === null) return;
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "Escape") setActiveImageIndex(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeImageIndex, processedImages]);

  // Image preloading effect to prevent switching lag
  useEffect(() => {
    if (activeImageIndex === null || processedImages.length === 0) return;
    const nextIdx = (activeImageIndex + 1) % processedImages.length;
    const prevIdx = (activeImageIndex - 1 + processedImages.length) % processedImages.length;
    
    [nextIdx, prevIdx].forEach((idx) => {
      const item = processedImages[idx];
      const url = item.cloudinaryId
        ? `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${item.cloudinaryId}`
        : item.src;
      if (url) {
        const img = new Image();
        img.src = url;
      }
    });
  }, [activeImageIndex, processedImages, cloudName]);

  // Lock body scroll when lightbox is active
  useEffect(() => {
    if (activeImageIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeImageIndex]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col p-4 sm:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center py-6 border-b border-white/10 shrink-0">
        <div>
          <p className="font-script text-3xl text-pink-300">our gallery</p>
          <h3 className="font-display text-4xl sm:text-5xl text-white mt-1">Full Portfolio Gallery</h3>
        </div>
        <button
          onClick={() => {
            window.location.href = "/";
          }}
          className="inline-flex items-center gap-2 rounded-full bg-white/5 hover:bg-white/10 text-white px-5 py-2.5 text-xs font-bold transition-all duration-200 cursor-pointer border border-white/10 shadow-lg hover:scale-105 active:scale-95"
        >
          ← Back to Home
        </button>
      </div>

      {/* Grid Showcase */}
      <div className="max-w-7xl mx-auto w-full py-12 flex-grow space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {processedImages.map((item, i) => {
            const imageUrl = item.cloudinaryId
              ? `https://res.cloudinary.com/${cloudName}/image/upload/w_800,f_auto,q_auto/${item.cloudinaryId}`
              : item.src;

            return (
              <div
                key={item.position !== undefined ? item.position : i}
                onClick={() => setActiveImageIndex(i)}
                className="relative w-full aspect-[2/3] overflow-hidden rounded-3xl group shadow-2xl border border-white/5 transition-all duration-300 bg-zinc-900 cursor-pointer hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(219,112,147,0.2)]"
              >
                <img
                  src={imageUrl}
                  alt={item.displayAlt || `Pink Love bridal portfolio ${(item.position !== undefined ? item.position : i) + 1}`}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-amber-400 text-[10px] font-bold tracking-widest uppercase mb-1 block">
                    {item.category}
                  </span>
                  <p className="text-white font-bold text-sm transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                    {item.displayAlt}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {processedImages.length === 0 && (
          <div className="text-center py-20 text-zinc-500 space-y-2">
            <span className="text-4xl block">🌸</span>
            <p className="font-medium text-sm">No images in the gallery yet.</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {activeImageIndex !== null && (() => {
        const item = processedImages[activeImageIndex];
        const imageUrl = item.cloudinaryId
          ? `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${item.cloudinaryId}`
          : item.src;

        return (
          <div 
            className="fixed inset-0 z-[50000] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 select-none"
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveImageIndex(null)}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-[50001] w-10 h-10 md:w-12 md:h-12 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-amber-400 flex items-center justify-center transition-all duration-200 cursor-pointer border border-white/15 shadow-xl hover:scale-105 active:scale-95"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Left Arrow */}
            <button
              onClick={showPrev}
              className="absolute left-4 md:left-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-all duration-200 cursor-pointer border border-white/10 shadow-lg hover:scale-105 active:scale-95 z-20"
            >
              <span className="text-lg md:text-xl">←</span>
            </button>

            {/* Right Arrow */}
            <button
              onClick={showNext}
              className="absolute right-4 md:right-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-all duration-200 cursor-pointer border border-white/10 shadow-lg hover:scale-105 active:scale-95 z-20"
            >
              <span className="text-lg md:text-xl">→</span>
            </button>

            {/* Image Container */}
            <div 
              className="relative max-w-4xl max-h-[80vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                key={activeImageIndex}
                src={imageUrl}
                alt={item.displayAlt || "Full portfolio image"}
                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/10 transition-opacity duration-300 animate-fade-in"
              />
            </div>

            {/* Info / Alt Caption */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 md:gap-3 bg-black/40 px-4 md:px-6 py-2 rounded-full border border-white/5 backdrop-blur-sm max-w-[90vw] text-center">
              <span className="text-amber-400 text-[10px] md:text-xs font-bold tracking-widest uppercase">
                {item.category}
              </span>
              <span className="text-white/40 text-xs hidden xs:inline">|</span>
              <span className="text-white/95 text-xs md:text-sm font-semibold tracking-wide truncate max-w-[220px] sm:max-w-none">
                {item.displayAlt}
              </span>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// Video Testimonials Lightbox & Carousel
interface VideoModalProps {
  post: IgPost | null;
  isOpen: boolean;
  onClose: () => void;
}

function VideoModal({ post, isOpen, onClose }: VideoModalProps) {
  if (!isOpen || !post) return null;

  const { permalink, localVideoUrl, cloudinaryPublicId } = post;
  const embedUrl = permalink.split("?")[0].replace(/\/$/, "") + "/embed/";

  // Cloudinary URL construction with auto format and quality
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dwo6zs4ft";
  const cloudinaryUrl = cloudinaryPublicId
    ? `https://res.cloudinary.com/${cloudName}/video/upload/f_auto,q_auto/${cloudinaryPublicId}`
    : null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md transition-opacity duration-300">
      {/* Click outside to close (disabled per user request) */}
      <div className="absolute inset-0" />
      
      <div className="relative w-full max-w-sm bg-zinc-950 rounded-[32px] border border-white/10 overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] z-10 transform scale-100 transition-all duration-300 flex flex-col">
        {/* Header / Close button */}
        <div className="absolute right-4 top-4 z-20">
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur transition-all duration-200 border border-white/10 cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Video / Iframe container */}
        <div className="relative w-full bg-black flex items-center justify-center p-1 aspect-[9/16]">
          {cloudinaryUrl ? (
            <video
              src={cloudinaryUrl}
              controls
              autoPlay
              playsInline
              loop
              preload="metadata"
              className="w-full h-full rounded-2xl object-contain"
            />
          ) : localVideoUrl ? (
            <video
              src={localVideoUrl}
              controls
              autoPlay
              playsInline
              loop
              preload="metadata"
              className="w-full h-full rounded-2xl object-contain"
            />
          ) : (
            <iframe
              src={embedUrl}
              className="w-full h-full border-0 rounded-2xl"
              scrolling="no"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            />
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-zinc-950 border-t border-white/5 flex justify-between items-center text-xs">
          <span className="text-white/40">Pink Love Video Testimonial</span>
          <a
            href={permalink}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-[color:var(--rose)] hover:underline flex items-center gap-1"
          >
            View on Instagram →
          </a>
        </div>
      </div>
    </div>
  );
}

function ReelCard({ post, onOpen }: { post: IgPost; onOpen: (post: IgPost) => void }) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dwo6zs4ft";
  const [isIntersecting, setIsIntersecting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: "100px" } // trigger when near to viewport
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isIntersecting) {
      videoRef.current.play().catch(() => {
        // Autoplay policy blocker
      });
    } else {
      videoRef.current.pause();
    }
  }, [isIntersecting]);

  const thumb = post.cloudinaryPublicId
    ? `https://res.cloudinary.com/${cloudName}/video/upload/c_fill,g_center,h_640,w_360/f_auto,q_auto/${post.cloudinaryPublicId}.jpg`
    : (post.thumbnail_url ?? post.media_url ?? "");

  const videoUrl = post.cloudinaryPublicId
    ? `https://res.cloudinary.com/${cloudName}/video/upload/f_auto,q_auto/${post.cloudinaryPublicId}`
    : post.localVideoUrl;
  
  return (
    <button
      ref={containerRef}
      onClick={() => onOpen(post)}
      className="block w-full text-left rounded-[28px] bg-zinc-900 overflow-hidden border border-white/5 hover:border-[color:var(--rose)]/30 hover:shadow-[0_15px_30px_rgba(219,112,147,0.15)] transition-all duration-300 group relative aspect-[9/16]"
      aria-label={post.caption?.slice(0, 60) ?? "Play Reel"}
    >
      {videoUrl && isIntersecting ? (
        <video
          ref={videoRef}
          src={videoUrl}
          muted
          loop
          playsInline
          poster={thumb}
          preload="none"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : thumb ? (
        <img
          src={thumb}
          alt={post.caption?.slice(0, 80) ?? "Instagram post"}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="h-full w-full bg-zinc-850 flex items-center justify-center">
          <span className="text-zinc-600 text-5xl">🎬</span>
        </div>
      )}



      {/* Bottom caption overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/50 to-transparent p-6 pt-16 pointer-events-none">
        <p className="text-white text-xs sm:text-sm line-clamp-2 leading-relaxed font-medium">
          {post.caption?.replace(/#\S+/g, "").trim() ?? "Watch Bridal Experience"}
        </p>
        <div className="mt-3 flex items-center justify-between text-[11px] text-white/50">
          <span>Pink Love Studio</span>
          <span className="text-[color:var(--gold)] font-bold">Watch Testimonial →</span>
        </div>
      </div>
    </button>
  );
}

interface ReelsProps {
  onOpenReel: (post: IgPost) => void;
}

function Reels({ onOpenReel }: ReelsProps) {
  return (
    <section id="reels" className="relative z-10 px-6 py-24 bg-neutral-950 text-white">
      {/* Decorative glows */}
      <div className="absolute right-10 top-1/4 h-80 w-80 rounded-full bg-[color:var(--rose)] opacity-10 blur-[100px] pointer-events-none" />
      <div className="absolute left-10 bottom-1/4 h-80 w-80 rounded-full bg-[color:var(--gold)] opacity-5 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-[0.1em] text-white uppercase">
            VIDEO TESTIMONIALS
          </h2>
          <p className="text-[color:var(--gold)] text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase mt-4">
            REAL BRIDES, REAL EXPERIENCES
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {CLOUDINARY_VIDEOS.map((post, i) => (
            <div key={post?.id ?? i} className="w-full">
              <ReelCard post={post} onOpen={onOpenReel} />
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <a
            href="https://www.instagram.com/pinklove_beautystudio/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white text-black hover:bg-[color:var(--rose)] hover:text-white px-7 py-3.5 text-sm font-bold transition duration-300"
          >
            Follow @pinklove_beautystudio →
          </a>
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: typeof REVIEWS[0] }) {
  return (
    <div className="group relative rounded-3xl bg-card p-5 sm:p-6 border border-[color:var(--rose)]/10 shadow-[var(--shadow-soft)] hover:shadow-[0_20px_45px_rgba(219,112,147,0.12)] hover:border-[color:var(--rose)]/30 hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between w-[85vw] sm:w-[380px] shrink-0 whitespace-normal">
      {/* Animated hover glow element */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[color:var(--rose)]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div>
        {/* Header with avatar initial and details */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[color:var(--rose)] to-[color:var(--petal)] text-white flex items-center justify-center font-display text-base font-bold shadow-sm transform group-hover:scale-110 transition-transform duration-300">
            {review.name[0]}
          </div>
          <div>
            <h3 className="font-display text-base text-foreground font-semibold leading-tight flex items-center gap-1.5">
              {review.name}
              <span className="text-[9px] tracking-wider uppercase text-[color:var(--rose)] bg-[color:var(--blush)] px-2 py-0.5 rounded-md font-semibold border border-[color:var(--rose)]/10">
                {review.tag}
              </span>
            </h3>
            <p className="text-[11px] text-foreground/50 mt-0.5">{review.date}</p>
          </div>
        </div>

        {/* Stars with staggered animation */}
        <div className="flex gap-1 mb-2">
          {Array.from({ length: review.stars }).map((_, si) => (
            <span
              key={si}
              className="text-[color:var(--gold)] text-base transform group-hover:scale-120 transition-transform duration-300"
              style={{ transitionDelay: `${si * 50}ms` }}
            >
              ★
            </span>
          ))}
        </div>

        {/* Service Tag */}
        <span className="inline-block text-[10px] font-bold text-[color:var(--rose)] uppercase tracking-wider bg-[color:var(--blush)]/60 border border-[color:var(--rose)]/15 px-2.5 py-0.5 rounded-full mb-3">
          💆‍♀️ {review.service}
        </span>

        {/* Testimonial text */}
        <p className="text-foreground/80 text-sm leading-relaxed italic relative z-10">
          "{review.text}"
        </p>
      </div>

      {/* Verified Badge */}
      <div className="mt-5 pt-3 border-t border-foreground/5 flex items-center justify-between text-[11px] text-foreground/50 relative z-10">
        <span className="flex items-center gap-1 font-medium text-[color:var(--rose)]">
          ✓ Verified Booking
        </span>
        <span>Pink Love Guest</span>
      </div>
    </div>
  );
}

function Reviews() {
  const [localReviews, setLocalReviews] = useState<any[]>([]);
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formService, setFormService] = useState("");
  const [formStars, setFormStars] = useState(5);
  const [formText, setFormText] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("pinklove_local_reviews");
    if (stored) {
      try {
        setLocalReviews(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formService.trim() || !formText.trim()) return;

    const newReview = {
      name: formName.trim(),
      service: formService.trim(),
      text: formText.trim(),
      stars: formStars,
      date: "Just now",
      tag: "Verified Guest"
    };

    const updated = [newReview, ...localReviews];
    setLocalReviews(updated);
    localStorage.setItem("pinklove_local_reviews", JSON.stringify(updated));

    // Reset form
    setFormName("");
    setFormService("");
    setFormStars(5);
    setFormText("");
    setIsWriteOpen(false);

    toast.success("Thank you! Your review has been added to our board.");
  };

  const allReviews = [...localReviews, ...REVIEWS];

  // Dynamically divide items into two balanced rows
  const row1: any[] = [];
  const row2: any[] = [];
  allReviews.forEach((review, idx) => {
    if (idx % 2 === 0) {
      row1.push(review);
    } else {
      row2.push(review);
    }
  });

  // Safe fallback to make sure there are always items in both rows
  if (row1.length === 0) row1.push(...REVIEWS.slice(0, 3));
  if (row2.length === 0) row2.push(...REVIEWS.slice(3, 6));

  return (
    <section id="reviews" className="relative z-10 py-24 bg-gradient-to-b from-background to-[color:var(--blush)]/35 overflow-hidden w-full">
      {/* Decorative blurry pink glow */}
      <div className="absolute right-10 top-1/4 h-80 w-80 rounded-full bg-[color:var(--rose)] opacity-5 blur-3xl pointer-events-none" />
      <div className="absolute left-10 bottom-1/4 h-80 w-80 rounded-full bg-[color:var(--gold)] opacity-5 blur-3xl pointer-events-none" />

      {/* Centered bounded header */}
      <div className="mx-auto max-w-6xl text-center mb-16 px-6">
        <p className="font-script text-3xl text-[color:var(--rose)]">what our clients say</p>
        <h2 className="font-display text-5xl sm:text-6xl mt-1 tracking-tight">Client Testimonials</h2>
        <p className="mt-4 text-foreground/80 max-w-xl mx-auto">
          Real stories and kind words from guests who have experienced our signature care.
        </p>
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setIsWriteOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] hover:bg-[color:var(--rose)]/90 text-white px-7 py-3 text-sm font-bold shadow-[var(--shadow-petal)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            ✍️ Share Your Review
          </button>
        </div>
      </div>

      {/* Testimonials moving container - Edge-to-Edge */}
      <div className="space-y-10 relative w-full">
        {/* Row 1: Left to Right */}
        <div className="relative flex w-full overflow-x-hidden py-4 hover-pause-row">
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background via-background/70 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background via-background/70 to-transparent z-10 pointer-events-none" />
          
          <div className="flex gap-8 whitespace-nowrap animate-marquee-ltr">
            {/* Repeat items if they are too few to ensure smooth marquee scrolling */}
            {(row1.length < 4 ? [...row1, ...row1, ...row1, ...row1] : [...row1, ...row1]).map((review, i) => (
              <ReviewCard key={`r1-${i}-${review.name}`} review={review} />
            ))}
          </div>
        </div>

        {/* Row 2: Right to Left */}
        <div className="relative flex w-full overflow-x-hidden py-4 hover-pause-row">
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background via-background/70 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background via-background/70 to-transparent z-10 pointer-events-none" />

          <div className="flex gap-8 whitespace-nowrap animate-marquee-rtl">
            {(row2.length < 4 ? [...row2, ...row2, ...row2, ...row2] : [...row2, ...row2]).map((review, i) => (
              <ReviewCard key={`r2-${i}-${review.name}`} review={review} />
            ))}
          </div>
        </div>
      </div>

      {/* Write Review Dialog Popup */}
      {isWriteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setIsWriteOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-[32px] border border-rose-100 p-8 shadow-[0_25px_60px_-15px_rgba(219,112,147,0.2)] z-10 transform scale-100 transition-all duration-300">
            <button
              onClick={() => setIsWriteOpen(false)}
              className="absolute right-5 top-5 w-8 h-8 rounded-full hover:bg-rose-50 flex items-center justify-center text-muted-foreground hover:text-[color:var(--rose)] transition-colors cursor-pointer"
            >
              ✕
            </button>
            <h3 className="font-display text-2xl font-bold text-rose-950 mb-1">Share Your Experience</h3>
            <p className="text-xs text-muted-foreground mb-6">Your review will be shown instantly on our board!</p>
            
            <form onSubmit={handleReviewSubmit} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-xs font-bold text-rose-950 uppercase tracking-wider block">Your Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Priya Sundar"
                  className="w-full h-11 px-3.5 rounded-xl border border-rose-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 font-semibold text-sm shadow-sm transition-all text-zinc-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-rose-950 uppercase tracking-wider block">Service Received</label>
                <input
                  type="text"
                  required
                  value={formService}
                  onChange={(e) => setFormService(e.target.value)}
                  placeholder="e.g. HD Bridal Makeover"
                  className="w-full h-11 px-3.5 rounded-xl border border-rose-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 font-semibold text-sm shadow-sm transition-all text-zinc-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-rose-950 uppercase tracking-wider block mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormStars(star)}
                      className="text-2xl transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                    >
                      <span className={star <= formStars ? "text-[color:var(--gold)]" : "text-zinc-300"}>★</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-rose-950 uppercase tracking-wider block">Your Review</label>
                <textarea
                  required
                  rows={3}
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  placeholder="Tell us what you loved about your visit..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 font-semibold text-sm shadow-sm transition-all resize-none text-zinc-900"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-rose-200/50 transition-all duration-300 cursor-pointer"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

function Certifications() {
  const [selectedCert, setSelectedCert] = useState<string | null>(null);

  const CERTIFICATE_IMAGES = [
    "/certificate/enhanced_cert_1_1785078081666.png",
    "/certificate/enhanced_cert_2_1785078108021.png",
    "/certificate/enhanced_cert_3_1785078119352.png",
    "/certificate/enhanced_cert_4_1785078132232.png",
    "/certificate/enhanced_cert_5_1785078143441.png",
    "/certificate/enhanced_cert_7_1785078176207.png",
    "/certificate/enhanced_cert_9_1785078192371.png",
    "/certificate/enhanced_cert_10_1785078228728.png",
    "/certificate/enhanced_cert_11_1785078240604.png",
    "/certificate/enhanced_cert_12_1785078251811.png",
    "/certificate/enhanced_cert_new_3.png",
    "/certificate/enhanced_cert_new_4.png",
    "/certificate/enhanced_cert_new_5.png"
  ];

  return (
    <section id="certifications" className="relative z-10 py-24 bg-gradient-to-b from-[color:var(--blush)]/10 to-transparent overflow-hidden w-full">
      <div className="mx-auto max-w-6xl text-center mb-14 px-6">
        <p className="font-script text-3xl text-[color:var(--rose)]">accredited professional care</p>
        <h2 className="font-display text-5xl sm:text-6xl mt-1 tracking-tight">Our Certificates</h2>
      </div>

      <div className="relative flex w-full overflow-x-hidden py-8 hover-pause-row">
        <div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-background via-background/70 to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-background via-background/70 to-transparent z-20 pointer-events-none" />
        
        <div className="flex gap-10 items-center whitespace-nowrap animate-marquee-ltr py-4">
          {[...CERTIFICATE_IMAGES, ...CERTIFICATE_IMAGES].map((certUrl, i) => {
            return (
              <div
                key={`cert-${i}`}
                onClick={() => setSelectedCert(certUrl)}
                className="inline-block w-[85vw] max-w-[500px] md:max-w-[600px] aspect-[4/3] bg-white p-6 md:p-8 rounded-md border-[14px] border-[#3E2723] shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(62,39,35,0.5)] hover:scale-[1.02] transition-all duration-500 relative overflow-hidden text-left shrink-0 group cursor-pointer"
              >
                {/* Image rendering with 4K-like enhancement using CSS */}
                <img
                  src={certUrl}
                  alt={`Certificate ${i}`}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                  style={{
                    imageRendering: "crisp-edges",
                    filter: "contrast(1.02) brightness(1.02)"
                  }}
                  loading="lazy"
                />
                
                {/* Gold Seal watermark overlay for premium look */}
                <div className="absolute right-8 bottom-8 w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-dashed border-[color:var(--gold)]/40 flex items-center justify-center pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-500 bg-white/20 backdrop-blur-sm shadow-sm">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-double border-[color:var(--gold)]/50 flex items-center justify-center bg-white/50">
                    <span className="text-[color:var(--gold)]/60 text-2xl md:text-3xl">★</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Viewer */}
      {selectedCert && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-8 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setSelectedCert(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all hover:rotate-90 z-50"
            onClick={() => setSelectedCert(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <img 
            src={selectedCert} 
            alt="Certificate Fullscreen"
            className="max-w-full max-h-[90vh] object-contain rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-300 pointer-events-auto" 
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="relative z-10 px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-14">
          <p className="font-script text-3xl text-[color:var(--rose)]">got questions?</p>
          <h2 className="font-display text-5xl sm:text-6xl mt-1">Frequently asked</h2>
        </div>
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              className={`rounded-2xl border bg-card overflow-hidden transition-all duration-300 ${
                open === i 
                  ? "border-[color:var(--rose)]/30 shadow-[0_15px_30px_-5px_rgba(219,112,147,0.12)] bg-zinc-900/10" 
                  : "border-foreground/10 shadow-[var(--shadow-soft)] hover:border-foreground/20"
              }`}
            >
              <button
                id={`faq-q-${i}`}
                aria-expanded={open === i}
                aria-controls={`faq-a-${i}`}
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 transition-colors duration-300"
              >
                <span className="font-display text-lg sm:text-xl">{item.q}</span>
                <span
                  className={`shrink-0 h-7 w-7 rounded-full border border-foreground/20 flex items-center justify-center text-[color:var(--rose)] transition-all duration-300 ${
                    open === i ? "bg-[color:var(--rose)] text-white border-transparent rotate-45" : "rotate-0"
                  }`}
                >
                  +
                </span>
              </button>
              
              {/* CSS Grid Smooth Height Transition */}
              <div
                id={`faq-a-${i}`}
                role="region"
                aria-labelledby={`faq-q-${i}`}
                className={`grid transition-all duration-300 ease-in-out ${
                  open === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-6 text-foreground/75 leading-relaxed text-sm sm:text-base">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center mt-10 text-foreground/60 text-sm">
          More questions?{" "}
          <a href={`https://api.whatsapp.com/send/?phone=91${WA_NUMBER}`} className="text-[color:var(--rose)] underline underline-offset-4 font-semibold hover:text-[color:var(--petal)] transition-colors">
            Chat with us on WhatsApp
          </a>
        </p>
      </div>
    </section>
  );
}

function Visit() {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const todayIndex = (new Date().getDay() + 6) % 7; // Convert 0-6 (Sun-Sat) to 0-6 (Mon-Sun)

  return (
    <section id="visit" className="relative z-10 px-6 py-24 bg-gradient-to-b from-transparent to-[color:var(--blush)]/10">
      <div className="mx-auto max-w-7xl grid lg:grid-cols-12 gap-10 items-stretch">
        
        {/* Left column - Info Details Card */}
        <div className="lg:col-span-5 rounded-[32px] bg-neutral-950 text-white p-8 sm:p-12 border border-rose-950/40 relative overflow-hidden flex flex-col justify-between shadow-[0_25px_60px_rgba(0,0,0,0.15)]">
          {/* Decorative glowing gradient */}
          <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-[color:var(--rose)] opacity-20 blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-[color:var(--gold)] opacity-10 blur-[100px] pointer-events-none" />
          
          <div className="relative z-10">
            <span className="font-script text-3xl text-[color:var(--petal)] block mb-1">visit us</span>
            <h2 className="font-serif italic text-4xl sm:text-5xl text-white leading-tight font-light">
              Experience Pink <br />
              <span className="text-[color:var(--petal)]">Perfection.</span>
            </h2>
            
            <div className="mt-12 space-y-8">
              <Info 
                label="Address" 
                value={
                  <span className="text-zinc-300 font-medium text-base sm:text-lg">
                    No 04 Udaiyaar Street, Ninnakarai Road, <br />
                    Kattankulathur, Tamil Nadu 603203
                  </span>
                } 
              />
              <Info 
                label="Hours" 
                value={
                  <span className="text-zinc-300 font-medium text-base sm:text-lg">
                    Mon – Sun · 10:00 AM – 9:00 PM
                  </span>
                } 
              />
              <Info 
                label="Phone / WhatsApp" 
                value={
                  <a href={`tel:+91${WA_NUMBER}`} className="text-[color:var(--petal)] hover:text-white transition-colors duration-300 font-semibold text-lg">
                    +91 {WA_NUMBER_FORMATTED}
                  </a>
                } 
              />
              <Info 
                label="Instagram" 
                value={
                  <a href="https://www.instagram.com/pinklove_beautystudio/" target="_blank" rel="noreferrer" className="text-[color:var(--petal)] hover:text-white transition-colors duration-300 font-semibold text-lg">
                    @pinklove_beautystudio
                  </a>
                } 
              />
            </div>
          </div>
          
          <div className="mt-12 relative z-10 flex flex-col sm:flex-row gap-3 pt-6 border-t border-white/5">
            <a 
              href={`https://api.whatsapp.com/send/?phone=91${WA_NUMBER}`} 
              target="_blank" 
              rel="noreferrer" 
              className="flex-1 text-center py-3.5 px-6 rounded-full bg-white text-black font-bold hover:bg-[color:var(--rose)] hover:text-white transition-all duration-300 hover:scale-102 active:scale-98 shadow-md"
            >
              WhatsApp Booking
            </a>
            <a 
              href="https://www.google.com/maps/search/?api=1&query=Pink+Love+Beauty+Studio+Kattankulathur" 
              target="_blank" 
              rel="noreferrer" 
              className="flex-1 text-center py-3.5 px-6 rounded-full border border-white/20 text-white font-bold hover:border-[color:var(--petal)] hover:text-[color:var(--petal)] transition-all duration-300 hover:scale-102 active:scale-98"
            >
              Directions
            </a>
          </div>
        </div>

        {/* Right column - Interactive Map Card */}
        <div className="lg:col-span-7 relative rounded-[32px] overflow-hidden bg-neutral-900 border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.3)] group h-full min-h-[450px] lg:min-h-full">
          {/* Top Floating Badge */}
          <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-start pointer-events-none">
            <div className="bg-black/40 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[color:var(--petal)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[color:var(--rose)]"></span>
              </span>
              Live Location
            </div>
            
            <div className="flex gap-2">
              <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 shadow-lg pointer-events-auto cursor-pointer hover:bg-black/60 hover:text-white transition-all hover:scale-105 active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h5v5"/><path d="m3.5 20.5 16-16"/><path d="M9.5 20h-5v-5"/></svg>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 z-0 pointer-events-none">
            {/* The iframe container restores normal map interaction so the real pin is centered and visible */}
            <iframe
              title="Pink Love Beauty Studio location"
              src="https://maps.google.com/maps?q=Pink%20Love%20Beauty%20Saloon%20%26%20Bridal%20Studio%20Kattankulathur&t=&z=16&ie=UTF8&output=embed"
              className="absolute inset-0 h-full w-full border-none transition-all duration-700 ease-in-out group-hover:grayscale-0 contrast-125 saturate-[1.2]"
              style={{ filter: "grayscale(10%)" }}
              loading="lazy"
            />
          </div>
          
          {/* Custom Funky Marker Bubble (Positioned right above the map's native center pin) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(100%+24px)] z-30 pointer-events-auto">
            <a 
              href="https://www.google.com/maps/search/?api=1&query=Pink+Love+Beauty+Studio+Kattankulathur" 
              target="_blank" 
              rel="noreferrer"
              className="flex flex-col items-center group/marker cursor-pointer"
            >
              <div className="bg-black/90 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.5)] transform group-hover/marker:-translate-y-1 transition-all whitespace-nowrap border border-[color:var(--gold)]/40 backdrop-blur-md animate-bounce relative">
                📍 Our shop is right here!
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 border-solid border-t-black/90 border-t-8 border-x-transparent border-x-8 border-b-0"></div>
              </div>
            </a>
          </div>
          
          {/* Glassmorphism Bottom Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-24 pointer-events-none">
            <div className="transform translate-y-4 group-hover:translate-y-0 opacity-90 group-hover:opacity-100 transition-all duration-500 flex justify-center pointer-events-auto">
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Pink+Love+Beauty+Studio+Kattankulathur" 
                target="_blank" 
                rel="noreferrer"
                className="w-full sm:w-[85%] bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white hover:text-black font-bold px-6 py-4 rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.4)] flex items-center justify-center gap-3 transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] group/btn"
              >
                <div className="bg-white/20 group-hover/btn:bg-black/5 p-2 rounded-full transition-colors duration-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/></svg>
                </div>
                <span className="text-sm tracking-wide">Open in Google Maps App</span>
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Weekly Schedule Row */}
      <div className="mx-auto max-w-7xl mt-12">
        <h3 className="text-center font-display text-sm font-bold uppercase tracking-wider text-zinc-500 mb-6">
          Weekly Schedule
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {daysOfWeek.map((d, i) => {
            const isToday = i === todayIndex;
            return (
              <div 
                key={d} 
                className={`rounded-2xl p-4 transition-all duration-300 relative ${
                  isToday 
                    ? "bg-white border-2 border-[color:var(--rose)] shadow-[0_8px_30px_rgba(219,112,147,0.15)] scale-[1.03] z-10" 
                    : "bg-white/40 border border-zinc-100 text-zinc-600"
                }`}
              >
                {isToday && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] font-bold uppercase tracking-widest bg-[color:var(--rose)] text-white px-2 py-0.5 rounded-full shadow-sm">
                    Today
                  </span>
                )}
                <div className={`font-display text-lg font-bold ${isToday ? "text-[color:var(--rose)]" : "text-zinc-800"}`}>
                  {d}
                </div>
                <div className="text-[10px] opacity-75 mt-1 font-semibold">10:00 AM – 9:00 PM</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-1">{label}</div>
      <div className="text-lg">{value}</div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 px-6 pt-16 pb-10 border-t border-foreground/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center mb-6">
          <img
            src={logo}
            alt="Pink Love Beauty Studio Logo"
            width={112}
            height={112}
            className="h-24 w-24 rounded-full object-cover shadow-[var(--shadow-soft)] border border-rose-200/50 transition-transform duration-500 hover:scale-105"
          />
        </div>
        <p className="font-script text-5xl text-gradient-rose text-center">Pink Love</p>
        <p className="mt-2 text-xs uppercase tracking-[0.4em] text-foreground/60 text-center">Beauty Studio · Kattankulathur</p>
        
        <div className="mt-16 pt-8 border-t border-foreground/5 grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-xs text-foreground/50">
          <div className="text-center md:text-left">
            © {new Date().getFullYear()} Pink Love Beauty Studio. All Rights Reserved
          </div>
          <div className="text-center">
            Powered by <a href="https://www.cenexasystems.com" target="_blank" rel="noreferrer" className="font-semibold text-foreground/70 hover:text-[color:var(--rose)] transition-colors">Cenexa Systems</a> © {new Date().getFullYear()}
          </div>
          <div className="text-center md:text-right font-bold tracking-widest text-[10px] uppercase text-foreground/60">
            LOVE • GLOW • PERFECTION
          </div>
        </div>
      </div>
    </footer>
  );
}

function MobileStickyNav() {
  const handleMenuClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const menuSection = document.getElementById("menu");
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-5 pt-3 md:hidden bg-background/80 backdrop-blur-lg border-t border-rose-200/30 shadow-[0_-10px_30px_rgba(219,112,147,0.15)] flex items-center justify-between gap-3">
      {/* Call Us Button */}
      <a
        href={`tel:+91${WA_NUMBER}`}
        className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-white border border-rose-200/60 text-zinc-800 hover:bg-rose-50/20 transition-all duration-300 active:scale-95 shadow-xs"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[color:var(--rose)] mb-1 animate-pulse"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.7 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
        <span className="text-[10px] font-bold tracking-wider uppercase text-foreground/80">Call Us</span>
      </a>

      {/* WhatsApp Book Button (Hero Action) */}
      <a
        href={`https://api.whatsapp.com/send/?phone=91${WA_NUMBER}&text=Hi%20Pink%20Love%20Beauty%20Studio!%20%F0%9F%8C%B8%20I%20would%20like%20to%20book%20an%20appointment.%20Please%20check%20availability.`}
        target="_blank"
        rel="noreferrer"
        className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#25D366] text-white hover:bg-[#20ba59] transition-all duration-300 active:scale-95 shadow-xs"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="mb-1"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.953-2.005-.001-3.973-.504-5.714-1.466L0 24zm6.59-4.846c1.6.95 3.16 1.455 4.803 1.456 5.3 0 9.612-4.321 9.615-9.63.002-2.57-1.002-4.986-2.825-6.81C16.417 2.348 14.004 1.34 11.432 1.34c-5.304 0-9.618 4.322-9.62 9.633-.001 1.704.449 3.371 1.303 4.867L2.128 20.3l4.519-1.146zm11.238-6.115c-.3-.15-1.772-.875-2.046-.975-.276-.1-.477-.15-.677.15-.2.3-.777.975-.953 1.175-.177.2-.353.225-.653.075-1.02-.516-1.86-.906-2.57-1.516-.54-.465-.89-1.03-1.05-1.3-.16-.272-.017-.42.118-.555.122-.121.272-.32.408-.48.136-.16.182-.27.272-.45.09-.18.045-.337-.022-.487-.068-.15-.678-1.637-.93-2.247-.244-.59-.492-.51-.678-.52-.175-.007-.375-.01-.575-.01-.2 0-.525.075-.8.375-.276.3-1.05 1.03-1.05 2.515s1.075 2.915 1.225 3.11c.15.195 2.11 3.224 5.115 4.525.715.31 1.273.495 1.71.635.717.225 1.37.195 1.885.118.572-.085 1.772-.725 2.022-1.425.25-.7.25-1.3 0-1.425-.075-.125-.275-.2-.575-.35z"/>
        </svg>
        <span className="text-[10px] font-bold tracking-wider uppercase text-white/95">Book Us</span>
      </a>

      {/* Menu Book Button */}
      <a
        href="#menu"
        onClick={handleMenuClick}
        className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-white border border-rose-200/60 text-zinc-800 hover:bg-rose-50/20 transition-all duration-300 active:scale-95 shadow-xs"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[color:var(--rose)] mb-1"
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
        <span className="text-[10px] font-bold tracking-wider uppercase text-foreground/80 font-sans">Menu Book</span>
      </a>
    </div>
  );
}
