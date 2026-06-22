import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const PASSCODE = "0265";
const STORAGE_KEY = "pl_admin_ok";

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

export function Admin() {
  const [authed, setAuthed] = useState<boolean>(() =>
    typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY) === "1",
  );
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[color:var(--blush)]/30 to-background p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (code === PASSCODE) {
              sessionStorage.setItem(STORAGE_KEY, "1");
              setAuthed(true);
            } else setErr("Incorrect passcode");
          }}
          className="w-full max-w-sm bg-card rounded-2xl border border-[color:var(--rose)]/20 shadow-xl p-8 space-y-4"
        >
          <h1 className="font-display text-3xl text-[color:var(--rose)]">Admin Access</h1>
          <p className="text-sm text-foreground/70">Enter the passcode to manage menu items.</p>
          <Input
            type="password"
            inputMode="numeric"
            placeholder="Passcode"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setErr("");
            }}
            autoFocus
          />
          {err && <p className="text-sm text-destructive">{err}</p>}
          <Button type="submit" className="w-full">Unlock</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl text-[color:var(--rose)]">Menu Admin</h1>
            <p className="text-sm text-foreground/70">Manage combos and individual services. Changes save instantly.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => (window.location.href = "/")}>View site</Button>
            <Button
              variant="ghost"
              onClick={() => {
                sessionStorage.removeItem(STORAGE_KEY);
                setAuthed(false);
              }}
            >
              Lock
            </Button>
          </div>
        </header>

        <CombosPanel />
        <IndividualsPanel />
      </div>
    </div>
  );
}

function CombosPanel() {
  const [items, setItems] = useState<ComboItem[]>([]);
  const [page, setPage] = useState(1);
  const [servicesText, setServicesText] = useState("");
  const [price, setPrice] = useState("");
  const [sortOrder, setSortOrder] = useState(100);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("combo_items")
      .select("*")
      .order("page")
      .order("sort_order");
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
    if (!services.length || !price) return;
    setBusy(true);
    await supabase.from("combo_items").insert({ page, services, price, sort_order: sortOrder });
    setServicesText("");
    setPrice("");
    setBusy(false);
    load();
  };

  const update = async (it: ComboItem, patch: Partial<ComboItem>) => {
    await supabase.from("combo_items").update(patch).eq("id", it.id);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this combo?")) return;
    await supabase.from("combo_items").delete().eq("id", id);
    load();
  };

  return (
    <section className="space-y-4">
      <h2 className="font-display text-2xl text-[color:var(--rose)]">Combo Packages</h2>

      <div className="rounded-2xl border border-[color:var(--rose)]/20 bg-card p-5 grid sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2 font-semibold">Add new combo</div>
        <label className="text-sm space-y-1">
          Page
          <select
            className="w-full h-9 rounded-md border border-input bg-transparent px-3"
            value={page}
            onChange={(e) => setPage(Number(e.target.value))}
          >
            <option value={1}>Page 1</option>
            <option value={2}>Page 2</option>
          </select>
        </label>
        <label className="text-sm space-y-1">
          Price
          <Input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="₹1500" />
        </label>
        <label className="text-sm space-y-1 sm:col-span-2">
          Services (one per line or comma-separated)
          <Textarea rows={3} value={servicesText} onChange={(e) => setServicesText(e.target.value)} placeholder="GOLD FACIAL\nD-TAN\nPEDICURE" />
        </label>
        <label className="text-sm space-y-1">
          Sort order
          <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} />
        </label>
        <div className="flex items-end">
          <Button onClick={add} disabled={busy} className="w-full">Add combo</Button>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((it) => (
          <ComboRow key={it.id} item={it} onUpdate={update} onDelete={remove} />
        ))}
      </div>
    </section>
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
  const [sort, setSort] = useState(item.sort_order);
  const dirty =
    services !== item.services.join("\n") || price !== item.price || page !== item.page || sort !== item.sort_order;

  return (
    <div className="rounded-xl border border-[color:var(--rose)]/15 bg-card p-4 grid sm:grid-cols-12 gap-3">
      <div className="sm:col-span-1">
        <label className="text-xs text-foreground/60">Page</label>
        <select
          className="w-full h-9 rounded-md border border-input bg-transparent px-2"
          value={page}
          onChange={(e) => setPage(Number(e.target.value))}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
        </select>
      </div>
      <div className="sm:col-span-5">
        <label className="text-xs text-foreground/60">Services</label>
        <Textarea rows={3} value={services} onChange={(e) => setServices(e.target.value)} />
      </div>
      <div className="sm:col-span-2">
        <label className="text-xs text-foreground/60">Price</label>
        <Input value={price} onChange={(e) => setPrice(e.target.value)} />
      </div>
      <div className="sm:col-span-2">
        <label className="text-xs text-foreground/60">Sort</label>
        <Input type="number" value={sort} onChange={(e) => setSort(Number(e.target.value))} />
      </div>
      <div className="sm:col-span-2 flex flex-col gap-2 justify-end">
        <Button
          size="sm"
          disabled={!dirty}
          onClick={() =>
            onUpdate(item, {
              services: services.split(/\n|,/).map((s) => s.trim()).filter(Boolean),
              price,
              page,
              sort_order: sort,
            })
          }
        >
          Save
        </Button>
        <Button size="sm" variant="destructive" onClick={() => onDelete(item.id)}>Delete</Button>
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
  const [sortOrder, setSortOrder] = useState(100);

  const load = async () => {
    const { data } = await supabase
      .from("individual_services")
      .select("*")
      .order("side")
      .order("category")
      .order("sort_order");
    setItems((data || []) as IndividualRow[]);
  };
  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    if (!category || !name || !price) return;
    await supabase
      .from("individual_services")
      .insert({ side, category, name, price, sort_order: sortOrder });
    setName("");
    setPrice("");
    load();
  };

  const update = async (it: IndividualRow, patch: Partial<IndividualRow>) => {
    await supabase.from("individual_services").update(patch).eq("id", it.id);
    load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    await supabase.from("individual_services").delete().eq("id", id);
    load();
  };

  const categories = Array.from(new Set(items.map((i) => i.category))).sort();

  return (
    <section className="space-y-4">
      <h2 className="font-display text-2xl text-[color:var(--rose)]">Individual Services</h2>

      <div className="rounded-2xl border border-[color:var(--rose)]/20 bg-card p-5 grid sm:grid-cols-6 gap-3">
        <div className="sm:col-span-6 font-semibold">Add new service</div>
        <label className="text-sm space-y-1">
          Side
          <select
            className="w-full h-9 rounded-md border border-input bg-transparent px-3"
            value={side}
            onChange={(e) => setSide(e.target.value)}
          >
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </label>
        <label className="text-sm space-y-1 sm:col-span-2">
          Category
          <Input list="cat-list" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Threading" />
          <datalist id="cat-list">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </label>
        <label className="text-sm space-y-1">
          Name
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Eye brow" />
        </label>
        <label className="text-sm space-y-1">
          Price
          <Input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="50" />
        </label>
        <label className="text-sm space-y-1">
          Sort
          <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} />
        </label>
        <div className="sm:col-span-6">
          <Button onClick={add}>Add service</Button>
        </div>
      </div>

      <div className="space-y-2">
        {items.map((it) => (
          <IndividualRowEditor key={it.id} item={it} onUpdate={update} onDelete={remove} />
        ))}
      </div>
    </section>
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
  const [sort, setSort] = useState(item.sort_order);
  const dirty =
    side !== item.side || category !== item.category || name !== item.name || price !== item.price || sort !== item.sort_order;

  return (
    <div className="rounded-xl border border-[color:var(--rose)]/10 bg-card p-3 grid sm:grid-cols-12 gap-2 items-end">
      <select
        className="sm:col-span-1 h-9 rounded-md border border-input bg-transparent px-2"
        value={side}
        onChange={(e) => setSide(e.target.value)}
      >
        <option value="left">L</option>
        <option value="right">R</option>
      </select>
      <Input className="sm:col-span-3" value={category} onChange={(e) => setCategory(e.target.value)} />
      <Input className="sm:col-span-3" value={name} onChange={(e) => setName(e.target.value)} />
      <Input className="sm:col-span-2" value={price} onChange={(e) => setPrice(e.target.value)} />
      <Input className="sm:col-span-1" type="number" value={sort} onChange={(e) => setSort(Number(e.target.value))} />
      <div className="sm:col-span-2 flex gap-2">
        <Button
          size="sm"
          disabled={!dirty}
          onClick={() => onUpdate(item, { side, category, name, price, sort_order: sort })}
        >
          Save
        </Button>
        <Button size="sm" variant="destructive" onClick={() => onDelete(item.id)}>×</Button>
      </div>
    </div>
  );
}
