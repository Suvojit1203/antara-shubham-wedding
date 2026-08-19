import { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, ChevronDown, Heart, MapPin, Menu, Music, Pause, Send, X } from 'lucide-react';
import { wedding } from './data/wedding';

const fmt = (n) => String(n).padStart(2, '0');

function Countdown() {
  const target = useMemo(() => new Date(wedding.date), []);
  const [left, setLeft] = useState(() => Math.max(0, target - Date.now()));
  useEffect(() => { const id = setInterval(() => setLeft(Math.max(0, target - Date.now())), 1000); return () => clearInterval(id); }, [target]);
  const d = Math.floor(left / 86400000), h = Math.floor(left / 3600000) % 24, m = Math.floor(left / 60000) % 60, s = Math.floor(left / 1000) % 60;
  return <div className="countdown" aria-label="Countdown to the wedding">{[[d,'Days'],[h,'Hours'],[m,'Minutes'],[s,'Seconds']].map(([v,l]) => <div key={l}><b>{fmt(v)}</b><span>{l}</span></div>)}</div>;
}

function Petals({ active }) { return active && <div className="petals" aria-hidden="true">{Array.from({ length: 28 }, (_, i) => <i key={i} style={{ '--i': i, '--x': `${(i * 37) % 100}%`, '--d': `${3 + (i % 5) * .55}s`, '--delay': `${(i % 9) * .14}s` }} />)}</div>; }

function Ornament() { return <div className="ornament" aria-hidden="true"><span>✦</span><i></i><span>✦</span></div>; }

function Opening({ onOpen, onPlayMusic }) {
  const [opening, setOpening] = useState(false);
  const open = () => { if (opening) return; onPlayMusic(); setOpening(true); window.setTimeout(onOpen, 2800); };
  return <section className={`opening ${opening ? 'is-opening' : ''}`} aria-label="Open the wedding invitation">
    <Petals active={opening} /><img className="opening-image" src="/images/opening-invitation.png" alt="Wedding invitation for Antara Das and Shubham Mukherjee" />
    <button className="opening-image-button" onClick={open} aria-label="Open Antara and Shubham's wedding invitation"><span className="sr-only">Tap to open</span></button>
  </section>;
}

function App() {
  const [opened, setOpened] = useState(false), [menu, setMenu] = useState(false), [playing, setPlaying] = useState(false), [progress, setProgress] = useState(0), [submitted, setSubmitted] = useState(false);
  const audio = useRef(null);
  useEffect(() => { const update = () => setProgress(100 * window.scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)); window.addEventListener('scroll', update, { passive:true }); update(); return () => window.removeEventListener('scroll', update); }, []);
  useEffect(() => {
    if (!opened || !('IntersectionObserver' in window)) return;
    const sections = document.querySelectorAll('.section:not(.hero)');
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: .12 });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [opened]);
  const begin = () => setOpened(true);
  const startMusic = () => { if (wedding.music.src && audio.current) audio.current.play().then(()=>setPlaying(true)).catch(()=>{}); };
  const toggleAudio = () => { if (!wedding.music.src || !audio.current) return; if (playing) { audio.current.pause(); setPlaying(false); } else audio.current.play().then(()=>setPlaying(true)).catch(()=>{}); };
  const nav = ['Home','Details','Our Story','Gallery']; const go = (id) => { document.getElementById(id)?.scrollIntoView({behavior:'smooth'}); setMenu(false); };
  return <>{wedding.music.src && <audio ref={audio} loop preload="none" src={wedding.music.src}/>}<div className="progress" style={{width:`${progress}%`}} />
    {!opened && <Opening onOpen={begin} onPlayMusic={startMusic}/>} {opened && <main className="site-enter">
      <header><button className="brand" onClick={()=>go('home')} aria-label="Back to top">A<span>&</span>S</button><nav className={menu ? 'show' : ''}>{nav.map(x => <button key={x} onClick={()=>go(x === 'Our Story' ? 'story' : x.toLowerCase())}>{x}</button>)}</nav><button className="menu" onClick={()=>setMenu(!menu)} aria-label="Toggle navigation">{menu?<X/>:<Menu/>}</button></header>
      <section className="hero section" id="home"><div className="hanging-bells" aria-hidden="true">⌇❦⌇</div><p className="eyebrow">We joyfully invite you to celebrate</p><h1>Antara <em>&</em><br/> Shubham</h1><Ornament/><p className="hero-copy">Begin a beautiful new chapter with us</p><div className="date-card"><CalendarDays size={20}/><div><b>{wedding.displayDate}</b><span>{wedding.day}</span></div></div><a href="#details" className="scroll-cue">Discover our celebration <ChevronDown size={16}/></a></section>
      <section className="section family" id="details"><p className="eyebrow">With the blessings of</p><h2>Two families, one celebration</h2><Ornament/><div className="family-grid family-grid-photo"><article><p className="side-label">Groom's family</p><h3>{wedding.groom.name}</h3><p>Son of</p><b>{wedding.groom.father}</b><b>{wedding.groom.mother}</b></article><figure className="family-hands"><img src="/images/hands.jpeg" alt="The couple's hands together" loading="lazy" decoding="async"/></figure><article><p className="side-label">Bride's family</p><h3>{wedding.bride.name}</h3><p>Daughter of</p><b>{wedding.bride.father}</b><b>{wedding.bride.mother}</b></article></div></section>
      <section className="section details"><p className="eyebrow">Mark your calendar</p><h2>Celebration dates</h2><Ornament/><p className="celebration-intro">Come celebrate every beautiful moment with us</p><div className="event-grid">{wedding.events.map(e=><article key={e.title}><i>{e.icon}</i><h3>{e.title}</h3><p>{e.date}</p><b>{e.time}</b></article>)}</div><Countdown/></section>
      <section className="section story" id="story"><div className="story-photo"><img src="/images/couple-portrait.jpeg" alt="Antara and Shubham" loading="lazy" decoding="async"/></div><div><p className="eyebrow">Our story</p><h2>Written in the stars,<br/>celebrated with love</h2><Ornament/><p>With grateful hearts, we invite you to join our families as we celebrate a promise of forever. Your blessings and presence will make our day truly complete.</p><Heart size={24} fill="currentColor"/></div></section>
      <section className="section gallery" id="gallery"><p className="eyebrow">Moments to cherish</p><h2>Our gallery</h2><p className="placeholder-note">Photo placeholders — add image paths in <code>src/data/wedding.js</code>.</p><div className="gallery-grid">{wedding.photos.map(photo=><figure className={`photo ${photo.gradient}`} key={photo.label}>{photo.src ? <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async"/> : <div className="placeholder-photo" role="img" aria-label={photo.alt}>✦<span>{photo.label}</span></div>}</figure>)}</div></section>
      <section className="section venue"><p className="eyebrow">Where we celebrate</p><h2>Join us here</h2><div className="venue-list">{wedding.venues.map((venue, index)=><div className="venue-card" key={venue.name}><MapPin/><div><small>{index === 0 ? 'Wedding Ceremony · 26 November 2026' : 'Reception · 28 November 2026'}</small><h3>{venue.name}</h3><p>{venue.address}</p></div><a href={venue.mapUrl} target="_blank" rel="noreferrer">Get directions</a></div>)}</div></section>
      <section className="section greeting"><div className="greeting-sparkles" aria-hidden="true">✦ ✧ ✦ ✧ ✦</div><p className="eyebrow">A heartfelt invitation</p><h2>We would be honoured<br/>by your presence</h2><Ornament/><p>Come witness the beginning of our forever, and make our celebration more beautiful with your blessings.</p><strong>We cannot wait to celebrate with you.<br/><em>Meet you soon!</em></strong></section>
      <footer><div>❦</div><h2>Antara <em>&</em> Shubham</h2><p>With love, gratitude, and joy</p><span>26 November 2026</span></footer>
      <button className="music-toggle" onClick={toggleAudio} aria-label={playing ? 'Pause music' : 'Play music'} title={wedding.music.src ? wedding.music.label : 'Add a music file in the wedding config'}>{playing ? <Pause size={17}/> : <Music size={17}/>}<span>{playing ? 'Pause music' : wedding.music.src ? 'Play music' : 'Add music'}</span></button>
    </main>}</>;
}
export default App;
