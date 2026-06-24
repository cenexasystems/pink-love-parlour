import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
  FolderOpen
} from "lucide-react";

const PASSCODE = "0265";
const STORAGE_KEY = "pl_admin_ok";

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100/50 via-background to-amber-50/30 p-6">
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
          <TabsList className="flex items-center justify-between w-full max-w-md mx-auto bg-rose-50/60 p-1 rounded-full border border-rose-100 shadow-sm h-12">
            <TabsTrigger 
              value="combos" 
              className="flex-1 flex items-center justify-center rounded-full h-10 font-bold text-sm tracking-wide transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-rose-600 data-[state=active]:shadow-md text-rose-800/70 hover:text-rose-900 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 mr-2" /> Value Combos
            </TabsTrigger>
            <TabsTrigger 
              value="alacarte" 
              className="flex-1 flex items-center justify-center rounded-full h-10 font-bold text-sm tracking-wide transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-rose-600 data-[state=active]:shadow-md text-rose-800/70 hover:text-rose-900 cursor-pointer"
            >
              <Scissors className="w-4 h-4 mr-2" /> Individual Services
            </TabsTrigger>
          </TabsList>

          <TabsContent value="combos" className="space-y-6">
            <CombosPanel />
          </TabsContent>

          <TabsContent value="alacarte" className="space-y-6">
            <IndividualsPanel />
          </TabsContent>
        </Tabs>
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

      <div className="flex items-center gap-3 pt-2.5 border-t border-rose-50">
        <div className="w-24 shrink-0">
          <select
            className="w-full h-8.5 rounded-lg border border-rose-100 bg-white px-1.5 focus:outline-none focus:ring-1 focus:ring-rose-400 text-xs font-semibold"
            value={page}
            onChange={(e) => setPage(Number(e.target.value))}
          >
            <option value={1}>Page 1</option>
            <option value={2}>Page 2</option>
          </select>
        </div>

        <div className="flex-1">
          <Input 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            className="h-8.5 border-rose-100 focus-visible:ring-rose-400 text-xs font-bold text-rose-700"
            placeholder="Price"
          />
        </div>

        <div className="flex gap-1.5 shrink-0">
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
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-8.5 text-xs px-2.5 gap-1"
          >
            <Save className="w-3.5 h-3.5" /> Save
          </Button>
          <Button 
            size="sm" 
            variant="destructive" 
            onClick={() => onDelete(item.id)}
            className="font-bold h-8.5 text-xs px-2 flex items-center justify-center"
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

      <div className="flex items-center gap-2 pt-2 border-t border-rose-50/50">
        <div className="w-24 shrink-0">
          <select
            className="w-full h-8.5 rounded-lg border border-rose-100 bg-white px-1.5 focus:outline-none focus:ring-1 focus:ring-rose-400 text-xs font-semibold"
            value={side}
            onChange={(e) => setSide(e.target.value)}
          >
            <option value="left">Left Column</option>
            <option value="right">Right Column</option>
          </select>
        </div>

        <div className="flex-1">
          <Input 
            className="h-8.5 border-rose-100 focus-visible:ring-rose-400 text-xs font-bold text-rose-700" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            placeholder="Price"
          />
        </div>

        <div className="flex gap-1.5 shrink-0">
          <Button
            size="sm"
            disabled={!dirty}
            onClick={() => onUpdate(item, { side, category, name, price })}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-8.5 px-2.5 text-xs gap-1"
          >
            <Save className="w-3 h-3" /> Save
          </Button>
          <Button 
            size="sm" 
            variant="destructive" 
            onClick={() => onDelete(item.id)}
            className="font-bold h-8.5 px-2 text-xs flex justify-center items-center"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
