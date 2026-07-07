import React, { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { 
  ShoppingBag, 
  X, 
  Minus, 
  Plus, 
  Trash2, 
  User,
  ArrowLeft
} from "lucide-react";
import logo from "@/assets/logo.png";

type CartItem = {
  id: string;
  name: string;
  price: string;
  quantity: number;
  type: "combo" | "individual";
};

const TIME_SLOTS = [
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
  "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM",
  "08:00 PM"
];

// Helper to determine if a price is variable/range
const isVariablePrice = (priceStr: string) => {
  const rawPrice = priceStr.toLowerCase().replace(/₹/g, "");
  const matches = rawPrice.match(/\d+(?:,\d{3})*(?:\.\d+)?k?/g);
  if (matches && matches.length > 0) {
    let nums = matches.map((m) => {
      let numStr = m.replace(/,/g, "");
      if (numStr.endsWith("k")) {
        return parseFloat(numStr.replace("k", "")) * 1000;
      }
      return parseFloat(numStr);
    });

    let max = Math.max(...nums);
    if (nums.some((n) => n < 100 && max > 1000)) {
      nums = nums.map((n) => (n < 100 ? n * 1000 : n));
    }

    let min = Math.min(...nums);
    max = Math.max(...nums);
    return min !== max;
  }
  return true; // if no numbers parsed, treat as variable/to be discussed
};

// Calculate total specifically for a subset of items
const calculateTotal = (items: CartItem[]) => {
  let minSum = 0;
  let maxSum = 0;
  let hasUnparseable = false;

  items.forEach((item) => {
    const rawPrice = item.price.toLowerCase().replace(/₹/g, "");
    const matches = rawPrice.match(/\d+(?:,\d{3})*(?:\.\d+)?k?/g);

    if (matches && matches.length > 0) {
      let nums = matches.map((m) => {
        let numStr = m.replace(/,/g, "");
        if (numStr.endsWith("k")) {
          return parseFloat(numStr.replace("k", "")) * 1000;
        }
        return parseFloat(numStr);
      });

      let max = Math.max(...nums);
      if (nums.some((n) => n < 100 && max > 1000)) {
        nums = nums.map((n) => (n < 100 ? n * 1000 : n));
      }

      let min = Math.min(...nums);
      max = Math.max(...nums);

      minSum += min * item.quantity;
      maxSum += max * item.quantity;
    } else {
      hasUnparseable = true;
    }
  });

  if (minSum === 0 && hasUnparseable) {
    return "To be discussed";
  }
  
  if (minSum === maxSum && !hasUnparseable) {
    return `₹${minSum}`;
  }
  
  return `₹${minSum} - ₹${maxSum}${hasUnparseable ? " +" : ""}`;
};

export function CartPage() {
  const todayStr = (() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  })();

  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pl_booking_cart");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  const [customerName, setCustomerName] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("pl_customer_name") || "";
    }
    return "";
  });
  const [bookingDate, setBookingDate] = useState(todayStr);
  const [bookingTime, setBookingTime] = useState("10:00 AM");

  useEffect(() => {
    localStorage.setItem("pl_booking_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("pl_cart_change"));
  }, [cart]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pl_customer_name", customerName);
    }
  }, [customerName]);

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

  const fixedItems = cart.filter(item => !isVariablePrice(item.price));
  const variableItems = cart.filter(item => isVariablePrice(item.price));

  const handleWhatsAppCheckout = () => {
    if (!customerName.trim()) {
      toast.error("Please enter your name to proceed.");
      return;
    }

    const blossom = String.fromCodePoint(0x1F338);
    const person = String.fromCodePoint(0x1F464);
    const calendar = String.fromCodePoint(0x1F4C5);
    const clock = String.fromCodePoint(0x23F0);
    const nail = String.fromCodePoint(0x1F485);
    const dollar = String.fromCodePoint(0x1F4B5);
    const bullet = String.fromCodePoint(0x2022);

    const itemsText = cart
      .map((item) => `${bullet} ${item.name} (Qty: ${item.quantity}) — ${item.price}`)
      .join("\n");

    const overallTotal = calculateTotal(cart);

    let message = `Hi Pink Love Beauty Studio! ${blossom}\n\nI would like to book an appointment.\n\n`;
    message += `${person} Customer Name: ${customerName.trim()}\n`;
    message += `${calendar} Date: ${bookingDate}\n`;
    message += `${clock} Preferred Slot: ${bookingTime}\n\n`;
    message += `${nail} Selected Services:\n${itemsText}\n\n`;
    message += `${dollar} Estimated Total: ${overallTotal}\n\n`;
    message += `Please confirm availability for booking. Thank you!`;

    const waUrl = `https://api.whatsapp.com/send/?phone=919840874966&text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  const renderCartItem = (item: CartItem) => (
    <div key={item.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 rounded-2xl border border-rose-100 bg-white shadow-sm hover:shadow-md transition-all gap-4 group relative">
      <div className="flex-1">
        <h4 className="font-display font-bold uppercase text-zinc-900 tracking-wide">{item.name}</h4>
        <div className="text-rose-600 font-bold mt-1 text-sm bg-rose-50 inline-block px-2 py-0.5 rounded-md border border-rose-100">
          {item.price}
        </div>
      </div>
      
      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
        <div className="flex items-center border border-rose-200 rounded-xl overflow-hidden bg-white shadow-sm h-10">
          <button 
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="px-3 hover:bg-rose-50 text-rose-600 transition-colors h-full flex items-center justify-center cursor-pointer border-r border-rose-100"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-4 font-bold text-foreground min-w-[3rem] text-center">{item.quantity}</span>
          <button 
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="px-3 hover:bg-rose-50 text-rose-600 transition-colors h-full flex items-center justify-center cursor-pointer border-l border-rose-100"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <button 
          onClick={() => removeFromCart(item.id)}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-rose-50 text-rose-400 hover:text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
        >
          <Trash2 className="w-4.5 h-4.5" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFBFB] pb-24 font-sans text-zinc-900">
      {/* Header */}
      <div className="bg-white border-b border-rose-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                window.location.href = "/";
              }}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-rose-50 text-zinc-600 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <img src={logo} alt="Pink Love Beauty Studio Logo" className="w-10 h-10 rounded-full border border-rose-200" />
              <div>
                <h1 className="font-display text-xl font-bold text-zinc-900 tracking-wide uppercase">Booking Cart</h1>
                <p className="text-xs text-rose-500 font-semibold uppercase tracking-widest">
                  {cart.reduce((sum, i) => sum + i.quantity, 0)} services
                </p>
              </div>
            </div>
          </div>
          <ShoppingBag className="w-6 h-6 text-rose-300" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-20">
        {cart.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-3xl border border-rose-100 shadow-sm max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-rose-300" />
            </div>
            <h2 className="font-display text-3xl font-bold text-zinc-900 mb-2">Your Cart is Empty</h2>
            <p className="text-zinc-500 mb-8 max-w-sm mx-auto">Browse our services and packages to start building your perfect makeover appointment.</p>
            <button
              onClick={() => window.location.href = "/"}
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[color:var(--rose)] text-white font-bold hover:bg-rose-600 transition-colors shadow-lg shadow-rose-200"
            >
              Back to Services
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
            
            {/* Cart Items Section */}
            <div className="space-y-8">
              
              {/* Fixed Price Items */}
              {fixedItems.length > 0 && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm">
                  <div className="flex justify-between items-end mb-6 pb-4 border-b border-rose-100/60">
                    <div>
                      <h3 className="font-display text-2xl font-bold text-zinc-800 uppercase tracking-wide">Fixed Price Services</h3>
                      <p className="text-sm text-zinc-500 mt-1">Standard services with direct pricing.</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {fixedItems.map(renderCartItem)}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <div className="bg-rose-50/50 px-6 py-3 rounded-2xl border border-rose-100 flex items-center gap-4">
                      <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Subtotal:</span>
                      <span className="font-display text-2xl font-bold text-rose-700">{calculateTotal(fixedItems)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Variable Price Items */}
              {variableItems.length > 0 && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl border-l border-b border-amber-200">
                    Consultation Required
                  </div>
                  <div className="flex justify-between items-end mb-6 pb-4 border-b border-rose-100/60">
                    <div className="pr-10">
                      <h3 className="font-display text-2xl font-bold text-zinc-800 uppercase tracking-wide">Variable Packages</h3>
                      <p className="text-sm text-zinc-500 mt-1">Premium services priced based on consultation & customization.</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {variableItems.map(renderCartItem)}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <div className="bg-amber-50/50 px-6 py-3 rounded-2xl border border-amber-100 flex items-center gap-4">
                      <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Est Range:</span>
                      <span className="font-display text-2xl font-bold text-amber-600">{calculateTotal(variableItems)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Checkout Sidebar */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-200 shadow-xl shadow-rose-100/50 sticky top-28">
              <h3 className="font-display text-2xl font-bold text-zinc-900 mb-6 pb-4 border-b border-zinc-100 uppercase tracking-wide">
                Booking Summary
              </h3>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 font-semibold">Fixed Services</span>
                  <span className="font-bold">{calculateTotal(fixedItems)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 font-semibold">Variable Range</span>
                  <span className="font-bold text-amber-600">{calculateTotal(variableItems)}</span>
                </div>
                <div className="pt-4 border-t border-zinc-100 flex justify-between items-center">
                  <span className="text-zinc-900 font-bold uppercase tracking-wide">Grand Total</span>
                  <span className="font-display text-2xl font-bold text-rose-600">{calculateTotal(cart)}</span>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-rose-500" /> Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 font-semibold text-sm transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                      📅 Date
                    </label>
                    <input
                      type="date"
                      min={todayStr}
                      value={bookingDate}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val && val < todayStr) {
                          setBookingDate(todayStr);
                          toast.warning("Past dates cannot be selected.");
                        } else {
                          setBookingDate(val);
                        }
                      }}
                      className="w-full h-12 px-3 rounded-xl border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 font-semibold text-sm transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                      ⏰ Time
                    </label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full h-12 px-3 rounded-xl border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 font-semibold text-sm transition-all"
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full h-14 mt-4 bg-[color:var(--rose)] hover:bg-rose-600 text-white font-bold text-sm tracking-wide uppercase rounded-xl shadow-lg shadow-rose-200 transition-all active:scale-[0.98]"
                >
                  Confirm on WhatsApp
                </button>
                <p className="text-[10px] text-center text-zinc-400 uppercase tracking-wider mt-3 font-semibold">
                  No payment required right now
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
