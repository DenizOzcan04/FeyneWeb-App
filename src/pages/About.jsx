// src/pages/About.jsx
import { useEffect, useRef } from "react";
import { motion as m } from "framer-motion";
import {
  FiTarget, FiUsers, FiActivity, FiCpu, FiShield, FiLock,
  FiAward, FiTrendingUp, FiMail, FiArrowRight, FiCheck
} from "react-icons/fi";

const fade = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

/* ---------------- PAGE ---------------- */
export default function About() {
  return (
    <div className="about-dark">
      <Starfield />

      <Intro />
      <Counters />
      <MissionVision />
      <Approach />
      <Roadmap />
      <Badges />
      <CTA />

      <Styles />
    </div>
  );
}

/* ---------------- BG: STARFIELD ---------------- */
function Starfield() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, dpr = Math.max(1, window.devicePixelRatio || 1);
    let stars = [];
    const N = 140;
    let raf;

    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = new Array(N).fill(0).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.4 + Math.random() * 1.6,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        z: 0.5 + Math.random() * 0.8,
      }));
    };

    const step = (t) => {
      // background gradient
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#0b1022");
      g.addColorStop(1, "#171a31");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // soft nebula
      const rg = ctx.createRadialGradient(w * 0.15, h * 0.2, 20, w * 0.15, h * 0.2, 380);
      rg.addColorStop(0, "rgba(124,140,255,0.14)");
      rg.addColorStop(1, "transparent");
      ctx.fillStyle = rg;
      ctx.beginPath(); ctx.arc(w * 0.15, h * 0.2, 380, 0, Math.PI * 2); ctx.fill();

      // stars
      ctx.fillStyle = "#cfd6ff";
      stars.forEach((s, i) => {
        s.x += s.vx; s.y += s.vy;
        if (s.x < -4) s.x = w + 4; if (s.x > w + 4) s.x = -4;
        if (s.y < -4) s.y = h + 4; if (s.y > h + 4) s.y = -4;

        const tw = 0.5 + Math.sin((t / 550 + i) % (Math.PI * 2)) * 0.3 * s.z;
        ctx.globalAlpha = 0.55 * s.z + tw * 0.35;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * (0.7 + s.z * 0.5), 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(step);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={ref} className="starfield" aria-hidden />;
}

/* ---------------- SECTIONS ---------------- */
function Intro() {
  return (
    <section className="section hero">
      <div className="container">
        <m.div initial="hidden" animate="visible" variants={stagger}>
          <m.h1 variants={fade} className="hero-title">
            VRTedavi Hakkında
          </m.h1>
          <m.p variants={fade} className="lead">
            VRTedavi; <strong>gerçek zamanlı EEG</strong> ile nöro-yanıtı izleyen,
            <strong> AI destekli kişiselleştirme</strong> ve klinisyen gözetimiyle
            güvenli VR terapi seansları sunan bir klinik teknoloji girişimidir.
          </m.p>
        </m.div>
      </div>
    </section>
  );
}

function Counters() {
  const Item = ({ n, label }) => (
    <div className="counter">
      <div className="num">{n}</div>
      <div className="lbl">{label}</div>
    </div>
  );
  return (
    <section className="section strip">
      <div className="container counters">
        <Item n="14+" label="Pilot Klinik" />
        <Item n="3.200+" label="Tamamlanan Seans" />
        <Item n="6" label="Klinik Modül" />
        <Item n="%96" label="Memnuniyet" />
      </div>
    </section>
  );
}

function MissionVision() {
  const items = [
    { icon: <FiTarget />, title: "Misyon", text: "Kanıta dayalı, erişilebilir ve güvenli VR terapileri ile kliniklerde hasta deneyimini iyileştirmek." },
    { icon: <FiUsers  />, title: "Vizyon", text: "Kişiye özel nöro-uyarlanabilir VR protokolleriyle rehabilitasyonun yeni standardını oluşturmak." },
  ];
  return (
    <section className="section">
      <div className="container">
        <m.div className="grid mv" initial="hidden" whileInView="visible" viewport={{ once: true, amount: .25 }} variants={stagger}>
          {items.map((it, i) => (
            <m.div key={i} className="card mv-card" variants={fade}>
              <div className="ic">{it.icon}</div>
              <div className="t1">{it.title}</div>
              <div className="t2">{it.text}</div>
              <div className="tags">
                <span><FiCheck /> Klinik odaklı</span>
                <span><FiCheck /> Ölçülebilir</span>
                <span><FiCheck /> Gizlilik</span>
              </div>
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
  );
}

function Approach() {
  const items = [
    { icon: <FiActivity />, title: "Gerçek Zamanlı EEG", text: "Nöro-yanıt sinyalleri ile uyaranların terapötik dozajı anlık optimize edilir." },
    { icon: <FiCpu />,      title: "AI Destekli Protokoller", text: "Hasta profiline ve seans tepkilerine göre akıllı uyarlama ve öneriler." },
    { icon: <FiShield />,   title: "Klinik Güvence", text: "Klinisyen paneli, manuel override ve kanıta dayalı içerik kütüphanesi." },
    { icon: <FiLock />,     title: "Gizlilik & Güvenlik", text: "Anonimleştirme, rol bazlı erişim, şifreleme ve denetim kayıtları." },
  ];
  return (
    <section className="section dim">
      <div className="container">
        <m.h2 className="title" initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
          Klinik ve Teknoloji Yaklaşımımız
        </m.h2>
        <m.div className="grid appr" initial="hidden" whileInView="visible" viewport={{ once:true, amount:.25 }} variants={stagger}>
          {items.map((it,i)=>(
            <m.div key={i} className="card" variants={fade}>
              <div className="ic">{it.icon}</div>
              <div className="t1">{it.title}</div>
              <div className="t2">{it.text}</div>
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
  );
}

function Roadmap() {
  const rows = [
    { icon:<FiAward/>,       y:"2023", title:"Fikir & Ön Çalışma", text:"VR sahneleri ve ölçüm protokollerinin prototiplenmesi."},
    { icon:<FiTrendingUp/>,  y:"2024", title:"Klinik Pilotlar",    text:"FTR ve ruh sağlığı modülleriyle çok merkezli pilotlar."},
    { icon:<FiActivity/>,    y:"2025", title:"EEG Entegrasyonu",   text:"Gerçek zamanlı nöro-yanıtla kişiselleştirme ve raporlama."},
    { icon:<FiShield/>,      y:"Sonraki", title:"Regülasyon",      text:"CE süreci, entegrasyonlar ve yaygınlaştırma."},
  ];
  return (
    <section className="section">
      <div className="container">
        <m.h2 className="title" initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
          Yol Haritası
        </m.h2>
        <div className="timeline">
          {rows.map((r,i)=>(
            <m.div key={i} className="card tl" initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.05}}>
              <div className="badge">{r.icon}</div>
              <div className="y">{r.y}</div>
              <div className="t1">{r.title}</div>
              <div className="t2">{r.text}</div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Badges() {
  const list = ["Teknokent","CE VR Tech","EEG Ready","Klinik Gözetim","Gizlilik & Güvenlik"];
  return (
    <section className="section dim">
      <div className="container badges">
        {list.map((b,i)=> (<span key={i} className="chip">{b}</span>))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="section">
      <div className="container">
        <m.div className="card cta" initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
          <div>
            <h3>Demo veya iş birliği için iletişime geçin</h3>
            <p>Klinik entegrasyon, araştırma ve pilot çalışmalar için bize yazın.</p>
          </div>
          <a href="mailto:info@vrtedavi.com" className="btn primary">
            <FiMail /> E-posta Gönder <FiArrowRight/>
          </a>
        </m.div>
      </div>
    </section>
  );
}

/* ---------------- STYLES ---------------- */
function Styles(){
  return (
    <style>{`
:root{
  --bg1:#0b1022; --bg2:#171a31;
  --card:#111827cc; --card-brd:#ffffff26;
  --fg:#e6e9ff; --muted:#a6b0d4;
  --a:#7c8cff; --b:#a78bfa;
  --shadow:0 12px 40px rgba(3,8,25,.42);
  --shadow2:0 18px 56px rgba(3,8,25,.56);
}
.about-dark{ color:var(--fg); background:linear-gradient(180deg,var(--bg1),var(--bg2)); overflow-x:hidden; }

/* NAVBAR daima görünür */
.topbar, header, nav{
  position: sticky; top: 0; z-index: 50;
  background: linear-gradient(180deg, rgba(13,19,38,.78), rgba(13,19,38,.45));
  backdrop-filter: blur(6px);
  border-bottom: 1px solid #ffffff20;
}
.topbar a, nav a{ color:#dbe2ff !important; }

/* Layout */
.container{ max-width:1200px; margin:0 auto; padding:0 20px; }
.section{ padding:78px 0; }
.section.dim{ background:linear-gradient(180deg,rgba(255,255,255,.02),rgba(255,255,255,.015)); }
.hero{ padding-top:96px; } /* nav ile çakışmasın */
.hero-title{ font-size:clamp(30px,5vw,46px); font-weight:900; margin:0 0 12px; }
.lead{ color:var(--muted); font-size:18px; line-height:1.65; max-width:860px; margin:0; }

.grid{ display:grid; gap:20px; }
.mv{ grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); }
.appr{ grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); }

.card{ background:var(--card); border:1px solid var(--card-brd); border-radius:18px; padding:24px;
  backdrop-filter:blur(10px); box-shadow:var(--shadow); transition:transform .2s, box-shadow .2s; }
.card:hover{ transform:translateY(-4px); box-shadow:var(--shadow2); }
.ic{ font-size:28px; color:#8ea4ff; margin-bottom:10px; }
.t1{ font-weight:900; margin-bottom:6px; }
.t2{ color:var(--muted); font-size:14px; line-height:1.55; }
.tags{ display:flex; gap:10px; flex-wrap:wrap; }
.tags span{ display:inline-flex; gap:8px; align-items:center; padding:8px 12px; border-radius:999px; border:1px solid #ffffff22; background:rgba(255,255,255,.06); font-weight:800; color:#d9e0ff; font-size:13px; }

.strip .counters{ display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
.counter{ text-align:center; padding:18px; border-radius:16px; border:1px solid #ffffff22; background:rgba(255,255,255,.05); box-shadow:var(--shadow); }
.counter .num{ font-size:28px; font-weight:900; }
.counter .lbl{ font-size:12px; color:#c7cfee; letter-spacing:.3px; text-transform:uppercase; margin-top:4px; }

.timeline{ display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:18px; }
.tl .badge{ width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#0b1022;font-weight:900;background:linear-gradient(135deg,var(--a),var(--b)); box-shadow:var(--shadow); margin-bottom:8px; }
.tl .y{ font-weight:900; opacity:.9; margin-bottom:2px; }

.badges{ display:flex; gap:12px; flex-wrap:wrap; justify-content:center; }
.chip{ border:1px solid #ffffff26; border-radius:999px; padding:10px 16px; background:rgba(255,255,255,.06); font-weight:800; }

.cta{ display:flex; align-items:center; justify-content:space-between; gap:20px; }
.cta h3{ margin:0 0 6px; font-size:22px; font-weight:900; }
.cta p{ margin:0; color:var(--muted); }
.btn{ display:inline-flex; align-items:center; gap:8px; padding:14px 22px; border-radius:14px; border:1px solid var(--card-brd); background:rgba(255,255,255,.06); color:#fff; font-weight:800; text-decoration:none; box-shadow:var(--shadow); }
.btn.primary{ border-color:transparent; background:linear-gradient(90deg,var(--a),var(--b)); color:#0b1022; }

/* Starfield */
.starfield{ position:fixed; inset:0; z-index:-2; }

/* Responsive */
@media (max-width:980px){
  .strip .counters{ grid-template-columns:repeat(2,1fr); }
}
@media (max-width:640px){
  .container{ padding:0 16px; }
  .strip .counters{ grid-template-columns:1fr; }
  .cta{ flex-direction:column; align-items:flex-start; }
}
`}</style>
  );
}
