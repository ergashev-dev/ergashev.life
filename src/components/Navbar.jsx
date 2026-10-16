import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ settings }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);
  const close = () => setOpen(false);
  return <header className={`os-nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
    <Link className="os-logo" to="/" onClick={close} aria-label="Ergashev home"><span>AE</span><b>ERGASHEV<br />DIGITAL</b></Link>
    <nav id="site-navigation" aria-label="Main navigation">
      <Link className={location.pathname === '/' ? 'active' : ''} to="/" onClick={close}>Home</Link>
      <Link className={location.pathname === '/projects' ? 'active' : ''} to="/projects" onClick={close}>Projects</Link>
      <Link className={location.pathname === '/blog' ? 'active' : ''} to="/blog" onClick={close}>Journal</Link>
      <Link className={location.pathname === '/about' ? 'active' : ''} to="/about" onClick={close}>About</Link>
      <a href={settings?.resume_file} target="_blank" rel="noreferrer" onClick={close}>Resume</a>
      <a className="mobile-nav-cta" href={settings?.phone} onClick={close}>Let’s talk <span aria-hidden="true">↗</span></a>
    </nav>
    <a className="nav-cta" href={settings?.phone}>Let’s talk <i>↗</i></a>
    <button className="nav-toggle" onClick={() => setOpen((value) => !value)} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="site-navigation"><span /><span /></button>
  </header>;
};
export default Navbar;
