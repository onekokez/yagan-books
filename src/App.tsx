import { useState, useEffect } from "react";

// ================================================================
// ⚙️  CONFIGURATION — Edit these values
// ================================================================
const ADMIN_PASSWORD = "YaganBooks@2025";   // Secret admin password

// 📞 CONTACT INFO — Change to your real contacts
const CONTACTS = {
  telegramAdmin:  "https://t.me/your_telegram_username",   // e.g. https://t.me/yaganbooks_admin
  viberAdmin:     "viber://chat?number=%2B959XXXXXXXX",    // e.g. viber://chat?number=%2B959123456789
  telegramChannel:"https://t.me/your_channel_name",        // e.g. https://t.me/yaganbooks
  facebookPage:   "https://facebook.com/your_page",
  premiumPrice:   "5,000 ကျပ် / လ",
};

// 🔥 FIREBASE CONFIG — Paste your Firebase config here after setup
// Instructions: console.firebase.google.com → Project Settings → Your apps → Web
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAzHqE5sBxVB3KOFxJpM52ffybMAyHKBeo",
  authDomain: "yagan-books.firebaseapp.com",
  projectId: "yagan-books",
  storageBucket: "yagan-books.firebasestorage.app",
  messagingSenderId: "222566942909",
  appId: "1:222566942909:web:1a39de12566d444ce58fd4",
  measurementId: "G-GHPTQHZEXQ"
};
const FIREBASE_READY = FIREBASE_CONFIG.apiKey !== "YOUR_API_KEY";

// Admin emails — users with these emails get admin role automatically
const ADMIN_EMAILS = ["aprilfool147host@gmail.com"]; // 👈 Add your Gmail here

// ================================================================

interface Book {
  id: number; title: string; author: string; category: string; type: string;
  cover: string; price: number; rating: number; reads: number; description: string;
  pages?: number; duration?: string; lang: string; tag: string; fileId?: string;
}
type UserRole = "free" | "premium" | "admin";
interface AppUser { name: string; email: string; avatar: string; role: UserRole; provider: string; }
interface Toast { msg: string; type: string; }

const INITIAL_BOOKS: Book[] = [
  { id:1, title:"အောင်မြင်သူများ၏ အလေ့အကျင့်", author:"Stephen Covey", category:"free", type:"ebook", cover:"📗", price:0, rating:4.8, reads:12400, description:"အောင်မြင်သူများ၏ အဓိကအလေ့အကျင့် ၇ ခုကို လေ့လာပါ။ ဘဝတွင် အောင်မြင်ရန် လမ်းညွှန်ချက်တစ်ခု။", pages:320, lang:"မြန်မာဘာသာ", tag:"Bestseller", fileId:"" },
  { id:2, title:"ငွေကြေးဉာဏ်ပညာ", author:"Robert Kiyosaki", category:"premium", type:"ebook", cover:"📘", price:3500, rating:4.9, reads:9800, description:"ချမ်းသာကြွယ်ဝမှုဆီသို့ ဦးတည်သော ငွေကြေးစီမံခန့်ခွဲမှု လမ်းညွှန်ချက်။", pages:280, lang:"မြန်မာဘာသာ", tag:"Popular", fileId:"" },
  { id:3, title:"စိတ်ဓာတ်ခွန်အား", author:"Norman Peale", category:"free", type:"ebook", cover:"📙", price:0, rating:4.7, reads:15600, description:"အပြုသဘောဆောင်သောစိတ်ဓာတ်ဖြင့် ဘဝကို ပြောင်းလဲပါ။", pages:240, lang:"မြန်မာဘာသာ", tag:"Free", fileId:"" },
  { id:4, title:"အိပ်မက်ကို လိုက်နာပါ", author:"Paulo Coelho", category:"premium", type:"ebook", cover:"📕", price:2500, rating:4.6, reads:7200, description:"ကိုယ်ပိုင်ဒဏ္ဍာရီကို ရှာဖွေခြင်းနှင့် ဘဝ၏ စစ်မှန်သောအဓိပ္ပါယ်ကို ရှာဖွေပါ။", pages:180, lang:"မြန်မာဘာသာ", tag:"New", fileId:"" },
  { id:5, title:"အောင်မြင်သောခေါင်းဆောင်ပုံစံ", author:"John Maxwell", category:"free", type:"audiobook", cover:"🎧", price:0, rating:4.9, reads:6800, description:"ခေါင်းဆောင်မှုစွမ်းရည်ကို မြှင့်တင်ရန် audio သင်ခန်းစာများ။", duration:"8 နာရီ 30 မိနစ်", lang:"မြန်မာဘာသာ", tag:"Audio", fileId:"" },
  { id:6, title:"Atomic Habits မြန်မာဘာသာ", author:"James Clear", category:"premium", type:"audiobook", cover:"🎙️", price:4500, rating:5.0, reads:11200, description:"ထူးခြားသောအလေ့အကျင့်များ တည်ဆောက်ရန် လမ်းညွှန်ချက်အပြည့်အစုံ။", duration:"11 နာရီ 15 မိနစ်", lang:"မြန်မာဘာသာ", tag:"Premium", fileId:"" },
  { id:7, title:"ဆန်းသစ်တီထွင်ခြင်း", author:"Walter Isaacson", category:"premium", type:"ebook", cover:"💡", price:3000, rating:4.7, reads:5400, description:"Steve Jobs ၏ ဆန်းသစ်တီထွင်သောနည်းလမ်းများ၊ ယနေ့ကမ္ဘာကို ပြောင်းလဲပုံ။", pages:350, lang:"မြန်မာဘာသာ", tag:"Trending", fileId:"" },
  { id:8, title:"ဘဝတွင် ရပ်တည်ပါ", author:"Brené Brown", category:"free", type:"audiobook", cover:"🌟", price:0, rating:4.8, reads:8900, description:"ကြောက်ရွံ့မှုကို ကျော်ဖြတ်ကာ ရဲရင့်သောဘဝကို ရှင်သန်ပါ။", duration:"6 နာရီ 45 မိနစ်", lang:"မြန်မာဘာသာ", tag:"Free Audio", fileId:"" },
];

// Role access helper
const canAccess = (book: Book, user: AppUser | null): boolean => {
  if (!user) return book.price === 0 && book.category === "free";
  if (user.role === "admin" || user.role === "premium") return true;
  return book.category === "free"; // free users get free content only
};

export default function App() {
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [view, setView] = useState("home");
  const [filter, setFilter] = useState("all");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [adminForm, setAdminForm] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<Toast | null>(null);
  const [heroAnim, setHeroAnim] = useState(false);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [passError, setPassError] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [logoTimer, setLogoTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [particles] = useState(() => Array.from({length:18},(_,i)=>({id:i,left:`${Math.random()*100}%`,top:`${Math.random()*100}%`,size:`${Math.random()*8+4}px`,delay:`${Math.random()*6}s`,dur:`${Math.random()*8+6}s`,op:Math.random()*0.4+0.1})));

  useEffect(() => {
    setTimeout(() => setHeroAnim(true), 100);
    const saved = localStorage.getItem("yagan_user");
    if (saved) { try { setCurrentUser(JSON.parse(saved)); } catch {} }
  }, []);

  const showToast = (msg: string) => { setToast({msg,type:"ok"}); setTimeout(()=>setToast(null),3500); };

  const handleLogoClick = () => {
    const n = logoClicks + 1; setLogoClicks(n);
    if (logoTimer) clearTimeout(logoTimer);
    if (n >= 5) { setLogoClicks(0); setShowAdminLogin(true); }
    else { const t = setTimeout(()=>setLogoClicks(0),2000); setLogoTimer(t); }
  };

  // ── SOCIAL LOGIN (Demo mode when Firebase not configured) ──────────────
  const socialLogin = async (provider: "google"|"facebook"|"apple") => {
    if (FIREBASE_READY) {
      // Real Firebase login — uncomment after setting up Firebase
      // const { initializeApp } = await import("firebase/app");
      // const { getAuth, GoogleAuthProvider, FacebookAuthProvider, OAuthProvider, signInWithPopup } = await import("firebase/auth");
      // const app = initializeApp(FIREBASE_CONFIG);
      // const auth = getAuth(app);
      // let prov;
      // if (provider === "google") prov = new GoogleAuthProvider();
      // else if (provider === "facebook") prov = new FacebookAuthProvider();
      // else prov = new OAuthProvider("apple.com");
      // const result = await signInWithPopup(auth, prov);
      // const fbUser = result.user;
      // const role: UserRole = ADMIN_EMAILS.includes(fbUser.email||"") ? "admin" : "free";
      // const u: AppUser = { name: fbUser.displayName||"User", email: fbUser.email||"", avatar: (fbUser.displayName||"U")[0].toUpperCase(), role, provider };
      // setCurrentUser(u); localStorage.setItem("yagan_user", JSON.stringify(u)); setShowLogin(false);
      // showToast(`ကြိုဆိုပါသည် ${u.name}! ✓`);
      showToast("Firebase မသတ်မှတ်ရသေးပါ — အောက်ပါ FIREBASE_CONFIG ကို ဖြည့်ပါ");
    } else {
      // Demo mode: simulate login
      const names: Record<string,string> = {google:"Google User",facebook:"Facebook User",apple:"Apple User"};
      const emails: Record<string,string> = {google:"demo@gmail.com",facebook:"demo@facebook.com",apple:"demo@icloud.com"};
      const u: AppUser = { name: names[provider], email: emails[provider], avatar: names[provider][0], role: "free", provider };
      setCurrentUser(u); localStorage.setItem("yagan_user", JSON.stringify(u));
      setShowLogin(false); showToast(`${names[provider]} ဖြင့် ဝင်ပြီး ✓ (Demo Mode)`);
    }
  };

  const handleLogout = () => { setCurrentUser(null); localStorage.removeItem("yagan_user"); setShowUserMenu(false); showToast("ထွက်ပြီး ✓"); };

  // Admin unlock
  const unlockAdmin = () => {
    if (adminPass === ADMIN_PASSWORD) {
      const u: AppUser = { name:"Admin", email:"admin@yaganbooks.com", avatar:"A", role:"admin", provider:"admin" };
      setCurrentUser(u); localStorage.setItem("yagan_user", JSON.stringify(u));
      setAdminUnlocked(true); setShowAdminLogin(false); setAdminPass(""); showToast("Admin mode ဝင်ပြီး 🔓");
    } else { setPassError(true); }
  };

  // Grant premium (admin action)
  const grantPremium = () => {
    if (!currentUser) return;
    const u = {...currentUser, role: "premium" as const};
    setCurrentUser(u); localStorage.setItem("yagan_user", JSON.stringify(u));
    showToast("Premium အဆင့် ရရှိပြီး 👑");
  };

  const handleDelete = (id: number) => { setBooks(books.filter(b=>b.id!==id)); showToast("ဖျက်ပြီး ✓"); };
  const handleSave = (book: Book) => {
    if (book.id && books.find(b=>b.id===book.id)) { setBooks(books.map(b=>b.id===book.id?book:b)); showToast("ပြင်ပြီး ✓"); }
    else { setBooks([...books,{...book,id:Date.now(),reads:0,rating:4.5}]); showToast("ထည့်ပြီး ✓"); }
    setAdminForm(null);
  };

  const isAdmin = currentUser?.role === "admin";
  const stats = { total:books.length, free:books.filter(b=>b.category==="free").length, premium:books.filter(b=>b.category==="premium").length, audio:books.filter(b=>b.type==="audiobook").length };
  const filteredBooks = books.filter(b => {
    const mf = filter==="all"||b.category===filter||(filter==="audiobook"&&b.type==="audiobook");
    const ms = !searchQuery||b.title.includes(searchQuery)||b.author.includes(searchQuery);
    return mf&&ms;
  });

  const roleBadge = (role: UserRole) => ({ free:{label:"Free",color:"#4ECDC4",bg:"rgba(27,77,62,0.8)"}, premium:{label:"Premium 👑",color:"#F4D03F",bg:"rgba(77,60,15,0.8)"}, admin:{label:"Admin 🔓",color:"#F79DD7",bg:"rgba(77,27,47,0.8)"} }[role]);

  return (<>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Noto+Sans+Myanmar:wght@300;400;600;700&family=Cinzel:wght@400;700;900&display=swap');
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
      :root{--gold:#D4AF37;--gl:#F4D03F;--gd:#A0840A;--ruby:#8B1A1A;--deep:#0A0408;--panel:#1A1018;--card:#1E1320;--border:rgba(212,175,55,0.25);--text:#F5EDD8;--muted:#9A8870;--sap:#1B2F4D;--glow:rgba(212,175,55,0.15);}
      body{background:var(--deep);color:var(--text);font-family:'Noto Sans Myanmar',sans-serif;overflow-x:hidden;}
      .bg{min-height:100vh;background:radial-gradient(ellipse at 20% 0%,#2D1B10 0%,transparent 50%),radial-gradient(ellipse at 80% 0%,#1A0D2E 0%,transparent 50%),radial-gradient(ellipse at 50% 100%,#0D1B10 0%,transparent 50%),var(--deep);}
      .particle{position:fixed;border-radius:50%;background:var(--gold);pointer-events:none;z-index:0;animation:fp 10s ease-in-out infinite alternate;}
      @keyframes fp{0%{transform:translateY(0) rotate(0deg);}100%{transform:translateY(-60px) rotate(360deg);}}
      /* NAV */
      .nav{position:fixed;top:0;left:0;right:0;z-index:100;background:linear-gradient(180deg,rgba(10,4,8,0.97),rgba(10,4,8,0.85));backdrop-filter:blur(20px);border-bottom:1px solid var(--border);padding:0 2rem;display:flex;align-items:center;justify-content:space-between;height:68px;}
      .logo{font-family:'Cinzel',serif;font-size:1.4rem;font-weight:900;background:linear-gradient(135deg,var(--gl),var(--gold),var(--gd));-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:2px;cursor:pointer;user-select:none;}
      .logo span{font-family:'Noto Sans Myanmar',sans-serif;font-size:0.72rem;display:block;color:var(--muted);-webkit-text-fill-color:var(--muted);}
      .nav-r{display:flex;gap:0.5rem;align-items:center;}
      .nb{background:none;border:none;color:var(--muted);cursor:pointer;padding:0.45rem 0.9rem;border-radius:8px;font-family:'Noto Sans Myanmar',sans-serif;font-size:0.82rem;transition:all 0.25s;}
      .nb:hover,.nb.on{color:var(--gold);background:var(--glow);}
      .nb.on::after{content:'';display:block;width:20px;height:2px;background:var(--gold);border-radius:2px;margin:2px auto 0;}
      .contact-nav-btn{background:linear-gradient(135deg,#1B4D3E,#2E7D5E);color:#A7F3D0;border:none;cursor:pointer;padding:0.45rem 1rem;border-radius:20px;font-size:0.78rem;font-family:'Noto Sans Myanmar',sans-serif;transition:all 0.25s;}
      .contact-nav-btn:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(27,77,62,0.5);}
      .login-btn{background:linear-gradient(135deg,var(--gd),var(--gold));color:var(--deep);border:none;cursor:pointer;padding:0.45rem 1.1rem;border-radius:20px;font-size:0.78rem;font-family:'Noto Sans Myanmar',sans-serif;font-weight:700;transition:all 0.25s;}
      .login-btn:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(212,175,55,0.4);}
      .uw{position:relative;}
      .ua{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--gd),var(--gold));color:var(--deep);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:0.9rem;cursor:pointer;border:2px solid var(--gold);transition:all 0.25s;}
      .ua:hover{transform:scale(1.1);box-shadow:0 0 14px rgba(212,175,55,0.4);}
      .udrop{position:absolute;top:calc(100% + 0.5rem);right:0;background:var(--panel);border:1px solid var(--border);border-radius:16px;padding:0.5rem;min-width:200px;z-index:200;animation:su 0.2s ease;box-shadow:0 8px 32px rgba(0,0,0,0.5);}
      .udrop-head{padding:0.75rem 1rem;border-bottom:1px solid var(--border);margin-bottom:0.25rem;}
      .udrop-name{font-weight:700;font-size:0.88rem;color:var(--text);}
      .udrop-badge{display:inline-block;font-size:0.7rem;padding:0.2rem 0.6rem;border-radius:50px;margin-top:0.25rem;font-weight:700;}
      .ui{padding:0.55rem 1rem;border-radius:8px;cursor:pointer;font-size:0.82rem;color:var(--muted);transition:all 0.2s;display:flex;align-items:center;gap:0.5rem;}
      .ui:hover{background:var(--glow);color:var(--gold);}
      /* HERO */
      .hero{min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:6rem 2rem 4rem;position:relative;overflow:hidden;}
      .h-orn{position:absolute;font-size:12rem;opacity:0.03;pointer-events:none;user-select:none;animation:pulse 6s ease-in-out infinite;}
      @keyframes pulse{0%,100%{opacity:0.03;transform:scale(1);}50%{opacity:0.06;transform:scale(1.02);}}
      .h-badge{display:inline-flex;align-items:center;gap:0.5rem;background:linear-gradient(135deg,rgba(212,175,55,0.15),rgba(212,175,55,0.05));border:1px solid var(--border);border-radius:50px;padding:0.4rem 1.2rem;font-size:0.78rem;color:var(--gold);margin-bottom:2rem;opacity:0;transform:translateY(20px);transition:all 0.8s ease 0.2s;}
      .h-badge.s{opacity:1;transform:translateY(0);}
      .h-title{font-family:'Playfair Display',serif;font-size:clamp(2.8rem,7vw,5.5rem);font-weight:900;line-height:1.1;margin-bottom:1rem;opacity:0;transform:translateY(30px);transition:all 0.9s ease 0.4s;}
      .h-title.s{opacity:1;transform:translateY(0);}
      .h-title .g{background:linear-gradient(135deg,var(--gl),var(--gold),var(--gd));-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
      .h-sub{font-size:1.05rem;color:var(--muted);max-width:580px;margin:0 auto 2.5rem;line-height:1.9;opacity:0;transform:translateY(20px);transition:all 0.9s ease 0.6s;}
      .h-sub.s{opacity:1;transform:translateY(0);}
      .h-act{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;opacity:0;transform:translateY(20px);transition:all 0.9s ease 0.8s;}
      .h-act.s{opacity:1;transform:translateY(0);}
      .bp{background:linear-gradient(135deg,var(--gd),var(--gold),var(--gl));color:var(--deep);border:none;cursor:pointer;padding:0.85rem 2.2rem;border-radius:50px;font-family:'Noto Sans Myanmar',sans-serif;font-size:0.95rem;font-weight:700;transition:all 0.3s;box-shadow:0 4px 20px rgba(212,175,55,0.35);}
      .bp:hover{transform:translateY(-3px);box-shadow:0 8px 30px rgba(212,175,55,0.55);}
      .bo{background:transparent;color:var(--gold);cursor:pointer;padding:0.85rem 2.2rem;border-radius:50px;border:1.5px solid var(--gold);font-family:'Noto Sans Myanmar',sans-serif;font-size:0.95rem;transition:all 0.3s;}
      .bo:hover{background:var(--glow);transform:translateY(-3px);}
      /* STATS */
      .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--border);border-top:1px solid var(--border);border-bottom:1px solid var(--border);position:relative;z-index:1;}
      .si{background:rgba(26,16,24,0.9);padding:2rem;text-align:center;transition:all 0.3s;}
      .si:hover{background:rgba(212,175,55,0.06);}
      .sn{font-family:'Cinzel',serif;font-size:2.2rem;font-weight:900;color:var(--gold);}
      .sl{font-size:0.78rem;color:var(--muted);margin-top:0.25rem;}
      /* SECTION */
      .sec{padding:5rem 2rem;max-width:1300px;margin:0 auto;position:relative;z-index:1;}
      .sh{text-align:center;margin-bottom:3rem;}
      .eye{font-family:'Cinzel',serif;font-size:0.7rem;letter-spacing:4px;color:var(--gold);text-transform:uppercase;margin-bottom:0.75rem;}
      .st{font-family:'Playfair Display',serif;font-size:clamp(1.8rem,4vw,2.8rem);font-weight:700;line-height:1.2;}
      .gd{width:60px;height:3px;background:linear-gradient(90deg,transparent,var(--gold),transparent);margin:0.75rem auto 0;border-radius:3px;}
      /* FILTER */
      .fb-row{display:flex;gap:0.5rem;justify-content:center;margin-bottom:2.5rem;flex-wrap:wrap;}
      .fb{background:transparent;border:1px solid var(--border);color:var(--muted);padding:0.5rem 1.3rem;border-radius:50px;cursor:pointer;font-family:'Noto Sans Myanmar',sans-serif;font-size:0.82rem;transition:all 0.25s;}
      .fb:hover{border-color:var(--gold);color:var(--gold);background:var(--glow);}
      .fb.on{background:linear-gradient(135deg,var(--gd),var(--gold));color:var(--deep);border-color:transparent;font-weight:700;}
      /* SEARCH */
      .sw{max-width:420px;margin:0 auto 2rem;position:relative;}
      .si2{width:100%;background:rgba(30,19,32,0.8);border:1px solid var(--border);color:var(--text);padding:0.75rem 1rem 0.75rem 2.8rem;border-radius:50px;font-family:'Noto Sans Myanmar',sans-serif;font-size:0.88rem;outline:none;transition:border-color 0.25s;}
      .si2::placeholder{color:var(--muted);}
      .si2:focus{border-color:var(--gold);box-shadow:0 0 0 3px var(--glow);}
      .sic{position:absolute;left:1rem;top:50%;transform:translateY(-50%);color:var(--muted);}
      /* BOOKS GRID */
      .bg2{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1.5rem;}
      .bc{background:linear-gradient(145deg,var(--card),var(--panel));border:1px solid var(--border);border-radius:16px;overflow:hidden;cursor:pointer;transition:all 0.35s cubic-bezier(0.34,1.56,0.64,1);position:relative;animation:fu 0.5s ease both;}
      @keyframes fu{from{opacity:0;transform:translateY(30px);}to{opacity:1;transform:translateY(0);}}
      .bc:hover{transform:translateY(-10px) scale(1.02);border-color:var(--gold);box-shadow:0 20px 60px rgba(0,0,0,0.5),0 0 30px rgba(212,175,55,0.12);}
      .bco{height:180px;display:flex;align-items:center;justify-content:center;font-size:5rem;position:relative;overflow:hidden;}
      .bco::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(212,175,55,0.08),transparent 60%,rgba(139,26,26,0.08));}
      .cf{background:linear-gradient(135deg,#1B4D3E,#0D2E22);}
      .cp{background:linear-gradient(135deg,#1B2F4D,#0D1B2E);}
      .ca{background:linear-gradient(135deg,#4D1B2F,#2E0D1B);}
      .btag{position:absolute;top:0.75rem;right:0.75rem;font-size:0.65rem;font-weight:700;padding:0.25rem 0.7rem;border-radius:50px;}
      .tf{background:rgba(27,77,62,0.9);color:#4ECDC4;border:1px solid rgba(78,205,196,0.3);}
      .tp{background:rgba(27,47,77,0.9);color:#7EB8F7;border:1px solid rgba(126,184,247,0.3);}
      .ta{background:rgba(77,27,47,0.9);color:#F79DD7;border:1px solid rgba(247,157,215,0.3);}
      .tn{background:rgba(77,60,15,0.9);color:var(--gl);border:1px solid rgba(212,175,55,0.3);}
      .lo{position:absolute;inset:0;background:rgba(10,4,8,0.6);display:flex;align-items:center;justify-content:center;font-size:2rem;backdrop-filter:blur(2px);}
      .bi{padding:1.2rem;}
      .bt{font-weight:700;font-size:0.92rem;margin-bottom:0.3rem;line-height:1.5;}
      .bau{font-size:0.78rem;color:var(--muted);margin-bottom:0.75rem;}
      .bm{display:flex;align-items:center;justify-content:space-between;}
      .bpr{font-family:'Cinzel',serif;font-weight:700;font-size:0.95rem;color:var(--gold);}
      .bpr.fr{color:#4ECDC4;}
      .bra{font-size:0.75rem;color:var(--muted);}
      .aa{display:flex;gap:0.5rem;padding:0 1.2rem 1.2rem;opacity:0;transition:opacity 0.25s;}
      .bc:hover .aa{opacity:1;}
      .ab{flex:1;padding:0.4rem;border-radius:8px;border:1px solid;cursor:pointer;font-size:0.75rem;font-family:'Noto Sans Myanmar',sans-serif;transition:all 0.2s;}
      .eb{background:rgba(212,175,55,0.1);border-color:rgba(212,175,55,0.3);color:var(--gold);}
      .db{background:rgba(178,34,34,0.1);border-color:rgba(178,34,34,0.3);color:#F77;}
      /* FEATURED */
      .fb2{background:linear-gradient(135deg,rgba(27,47,77,0.6),rgba(77,27,47,0.4));border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:4rem 2rem;position:relative;overflow:hidden;z-index:1;}
      .fb2::before{content:'';position:absolute;top:-50%;left:-50%;width:200%;height:200%;background:radial-gradient(ellipse at center,rgba(212,175,55,0.04) 0%,transparent 60%);animation:rb 30s linear infinite;}
      @keyframes rb{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      .fin{max-width:1300px;margin:0 auto;}
      .fbook{display:grid;grid-template-columns:1fr 2fr;gap:3rem;align-items:center;}
      .fcov{aspect-ratio:3/4;max-width:240px;margin:0 auto;background:linear-gradient(135deg,var(--sap),var(--deep));border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:8rem;border:2px solid var(--border);box-shadow:20px 20px 60px rgba(0,0,0,0.6);animation:bf 4s ease-in-out infinite;}
      @keyframes bf{0%,100%{transform:translateY(0) rotate(-1deg);}50%{transform:translateY(-12px) rotate(1deg);}}
      /* CATS */
      .cg{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;}
      .cc{border-radius:20px;padding:2.5rem 2rem;text-align:center;cursor:pointer;transition:all 0.35s;border:1px solid transparent;position:relative;overflow:hidden;}
      .cc::before{content:'';position:absolute;inset:0;opacity:0;transition:opacity 0.35s;background:radial-gradient(ellipse at 50% 0%,rgba(212,175,55,0.15) 0%,transparent 70%);}
      .cc:hover::before{opacity:1;}
      .cc:hover{transform:translateY(-8px);border-color:var(--border);}
      .ccf{background:linear-gradient(135deg,rgba(27,77,62,0.4),rgba(27,77,62,0.15));}
      .ccp{background:linear-gradient(135deg,rgba(27,47,77,0.4),rgba(27,47,77,0.15));}
      .cca{background:linear-gradient(135deg,rgba(77,27,47,0.4),rgba(77,27,47,0.15));}
      .ci{font-size:3rem;margin-bottom:1rem;display:block;}
      .cn{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:700;margin-bottom:0.5rem;}
      .cd{font-size:0.83rem;color:var(--muted);line-height:1.7;}
      .cc2{font-family:'Cinzel',serif;font-size:1.8rem;font-weight:900;color:var(--gold);margin-top:1rem;}
      /* OVERLAY & MODAL */
      .ov{position:fixed;inset:0;background:rgba(0,0,0,0.88);backdrop-filter:blur(14px);z-index:200;display:flex;align-items:center;justify-content:center;padding:2rem;animation:fi 0.25s ease;}
      @keyframes fi{from{opacity:0}to{opacity:1}}
      .mod{background:var(--panel);border:1px solid var(--border);border-radius:24px;max-width:700px;width:100%;max-height:90vh;overflow-y:auto;animation:su 0.35s cubic-bezier(0.34,1.56,0.64,1);}
      @keyframes su{from{opacity:0;transform:translateY(40px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}
      .mh{height:240px;display:flex;align-items:center;justify-content:center;font-size:9rem;position:relative;background:linear-gradient(135deg,var(--deep),var(--sap),#120C10);border-radius:24px 24px 0 0;}
      .mc{position:absolute;top:1rem;right:1rem;background:rgba(0,0,0,0.5);border:1px solid var(--border);color:var(--text);width:36px;height:36px;border-radius:50%;cursor:pointer;font-size:1.1rem;display:flex;align-items:center;justify-content:center;transition:all 0.2s;}
      .mc:hover{background:rgba(212,175,55,0.2);color:var(--gold);}
      .mb{padding:2rem;}
      .mt{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:900;margin-bottom:0.4rem;}
      .mau{color:var(--muted);font-size:0.9rem;margin-bottom:1.2rem;}
      .mtags{display:flex;gap:0.5rem;margin-bottom:1.5rem;flex-wrap:wrap;}
      .mtag{padding:0.3rem 0.8rem;border-radius:50px;font-size:0.75rem;border:1px solid var(--border);color:var(--muted);}
      .mdes{color:var(--muted);line-height:2;font-size:0.9rem;margin-bottom:1.5rem;}
      .ms{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--border);border-radius:12px;overflow:hidden;margin-bottom:1.5rem;}
      .msi{background:var(--card);padding:1rem;text-align:center;}
      .msv{font-family:'Cinzel',serif;font-size:1.1rem;font-weight:700;color:var(--gold);}
      .msl{font-size:0.72rem;color:var(--muted);margin-top:0.2rem;}
      .bg3{width:100%;padding:1rem;border-radius:12px;border:none;cursor:pointer;font-family:'Noto Sans Myanmar',sans-serif;font-size:1rem;font-weight:700;transition:all 0.3s;margin-top:0.75rem;}
      .bgf{background:linear-gradient(135deg,#1B4D3E,#2E7D5E);color:#A7F3D0;}
      .bgp{background:linear-gradient(135deg,var(--gd),var(--gold),var(--gl));color:var(--deep);}
      .bgf:hover,.bgp:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.4);}
      .ap{width:100%;margin-bottom:1rem;border-radius:8px;accent-color:var(--gold);}
      .lkbox{text-align:center;padding:1.5rem;background:rgba(139,26,26,0.12);border-radius:12px;border:1px solid rgba(255,100,100,0.2);margin-bottom:1rem;}
      /* LOGIN PANEL */
      .lp{position:fixed;inset:0;background:rgba(0,0,0,0.92);backdrop-filter:blur(20px);z-index:400;display:flex;align-items:center;justify-content:center;padding:2rem;animation:fi 0.25s ease;}
      .lb{background:var(--panel);border:1px solid var(--border);border-radius:28px;padding:2.5rem;max-width:420px;width:100%;text-align:center;animation:su 0.35s cubic-bezier(0.34,1.56,0.64,1);max-height:92vh;overflow-y:auto;}
      .lb.gold{border-color:var(--gold);}
      .social-login-btn{display:flex;align-items:center;gap:1rem;padding:1rem 1.5rem;border-radius:14px;border:1px solid var(--border);background:rgba(30,19,32,0.7);color:var(--text);cursor:pointer;font-family:'Noto Sans Myanmar',sans-serif;font-size:0.92rem;transition:all 0.3s;width:100%;margin-bottom:0.75rem;position:relative;overflow:hidden;}
      .social-login-btn::before{content:'';position:absolute;inset:0;opacity:0;transition:opacity 0.3s;}
      .social-login-btn:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,0.4);}
      .g-btn{border-color:rgba(66,133,244,0.4);}
      .g-btn::before{background:linear-gradient(135deg,rgba(66,133,244,0.1),rgba(52,168,83,0.1));}
      .g-btn:hover{border-color:rgba(66,133,244,0.7);color:white;}
      .g-btn:hover::before{opacity:1;}
      .f-btn{border-color:rgba(24,119,242,0.4);}
      .f-btn::before{background:linear-gradient(135deg,rgba(24,119,242,0.15),rgba(24,119,242,0.05));}
      .f-btn:hover{border-color:rgba(24,119,242,0.7);color:white;}
      .f-btn:hover::before{opacity:1;}
      .a-btn{border-color:rgba(255,255,255,0.25);}
      .a-btn::before{background:linear-gradient(135deg,rgba(255,255,255,0.1),rgba(200,200,200,0.05));}
      .a-btn:hover{border-color:rgba(255,255,255,0.5);color:white;}
      .a-btn:hover::before{opacity:1;}
      .social-icon{font-size:1.5rem;flex-shrink:0;}
      .social-label{flex:1;text-align:left;}
      .social-arrow{color:var(--muted);font-size:0.8rem;}
      /* ADMIN FORM */
      .afo{position:fixed;inset:0;background:rgba(0,0,0,0.92);backdrop-filter:blur(16px);z-index:300;display:flex;align-items:center;justify-content:center;padding:2rem;animation:fi 0.25s ease;}
      .af{background:var(--panel);border:1px solid var(--gold);border-radius:24px;max-width:560px;width:100%;max-height:90vh;overflow-y:auto;animation:su 0.35s cubic-bezier(0.34,1.56,0.64,1);}
      .afh{padding:1.5rem 2rem;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;}
      .aft{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:700;color:var(--gold);}
      .afb{padding:2rem;display:flex;flex-direction:column;gap:1.25rem;}
      .fg{display:flex;flex-direction:column;gap:0.5rem;}
      .fl{font-size:0.8rem;color:var(--muted);font-weight:600;letter-spacing:0.5px;}
      .fi,.fs,.ft{background:rgba(30,19,32,0.8);border:1px solid var(--border);color:var(--text);padding:0.75rem 1rem;border-radius:10px;font-family:'Noto Sans Myanmar',sans-serif;font-size:0.88rem;outline:none;transition:border-color 0.25s;width:100%;}
      .fi:focus,.fs:focus,.ft:focus{border-color:var(--gold);box-shadow:0 0 0 3px var(--glow);}
      .ft{resize:vertical;min-height:100px;}
      .fs option{background:var(--panel);}
      .fr2{display:grid;grid-template-columns:1fr 1fr;gap:1rem;}
      .fsub{background:linear-gradient(135deg,var(--gd),var(--gold),var(--gl));color:var(--deep);border:none;cursor:pointer;padding:0.85rem;border-radius:12px;font-weight:700;font-family:'Noto Sans Myanmar',sans-serif;font-size:0.95rem;transition:all 0.3s;}
      .fsub:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(212,175,55,0.4);}
      /* ADMIN BAR */
      .abar{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,rgba(77,27,47,0.97),rgba(139,26,26,0.95));border:1px solid rgba(255,100,100,0.3);border-radius:50px;padding:0.75rem 1.5rem;z-index:50;display:flex;gap:1rem;align-items:center;box-shadow:0 8px 40px rgba(139,26,26,0.6);backdrop-filter:blur(12px);animation:su 0.4s ease;}
      .al{font-size:0.78rem;color:rgba(255,200,200,0.9);font-weight:600;}
      .addb{background:white;color:var(--ruby);border:none;cursor:pointer;padding:0.5rem 1.2rem;border-radius:50px;font-size:0.82rem;font-weight:700;font-family:'Noto Sans Myanmar',sans-serif;transition:all 0.25s;}
      .addb:hover{background:var(--gl);transform:scale(1.05);}
      /* CONTACT PANEL */
      .contact-panel{background:linear-gradient(135deg,rgba(27,77,62,0.2),rgba(27,47,77,0.2));border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:5rem 2rem;position:relative;z-index:1;}
      .contact-grid{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:start;}
      .contact-card{background:var(--card);border:1px solid var(--border);border-radius:20px;padding:2rem;transition:all 0.35s;}
      .contact-card:hover{border-color:var(--gold);transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,0.4);}
      .contact-icon{font-size:2.5rem;margin-bottom:1rem;}
      .contact-title{font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:700;margin-bottom:0.5rem;}
      .contact-desc{font-size:0.85rem;color:var(--muted);line-height:1.8;margin-bottom:1.5rem;}
      .cta-btn{display:inline-flex;align-items:center;gap:0.5rem;padding:0.75rem 1.5rem;border-radius:50px;border:none;cursor:pointer;font-family:'Noto Sans Myanmar',sans-serif;font-size:0.85rem;font-weight:700;transition:all 0.3s;text-decoration:none;}
      .tg-btn{background:linear-gradient(135deg,#0088cc,#29b6d9);color:white;}
      .vb-btn{background:linear-gradient(135deg,#7360f2,#9370db);color:white;}
      .cta-btn:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,0.4);}
      .premium-box{background:linear-gradient(135deg,rgba(77,60,15,0.5),rgba(27,47,77,0.3));border:1px solid rgba(212,175,55,0.4);border-radius:20px;padding:2rem;margin-top:0;}
      .premium-price{font-family:'Cinzel',serif;font-size:2rem;font-weight:900;color:var(--gold);margin:0.5rem 0;}
      .premium-features{list-style:none;display:flex;flex-direction:column;gap:0.5rem;margin:1rem 0 1.5rem;}
      .premium-features li{font-size:0.85rem;color:var(--muted);display:flex;align-items:center;gap:0.5rem;}
      /* CHANNELS */
      .channels-row{display:flex;gap:1rem;flex-wrap:wrap;margin-top:1.5rem;}
      .channel-btn{display:flex;align-items:center;gap:0.5rem;padding:0.6rem 1.2rem;border-radius:50px;border:1px solid var(--border);background:rgba(30,19,32,0.6);color:var(--text);cursor:pointer;font-size:0.82rem;transition:all 0.25s;text-decoration:none;font-family:'Noto Sans Myanmar',sans-serif;}
      .channel-btn:hover{border-color:var(--gold);color:var(--gold);background:var(--glow);transform:translateY(-2px);}
      /* MARQUEE */
      .mw{overflow:hidden;border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:1rem 0;background:rgba(212,175,55,0.03);position:relative;z-index:1;}
      .mi{display:flex;gap:4rem;width:max-content;animation:mq 30s linear infinite;}
      @keyframes mq{from{transform:translateX(0)}to{transform:translateX(-50%)}}
      .mit{font-size:0.78rem;color:var(--muted);white-space:nowrap;display:flex;align-items:center;gap:0.5rem;}
      .md{color:var(--gold);}
      /* TOAST */
      .toast{position:fixed;bottom:5rem;left:50%;transform:translateX(-50%);background:rgba(27,77,62,0.95);border:1px solid rgba(78,205,196,0.4);color:#A7F3D0;padding:0.75rem 1.5rem;border-radius:50px;font-size:0.85rem;z-index:999;backdrop-filter:blur(12px);animation:ti 0.35s cubic-bezier(0.34,1.56,0.64,1);white-space:nowrap;}
      @keyframes ti{from{opacity:0;transform:translateX(-50%) translateY(20px) scale(0.9)}to{opacity:1;transform:translateX(-50%) translateY(0) scale(1)}}
      /* FOOTER */
      .foot{background:linear-gradient(180deg,transparent,rgba(10,4,8,0.98));border-top:1px solid var(--border);padding:4rem 2rem 2rem;text-align:center;position:relative;z-index:1;}
      .fl2{font-family:'Cinzel',serif;font-size:2rem;font-weight:900;color:var(--gold);margin-bottom:0.75rem;}
      .fta{color:var(--muted);font-size:0.85rem;margin-bottom:2rem;}
      .flinks{display:flex;gap:2rem;justify-content:center;margin-bottom:2rem;flex-wrap:wrap;}
      .flink{color:var(--muted);font-size:0.82rem;cursor:pointer;transition:color 0.2s;}
      .flink:hover{color:var(--gold);}
      .fco{font-size:0.75rem;color:rgba(154,136,112,0.5);}
      .hint{font-size:0.72rem;color:rgba(154,136,112,0.5);margin-top:0.25rem;}
      /* DEMO NOTICE */
      .demo-notice{background:rgba(77,60,15,0.6);border:1px solid rgba(212,175,55,0.4);border-radius:12px;padding:1rem 1.25rem;margin-bottom:1.5rem;font-size:0.78rem;color:var(--gl);text-align:left;line-height:1.7;}
      @media(max-width:768px){
        .stats{grid-template-columns:repeat(2,1fr);}
        .cg{grid-template-columns:1fr;}
        .fbook{grid-template-columns:1fr;text-align:center;}
        .bg2{grid-template-columns:repeat(auto-fill,minmax(180px,1fr));}
        .fr2{grid-template-columns:1fr;}
        .nav-r .nb{display:none;}
        .contact-grid{grid-template-columns:1fr;}
        .channels-row{justify-content:center;}
      }
    `}</style>

    <div className="bg">
      {particles.map(p=>(
        <div key={p.id} className="particle" style={{left:p.left,top:p.top,width:p.size,height:p.size,opacity:p.op,animationDelay:p.delay,animationDuration:p.dur}}/>
      ))}

      {/* ── NAV ── */}
      <nav className="nav">
        <div className="logo" onClick={handleLogoClick} title="">
          YAGAN BOOKS
          <span>မြန်မာ အကျဉ်းချုပ် စာကြည့်တိုက်</span>
        </div>
        <div className="nav-r">
          {(["home","library","categories"] as const).map(v=>(
            <button key={v} className={`nb ${view===v?"on":""}`} onClick={()=>setView(v)}>
              {v==="home"?"မူလ":v==="library"?"စာကြည့်တိုက်":"အမျိုးအစား"}
            </button>
          ))}
          <button className="contact-nav-btn" onClick={()=>setView("contact")}>📞 ဆက်သွယ်</button>
          {currentUser ? (
            <div className="uw">
              <div className="ua" onClick={()=>setShowUserMenu(!showUserMenu)}>{currentUser.avatar}</div>
              {showUserMenu && (
                <div className="udrop">
                  <div className="udrop-head">
                    <div className="udrop-name">{currentUser.name}</div>
                    <span className="udrop-badge" style={{background:roleBadge(currentUser.role).bg,color:roleBadge(currentUser.role).color}}>
                      {roleBadge(currentUser.role).label}
                    </span>
                  </div>
                  {currentUser.role==="free" && (
                    <div className="ui" style={{color:"var(--gl)"}} onClick={()=>{setShowUserMenu(false);setView("contact");}}>
                      👑 Premium အဆင့်တင်မည်
                    </div>
                  )}
                  <div className="ui" onClick={handleLogout}>🚪 ထွက်မည်</div>
                </div>
              )}
            </div>
          ) : (
            <button className="login-btn" onClick={()=>setShowUserLogin(true)}>👤 ဝင်ရောက်မည်</button>
          )}
        </div>
      </nav>

      {/* ── HIDDEN ADMIN LOGIN (click logo 5x fast) ── */}
      {showAdminLogin && (
        <div className="lp" onClick={()=>{setShowAdminLogin(false);setAdminPass("");}}>
          <div className="lb gold" onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:"3rem",marginBottom:"1rem"}}>🔐</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.5rem",fontWeight:700,color:"var(--gold)",marginBottom:"0.5rem"}}>Admin Access</div>
            <div style={{fontSize:"0.82rem",color:"var(--muted)",marginBottom:"1.5rem"}}>စီမံခန့်ခွဲသူ ဝင်ရောက်မှု</div>
            <div className="fg" style={{textAlign:"left",marginBottom:"1rem"}}>
              <label className="fl">Password</label>
              <input type="password" className="fi" placeholder="Admin password..." value={adminPass}
                onChange={e=>{setAdminPass(e.target.value);setPassError(false);}}
                onKeyDown={e=>{if(e.key==="Enter")unlockAdmin();}}/>
            </div>
            {passError && <div style={{color:"#F77",fontSize:"0.8rem",marginBottom:"1rem"}}>Password မှားနေပါသည်</div>}
            <button className="bp" style={{width:"100%",marginBottom:"0.75rem"}} onClick={unlockAdmin}>ဝင်ရောက်မည်</button>
            <button className="bo" style={{width:"100%"}} onClick={()=>{setShowAdminLogin(false);setAdminPass("");}}>မလုပ်တော့ပါ</button>
          </div>
        </div>
      )}

      {/* ── USER LOGIN (Social only) ── */}
      {showUserLogin && (
        <div className="lp" onClick={()=>setShowUserLogin(false)}>
          <div className="lb" onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:"2.5rem",marginBottom:"0.75rem"}}>📚</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.6rem",fontWeight:900,marginBottom:"0.3rem"}}>YAGAN BOOKS</div>
            <div style={{fontSize:"0.82rem",color:"var(--muted)",marginBottom:"1.5rem"}}>အကောင့်ဖြင့် ဝင်ရောက်ပါ</div>

            {!FIREBASE_READY && (
              <div className="demo-notice">
                ⚠️ <strong>Demo Mode</strong> — Firebase မသတ်မှတ်ရသေးပါ။<br/>
                ဤ button များကို နှိပ်လျှင် Demo account ဖြင့် ဝင်ပါမည်။<br/>
                Real login အတွက် Firebase setup လိုအပ်ပါသည်။
              </div>
            )}

            <button className="social-login-btn g-btn" onClick={()=>socialLogin("google")}>
              <span className="social-icon">🌐</span>
              <span className="social-label">Google ဖြင့် ဆက်လက်မည်</span>
              <span className="social-arrow">→</span>
            </button>
            <button className="social-login-btn f-btn" onClick={()=>socialLogin("facebook")}>
              <span className="social-icon">📘</span>
              <span className="social-label">Facebook ဖြင့် ဆက်လက်မည်</span>
              <span className="social-arrow">→</span>
            </button>
            <button className="social-login-btn a-btn" onClick={()=>socialLogin("apple")}>
              <span className="social-icon"></span>
              <span className="social-label">Apple ဖြင့် ဆက်လက်မည်</span>
              <span className="social-arrow">→</span>
            </button>

            <div style={{marginTop:"1.25rem",padding:"1rem",background:"rgba(27,77,62,0.15)",border:"1px solid rgba(78,205,196,0.2)",borderRadius:"12px",fontSize:"0.78rem",color:"var(--muted)",lineHeight:1.7}}>
              🔐 သင့်အကောင့်ကို YAGAN BOOKS နှင့် မျှဝေမည်မဟုတ်ပါ<br/>
              📧 Email မလိုဘဲ Social Account ဖြင့်သာ ဝင်ရောက်နိုင်ပါသည်
            </div>
            <button className="bo" style={{width:"100%",marginTop:"1rem"}} onClick={()=>setShowUserLogin(false)}>မလုပ်တော့ပါ</button>
          </div>
        </div>
      )}

      {/* ── HOME ── */}
      {view==="home" && (<>
        <section className="hero">
          <div className="h-orn">📚</div>
          <div style={{position:"relative",zIndex:1}}>
            <div className={`h-badge ${heroAnim?"s":""}`}>✨ မြန်မာ့ အကောင်းဆုံး Digital Library</div>
            <h1 className={`h-title ${heroAnim?"s":""}`}>
              စာဖတ်ခြင်းဖြင့်<br/><span className="g">ဘဝကို ပြောင်းလဲပါ</span>
            </h1>
            <p className={`h-sub ${heroAnim?"s":""}`}>
              အကောင်းဆုံးစာအုပ်များ၏ အကျဉ်းချုပ်ကို မြန်မာဘာသာဖြင့် ဖတ်ပါ၊ နားထောင်ပါ။<br/>
              ကမ္ဘာ့ Best Seller များကို မိနစ်ပိုင်းတွင် နားလည်ပါ။
            </p>
            <div className={`h-act ${heroAnim?"s":""}`}>
              <button className="bp" onClick={()=>setView("library")}>📚 စာကြည့်တိုက် ဝင်ကြည့်မည်</button>
              {!currentUser
                ? <button className="bo" onClick={()=>setShowUserLogin(true)}>👤 အကောင့်ဖွင့်မည်</button>
                : currentUser.role==="free" && <button className="bo" style={{borderColor:"var(--gl)",color:"var(--gl)"}} onClick={()=>setView("contact")}>👑 Premium အဆင့်တင်မည်</button>
              }
            </div>
          </div>
        </section>

        <div className="stats">
          <div className="si"><div className="sn">{stats.total}+</div><div className="sl">📚 စာအုပ်</div></div>
          <div className="si"><div className="sn">{stats.free}</div><div className="sl">🆓 အခမဲ့</div></div>
          <div className="si"><div className="sn">{stats.premium}</div><div className="sl">👑 Premium</div></div>
          <div className="si"><div className="sn">{stats.audio}</div><div className="sl">🎧 Audio</div></div>
        </div>

        <div className="mw">
          <div className="mi">
            {[...Array(2)].map((_,di)=>books.map((b,i)=>(<span key={`${di}-${i}`} className="mit"><span className="md">✦</span>{b.title}</span>)))}
          </div>
        </div>

        <section className="sec">
          <div className="sh"><div className="eye">Browse by Type</div><h2 className="st">စာအုပ် အမျိုးအစားများ</h2><div className="gd"/></div>
          <div className="cg">
            <div className="cc ccf" onClick={()=>{setView("library");setFilter("free");}}>
              <span className="ci">📗</span><div className="cn">အခမဲ့ Ebooks</div>
              <div className="cd">Login မလိုဘဲ ဖတ်ရှုနိုင်</div><div className="cc2">{books.filter(b=>b.category==="free"&&b.type==="ebook").length} Books</div>
            </div>
            <div className="cc ccp" onClick={()=>{setView("library");setFilter("premium");}}>
              <span className="ci">👑</span><div className="cn">Premium Ebooks</div>
              <div className="cd">Premium အကောင့်ဖြင့် ဝင်ကြည့်ပါ</div><div className="cc2">{books.filter(b=>b.category==="premium"&&b.type==="ebook").length} Books</div>
            </div>
            <div className="cc cca" onClick={()=>{setView("library");setFilter("audiobook");}}>
              <span className="ci">🎧</span><div className="cn">Audio Books</div>
              <div className="cd">ဘယ်နေရာမှာမဆို နားထောင်ပါ</div><div className="cc2">{books.filter(b=>b.type==="audiobook").length} Books</div>
            </div>
          </div>
        </section>

        <div className="fb2">
          <div className="fin">
            <div style={{textAlign:"center",marginBottom:"2.5rem"}}><div className="eye">Editor's Pick</div><h2 className="st">အကြံပြုသောစာအုပ်</h2><div className="gd"/></div>
            <div className="fbook">
              <div className="fcov">📘</div>
              <div>
                <div style={{display:"inline-flex",alignItems:"center",gap:"0.5rem",background:"linear-gradient(135deg,var(--gd),var(--gold))",color:"var(--deep)",padding:"0.35rem 1rem",borderRadius:"50px",fontSize:"0.72rem",fontWeight:700,marginBottom:"1rem"}}>⭐ #1 Bestseller</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:"2.2rem",fontWeight:900,lineHeight:1.2,marginBottom:"0.75rem"}}>ငွေကြေးဉာဏ်ပညာ</div>
                <div style={{color:"var(--muted)",marginBottom:"1rem",fontSize:"0.88rem"}}>Robert Kiyosaki | Premium Ebook</div>
                <div style={{color:"var(--muted)",lineHeight:1.9,fontSize:"0.9rem",marginBottom:"2rem"}}>ချမ်းသာကြွယ်ဝရေးသို့ ဦးတည်သောကြောင်း ငွေကြေးစီမံခန့်ခွဲမှု နှင့် ဝင်ငွေတိုးပွားစေရန် နည်းလမ်းများ ပါဝင်သောစာအုပ်ကြီး မြန်မာဘာသာ အကျဉ်းချုပ်။</div>
                <div style={{display:"flex",gap:"1rem",flexWrap:"wrap"}}>
                  <button className="bp" onClick={()=>setSelectedBook(books[1])}>📖 ဖတ်ရှုမည်</button>
                  <button className="bo" onClick={()=>setView("library")}>📚 နောက်ထပ်</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="sec">
          <div className="sh"><div className="eye">Latest</div><h2 className="st">လတ်တလော ထည့်သွင်းထားသော စာအုပ်များ</h2><div className="gd"/></div>
          <div className="bg2">
            {books.slice(0,4).map((book,i)=>(
              <BookCard key={book.id} book={book} onSelect={setSelectedBook} isAdmin={isAdmin} onEdit={b=>setAdminForm(b)} onDelete={handleDelete} delay={`${i*0.1}s`} access={canAccess(book,currentUser)}/>
            ))}
          </div>
          <div style={{textAlign:"center",marginTop:"2.5rem"}}>
            <button className="bo" onClick={()=>setView("library")}>📚 ကျန်သောစာအုပ်များ</button>
          </div>
        </section>

        {/* SOCIAL CHANNELS */}
        <section className="sec" style={{paddingTop:0}}>
          <div className="sh"><div className="eye">Follow Us</div><h2 className="st">ကျွန်တော်တို့ Channel များ</h2><div className="gd"/></div>
          <div style={{textAlign:"center"}}>
            <p style={{color:"var(--muted)",marginBottom:"1.5rem",fontSize:"0.9rem"}}>နောက်ဆုံးရ သတင်းများ၊ စာအုပ်အသစ်များ အကြောင်း Follow လုပ်ပြီး သိရှိပါ</p>
            <div className="channels-row" style={{justifyContent:"center"}}>
              <a href={CONTACTS.telegramChannel} target="_blank" rel="noreferrer" className="channel-btn">
                ✈️ Telegram Channel
              </a>
              <a href={CONTACTS.facebookPage} target="_blank" rel="noreferrer" className="channel-btn">
                📘 Facebook Page
              </a>
              <a href={CONTACTS.telegramAdmin} target="_blank" rel="noreferrer" className="channel-btn">
                💬 Admin ဆက်သွယ်
              </a>
            </div>
          </div>
        </section>

        <footer className="foot">
          <div className="fl2">📚 YAGAN BOOKS</div>
          <div className="fta">မြန်မာ့ အကောင်းဆုံး Digital Reading Platform</div>
          <div className="flinks">
            <span className="flink" onClick={()=>setView("home")}>မူလ</span>
            <span className="flink" onClick={()=>setView("library")}>စာကြည့်တိုက်</span>
            <span className="flink" onClick={()=>setView("categories")}>အမျိုးအစား</span>
            <span className="flink" onClick={()=>setView("contact")}>ဆက်သွယ်</span>
          </div>
          <div className="gd" style={{marginBottom:"1.5rem"}}/>
          <div className="fco">© 2025 Yagan Books · မြန်မာနိုင်ငံ မှ ❤️</div>
        </footer>
      </>)}

      {/* ── LIBRARY ── */}
      {view==="library" && (
        <div className="sec" style={{paddingTop:"7rem"}}>
          <div className="sh"><div className="eye">Digital Library</div><h2 className="st">မြန်မာ စာကြည့်တိုက်</h2><div className="gd"/></div>
          {currentUser && (
            <div style={{textAlign:"center",marginBottom:"1.5rem"}}>
              <span style={{display:"inline-flex",alignItems:"center",gap:"0.5rem",background:roleBadge(currentUser.role).bg,color:roleBadge(currentUser.role).color,padding:"0.4rem 1.2rem",borderRadius:"50px",fontSize:"0.8rem",fontWeight:700}}>
                {roleBadge(currentUser.role).label} အကောင့်
              </span>
              {currentUser.role==="free" && (
                <span style={{marginLeft:"0.75rem",fontSize:"0.78rem",color:"var(--muted)"}}>
                  Premium ကြည့်ရန် <span style={{color:"var(--gl)",cursor:"pointer"}} onClick={()=>setView("contact")}>→ Upgrade</span>
                </span>
              )}
            </div>
          )}
          <div className="sw"><span className="sic">🔍</span><input className="si2" placeholder="စာအုပ်ရှာဖွေပါ..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}/></div>
          <div className="fb-row">
            {([["all","အားလုံး"],["free","🆓 အခမဲ့"],["premium","👑 Premium"],["audiobook","🎧 Audio"]] as [string,string][]).map(([v,l])=>(
              <button key={v} className={`fb ${filter===v?"on":""}`} onClick={()=>setFilter(v)}>{l}</button>
            ))}
          </div>
          <div style={{textAlign:"center",marginBottom:"1.5rem",color:"var(--muted)",fontSize:"0.82rem"}}>{filteredBooks.length} ခု တွေ့ရှိသည်</div>
          <div className="bg2">
            {filteredBooks.map((book,i)=>(
              <BookCard key={book.id} book={book} onSelect={setSelectedBook} isAdmin={isAdmin} onEdit={b=>setAdminForm(b)} onDelete={handleDelete} delay={`${i*0.07}s`} access={canAccess(book,currentUser)}/>
            ))}
          </div>
        </div>
      )}

      {/* ── CATEGORIES ── */}
      {view==="categories" && (
        <div className="sec" style={{paddingTop:"7rem"}}>
          <div className="sh"><div className="eye">All Categories</div><h2 className="st">စာအုပ် အမျိုးအစားများ</h2><div className="gd"/></div>
          <div className="cg" style={{marginBottom:"4rem"}}>
            <div className="cc ccf" onClick={()=>{setView("library");setFilter("free");}}><span className="ci">📗</span><div className="cn">Free Ebooks</div><div className="cd">Login မလိုဘဲ ဖတ်နိုင်</div><div className="cc2">{books.filter(b=>b.category==="free").length}+</div></div>
            <div className="cc ccp" onClick={()=>{setView("library");setFilter("premium");}}><span className="ci">👑</span><div className="cn">Premium Ebooks</div><div className="cd">Premium Account လိုအပ်</div><div className="cc2">{books.filter(b=>b.category==="premium").length}+</div></div>
            <div className="cc cca" onClick={()=>{setView("library");setFilter("audiobook");}}><span className="ci">🎧</span><div className="cn">Audio Books</div><div className="cd">နားထောင်ရင်း သင်ယူပါ</div><div className="cc2">{books.filter(b=>b.type==="audiobook").length}+</div></div>
          </div>
          <div className="sh"><h2 className="st">ထိပ်တန်း Rating</h2><div className="gd"/></div>
          <div className="bg2">
            {books.filter(b=>b.rating>=4.8).map((book,i)=>(
              <BookCard key={book.id} book={book} onSelect={setSelectedBook} isAdmin={isAdmin} onEdit={b=>setAdminForm(b)} onDelete={handleDelete} delay={`${i*0.1}s`} access={canAccess(book,currentUser)}/>
            ))}
          </div>
        </div>
      )}

      {/* ── CONTACT / PAYMENT ── */}
      {view==="contact" && (
        <div style={{paddingTop:"68px"}}>
          <section className="sec" style={{paddingTop:"4rem"}}>
            <div className="sh"><div className="eye">Get in Touch</div><h2 className="st">ဆက်သွယ်ရန် & ငွေပေးချေမှု</h2><div className="gd"/></div>
          </section>

          <div className="contact-panel">
            <div className="contact-grid">
              {/* LEFT: Premium upgrade */}
              <div>
                <div className="premium-box">
                  <div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>👑</div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.4rem",fontWeight:700,marginBottom:"0.5rem"}}>Premium အကောင့်</div>
                  <div className="premium-price">{CONTACTS.premiumPrice}</div>
                  <ul className="premium-features">
                    <li>✅ Premium ebooks အားလုံး ဖတ်နိုင်</li>
                    <li>✅ Premium audio books အားလုံး နားထောင်နိုင်</li>
                    <li>✅ Free ebooks & audio books</li>
                    <li>✅ နောက်ထပ်ထည့်မည့် စာအုပ်အသစ်များ</li>
                    <li>✅ Download ရယူနိုင်</li>
                  </ul>
                  <div style={{fontSize:"0.85rem",color:"var(--muted)",marginBottom:"1.5rem"}}>
                    Premium ကို ရရှိရန် အောက်ပါ Telegram သို့မဟုတ် Viber မှ ဆက်သွယ်ပြီး ငွေပေးချေပါ။
                    ငွေပေးချေပြီးနောက် ၁-၂ နာရီ အတွင်း Premium activate ပေးမည်ဖြစ်သည်။
                  </div>
                  <div style={{display:"flex",gap:"0.75rem",flexWrap:"wrap"}}>
                    <a href={CONTACTS.telegramAdmin} target="_blank" rel="noreferrer" className="cta-btn tg-btn">✈️ Telegram မှ ဆက်သွယ်</a>
                    <a href={CONTACTS.viberAdmin} target="_blank" rel="noreferrer" className="cta-btn vb-btn">📱 Viber မှ ဆက်သွယ်</a>
                  </div>
                </div>
              </div>

              {/* RIGHT: Contact cards */}
              <div style={{display:"flex",flexDirection:"column",gap:"1.25rem"}}>
                <div className="contact-card">
                  <div className="contact-icon">✈️</div>
                  <div className="contact-title">Telegram</div>
                  <div className="contact-desc">Premium အဆင့်တင်ရန်၊ မေးခွန်းများ၊ ဆွေးနွေးရန် Telegram မှ ဆက်သွယ်ပါ။ မြန်ဆန်သော တုံ့ပြန်မှုကို ရရှိနိုင်သည်။</div>
                  <a href={CONTACTS.telegramAdmin} target="_blank" rel="noreferrer" className="cta-btn tg-btn">✈️ Telegram တွင် ဆက်သွယ်မည်</a>
                </div>

                <div className="contact-card">
                  <div className="contact-icon">📱</div>
                  <div className="contact-title">Viber</div>
                  <div className="contact-desc">Viber မှတဆင့်လည်း ဆက်သွယ်နိုင်ပါသည်။ ငွေပေးချေမှု လက်ခံသည်။</div>
                  <a href={CONTACTS.viberAdmin} target="_blank" rel="noreferrer" className="cta-btn vb-btn">📱 Viber တွင် ဆက်သွယ်မည်</a>
                </div>

                <div className="contact-card">
                  <div className="contact-icon">📢</div>
                  <div className="contact-title">ကျွန်တော်တို့ Channels</div>
                  <div className="contact-desc">သတင်းများ၊ စာအုပ်အသစ်များ၊ ပရိုမိုးရှင်းများ Follow လုပ်ပြီး ပထမဆုံး သိရှိပါ။</div>
                  <div className="channels-row">
                    <a href={CONTACTS.telegramChannel} target="_blank" rel="noreferrer" className="channel-btn">✈️ Telegram Channel</a>
                    <a href={CONTACTS.facebookPage} target="_blank" rel="noreferrer" className="channel-btn">📘 Facebook Page</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN BAR */}
      {isAdmin && (
        <div className="abar">
          <span className="al">🔓 Admin Mode</span>
          <button className="addb" onClick={()=>setAdminForm({id:0,title:"",author:"",category:"free",type:"ebook",cover:"📗",price:0,rating:4.5,reads:0,description:"",pages:0,lang:"မြန်မာဘာသာ",tag:"New",duration:"",fileId:""})}>
            + ထည့်မည်
          </button>
          {currentUser?.role==="free" && (
            <button style={{background:"var(--gl)",color:"var(--deep)",border:"none",cursor:"pointer",padding:"0.5rem 1rem",borderRadius:"50px",fontSize:"0.78rem",fontWeight:700}} onClick={grantPremium}>
              → Premium ပေးမည်
            </button>
          )}
          <button style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",color:"white",borderRadius:"50px",padding:"0.5rem 1rem",cursor:"pointer",fontSize:"0.78rem"}}
            onClick={()=>{setCurrentUser(null);localStorage.removeItem("yagan_user");showToast("Admin ထွက်ပြီး");}}>
            ✕ ထွက်
          </button>
        </div>
      )}

      {selectedBook && <BookModal book={selectedBook} onClose={()=>setSelectedBook(null)} access={canAccess(selectedBook,currentUser)} onLoginRequest={()=>{setSelectedBook(null);setShowUserLogin(true);}} onUpgrade={()=>{setSelectedBook(null);setView("contact");}}/>}
      {adminForm && <AdminForm form={adminForm} onChange={setAdminForm} onSave={handleSave} onClose={()=>setAdminForm(null)}/>}
      {toast && <div className="toast">{toast.msg}</div>}
    </div>
  </>);

  function setShowUserLogin(v: boolean) { /* handled inline */ }
}

// ── HELPERS ──────────────────────────────────────────────
function roleBadge(role: "free"|"premium"|"admin") {
  return { free:{label:"Free",color:"#4ECDC4",bg:"rgba(27,77,62,0.8)"}, premium:{label:"Premium 👑",color:"#F4D03F",bg:"rgba(77,60,15,0.8)"}, admin:{label:"Admin 🔓",color:"#F79DD7",bg:"rgba(77,27,47,0.8)"} }[role];
}
function getCover(b: Book){return b.type==="audiobook"?"ca":b.category==="premium"?"cp":"cf";}
function getTag(tag: string){const t=tag.toLowerCase();if(t.includes("free"))return"tf";if(t.includes("premium")||t==="popular"||t==="bestseller")return"tp";if(t.includes("audio"))return"ta";return"tn";}

function BookCard({book,onSelect,isAdmin,onEdit,onDelete,delay,access}:{book:Book;onSelect:(b:Book)=>void;isAdmin:boolean;onEdit:(b:Book)=>void;onDelete:(id:number)=>void;delay:string;access:boolean;}) {
  return (
    <div className="bc" style={{animationDelay:delay}} onClick={()=>onSelect(book)}>
      <div className={`bco ${getCover(book)}`}>
        {book.cover}
        {!access && <div className="lo">🔒</div>}
        <span className={`btag ${getTag(book.tag)}`}>{book.tag}</span>
      </div>
      <div className="bi">
        <div className="bt">{book.title}</div>
        <div className="bau">{book.author}</div>
        <div className="bm">
          <div className={`bpr ${book.price===0?"fr":""}`}>{book.price===0?"🆓 အခမဲ့":`${book.price.toLocaleString()} ကျပ်`}</div>
          <div className="bra">⭐{book.rating}·{(book.reads/1000).toFixed(1)}k</div>
        </div>
      </div>
      {isAdmin && (<div className="aa" onClick={e=>e.stopPropagation()}>
        <button className="ab eb" onClick={()=>onEdit(book)}>✏️ ပြင်</button>
        <button className="ab db" onClick={()=>{if(window.confirm("ဖျက်မလား?"))onDelete(book.id);}}>🗑️ ဖျက်</button>
      </div>)}
    </div>
  );
}

function BookModal({book,onClose,access,onLoginRequest,onUpgrade}:{book:Book;onClose:()=>void;access:boolean;onLoginRequest:()=>void;onUpgrade:()=>void;}) {
  return (
    <div className="ov" onClick={onClose}>
      <div className="mod" onClick={e=>e.stopPropagation()}>
        <div className="mh">{book.cover}<button className="mc" onClick={onClose}>✕</button></div>
        <div className="mb">
          <div className="mt">{book.title}</div>
          <div className="mau">✍️ {book.author}</div>
          <div className="mtags">
            <span className="mtag">{book.type==="audiobook"?"🎧 Audio":"📖 Ebook"}</span>
            <span className="mtag">{book.category==="free"?"🆓 Free":"👑 Premium"}</span>
            <span className="mtag">🌐 {book.lang}</span>
          </div>
          <div className="mdes">{book.description}</div>
          <div className="ms">
            <div className="msi"><div className="msv">⭐{book.rating}</div><div className="msl">Rating</div></div>
            <div className="msi"><div className="msv">{(book.reads/1000).toFixed(1)}k</div><div className="msl">ဖတ်ပြီး</div></div>
            <div className="msi"><div className="msv">{book.pages?`${book.pages}`:book.duration||"-"}</div><div className="msl">{book.pages?"စာမျက်နှာ":"ကြာချိန်"}</div></div>
          </div>
          {access ? (<>
            {book.type==="audiobook"&&book.fileId&&(<audio controls className="ap"><source src={`https://drive.google.com/uc?export=download&id=${book.fileId}`} type="audio/mpeg"/></audio>)}
            {book.type==="ebook"&&book.fileId&&(<iframe src={`https://drive.google.com/file/d/${book.fileId}/preview`} width="100%" height="380px" style={{borderRadius:"12px",border:"none",marginBottom:"1rem"}}/>)}
            <button className={`bg3 ${book.price===0?"bgf":"bgp"}`} onClick={()=>{if(book.fileId)window.open(`https://drive.google.com/file/d/${book.fileId}/view`,"_blank");}}>
              {book.price===0?(book.type==="audiobook"?"🎧 နားထောင်မည်":"📖 ဖတ်မည்"):`👑 ဝယ်ယူမည် — ${book.price.toLocaleString()} ကျပ်`}
            </button>
          </>) : book.category==="premium" ? (
            <div className="lkbox">
              <div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>👑</div>
              <div style={{color:"var(--gl)",marginBottom:"1rem",fontSize:"0.9rem",fontWeight:700}}>Premium စာအုပ် ဖြစ်သောကြောင့် Premium Account လိုအပ်ပါသည်</div>
              <div style={{color:"var(--muted)",fontSize:"0.82rem",marginBottom:"1.25rem"}}>Premium account ရရှိရန် Telegram / Viber မှ ဆက်သွယ်ပြီး ငွေပေးချေပါ</div>
              <div style={{display:"flex",gap:"0.75rem",justifyContent:"center",flexWrap:"wrap"}}>
                <button className="bg3 bgp" style={{marginTop:0}} onClick={onUpgrade}>👑 Premium အဆင့်တင်မည်</button>
                <button className="bg3 bgf" style={{marginTop:0}} onClick={onLoginRequest}>👤 ဝင်ရောက်မည်</button>
              </div>
            </div>
          ) : (
            <div className="lkbox">
              <div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>🔒</div>
              <div style={{color:"#F99",marginBottom:"1rem",fontSize:"0.88rem"}}>ဤစာအုပ်ကို ဖတ်ရန် အကောင့်ဝင်ရောက်ပါ</div>
              <button className="bg3 bgp" style={{marginTop:0}} onClick={onLoginRequest}>👤 ဝင်ရောက် / မှတ်ပုံတင်မည်</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminForm({form,onChange,onSave,onClose}:{form:Book;onChange:(b:Book)=>void;onSave:(b:Book)=>void;onClose:()=>void;}) {
  const set=(k:keyof Book,v:string|number)=>onChange({...form,[k]:v});
  return (
    <div className="afo" onClick={onClose}>
      <div className="af" onClick={e=>e.stopPropagation()}>
        <div className="afh"><div className="aft">{form.id?"✏️ ပြင်မည်":"➕ အသစ်ထည့်မည်"}</div><button className="mc" style={{position:"relative",top:0,right:0}} onClick={onClose}>✕</button></div>
        <div className="afb">
          <div className="fg"><label className="fl">📚 စာအုပ်အမည်</label><input className="fi" value={form.title} onChange={e=>set("title",e.target.value)} placeholder="စာအုပ်အမည်..."/></div>
          <div className="fr2">
            <div className="fg"><label className="fl">✍️ စာရေးဆရာ</label><input className="fi" value={form.author} onChange={e=>set("author",e.target.value)}/></div>
            <div className="fg"><label className="fl">🎭 Cover Emoji</label><input className="fi" value={form.cover} onChange={e=>set("cover",e.target.value)}/></div>
          </div>
          <div className="fr2">
            <div className="fg"><label className="fl">📂 အမျိုးအစား</label>
              <select className="fs" value={form.category} onChange={e=>set("category",e.target.value)}><option value="free">Free</option><option value="premium">Premium</option></select>
            </div>
            <div className="fg"><label className="fl">🎵 ပုံစံ</label>
              <select className="fs" value={form.type} onChange={e=>set("type",e.target.value)}><option value="ebook">Ebook</option><option value="audiobook">Audiobook</option></select>
            </div>
          </div>
          <div className="fr2">
            <div className="fg"><label className="fl">💰 စျေးနှုန်း (ကျပ်)</label><input className="fi" type="number" value={form.price} onChange={e=>set("price",+e.target.value)}/></div>
            <div className="fg"><label className="fl">🏷️ Tag</label><input className="fi" value={form.tag} onChange={e=>set("tag",e.target.value)}/></div>
          </div>
          {form.type==="ebook"
            ?<div className="fg"><label className="fl">📄 စာမျက်နှာ</label><input className="fi" type="number" value={form.pages||0} onChange={e=>set("pages",+e.target.value)}/></div>
            :<div className="fg"><label className="fl">⏱️ ကြာချိန်</label><input className="fi" value={form.duration||""} onChange={e=>set("duration",e.target.value)} placeholder="8 နာရီ 30 မိနစ်"/></div>
          }
          <div className="fg">
            <label className="fl">🔗 Google Drive File ID</label>
            <input className="fi" value={form.fileId||""} onChange={e=>set("fileId",e.target.value)} placeholder="1BxiMVs0XRA5nFMdKvBdBZjgm..."/>
            <span className="hint">Drive link မှ /d/ နှင့် /view ကြားက code ကူးပါ</span>
          </div>
          <div className="fg"><label className="fl">📝 ဖော်ပြချက်</label><textarea className="ft" value={form.description} onChange={e=>set("description",e.target.value)}/></div>
          <button className="fsub" onClick={()=>{if(form.title&&form.author)onSave(form);}}>{form.id?"💾 မှတ်သားမည်":"✨ ထည့်မည်"}</button>
        </div>
      </div>
    </div>
  );
}
