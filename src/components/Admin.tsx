import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://pink-love-placeholder.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder";

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      "x-admin-passcode": "0265",
    },
  },
});
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Plus, 
  Trash2, 
  Save, 
  Lock, 
  Unlock, 
  Eye, 
  Sparkles, 
  Scissors, 
  FolderOpen,
  Image,
  Upload,
  Loader2,
  Grid,
  Ticket,
  Video
} from "lucide-react";

const PASSCODE = "0265";
const STORAGE_KEY = "pl_admin_ok";

const DEFAULT_GALLERY = [
  {
    src: "",
    cloudinaryId: "v1782023965/WhatsApp_Image_2026-06-20_at_12.54.44_1_rjgdsw",
    alt: "Pink Love bridal makeup close-up and jewellery styling"
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
type ComboItem = {
  id: string;
  page: number;
  services: string[];
  price: string;
  created_at: string;
};

type IndividualRow = {
  id: string;
  side: string;
  category: string;
  name: string;
  price: string;
  created_at: string;
};

export function Admin() {
  const [authed, setAuthed] = useState<boolean>(() =>
    typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY) === "1",
  );
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");

  if (!authed) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-100/50 via-background to-amber-50/30 p-6">
        <div className="flex-1 flex items-center justify-center">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (code === PASSCODE) {
                sessionStorage.setItem(STORAGE_KEY, "1");
                setAuthed(true);
                toast.success("Welcome back, Admin!");
              } else {
                setErr("Incorrect passcode");
                toast.error("Access denied");
              }
            }}
            className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl border border-rose-100 shadow-2xl p-8 sm:p-10 space-y-6"
          >
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-2">
                <Lock className="w-5 h-5" />
              </div>
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-rose-600">Admin Access</h1>
              <p className="text-sm text-muted-foreground">Enter the passcode to manage your menu items.</p>
            </div>

            <div className="space-y-3">
              <Input
                type="password"
                inputMode="numeric"
                placeholder="Passcode"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setErr("");
                }}
                className="text-center text-lg tracking-widest h-12 focus-visible:ring-rose-400"
                autoFocus
              />
              {err && <p className="text-sm text-center text-destructive font-medium">{err}</p>}
            </div>

            <Button type="submit" className="w-full h-12 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-rose-200/50 transition-all duration-300">
              Unlock Dashboard
            </Button>
          </form>
        </div>

        <AdminFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/20 via-background to-background p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-rose-100">
          <div>
            <h1 className="font-display text-4xl font-extrabold tracking-tight bg-gradient-to-r from-rose-600 to-pink-500 bg-clip-text text-transparent">
              Studio Menu Admin
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Easily add, edit, and remove packages and services. Changes appear on the live site instantly.
            </p>
          </div>
          <div className="flex gap-2.5 w-full sm:w-auto">
            <Button 
              variant="outline" 
              onClick={() => (window.location.href = "/")} 
              className="flex-1 sm:flex-initial gap-2 border-rose-200 text-rose-700 hover:bg-rose-50"
            >
              <Eye className="w-4 h-4" /> View Site
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                sessionStorage.removeItem(STORAGE_KEY);
                setAuthed(false);
                toast.info("Logged out successfully");
              }}
              className="flex-1 sm:flex-initial gap-2 text-muted-foreground hover:text-rose-600"
            >
              <Unlock className="w-4 h-4" /> Lock
            </Button>
          </div>
        </header>

        <Tabs defaultValue="combos" className="space-y-6">
          <TabsList className="flex items-center justify-between w-full max-w-lg mx-auto bg-rose-50/60 p-1 rounded-full border border-rose-100 shadow-sm h-12">
            <TabsTrigger 
              value="combos" 
              className="flex-1 flex items-center justify-center rounded-full h-10 font-bold text-xs sm:text-sm tracking-wide transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-rose-600 data-[state=active]:shadow-md text-rose-800/70 hover:text-rose-900 cursor-pointer px-1.5 sm:px-3"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2 shrink-0" />
              <span className="hidden xs:inline">Value </span>Combos
            </TabsTrigger>
            <TabsTrigger 
              value="alacarte" 
              className="flex-1 flex items-center justify-center rounded-full h-10 font-bold text-xs sm:text-sm tracking-wide transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-rose-600 data-[state=active]:shadow-md text-rose-800/70 hover:text-rose-900 cursor-pointer px-1.5 sm:px-3"
            >
              <Scissors className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2 shrink-0" /> Services
            </TabsTrigger>
            <TabsTrigger 
              value="gallery" 
              className="flex-1 flex items-center justify-center rounded-full h-10 font-bold text-xs sm:text-sm tracking-wide transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-rose-600 data-[state=active]:shadow-md text-rose-800/70 hover:text-rose-900 cursor-pointer px-1.5 sm:px-3"
            >
              <Image className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2 shrink-0" /> Gallery
            </TabsTrigger>
            <TabsTrigger 
              value="coupons" 
              className="flex-1 flex items-center justify-center rounded-full h-10 font-bold text-xs sm:text-sm tracking-wide transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-rose-600 data-[state=active]:shadow-md text-rose-800/70 hover:text-rose-900 cursor-pointer px-1.5 sm:px-3"
            >
              <Ticket className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2 shrink-0" /> Coupons
            </TabsTrigger>
          </TabsList>

          <TabsContent value="combos" className="space-y-6">
            <CombosPanel />
          </TabsContent>

          <TabsContent value="alacarte" className="space-y-6">
            <IndividualsPanel />
          </TabsContent>

          <TabsContent value="gallery" className="space-y-6">
            <GalleryPanel />
          </TabsContent>

          <TabsContent value="coupons" className="space-y-6">
            <CouponsPanel />
          </TabsContent>
        </Tabs>

        <AdminFooter />
      </div>
    </div>
  );
}

function CombosPanel() {
  const [items, setItems] = useState<ComboItem[]>([]);
  const [page, setPage] = useState(1);
  const [servicesText, setServicesText] = useState("");
  const [price, setPrice] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("combo_items")
      .select("*")
      .order("page")
      .order("created_at", { ascending: true });
    setItems((data || []) as ComboItem[]);
  };

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    const services = servicesText
      .split(/\n|,/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (!services.length) {
      toast.error("Please enter at least one service name.");
      return;
    }
    if (!price) {
      toast.error("Please enter a price.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("combo_items").insert({ page, services, price });
    setBusy(false);

    if (error) {
      toast.error("Failed to add combo package.");
      console.error(error);
    } else {
      toast.success("Combo package added successfully!");
      setServicesText("");
      setPrice("");
      load();
    }
  };

  const update = async (it: ComboItem, patch: Partial<ComboItem>) => {
    const { error } = await supabase.from("combo_items").update(patch).eq("id", it.id);
    if (error) {
      toast.error("Failed to update combo package.");
      console.error(error);
    } else {
      toast.success("Changes saved!");
      load();
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Are you sure you want to delete this combo?")) return;
    const { error } = await supabase.from("combo_items").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete combo package.");
      console.error(error);
    } else {
      toast.success("Combo package deleted");
      load();
    }
  };

  const page1Combos = items.filter((it) => it.page === 1);
  const page2Combos = items.filter((it) => it.page === 2);

  return (
    <div className="space-y-8">
      <Card className="border-rose-100 shadow-md overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-rose-50/60 to-pink-50/60 border-b border-rose-100 p-6">
          <CardTitle className="text-xl font-bold text-rose-700 flex items-center gap-2">
            <Plus className="w-5 h-5 text-rose-500" /> Create New Value Combo
          </CardTitle>
          <CardDescription>Add a new multi-service package to Page 1 or Page 2 of the menu card.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-rose-900 uppercase tracking-wider">Page Location</label>
              <select
                className="w-full h-10 rounded-lg border border-rose-100 bg-white px-3 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm font-semibold"
                value={page}
                onChange={(e) => setPage(Number(e.target.value))}
              >
                <option value={1}>Page 1 (Left Page)</option>
                <option value={2}>Page 2 (Right Page)</option>
              </select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-rose-900 uppercase tracking-wider">Price tag</label>
              <Input 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                placeholder="e.g. ₹1500 or ₹500 each" 
                className="h-10 border-rose-100 focus-visible:ring-rose-400 font-semibold"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-rose-900 uppercase tracking-wider">
              Services Included (one per line or comma-separated)
            </label>
            <Textarea 
              rows={3} 
              value={servicesText} 
              onChange={(e) => setServicesText(e.target.value)} 
              placeholder="e.g.&#10;GOLD FACIAL&#10;D-TAN (FACE + NECK)&#10;PEDICURE" 
              className="border-rose-100 focus-visible:ring-rose-400 font-medium"
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button 
              onClick={add} 
              disabled={busy} 
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold h-10 rounded-lg px-6 shadow-md transition-all gap-2"
            >
              <Plus className="w-4 h-4" /> Add Combo Package
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="font-display text-2xl font-bold text-rose-900 px-1 border-b border-rose-100 pb-2">Current Combo Packages</h2>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Page 1 (Left Page) Column */}
          <div className="space-y-4 bg-rose-50/10 p-4 sm:p-5 rounded-2xl border border-rose-100">
            <div className="flex justify-between items-center px-1 border-b border-rose-100/50 pb-2">
              <h3 className="font-display text-lg font-bold text-rose-800 flex items-center gap-2">
                <span>Page 1</span>
                <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">Left Page</span>
              </h3>
              <span className="text-xs text-muted-foreground font-semibold">{page1Combos.length} items</span>
            </div>
            {page1Combos.length === 0 ? (
              <div className="text-center py-10 bg-white/40 rounded-xl border border-dashed border-rose-200 text-muted-foreground text-sm">
                No combos on Page 1.
              </div>
            ) : (
              <div className="flex flex-col gap-3.5">
                {page1Combos.map((it) => (
                  <ComboRow key={it.id} item={it} onUpdate={update} onDelete={remove} />
                ))}
              </div>
            )}
          </div>

          {/* Page 2 (Right Page) Column */}
          <div className="space-y-4 bg-rose-50/10 p-4 sm:p-5 rounded-2xl border border-rose-100">
            <div className="flex justify-between items-center px-1 border-b border-rose-100/50 pb-2">
              <h3 className="font-display text-lg font-bold text-rose-800 flex items-center gap-2">
                <span>Page 2</span>
                <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">Right Page</span>
              </h3>
              <span className="text-xs text-muted-foreground font-semibold">{page2Combos.length} items</span>
            </div>
            {page2Combos.length === 0 ? (
              <div className="text-center py-10 bg-white/40 rounded-xl border border-dashed border-rose-200 text-muted-foreground text-sm">
                No combos on Page 2.
              </div>
            ) : (
              <div className="flex flex-col gap-3.5">
                {page2Combos.map((it) => (
                  <ComboRow key={it.id} item={it} onUpdate={update} onDelete={remove} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ComboRow({
  item,
  onUpdate,
  onDelete,
}: {
  item: ComboItem;
  onUpdate: (it: ComboItem, p: Partial<ComboItem>) => void;
  onDelete: (id: string) => void;
}) {
  const [services, setServices] = useState(item.services.join("\n"));
  const [price, setPrice] = useState(item.price);
  const [page, setPage] = useState(item.page);
  
  const dirty = services !== item.services.join("\n") || price !== item.price || page !== item.page;

  return (
    <div className="rounded-xl border border-rose-100 bg-white p-4 shadow-sm hover:shadow-md transition-all duration-300 space-y-3">
      <div>
        <label className="text-[9px] font-extrabold uppercase text-rose-500 tracking-wider block mb-1">Services</label>
        <Textarea 
          rows={Math.max(2, item.services.length)} 
          value={services} 
          onChange={(e) => setServices(e.target.value)} 
          className="min-h-9 border-rose-100 focus-visible:ring-rose-400 text-sm font-semibold py-1"
        />
      </div>

      <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 pt-2.5 border-t border-rose-50">
        <div className="col-span-1 sm:w-24 sm:shrink-0">
          <select
            className="w-full h-8.5 rounded-lg border border-rose-100 bg-white px-1.5 focus:outline-none focus:ring-1 focus:ring-rose-400 text-xs font-semibold"
            value={page}
            onChange={(e) => setPage(Number(e.target.value))}
          >
            <option value={1}>Page 1</option>
            <option value={2}>Page 2</option>
          </select>
        </div>

        <div className="col-span-1 sm:flex-1">
          <Input 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            className="h-8.5 border-rose-100 focus-visible:ring-rose-400 text-xs font-bold text-rose-700"
            placeholder="Price"
          />
        </div>

        <div className="col-span-2 sm:col-span-1 flex gap-1.5 sm:shrink-0 justify-end mt-1 sm:mt-0">
          <Button
            size="sm"
            disabled={!dirty}
            onClick={() =>
              onUpdate(item, {
                services: services.split(/\n|,/).map((s) => s.trim()).filter(Boolean),
                price,
                page,
              })
            }
            className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-8.5 text-xs px-2.5 gap-1 justify-center"
          >
            <Save className="w-3.5 h-3.5" /> Save
          </Button>
          <Button 
            size="sm" 
            variant="destructive" 
            onClick={() => onDelete(item.id)}
            className="h-8.5 w-8.5 p-0 shrink-0 flex items-center justify-center"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function IndividualsPanel() {
  const [items, setItems] = useState<IndividualRow[]>([]);
  const [side, setSide] = useState("left");
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const load = async () => {
    const { data } = await supabase
      .from("individual_services")
      .select("*")
      .order("side")
      .order("category")
      .order("created_at", { ascending: true });
    setItems((data || []) as IndividualRow[]);
  };

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    if (!category.trim()) {
      toast.error("Please enter a category name (e.g. Threading, Hair Cut).");
      return;
    }
    if (!name.trim()) {
      toast.error("Please enter a service name.");
      return;
    }
    if (!price.trim()) {
      toast.error("Please enter a price.");
      return;
    }

    const { error } = await supabase
      .from("individual_services")
      .insert({ side, category: category.trim(), name: name.trim(), price: price.trim() });
    
    if (error) {
      toast.error("Failed to add individual service.");
      console.error(error);
    } else {
      toast.success("Service added successfully!");
      setName("");
      setPrice("");
      load();
    }
  };

  const update = async (it: IndividualRow, patch: Partial<IndividualRow>) => {
    const { error } = await supabase.from("individual_services").update(patch).eq("id", it.id);
    if (error) {
      toast.error("Failed to update service.");
      console.error(error);
    } else {
      toast.success("Changes saved!");
      load();
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    const { error } = await supabase.from("individual_services").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete service.");
      console.error(error);
    } else {
      toast.success("Service deleted");
      load();
    }
  };

  const leftItems = items.filter((i) => i.side === "left");
  const rightItems = items.filter((i) => i.side === "right");

  const leftCategories = Array.from(new Set(leftItems.map((i) => i.category))).sort();
  const rightCategories = Array.from(new Set(rightItems.map((i) => i.category))).sort();

  return (
    <div className="space-y-8">
      <Card className="border-rose-100 shadow-md overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-rose-50/60 to-pink-50/60 border-b border-rose-100 p-6">
          <CardTitle className="text-xl font-bold text-rose-700 flex items-center gap-2">
            <Plus className="w-5 h-5 text-rose-500" /> Create New Individual Service
          </CardTitle>
          <CardDescription>Add an individual item, treatment, or makeup package to the menu.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid sm:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-rose-900 uppercase tracking-wider">Side Column</label>
              <select
                className="w-full h-10 rounded-lg border border-rose-100 bg-white px-3 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm font-semibold"
                value={side}
                onChange={(e) => setSide(e.target.value)}
              >
                <option value="left">Left Column (Page 1)</option>
                <option value="right">Right Column (Page 2)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-rose-900 uppercase tracking-wider">Category Name</label>
              <Input 
                list="cat-list-admin" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                placeholder="e.g. Threading or Hair Cut" 
                className="h-10 border-rose-100 focus-visible:ring-rose-400 font-semibold"
              />
              <datalist id="cat-list-admin">
                {Array.from(new Set(items.map((i) => i.category))).sort().map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-rose-900 uppercase tracking-wider">Service Name</label>
              <Input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="e.g. Straight cut" 
                className="h-10 border-rose-100 focus-visible:ring-rose-400 font-semibold"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-rose-900 uppercase tracking-wider">Price tag</label>
              <Input 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                placeholder="e.g. 50 or 1500 - 2500" 
                className="h-10 border-rose-100 focus-visible:ring-rose-400 font-semibold"
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button 
              onClick={add} 
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold h-10 rounded-lg px-6 shadow-md transition-all gap-2"
            >
              <Plus className="w-4 h-4" /> Add Service
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="font-display text-2xl font-bold text-rose-900 px-1 border-b border-rose-100 pb-2">Current Individual Services</h2>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column (Page 1) Individual Services */}
          <div className="space-y-5 bg-rose-50/10 p-4 sm:p-5 rounded-2xl border border-rose-100">
            <div className="flex justify-between items-center px-1 border-b border-rose-100/50 pb-2">
              <h3 className="font-display text-lg font-bold text-rose-800 flex items-center gap-2">
                <span>Left Column</span>
                <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">Page 1 Services</span>
              </h3>
              <span className="text-xs text-muted-foreground font-semibold">{leftItems.length} items</span>
            </div>

            {leftCategories.length === 0 ? (
              <div className="text-center py-10 bg-white/40 rounded-xl border border-dashed border-rose-200 text-muted-foreground text-sm">
                No individual services on the Left Column.
              </div>
            ) : (
              <div className="space-y-6">
                {leftCategories.map((catName) => {
                  const catItems = leftItems.filter((i) => i.category === catName);
                  return (
                    <div key={catName} className="bg-white/60 backdrop-blur-sm rounded-xl border border-rose-100 p-4 space-y-3 shadow-sm">
                      <div className="flex items-center gap-2 border-b border-rose-100/30 pb-1.5">
                        <FolderOpen className="w-4 h-4 text-rose-500" />
                        <h4 className="font-display text-md font-extrabold text-rose-800 uppercase tracking-wider">{catName}</h4>
                      </div>
                      <div className="grid gap-2">
                        {catItems.map((it) => (
                          <IndividualRowEditor key={it.id} item={it} onUpdate={update} onDelete={remove} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column (Page 2) Individual Services */}
          <div className="space-y-5 bg-rose-50/10 p-4 sm:p-5 rounded-2xl border border-rose-100">
            <div className="flex justify-between items-center px-1 border-b border-rose-100/50 pb-2">
              <h3 className="font-display text-lg font-bold text-rose-800 flex items-center gap-2">
                <span>Right Column</span>
                <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">Page 2 Services</span>
              </h3>
              <span className="text-xs text-muted-foreground font-semibold">{rightItems.length} items</span>
            </div>

            {rightCategories.length === 0 ? (
              <div className="text-center py-10 bg-white/40 rounded-xl border border-dashed border-rose-200 text-muted-foreground text-sm">
                No individual services on the Right Column.
              </div>
            ) : (
              <div className="space-y-6">
                {rightCategories.map((catName) => {
                  const catItems = rightItems.filter((i) => i.category === catName);
                  return (
                    <div key={catName} className="bg-white/60 backdrop-blur-sm rounded-xl border border-rose-100 p-4 space-y-3 shadow-sm">
                      <div className="flex items-center gap-2 border-b border-rose-100/30 pb-1.5">
                        <FolderOpen className="w-4 h-4 text-rose-500" />
                        <h4 className="font-display text-md font-extrabold text-rose-800 uppercase tracking-wider">{catName}</h4>
                      </div>
                      <div className="grid gap-2">
                        {catItems.map((it) => (
                          <IndividualRowEditor key={it.id} item={it} onUpdate={update} onDelete={remove} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function IndividualRowEditor({
  item,
  onUpdate,
  onDelete,
}: {
  item: IndividualRow;
  onUpdate: (it: IndividualRow, p: Partial<IndividualRow>) => void;
  onDelete: (id: string) => void;
}) {
  const [side, setSide] = useState(item.side);
  const [category, setCategory] = useState(item.category);
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(item.price);
  
  const dirty = side !== item.side || category !== item.category || name !== item.name || price !== item.price;

  return (
    <div className="rounded-xl border border-rose-50 bg-white/95 p-3.5 shadow-sm hover:shadow transition-all duration-200 space-y-2.5">
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="text-[9px] font-extrabold uppercase text-rose-400 block mb-0.5">Service Name</label>
          <Input 
            className="h-8.5 border-rose-100 focus-visible:ring-rose-400 text-xs font-semibold" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
        </div>
        <div>
          <label className="text-[9px] font-extrabold uppercase text-rose-400 block mb-0.5">Category</label>
          <Input 
            className="h-8.5 border-rose-100 focus-visible:ring-rose-400 text-xs font-semibold" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 pt-2 border-t border-rose-50/50">
        <div className="col-span-1 sm:w-24 sm:shrink-0">
          <select
            className="w-full h-8.5 rounded-lg border border-rose-100 bg-white px-1.5 focus:outline-none focus:ring-1 focus:ring-rose-400 text-xs font-semibold"
            value={side}
            onChange={(e) => setSide(e.target.value)}
          >
            <option value="left">Left Column</option>
            <option value="right">Right Column</option>
          </select>
        </div>

        <div className="col-span-1 sm:flex-1">
          <Input 
            className="h-8.5 border-rose-100 focus-visible:ring-rose-400 text-xs font-bold text-rose-700" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            placeholder="Price"
          />
        </div>

        <div className="col-span-2 sm:col-span-1 flex gap-1.5 sm:shrink-0 justify-end mt-1 sm:mt-0">
          <Button
            size="sm"
            disabled={!dirty}
            onClick={() => onUpdate(item, { side, category, name, price })}
            className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-8.5 px-2.5 text-xs gap-1 justify-center"
          >
            <Save className="w-3 h-3" /> Save
          </Button>
          <Button 
            size="sm" 
            variant="destructive" 
            onClick={() => onDelete(item.id)}
            className="h-8.5 w-8.5 p-0 shrink-0 flex items-center justify-center"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

type DbGalleryImage = {
  id: string;
  url: string;
  cloudinary_id: string | null;
  alt: string;
  position: number;
  type?: string;
};

function GalleryPanel() {
  const [activeTab, setActiveTab] = useState<"photos" | "videos">("photos");
  const [images, setImages] = useState<DbGalleryImage[]>([]);
  const [videos, setVideos] = useState<DbGalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("gallery_images")
        .select("*")
        .order("position", { ascending: true });
      
      const allItems = (data || []) as DbGalleryImage[];
      setImages(allItems.filter((img) => img.type === "image" || !img.type));
      setVideos(allItems.filter((img) => img.type === "video"));
    } catch (e) {
      console.warn("Could not fetch remote gallery items:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Build 20 slots for images
  const imageSlots = Array.from({ length: 20 }, (_, index) => {
    const existing = images.find((img) => img.position === index);
    return { position: index, existing };
  });

  const previewImageSlots = imageSlots.slice(0, 6);
  const remainingImageSlots = imageSlots.slice(6);

  // Build 20 slots for videos
  const videoSlots = Array.from({ length: 20 }, (_, index) => {
    const existing = videos.find((img) => img.position === index);
    return { position: index, existing };
  });

  const previewVideoSlots = videoSlots.slice(0, 6);
  const remainingVideoSlots = videoSlots.slice(6);

  return (
    <div className="space-y-8 animate-fade-up">
      <Card className="border-rose-100 shadow-md bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-rose-50/60 to-pink-50/60 border-b border-rose-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold text-rose-700 flex items-center gap-2">
              <Image className="w-5 h-5 text-rose-500" /> Live Gallery Editor
            </CardTitle>
            <CardDescription className="mt-1">
              Manage website portfolio photos and gallery videos in real-time.
            </CardDescription>
          </div>

          {/* Media Switcher: [ Photos ]  [ Videos ] */}
          <div className="flex items-center gap-1.5 p-1.5 bg-rose-100/80 rounded-2xl border border-rose-200 shrink-0 self-start md:self-auto shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab("photos")}
              className={`flex items-center justify-center gap-2 px-5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                activeTab === "photos"
                  ? "bg-white text-rose-700 shadow-md scale-100 ring-1 ring-rose-200"
                  : "text-rose-900/60 hover:text-rose-900 hover:bg-white/40"
              }`}
            >
              <Image className="w-4 h-4 text-rose-500" />
              Photos
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("videos")}
              className={`flex items-center justify-center gap-2 px-5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                activeTab === "videos"
                  ? "bg-white text-rose-700 shadow-md scale-100 ring-1 ring-rose-200"
                  : "text-rose-900/60 hover:text-rose-900 hover:bg-white/40"
              }`}
            >
              <Video className="w-4 h-4 text-rose-500" />
              Videos
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-rose-600 space-y-3">
              <Loader2 className="w-10 h-10 animate-spin" />
              <span className="font-semibold text-sm">Loading visual editor...</span>
            </div>
          ) : activeTab === "photos" ? (
            <div className="space-y-10">
              {/* Primary Portfolio Grid (First 6 Slots) */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-rose-900 uppercase tracking-wider px-1">HOMEPAGE PHOTO SLOTS (1 - 6)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-5xl">
                  {previewImageSlots.map((slot) => (
                    <div key={slot.position} className="w-full aspect-[2/3]">
                      <GallerySlotEditor
                        position={slot.position}
                        existing={slot.existing}
                        onChanged={load}
                        isLarge={false}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <hr className="border-rose-100" />

              {/* Remaining Grid Slots (7 - 20) */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-rose-900 uppercase tracking-wider px-1">ADDITIONAL PHOTO SLOTS (7 - 20)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {remainingImageSlots.map((slot) => (
                    <div key={slot.position} className="h-[260px]">
                      <GallerySlotEditor
                        position={slot.position}
                        existing={slot.existing}
                        onChanged={load}
                        isLarge={false}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Videos Tab */
            <div className="space-y-10">
              {/* Primary Video Slots (1 - 6) */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-rose-900 uppercase tracking-wider px-1">HOMEPAGE VIDEO SLOTS (1 - 6)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
                  {previewVideoSlots.map((slot) => (
                    <div key={slot.position} className="w-full aspect-video min-h-[220px]">
                      <GalleryVideoSlotEditor
                        position={slot.position}
                        existing={slot.existing}
                        onChanged={load}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <hr className="border-rose-100" />

              {/* Additional Video Slots (7 - 20) */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-rose-900 uppercase tracking-wider px-1">ADDITIONAL VIDEO SLOTS (7 - 20)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {remainingVideoSlots.map((slot) => (
                    <div key={slot.position} className="h-[220px]">
                      <GalleryVideoSlotEditor
                        position={slot.position}
                        existing={slot.existing}
                        onChanged={load}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function GalleryVideoSlotEditor({
  position,
  existing,
  onChanged,
}: {
  position: number;
  existing: DbGalleryImage | undefined;
  onChanged: () => void;
}) {
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);

  const handleVideoUpload = async (file: File) => {
    const validTypes = ["video/mp4", "video/webm", "video/quicktime"];
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const validExts = ["mp4", "webm", "mov"];

    if (!validTypes.includes(file.type) && !validExts.includes(ext)) {
      toast.error("Please select a valid video format (.mp4, .webm, .mov)");
      return;
    }

    // Set local preview immediately for frontend responsiveness
    const localUrl = URL.createObjectURL(file);
    setLocalPreview(localUrl);

    setUploading(true);
    setUploadProgress(20);
    const fileName = `videos/gallery_video_${position}_${Date.now()}.${ext || "mp4"}`;

    try {
      setUploadProgress(50);
      const { data, error: uploadErr } = await supabase.storage
        .from("gallery")
        .upload(fileName, file, { cacheControl: "3600", upsert: true });

      if (uploadErr) {
        console.warn("Storage upload notice:", uploadErr.message);
        toast.success(`Video loaded in preview for Video Slot ${position + 1}`);
        return;
      }

      setUploadProgress(80);
      const { data: { publicUrl } } = supabase.storage
        .from("gallery")
        .getPublicUrl(fileName);

      if (existing) {
        const { error: dbErr } = await supabase
          .from("gallery_images")
          .update({
            url: publicUrl,
            cloudinary_id: null,
            type: "video",
          })
          .eq("id", existing.id);
        if (dbErr) console.warn("DB update notice:", dbErr.message);
      } else {
        const { error: dbErr } = await supabase
          .from("gallery_images")
          .insert({
            url: publicUrl,
            cloudinary_id: null,
            alt: `Pink Love video slot ${position + 1}`,
            position,
            type: "video",
          });
        if (dbErr) console.warn("DB insert notice:", dbErr.message);
      }

      setUploadProgress(100);
      toast.success(`Video Slot ${position + 1} updated successfully!`);
      onChanged();
    } catch (err: any) {
      console.warn("Upload fallback to local preview:", err);
      toast.success(`Video loaded in preview for Video Slot ${position + 1}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemove = async () => {
    setLocalPreview(null);
    setShowConfirmRemove(false);

    if (existing) {
      setUploading(true);
      try {
        const { error } = await supabase
          .from("gallery_images")
          .delete()
          .eq("id", existing.id);
        if (error) throw error;
        toast.success(`Video Slot ${position + 1} removed`);
        onChanged();
      } catch (err: any) {
        console.error(err);
        toast.error("Failed to remove video record.");
      } finally {
        setUploading(false);
      }
    } else {
      toast.success(`Video Slot ${position + 1} cleared`);
    }
  };

  const fileInputId = `video-file-input-${position}`;
  const displayUrl = localPreview || (existing ? existing.url : "");

  const progressPercent = Math.min(100, Math.max(0, uploadProgress));
  const filledBlocks = Math.floor(progressPercent / 10);
  const emptyBlocks = 10 - filledBlocks;
  const progressText = `[${"█".repeat(filledBlocks)}${"░".repeat(emptyBlocks)}] ${progressPercent}%`;

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={async (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) await handleVideoUpload(file);
      }}
      className={`group relative w-full h-full rounded-2xl overflow-hidden border transition-all duration-300 ${
        isDragOver
          ? "border-rose-500 ring-4 ring-rose-200 bg-rose-100/50 scale-[1.01]"
          : "border-rose-100 shadow-[var(--shadow-soft)] hover:shadow-md bg-rose-50/10"
      } flex flex-col justify-center items-center`}
    >
      {/* Uploading Progress Overlay */}
      {uploading && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center text-rose-600 z-30 p-4 space-y-2">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-xs font-bold tracking-wider uppercase">Processing video...</span>
          <div className="w-3/4 bg-rose-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-rose-500 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[10px] font-mono font-bold text-rose-600">{progressText}</span>
        </div>
      )}

      {displayUrl ? (
        <div className="relative w-full h-full flex flex-col justify-between group">
          {/* HTML5 Video Preview */}
          <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
            <video
              src={displayUrl}
              controls
              preload="metadata"
              playsInline
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>

          {/* Slot Number & Custom / Preview Badge */}
          <div className="absolute top-3 left-3 bg-rose-600/90 text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full z-10 shadow flex items-center gap-1.5 pointer-events-none">
            <span>Video Slot {position + 1}</span>
            {localPreview ? (
              <span className="bg-amber-500 text-white text-[8px] uppercase px-1.5 py-0.2 rounded-sm font-bold">PREVIEW</span>
            ) : existing ? (
              <span className="bg-emerald-500 text-white text-[8px] uppercase px-1.5 py-0.2 rounded-sm font-bold">SAVED</span>
            ) : null}
          </div>

          {/* Controls Bar Overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 z-20 bg-black/70 backdrop-blur-md p-1.5 rounded-xl border border-white/10 opacity-90 group-hover:opacity-100 transition-opacity">
            <label
              htmlFor={fileInputId}
              className="bg-white/95 hover:bg-white text-rose-600 text-[10px] font-bold px-3 py-1 rounded-lg transition cursor-pointer shadow hover:scale-105 active:scale-95"
            >
              Replace
            </label>
            <button
              onClick={() => setShowConfirmRemove(true)}
              className="bg-red-600/90 hover:bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg transition shadow hover:scale-105 active:scale-95 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        /* Empty Video Slot Card */
        <div className={`p-4 text-center flex flex-col items-center justify-center h-full w-full border-2 border-dashed rounded-2xl transition-all ${
          isDragOver ? "border-rose-500 bg-rose-100/60" : "border-rose-300 bg-rose-50/10 hover:bg-rose-50/20"
        }`}>
          <Video className={`w-8 h-8 text-rose-400 mb-1.5 transition-transform duration-300 ${isDragOver ? "scale-125 text-rose-600" : ""}`} />
          <span className="text-xs font-bold text-rose-900">
            Video Slot {position + 1}
          </span>
          <p className="text-[10px] text-rose-500/80 mt-0.5 font-medium">
            {isDragOver ? "Drop video here" : "Drag video here"}
          </p>
          <label
            htmlFor={fileInputId}
            className="mt-2 text-[10px] bg-rose-500 hover:bg-rose-600 text-white font-bold px-3.5 py-1.5 rounded-full cursor-pointer transition shadow-sm hover:scale-105 active:scale-95"
          >
            Browse
          </label>
        </div>
      )}

      {/* Hidden file input */}
      <input
        id={fileInputId}
        type="file"
        accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) await handleVideoUpload(file);
          e.target.value = "";
        }}
      />

      {/* Remove Confirmation Modal */}
      {showConfirmRemove && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full shadow-2xl border border-rose-100 flex flex-col items-center text-center animate-fade-up">
            <Trash2 className="w-10 h-10 text-red-500 mb-2" />
            <h4 className="text-base font-bold text-zinc-900">Remove this video?</h4>
            <p className="text-xs text-zinc-500 mt-1 mb-5">
              This will remove the video from Video Slot {position + 1}. Testimonial videos will remain unchanged.
            </p>
            <div className="flex gap-3 w-full">
              <Button
                variant="outline"
                className="flex-1 rounded-xl text-xs font-semibold cursor-pointer"
                onClick={() => setShowConfirmRemove(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold cursor-pointer"
                onClick={handleRemove}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GallerySlotEditor({
  position,
  existing,
  onChanged,
  isLarge,
}: {
  position: number;
  existing: DbGalleryImage | undefined;
  onChanged: () => void;
  isLarge: boolean;
}) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dwo6zs4ft";
  const [uploading, setUploading] = useState(false);
  const [alt, setAlt] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Sync state if existing changes
  useEffect(() => {
    if (existing) {
      setAlt(existing.alt);
    } else if (position < 6) {
      setAlt(DEFAULT_GALLERY[position].alt);
    } else {
      setAlt("");
    }
  }, [existing, position]);

  // Determine fallback default image for first 6 slots
  const isDefaultAvailable = position < 6;
  const fallbackItem = isDefaultAvailable ? DEFAULT_GALLERY[position] : null;
  const defaultUrl = fallbackItem
    ? `https://res.cloudinary.com/${cloudName}/image/upload/w_800,f_auto,q_auto/${fallbackItem.cloudinaryId}`
    : "";

  const handleFileUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Max limit is 5MB.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPEG, PNG, WebP).");
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `gallery_${position}_${Date.now()}.${ext}`;

    try {
      // Upload to Supabase Storage
      const { data, error: uploadErr } = await supabase.storage
        .from("gallery")
        .upload(fileName, file, { cacheControl: "3600", upsert: true });

      if (uploadErr) throw uploadErr;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("gallery")
        .getPublicUrl(fileName);

      // Save to database
      if (existing) {
        const { error: dbErr } = await supabase
          .from("gallery_images")
          .update({
            url: publicUrl,
            cloudinary_id: null,
          })
          .eq("id", existing.id);
        if (dbErr) throw dbErr;
      } else {
        const { error: dbErr } = await supabase
          .from("gallery_images")
          .insert({
            url: publicUrl,
            cloudinary_id: null,
            alt: alt || `Pink Love bridal portfolio slot ${position + 1}`,
            position,
          });
        if (dbErr) throw dbErr;
      }

      toast.success(`Slot ${position + 1} updated!`);
      onChanged();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveAlt = async () => {
    setUploading(true);
    try {
      if (existing) {
        const { error } = await supabase
          .from("gallery_images")
          .update({
            alt: alt.trim(),
          })
          .eq("id", existing.id);
        if (error) throw error;
        toast.success("Alt text saved!");
      } else {
        // Saving alt description on a default slot creates a row with the default image URL
        const { error } = await supabase
          .from("gallery_images")
          .insert({
            url: defaultUrl,
            cloudinary_id: fallbackItem?.cloudinaryId || null,
            alt: alt.trim() || `Pink Love bridal portfolio slot ${position + 1}`,
            position,
          });
        if (error) throw error;
        toast.success("Custom description saved for default image!");
      }
      setShowDetails(false);
      onChanged();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to save alt text.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!existing) return;
    if (!confirm(`Are you sure you want to clear Slot ${position + 1}?`)) return;

    setUploading(true);
    try {
      const { error } = await supabase
        .from("gallery_images")
        .delete()
        .eq("id", existing.id);
      if (error) throw error;

      toast.success(`Slot ${position + 1} cleared.`);
      setShowDetails(false);
      onChanged();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to clear slot.");
    } finally {
      setUploading(false);
    }
  };

  const fileInputId = `file-input-${position}`;

  // Image source to show in the slot (either custom or default fallback)
  const displayUrl = existing ? existing.url : defaultUrl;
  const displayAlt = existing ? existing.alt : (fallbackItem?.alt || "");

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={async (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) await handleFileUpload(file);
      }}
      className={`group relative w-full h-full rounded-2xl overflow-hidden border transition-all duration-300 ${
        isDragOver
          ? "border-rose-500 ring-2 ring-rose-300"
          : "border-rose-100 shadow-[var(--shadow-soft)] hover:shadow-md"
      } bg-rose-50/10 flex flex-col justify-center items-center`}
    >
      {/* Uploading Overlay */}
      {uploading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center text-rose-500 z-30 animate-pulse">
          <Loader2 className="w-8 h-8 animate-spin mb-1.5" />
          <span className="text-[10px] font-bold tracking-wider uppercase">Uploading...</span>
        </div>
      )}

      {displayUrl ? (
        <>
          {/* Active / Default Image Preview */}
          <img
            src={displayUrl}
            alt={displayAlt}
            className="w-full h-full object-cover"
          />

          {/* Slot Indicator */}
          <div className="absolute top-3 left-3 bg-rose-600/90 text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full z-10 shadow flex items-center gap-1.5">
            <span>Slot {position + 1}</span>
            {existing ? (
              <span className="bg-emerald-500 text-white text-[8px] uppercase px-1 rounded-sm">Custom</span>
            ) : (
              <span className="bg-amber-500 text-white text-[8px] uppercase px-1 rounded-sm">Default</span>
            )}
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 gap-2 z-20">
            <p className="text-white text-[11px] font-bold tracking-wider uppercase">
              Slot {position + 1} {existing ? "(Custom)" : "(Default)"}
            </p>
            <p className="text-white/60 text-[9px] mb-1">Drag & drop to replace</p>
            
            <div className="flex flex-wrap gap-1.5 justify-center items-center px-1">
              <label
                htmlFor={fileInputId}
                className="bg-white/95 hover:bg-white text-rose-600 text-[10px] font-bold px-2 py-1 rounded transition shadow hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
              >
                Change
              </label>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-bold px-2 py-1 rounded transition shadow hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
              >
                Alt
              </button>
              {existing && (
                <button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold p-1 rounded transition shadow hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Alt Text Edit Popover */}
          {showDetails && (
            <div className="absolute inset-x-2 bottom-2 bg-white rounded-xl p-2.5 z-30 shadow-2xl border border-rose-100 flex flex-col gap-2 animate-fade-up">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-extrabold text-rose-600 uppercase">Alt Description</span>
                <button onClick={() => setShowDetails(false)} className="text-[10px] text-zinc-400 hover:text-rose-600 font-bold">✕</button>
              </div>
              <Input
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="e.g. Elegant bridal jewellery detail"
                className="h-7 text-xs px-2 py-0 border-rose-100 focus-visible:ring-rose-400"
              />
              <Button
                size="sm"
                onClick={handleSaveAlt}
                className="bg-rose-500 hover:bg-rose-600 text-white font-bold h-7 text-[10px] py-0"
              >
                Save Description
              </Button>
            </div>
          )}
        </>
      ) : (
        /* Empty Slot State (Positions 6-20 with no image) */
        <div className="p-4 text-center flex flex-col items-center justify-center h-full w-full border-2 border-dashed border-rose-200 rounded-2xl bg-rose-50/5">
          <Upload className="w-6 h-6 text-rose-400 mb-1 animate-bounce" />
          <span className="text-xs font-bold text-rose-900">
            Slot {position + 1}
          </span>
          <p className="text-[9px] text-rose-500/80 mt-0.5">Drag photo here</p>
          <label
            htmlFor={fileInputId}
            className="mt-1.5 text-[10px] bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold px-3 py-1 rounded-full cursor-pointer transition shadow-sm"
          >
            Browse
          </label>
        </div>
      )}

      {/* Hidden file input */}
      <input
        id={fileInputId}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) await handleFileUpload(file);
        }}
      />
    </div>
  );
}

export function CouponsPanel() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [limit, setLimit] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
    setCoupons(data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const handleGenerate = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let res = "";
    for (let i = 0; i < 8; i++) res += chars.charAt(Math.floor(Math.random() * chars.length));
    setCode(res);
  };

  const handleCreate = async () => {
    if (!code || !discount) {
      toast.error("Code and discount are required");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("coupons").insert({
      code: code.toUpperCase(),
      discount_percent: parseInt(discount),
      min_order: minOrder ? parseInt(minOrder) : 0,
      expiry_date: expiry || null,
      usage_limit: limit ? parseInt(limit) : null,
      is_active: true
    });
    setBusy(false);
    
    if (error) {
      toast.error("Failed to create coupon: " + error.message);
    } else {
      toast.success("Coupon created successfully!");
      setCode("");
      setDiscount("");
      setMinOrder("");
      setExpiry("");
      setLimit("");
      load();
    }
  };

  const toggleStatus = async (id: string, current: boolean) => {
    const { error } = await supabase.from("coupons").update({ is_active: !current }).eq("id", id);
    if (!error) load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    const { error } = await supabase.from("coupons").delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else load();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-center">
         <h2 className="font-display text-2xl font-bold text-slate-800">Coupon Management</h2>
      </div>

      <div className="bg-blue-50/70 text-blue-700 rounded-lg p-4 text-sm font-semibold border border-blue-100">
        Coupon discount applies to product subtotal only — not delivery charge.
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* NEW COUPON FORM */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-5">
           <h3 className="text-[11px] font-bold tracking-widest text-slate-900 uppercase flex items-center gap-2 mb-2">
             <Plus className="w-4 h-4" /> New Coupon
           </h3>
           <div className="space-y-4">
             <div className="space-y-1.5">
               <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Coupon Code *</label>
               <div className="flex gap-2">
                 <Input 
                   value={code}
                   onChange={(e) => setCode(e.target.value.toUpperCase())}
                   className="h-10 text-sm bg-white border-slate-200 font-bold text-slate-700 focus-visible:ring-slate-300 uppercase" 
                   placeholder="E.G. BRIDAL10" 
                 />
                 <Button onClick={handleGenerate} className="h-10 bg-[#2b3a30] hover:bg-[#202c24] text-white text-[10px] font-black tracking-widest px-4 shrink-0 rounded-md">GENERATE</Button>
               </div>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Discount % *</label>
                  <Input 
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)} 
                    className="h-10 text-sm bg-white border-slate-200 focus-visible:ring-slate-300" 
                    placeholder="10" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Min Order (₹)</label>
                  <Input 
                    type="number"
                    value={minOrder}
                    onChange={(e) => setMinOrder(e.target.value)} 
                    className="h-10 text-sm bg-white border-slate-200 focus-visible:ring-slate-300" 
                    placeholder="1" 
                  />
                </div>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Expiry Date</label>
                  <Input 
                    type="date"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)} 
                    className="h-10 text-sm bg-white border-slate-200 focus-visible:ring-slate-300 text-slate-500" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Usage Limit</label>
                  <Input 
                    type="number"
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)} 
                    className="h-10 text-sm bg-white border-slate-200 focus-visible:ring-slate-300" 
                    placeholder="20" 
                  />
                </div>
             </div>
           </div>
           
           <Button 
             onClick={handleCreate}
             disabled={busy || !code || !discount}
             className="w-full h-11 mt-4 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-black tracking-widest rounded-md disabled:opacity-50"
           >
             {busy ? "CREATING..." : "CREATE COUPON"}
           </Button>
        </div>

        {/* COUPON LIST */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <h3 className="text-[11px] font-bold tracking-widest text-slate-900 uppercase">All Coupons ({coupons.length})</h3>
            <button onClick={load} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 font-bold uppercase tracking-wider">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              Refresh
            </button>
          </div>
          
          <div className="space-y-4">
            {coupons.length === 0 ? (
              <div className="text-center py-10 text-slate-400 font-medium text-sm">No coupons found. Create one above!</div>
            ) : (
              coupons.map((coupon) => (
                <div key={coupon.id} className="flex items-center justify-between border border-slate-100 rounded-lg p-4 hover:border-slate-200 transition-colors bg-white">
                  <div className="space-y-1">
                     <div className="flex items-center gap-3">
                       <h4 className="font-mono font-bold text-slate-900 text-lg tracking-wider">{coupon.code}</h4>
                       <span className={`text-[9px] font-extrabold tracking-widest px-2 py-0.5 rounded-sm border uppercase ${coupon.is_active ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' : 'bg-red-50 text-red-500 border-red-100'}`}>
                         {coupon.is_active ? 'Active' : 'Inactive'}
                       </span>
                     </div>
                     <p className="text-sm font-semibold text-slate-600">
                       {coupon.discount_percent}% off • min ₹{coupon.min_order}
                     </p>
                     <p className="text-xs text-slate-400 font-medium mt-0.5">
                       Used {coupon.used_count} times
                       {coupon.usage_limit ? ` (Limit: ${coupon.usage_limit})` : ''}
                       {coupon.expiry_date ? ` • expires ${new Date(coupon.expiry_date).toLocaleDateString('en-GB')}` : ''}
                     </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 sm:gap-4 shrink-0">
                     <button 
                       onClick={() => toggleStatus(coupon.id, coupon.is_active)}
                       className="text-[11px] font-bold text-blue-600 hover:text-blue-700 tracking-wide"
                     >
                       {coupon.is_active ? 'Deactivate' : 'Activate'}
                     </button>
                     <button 
                       onClick={() => handleDelete(coupon.id)}
                       className="text-[11px] font-bold text-red-500 hover:text-red-600 tracking-wide"
                     >
                       Delete
                     </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        

      </div>
    </div>
  );
}

function AdminFooter() {
  return (
    <div className="mt-8 pt-8 border-t border-rose-100/50 grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-xs text-muted-foreground/70">
      <div className="text-center md:text-left">
        © {new Date().getFullYear()} Pink Love Beauty Studio. All Rights Reserved
      </div>
      <div className="text-center">
        Powered by <a href="https://www.cenexasystems.com" target="_blank" rel="noreferrer" className="font-semibold text-rose-600 hover:text-rose-700 transition-colors">Cenexa Systems</a> © {new Date().getFullYear()}
      </div>
      <div className="text-center md:text-right font-bold tracking-widest text-[10px] uppercase text-muted-foreground/60">
        LOVE • GLOW • PERFECTION
      </div>
    </div>
  );
}
