// src/pages/Home.jsx
import { useEffect, useRef } from "react";
import { motion as m } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiCpu, FiActivity, FiShield, FiLayers, FiArrowRight, FiCheck
} from "react-icons/fi";
import heroImg from "../images/vrtedavi.jpg";

const fade = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

export default function Home() {
  // Global parallax (fareye hafif tepki)
  useEffect(() => {
    const onMove = (e) => {
      const mx = (e.clientX / window.innerWidth - 0.5).toFixed(3);
      const my = (e.clientY / window.innerHeight - 0.5).toFixed(3);
      document.documentElement.style.setProperty("--mx", mx);
      document.documentElement.style.setProperty("--my", my);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="home-dark">
      <Starfield />
      <Hero />
      <Highlights />
      <Areas />
      <Steps />
      <Ribbon />
      <CTA />
      <Styles />
    </div>
  );
}

/* ---------------- STARFIELD (canvas) ---------------- */
function Starfield() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, dpr = Math.max(1, window.devicePixelRatio || 1);
    const STARS = 170;
    let stars = [];
    let rafId;

    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // yeniden üret
      stars = new Array(STARS).fill(0).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: 0.4 + Math.random() * 0.8,        // parlaklık
        vx: (Math.random() - 0.5) * 0.15,     // yavaş sürüklenme
        vy: (Math.random() - 0.5) * 0.15,
        r: 0.3 + Math.random() * 1.7
      }));
    };

    const step = (t) => {
      ctx.clearRect(0, 0, w, h);

      // derin mor uzay gradyanı
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#0b1022");
      g.addColorStop(1, "#171a31");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // çok hafif aurora
      const rg = ctx.createRadialGradient(w * 0.8, h * 0.25, 30, w * 0.8, h * 0.25, 420);
      rg.addColorStop(0, "rgba(139,92,246,0.20)");
      rg.addColorStop(1, "transparent");
      ctx.fillStyle = rg;
      ctx.beginPath(); ctx.arc(w * 0.8, h * 0.25, 420, 0, Math.PI * 2); ctx.fill();

      // yıldızlar
      ctx.fillStyle = "#cdd8ff";
      stars.forEach((s, i) => {
        s.x += s.vx; s.y += s.vy;
        if (s.x < -5) s.x = w + 5; if (s.x > w + 5) s.x = -5;
        if (s.y < -5) s.y = h + 5; if (s.y > h + 5) s.y = -5;

        const tw = 0.5 + Math.sin((t / 500 + i) % (Math.PI * 2)) * 0.25 * s.z;
        ctx.globalAlpha = 0.6 * s.z + tw * 0.4;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * (0.6 + s.z * 0.6), 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // yavaş kayan parçacık çizgileri (shooting-star hissi)
      if (Math.random() < 0.007) {
        const sx = Math.random() * w * 0.8 + w * 0.1;
        const sy = Math.random() * h * 0.4 + h * 0.05;
        ctx.strokeStyle = "rgba(255,255,255,.7)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx - 60, sy + 16);
        ctx.stroke();
      }

      rafId = requestAnimationFrame(step);
    };

    resize();
    window.addEventListener("resize", resize);
    rafId = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(rafId); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={ref} className="starfield" aria-hidden />;
}

/* ---------------- HERO ---------------- */
function Hero() {
  return (
    <section className="hero full">
      <div className="container hero-grid">
        <m.div className="hero-left" initial="hidden" animate="visible" variants={stagger}>
          <m.h1 variants={fade} className="hero-title">
            Sanal Gerçeklikle <span className="grad">kişiye özel</span> terapi deneyimi
          </m.h1>
          <m.p variants={fade} className="hero-sub">
            Yapay zekâ destekli VRTedavi; EEG verileri ve klinisyen gözetimiyle
            <strong> uyarlanabilir</strong> VR seansları sunar.
          </m.p>
          <m.div variants={fade} className="cta-row">
            <Link to="/login" className="btn primary">Klinisyen Girişi <FiArrowRight/></Link>
            <Link to="/about" className="btn ghost">Hakkımızda</Link>
          </m.div>
        </m.div>

        <m.div
          className="hero-media"
          initial={{ opacity: 0, x: 24, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="media">
            <img src={heroImg} alt="VR Tedavi" />
            <span className="glow" />
          </div>
        </m.div>
      </div>
    </section>
  );
}

/* ---------------- HIGHLIGHTS ---------------- */
function Highlights() {
  const items = [
    { icon: <FiCpu/>, title: "AI Destekli Protokoller", text: "Seans akışını veriye göre uyarlayan akıllı planlama." },
    { icon: <FiActivity/>, title: "Gerçek Zamanlı EEG", text: "Nöro-yanıtı izleyip terapötik uyaranları optimize eder." },
    { icon: <FiLayers/>, title: "Çoklu Alan", text: "Ağrı, ruh sağlığı, fiziksel rehab ve bilişsel eğitim modülleri." },
    { icon: <FiShield/>, title: "Klinik Güvence", text: "Klinisyen gözetimi ve kanıta dayalı yaklaşımlar." },
  ];
  return (
    <section className="section dim">
      <div className="container">
        <m.div className="grid cards" initial="hidden" whileInView="visible" viewport={{ once:true, amount:.25 }} variants={stagger}>
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

/* ---------------- AREAS ---------------- */
function Areas() {
  const a = ["Ağrı Yönetimi","Ruh Sağlığı","Fiziksel Rehabilitasyon","Bilişsel Eğitim","Dikkat / Mindfulness","Nörolojik Rehabilitasyon"];
  return (
    <section className="section">
      <div className="container">
        <m.h2 className="title" initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
          Terapötik Alanlar
        </m.h2>
        <m.div className="grid pills" initial="hidden" whileInView="visible" viewport={{once:true, amount:.25}} variants={stagger}>
          {a.map((x,i)=>(<m.div key={i} className="pill" variants={fade}>{x}</m.div>))}
        </m.div>
      </div>
    </section>
  );
}

/* ---------------- STEPS ---------------- */
function Steps() {
  const s = [
    { n:1, t:"Değerlendirme", d:"Klinisyen rehberliğinde başlangıç ölçümleri ve hedefler." },
    { n:2, t:"Kişiselleştirilmiş Seans", d:"EEG + VR ile anlık nöro-yanıta göre uyarlanabilir sahneler." },
    { n:3, t:"İzlem & Raporlama", d:"Seans verileri; ilerleme ve geri bildirim ile raporlanır." },
  ];
  return (
    <section className="section dim">
      <div className="container">
        <m.h2 className="title" initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
          Nasıl Çalışır?
        </m.h2>
        <div className="grid steps">
          {s.map((k,i)=>(
            <m.div key={i} className="card step" initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.07}}>
              <div className="badge">{k.n}</div>
              <div className="t1">{k.t}</div>
              <div className="t2">{k.d}</div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- RIBBON ---------------- */
function Ribbon() {
  const chips = ["Teknokent","CE VR Tech","EEG Ready","Klinik Gözetim","Gizlilik & Güvenlik"];
  return (
    <section className="ribbon">
      <div className="container">
        <div className="band">
          <div className="band-head"><FiCheck/> Güven ve Uyum Etiketlerimiz</div>
          <div className="band-chips">
            {chips.map((c,i)=>(<span key={i} className="chip">{c}</span>))}
          </div>
          <span className="sheen" aria-hidden />
        </div>
      </div>
    </section>
  );
}

/* ---------------- CTA ---------------- */
function CTA() {
  return (
    <section className="section">
      <div className="container">
        <m.div className="card cta" initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
          <div>
            <h3>Projeyi kliniğinizde denemek ister misiniz?</h3>
            <p>Demo ve entegrasyon için bizimle iletişime geçin.</p>
          </div>
          <div className="cta-actions">
            <Link to="/about" className="btn primary">Daha Fazla Bilgi</Link>
            <a href="mailto:info@vrtedavi.com" className="btn ghost">E-posta Gönder</a>
          </div>
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
.home-dark{ color:var(--fg); background:linear-gradient(180deg,var(--bg1),var(--bg2)); overflow-x:hidden; }
.full{ width:100vw; margin-left:calc(50% - 50vw); }
.container{ max-width:1200px; margin:0 auto; padding:0 20px; }
.section{ padding:76px 0; }
.section.dim{ padding:76px 0; background:linear-gradient(180deg,rgba(255,255,255,.02),rgba(255,255,255,.01)); }
.title{ text-align:center; font-size:clamp(24px,4vw,34px); font-weight:900; margin:0 0 26px; }

/* Starfield canvas */
.starfield{ position:fixed; inset:0; z-index:-2; }

/* HERO */
.hero{ padding:96px 0 48px; position:relative; }
.hero-grid{ display:grid; gap:32px; grid-template-columns:1.1fr .9fr; align-items:center; }
.hero-title{ font-size:clamp(36px,5.4vw,64px); line-height:1.06; margin:0 0 16px; font-weight:900; letter-spacing:.2px; }
.grad{ background:linear-gradient(90deg,var(--a),var(--b)); -webkit-background-clip:text; background-clip:text; color:transparent; }
.hero-sub{ color:var(--muted); font-size:clamp(16px,2.1vw,18px); max-width:680px; line-height:1.65; margin:0 0 26px; }
.cta-row{ display:flex; gap:14px; flex-wrap:wrap; align-items:center; }

.btn{ display:inline-flex; align-items:center; gap:8px; font-weight:800;
  padding:14px 22px; border-radius:14px; border:1px solid var(--card-brd);
  background:#0d1326; box-shadow:var(--shadow); color:var(--fg); text-decoration:none; transition:all .2s; }
.btn:hover{ transform:translateY(-2px); box-shadow:var(--shadow2); }
.btn.primary{ color:#0b1022; border-color:transparent; background:linear-gradient(90deg,var(--a),var(--b)); }
.btn.ghost{ background:rgba(255,255,255,.06); }

.hero-media{ position:relative; transform:translate3d(calc(var(--mx,0)*-24px),calc(var(--my,0)*-18px),0); }
.media{ position:relative; border-radius:20px; overflow:hidden; transform:rotate(-.6deg); box-shadow:0 20px 60px rgba(0,0,0,.55); }
.media img{ display:block; width:100%; height:auto; object-fit:cover; }
.media .glow{ position:absolute; inset:-22%; border-radius:30px; background:radial-gradient(600px 260px at 70% 22%, #8b5cf655, transparent 70%); pointer-events:none; }

/* Cards */
.grid{ display:grid; gap:22px; }
.cards{ grid-template-columns:repeat(auto-fit,minmax(250px,1fr)); }
.card{ background:var(--card); border:1px solid var(--card-brd); border-radius:18px; padding:24px; backdrop-filter:blur(10px); box-shadow:var(--shadow); transition:transform .2s, box-shadow .2s; }
.card:hover{ transform:translateY(-4px); box-shadow:var(--shadow2); }
.ic{ font-size:34px; color:#8ea4ff; margin-bottom:12px; }
.t1{ font-weight:900; font-size:18px; margin-bottom:6px; }
.t2{ color:var(--muted); font-size:14px; }

/* Pills */
.pills{ grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); }
.pill{ padding:14px 18px; text-align:center; border-radius:999px; font-weight:800;
  background:#0f1630; border:1px solid var(--card-brd); box-shadow:var(--shadow); }
.pill:hover{ border-color:#8ea4ff; transform:translateY(-2px); }

/* Steps */
.steps{ grid-template-columns:repeat(auto-fit,minmax(290px,1fr)); }
.step{ text-align:center; position:relative; }
.badge{ width:52px;height:52px;border-radius:50%;margin:0 auto 12px;display:flex;align-items:center;justify-content:center;color:#0b1022;font-weight:900;background:linear-gradient(135deg,var(--a),var(--b)); box-shadow:var(--shadow); }

/* Ribbon */
.ribbon{ padding:42px 0; }
.band{ position:relative; overflow:hidden; border-radius:20px; padding:22px; background:linear-gradient(135deg,#1b1f36,#0f1326); border:1px solid #ffffff22; box-shadow:var(--shadow); }
.band-head{ display:flex; align-items:center; gap:10px; font-weight:900; letter-spacing:.2px; margin-bottom:12px; }
.band-chips{ display:flex; gap:12px; flex-wrap:wrap; }
.chip{ border:1px solid #ffffff26; border-radius:999px; padding:10px 16px; background:rgba(255,255,255,.06); font-weight:800; }
.sheen{ position:absolute; top:0; left:-30%; width:30%; height:100%; background:linear-gradient(100deg, transparent, rgba(255,255,255,.10), transparent); transform:skewX(-15deg); animation:sheen 4.2s ease-in-out infinite; }
@keyframes sheen{ 0%{left:-30%} 60%{left:130%} 100%{left:130%} }

/* CTA */
.cta{ display:flex; align-items:center; justify-content:space-between; gap:22px; }
.cta h3{ margin:0 0 6px; font-size:24px; font-weight:900; }
.cta p{ margin:0; color:var(--muted); }

/* Responsive */
@media (max-width:980px){
  .hero-grid{ grid-template-columns:1fr; }
  .hero-media{ order:-1; }
}
@media (max-width:768px){
  .container{ padding:0 16px; }
  .btn{ padding:12px 18px; border-radius:12px; }
  .cta{ flex-direction:column; align-items:flex-start; }
}
`}</style>
  );
}
