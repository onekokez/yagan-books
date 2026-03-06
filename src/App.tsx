import { useState, useEffect, useRef } from 'react';

const INITIAL_BOOKS = [
  {
    id: 1,
    title: 'အောင်မြင်သူများ၏ အလေ့အကျင့်',
    author: 'Stephen Covey',
    category: 'free',
    type: 'ebook',
    cover: '📗',
    price: 0,
    rating: 4.8,
    reads: 12400,
    description:
      'အောင်မြင်သူများ၏ အဓိကအလေ့အကျင့် ၇ ခုကို လေ့လာပါ။ ဘဝတွင် အောင်မြင်ရန် လမ်းညွှန်ချက်တစ်ခု။',
    pages: 320,
    lang: 'မြန်မာဘာသာ',
    tag: 'Bestseller',
  },
  {
    id: 2,
    title: 'ငွေကြေးဉာဏ်ပညာ',
    author: 'Robert Kiyosaki',
    category: 'premium',
    type: 'ebook',
    cover: '📘',
    price: 3500,
    rating: 4.9,
    reads: 9800,
    description:
      'ချမ်းသာကြွယ်ဝမှုဆီသို့ ဦးတည်သော ငွေကြေးစီမံခန့်ခွဲမှု လမ်းညွှန်ချက်။',
    pages: 280,
    lang: 'မြန်မာဘာသာ',
    tag: 'Popular',
  },
  {
    id: 3,
    title: 'စိတ်ဓာတ်ခွန်အား',
    author: 'Norman Peale',
    category: 'free',
    type: 'ebook',
    cover: '📙',
    price: 0,
    rating: 4.7,
    reads: 15600,
    description: 'အပြုသဘောဆောင်သောစိတ်ဓာတ်ဖြင့် ဘဝကို ပြောင်းလဲပါ။',
    pages: 240,
    lang: 'မြန်မာဘာသာ',
    tag: 'Free',
  },
  {
    id: 4,
    title: 'အိပ်မက်ကို လိုက်နာပါ',
    author: 'Paulo Coelho',
    category: 'premium',
    type: 'ebook',
    cover: '📕',
    price: 2500,
    rating: 4.6,
    reads: 7200,
    description:
      'ကိုယ်ပိုင်ဒဏ္ဍာရီကို ရှာဖွေခြင်းနှင့် ဘဝ၏ စစ်မှန်သောအဓိပ္ပါယ်ကို ရှာဖွေပါ။',
    pages: 180,
    lang: 'မြန်မာဘာသာ',
    tag: 'New',
  },
  {
    id: 5,
    title: 'အောင်မြင်သောခေါင်းဆောင်ပုံစံ',
    author: 'John Maxwell',
    category: 'free',
    type: 'audiobook',
    cover: '🎧',
    price: 0,
    rating: 4.9,
    reads: 6800,
    description: 'ခေါင်းဆောင်မှုစွမ်းရည်ကို မြှင့်တင်ရန် audio သင်ခန်းစာများ။',
    duration: '8 နာရီ 30 မိနစ်',
    lang: 'မြန်မာဘာသာ',
    tag: 'Audio',
  },
  {
    id: 6,
    title: 'Atomic Habits မြန်မာဘာသာ',
    author: 'James Clear',
    category: 'premium',
    type: 'audiobook',
    cover: '🎙️',
    price: 4500,
    rating: 5.0,
    reads: 11200,
    description:
      'ထူးခြားသောကောင်းသောအလေ့အကျင့်များ တည်ဆောက်ရန် လမ်းညွှန်ချက်အပြည့်အစုံ။',
    duration: '11 နာရီ 15 မိနစ်',
    lang: 'မြန်မာဘာသာ',
    tag: 'Premium',
  },
  {
    id: 7,
    title: 'ဆန်းသစ်တီထွင်ခြင်း',
    author: 'Walter Isaacson',
    category: 'premium',
    type: 'ebook',
    cover: '💡',
    price: 3000,
    rating: 4.7,
    reads: 5400,
    description:
      'Steve Jobs ၏ ဆန်းသစ်တီထွင်သောနည်းလမ်းများ၊ ယနေ့ကမ္ဘာကို ပြောင်းလဲပုံ။',
    pages: 350,
    lang: 'မြန်မာဘာသာ',
    tag: 'Trending',
  },
  {
    id: 8,
    title: 'ဘဝတွင် ရပ်တည်ပါ',
    author: 'Brené Brown',
    category: 'free',
    type: 'audiobook',
    cover: '🌟',
    price: 0,
    rating: 4.8,
    reads: 8900,
    description: 'ကြောက်ရွံ့မှုကို ကျော်ဖြတ်ကာ ရဲရင့်သောဘဝကို ရှင်သန်ပါ။',
    duration: '6 နာရီ 45 မိနစ်',
    lang: 'မြန်မာဘာသာ',
    tag: 'Free Audio',
  },
];

const CATEGORIES = ['all', 'free', 'premium', 'audiobook'];
const TYPES = ['ebook', 'audiobook'];

function FloatingParticle({ style }) {
  return <div className="particle" style={style} />;
}

export default function App() {
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [view, setView] = useState('home');
  const [filter, setFilter] = useState('all');
  const [selectedBook, setSelectedBook] = useState(null);
  const [adminMode, setAdminMode] = useState(false);
  const [adminForm, setAdminForm] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [particles] = useState(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 8 + 4}px`,
      delay: `${Math.random() * 6}s`,
      duration: `${Math.random() * 8 + 6}s`,
      opacity: Math.random() * 0.4 + 0.1,
    }))
  );
  const [toast, setToast] = useState(null);
  const [heroAnim, setHeroAnim] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [passError, setPassError] = useState(false);

  useEffect(() => {
    setTimeout(() => setHeroAnim(true), 100);
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredBooks = books.filter((b) => {
    const matchFilter =
      filter === 'all' ||
      b.category === filter ||
      (filter === 'audiobook' && b.type === 'audiobook');
    const matchSearch =
      !searchQuery ||
      b.title.includes(searchQuery) ||
      b.author.includes(searchQuery);
    return matchFilter && matchSearch;
  });

  const handleDelete = (id) => {
    setBooks(books.filter((b) => b.id !== id));
    showToast('စာအုပ်ဖျက်သိမ်းပြီး ✓');
  };

  const handleSave = (book) => {
    if (book.id) {
      setBooks(books.map((b) => (b.id === book.id ? book : b)));
      showToast('စာအုပ်ပြင်ဆင်ပြီး ✓');
    } else {
      setBooks([...books, { ...book, id: Date.now(), reads: 0, rating: 4.5 }]);
      showToast('စာအုပ်အသစ်ထည့်ပြီး ✓');
    }
    setAdminForm(null);
  };

  const stats = {
    total: books.length,
    free: books.filter((b) => b.category === 'free').length,
    premium: books.filter((b) => b.category === 'premium').length,
    audio: books.filter((b) => b.type === 'audiobook').length,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Noto+Sans+Myanmar:wght@300;400;600;700&family=Cinzel:wght@400;700;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --gold: #D4AF37;
          --gold-light: #F4D03F;
          --gold-dark: #A0840A;
          --ruby: #8B1A1A;
          --ruby-light: #B22222;
          --deep: #0A0408;
          --dark: #120C10;
          --panel: #1A1018;
          --card: #1E1320;
          --border: rgba(212,175,55,0.25);
          --text: #F5EDD8;
          --muted: #9A8870;
          --emerald: #1B4D3E;
          --sapphire: #1B2F4D;
          --glow: rgba(212,175,55,0.15);
        }

        body { background: var(--deep); color: var(--text); font-family: 'Noto Sans Myanmar', sans-serif; overflow-x: hidden; }

        .site-bg {
          min-height: 100vh;
          background: radial-gradient(ellipse at 20% 0%, #2D1B10 0%, transparent 50%),
                      radial-gradient(ellipse at 80% 0%, #1A0D2E 0%, transparent 50%),
                      radial-gradient(ellipse at 50% 100%, #0D1B10 0%, transparent 50%),
                      var(--deep);
          position: relative;
        }

        .particle {
          position: fixed;
          border-radius: 50%;
          background: var(--gold);
          pointer-events: none;
          animation: floatParticle var(--dur, 10s) var(--delay, 0s) ease-in-out infinite alternate;
          z-index: 0;
        }

        @keyframes floatParticle {
          0% { transform: translateY(0) rotate(0deg); opacity: var(--op, 0.15); }
          100% { transform: translateY(-60px) rotate(360deg); opacity: calc(var(--op, 0.15) * 2); }
        }

        /* NAV */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          background: linear-gradient(180deg, rgba(10,4,8,0.97) 0%, rgba(10,4,8,0.85) 100%);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
          padding: 0 2rem;
          display: flex; align-items: center; justify-content: space-between;
          height: 68px;
        }

        .nav-logo {
          font-family: 'Cinzel', serif;
          font-size: 1.4rem; font-weight: 900;
          background: linear-gradient(135deg, var(--gold-light), var(--gold), var(--gold-dark));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          letter-spacing: 2px;
        }

        .nav-logo span { font-family: 'Noto Sans Myanmar', sans-serif; font-size: 0.75rem; display: block; color: var(--muted); -webkit-text-fill-color: var(--muted); letter-spacing: 1px; }

        .nav-links { display: flex; gap: 0.25rem; align-items: center; }

        .nav-btn {
          background: none; border: none; color: var(--muted); cursor: pointer;
          padding: 0.5rem 1rem; border-radius: 8px; font-family: 'Noto Sans Myanmar', sans-serif;
          font-size: 0.85rem; transition: all 0.25s; position: relative;
        }
        .nav-btn:hover, .nav-btn.active { color: var(--gold); background: var(--glow); }
        .nav-btn.active::after {
          content: ''; position: absolute; bottom: 2px; left: 50%; transform: translateX(-50%);
          width: 20px; height: 2px; background: var(--gold); border-radius: 2px;
        }

        .admin-toggle {
          background: linear-gradient(135deg, var(--ruby), var(--ruby-light));
          color: white; border: none; cursor: pointer;
          padding: 0.45rem 1rem; border-radius: 20px;
          font-size: 0.75rem; font-family: 'Noto Sans Myanmar', sans-serif;
          transition: all 0.25s; box-shadow: 0 2px 12px rgba(139,26,26,0.4);
        }
        .admin-toggle:hover { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(139,26,26,0.6); }

        /* HERO */
        .hero {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          text-align: center; padding: 6rem 2rem 4rem;
          position: relative; overflow: hidden;
        }

        .hero-ornament {
          position: absolute; font-size: 12rem; opacity: 0.03;
          font-family: 'Cinzel', serif; font-weight: 900; color: var(--gold);
          pointer-events: none; user-select: none;
          animation: pulse 6s ease-in-out infinite;
        }

        @keyframes pulse { 0%,100%{opacity:0.03;transform:scale(1);} 50%{opacity:0.06;transform:scale(1.02);} }

        .hero-badge {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05));
          border: 1px solid var(--border); border-radius: 50px;
          padding: 0.4rem 1.2rem; font-size: 0.78rem; color: var(--gold); margin-bottom: 2rem;
          opacity: 0; transform: translateY(20px);
          transition: all 0.8s ease 0.2s;
        }
        .hero-badge.show { opacity: 1; transform: translateY(0); }

        .hero-title {
          font-family: 'Playfair Display', serif; font-size: clamp(2.8rem, 7vw, 5.5rem);
          font-weight: 900; line-height: 1.1; margin-bottom: 1rem;
          opacity: 0; transform: translateY(30px);
          transition: all 0.9s ease 0.4s;
        }
        .hero-title.show { opacity: 1; transform: translateY(0); }

        .hero-title .gold { background: linear-gradient(135deg, var(--gold-light), var(--gold), var(--gold-dark)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

        .hero-sub {
          font-size: 1.05rem; color: var(--muted); max-width: 580px; margin: 0 auto 2.5rem;
          line-height: 1.9;
          opacity: 0; transform: translateY(20px);
          transition: all 0.9s ease 0.6s;
        }
        .hero-sub.show { opacity: 1; transform: translateY(0); }

        .hero-actions {
          display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;
          opacity: 0; transform: translateY(20px);
          transition: all 0.9s ease 0.8s;
        }
        .hero-actions.show { opacity: 1; transform: translateY(0); }

        .btn-primary {
          background: linear-gradient(135deg, var(--gold-dark), var(--gold), var(--gold-light));
          color: var(--deep); border: none; cursor: pointer;
          padding: 0.85rem 2.2rem; border-radius: 50px;
          font-family: 'Noto Sans Myanmar', sans-serif; font-size: 0.95rem; font-weight: 700;
          transition: all 0.3s; box-shadow: 0 4px 20px rgba(212,175,55,0.35);
        }
        .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 8px 30px rgba(212,175,55,0.55); }

        .btn-outline {
          background: transparent; color: var(--gold); cursor: pointer;
          padding: 0.85rem 2.2rem; border-radius: 50px;
          border: 1.5px solid var(--gold);
          font-family: 'Noto Sans Myanmar', sans-serif; font-size: 0.95rem;
          transition: all 0.3s;
        }
        .btn-outline:hover { background: var(--glow); transform: translateY(-3px); }

        /* STATS */
        .stats-bar {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 1px; background: var(--border);
          border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
          position: relative; z-index: 1;
        }

        .stat-item {
          background: rgba(26,16,24,0.9); padding: 2rem; text-align: center;
          transition: all 0.3s;
        }
        .stat-item:hover { background: rgba(212,175,55,0.06); }

        .stat-num { font-family: 'Cinzel', serif; font-size: 2.2rem; font-weight: 900; color: var(--gold); }
        .stat-label { font-size: 0.78rem; color: var(--muted); margin-top: 0.25rem; }

        /* SECTION */
        .section { padding: 5rem 2rem; max-width: 1300px; margin: 0 auto; position: relative; z-index: 1; }

        .section-header { text-align: center; margin-bottom: 3rem; }

        .section-eyebrow {
          font-family: 'Cinzel', serif; font-size: 0.7rem; letter-spacing: 4px;
          color: var(--gold); text-transform: uppercase; margin-bottom: 0.75rem;
        }

        .section-title {
          font-family: 'Playfair Display', serif; font-size: clamp(1.8rem, 4vw, 2.8rem);
          font-weight: 700; line-height: 1.2;
        }

        /* FILTER */
        .filter-bar {
          display: flex; gap: 0.5rem; justify-content: center; margin-bottom: 2.5rem;
          flex-wrap: wrap;
        }

        .filter-btn {
          background: transparent; border: 1px solid var(--border); color: var(--muted);
          padding: 0.5rem 1.3rem; border-radius: 50px; cursor: pointer;
          font-family: 'Noto Sans Myanmar', sans-serif; font-size: 0.82rem;
          transition: all 0.25s;
        }
        .filter-btn:hover { border-color: var(--gold); color: var(--gold); background: var(--glow); }
        .filter-btn.active { background: linear-gradient(135deg, var(--gold-dark), var(--gold)); color: var(--deep); border-color: transparent; font-weight: 700; }

        /* SEARCH */
        .search-wrap { max-width: 420px; margin: 0 auto 2rem; position: relative; }
        .search-input {
          width: 100%; background: rgba(30,19,32,0.8); border: 1px solid var(--border);
          color: var(--text); padding: 0.75rem 1rem 0.75rem 2.8rem; border-radius: 50px;
          font-family: 'Noto Sans Myanmar', sans-serif; font-size: 0.88rem;
          outline: none; transition: border-color 0.25s;
        }
        .search-input::placeholder { color: var(--muted); }
        .search-input:focus { border-color: var(--gold); box-shadow: 0 0 0 3px var(--glow); }
        .search-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--muted); }

        /* BOOKS GRID */
        .books-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.5rem; }

        .book-card {
          background: linear-gradient(145deg, var(--card), var(--panel));
          border: 1px solid var(--border); border-radius: 16px;
          overflow: hidden; cursor: pointer;
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          animation: fadeUp 0.5s ease both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .book-card:hover {
          transform: translateY(-10px) scale(1.02);
          border-color: var(--gold);
          box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(212,175,55,0.12);
        }

        .book-cover {
          height: 180px; display: flex; align-items: center; justify-content: center;
          font-size: 5rem; position: relative; overflow: hidden;
        }

        .book-cover::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(212,175,55,0.08), transparent 60%, rgba(139,26,26,0.08));
        }

        .book-cover-free { background: linear-gradient(135deg, #1B4D3E, #0D2E22); }
        .book-cover-premium { background: linear-gradient(135deg, #1B2F4D, #0D1B2E); }
        .book-cover-audio { background: linear-gradient(135deg, #4D1B2F, #2E0D1B); }

        .book-tag {
          position: absolute; top: 0.75rem; right: 0.75rem;
          font-size: 0.65rem; font-weight: 700;
          padding: 0.25rem 0.7rem; border-radius: 50px; letter-spacing: 0.5px;
        }
        .tag-free { background: rgba(27,77,62,0.9); color: #4ECDC4; border: 1px solid rgba(78,205,196,0.3); }
        .tag-premium { background: rgba(27,47,77,0.9); color: #7EB8F7; border: 1px solid rgba(126,184,247,0.3); }
        .tag-audio { background: rgba(77,27,47,0.9); color: #F79DD7; border: 1px solid rgba(247,157,215,0.3); }
        .tag-new { background: rgba(77,60,15,0.9); color: var(--gold-light); border: 1px solid rgba(212,175,55,0.3); }
        .tag-default { background: rgba(40,30,40,0.9); color: var(--muted); border: 1px solid var(--border); }

        .book-info { padding: 1.2rem; }
        .book-title { font-family: 'Noto Sans Myanmar', sans-serif; font-weight: 700; font-size: 0.92rem; margin-bottom: 0.3rem; line-height: 1.5; }
        .book-author { font-size: 0.78rem; color: var(--muted); margin-bottom: 0.75rem; }

        .book-meta { display: flex; align-items: center; justify-content: space-between; }

        .book-price { font-family: 'Cinzel', serif; font-weight: 700; font-size: 0.95rem; color: var(--gold); }
        .book-price.free { color: #4ECDC4; }

        .book-rating { display: flex; align-items: center; gap: 0.3rem; font-size: 0.75rem; color: var(--muted); }

        .admin-actions {
          display: flex; gap: 0.5rem; padding: 0 1.2rem 1.2rem;
          opacity: 0; transition: opacity 0.25s;
        }
        .book-card:hover .admin-actions { opacity: 1; }

        .admin-btn {
          flex: 1; padding: 0.4rem; border-radius: 8px; border: 1px solid; cursor: pointer;
          font-size: 0.75rem; font-family: 'Noto Sans Myanmar', sans-serif; transition: all 0.2s;
        }
        .edit-btn { background: rgba(212,175,55,0.1); border-color: rgba(212,175,55,0.3); color: var(--gold); }
        .edit-btn:hover { background: rgba(212,175,55,0.2); }
        .del-btn { background: rgba(178,34,34,0.1); border-color: rgba(178,34,34,0.3); color: #F77; }
        .del-btn:hover { background: rgba(178,34,34,0.2); }

        /* FEATURED */
        .featured-band {
          background: linear-gradient(135deg, rgba(27,47,77,0.6), rgba(77,27,47,0.4));
          border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
          padding: 4rem 2rem; position: relative; overflow: hidden; z-index: 1;
        }

        .featured-band::before {
          content: '';
          position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
          background: radial-gradient(ellipse at center, rgba(212,175,55,0.04) 0%, transparent 60%);
          animation: rotateBg 30s linear infinite;
        }

        @keyframes rotateBg { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

        .featured-inner { max-width: 1300px; margin: 0 auto; }

        .featured-book {
          display: grid; grid-template-columns: 1fr 2fr; gap: 3rem; align-items: center;
        }

        .featured-cover {
          aspect-ratio: 3/4; max-width: 240px; margin: 0 auto;
          background: linear-gradient(135deg, var(--sapphire), var(--deep));
          border-radius: 12px; display: flex; align-items: center; justify-content: center;
          font-size: 8rem; border: 2px solid var(--border);
          box-shadow: 20px 20px 60px rgba(0,0,0,0.6), -2px -2px 0 rgba(212,175,55,0.1);
          animation: bookFloat 4s ease-in-out infinite;
        }

        @keyframes bookFloat {
          0%,100%{transform:translateY(0) rotate(-1deg);} 50%{transform:translateY(-12px) rotate(1deg);}
        }

        .featured-badge {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: linear-gradient(135deg, var(--gold-dark), var(--gold));
          color: var(--deep); padding: 0.35rem 1rem; border-radius: 50px;
          font-size: 0.72rem; font-weight: 700; margin-bottom: 1rem;
        }

        .featured-title { font-family: 'Playfair Display', serif; font-size: 2.2rem; font-weight: 900; line-height: 1.2; margin-bottom: 0.75rem; }

        .featured-desc { color: var(--muted); line-height: 1.9; font-size: 0.9rem; margin-bottom: 2rem; }

        /* CATEGORIES section */
        .cat-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; }

        .cat-card {
          border-radius: 20px; padding: 2.5rem 2rem; text-align: center; cursor: pointer;
          transition: all 0.35s; border: 1px solid transparent; position: relative; overflow: hidden;
        }

        .cat-card::before {
          content: ''; position: absolute; inset: 0; opacity: 0; transition: opacity 0.35s;
          background: radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.15) 0%, transparent 70%);
        }

        .cat-card:hover::before { opacity: 1; }
        .cat-card:hover { transform: translateY(-8px); border-color: var(--border); }

        .cat-free { background: linear-gradient(135deg, rgba(27,77,62,0.4), rgba(27,77,62,0.15)); }
        .cat-premium { background: linear-gradient(135deg, rgba(27,47,77,0.4), rgba(27,47,77,0.15)); }
        .cat-audio { background: linear-gradient(135deg, rgba(77,27,47,0.4), rgba(77,27,47,0.15)); }

        .cat-icon { font-size: 3rem; margin-bottom: 1rem; display: block; }
        .cat-name { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 700; margin-bottom: 0.5rem; }
        .cat-desc { font-size: 0.83rem; color: var(--muted); line-height: 1.7; }
        .cat-count { font-family: 'Cinzel', serif; font-size: 1.8rem; font-weight: 900; color: var(--gold); margin-top: 1rem; }

        /* MODAL */
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.85);
          backdrop-filter: blur(12px); z-index: 200; display: flex; align-items: center; justify-content: center;
          padding: 2rem; animation: fadeIn 0.25s ease;
        }

        @keyframes fadeIn { from{opacity:0} to{opacity:1} }

        .modal {
          background: var(--panel); border: 1px solid var(--border); border-radius: 24px;
          max-width: 700px; width: 100%; max-height: 90vh; overflow-y: auto;
          animation: slideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes slideUp { from{opacity:0;transform:translateY(40px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }

        .modal-hero {
          height: 240px; display: flex; align-items: center; justify-content: center;
          font-size: 9rem; position: relative;
          background: linear-gradient(135deg, var(--deep), var(--sapphire), var(--dark));
          border-radius: 24px 24px 0 0;
        }

        .modal-close {
          position: absolute; top: 1rem; right: 1rem;
          background: rgba(0,0,0,0.5); border: 1px solid var(--border); color: var(--text);
          width: 36px; height: 36px; border-radius: 50%; cursor: pointer; font-size: 1.1rem;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .modal-close:hover { background: rgba(212,175,55,0.2); color: var(--gold); }

        .modal-body { padding: 2rem; }
        .modal-title { font-family: 'Playfair Display', serif; font-size: 1.8rem; font-weight: 900; margin-bottom: 0.4rem; }
        .modal-author { color: var(--muted); font-size: 0.9rem; margin-bottom: 1.2rem; }

        .modal-tags { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
        .modal-tag { padding: 0.3rem 0.8rem; border-radius: 50px; font-size: 0.75rem; border: 1px solid var(--border); color: var(--muted); }

        .modal-desc { color: var(--muted); line-height: 2; font-size: 0.9rem; margin-bottom: 2rem; }

        .modal-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: var(--border); border-radius: 12px; overflow: hidden; margin-bottom: 2rem; }
        .modal-stat { background: var(--card); padding: 1rem; text-align: center; }
        .modal-stat-val { font-family: 'Cinzel', serif; font-size: 1.1rem; font-weight: 700; color: var(--gold); }
        .modal-stat-label { font-size: 0.72rem; color: var(--muted); margin-top: 0.2rem; }

        .btn-get {
          width: 100%; padding: 1rem; border-radius: 12px; border: none; cursor: pointer;
          font-family: 'Noto Sans Myanmar', sans-serif; font-size: 1rem; font-weight: 700;
          transition: all 0.3s;
        }
        .btn-get-free { background: linear-gradient(135deg, #1B4D3E, #2E7D5E); color: #A7F3D0; }
        .btn-get-premium { background: linear-gradient(135deg, var(--gold-dark), var(--gold), var(--gold-light)); color: var(--deep); }
        .btn-get-free:hover, .btn-get-premium:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.4); }

        /* ADMIN FORM */
        .admin-form-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.9);
          backdrop-filter: blur(16px); z-index: 300;
          display: flex; align-items: center; justify-content: center; padding: 2rem;
          animation: fadeIn 0.25s ease;
        }

        .admin-form {
          background: var(--panel); border: 1px solid var(--gold);
          border-radius: 24px; max-width: 560px; width: 100%; max-height: 90vh; overflow-y: auto;
          animation: slideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .form-header {
          padding: 1.5rem 2rem; border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
        }

        .form-title { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 700; color: var(--gold); }

        .form-body { padding: 2rem; display: flex; flex-direction: column; gap: 1.25rem; }

        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .form-label { font-size: 0.8rem; color: var(--muted); font-weight: 600; letter-spacing: 0.5px; }

        .form-input, .form-select, .form-textarea {
          background: rgba(30,19,32,0.8); border: 1px solid var(--border); color: var(--text);
          padding: 0.75rem 1rem; border-radius: 10px;
          font-family: 'Noto Sans Myanmar', sans-serif; font-size: 0.88rem;
          outline: none; transition: border-color 0.25s; width: 100%;
        }
        .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: var(--gold); box-shadow: 0 0 0 3px var(--glow); }
        .form-textarea { resize: vertical; min-height: 100px; }
        .form-select option { background: var(--panel); }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

        .form-submit {
          background: linear-gradient(135deg, var(--gold-dark), var(--gold), var(--gold-light));
          color: var(--deep); border: none; cursor: pointer;
          padding: 0.85rem; border-radius: 12px; font-weight: 700;
          font-family: 'Noto Sans Myanmar', sans-serif; font-size: 0.95rem;
          transition: all 0.3s;
        }
        .form-submit:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(212,175,55,0.4); }

        /* ADMIN PANEL */
        .admin-bar {
          position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
          background: linear-gradient(135deg, rgba(139,26,26,0.95), rgba(178,34,34,0.9));
          border: 1px solid rgba(255,100,100,0.3); border-radius: 50px;
          padding: 0.75rem 1.5rem; z-index: 50; display: flex; gap: 1rem; align-items: center;
          box-shadow: 0 8px 40px rgba(139,26,26,0.6); backdrop-filter: blur(12px);
          animation: slideUp 0.4s ease;
        }

        .admin-bar-label { font-size: 0.78rem; color: rgba(255,200,200,0.9); font-weight: 600; }

        .add-book-btn {
          background: white; color: var(--ruby); border: none; cursor: pointer;
          padding: 0.5rem 1.2rem; border-radius: 50px; font-size: 0.82rem; font-weight: 700;
          font-family: 'Noto Sans Myanmar', sans-serif; transition: all 0.25s;
        }
        .add-book-btn:hover { background: var(--gold-light); transform: scale(1.05); }

        /* TOAST */
        .toast {
          position: fixed; bottom: 6rem; left: 50%; transform: translateX(-50%);
          background: rgba(27,77,62,0.95); border: 1px solid rgba(78,205,196,0.4);
          color: #A7F3D0; padding: 0.75rem 1.5rem; border-radius: 50px;
          font-size: 0.85rem; z-index: 999; backdrop-filter: blur(12px);
          animation: toastIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(20px) scale(0.9)} to{opacity:1;transform:translateX(-50%) translateY(0) scale(1)} }

        /* FOOTER */
        .footer {
          background: linear-gradient(180deg, transparent, rgba(10,4,8,0.98));
          border-top: 1px solid var(--border); padding: 4rem 2rem 2rem;
          text-align: center; position: relative; z-index: 1;
        }

        .footer-logo { font-family: 'Cinzel', serif; font-size: 2rem; font-weight: 900; color: var(--gold); margin-bottom: 1rem; }
        .footer-tagline { color: var(--muted); font-size: 0.85rem; margin-bottom: 2rem; }
        .footer-links { display: flex; gap: 2rem; justify-content: center; margin-bottom: 2rem; flex-wrap: wrap; }
        .footer-link { color: var(--muted); font-size: 0.82rem; cursor: pointer; text-decoration: none; transition: color 0.2s; }
        .footer-link:hover { color: var(--gold); }
        .footer-copy { font-size: 0.75rem; color: rgba(154,136,112,0.5); }

        /* ADMIN LOGIN */
        .admin-login {
          position: fixed; inset: 0; background: rgba(0,0,0,0.95); backdrop-filter: blur(20px);
          z-index: 400; display: flex; align-items: center; justify-content: center;
          animation: fadeIn 0.25s ease;
        }
        .admin-login-box {
          background: var(--panel); border: 1px solid var(--gold); border-radius: 24px;
          padding: 2.5rem; max-width: 380px; width: 100%; text-align: center;
          animation: slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1);
        }
        .admin-login-icon { font-size: 3rem; margin-bottom: 1rem; }
        .admin-login-title { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 700; color: var(--gold); margin-bottom: 0.5rem; }
        .admin-login-sub { font-size: 0.82rem; color: var(--muted); margin-bottom: 2rem; }

        /* DIVIDER */
        .gold-divider {
          width: 60px; height: 3px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          margin: 0.75rem auto 0;
          border-radius: 3px;
        }

        /* WAVE */
        .wave-divider { width: 100%; overflow: hidden; line-height: 0; }

        /* MARQUEE */
        .marquee-wrap {
          overflow: hidden; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
          padding: 1rem 0; background: rgba(212,175,55,0.03); position: relative; z-index: 1;
        }
        .marquee-inner { display: flex; gap: 4rem; width: max-content; animation: marquee 30s linear infinite; }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .marquee-item { font-size: 0.78rem; color: var(--muted); white-space: nowrap; display: flex; align-items: center; gap: 0.5rem; }
        .marquee-dot { color: var(--gold); }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .stats-bar { grid-template-columns: repeat(2,1fr); }
          .cat-grid { grid-template-columns: 1fr; }
          .featured-book { grid-template-columns: 1fr; text-align: center; }
          .featured-cover { margin-bottom: 1.5rem; }
          .books-grid { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); }
          .nav-links .nav-btn:not(.admin-toggle) { display: none; }
          .form-row { grid-template-columns: 1fr; }
        }

        /* GLOW LINE */
        .glow-line { width: 100%; height: 1px; background: linear-gradient(90deg, transparent, var(--gold), transparent); }
      `}</style>

      <div className="site-bg">
        {/* Particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              '--delay': p.delay,
              '--dur': p.duration,
              '--op': p.opacity,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}

        {/* NAV */}
        <nav className="nav">
          <div className="nav-logo">
            YAGAN BOOKS
            <span>မြန်မာ အကျဉ်းချုပ် စာကြည့်တိုက်</span>
          </div>
          <div className="nav-links">
            {['home', 'library', 'categories'].map((v) => (
              <button
                key={v}
                className={`nav-btn ${view === v ? 'active' : ''}`}
                onClick={() => setView(v)}
              >
                {v === 'home'
                  ? 'မူလစာမျက်နှာ'
                  : v === 'library'
                  ? 'စာကြည့်တိုက်'
                  : 'အမျိုးအစားများ'}
              </button>
            ))}
            <button
              className="admin-toggle"
              onClick={() => {
                if (adminUnlocked) {
                  setAdminMode(!adminMode);
                } else {
                  setAdminMode(true);
                }
              }}
            >
              {adminMode && adminUnlocked ? '🔓 Admin ON' : '⚙️ Admin'}
            </button>
          </div>
        </nav>

        {/* ADMIN LOGIN */}
        {adminMode && !adminUnlocked && (
          <div className="admin-login">
            <div className="admin-login-box">
              <div className="admin-login-icon">🔐</div>
              <div className="admin-login-title">Admin Login</div>
              <div className="admin-login-sub">ဝင်ရောက်ရန် password ထည့်ပါ</div>
              <input
                type="password"
                className="form-input"
                placeholder="Password"
                value={adminPass}
                onChange={(e) => {
                  setAdminPass(e.target.value);
                  setPassError(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (adminPass === 'admin123') {
                      setAdminUnlocked(true);
                    } else {
                      setPassError(true);
                    }
                  }
                }}
                style={{ marginBottom: '1rem' }}
              />
              {passError && (
                <div
                  style={{
                    color: '#F77',
                    fontSize: '0.8rem',
                    marginBottom: '1rem',
                  }}
                >
                  Password မှားနေပါသည်
                </div>
              )}
              <button
                className="btn-primary"
                style={{ width: '100%' }}
                onClick={() => {
                  if (adminPass === 'admin123') {
                    setAdminUnlocked(true);
                  } else {
                    setPassError(true);
                  }
                }}
              >
                ဝင်ရောက်မည်
              </button>
              <button
                className="btn-outline"
                style={{ width: '100%', marginTop: '0.75rem' }}
                onClick={() => {
                  setAdminMode(false);
                  setAdminPass('');
                }}
              >
                မလုပ်တော့ပါ
              </button>
              <div
                style={{
                  marginTop: '1rem',
                  fontSize: '0.72rem',
                  color: 'rgba(154,136,112,0.6)',
                }}
              >
                Default: admin123
              </div>
            </div>
          </div>
        )}

        {/* HOME */}
        {view === 'home' && (
          <>
            {/* HERO */}
            <section className="hero">
              <div className="hero-ornament">📚</div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div className={`hero-badge ${heroAnim ? 'show' : ''}`}>
                  ✨ မြန်မာ့ အကောင်းဆုံး Digital Library
                </div>
                <h1 className={`hero-title ${heroAnim ? 'show' : ''}`}>
                  စာဖတ်ခြင်းဖြင့်
                  <br />
                  <span className="gold">ဘဝကို ပြောင်းလဲပါ</span>
                </h1>
                <p className={`hero-sub ${heroAnim ? 'show' : ''}`}>
                  အကောင်းဆုံးစာအုပ်များ၏ အကျဉ်းချုပ်ကို မြန်မာဘာသာဖြင့် ဖတ်ပါ၊
                  နားထောင်ပါ။
                  <br />
                  ကမ္ဘာ့ Best Seller များကို မိနစ်ပိုင်းတွင် နားလည်ပါ။
                </p>
                <div className={`hero-actions ${heroAnim ? 'show' : ''}`}>
                  <button
                    className="btn-primary"
                    onClick={() => setView('library')}
                  >
                    📚 စာကြည့်တိုက် ဝင်ကြည့်မည်
                  </button>
                  <button
                    className="btn-outline"
                    onClick={() => setView('categories')}
                  >
                    🎯 အမျိုးအစားများ
                  </button>
                </div>
              </div>
            </section>

            {/* STATS */}
            <div className="stats-bar">
              <div className="stat-item">
                <div className="stat-num">{stats.total}+</div>
                <div className="stat-label">📚 စာအုပ်စုစုပေါင်း</div>
              </div>
              <div className="stat-item">
                <div className="stat-num">{stats.free}</div>
                <div className="stat-label">🆓 အခမဲ့ Ebooks</div>
              </div>
              <div className="stat-item">
                <div className="stat-num">{stats.premium}</div>
                <div className="stat-label">👑 Premium Ebooks</div>
              </div>
              <div className="stat-item">
                <div className="stat-num">{stats.audio}</div>
                <div className="stat-label">🎧 Audio Books</div>
              </div>
            </div>

            {/* MARQUEE */}
            <div className="marquee-wrap">
              <div className="marquee-inner">
                {[...Array(2)].map((_, di) =>
                  books.map((b, i) => (
                    <span key={`${di}-${i}`} className="marquee-item">
                      <span className="marquee-dot">✦</span> {b.title}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* CATEGORIES */}
            <section className="section">
              <div className="section-header">
                <div className="section-eyebrow">Browse by Type</div>
                <h2 className="section-title">စာအုပ် အမျိုးအစားများ</h2>
                <div className="gold-divider" />
              </div>
              <div className="cat-grid">
                <div
                  className="cat-card cat-free"
                  onClick={() => {
                    setView('library');
                    setFilter('free');
                  }}
                >
                  <span className="cat-icon">📗</span>
                  <div className="cat-name">အခမဲ့ Ebooks</div>
                  <div className="cat-desc">
                    ကောင်းမွန်သော စာအုပ်များကို အခမဲ့ ဖတ်ရှုပါ
                  </div>
                  <div className="cat-count">
                    {
                      books.filter(
                        (b) => b.category === 'free' && b.type === 'ebook'
                      ).length
                    }{' '}
                    Books
                  </div>
                </div>
                <div
                  className="cat-card cat-premium"
                  onClick={() => {
                    setView('library');
                    setFilter('premium');
                  }}
                >
                  <span className="cat-icon">👑</span>
                  <div className="cat-name">Premium Ebooks</div>
                  <div className="cat-desc">
                    ထူးချွန်သောအကြောင်းအရာများကို ဝင်ရောက်ကြည့်ပါ
                  </div>
                  <div className="cat-count">
                    {
                      books.filter(
                        (b) => b.category === 'premium' && b.type === 'ebook'
                      ).length
                    }{' '}
                    Books
                  </div>
                </div>
                <div
                  className="cat-card cat-audio"
                  onClick={() => {
                    setView('library');
                    setFilter('audiobook');
                  }}
                >
                  <span className="cat-icon">🎧</span>
                  <div className="cat-name">Audio Books</div>
                  <div className="cat-desc">
                    နားထောင်ရင်း သင်ယူပါ၊ ဘယ်နေရာမှာမဆို
                  </div>
                  <div className="cat-count">
                    {books.filter((b) => b.type === 'audiobook').length} Books
                  </div>
                </div>
              </div>
            </section>

            {/* FEATURED */}
            <div className="featured-band">
              <div className="featured-inner">
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                  <div className="section-eyebrow">Editor's Pick</div>
                  <h2 className="section-title">
                    ဂုဏ်သတင်းကြီးမားသော အကြံပြုစာအုပ်
                  </h2>
                  <div className="gold-divider" />
                </div>
                <div className="featured-book">
                  <div className="featured-cover">📘</div>
                  <div>
                    <div className="featured-badge">⭐ #1 Bestseller</div>
                    <div className="featured-title">ငွေကြေးဉာဏ်ပညာ</div>
                    <div
                      style={{
                        color: 'var(--muted)',
                        marginBottom: '1rem',
                        fontSize: '0.88rem',
                      }}
                    >
                      Robert Kiyosaki | Premium Ebook
                    </div>
                    <div className="featured-desc">
                      ချမ်းသာကြွယ်ဝရေးသို့ ဦးတည်သောကြောင်း
                      ငွေကြေးစီမံခန့်ခွဲမှု၊ ရင်းနှီးမြှုပ်နှံမှု နှင့်
                      ဝင်ငွေတိုးပွားစေရန် နည်းလမ်းများ ပါဝင်သောစာအုပ်ကြီး
                      မြန်မာဘာသာသို့ ဘာသာပြန်ထားသောအကျဉ်းချုပ်။
                    </div>
                    <div
                      style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
                    >
                      <button
                        className="btn-primary"
                        onClick={() => setSelectedBook(books[1])}
                      >
                        📖 ဖတ်ရှုမည်
                      </button>
                      <button
                        className="btn-outline"
                        onClick={() => setView('library')}
                      >
                        📚 နောက်ထပ်ကြည့်မည်
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RECENT */}
            <section className="section">
              <div className="section-header">
                <div className="section-eyebrow">Latest Additions</div>
                <h2 className="section-title">
                  လတ်တလော ထည့်သွင်းထားသော စာအုပ်များ
                </h2>
                <div className="gold-divider" />
              </div>
              <div className="books-grid">
                {books.slice(0, 4).map((book, i) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onSelect={setSelectedBook}
                    adminMode={adminMode && adminUnlocked}
                    onEdit={(b) => setAdminForm(b)}
                    onDelete={handleDelete}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                <button
                  className="btn-outline"
                  onClick={() => setView('library')}
                >
                  📚 ကျန်သောစာအုပ်များကြည့်မည်
                </button>
              </div>
            </section>

            {/* FOOTER */}
            <footer className="footer">
              <div className="footer-logo">📚 YAGAN BOOKS</div>
              <div className="footer-tagline">
                မြန်မာ့ အကောင်းဆုံး Digital Reading Platform
              </div>
              <div className="footer-links">
                <span className="footer-link" onClick={() => setView('home')}>
                  မူလစာမျက်နှာ
                </span>
                <span
                  className="footer-link"
                  onClick={() => setView('library')}
                >
                  စာကြည့်တိုက်
                </span>
                <span
                  className="footer-link"
                  onClick={() => setView('categories')}
                >
                  အမျိုးအစားများ
                </span>
              </div>
              <div
                className="gold-divider"
                style={{ marginBottom: '1.5rem' }}
              />
              <div className="footer-copy">
                © 2025 Yagan Books. မြန်မာနိုင်ငံ မှ ❤️ ဖြင့် ဖန်တီးထားသည်
              </div>
            </footer>
          </>
        )}

        {/* LIBRARY */}
        {view === 'library' && (
          <div className="section" style={{ paddingTop: '7rem' }}>
            <div className="section-header">
              <div className="section-eyebrow">Digital Library</div>
              <h2 className="section-title">မြန်မာ စာကြည့်တိုက်</h2>
              <div className="gold-divider" />
            </div>
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input
                className="search-input"
                placeholder="စာအုပ်ရှာဖွေပါ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-bar">
              {[
                ['all', 'အားလုံး'],
                ['free', '🆓 အခမဲ့'],
                ['premium', '👑 Premium'],
                ['audiobook', '🎧 Audio'],
              ].map(([v, l]) => (
                <button
                  key={v}
                  className={`filter-btn ${filter === v ? 'active' : ''}`}
                  onClick={() => setFilter(v)}
                >
                  {l}
                </button>
              ))}
            </div>
            <div
              style={{
                textAlign: 'center',
                marginBottom: '1.5rem',
                color: 'var(--muted)',
                fontSize: '0.82rem',
              }}
            >
              {filteredBooks.length} ခု တွေ့ရှိသည်
            </div>
            <div className="books-grid">
              {filteredBooks.map((book, i) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onSelect={setSelectedBook}
                  adminMode={adminMode && adminUnlocked}
                  onEdit={(b) => setAdminForm(b)}
                  onDelete={handleDelete}
                  style={{ animationDelay: `${i * 0.07}s` }}
                />
              ))}
            </div>
            {filteredBooks.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '4rem',
                  color: 'var(--muted)',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                <div>ရှာဖွေသောစာအုပ် မတွေ့ပါ</div>
              </div>
            )}
          </div>
        )}

        {/* CATEGORIES */}
        {view === 'categories' && (
          <div className="section" style={{ paddingTop: '7rem' }}>
            <div className="section-header">
              <div className="section-eyebrow">All Categories</div>
              <h2 className="section-title">စာအုပ် အမျိုးအစားများ</h2>
              <div className="gold-divider" />
            </div>
            <div className="cat-grid" style={{ marginBottom: '4rem' }}>
              <div
                className="cat-card cat-free"
                onClick={() => {
                  setView('library');
                  setFilter('free');
                }}
              >
                <span className="cat-icon">📗</span>
                <div className="cat-name">Free Ebooks</div>
                <div className="cat-desc">
                  မှတ်ပုံတင်ရန် မလိုဘဲ အခမဲ့ ဖတ်ရှုနိုင်သော စာအုပ်များ
                </div>
                <div className="cat-count">
                  {books.filter((b) => b.category === 'free').length}+
                </div>
              </div>
              <div
                className="cat-card cat-premium"
                onClick={() => {
                  setView('library');
                  setFilter('premium');
                }}
              >
                <span className="cat-icon">👑</span>
                <div className="cat-name">Premium Ebooks</div>
                <div className="cat-desc">
                  ထူးခြားသောနှင့် ငွေကြေးဆိုင်ရာ အကျဉ်းချုပ် e-books
                </div>
                <div className="cat-count">
                  {books.filter((b) => b.category === 'premium').length}+
                </div>
              </div>
              <div
                className="cat-card cat-audio"
                onClick={() => {
                  setView('library');
                  setFilter('audiobook');
                }}
              >
                <span className="cat-icon">🎧</span>
                <div className="cat-name">Audio Books</div>
                <div className="cat-desc">
                  ကားပေါ်မှာ ၊ အိပ်ရာဝင်ချိန်ကြည့်ရာ နားထောင်ရန် audio books
                </div>
                <div className="cat-count">
                  {books.filter((b) => b.type === 'audiobook').length}+
                </div>
              </div>
            </div>
            <div className="section-header">
              <h2 className="section-title">ထိပ်တန်းဆောင်ပုဒ်များ</h2>
              <div className="gold-divider" />
            </div>
            <div className="books-grid">
              {books
                .filter((b) => b.rating >= 4.8)
                .map((book, i) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onSelect={setSelectedBook}
                    adminMode={adminMode && adminUnlocked}
                    onEdit={(b) => setAdminForm(b)}
                    onDelete={handleDelete}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
            </div>
          </div>
        )}

        {/* ADMIN BAR */}
        {adminMode && adminUnlocked && (
          <div className="admin-bar">
            <span className="admin-bar-label">🔓 Admin Mode ON</span>
            <button
              className="add-book-btn"
              onClick={() =>
                setAdminForm({
                  title: '',
                  author: '',
                  category: 'free',
                  type: 'ebook',
                  cover: '📗',
                  price: 0,
                  description: '',
                  pages: 0,
                  lang: 'မြန်မာဘာသာ',
                  tag: 'New',
                  duration: '',
                })
              }
            >
              + စာအုပ်အသစ်ထည့်မည်
            </button>
            <button
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                borderRadius: '50px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                fontSize: '0.78rem',
              }}
              onClick={() => {
                setAdminMode(false);
                setAdminUnlocked(false);
                setAdminPass('');
              }}
            >
              ✕ ထွက်မည်
            </button>
          </div>
        )}

        {/* BOOK DETAIL MODAL */}
        {selectedBook && (
          <BookModal
            book={selectedBook}
            onClose={() => setSelectedBook(null)}
          />
        )}

        {/* ADMIN FORM */}
        {adminForm && (
          <AdminForm
            form={adminForm}
            onChange={setAdminForm}
            onSave={handleSave}
            onClose={() => setAdminForm(null)}
          />
        )}

        {/* TOAST */}
        {toast && <div className="toast">{toast.msg}</div>}
      </div>
    </>
  );
}

function getCoverClass(book) {
  if (book.type === 'audiobook') return 'book-cover-audio';
  if (book.category === 'premium') return 'book-cover-premium';
  return 'book-cover-free';
}

function getTagClass(tag) {
  if (!tag) return 'tag-default';
  const t = tag.toLowerCase();
  if (t.includes('free') || t === 'free') return 'tag-free';
  if (t.includes('premium') || t === 'popular' || t === 'bestseller')
    return 'tag-premium';
  if (t.includes('audio')) return 'tag-audio';
  return 'tag-new';
}

function BookCard({ book, onSelect, adminMode, onEdit, onDelete, style }) {
  return (
    <div className="book-card" style={style} onClick={() => onSelect(book)}>
      <div className={`book-cover ${getCoverClass(book)}`}>
        {book.cover}
        <span className={`book-tag ${getTagClass(book.tag)}`}>{book.tag}</span>
      </div>
      <div className="book-info">
        <div className="book-title">{book.title}</div>
        <div className="book-author">{book.author}</div>
        <div className="book-meta">
          <div className={`book-price ${book.price === 0 ? 'free' : ''}`}>
            {book.price === 0
              ? '🆓 အခမဲ့'
              : `${book.price.toLocaleString()} ကျပ်`}
          </div>
          <div className="book-rating">
            ⭐ {book.rating} · {(book.reads / 1000).toFixed(1)}k
          </div>
        </div>
      </div>
      {adminMode && (
        <div className="admin-actions" onClick={(e) => e.stopPropagation()}>
          <button className="admin-btn edit-btn" onClick={() => onEdit(book)}>
            ✏️ ပြင်မည်
          </button>
          <button
            className="admin-btn del-btn"
            onClick={() => {
              if (window.confirm('ဖျက်မှာ သေချာပါသလား?')) onDelete(book.id);
            }}
          >
            🗑️ ဖျက်မည်
          </button>
        </div>
      )}
    </div>
  );
}

function BookModal({ book, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-hero">
          {book.cover}
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div className="modal-title">{book.title}</div>
          <div className="modal-author">✍️ {book.author}</div>
          <div className="modal-tags">
            <span className="modal-tag">
              {book.type === 'audiobook' ? '🎧 Audio Book' : '📖 Ebook'}
            </span>
            <span className="modal-tag">
              {book.category === 'free' ? '🆓 Free' : '👑 Premium'}
            </span>
            <span className="modal-tag">🌐 {book.lang}</span>
            {book.tag && (
              <span
                className={`book-tag ${getTagClass(book.tag)}`}
                style={{ position: 'relative', top: 0, right: 0 }}
              >
                {book.tag}
              </span>
            )}
          </div>
          <div className="modal-desc">{book.description}</div>
          <div className="modal-stats">
            <div className="modal-stat">
              <div className="modal-stat-val">⭐ {book.rating}</div>
              <div className="modal-stat-label">Rating</div>
            </div>
            <div className="modal-stat">
              <div className="modal-stat-val">
                {(book.reads / 1000).toFixed(1)}k
              </div>
              <div className="modal-stat-label">ဖတ်ပြီးသူ</div>
            </div>
            <div className="modal-stat">
              <div className="modal-stat-val">
                {book.pages ? `${book.pages}` : book.duration || '-'}
              </div>
              <div className="modal-stat-label">
                {book.pages ? 'စာမျက်နှာ' : 'ကြာချိန်'}
              </div>
            </div>
          </div>
          <button
            className={`btn-get ${
              book.price === 0 ? 'btn-get-free' : 'btn-get-premium'
            }`}
          >
            {book.price === 0
              ? book.type === 'audiobook'
                ? '🎧 အခမဲ့ နားထောင်မည်'
                : '📖 အခမဲ့ ဖတ်မည်'
              : `👑 ${book.price.toLocaleString()} ကျပ် - ဝယ်ယူမည်`}
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminForm({ form, onChange, onSave, onClose }) {
  const set = (k, v) => onChange({ ...form, [k]: v });
  return (
    <div className="admin-form-overlay" onClick={onClose}>
      <div className="admin-form" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <div className="form-title">
            {form.id ? '✏️ စာအုပ်ပြင်မည်' : '➕ စာအုပ်အသစ်ထည့်မည်'}
          </div>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="form-body">
          <div className="form-group">
            <label className="form-label">📚 စာအုပ်အမည်</label>
            <input
              className="form-input"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="စာအုပ်အမည်ထည့်ပါ..."
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">✍️ စာရေးဆရာ</label>
              <input
                className="form-input"
                value={form.author}
                onChange={(e) => set('author', e.target.value)}
                placeholder="Author..."
              />
            </div>
            <div className="form-group">
              <label className="form-label">🎭 Icon/Cover</label>
              <input
                className="form-input"
                value={form.cover}
                onChange={(e) => set('cover', e.target.value)}
                placeholder="Emoji..."
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">📂 အမျိုးအစား</label>
              <select
                className="form-select"
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
              >
                <option value="free">Free</option>
                <option value="premium">Premium</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">🎵 ပုံစံ</label>
              <select
                className="form-select"
                value={form.type}
                onChange={(e) => set('type', e.target.value)}
              >
                <option value="ebook">Ebook</option>
                <option value="audiobook">Audiobook</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">💰 စျေးနှုန်း (ကျပ်)</label>
              <input
                className="form-input"
                type="number"
                value={form.price}
                onChange={(e) => set('price', +e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label className="form-label">🏷️ Tag</label>
              <input
                className="form-input"
                value={form.tag}
                onChange={(e) => set('tag', e.target.value)}
                placeholder="New, Hot..."
              />
            </div>
          </div>
          {form.type === 'ebook' ? (
            <div className="form-group">
              <label className="form-label">📄 စာမျက်နှာ</label>
              <input
                className="form-input"
                type="number"
                value={form.pages}
                onChange={(e) => set('pages', +e.target.value)}
              />
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">⏱️ ကြာချိန်</label>
              <input
                className="form-input"
                value={form.duration}
                onChange={(e) => set('duration', e.target.value)}
                placeholder="8 နာရီ 30 မိနစ်"
              />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">📝 ဖော်ပြချက်</label>
            <textarea
              className="form-textarea"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="စာအုပ်အကြောင်း ဖော်ပြပါ..."
            />
          </div>
          <button
            className="form-submit"
            onClick={() => {
              if (form.title && form.author) onSave(form);
            }}
          >
            {form.id ? '💾 ပြင်ဆင်မှတ်သားမည်' : '✨ စာအုပ်ထည့်မည်'}
          </button>
        </div>
      </div>
    </div>
  );
}
