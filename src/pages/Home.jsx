import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, BarChart3, KeyRound, Mail, MessageCircle, Send } from 'lucide-react';
import { projects } from '../data/projects';
import profilePic from '../assets/images/ergashev.jpg';
import useSEO from '../hooks/useSEO';

const ThreeCore = lazy(() => import('../components/ThreeCore'));

const skills = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'REST API', 'MongoDB', 'PostgreSQL', 'Telegram Bots'];
const commands = {
  help: 'Available: about, skills, projects, contact, clear',
  about: 'Fullstack developer from Uzbekistan. I turn complex problems into clear, reliable products.',
  skills: 'JavaScript · TypeScript · React · Node.js · REST APIs · MongoDB · PostgreSQL',
  projects: 'Chatly — Instagram automation platform · chatly.uz',
  contact: 'Telegram: @ergashevdev · GitHub: ergashev-dev',
};

function BootScreen({ onDone }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const started = window.setInterval(() => setProgress((value) => Math.min(value + 4, 100)), 28);
    const finished = window.setTimeout(onDone, 1050);
    return () => { window.clearInterval(started); window.clearTimeout(finished); };
  }, [onDone]);
  return <div className="boot-screen" aria-live="polite">
    <div className="boot-mark">AE<span>_</span></div><p>INITIALIZING ERGASHEV OS</p>
    <div className="boot-track"><span style={{ width: `${progress}%` }} /></div>
    <small>{progress.toString().padStart(3, '0')}% / SYSTEM READY</small>
  </div>;
}

function Terminal() {
  const [history, setHistory] = useState([{ command: 'welcome', output: 'Type “help” and press Enter.' }]);
  const [value, setValue] = useState('');
  const submit = (event) => {
    event.preventDefault(); const command = value.trim().toLowerCase(); if (!command) return;
    if (command === 'clear') setHistory([]);
    else setHistory((items) => [...items, { command, output: commands[command] || `Command not found: ${command}` }]);
    setValue('');
  };
  return <div className="terminal-window reveal">
    <div className="terminal-bar"><span /><span /><span /><b>ergashev@portfolio:~</b></div>
    <div className="terminal-body">
      {history.map((item, index) => <div className="terminal-line" key={`${item.command}-${index}`}><p><i>➜</i> ~ {item.command}</p><span>{item.output}</span></div>)}
      <form onSubmit={submit}><label htmlFor="terminal-input">➜ ~</label><input id="terminal-input" value={value} onChange={(event) => setValue(event.target.value)} autoComplete="off" spellCheck="false" aria-label="Terminal command" /></form>
    </div>
  </div>;
}

const Home = () => {
  const [booted, setBooted] = useState(() => sessionStorage.getItem('ergashev-booted') === 'yes');
  const finishBoot = useCallback(() => { sessionStorage.setItem('ergashev-booted', 'yes'); setBooted(true); }, []);
  useSEO({ title: 'Abdurashid Ergashev — Fullstack Developer', description: 'Fullstack developer from Uzbekistan building reliable digital products, REST APIs, dashboards and automation.' });
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')), { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [booted]);
  if (!booted) return <BootScreen onDone={finishBoot} />;

  return <main className="os-home">
    <section className="hero-panel" id="home">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-copy reveal is-visible">
        <div className="eyebrow"><span /> AVAILABLE FOR SELECT PROJECTS · 2026</div>
        <h1>I turn ideas into<br /><em>digital experiences.</em></h1>
        <p>Fullstack developer from Uzbekistan building fast, thoughtful products where strong engineering meets clean interaction.</p>
        <div className="hero-actions"><a className="os-button os-button--solid" href="#work">Explore my work <ArrowDownRight size={17} /></a><a className="os-button" href="https://t.me/ergashevdev" target="_blank" rel="noreferrer">Start a project <ArrowUpRight size={17} /></a></div>
        <div className="hero-metrics"><div><strong>01</strong><span>Focused product</span></div><div><strong>360°</strong><span>Product thinking</span></div><div><strong>UZ</strong><span>Based in Uzbekistan</span></div></div>
      </div>
      <div className="core-stage reveal is-visible" aria-label="Interactive technology core">
        <Suspense fallback={<div className="three-loader">Loading 3D engine…</div>}><ThreeCore /></Suspense>
        <div className="core-caption"><span>LIVE</span> THREE.JS ENGINE / MOVE YOUR CURSOR</div>
      </div>
    </section>

    <section className="manifesto section-pad reveal"><div className="section-index">01 / APPROACH</div><p>Not just websites.</p><h2>I design the feeling between a click and a result — then engineer the system behind it.</h2></section>

    <section className="work-section section-pad" id="work">
      <div className="section-heading reveal"><div><span className="section-index">02 / FOUNDER PROJECT</span><h2>One product.<br />Built with intent.</h2></div><a href="https://chatly.uz/" target="_blank" rel="noreferrer">Visit Chatly <ArrowUpRight size={18} /></a></div>
      <a className="chatly-case reveal" href="https://chatly.uz/" target="_blank" rel="noreferrer">
        <div className="chatly-brand"><span className="chatly-bolt">ϟ</span><div><b>Chatly</b><small>Instagram automation, made clear.</small></div></div>
        <div className="chatly-dashboard">
          <div className="mock-sidebar"><span className="mock-logo">ϟ</span><i /><i /><i /><i /></div>
          <div className="mock-main"><div className="mock-top"><span>Overview</span><b>Live</b></div><div className="mock-stats"><span><KeyRound /> Keyword automation<strong>Active</strong></span><span><MessageCircle /> Conversations<strong>Unified</strong></span><span><BarChart3 /> Analytics<strong>Visible</strong></span></div><div className="mock-flow"><div><i>WHEN</i><p>Comment contains keyword</p></div><em>→</em><div><i>THEN</i><p>Send a direct message</p></div></div></div>
        </div>
        <div className="chatly-story"><span className="project-number">01 / CHATLY.UZ</span><h3>Turn Instagram attention<br />into conversations.</h3><p>{projects[0].description}</p><div className="project-tags">{projects[0].tags.map((tag) => <span key={tag}>{tag}</span>)}</div><div className="case-link">Explore product <ArrowUpRight /></div></div>
      </a>
    </section>

    <section className="skills-section section-pad" id="skills">
      <div className="skills-copy reveal"><span className="section-index">03 / CAPABILITIES</span><h2>One developer.<br />The whole stack.</h2><p>From the first data model to the last interaction, I build cohesive products without losing sight of performance, simplicity or people.</p><div className="skill-pills">{skills.map((skill) => <span key={skill}>{skill}</span>)}</div></div>
      <div className="skill-orbit reveal" aria-label="Technology orbit"><div className="orbit-center"><img src={profilePic} alt="Abdurashid Ergashev" /><span>AE</span></div>{skills.slice(0, 6).map((skill, index) => <span className={`satellite satellite-${index + 1}`} key={skill}>{skill}</span>)}</div>
    </section>

    <section className="terminal-section section-pad" id="terminal"><div className="terminal-intro reveal"><span className="section-index">04 / PLAYGROUND</span><h2>Ask the system.</h2><p>A small command line for curious visitors. Try <code>about</code>, <code>skills</code> or <code>projects</code>.</p></div><Terminal /></section>

    <section className="contact-section section-pad reveal" id="contact"><div className="contact-noise" /><span className="section-index">05 / NEXT MOVE</span><h2>Have a hard problem?<br /><em>Let’s make it look easy.</em></h2><div className="contact-actions"><a className="os-button os-button--light" href="https://t.me/ergashevdev" target="_blank" rel="noreferrer"><Send size={18} /> Message on Telegram</a><a className="os-button" href="mailto:hello@ergashev.life"><Mail size={18} /> Send an email</a><a className="icon-link" href="https://github.com/ergashev-dev" target="_blank" rel="noreferrer" aria-label="GitHub">GH</a></div><p className="easter-hint">Psst — old-school gamers know the code ↑ ↑ ↓ ↓ ← → ← → B A</p></section>
  </main>;
};
export default Home;
