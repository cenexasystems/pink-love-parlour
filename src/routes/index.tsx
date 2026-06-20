import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pink Love Beauty Studio — HD Bridal Makeovers in Kattankulathur" },
      {
        name: "description",
        content:
          "Pink Love Beauty Studio: women-led aesthetic studio in Kattankulathur specializing in HD bridal makeovers, Korean glass skin facials, hair styling and bridal jewelry.",
      },
      { property: "og:title", content: "Pink Love Beauty Studio" },
      {
        property: "og:description",
        content: "Elegance meets care. HD bridal makeovers, facials, hair & bridal jewelry in Kattankulathur.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Allura&family=Jost:wght@300;400;500;600&display=swap",
      },
    ],
  }),
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
      <Gallery />
      <Reels />
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
          <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-[oklch(0.55_0.25_5)] to-[oklch(0.78_0.16_0)] text-primary-foreground font-display text-xl shadow-[var(--shadow-soft)]">
            P
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-script text-xl text-[color:var(--rose)]">Pink Love</span>
            <span className="text-[10px] tracking-[0.35em] uppercase text-muted-foreground">Beauty Studio</span>
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm tracking-wide">
          {["About", "Services", "Gallery", "Reels", "Visit"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="text-foreground/70 hover:text-[color:var(--rose)] transition">
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
              <div className="inline-flex items-center gap-2 rounded-full bg-background/70 backdrop-blur px-4 py-1.5 text-xs tracking-[0.25em] uppercase text-[color:var(--rose)] animate-fade-up">
                ✦ Est. Kattankulathur · 5.0 ★ Google
              </div>
              <h1 className="mt-6 font-display text-5xl sm:text-7xl lg:text-[5.5rem] leading-[0.95] animate-fade-up" style={{ animationDelay: "0.1s" }}>
                Where <span className="font-script text-gradient-rose text-6xl sm:text-8xl lg:text-[6.5rem] align-baseline">elegance</span>
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
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-background hover:bg-[color:var(--rose)] transition shadow-[var(--shadow-petal)]"
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
      <div className="mx-auto max-w-6xl grid lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5">
          <p className="font-script text-3xl text-[color:var(--rose)]">our story</p>
          <h2 className="mt-2 font-display text-4xl sm:text-5xl">A studio built on love & glow.</h2>
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

function Reels() {
  return (
    <section id="reels" className="relative z-10 px-6 py-24 bg-[color:var(--blush)]/50">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <p className="font-script text-3xl text-[color:var(--rose)]">@pinklove_beautystudio</p>
          <h2 className="font-display text-5xl sm:text-6xl mt-1">Live from the studio</h2>
          <p className="mt-4 text-foreground/70 max-w-xl mx-auto">
            Browse our latest makeovers, jewelry displays and behind-the-scenes reels on Instagram.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[g4, g1, g2].map((src, i) => (
            <a
              key={i}
              href="https://www.instagram.com/pinklove_beautystudio/"
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-[9/16] overflow-hidden rounded-3xl shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-petal)] transition"
            >
              <img src={src} alt={`Reel preview ${i + 1}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute inset-0 grid place-items-center">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-background/90 backdrop-blur transition group-hover:scale-110">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-[color:var(--rose)] ml-1">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-background">
                <div className="text-xs uppercase tracking-widest opacity-80">Instagram Reel</div>
                <div className="font-display text-xl">Bridal Look #{i + 1}</div>
              </div>
            </a>
          ))}
        </div>
        <div className="text-center mt-10">
          <a
            href="https://www.instagram.com/pinklove_beautystudio/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-background hover:bg-[color:var(--rose)] transition"
          >
            Follow @pinklove_beautystudio →
          </a>
        </div>
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
      <p className="font-script text-5xl text-gradient-rose">Pink Love</p>
      <p className="mt-2 text-xs uppercase tracking-[0.4em] text-foreground/60">Beauty Studio · Kattankulathur</p>
      <p className="mt-8 text-xs text-foreground/50">© {new Date().getFullYear()} Pink Love Beauty Studio. Made with love & a touch of pink.</p>
    </footer>
  );
}
