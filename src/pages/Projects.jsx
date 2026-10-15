import { useEffect } from 'react';
import { ArrowUpRight, BarChart3, Braces, MessageCircle, Sparkles, Workflow } from 'lucide-react';
import InteriorHero from '../components/InteriorHero';
import useSEO from '../hooks/useSEO';

const Projects = () => {
  useSEO({ title: 'Projects — Abdurashid Ergashev', description: 'Explore Chatly, an Instagram automation platform designed and engineered by Abdurashid Ergashev.' });
  useEffect(() => {
    const element = document.querySelector('.project-device');
    if (!element) return undefined;
    const move = (event) => { const box = element.getBoundingClientRect(); element.style.setProperty('--ry', `${((event.clientX - box.left) / box.width - .5) * 6}deg`); element.style.setProperty('--rx', `${-((event.clientY - box.top) / box.height - .5) * 6}deg`); };
    const leave = () => { element.style.setProperty('--ry', '0deg'); element.style.setProperty('--rx', '0deg'); };
    element.addEventListener('pointermove', move); element.addEventListener('pointerleave', leave);
    return () => { element.removeEventListener('pointermove', move); element.removeEventListener('pointerleave', leave); };
  }, []);
  return <main className="interior-page projects-page">
    <InteriorHero index="01" eyebrow="SELECTED PRODUCT" title="One project." accent="Built deeply." description="I would rather show one real product with depth than fill a page with work that is not mine." />
    <section className="project-detail">
      <div className="project-overview">
        <div className="project-label"><span className="chatly-symbol small">ϟ</span><div><small>FOUNDER PROJECT · 2026</small><h2>Chatly</h2></div></div>
        <p>Instagram bizneslari uchun conversations, keyword javoblari va comment-to-DM automation’ni bitta toza workspace’da boshqarishga yordam beradigan SaaS platforma.</p>
        <a className="ios-button primary" href="https://chatly.uz" target="_blank" rel="noreferrer">Open Chatly <ArrowUpRight /></a>
      </div>
      <div className="project-device" data-tilt>
        <div className="device-glow" /><div className="device-top"><i /><i /><i /><span>chatly.uz / dashboard</span><b>LIVE</b></div>
        <div className="device-body"><aside><span>ϟ</span><i className="active" /><i /><i /><i /></aside><div className="device-content"><header><div><small>WELCOME BACK</small><h3>Automation overview</h3></div><span>AE</span></header><div className="device-metrics"><article><MessageCircle /><small>CONVERSATIONS</small><b>Unified</b></article><article><Braces /><small>KEYWORDS</small><b>Active</b></article><article><BarChart3 /><small>ANALYTICS</small><b>Visible</b></article></div><div className="device-flow"><div><Sparkles /><span>Comment contains keyword</span></div><Workflow /><div><MessageCircle /><span>Send a direct message</span></div></div></div></div>
      </div>
    </section>
    <section className="project-breakdown">
      <div className="breakdown-heading"><span className="overline dark">PRODUCT ANATOMY</span><h2>From attention<br />to conversation.</h2></div>
      <div className="breakdown-grid"><article><span>01</span><h3>Connect</h3><p>Instagram account onboarding through a controlled OAuth flow.</p></article><article><span>02</span><h3>Automate</h3><p>Keyword and comment triggers turn repeat actions into reusable flows.</p></article><article><span>03</span><h3>Manage</h3><p>Conversations and account context live in one focused dashboard.</p></article><article><span>04</span><h3>Understand</h3><p>Operational states and analytics make automation visible.</p></article></div>
    </section>
    <section className="project-tech"><div><span>React</span><span>Node.js</span><span>MongoDB</span><span>Instagram API</span></div><p>Product design · Frontend · Backend · Integration</p></section>
  </main>;
};
export default Projects;
