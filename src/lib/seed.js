const fs = require('fs');
const path = require('path');

// Read env variables from .env file
const envPath = path.join(__dirname, '../../.env');
if (!fs.existsSync(envPath)) {
  console.error("❌ .env file not found. Please create it first and add your Supabase credentials.");
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const getEnvVar = (name) => {
  const match = envContent.match(new RegExp(`^${name}=(.*)$`, 'm'));
  return match ? match[1].trim() : null;
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseKey = getEnvVar('VITE_SUPABASE_PUBLISHABLE_KEY');

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY is missing in your .env file.");
  process.exit(1);
}

console.log(`Connecting to Supabase at: ${supabaseUrl}`);

// Hardcoded Menu Data (Extracted from MenuBook.tsx)
const LEFT_PAGE_ITEMS = [
  { services: ["GOLD FACIAL", "D-TAN (FACE + NECK)", "PEDICURE"], price: "₹1500" },
  { services: ["WINEFACIAL", "OILMASSAGE", "WAXING", "BASICHAIRCUT"], price: "₹1750" },
  { services: ["D-TANOR WAXING", "HAIR SPA", "CLEANUP", "PEDICURE"], price: "₹1850" },
  { services: ["CLEANUP", "D-TAN", "BASICHAIRCUT", "EYEBROW THREADING"], price: "₹550" },
  { services: ["BASICFACIAL", "D-TAN", "EYEBROW THREADING"], price: "₹700" },
  { services: ["HYDRAFACIAL", "D-TAN", "EYEBROW THREADING"], price: "₹1999" },
  { services: ["D-TAN", "WAXING"], price: "₹450" }
];

const RIGHT_PAGE_ITEMS = [
  { services: ["D-TAN", "EYEBROW THREADING", "UPPERLIIP THREADING", "GUNSHOT"], price: "₹500" },
  { services: ["D-TAN", "RICA WAXING"], price: "₹750" },
  { services: ["GUNSHOT"], price: "₹250" },
  { services: ["CLEANUP", "D-TAN", "BASICHAIRCUT", "EYEBROW THREADING"], price: "₹550" },
  { services: ["HAIRCOLOUR", "CLEANUP", "EYEBROW THREADING", "BASICHAIRCUT"], price: "₹600" },
  { services: ["BASICFACIAL", "D-TAN", "EYEBROW THREADING"], price: "₹700" },
  { services: ["FACIAL", "WHITENING", "BRIGHTENING", "GLOWING"], price: "₹1500 each" },
  { services: ["HAIRCUT", "LAYERCUT", "STEPCUT"], price: "₹500 each" },
  { services: ["HAIRWASH", "BUTTERFLY HAIRCUT"], price: "₹800" }
];

const LEFT_INDIVIDUAL_CATEGORIES = [
  {
    categoryName: "Threading",
    items: [
      { name: "Eye brow", price: "50" },
      { name: "Upper lip", price: "20" },
      { name: "Four head", price: "20" },
      { name: "Chin", price: "20" }
    ]
  },
  {
    categoryName: "Treatment",
    items: [
      { name: "Smoothning", price: "3000 to 10000" },
      { name: "Anti dandruff", price: "1500 to 2500" },
      { name: "Lise treatment", price: "2000 to 3500" },
      { name: "Hair colouring", price: "500 to 3000" },
      { name: "Keratin", price: "5000 to 15000" },
      { name: "Botex", price: "5000 to 15000" }
    ]
  },
  {
    categoryName: "Prepleating Saree",
    items: [
      { name: "Basic Saree Prepleating", price: "399" },
      { name: "Advance Saree Prepleating", price: "700" },
      { name: "Floppy Saree Prepleating", price: "1000" }
    ]
  }
];

const RIGHT_INDIVIDUAL_CATEGORIES = [
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
      { name: "Boy Cut Baby", price: "100" }
    ]
  },
  {
    categoryName: "Bridal Package",
    items: [
      { name: "Kryolan", price: "7000" },
      { name: "Mac", price: "12000" },
      { name: "Hd", price: "15000" },
      { name: "Sweat Proof", price: "20000" },
      { name: "Water Proof", price: "20000" },
      { name: "Airbrush Makeup", price: "25000" }
    ]
  },
  {
    categoryName: "Party Makeup",
    items: [
      { name: "Lite Makeup", price: "1500 - 2500" },
      { name: "Engagement", price: "7k, 8k, 10, 12k, 15k" },
      { name: "Puberty Makeup", price: "6k, 8k, 10k, 12k, 15k" },
      { name: "Baby Shower Makeup", price: "6k, 8k, 10k, 12k, 15k" }
    ]
  }
];

async function seed() {
  try {
    // 1. Prepare combos data
    const comboPayload = [];
    LEFT_PAGE_ITEMS.forEach((item, index) => {
      comboPayload.push({
        page: 1,
        services: item.services,
        price: item.price,
        sort_order: index
      });
    });
    RIGHT_PAGE_ITEMS.forEach((item, index) => {
      comboPayload.push({
        page: 2,
        services: item.services,
        price: item.price,
        sort_order: index
      });
    });

    console.log("Uploading Combo Items...");
    const comboRes = await fetch(`${supabaseUrl}/rest/v1/combo_items`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(comboPayload)
    });

    if (!comboRes.ok) {
      throw new Error(`Failed to insert combos: ${await comboRes.text()}`);
    }
    console.log("✅ Combos uploaded successfully!");

    // 2. Prepare individual services data
    const individualPayload = [];
    
    let sortOrder = 0;
    LEFT_INDIVIDUAL_CATEGORIES.forEach((cat) => {
      cat.items.forEach((item) => {
        individualPayload.push({
          side: 'left',
          category: cat.categoryName,
          name: item.name,
          price: item.price,
          sort_order: sortOrder++
        });
      });
    });

    RIGHT_INDIVIDUAL_CATEGORIES.forEach((cat) => {
      cat.items.forEach((item) => {
        individualPayload.push({
          side: 'right',
          category: cat.categoryName,
          name: item.name,
          price: item.price,
          sort_order: sortOrder++
        });
      });
    });

    console.log("Uploading Individual Services...");
    const indivRes = await fetch(`${supabaseUrl}/rest/v1/individual_services`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(individualPayload)
    });

    if (!indivRes.ok) {
      throw new Error(`Failed to insert individual services: ${await indivRes.text()}`);
    }
    console.log("✅ Individual services uploaded successfully!");

    console.log("\n🎉 ALL DATA TRANSFERRED SUCCESSFULLY TO SUPABASE!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  }
}

seed();
