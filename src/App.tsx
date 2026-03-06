import { useState, useEffect } from "react";

// ============================================
// ⚙️ ADMIN CONFIG — Change password here only
// ============================================
const ADMIN_PASSWORD = "YaganBooks@2025"; // 👈 Change this anytime

interface Book {
  id: number; title: string; author: string; category: string; type: string;
  cover: string; price: number; rating: number; reads: number; description: string;
  pages?: number; duration?: string; lang: string; tag: string; fileId?: string;
}
interface User { name: string; email: string; avatar: string; }
interface Toast { msg: string; type: string; }

const INITIAL_BOOKS: Book[] = [
  { id:1, title:"အောင်မြင်သူများ၏ အလေ့အကျင့်", author:"Stephen Covey", category:"free", type:"ebook", cover:"📗", price:0, rating:4.8, reads:12400, description:"အောင်မြင်သူများ၏ အဓိကအလေ့အကျင့် ၇ ခုကို လေ့လာပါ။ ဘဝတွင် အောင်မြင်ရန် လမ်းညွှန်ချက်တစ်ခု။", pages:320, lang:"မြန်မာဘာသာ", tag:"Bestseller", fileId:"" },
  { id:2, title:"ငွေကြေးဉာဏ်ပညာ", author:"Robert Kiyosaki", category:"premium", type:"ebook", cover:"📘", price:3500, rating:4.9, reads:9800, description:"ချမ်းသာကြွယ်ဝမှုဆီသို့ ဦးတည်သော ငွေကြေးစီမံခန့်ခွဲမှု လမ်းညွှန်ချက်။", pages:280, lang:"မြန်မာဘာသာ", tag:"Popular", fileId:"" },
  { id:3, title:"စိတ်ဓာတ်ခွန်အား", author:"Norman Peale", category:"free", type:"ebook", cover:"📙", price:0, rating:4.7, reads:15600, description:"အပြုသဘောဆောင်သောစိတ်ဓာတ်ဖြင့် ဘဝကို ပြောင်းလဲပါ။", pages:240, lang:"မြန်မာဘာသာ", tag:"Free", fileId:"" },
  { id:4, title:"အိပ်မက်ကို လိုက်နာပါ", author:"Paulo Coelho", category:"premium", type:"ebook", cover:"📕", price:2500, rating:4.6, reads:7200, description:"ကိုယ်ပိုင်ဒဏ္ဍာရီကို ရှာဖွေခြင်းနှင့် ဘဝ၏ စစ်မှန်သောအဓိပ္ပါယ်ကို ရှာဖွေပါ။", pages:180, lang:"မြန်မာဘာသာ", tag:"New", fileId:"" },
  { id:5, title:"အောင်မြင်သောခေါင်းဆောင်ပုံစံ", author:"John Maxwell", category:"free", type:"audiobook", cover:"🎧", price:0, rating:4.9, reads:6800, description:"ခေါင်းဆောင်မှုစွမ်းရည်ကို မြှင့်တင်ရန် audio သင်ခန်းစာများ။", duration:"8 နာရီ 30 မိနစ်", lang:"မြန်မာဘာသာ", tag:"Audio", fileId:"" },
  { id:6, title:"Atomic Habits မြန်မာဘာသာ", author:"James Clear", category:"premium", type:"audiobook", cover:"🎙️", price:4500, rating:5.0, reads:11200, description:"ထူးခြားသောကောင်းသောအလေ့အကျင့်များ တည်ဆောက်ရန် လမ်းညွှန်ချက်အပြည့်အစုံ။", duration:"11 နာရီ 15 မိနစ်", lang:"မြန်မာဘာသာ", tag:"Premium", fileId:"" },
  { id:7, title:"ဆန်းသစ်တီထွင်ခြင်း", author:"Walter Isaacson", category:"premium", type:"ebook", cover:"💡", price:3000, rating:4.7, reads:5400, description:"Steve Jobs ၏ ဆန်းသစ်တီထွင်သောနည်းလမ်းများ၊ ယနေ့ကမ္ဘာကို ပြောင်းလဲပုံ။", pages:350, lang:"မြန်မာဘာသာ", tag:"Trending", fileId:"" },
  { id:8, title:"ဘဝတွင် ရပ်တည်ပါ", author:"Brené Brown", category:"free", type:"audiobook", cover:"🌟", price:0, rating:4.8, reads:8900, description:"ကြောက်ရွံ့မှုကို ကျော်ဖြတ်ကာ ရဲရင့်သောဘဝကို ရှင်သန်ပါ။", duration:"6 နာရီ 45 မိနစ်", lang:"မြန်မာဘာသာ", tag:"Free Audio", fileId:"" },
];

export default function App() {
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [view, setView] = useState("home");
  const [filter, setFilter] = useState("all");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [adminMode, setAdminMode] = useState(false);
  const [adminForm, setAdminForm] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [particles] = useState(() => Array.from({length:18},(_,i)=>({id:i,left:`${Math.random()*100}%`,top:`${Math.random()*100}%`,size:`${Math.random()*8+4}px`,delay:`${Math.random()*6}s`,duration:`${Math.random()*8+6}s`,opacity:Math.random()*0.4+0.1})));
  const [toast, setToast] = useState<Toast|null>(null);
  const [heroAnim, setHeroAnim] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [passError, setPassError] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState<User|null>(null);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [userForm, setUserForm] = useState({name:"",email:"",password:""});
  const [authMode, setAuthMode] = useState<"login"|"register">("login");
  const [userError, setUserError] = useState("");
  const [logoClicks, setLogoClicks] = useState(0);
  const [logoTimer, setLogoTimer] = useState<ReturnType<typeof setTimeout>|null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(()=>{
    setTimeout(()=>setHeroAnim(true),100);
    const saved = localStorage.getItem("yaganUser");
    if(saved) setCurrentUser(JSON.parse(saved));
  },[]);

  const handleLogoClick = () => {
    const n = logoClicks+1; setLogoClicks(n);
    if(logoTimer) clearTimeout(logoTimer);
    if(n>=5){ setLogoClicks(0); setShowAdminLogin(true); }
    else { const t=setTimeout(()=>setLogoClicks(0),2000); setLogoTimer(t); }
  };

  const showToast=(msg:string,type="success")=>{ setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const filteredBooks = books.filter(b=>{
    const mf=filter==="all"||b.category===filter||(filter==="audiobook"&&b.type==="audiobook");
    const ms=!searchQuery||b.title.includes(searchQuery)||b.author.includes(searchQuery);
    return mf&&ms;
  });

  const handleDelete=(id:number)=>{ setBooks(books.filter(b=>b.id!==id)); showToast("ဖျက်ပြီး ✓"); };
  const handleSave=(book:Book)=>{
    if(book.id&&books.find(b=>b.id===book.id)){ setBooks(books.map(b=>b.id===book.id?book:b)); showToast("ပြင်ပြီး ✓"); }
    else { setBooks([...books,{...book,id:Date.now(),reads:0,rating:4.5}]); showToast("ထည့်ပြီး ✓"); }
    setAdminForm(null);
  };

  const loginAs=(name:string,email:string)=>{
    const u:User={name,email,avatar:name[0].toUpperCase()};
    setCurrentUser(u); localStorage.setItem("yaganUser",JSON.stringify(u));
    setShowUserLogin(false); showToast(`ကြိုဆိုပါသည် ${name}! ✓`);
  };

  const handleUserAuth=()=>{
    if(authMode==="register"&&!userForm.name){setUserError("နာမည်ထည့်ပါ");return;}
    if(!userForm.email){setUserError("Email ထည့်ပါ");return;}
    if(!userForm.password){setUserError("Password ထည့်ပါ");return;}
    loginAs(authMode==="register"?userForm.name:userForm.email.split("@")[0],userForm.email);
    setUserForm({name:"",email:"",password:""});setUserError("");
  };

  const handleLogout=()=>{ setCurrentUser(null); localStorage.removeItem("yaganUser"); setShowUserMenu(false); showToast("ထွက်ပြီး ✓"); };
  const canAccess=(book:Book)=>book.price===0||currentUser!==null;
  const stats={total:books.length,free:books.filter(b=>b.category==="free").length,premium:books.filter(b=>b.category==="premium").length,audio:books.filter(b=>b.type==="audiobook").length};

  return (<>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Noto+Sans+Myanmar:wght@300;400;600;700&family=Cinzel:wght@400;700;900&display=swap');
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
      :root{--gold:#D4AF37;--gold-light:#F4D03F;--gold-dark:#A0840A;--ruby:#8B1A1A;--ruby-light:#B22222;--deep:#0A0408;--panel:#1A1018;--card:#1E1320;--border:rgba(212,175,55,0.25);--text:#F5EDD8;--muted:#9A8870;--sapphire:#1B2F4D;--glow:rgba(212,175,55,0.15);}
      body{background:var(--deep);color:var(--text);font-family:'Noto Sans Myanmar',sans-serif;overflow-x:hidden;}
      .site-bg{min-height:100vh;background:radial-gradient(ellipse at 20% 0%,#2D1B10 0%,transparent 50%),radial-gradient(ellipse at 80% 0%,#1A0D2E 0%,transparent 50%),radial-gradient(ellipse at 50% 100%,#0D1B10 0%,transparent 50%),var(--deep);position:relative;}
      .particle{position:fixed;border-radius:50%;background:var(--gold);pointer-events:none;z-index:0;animation:floatP 10s ease-in-out infinite alternate;}
      @keyframes floatP{0%{transform:translateY(0) rotate(0deg);}100%{transform:translateY(-60px) rotate(360deg);}}
      .nav{position:fixed;top:0;left:0;right:0;z-index:100;background:linear-gradient(180deg,rgba(10,4,8,0.97) 0%,rgba(10,4,8,0.85) 100%);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);padding:0 2rem;display:flex;align-items:center;justify-content:space-between;height:68px;}
      .nav-logo{font-family:'Cinzel',serif;font-size:1.4rem;font-weight:900;background:linear-gradient(135deg,var(--gold-light),var(--gold),var(--gold-dark));-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:2px;cursor:pointer;user-select:none;}
      .nav-logo span{font-family:'Noto Sans Myanmar',sans-serif;font-size:0.75rem;display:block;color:var(--muted);-webkit-text-fill-color:var(--muted);}
      .nav-links{display:flex;gap:0.25rem;align-items:center;}
      .nav-btn{background:none;border:none;color:var(--muted);cursor:pointer;padding:0.5rem 1rem;border-radius:8px;font-family:'Noto Sans Myanmar',sans-serif;font-size:0.85rem;transition:all 0.25s;position:relative;}
      .nav-btn:hover,.nav-btn.active{color:var(--gold);background:var(--glow);}
      .nav-btn.active::after{content:'';position:absolute;bottom:2px;left:50%;transform:translateX(-50%);width:20px;height:2px;background:var(--gold);border-radius:2px;}
      .login-btn{background:linear-gradient(135deg,var(--gold-dark),var(--gold));color:var(--deep);border:none;cursor:pointer;padding:0.45rem 1.2rem;border-radius:20px;font-size:0.78rem;font-family:'Noto Sans Myanmar',sans-serif;font-weight:700;transition:all 0.25s;}
      .login-btn:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(212,175,55,0.4);}
      .user-wrap{position:relative;}
      .user-avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--gold-dark),var(--gold));color:var(--deep);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:0.9rem;cursor:pointer;border:2px solid var(--gold);transition:all 0.25s;}
      .user-avatar:hover{transform:scale(1.1);box-shadow:0 0 12px rgba(212,175,55,0.4);}
      .user-dropdown{position:absolute;top:calc(100% + 0.5rem);right:0;background:var(--panel);border:1px solid var(--border);border-radius:16px;padding:0.5rem;min-width:180px;z-index:200;animation:slideUp 0.2s ease;}
      .u-item{padding:0.6rem 1rem;border-radius:8px;cursor:pointer;font-size:0.82rem;color:var(--muted);transition:all 0.2s;display:flex;align-items:center;gap:0.5rem;}
      .u-item:hover{background:var(--glow);color:var(--gold);}
      .hero{min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:6rem 2rem 4rem;position:relative;overflow:hidden;}
      .hero-ornament{position:absolute;font-size:12rem;opacity:0.03;font-family:'Cinzel',serif;font-weight:900;color:var(--gold);pointer-events:none;user-select:none;animation:pulse 6s ease-in-out infinite;}
      @keyframes pulse{0%,100%{opacity:0.03;transform:scale(1);}50%{opacity:0.06;transform:scale(1.02);}}
      .hero-badge{display:inline-flex;align-items:center;gap:0.5rem;background:linear-gradient(135deg,rgba(212,175,55,0.15),rgba(212,175,55,0.05));border:1px solid var(--border);border-radius:50px;padding:0.4rem 1.2rem;font-size:0.78rem;color:var(--gold);margin-bottom:2rem;opacity:0;transform:translateY(20px);transition:all 0.8s ease 0.2s;}
      .hero-badge.show{opacity:1;transform:translateY(0);}
      .hero-title{font-family:'Playfair Display',serif;font-size:clamp(2.8rem,7vw,5.5rem);font-weight:900;line-height:1.1;margin-bottom:1rem;opacity:0;transform:translateY(30px);transition:all 0.9s ease 0.4s;}
      .hero-title.show{opacity:1;transform:translateY(0);}
      .hero-title .gold{background:linear-gradient(135deg,var(--gold-light),var(--gold),var(--gold-dark));-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
      .hero-sub{font-size:1.05rem;color:var(--muted);max-width:580px;margin:0 auto 2.5rem;line-height:1.9;opacity:0;transform:translateY(20px);transition:all 0.9s ease 0.6s;}
      .hero-sub.show{opacity:1;transform:translateY(0);}
      .hero-actions{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;opacity:0;transform:translateY(20px);transition:all 0.9s ease 0.8s;}
      .hero-actions.show{opacity:1;transform:translateY(0);}
      .btn-primary{background:linear-gradient(135deg,var(--gold-dark),var(--gold),var(--gold-light));color:var(--deep);border:none;cursor:pointer;padding:0.85rem 2.2rem;border-radius:50px;font-family:'Noto Sans Myanmar',sans-serif;font-size:0.95rem;font-weight:700;transition:all 0.3s;box-shadow:0 4px 20px rgba(212,175,55,0.35);}
      .btn-primary:hover{transform:translateY(-3px);box-shadow:0 8px 30px rgba(212,175,55,0.55);}
      .btn-outline{background:transparent;color:var(--gold);cursor:pointer;padding:0.85rem 2.2rem;border-radius:50px;border:1.5px solid var(--gold);font-family:'Noto Sans Myanmar',sans-serif;font-size:0.95rem;transition:all 0.3s;}
      .btn-outline:hover{background:var(--glow);transform:translateY(-3px);}
      .stats-bar{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--border);border-top:1px solid var(--border);border-bottom:1px solid var(--border);position:relative;z-index:1;}
      .stat-item{background:rgba(26,16,24,0.9);padding:2rem;text-align:center;transition:all 0.3s;}
      .stat-item:hover{background:rgba(212,175,55,0.06);}
      .stat-num{font-family:'Cinzel',serif;font-size:2.2rem;font-weight:900;color:var(--gold);}
      .stat-label{font-size:0.78rem;color:var(--muted);margin-top:0.25rem;}
      .section{padding:5rem 2rem;max-width:1300px;margin:0 auto;position:relative;z-index:1;}
      .section-header{text-align:center;margin-bottom:3rem;}
      .section-eyebrow{font-family:'Cinzel',serif;font-size:0.7rem;letter-spacing:4px;color:var(--gold);text-transform:uppercase;margin-bottom:0.75rem;}
      .section-title{font-family:'Playfair Display',serif;font-size:clamp(1.8rem,4vw,2.8rem);font-weight:700;line-height:1.2;}
      .filter-bar{display:flex;gap:0.5rem;justify-content:center;margin-bottom:2.5rem;flex-wrap:wrap;}
      .filter-btn{background:transparent;border:1px solid var(--border);color:var(--muted);padding:0.5rem 1.3rem;border-radius:50px;cursor:pointer;font-family:'Noto Sans Myanmar',sans-serif;font-size:0.82rem;transition:all 0.25s;}
      .filter-btn:hover{border-color:var(--gold);color:var(--gold);background:var(--glow);}
      .filter-btn.active{background:linear-gradient(135deg,var(--gold-dark),var(--gold));color:var(--deep);border-color:transparent;font-weight:700;}
      .search-wrap{max-width:420px;margin:0 auto 2rem;position:relative;}
      .search-input{width:100%;background:rgba(30,19,32,0.8);border:1px solid var(--border);color:var(--text);padding:0.75rem 1rem 0.75rem 2.8rem;border-radius:50px;font-family:'Noto Sans Myanmar',sans-serif;font-size:0.88rem;outline:none;transition:border-color 0.25s;}
      .search-input::placeholder{color:var(--muted);}
      .search-input:focus{border-color:var(--gold);box-shadow:0 0 0 3px var(--glow);}
      .search-icon{position:absolute;left:1rem;top:50%;transform:translateY(-50%);color:var(--muted);}
      .books-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1.5rem;}
      .book-card{background:linear-gradient(145deg,var(--card),var(--panel));border:1px solid var(--border);border-radius:16px;overflow:hidden;cursor:pointer;transition:all 0.35s cubic-bezier(0.34,1.56,0.64,1);position:relative;animation:fadeUp 0.5s ease both;}
      @keyframes fadeUp{from{opacity:0;transform:translateY(30px);}to{opacity:1;transform:translateY(0);}}
      .book-card:hover{transform:translateY(-10px) scale(1.02);border-color:var(--gold);box-shadow:0 20px 60px rgba(0,0,0,0.5),0 0 30px rgba(212,175,55,0.12);}
      .book-cover{height:180px;display:flex;align-items:center;justify-content:center;font-size:5rem;position:relative;overflow:hidden;}
      .book-cover::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(212,175,55,0.08),transparent 60%,rgba(139,26,26,0.08));}
      .book-cover-free{background:linear-gradient(135deg,#1B4D3E,#0D2E22);}
      .book-cover-premium{background:linear-gradient(135deg,#1B2F4D,#0D1B2E);}
      .book-cover-audio{background:linear-gradient(135deg,#4D1B2F,#2E0D1B);}
      .book-tag{position:absolute;top:0.75rem;right:0.75rem;font-size:0.65rem;font-weight:700;padding:0.25rem 0.7rem;border-radius:50px;letter-spacing:0.5px;}
      .tag-free{background:rgba(27,77,62,0.9);color:#4ECDC4;border:1px solid rgba(78,205,196,0.3);}
      .tag-premium{background:rgba(27,47,77,0.9);color:#7EB8F7;border:1px solid rgba(126,184,247,0.3);}
      .tag-audio{background:rgba(77,27,47,0.9);color:#F79DD7;border:1px solid rgba(247,157,215,0.3);}
      .tag-new{background:rgba(77,60,15,0.9);color:var(--gold-light);border:1px solid rgba(212,175,55,0.3);}
      .lock-overlay{position:absolute;inset:0;background:rgba(10,4,8,0.55);display:flex;align-items:center;justify-content:center;font-size:2rem;backdrop-filter:blur(2px);}
      .book-info{padding:1.2rem;}
      .book-title{font-weight:700;font-size:0.92rem;margin-bottom:0.3rem;line-height:1.5;}
      .book-author{font-size:0.78rem;color:var(--muted);margin-bottom:0.75rem;}
      .book-meta{display:flex;align-items:center;justify-content:space-between;}
      .book-price{font-family:'Cinzel',serif;font-weight:700;font-size:0.95rem;color:var(--gold);}
      .book-price.free{color:#4ECDC4;}
      .book-rating{font-size:0.75rem;color:var(--muted);}
      .admin-actions{display:flex;gap:0.5rem;padding:0 1.2rem 1.2rem;opacity:0;transition:opacity 0.25s;}
      .book-card:hover .admin-actions{opacity:1;}
      .admin-btn{flex:1;padding:0.4rem;border-radius:8px;border:1px solid;cursor:pointer;font-size:0.75rem;font-family:'Noto Sans Myanmar',sans-serif;transition:all 0.2s;}
      .edit-btn{background:rgba(212,175,55,0.1);border-color:rgba(212,175,55,0.3);color:var(--gold);}
      .del-btn{background:rgba(178,34,34,0.1);border-color:rgba(178,34,34,0.3);color:#F77;}
      .featured-band{background:linear-gradient(135deg,rgba(27,47,77,0.6),rgba(77,27,47,0.4));border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:4rem 2rem;position:relative;overflow:hidden;z-index:1;}
      .featured-band::before{content:'';position:absolute;top:-50%;left:-50%;width:200%;height:200%;background:radial-gradient(ellipse at center,rgba(212,175,55,0.04) 0%,transparent 60%);animation:rotateBg 30s linear infinite;}
      @keyframes rotateBg{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      .featured-inner{max-width:1300px;margin:0 auto;}
      .featured-book{display:grid;grid-template-columns:1fr 2fr;gap:3rem;align-items:center;}
      .featured-cover{aspect-ratio:3/4;max-width:240px;margin:0 auto;background:linear-gradient(135deg,var(--sapphire),var(--deep));border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:8rem;border:2px solid var(--border);box-shadow:20px 20px 60px rgba(0,0,0,0.6);animation:bookFloat 4s ease-in-out infinite;}
      @keyframes bookFloat{0%,100%{transform:translateY(0) rotate(-1deg);}50%{transform:translateY(-12px) rotate(1deg);}}
      .featured-badge{display:inline-flex;align-items:center;gap:0.5rem;background:linear-gradient(135deg,var(--gold-dark),var(--gold));color:var(--deep);padding:0.35rem 1rem;border-radius:50px;font-size:0.72rem;font-weight:700;margin-bottom:1rem;}
      .featured-title{font-family:'Playfair Display',serif;font-size:2.2rem;font-weight:900;line-height:1.2;margin-bottom:0.75rem;}
      .featured-desc{color:var(--muted);line-height:1.9;font-size:0.9rem;margin-bottom:2rem;}
      .cat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;}
      .cat-card{border-radius:20px;padding:2.5rem 2rem;text-align:center;cursor:pointer;transition:all 0.35s;border:1px solid transparent;position:relative;overflow:hidden;}
      .cat-card::before{content:'';position:absolute;inset:0;opacity:0;transition:opacity 0.35s;background:radial-gradient(ellipse at 50% 0%,rgba(212,175,55,0.15) 0%,transparent 70%);}
      .cat-card:hover::before{opacity:1;}
      .cat-card:hover{transform:translateY(-8px);border-color:var(--border);}
      .cat-free{background:linear-gradient(135deg,rgba(27,77,62,0.4),rgba(27,77,62,0.15));}
      .cat-premium{background:linear-gradient(135deg,rgba(27,47,77,0.4),rgba(27,47,77,0.15));}
      .cat-audio{background:linear-gradient(135deg,rgba(77,27,47,0.4),rgba(77,27,47,0.15));}
      .cat-icon{font-size:3rem;margin-bottom:1rem;display:block;}
      .cat-name{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:700;margin-bottom:0.5rem;}
      .cat-desc{font-size:0.83rem;color:var(--muted);line-height:1.7;}
      .cat-count{font-family:'Cinzel',serif;font-size:1.8rem;font-weight:900;color:var(--gold);margin-top:1rem;}
      .overlay{position:fixed;inset:0;background:rgba(0,0,0,0.88);backdrop-filter:blur(14px);z-index:200;display:flex;align-items:center;justify-content:center;padding:2rem;animation:fadeIn 0.25s ease;}
      @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      .modal{background:var(--panel);border:1px solid var(--border);border-radius:24px;max-width:700px;width:100%;max-height:90vh;overflow-y:auto;animation:slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1);}
      @keyframes slideUp{from{opacity:0;transform:translateY(40px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}
      .modal-hero{height:240px;display:flex;align-items:center;justify-content:center;font-size:9rem;position:relative;background:linear-gradient(135deg,var(--deep),var(--sapphire),#120C10);border-radius:24px 24px 0 0;}
      .modal-close{position:absolute;top:1rem;right:1rem;background:rgba(0,0,0,0.5);border:1px solid var(--border);color:var(--text);width:36px;height:36px;border-radius:50%;cursor:pointer;font-size:1.1rem;display:flex;align-items:center;justify-content:center;transition:all 0.2s;}
      .modal-close:hover{background:rgba(212,175,55,0.2);color:var(--gold);}
      .modal-body{padding:2rem;}
      .modal-title{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:900;margin-bottom:0.4rem;}
      .modal-author{color:var(--muted);font-size:0.9rem;margin-bottom:1.2rem;}
      .modal-tags{display:flex;gap:0.5rem;margin-bottom:1.5rem;flex-wrap:wrap;}
      .modal-tag{padding:0.3rem 0.8rem;border-radius:50px;font-size:0.75rem;border:1px solid var(--border);color:var(--muted);}
      .modal-desc{color:var(--muted);line-height:2;font-size:0.9rem;margin-bottom:2rem;}
      .modal-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--border);border-radius:12px;overflow:hidden;margin-bottom:1.5rem;}
      .modal-stat{background:var(--card);padding:1rem;text-align:center;}
      .modal-stat-val{font-family:'Cinzel',serif;font-size:1.1rem;font-weight:700;color:var(--gold);}
      .modal-stat-label{font-size:0.72rem;color:var(--muted);margin-top:0.2rem;}
      .btn-get{width:100%;padding:1rem;border-radius:12px;border:none;cursor:pointer;font-family:'Noto Sans Myanmar',sans-serif;font-size:1rem;font-weight:700;transition:all 0.3s;margin-top:0.75rem;}
      .btn-get-free{background:linear-gradient(135deg,#1B4D3E,#2E7D5E);color:#A7F3D0;}
      .btn-get-premium{background:linear-gradient(135deg,var(--gold-dark),var(--gold),var(--gold-light));color:var(--deep);}
      .btn-get-free:hover,.btn-get-premium:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.4);}
      .audio-player{width:100%;margin-bottom:1rem;border-radius:8px;accent-color:var(--gold);}
      .lock-box{text-align:center;padding:1.5rem;background:rgba(139,26,26,0.12);border-radius:12px;border:1px solid rgba(255,100,100,0.2);margin-bottom:1rem;}
      .aform-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.92);backdrop-filter:blur(16px);z-index:300;display:flex;align-items:center;justify-content:center;padding:2rem;animation:fadeIn 0.25s ease;}
      .aform{background:var(--panel);border:1px solid var(--gold);border-radius:24px;max-width:560px;width:100%;max-height:90vh;overflow-y:auto;animation:slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1);}
      .form-header{padding:1.5rem 2rem;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;}
      .form-title{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:700;color:var(--gold);}
      .form-body{padding:2rem;display:flex;flex-direction:column;gap:1.25rem;}
      .form-group{display:flex;flex-direction:column;gap:0.5rem;}
      .form-label{font-size:0.8rem;color:var(--muted);font-weight:600;letter-spacing:0.5px;}
      .fi,.fs,.ft{background:rgba(30,19,32,0.8);border:1px solid var(--border);color:var(--text);padding:0.75rem 1rem;border-radius:10px;font-family:'Noto Sans Myanmar',sans-serif;font-size:0.88rem;outline:none;transition:border-color 0.25s;width:100%;}
      .fi:focus,.fs:focus,.ft:focus{border-color:var(--gold);box-shadow:0 0 0 3px var(--glow);}
      .ft{resize:vertical;min-height:100px;}
      .fs option{background:var(--panel);}
      .form-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem;}
      .form-submit{background:linear-gradient(135deg,var(--gold-dark),var(--gold),var(--gold-light));color:var(--deep);border:none;cursor:pointer;padding:0.85rem;border-radius:12px;font-weight:700;font-family:'Noto Sans Myanmar',sans-serif;font-size:0.95rem;transition:all 0.3s;}
      .form-submit:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(212,175,55,0.4);}
      .admin-bar{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,rgba(139,26,26,0.95),rgba(178,34,34,0.9));border:1px solid rgba(255,100,100,0.3);border-radius:50px;padding:0.75rem 1.5rem;z-index:50;display:flex;gap:1rem;align-items:center;box-shadow:0 8px 40px rgba(139,26,26,0.6);backdrop-filter:blur(12px);animation:slideUp 0.4s ease;}
      .admin-bar-label{font-size:0.78rem;color:rgba(255,200,200,0.9);font-weight:600;}
      .add-btn{background:white;color:var(--ruby);border:none;cursor:pointer;padding:0.5rem 1.2rem;border-radius:50px;font-size:0.82rem;font-weight:700;font-family:'Noto Sans Myanmar',sans-serif;transition:all 0.25s;}
      .add-btn:hover{background:var(--gold-light);transform:scale(1.05);}
      .toast{position:fixed;bottom:6rem;left:50%;transform:translateX(-50%);background:rgba(27,77,62,0.95);border:1px solid rgba(78,205,196,0.4);color:#A7F3D0;padding:0.75rem 1.5rem;border-radius:50px;font-size:0.85rem;z-index:999;backdrop-filter:blur(12px);animation:toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1);white-space:nowrap;}
      @keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(20px) scale(0.9)}to{opacity:1;transform:translateX(-50%) translateY(0) scale(1)}}
      .footer{background:linear-gradient(180deg,transparent,rgba(10,4,8,0.98));border-top:1px solid var(--border);padding:4rem 2rem 2rem;text-align:center;position:relative;z-index:1;}
      .footer-logo{font-family:'Cinzel',serif;font-size:2rem;font-weight:900;color:var(--gold);margin-bottom:1rem;}
      .footer-tagline{color:var(--muted);font-size:0.85rem;margin-bottom:2rem;}
      .footer-links{display:flex;gap:2rem;justify-content:center;margin-bottom:2rem;flex-wrap:wrap;}
      .footer-link{color:var(--muted);font-size:0.82rem;cursor:pointer;transition:color 0.2s;}
      .footer-link:hover{color:var(--gold);}
      .footer-copy{font-size:0.75rem;color:rgba(154,136,112,0.5);}
      .login-panel{position:fixed;inset:0;background:rgba(0,0,0,0.92);backdrop-filter:blur(20px);z-index:400;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.25s ease;padding:2rem;}
      .login-box{background:var(--panel);border:1px solid var(--border);border-radius:28px;padding:2.5rem;max-width:400px;width:100%;text-align:center;animation:slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1);max-height:90vh;overflow-y:auto;}
      .login-box.gold-border{border-color:var(--gold);}
      .social-btn{display:flex;align-items:center;gap:0.75rem;padding:0.85rem 1.2rem;border-radius:12px;border:1px solid var(--border);background:rgba(30,19,32,0.6);color:var(--text);cursor:pointer;font-family:'Noto Sans Myanmar',sans-serif;font-size:0.88rem;transition:all 0.25s;width:100%;margin-bottom:0.75rem;}
      .social-btn:hover{border-color:var(--gold);background:var(--glow);transform:translateY(-2px);}
      .divider-line{display:flex;align-items:center;gap:1rem;margin:1.25rem 0;}
      .divider-line::before,.divider-line::after{content:'';flex:1;height:1px;background:var(--border);}
      .divider-line span{font-size:0.75rem;color:var(--muted);}
      .auth-tabs{display:flex;border:1px solid var(--border);border-radius:12px;overflow:hidden;margin-bottom:1.25rem;}
      .auth-tab{flex:1;padding:0.6rem;border:none;background:transparent;color:var(--muted);cursor:pointer;font-family:'Noto Sans Myanmar',sans-serif;font-size:0.82rem;transition:all 0.25s;}
      .auth-tab.active{background:var(--glow);color:var(--gold);font-weight:700;}
      .gold-divider{width:60px;height:3px;background:linear-gradient(90deg,transparent,var(--gold),transparent);margin:0.75rem auto 0;border-radius:3px;}
      .marquee-wrap{overflow:hidden;border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:1rem 0;background:rgba(212,175,55,0.03);position:relative;z-index:1;}
      .marquee-inner{display:flex;gap:4rem;width:max-content;animation:marquee 30s linear infinite;}
      @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
      .marquee-item{font-size:0.78rem;color:var(--muted);white-space:nowrap;display:flex;align-items:center;gap:0.5rem;}
      .marquee-dot{color:var(--gold);}
      .hint{font-size:0.72rem;color:rgba(154,136,112,0.5);margin-top:0.3rem;}
      @media(max-width:768px){.stats-bar{grid-template-columns:repeat(2,1fr);}.cat-grid{grid-template-columns:1fr;}.featured-book{grid-template-columns:1fr;text-align:center;}.books-grid{grid-template-columns:repeat(auto-fill,minmax(180px,1fr));}.form-row{grid-template-columns:1fr;}.nav-links .nav-btn{display:none;}.nav-links .login-btn,.nav-links .user-wrap{display:flex;}}
    `}</style>

    <div className="site-bg">
      {particles.map(p=>(
        <div key={p.id} className="particle" style={{left:p.left,top:p.top,width:p.size,height:p.size,opacity:p.opacity,animationDelay:p.delay,animationDuration:p.duration}}/>
      ))}

      {/* NAV — Admin hidden, click logo 5x to reveal */}
      <nav className="nav">
        <div className="nav-logo" onClick={handleLogoClick} title="">
          YAGAN BOOKS
          <span>မြန်မာ အကျဉ်းချုပ် စာကြည့်တိုက်</span>
        </div>
        <div className="nav-links">
          {(["home","library","categories"] as const).map(v=>(
            <button key={v} className={`nav-btn ${view===v?"active":""}`} onClick={()=>setView(v)}>
              {v==="home"?"မူလ":v==="library"?"စာကြည့်တိုက်":"အမျိုးအစား"}
            </button>
          ))}
          {currentUser ? (
            <div className="user-wrap">
              <div className="user-avatar" onClick={()=>setShowUserMenu(!showUserMenu)}>{currentUser.avatar}</div>
              {showUserMenu && (
                <div className="user-dropdown">
                  <div style={{padding:"0.6rem 1rem",fontSize:"0.82rem",color:"var(--gold)",fontWeight:700,borderBottom:"1px solid var(--border)",marginBottom:"0.25rem"}}>👤 {currentUser.name}</div>
                  <div className="u-item" onClick={handleLogout}>🚪 ထွက်မည်</div>
                </div>
              )}
            </div>
          ) : (
            <button className="login-btn" onClick={()=>setShowUserLogin(true)}>👤 ဝင်ရောက်မည်</button>
          )}
        </div>
      </nav>

      {/* HIDDEN ADMIN LOGIN */}
      {showAdminLogin && !adminUnlocked && (
        <div className="login-panel" onClick={()=>{setShowAdminLogin(false);setAdminPass("");}}>
          <div className="login-box gold-border" onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:"3rem",marginBottom:"1rem"}}>🔐</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.5rem",fontWeight:700,color:"var(--gold)",marginBottom:"0.5rem"}}>Admin Access</div>
            <div style={{fontSize:"0.82rem",color:"var(--muted)",marginBottom:"1.5rem"}}>စီမံခန့်ခွဲသူ ဝင်ရောက်မှု</div>
            <div className="form-group" style={{textAlign:"left",marginBottom:"1rem"}}>
              <label className="form-label">Password</label>
              <input type="password" className="fi" placeholder="Admin password..." value={adminPass}
                onChange={e=>{setAdminPass(e.target.value);setPassError(false);}}
                onKeyDown={e=>{ if(e.key==="Enter"){ if(adminPass===ADMIN_PASSWORD){setAdminUnlocked(true);setAdminMode(true);setShowAdminLogin(false);showToast("Admin mode ဝင်ပြီး 🔓");}else setPassError(true);}}} />
            </div>
            {passError && <div style={{color:"#F77",fontSize:"0.8rem",marginBottom:"1rem"}}>Password မှားနေပါသည်</div>}
            <button className="btn-primary" style={{width:"100%",marginBottom:"0.75rem"}} onClick={()=>{ if(adminPass===ADMIN_PASSWORD){setAdminUnlocked(true);setAdminMode(true);setShowAdminLogin(false);showToast("Admin mode ဝင်ပြီး 🔓");}else setPassError(true);}}>ဝင်ရောက်မည်</button>
            <button className="btn-outline" style={{width:"100%"}} onClick={()=>{setShowAdminLogin(false);setAdminPass("");}}>မလုပ်တော့ပါ</button>
          </div>
        </div>
      )}

      {/* USER LOGIN */}
      {showUserLogin && (
        <div className="login-panel" onClick={()=>setShowUserLogin(false)}>
          <div className="login-box" onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:"2.5rem",marginBottom:"0.75rem"}}>📚</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.5rem",fontWeight:900,marginBottom:"0.4rem"}}>YAGAN BOOKS</div>
            <div style={{fontSize:"0.82rem",color:"var(--muted)",marginBottom:"1.5rem"}}>စာဖတ်သူအကောင့် ဝင်ရောက်ပါ</div>
            {/* Social Buttons */}
            <button className="social-btn" onClick={()=>loginAs("Google User","user@gmail.com")}>
              <span style={{fontSize:"1.2rem"}}>🌐</span> Google ဖြင့် ဝင်ရောက်မည်
            </button>
            <button className="social-btn" onClick={()=>loginAs("Facebook User","user@facebook.com")}>
              <span style={{fontSize:"1.2rem"}}>📘</span> Facebook ဖြင့် ဝင်ရောက်မည်
            </button>
            <button className="social-btn" onClick={()=>loginAs("Apple User","user@icloud.com")} style={{marginBottom:0}}>
              <span style={{fontSize:"1.2rem"}}></span> Apple ဖြင့် ဝင်ရောက်မည်
            </button>
            <div className="divider-line"><span>သို့မဟုတ် Email ဖြင့်</span></div>
            <div className="auth-tabs">
              <button className={`auth-tab ${authMode==="login"?"active":""}`} onClick={()=>setAuthMode("login")}>ဝင်ရောက်မည်</button>
              <button className={`auth-tab ${authMode==="register"?"active":""}`} onClick={()=>setAuthMode("register")}>မှတ်ပုံတင်မည်</button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"0.75rem",textAlign:"left"}}>
              {authMode==="register" && (
                <div className="form-group">
                  <label className="form-label">နာမည်</label>
                  <input className="fi" placeholder="သင့်နာမည်..." value={userForm.name} onChange={e=>setUserForm({...userForm,name:e.target.value})}/>
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="fi" type="email" placeholder="email@example.com" value={userForm.email} onChange={e=>setUserForm({...userForm,email:e.target.value})}/>
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="fi" type="password" placeholder="Password..." value={userForm.password} onChange={e=>setUserForm({...userForm,password:e.target.value})}/>
              </div>
              {userError && <div style={{color:"#F77",fontSize:"0.8rem"}}>{userError}</div>}
              <button className="btn-primary" style={{width:"100%"}} onClick={handleUserAuth}>
                {authMode==="login"?"ဝင်ရောက်မည်":"အကောင့်ဖွင့်မည်"}
              </button>
            </div>
            <button className="btn-outline" style={{width:"100%",marginTop:"0.75rem"}} onClick={()=>setShowUserLogin(false)}>မလုပ်တော့ပါ</button>
          </div>
        </div>
      )}

      {/* HOME */}
      {view==="home" && (<>
        <section className="hero">
          <div className="hero-ornament">📚</div>
          <div style={{position:"relative",zIndex:1}}>
            <div className={`hero-badge ${heroAnim?"show":""}`}>✨ မြန်မာ့ အကောင်းဆုံး Digital Library</div>
            <h1 className={`hero-title ${heroAnim?"show":""}`}>
              စာဖတ်ခြင်းဖြင့်<br/><span className="gold">ဘဝကို ပြောင်းလဲပါ</span>
            </h1>
            <p className={`hero-sub ${heroAnim?"show":""}`}>
              အကောင်းဆုံးစာအုပ်များ၏ အကျဉ်းချုပ်ကို မြန်မာဘာသာဖြင့် ဖတ်ပါ၊ နားထောင်ပါ။<br/>
              ကမ္ဘာ့ Best Seller များကို မိနစ်ပိုင်းတွင် နားလည်ပါ။
            </p>
            <div className={`hero-actions ${heroAnim?"show":""}`}>
              <button className="btn-primary" onClick={()=>setView("library")}>📚 စာကြည့်တိုက် ဝင်ကြည့်မည်</button>
              {!currentUser && <button className="btn-outline" onClick={()=>setShowUserLogin(true)}>👤 အကောင့်ဖွင့်မည်</button>}
            </div>
          </div>
        </section>
        <div className="stats-bar">
          <div className="stat-item"><div className="stat-num">{stats.total}+</div><div className="stat-label">📚 စာအုပ်</div></div>
          <div className="stat-item"><div className="stat-num">{stats.free}</div><div className="stat-label">🆓 အခမဲ့</div></div>
          <div className="stat-item"><div className="stat-num">{stats.premium}</div><div className="stat-label">👑 Premium</div></div>
          <div className="stat-item"><div className="stat-num">{stats.audio}</div><div className="stat-label">🎧 Audio</div></div>
        </div>
        <div className="marquee-wrap">
          <div className="marquee-inner">
            {[...Array(2)].map((_,di)=>books.map((b,i)=>(<span key={`${di}-${i}`} className="marquee-item"><span className="marquee-dot">✦</span>{b.title}</span>)))}
          </div>
        </div>
        <section className="section">
          <div className="section-header">
            <div className="section-eyebrow">Browse by Type</div>
            <h2 className="section-title">စာအုပ် အမျိုးအစားများ</h2>
            <div className="gold-divider"/>
          </div>
          <div className="cat-grid">
            <div className="cat-card cat-free" onClick={()=>{setView("library");setFilter("free");}}>
              <span className="cat-icon">📗</span><div className="cat-name">အခမဲ့ Ebooks</div>
              <div className="cat-desc">Login မလိုဘဲ ဖတ်ရှုနိုင်</div>
              <div className="cat-count">{books.filter(b=>b.category==="free"&&b.type==="ebook").length} Books</div>
            </div>
            <div className="cat-card cat-premium" onClick={()=>{setView("library");setFilter("premium");}}>
              <span className="cat-icon">👑</span><div className="cat-name">Premium Ebooks</div>
              <div className="cat-desc">Login ဖြင့် ဝင်ကြည့်ပါ</div>
              <div className="cat-count">{books.filter(b=>b.category==="premium"&&b.type==="ebook").length} Books</div>
            </div>
            <div className="cat-card cat-audio" onClick={()=>{setView("library");setFilter("audiobook");}}>
              <span className="cat-icon">🎧</span><div className="cat-name">Audio Books</div>
              <div className="cat-desc">ဘယ်နေရာမှာမဆို နားထောင်ပါ</div>
              <div className="cat-count">{books.filter(b=>b.type==="audiobook").length} Books</div>
            </div>
          </div>
        </section>
        <div className="featured-band">
          <div className="featured-inner">
            <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
              <div className="section-eyebrow">Editor's Pick</div>
              <h2 className="section-title">အကြံပြုသောစာအုပ်</h2>
              <div className="gold-divider"/>
            </div>
            <div className="featured-book">
              <div className="featured-cover">📘</div>
              <div>
                <div className="featured-badge">⭐ #1 Bestseller</div>
                <div className="featured-title">ငွေကြေးဉာဏ်ပညာ</div>
                <div style={{color:"var(--muted)",marginBottom:"1rem",fontSize:"0.88rem"}}>Robert Kiyosaki | Premium Ebook</div>
                <div className="featured-desc">ချမ်းသာကြွယ်ဝရေးသို့ ဦးတည်သောကြောင်း ငွေကြေးစီမံခန့်ခွဲမှု နှင့် ဝင်ငွေတိုးပွားစေရန် နည်းလမ်းများ ပါဝင်သောစာအုပ်ကြီး မြန်မာဘာသာ အကျဉ်းချုပ်။</div>
                <div style={{display:"flex",gap:"1rem",flexWrap:"wrap"}}>
                  <button className="btn-primary" onClick={()=>setSelectedBook(books[1])}>📖 ဖတ်ရှုမည်</button>
                  <button className="btn-outline" onClick={()=>setView("library")}>📚 နောက်ထပ်</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <section className="section">
          <div className="section-header">
            <div className="section-eyebrow">Latest</div>
            <h2 className="section-title">လတ်တလော ထည့်သွင်းထားသော စာအုပ်များ</h2>
            <div className="gold-divider"/>
          </div>
          <div className="books-grid">
            {books.slice(0,4).map((book,i)=>(
              <BookCard key={book.id} book={book} onSelect={setSelectedBook} adminMode={adminMode&&adminUnlocked} onEdit={(b:Book)=>setAdminForm(b)} onDelete={handleDelete} animDelay={`${i*0.1}s`} canAccess={canAccess(book)}/>
            ))}
          </div>
          <div style={{textAlign:"center",marginTop:"2.5rem"}}>
            <button className="btn-outline" onClick={()=>setView("library")}>📚 ကျန်သောစာအုပ်များ</button>
          </div>
        </section>
        <footer className="footer">
          <div className="footer-logo">📚 YAGAN BOOKS</div>
          <div className="footer-tagline">မြန်မာ့ အကောင်းဆုံး Digital Reading Platform</div>
          <div className="footer-links">
            <span className="footer-link" onClick={()=>setView("home")}>မူလ</span>
            <span className="footer-link" onClick={()=>setView("library")}>စာကြည့်တိုက်</span>
            <span className="footer-link" onClick={()=>setView("categories")}>အမျိုးအစား</span>
          </div>
          <div className="gold-divider" style={{marginBottom:"1.5rem"}}/>
          <div className="footer-copy">© 2025 Yagan Books · မြန်မာနိုင်ငံ မှ ❤️</div>
        </footer>
      </>)}

      {/* LIBRARY */}
      {view==="library" && (
        <div className="section" style={{paddingTop:"7rem"}}>
          <div className="section-header">
            <div className="section-eyebrow">Digital Library</div>
            <h2 className="section-title">မြန်မာ စာကြည့်တိုက်</h2>
            <div className="gold-divider"/>
          </div>
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input className="search-input" placeholder="စာအုပ်ရှာဖွေပါ..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}/>
          </div>
          <div className="filter-bar">
            {([["all","အားလုံး"],["free","🆓 အခမဲ့"],["premium","👑 Premium"],["audiobook","🎧 Audio"]] as [string,string][]).map(([v,l])=>(
              <button key={v} className={`filter-btn ${filter===v?"active":""}`} onClick={()=>setFilter(v)}>{l}</button>
            ))}
          </div>
          <div style={{textAlign:"center",marginBottom:"1.5rem",color:"var(--muted)",fontSize:"0.82rem"}}>{filteredBooks.length} ခု တွေ့ရှိသည်</div>
          <div className="books-grid">
            {filteredBooks.map((book,i)=>(
              <BookCard key={book.id} book={book} onSelect={setSelectedBook} adminMode={adminMode&&adminUnlocked} onEdit={(b:Book)=>setAdminForm(b)} onDelete={handleDelete} animDelay={`${i*0.07}s`} canAccess={canAccess(book)}/>
            ))}
          </div>
        </div>
      )}

      {/* CATEGORIES */}
      {view==="categories" && (
        <div className="section" style={{paddingTop:"7rem"}}>
          <div className="section-header">
            <div className="section-eyebrow">All Categories</div>
            <h2 className="section-title">စာအုပ် အမျိုးအစားများ</h2>
            <div className="gold-divider"/>
          </div>
          <div className="cat-grid" style={{marginBottom:"4rem"}}>
            <div className="cat-card cat-free" onClick={()=>{setView("library");setFilter("free");}}>
              <span className="cat-icon">📗</span><div className="cat-name">Free Ebooks</div>
              <div className="cat-desc">Login မလိုဘဲ ဖတ်ရှုနိုင်</div><div className="cat-count">{books.filter(b=>b.category==="free").length}+</div>
            </div>
            <div className="cat-card cat-premium" onClick={()=>{setView("library");setFilter("premium");}}>
              <span className="cat-icon">👑</span><div className="cat-name">Premium Ebooks</div>
              <div className="cat-desc">Login ဖြင့် ဝင်ကြည့်နိုင်</div><div className="cat-count">{books.filter(b=>b.category==="premium").length}+</div>
            </div>
            <div className="cat-card cat-audio" onClick={()=>{setView("library");setFilter("audiobook");}}>
              <span className="cat-icon">🎧</span><div className="cat-name">Audio Books</div>
              <div className="cat-desc">နားထောင်ရင်း သင်ယူပါ</div><div className="cat-count">{books.filter(b=>b.type==="audiobook").length}+</div>
            </div>
          </div>
          <div className="section-header"><h2 className="section-title">ထိပ်တန်း Rating</h2><div className="gold-divider"/></div>
          <div className="books-grid">
            {books.filter(b=>b.rating>=4.8).map((book,i)=>(
              <BookCard key={book.id} book={book} onSelect={setSelectedBook} adminMode={adminMode&&adminUnlocked} onEdit={(b:Book)=>setAdminForm(b)} onDelete={handleDelete} animDelay={`${i*0.1}s`} canAccess={canAccess(book)}/>
            ))}
          </div>
        </div>
      )}

      {/* ADMIN BAR */}
      {adminMode&&adminUnlocked && (
        <div className="admin-bar">
          <span className="admin-bar-label">🔓 Admin ON</span>
          <button className="add-btn" onClick={()=>setAdminForm({id:0,title:"",author:"",category:"free",type:"ebook",cover:"📗",price:0,rating:4.5,reads:0,description:"",pages:0,lang:"မြန်မာဘာသာ",tag:"New",duration:"",fileId:""})}>
            + ထည့်မည်
          </button>
          <button style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",color:"white",borderRadius:"50px",padding:"0.5rem 1rem",cursor:"pointer",fontSize:"0.78rem"}}
            onClick={()=>{setAdminMode(false);setAdminUnlocked(false);setAdminPass("");showToast("Admin ထွက်ပြီး");}}>
            ✕ ထွက်
          </button>
        </div>
      )}

      {selectedBook && <BookModal book={selectedBook} onClose={()=>setSelectedBook(null)} canAccess={canAccess(selectedBook)} onLoginRequest={()=>{setSelectedBook(null);setShowUserLogin(true);}}/>}
      {adminForm && <AdminForm form={adminForm} onChange={setAdminForm} onSave={handleSave} onClose={()=>setAdminForm(null)}/>}
      {toast && <div className="toast">{toast.msg}</div>}
    </div>
  </>);
}

function getCoverClass(b:Book){return b.type==="audiobook"?"book-cover-audio":b.category==="premium"?"book-cover-premium":"book-cover-free";}
function getTagClass(tag:string){const t=tag.toLowerCase();if(t.includes("free"))return"tag-free";if(t.includes("premium")||t==="popular"||t==="bestseller")return"tag-premium";if(t.includes("audio"))return"tag-audio";return"tag-new";}

function BookCard({book,onSelect,adminMode,onEdit,onDelete,animDelay,canAccess}:{book:Book;onSelect:(b:Book)=>void;adminMode:boolean;onEdit:(b:Book)=>void;onDelete:(id:number)=>void;animDelay:string;canAccess:boolean;}){
  return(
    <div className="book-card" style={{animationDelay:animDelay}} onClick={()=>onSelect(book)}>
      <div className={`book-cover ${getCoverClass(book)}`}>
        {book.cover}
        {!canAccess&&<div className="lock-overlay">🔒</div>}
        <span className={`book-tag ${getTagClass(book.tag)}`}>{book.tag}</span>
      </div>
      <div className="book-info">
        <div className="book-title">{book.title}</div>
        <div className="book-author">{book.author}</div>
        <div className="book-meta">
          <div className={`book-price ${book.price===0?"free":""}`}>{book.price===0?"🆓 အခမဲ့":`${book.price.toLocaleString()} ကျပ်`}</div>
          <div className="book-rating">⭐{book.rating}·{(book.reads/1000).toFixed(1)}k</div>
        </div>
      </div>
      {adminMode&&(<div className="admin-actions" onClick={e=>e.stopPropagation()}>
        <button className="admin-btn edit-btn" onClick={()=>onEdit(book)}>✏️ ပြင်</button>
        <button className="admin-btn del-btn" onClick={()=>{if(window.confirm("ဖျက်မလား?"))onDelete(book.id);}}>🗑️ ဖျက်</button>
      </div>)}
    </div>
  );
}

function BookModal({book,onClose,canAccess,onLoginRequest}:{book:Book;onClose:()=>void;canAccess:boolean;onLoginRequest:()=>void;}){
  return(
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-hero">{book.cover}<button className="modal-close" onClick={onClose}>✕</button></div>
        <div className="modal-body">
          <div className="modal-title">{book.title}</div>
          <div className="modal-author">✍️ {book.author}</div>
          <div className="modal-tags">
            <span className="modal-tag">{book.type==="audiobook"?"🎧 Audio":"📖 Ebook"}</span>
            <span className="modal-tag">{book.category==="free"?"🆓 Free":"👑 Premium"}</span>
            <span className="modal-tag">🌐 {book.lang}</span>
          </div>
          <div className="modal-desc">{book.description}</div>
          <div className="modal-stats">
            <div className="modal-stat"><div className="modal-stat-val">⭐{book.rating}</div><div className="modal-stat-label">Rating</div></div>
            <div className="modal-stat"><div className="modal-stat-val">{(book.reads/1000).toFixed(1)}k</div><div className="modal-stat-label">ဖတ်ပြီး</div></div>
            <div className="modal-stat"><div className="modal-stat-val">{book.pages?`${book.pages}`:book.duration||"-"}</div><div className="modal-stat-label">{book.pages?"စာမျက်နှာ":"ကြာချိန်"}</div></div>
          </div>
          {canAccess ? (<>
            {book.type==="audiobook"&&book.fileId&&(
              <audio controls className="audio-player">
                <source src={`https://drive.google.com/uc?export=download&id=${book.fileId}`} type="audio/mpeg"/>
              </audio>
            )}
            {book.type==="ebook"&&book.fileId&&(
              <iframe src={`https://drive.google.com/file/d/${book.fileId}/preview`} width="100%" height="380px" style={{borderRadius:"12px",border:"none",marginBottom:"1rem"}}/>
            )}
            <button className={`btn-get ${book.price===0?"btn-get-free":"btn-get-premium"}`}
              onClick={()=>{if(book.fileId)window.open(`https://drive.google.com/file/d/${book.fileId}/view`,"_blank");}}>
              {book.price===0?(book.type==="audiobook"?"🎧 နားထောင်မည်":"📖 ဖတ်မည်"):`👑 ဝယ်ယူမည် — ${book.price.toLocaleString()} ကျပ်`}
            </button>
          </>) : (
            <div className="lock-box">
              <div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>🔒</div>
              <div style={{color:"#F99",marginBottom:"1rem",fontSize:"0.88rem"}}>ဤစာအုပ်ကို ကြည့်ရှုရန် အကောင့်ဝင်ရောက်ပါ</div>
              <button className="btn-get btn-get-premium" onClick={onLoginRequest}>👤 ဝင်ရောက် / မှတ်ပုံတင်မည်</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminForm({form,onChange,onSave,onClose}:{form:Book;onChange:(b:Book)=>void;onSave:(b:Book)=>void;onClose:()=>void;}){
  const set=(k:keyof Book,v:string|number)=>onChange({...form,[k]:v});
  return(
    <div className="aform-overlay" onClick={onClose}>
      <div className="aform" onClick={e=>e.stopPropagation()}>
        <div className="form-header">
          <div className="form-title">{form.id?"✏️ ပြင်မည်":"➕ အသစ်ထည့်မည်"}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="form-body">
          <div className="form-group"><label className="form-label">📚 စာအုပ်အမည်</label><input className="fi" value={form.title} onChange={e=>set("title",e.target.value)} placeholder="စာအုပ်အမည်..."/></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">✍️ စာရေးဆရာ</label><input className="fi" value={form.author} onChange={e=>set("author",e.target.value)}/></div>
            <div className="form-group"><label className="form-label">🎭 Cover Emoji</label><input className="fi" value={form.cover} onChange={e=>set("cover",e.target.value)}/></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">📂 အမျိုးအစား</label>
              <select className="fs" value={form.category} onChange={e=>set("category",e.target.value)}><option value="free">Free</option><option value="premium">Premium</option></select>
            </div>
            <div className="form-group"><label className="form-label">🎵 ပုံစံ</label>
              <select className="fs" value={form.type} onChange={e=>set("type",e.target.value)}><option value="ebook">Ebook</option><option value="audiobook">Audiobook</option></select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">💰 စျေးနှုန်း (ကျပ်)</label><input className="fi" type="number" value={form.price} onChange={e=>set("price",+e.target.value)}/></div>
            <div className="form-group"><label className="form-label">🏷️ Tag</label><input className="fi" value={form.tag} onChange={e=>set("tag",e.target.value)}/></div>
          </div>
          {form.type==="ebook"
            ?<div className="form-group"><label className="form-label">📄 စာမျက်နှာ</label><input className="fi" type="number" value={form.pages||0} onChange={e=>set("pages",+e.target.value)}/></div>
            :<div className="form-group"><label className="form-label">⏱️ ကြာချိန်</label><input className="fi" value={form.duration||""} onChange={e=>set("duration",e.target.value)} placeholder="8 နာရီ 30 မိနစ်"/></div>
          }
          <div className="form-group">
            <label className="form-label">🔗 Google Drive File ID</label>
            <input className="fi" value={form.fileId||""} onChange={e=>set("fileId",e.target.value)} placeholder="1BxiMVs0XRA5nFMdKvBdBZjgm..."/>
            <span className="hint">Google Drive link မှ /d/ နှင့် /view ကြားက ID ကူးပါ</span>
          </div>
          <div className="form-group"><label className="form-label">📝 ဖော်ပြချက်</label><textarea className="ft" value={form.description} onChange={e=>set("description",e.target.value)}/></div>
          <button className="form-submit" onClick={()=>{if(form.title&&form.author)onSave(form);}}>
            {form.id?"💾 မှတ်သားမည်":"✨ ထည့်မည်"}
          </button>
        </div>
      </div>
    </div>
  );
}
