import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import heroBride from "@/assets/hero-bride.jpg";
import serviceFacial from "@/assets/service-facial.jpg";
import serviceHair from "@/assets/service-hair.jpg";
import serviceJewelry from "@/assets/service-jewelry.jpg";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";
import studio1 from "@/assets/studio-interior-1.jpg";
import studio2 from "@/assets/studio-interior-2.jpg";
import studio3 from "@/assets/studio-interior-3.jpg";
import studio4 from "@/assets/studio-interior-4.jpg";
import studio5 from "@/assets/studio-interior-5.jpg";
import type { IgPost } from "@/lib/instagram.types";
import { fetchInstagramPosts } from "@/lib/instagram.server";
import logo from "@/assets/logo.png";
import { MenuBook } from "@/components/MenuBook";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pink Love Beauty Studio — HD Bridal Makeup & Beauty Parlour in Kattankulathur" },
      {
        name: "description",
        content:
          "Pink Love Beauty Studio: 5.0★ women-led beauty parlour in Kattankulathur. HD bridal makeovers, Korean glass-skin facials, hydrafacials, hair spa, manicures & bridal jewelry. Book on WhatsApp +91 98408 74966.",
      },
      { name: "keywords", content: "bridal makeup Kattankulathur, beauty parlour Kattankulathur, HD makeup Chennai, Korean glass skin facial, hydrafacial Kattankulathur, hair spa, bridal jewelry, Pink Love Beauty Studio" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "geo.region", content: "IN-TN" },
      { name: "geo.placename", content: "Kattankulathur" },
      { name: "geo.position", content: "12.8230;80.0444" },
      { name: "ICBM", content: "12.8230, 80.0444" },
      { property: "og:title", content: "Pink Love Beauty Studio — HD Bridal & Beauty in Kattankulathur" },
      {
        property: "og:description",
        content: "Where elegance meets care. HD bridal makeovers, glass-skin facials, hair & bridal jewelry — a women-led aesthetic studio in Kattankulathur.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { property: "og:image", content: "/og-pink-love.jpg" },
      { property: "og:image:alt", content: "Pink Love Beauty Studio — HD bridal makeover" },
      { name: "twitter:title", content: "Pink Love Beauty Studio — HD Bridal & Beauty" },
      { name: "twitter:description", content: "5.0★ women-led bridal studio in Kattankulathur. HD makeup, glass-skin facials, hair & jewelry." },
      { name: "twitter:image", content: "/og-pink-love.jpg" },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Allura&family=Jost:wght@300;400;500;600&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "How do I book an appointment at Pink Love Beauty Studio?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "You can book an appointment by messaging us on WhatsApp at +91 98408 74966. We recommend booking 1–2 weeks in advance for bridal packages.",
              },
            },
            {
              "@type": "Question",
              name: "Do you offer HD bridal makeup trials before the wedding day?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes! We strongly recommend a bridal trial session 1–2 weeks before your big day so we can perfect the look and ensure the makeup suits you perfectly.",
              },
            },
            {
              "@type": "Question",
              name: "What is the price range for bridal packages at Pink Love?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Our bridal packages are competitively priced (₹₹ range). Pricing depends on the services chosen — HD makeup, hair styling, jewelry and more. Contact us on WhatsApp for a personalised quote.",
              },
            },
            {
              "@type": "Question",
              name: "What is a Korean Glass Skin Facial and how long does it take?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "A Korean Glass Skin Facial is a multi-step hydrating treatment that deeply cleanses, exfoliates, and floods the skin with moisture for a dewy, mirror-like glow. The session typically takes 60–75 minutes.",
              },
            },
            {
              "@type": "Question",
              name: "Where is Pink Love Beauty Studio located?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "We are located at No 04 Udaiyaar Street, Ninnakarai Road, Kattankulathur, Tamil Nadu 603203 — easily accessible from SRM University and the GST Road corridor.",
              },
            },
            {
              "@type": "Question",
              name: "What are your opening hours?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "We are open Monday to Saturday from 10:05 AM to 9:05 PM, and on Sundays from 10:07 AM to 9:07 PM.",
              },
            },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BeautySalon",
          name: "Pink Love Beauty Studio",
          image: "/og-pink-love.jpg",
          "@id": "https://www.instagram.com/pinklove_beautystudio/",
          url: "/",
          telephone: "+91-98408-74966",
          priceRange: "₹₹",
          address: {
            "@type": "PostalAddress",
            streetAddress: "No 04 Udaiyaar Street, Ninnakarai Road",
            addressLocality: "Kattankulathur",
            addressRegion: "TN",
            postalCode: "603203",
            addressCountry: "IN",
          },
          geo: { "@type": "GeoCoordinates", latitude: 12.8230, longitude: 80.0444 },
          openingHoursSpecification: [
            { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"], opens: "10:05", closes: "21:05" },
            { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "10:07", closes: "21:07" },
          ],
          sameAs: ["https://www.instagram.com/pinklove_beautystudio/"],
          aggregateRating: { "@type": "AggregateRating", ratingValue: "5.0", reviewCount: "2" },
          makesOffer: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "HD Bridal Makeover" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Korean Glass Skin Facial" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Hydrafacial" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Hair Spa & Advanced Haircuts" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Manicure & Pedicure" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Bridal Jewelry & Accessories" } },
          ],
        }),
      },
    ],
  }),
  loader: async () => {
    return {
      instagramPosts: await fetchInstagramPosts(),
    };
  },
  component: Index,
});

const SERVICES = [
  {
    name: "HD Bridal Makeovers",
    desc: "Flawless HD & waterproof bridal makeup designed to last from mandap to reception.",
    img: g4,
  },
  {
    name: "Korean Glass Skin Facials",
    desc: "Hydrafacials and glass-skin rituals for that dewy, lit-from-within glow.",
    img: serviceFacial,
  },
  {
    name: "Hair Styling & Spa",
    desc: "Volumizing layers, advanced haircuts and nourishing hair spa treatments.",
    img: serviceHair,
  },
  {
    name: "Bridal Jewelry & Accessories",
    desc: "On-site selection of bridal jewelry, earrings and bangles to complete your look.",
    img: serviceJewelry,
  },
];

const GALLERY = [g1, g2, g3, g4, g5, g6];

function Index() {
  return (
    <div className="relative overflow-x-hidden bg-background text-foreground">
      <Petals />
      <Nav />
      <Hero />
      <Marquee />
      <About />
      <Services />
      <MenuBook />
      <LookFinder />
      <Gallery />
      <Reels />
      <Reviews />
      <FAQ />
      <Visit />
      <Footer />
    </div>
  );
}

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
    <header className="relative z-30">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <a href="#top" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Pink Love Beauty Studio Logo"
            className="h-11 w-11 rounded-full object-cover shadow-[var(--shadow-soft)] border border-rose-200/50"
          />
          <span className="flex flex-col leading-tight">
            <span className="font-script text-xl text-[color:var(--rose)]">Pink Love</span>
            <span className="text-[10px] tracking-[0.35em] uppercase text-muted-foreground">Beauty Studio</span>
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm tracking-wide">
          {["About", "Services", "Menu", "Reviews", "Gallery", "Reels", "Visit"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="text-foreground/70 hover:text-[color:var(--rose)] transition hover-underline-expand py-1">
              {l}
            </a>
          ))}
        </nav>
        <a
          href="https://wa.me/919840874966"
          target="_blank"
          rel="noreferrer"
          className="hidden sm:inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm text-background hover:bg-[color:var(--rose)] transition"
        >
          Book Now
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative z-10 px-6 pt-6 pb-24">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.5rem]" style={{ background: "var(--gradient-hero)" }}>
          <div
            className="absolute inset-0 opacity-60 mix-blend-soft-light"
            style={{ background: "var(--gradient-glow)" }}
          />
          <div className="grid lg:grid-cols-12 gap-10 p-8 sm:p-12 lg:p-16 items-center relative">
            <div className="lg:col-span-7 text-foreground">
              <div className="inline-flex items-center gap-2 rounded-full bg-background/70 backdrop-blur px-4 py-1.5 text-xs tracking-[0.25em] uppercase text-[color:var(--rose)] animate-fade-up animate-pulse-gentle">
                ✦ Est. Kattankulathur · 5.0 ★ Google
              </div>
              <h1 className="mt-6 font-display text-5xl sm:text-7xl lg:text-[5.5rem] leading-[0.95] animate-fade-up cursor-default" style={{ animationDelay: "0.1s" }}>
                Where <span className="font-script text-gradient-rose text-6xl sm:text-8xl lg:text-[6.5rem] align-baseline transition-transform hover:scale-105 inline-block duration-500">elegance</span>
                <br /> meets <em className="not-italic text-gradient-rose">care.</em>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-foreground/75 animate-fade-up" style={{ animationDelay: "0.2s" }}>
                A women-led aesthetic studio specializing in HD bridal makeovers, Korean glass-skin
                facials, advanced haircuts and bridal jewelry — all wrapped in a touch of pink perfection.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
                <a
                  href="https://wa.me/919840874966"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-background hover:bg-[color:var(--rose)] transition shadow-[var(--shadow-petal)] hover:shadow-2xl hover:scale-105 active:scale-95 duration-300 transform"
                >
                  Book a Consultation →
                </a>
                <a
                  href="#services"
                  className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-7 py-3.5 hover:border-[color:var(--rose)] hover:text-[color:var(--rose)] transition"
                >
                  Explore services
                </a>
              </div>
              <dl className="mt-12 grid grid-cols-3 gap-6 max-w-md">
                {[
                  { k: "5.0★", v: "Google rating" },
                  { k: "HD", v: "Bridal makeup" },
                  { k: "All-in-1", v: "Beauty studio" },
                ].map((s) => (
                  <div key={s.v}>
                    <dt className="font-display text-3xl text-[color:var(--rose)]">{s.k}</dt>
                    <dd className="text-xs uppercase tracking-wider text-foreground/60 mt-1">{s.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] shadow-[var(--shadow-petal)] animate-float-slow">
                <img src={heroBride} alt="HD bridal makeover at Pink Love Beauty Studio" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.4_0.15_5/0.4)] via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-6 -left-6 rounded-2xl bg-background/95 backdrop-blur px-5 py-4 shadow-[var(--shadow-soft)] max-w-[220px]">
                <div className="flex gap-0.5 text-[color:var(--gold)] text-sm">★★★★★</div>
                <p className="text-xs mt-1 text-foreground/80 italic">
                  "Pampered with love, style, and a touch of pink perfection."
                </p>
              </div>
              <div className="absolute -top-4 -right-4 rounded-full bg-background/90 backdrop-blur px-4 py-2 text-xs tracking-widest uppercase text-[color:var(--rose)] shadow-[var(--shadow-soft)]">
                ✦ HD Bridal
              </div>
            </div>
          </div>
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
            className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover shadow-[var(--shadow-petal)] border border-rose-200/50"
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
      title: "Royal HD Bridal Makeover Package",
      price: "₹15,000 - ₹25,000",
      desc: "Our signature luxury bridal package. Flawless HD makeup designed to look regal under professional studio lighting, complete with traditional hair accessories and saree draping.",
      features: [
        "Premium HD Foundation Base",
        "Waterproof & 16-Hour Sweatproof",
        "Bridal Hair Styling & Saree Draping",
        "Luxury lashes & jewelry setting",
        "Complimentary trial makeup consultation"
      ],
      waText: "Hi Pink Love Studio! I did your Look Finder quiz and matched with the 'Royal HD Bridal Makeover Package'. I'd love to check dates and package details!"
    },
    dewy: {
      title: "Korean Glass-Skin Bridal Look",
      price: "₹18,000 - ₹28,000",
      desc: "An ultra-modern, luminous, dewy finish inspired by high-end luxury aesthetic studios. Perfect for brides who want their skin to look fresh, natural, and lit-from-within.",
      features: [
        "Hydrating Korean Ampoule Prep",
        "Airbrush & Luminous Glass-Skin Finish",
        "Soft-glam eye highlight & glossy lips",
        "Elegant modern hair styling",
        "Saree/Gown draping & lash extensions"
      ],
      waText: "Hi Pink Love Studio! I did your Look Finder quiz and matched with the 'Korean Glass-Skin Bridal Look'. I'd love to check your availability!"
    },
    bold: {
      title: "Ultimate Bold HD Glam Bridal",
      price: "₹16,000 - ₹26,000",
      desc: "For the bold bride who wants to turn heads. Precision contouring, gorgeous defined eyes, and matte lipstick paired with contemporary bridal hair and jewelry setting.",
      features: [
        "Full Airbrush/HD matte base",
        "3D highlight, contour, & defined eye drama",
        "Transfer-proof lipstick & custom lashes",
        "Bridal hair design (contemporary braid/bun)",
        "Saree draping & jewelry placement"
      ],
      waText: "Hi Pink Love Studio! I did your Look Finder quiz and matched with the 'Ultimate Bold HD Glam Bridal'. I'd love to learn more!"
    }
  },
  party: {
    soft: {
      title: "Lite / Birthday Glow Glam",
      price: "₹1,500 - ₹2,500",
      desc: "A gorgeous, lightweight glam look. Perfect for birthday parties, bridesmaid attendance, or casual family get-togethers.",
      features: [
        "Lightweight dewy foundation base",
        "Nude lip shade & soft cheek blush",
        "Soft eye shimmer & mascara",
        "Simple hair styling (blow dry or curls)"
      ],
      waText: "Hi Pink Love Studio! I did your Look Finder quiz and matched with the 'Lite / Birthday Glow Glam'. I'd like to book a session!"
    },
    dramatic: {
      title: "Dazzling Eye & Party Glam",
      price: "₹2,500 - ₹3,500",
      desc: "Focuses on eye artistry. Smokey eyes, halo glitter, or precise winged liners matched with a flawless base and hair setup.",
      features: [
        "Flawless evening matte base",
        "Glitter/Smokey eye makeup art",
        "Premium falsies (optional)",
        "Trendy hair styling (braids, half-updo)"
      ],
      waText: "Hi Pink Love Studio! I did your Look Finder quiz and matched with the 'Dazzling Eye & Party Glam'. I'd love to check availability!"
    },
    classic: {
      title: "Elegant Classic Party Makeover",
      price: "₹2,000 - ₹3,000",
      desc: "Timeless sophistication. A clean, classic makeup finish featuring red lips, sharp eyeliner, and a sleek hairstyle.",
      features: [
        "Clean semi-matte base",
        "Classic bold red lip & winged liner",
        "Volumizing blowout or sleek straight hair",
        "Saree/Outfit draping assistance"
      ],
      waText: "Hi Pink Love Studio! I did your Look Finder quiz and matched with the 'Elegant Classic Party Makeover'. I'd love to book this look!"
    }
  },
  skin: {
    dewy_skin: {
      title: "Korean Glass Skin Facial Ritual",
      price: "₹2,500 - ₹3,500",
      desc: "Indulge in a premium multi-step skin therapy session. Restores collagen, unclogs pores, and infuses active hyaluronic serum for an instant glass-skin shine.",
      features: [
        "Double oil & foam cleanse",
        "Gentle enzyme peel exfoliation",
        "Serum infusion with ultrasound massage",
        "Soothing collagen jelly mask",
        "SPF & hydration finish"
      ],
      waText: "Hi Pink Love Studio! I did your Look Finder quiz and matched with the 'Korean Glass Skin Facial'. I'd love to schedule a facial session!"
    },
    plump: {
      title: "Advanced HydraFacial Glow Therapy",
      price: "₹3,500 - ₹5,000",
      desc: "Our most advanced machine-based skin therapy. Uses vortex suction to extract impurities while simultaneously bathing the skin in rich antioxidant serums.",
      features: [
        "Vortex deep cleanse & exfoliation",
        "Acid peel prep & blackhead extraction",
        "Hydration vortex serum infusion",
        "Cold hammer skin tightening massage",
        "LED phototherapy light mask"
      ],
      waText: "Hi Pink Love Studio! I did your Look Finder quiz and matched with the 'Advanced HydraFacial Glow Therapy'. I'd love to book a Hydrafacial!"
    },
    detox: {
      title: "Tan-Clear Gold Radiance Facial",
      price: "₹2,000 - ₹3,000",
      desc: "Perfect for sun-damaged or dull skin. Removes tanning, brightens skin cells, and infuses real 24k gold essence for a sparkling bridal glow.",
      features: [
        "De-tan cream pack application",
        "Gold dust exfoliating scrub",
        "Radiance-boosting cream massage",
        "Brightening peel-off gold mask",
        "Vitamin C glowing serum wrap"
      ],
      waText: "Hi Pink Love Studio! I did your Look Finder quiz and matched with the 'Tan-Clear Gold Radiance Facial'. I'd love to make an appointment!"
    }
  },
  hair: {
    waves: {
      title: "Volumizing Hair Transformation",
      price: "₹1,500 - ₹2,500",
      desc: "Change your look with bouncy, voluminous hair styling. Includes deep wash, moisturizing, and advanced iron styling.",
      features: [
        "Shampoo wash & hair mask conditioning",
        "Volumizing blowout",
        "Soft curling iron waves",
        "Holding mist application"
      ],
      waText: "Hi Pink Love Studio! I did your Look Finder quiz and matched with the 'Volumizing Hair Transformation'. I'd love to schedule a hair styling session!"
    },
    sleek: {
      title: "Sleek Smooth Hair Spa Treatment",
      price: "₹2,000 - ₹3,500",
      desc: "Nourishes dry, frizzy hair from root to tip. Infuses keratin proteins and deep moisture to give you a sleek, straight, and healthy finish.",
      features: [
        "Steam hair spa & massage",
        "Keratin-rich deep hair mask",
        "Serum wrap protection",
        "Sleek blow dry & hair straightening"
      ],
      waText: "Hi Pink Love Studio! I did your Look Finder quiz and matched with the 'Sleek Smooth Hair Spa Treatment'. I'd love to schedule a hair spa!"
    },
    traditional: {
      title: "Traditional Bridal Flower Braid Design",
      price: "₹2,500 - ₹4,000",
      desc: "For the traditional bride. A beautifully crafted long braid adorned with fresh flowers (Jasmine, Roses) and gold accessories.",
      features: [
        "Hair texturizing & extensions padding",
        "Neat classic long plait braid",
        "Flower setting (Venis & Jasmine wrap)",
        "Gold billa/accessories placement"
      ],
      waText: "Hi Pink Love Studio! I did your Look Finder quiz and matched with the 'Traditional Bridal Flower Braid Design'. I'd love to book this style!"
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
                    href={`https://wa.me/919840874966?text=${encodeURIComponent(match.waText)}`}
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

function Gallery() {
  return (
    <section id="gallery" className="relative z-10 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-14">
          <p className="font-script text-3xl text-[color:var(--rose)]">our brides</p>
          <h2 className="font-display text-5xl sm:text-6xl">Pink love portfolio</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {GALLERY.map((src, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-2xl group ${
                i === 0 ? "md:row-span-2 md:col-span-1 aspect-[3/4] md:aspect-auto" : "aspect-[3/4]"
              }`}
            >
              <img
                src={src}
                alt={`Pink Love bridal portfolio ${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.4_0.15_5/0.6)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

interface VideoModalProps {
  post: IgPost | null;
  isOpen: boolean;
  onClose: () => void;
}

function VideoModal({ post, isOpen, onClose }: VideoModalProps) {
  if (!isOpen || !post) return null;

  const { permalink, localVideoUrl } = post;
  const embedUrl = permalink.split("?")[0].replace(/\/$/, "") + "/embed/";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md transition-opacity duration-300">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-zinc-950 rounded-[32px] border border-white/10 overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] z-10 transform scale-100 transition-all duration-300 flex flex-col">
        {/* Header / Close button */}
        <div className="absolute right-4 top-4 z-20">
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur transition-all duration-200 border border-white/10"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Video / Iframe container */}
        <div className="relative w-full bg-black flex items-center justify-center p-1" style={{ minHeight: "540px" }}>
          {localVideoUrl ? (
            <video
              src={localVideoUrl}
              controls
              autoPlay
              playsInline
              preload="metadata"
              className="w-full h-[580px] sm:h-[620px] rounded-2xl object-cover"
            />
          ) : (
            <iframe
              src={embedUrl}
              className="w-full h-[580px] sm:h-[620px] border-0 rounded-2xl"
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
  const thumb = post.thumbnail_url ?? post.media_url ?? "";
  
  return (
    <button
      onClick={() => onOpen(post)}
      className="block w-full text-left rounded-[28px] bg-zinc-900 overflow-hidden border border-white/5 hover:border-[color:var(--rose)]/30 hover:shadow-[0_15px_30px_rgba(219,112,147,0.15)] transition-all duration-300 group relative aspect-[9/16]"
      aria-label={post.caption?.slice(0, 60) ?? "Play Reel"}
    >
      {thumb ? (
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

      {/* Glassmorphic Play Overlay Button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-16 w-16 rounded-full bg-black/60 text-[color:var(--gold)] flex items-center justify-center backdrop-blur-md border border-[color:var(--gold)]/30 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shadow-lg">
          <span className="ml-1 text-2xl">▶</span>
        </div>
      </div>

      {/* Bottom caption overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/50 to-transparent p-6 pt-16">
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

const FALLBACK_POSTS: IgPost[] = [
  {
    id: "fb1",
    media_type: "VIDEO",
    media_url: g4,
    permalink: "https://www.instagram.com/reel/C8xqJ7vS5pZ/",
    caption: "Radiant bridal glow for our gorgeous bride! HD makeup that lasts all day. 💖 #bridalmakeup #chennaibride",
    timestamp: "2024-06-25T12:00:00Z",
    localVideoUrl: "/videos/landing_page.mp4",
  },
  {
    id: "fb2",
    media_type: "VIDEO",
    media_url: g1,
    permalink: "https://www.instagram.com/reel/C7nXk2KS0aB/",
    caption: "Flawless HD Bridal Makeover. Where elegance meets care. ✨ #hdmakeup #bride",
    timestamp: "2024-05-28T14:30:00Z",
  },
  {
    id: "fb3",
    media_type: "VIDEO",
    media_url: serviceFacial,
    permalink: "https://www.instagram.com/reel/C6lZ9YpSnXc/",
    caption: "Korean Glass Skin Facial ritual for that dewy, lit-from-within glow. 💧✨ #glassskin #facial",
    timestamp: "2024-05-02T10:15:00Z",
  },
  {
    id: "fb4",
    media_type: "VIDEO",
    media_url: serviceHair,
    permalink: "https://www.instagram.com/reel/C5kP1QwSrJd/",
    caption: "Hair makeover: Volumizing layers & nourishing hair spa treatment. 💇‍♀️✨ #hairtransformation",
    timestamp: "2024-04-10T16:00:00Z",
  },
  {
    id: "fb5",
    media_type: "VIDEO",
    media_url: serviceJewelry,
    permalink: "https://www.instagram.com/reel/C4jH8RvSpKe/",
    caption: "Completing the look with our exclusive bridal jewelry & accessories collection. 👑 #bridaljewelry",
    timestamp: "2024-03-12T11:45:00Z",
  },
  {
    id: "fb6",
    media_type: "VIDEO",
    media_url: g3,
    permalink: "https://www.instagram.com/reel/C3iG7TuSqLf/",
    caption: "Behind the scenes at Pink Love Beauty Studio. Pampering our lovely clients. 💕 #makeupstudio",
    timestamp: "2024-02-15T09:00:00Z",
  },
];

function Reels() {
  const { instagramPosts } = Route.useLoaderData();
  const apiPosts = instagramPosts?.data ?? [];
  
  const localVideoPost: IgPost = {
    id: "local_video_1",
    media_type: "VIDEO",
    media_url: g4,
    permalink: "https://www.instagram.com/pinklove_beautystudio/",
    caption: "Experience premium bridal & beauty rituals at Pink Love Beauty Studio! 💖",
    timestamp: new Date().toISOString(),
    localVideoUrl: "/videos/landing_page.mp4",
  };

  const posts = [localVideoPost, ...(apiPosts.length > 0 ? apiPosts : FALLBACK_POSTS.slice(1))];

  const [activePost, setActivePost] = useState<IgPost | null>(null);
  const items = posts;
  const hasItems = items.length > 0;

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: hasItems, align: "start", containScroll: "trimSnaps" },
    hasItems ? [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })] : [],
  );
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi]);

  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

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

        <div className="overflow-hidden -mx-3" ref={emblaRef}>
          <div className="flex">
            {items.map((post, i) => (
              <div key={post?.id ?? i} className="flex-[0_0_85%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-3">
                <ReelCard post={post} onOpen={(p) => setActivePost(p)} />
              </div>
            ))}
          </div>
        </div>

        {hasItems && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Go to post ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  selected === i ? "w-8 bg-[color:var(--rose)]" : "w-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
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

      {/* Lightbox Video Modal */}
      <VideoModal
        post={activePost}
        isOpen={!!activePost}
        onClose={() => setActivePost(null)}
      />
    </section>
  );
}

const FAQ_ITEMS = [
  {
    q: "How do I book an appointment?",
    a: "Message us on WhatsApp at +91 98408 74966. We recommend booking 1–2 weeks ahead for bridal packages.",
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
    a: "Monday to Saturday: 10:05 AM – 9:05 PM. Sunday: 10:07 AM – 9:07 PM.",
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

function ReviewCard({ review }: { review: typeof REVIEWS[0] }) {
  return (
    <div className="group relative rounded-3xl bg-card p-6 border border-[color:var(--rose)]/10 shadow-[var(--shadow-soft)] hover:shadow-[0_20px_45px_rgba(219,112,147,0.12)] hover:border-[color:var(--rose)]/30 hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between w-[320px] sm:w-[380px] shrink-0 whitespace-normal">
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
  const row1 = [REVIEWS[0], REVIEWS[1], REVIEWS[2]];
  const row2 = [REVIEWS[3], REVIEWS[4], REVIEWS[5]];

  return (
    <section id="reviews" className="relative z-10 py-24 bg-gradient-to-b from-background to-[color:var(--blush)]/35 overflow-hidden w-full">
      {/* Decorative blurry pink glow */}
      <div className="absolute right-10 top-1/4 h-80 w-80 rounded-full bg-[color:var(--rose)] opacity-5 blur-3xl" />
      <div className="absolute left-10 bottom-1/4 h-80 w-80 rounded-full bg-[color:var(--gold)] opacity-5 blur-3xl" />

      {/* Centered bounded header */}
      <div className="mx-auto max-w-6xl text-center mb-16 px-6">
        <p className="font-script text-3xl text-[color:var(--rose)]">what our clients say</p>
        <h2 className="font-display text-5xl sm:text-6xl mt-1 tracking-tight">Client Testimonials</h2>
        <p className="mt-4 text-foreground/80 max-w-xl mx-auto">
          Real stories and kind words from guests who have experienced our signature care.
        </p>
      </div>

      {/* Testimonials moving container - Edge-to-Edge */}
      <div className="space-y-10 relative w-full">
        
        {/* Row 1: Left to Right */}
        <div className="relative flex w-full overflow-x-hidden py-4 hover-pause-row">
          {/* Mask gradients for fading edge effect */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background via-background/70 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background via-background/70 to-transparent z-10 pointer-events-none" />
          
          <div className="flex gap-8 whitespace-nowrap animate-marquee-ltr">
            {[...row1, ...row1, ...row1, ...row1].map((review, i) => (
              <ReviewCard key={`r1-${i}`} review={review} />
            ))}
          </div>
        </div>

        {/* Row 2: Right to Left */}
        <div className="relative flex w-full overflow-x-hidden py-4 hover-pause-row">
          {/* Mask gradients for fading edge effect */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background via-background/70 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background via-background/70 to-transparent z-10 pointer-events-none" />

          <div className="flex gap-8 whitespace-nowrap animate-marquee-rtl">
            {[...row2, ...row2, ...row2, ...row2].map((review, i) => (
              <ReviewCard key={`r2-${i}`} review={review} />
            ))}
          </div>
        </div>

      </div>

      {/* Centered bounded CTA */}
      <div className="text-center mt-16 px-6">
        <a
          href="https://wa.me/919840874966"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-[color:var(--rose)]/30 px-8 py-3 text-sm font-semibold hover:bg-[color:var(--rose)] hover:text-white hover:border-transparent transition-all duration-300"
        >
          Review us on Google →
        </a>
      </div>
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
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-foreground/10 bg-card overflow-hidden shadow-[var(--shadow-soft)]"
            >
              <button
                id={`faq-q-${i}`}
                aria-expanded={open === i}
                aria-controls={`faq-a-${i}`}
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 hover:bg-[color:var(--blush)]/40 transition"
              >
                <span className="font-display text-lg sm:text-xl">{item.q}</span>
                <span
                  className="shrink-0 h-7 w-7 rounded-full border border-foreground/20 flex items-center justify-center text-[color:var(--rose)] transition-transform duration-300"
                  style={{ transform: open === i ? "rotate(45deg)" : "rotate(0deg)" }}
                >
                  +
                </span>
              </button>
              <div
                id={`faq-a-${i}`}
                role="region"
                aria-labelledby={`faq-q-${i}`}
                style={{
                  maxHeight: open === i ? "400px" : "0px",
                  transition: "max-height 0.35s ease",
                  overflow: "hidden",
                }}
              >
                <p className="px-6 pb-6 text-foreground/70 leading-relaxed">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center mt-10 text-foreground/60 text-sm">
          More questions?{" "}
          <a href="https://wa.me/919840874966" className="text-[color:var(--rose)] underline underline-offset-4">
            Chat with us on WhatsApp
          </a>
        </p>
      </div>
    </section>
  );
}

function Visit() {
  return (
    <section id="visit" className="relative z-10 px-6 py-24">
      <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-10">
        <div className="rounded-3xl bg-foreground text-background p-10 sm:p-14 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-[color:var(--rose)] opacity-30 blur-3xl" />
          <p className="font-script text-3xl text-[color:var(--petal)]">visit us</p>
          <h2 className="font-display text-4xl sm:text-5xl mt-2">Come for a touch of pink perfection.</h2>
          <div className="mt-10 space-y-6 text-background/85">
            <Info label="Address" value="No 04 Udaiyaar Street, Ninnakarai Road, Kattankulathur, Tamil Nadu 603203" />
            <Info label="Hours" value={<><div>Mon – Sat · 10:05 AM – 9:05 PM</div><div>Sun · 10:07 AM – 9:07 PM</div></>} />
            <Info label="Phone / WhatsApp" value={<a href="tel:+919840874966" className="hover:text-[color:var(--petal)]">+91 98408 74966</a>} />
            <Info label="Instagram" value={<a href="https://www.instagram.com/pinklove_beautystudio/" target="_blank" rel="noreferrer" className="hover:text-[color:var(--petal)]">@pinklove_beautystudio</a>} />
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="https://wa.me/919840874966" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3 text-background hover:opacity-90 transition">WhatsApp Booking</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Pink+Love+Beauty+Studio+Kattankulathur" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-background/30 px-6 py-3 hover:border-[color:var(--petal)] transition">Directions</a>
          </div>
        </div>
        <div className="rounded-3xl overflow-hidden shadow-[var(--shadow-soft)] min-h-[400px]">
          <iframe
            title="Pink Love Beauty Studio location"
            src="https://www.google.com/maps?q=Kattankulathur,+Tamil+Nadu+603203&output=embed"
            className="h-full w-full min-h-[400px]"
            loading="lazy"
          />
        </div>
      </div>
      <div className="mx-auto max-w-7xl mt-10 grid sm:grid-cols-7 gap-2 text-center text-xs">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
          <div key={d} className={`rounded-2xl p-4 ${i === 1 || i === 3 || i === 5 ? "bg-[color:var(--rose)] text-background" : "bg-[color:var(--blush)]/60"}`}>
            <div className="font-display text-lg">{d}</div>
            <div className="opacity-80 mt-1">{i === 6 ? "10:07 – 9:07" : "10:05 – 9:05"}</div>
            {(i === 1 || i === 3 || i === 5) && <div className="mt-2 text-[10px] uppercase tracking-widest">Busy</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] tracking-[0.3em] uppercase text-background/50 mb-1">{label}</div>
      <div className="text-lg">{value}</div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 px-6 pt-16 pb-10 text-center border-t border-foreground/10">
      <div className="flex flex-col items-center justify-center mb-6">
        <img
          src={logo}
          alt="Pink Love Beauty Studio Logo"
          className="h-16 w-16 rounded-full object-cover shadow-[var(--shadow-soft)] border border-rose-200/50"
        />
      </div>
      <p className="font-script text-5xl text-gradient-rose">Pink Love</p>
      <p className="mt-2 text-xs uppercase tracking-[0.4em] text-foreground/60">Beauty Studio · Kattankulathur</p>
      <p className="mt-8 text-xs text-foreground/50">© {new Date().getFullYear()} Pink Love Beauty Studio. Made with love & a touch of pink.</p>
    </footer>
  );
}
