import { lazy, Suspense, useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight, Asterisk, Bot, Braces, ChevronDown, Code2, Database, FileText, Layers3, MessageCircle, MousePointer2, Phone, Send, Sparkles } from 'lucide-react';
import githubIcon from '../assets/icons/github.svg';
import linkedinIcon from '../assets/icons/linkedin.svg';
import profile from '../data/profile';
import useSEO from '../hooks/useSEO';

const ThreeCore = lazy(() => import('../components/ThreeCore'));
const stack = [
  { mark: 'TS', name: 'TypeScript', note: 'Type-safe systems', color: '#3178c6' },
  { mark: 'JS', name: 'JavaScript', note: 'Web foundations', color: '#f7df1e' },
  { mark: 'N', name: 'NestJS', note: 'Scalable backends', color: '#e0234e' },
  { mark: '▲', name: 'Next.js', note: 'Full-stack React', color: '#f7f7f7' },
  { mark: '⚛', name: 'React', note: 'Interactive interfaces', color: '#61dafb' },
  { mark: '⬡', name: 'Node.js', note: 'Server runtime', color: '#68a063' },
  { mark: 'DB', name: 'PostgreSQL', note: 'Reliable data', color: '#53a5dd' },
  { mark: 'M', name: 'MongoDB', note: 'Flexible storage', color: '#4db33d' },
];

const Home = () => {
  const [time, setTime] = useState('');
  const [entered, setEntered] = useState(false);
  const [focusedTech, setFocusedTech] = useState('Interactive stack');
  const [scrollProgress, setScrollProgress] = useState(0);
  useSEO({ title: 'Abdurashid Ergashev — Fullstack TypeScript Developer', description: 'Fullstack developer from Uzbekistan crafting spatial interfaces, reliable backends and automation products with TypeScript, React, Next.js and NestJS.', image: profile.image });
  useEffect(() => {
    const update = () => setTime(new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tashkent', hour12: false }).format(new Date()));
    update(); const id = setInterval(update, 30000); return () => clearInterval(id);
  }, []);
  useEffect(() => {
    const intro = setTimeout(() => setEntered(true), 1350);
    const onTechFocus = (event) => {
      setFocusedTech(`${event.detail} selected`);
      setTimeout(() => setFocusedTech('Interactive stack'), 2400);
    };
    window.addEventListener('techfocus', onTechFocus);
    return () => { clearTimeout(intro); window.removeEventListener('techfocus', onTechFocus); };
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('visible')), { threshold: .12 });
    document.querySelectorAll('.fade-up').forEach((element) => observer.observe(element)); return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const onScroll = () => {
      const distance = document.documentElement.scrollHeight - innerHeight;
      setScrollProgress(distance > 0 ? (scrollY / distance) * 100 : 0);
    };
    const cleanups = [...document.querySelectorAll('[data-tilt]')].map((element) => {
      const move = (event) => {
        const box = element.getBoundingClientRect();
        element.style.setProperty('--ry', `${((event.clientX - box.left) / box.width - .5) * 7}deg`);
        element.style.setProperty('--rx', `${-((event.clientY - box.top) / box.height - .5) * 7}deg`);
      };
      const leave = () => { element.style.setProperty('--ry', '0deg'); element.style.setProperty('--rx', '0deg'); };
      element.addEventListener('pointermove', move); element.addEventListener('pointerleave', leave);
      return () => { element.removeEventListener('pointermove', move); element.removeEventListener('pointerleave', leave); };
    });
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    return () => { window.removeEventListener('scroll', onScroll); cleanups.forEach((cleanup) => cleanup()); };
  }, []);

  return <main className="liquid-home">
    <div className="scroll-rail" aria-hidden="true"><i style={{ height: `${scrollProgress}%` }} /><span>{Math.round(scrollProgress).toString().padStart(2, '0')}</span></div>
    <div className={`experience-intro ${entered ? 'is-finished' : ''}`} aria-hidden="true"><div className="intro-glow" /><div className="intro-mark"><span>AE</span><small>CRAFTING DIGITAL MATTER</small></div><div className="intro-progress"><i /></div></div>
    <section className="spatial-hero" id="home">
      <div className="aurora aurora-one" /><div className="aurora aurora-two" />
      <div className="hero-status glass-pill"><span className="live-dot" /> Available for selected work</div>
      <div className="hero-intro fade-up visible">
        <span className="overline">ABDURASHID ERGASHEV · FULLSTACK DEVELOPER · UZBEKISTAN</span>
        <h1>Ideas,<br /><span>made tangible.</span></h1>
        <p>I design and engineer digital products with the precision of code and the fluidity of imagination.</p>
        <div className="hero-buttons"><a href="#chatly" className="ios-button primary">Explore work <ArrowRight /></a><a href={profile.resume} target="_blank" rel="noreferrer" className="ios-button glass"><FileText /> View resume</a><a href={profile.telegram} target="_blank" rel="noreferrer" className="ios-button glass">Start a conversation <ArrowUpRight /></a></div>
      </div>
      <Suspense fallback={<div className="scene-loading">Rendering your experience…</div>}><ThreeCore /></Suspense>
      <div className="scene-guide glass-pill"><MousePointer2 /> Move to explore</div>
      <div className="tech-island glass-panel"><span className="island-wave"><i /><i /><i /><i /></span><div><small>THREE.JS · LIVE</small><b>{focusedTech}</b></div><span className="island-pulse" /></div>
      {focusedTech !== 'Interactive stack' && <div className="focus-card glass-panel"><small>TECHNOLOGY FOCUS</small><b>{focusedTech.replace(' selected', '')}</b><span>Part of my production stack</span></div>}
      <div className="spatial-badge badge-a glass-panel"><b>60 FPS</b><span>Realtime render</span></div>
      <div className="spatial-badge badge-b glass-panel"><b>8</b><span>Core technologies</span></div>
      <div className="hero-clock"><span>TASHKENT</span><b>{time}</b></div>
      <a className="scroll-cue" href="#stack"><span>Scroll to enter</span><ChevronDown /></a>
    </section>

    <section className="stack-section" id="stack">
      <div className="section-copy fade-up"><span className="overline dark">01 · MY TOOLKIT</span><h2>Technologies I<br /><em>think in.</em></h2><p>Not a logo wall. A connected system of tools I use to turn product ideas into dependable software.</p></div>
      <div className="stack-grid">
        {stack.map((item, index) => <article className="stack-card fade-up" data-tilt style={{ '--accent': item.color, '--delay': `${index * 60}ms` }} key={item.name}>
          <div className="stack-icon">{item.mark}</div><div><h3>{item.name}</h3><p>{item.note}</p></div><ArrowUpRight />
        </article>)}
      </div>
    </section>

    <div className="code-ribbon" aria-hidden="true"><div><span>TYPE → BUILD → SHIP → LEARN →</span><span> TYPESCRIPT / NESTJS / NEXT.JS / REACT / NODE →</span><span> TYPE → BUILD → SHIP → LEARN →</span><span> TYPESCRIPT / NESTJS / NEXT.JS / REACT / NODE →</span></div></div>

    <section className="chatly-section" id="chatly">
      <div className="chatly-glow" />
      <div className="chatly-heading fade-up"><span className="overline">02 · FEATURED PRODUCT</span><div className="chatly-title"><span className="chatly-symbol">ϟ</span><h2>Chatly</h2></div><p>Instagram automation, made beautifully simple.</p></div>
      <div className="product-stage fade-up">
        <div className="product-window" data-tilt>
          <div className="window-bar"><div><i /><i /><i /></div><span>app.chatly.uz</span><b>Connected</b></div>
          <div className="app-shell"><aside><span className="mini-brand">ϟ</span><i className="active" /><i /><i /><i /><i /></aside><div className="app-content"><div className="app-greeting"><div><small>GOOD MORNING</small><h3>Your automation is working.</h3></div><span className="profile-mini">AE</span></div><div className="metric-row"><div><MessageCircle /><span>Conversations</span><strong>Unified</strong></div><div><Braces /><span>Keywords</span><strong>Active</strong></div><div><Bot /><span>Automation</span><strong>Ready</strong></div></div><div className="flow-card"><div className="flow-label"><Sparkles /><span>Live automation</span><b>ON</b></div><div className="flow-nodes"><span><i>WHEN</i>Comment matches keyword</span><ArrowRight /><span><i>THEN</i>Send a direct message</span></div></div></div></div>
        </div>
        <div className="floating-note note-one glass-panel"><span>01</span><p>Keyword<br />automation</p></div><div className="floating-note note-two glass-panel"><span>02</span><p>Comment<br />to DM</p></div>
      </div>
      <div className="product-story fade-up"><p>Built from product strategy to production code — connecting Instagram accounts, conversations and automations in one focused workspace.</p><div className="product-tags"><span>React</span><span>Node.js</span><span>Instagram API</span><span>MongoDB</span></div><a href="https://chatly.uz" target="_blank" rel="noreferrer">Visit Chatly <ArrowUpRight /></a></div>
    </section>

    <section className="philosophy-section">
      <div className="portrait-orb fade-up"><img src={profile.image} alt="Abdurashid Ergashev, fullstack TypeScript developer" /><div className="portrait-ring" /></div>
      <div className="philosophy-copy fade-up"><span className="overline dark">03 · HOW I WORK</span><h2>Quiet interfaces.<br />Serious engineering.</h2><p>I care about what users feel and what servers endure. Every interaction should feel obvious; every system behind it should be secure, maintainable and ready to grow.</p><div className="principles"><span><Code2 /> Clean architecture</span><span><Layers3 /> Product thinking</span><span><Database /> Reliable data</span><span><Asterisk /> Precise details</span></div></div>
    </section>

    <section className="final-cta fade-up" id="contact">
      <div className="cta-orb" />
      <span className="overline">04 · LET’S BUILD</span>
      <h2>Your next idea<br />deserves depth.</h2>
      <p>Let’s turn it into something people remember.</p>
      <div className="contact-console glass-panel">
        <div className="contact-person">
          <img src={profile.image} alt="Abdurashid Ergashev" />
          <div><span><i /> AVAILABLE FOR SELECTED WORK</span><b>{profile.name}</b><small>{profile.role} · {profile.location}</small></div>
        </div>
        <div className="contact-actions">
          <a href={profile.github} target="_blank" rel="noreferrer"><img src={githubIcon} alt="" /><span>GitHub<small>@{profile.githubLabel}</small></span><ArrowUpRight /></a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer"><img src={linkedinIcon} alt="" /><span>LinkedIn<small>/{profile.linkedinLabel}</small></span><ArrowUpRight /></a>
          <a href={profile.phone}><Phone /><span>Call me<small>{profile.phoneLabel}</small></span><ArrowUpRight /></a>
        </div>
      </div>
      <a href={profile.telegram} target="_blank" rel="noreferrer" className="ios-button light"><Send /> Start a project</a>
    </section>
  </main>;
};
export default Home;
