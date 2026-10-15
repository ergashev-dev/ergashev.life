import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ settings }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const close = () => setOpen(false);
  return <header className={`os-nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
    <Link className="os-logo" to="/" onClick={close} aria-label="Ergashev home"><span>AE</span><b>ERGASHEV<br />DIGITAL</b></Link>
    <nav aria-label="Main navigation">
      <Link className={location.pathname === '/' ? 'active' : ''} to="/" onClick={close}>Home</Link>
      <Link className={location.pathname === '/projects' ? 'active' : ''} to="/projects" onClick={close}>Projects</Link>
      <Link className={location.pathname === '/blog' ? 'active' : ''} to="/blog" onClick={close}>Journal</Link>
      <Link className={location.pathname === '/about' ? 'active' : ''} to="/about" onClick={close}>About</Link>
    </nav>
    <a className="nav-cta" href={settings?.telegram_channel} target="_blank" rel="noreferrer">Let’s talk <i>↗</i></a>
    <button className="nav-toggle" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation" aria-expanded={open}><span /><span /></button>
  </header>;
};
export default Navbar;
