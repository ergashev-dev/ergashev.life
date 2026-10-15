import { ArrowUpRight, Blocks, Code2, Database, Layers3, ShieldCheck, Sparkles } from 'lucide-react';
import profilePic from '../assets/images/ergashev.jpg';
import InteriorHero from '../components/InteriorHero';
import useSEO from '../hooks/useSEO';

const About = () => {
  useSEO({ title: 'About — Abdurashid Ergashev', description: 'Fullstack developer from Uzbekistan working with TypeScript, JavaScript, React, Next.js, NestJS and Node.js.' });
  return <main className="interior-page about-page">
    <InteriorHero index="02" eyebrow="ABOUT ME" title="Code with logic." accent="Design with feeling." description="I build products end to end — from the shape of the data to the feeling of the final interaction." />
    <section className="about-manifesto">
      <div className="about-portrait"><img src={profilePic} alt="Abdurashid Ergashev" /><span className="portrait-glass">Based in<br /><b>Uzbekistan</b></span></div>
      <div className="about-story"><span className="overline dark">MY APPROACH</span><h2>I like hard problems<br />with simple outcomes.</h2><p>I am Abdurashid Ergashev, a fullstack developer focused on modern JavaScript and TypeScript products. I work across interface, API, database and automation layers to make the whole product feel coherent.</p><p>My current stack includes React, Next.js, NestJS, Node.js, PostgreSQL and MongoDB. I value clean architecture, secure ownership boundaries and details users should never have to think about.</p><a href="https://t.me/ergashevdev" target="_blank" rel="noreferrer">Let’s connect <ArrowUpRight /></a></div>
    </section>
    <section className="values-section"><div className="values-heading"><span className="overline">WHAT I VALUE</span><h2>Four rules.<br />Every build.</h2></div><div className="values-grid"><article><Code2 /><span>01</span><h3>Clarity</h3><p>Readable code and obvious interfaces beat clever complexity.</p></article><article><ShieldCheck /><span>02</span><h3>Trust</h3><p>Security and ownership belong in the architecture, not an afterthought.</p></article><article><Layers3 /><span>03</span><h3>Depth</h3><p>The experience is only as strong as the system supporting it.</p></article><article><Sparkles /><span>04</span><h3>Craft</h3><p>Small details turn functional software into a memorable product.</p></article></div></section>
    <section className="about-stack"><div><Blocks /><span>Frontend</span><b>React · Next.js · TypeScript</b></div><div><Database /><span>Backend</span><b>NestJS · Node.js · Data</b></div></section>
  </main>;
};
export default About;
