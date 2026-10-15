import { ArrowUpRight, Blocks, Code2, Database, Download, FileText, Layers3, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import githubIcon from '../assets/icons/github.svg';
import linkedinIcon from '../assets/icons/linkedin.svg';
import InteriorHero from '../components/InteriorHero';
import profile from '../data/profile';
import useSEO from '../hooks/useSEO';

const About = () => {
  useSEO({ title: 'About Abdurashid Ergashev — Fullstack TypeScript Developer', description: 'Meet Abdurashid Ergashev, a fullstack TypeScript developer from Uzbekistan working with React, Next.js, NestJS, Node.js, PostgreSQL and MongoDB.', image: profile.image });
  return <main className="interior-page about-page">
    <InteriorHero index="02" eyebrow="ABOUT ME" title="Code with logic." accent="Design with feeling." description="I build products end to end — from the shape of the data to the feeling of the final interaction." />
    <section className="about-manifesto">
      <div className="about-portrait"><img src={profile.image} alt="Abdurashid Ergashev, fullstack developer from Uzbekistan" /><span className="portrait-glass">Based in<br /><b>Uzbekistan</b></span></div>
      <div className="about-story"><span className="overline dark">MY APPROACH</span><h2>I like hard problems<br />with simple outcomes.</h2><p>I am Abdurashid Ergashev, a fullstack developer focused on modern JavaScript and TypeScript products. I work across interface, API, database and automation layers to make the whole product feel coherent.</p><p>My current stack includes React, Next.js, NestJS, Node.js, PostgreSQL and MongoDB. I value clean architecture, secure ownership boundaries and details users should never have to think about.</p><a className="resume-card" href={profile.resume} target="_blank" rel="noreferrer"><FileText /><span><b>Professional resume</b><small>Experience, projects and technical expertise · PDF</small></span><Download /></a><div className="about-links"><a href={profile.github} target="_blank" rel="noreferrer"><img src={githubIcon} alt="" /><span>GitHub<small>@{profile.githubLabel}</small></span><ArrowUpRight /></a><a href={profile.linkedin} target="_blank" rel="noreferrer"><img src={linkedinIcon} alt="" /><span>LinkedIn<small>/{profile.linkedinLabel}</small></span><ArrowUpRight /></a><a href={profile.phone}><Phone /><span>Phone<small>{profile.phoneLabel}</small></span><ArrowUpRight /></a></div></div>
    </section>
    <section className="values-section"><div className="values-heading"><span className="overline">WHAT I VALUE</span><h2>Four rules.<br />Every build.</h2></div><div className="values-grid"><article><Code2 /><span>01</span><h3>Clarity</h3><p>Readable code and obvious interfaces beat clever complexity.</p></article><article><ShieldCheck /><span>02</span><h3>Trust</h3><p>Security and ownership belong in the architecture, not an afterthought.</p></article><article><Layers3 /><span>03</span><h3>Depth</h3><p>The experience is only as strong as the system supporting it.</p></article><article><Sparkles /><span>04</span><h3>Craft</h3><p>Small details turn functional software into a memorable product.</p></article></div></section>
    <section className="about-stack"><div><Blocks /><span>Frontend</span><b>React · Next.js · TypeScript</b></div><div><Database /><span>Backend</span><b>NestJS · Node.js · Data</b></div></section>
  </main>;
};
export default About;
