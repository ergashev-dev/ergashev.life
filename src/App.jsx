import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import NotFound from './pages/NotFound';
import profile from './data/profile';

const settings = { resume_file: profile.resume, telegram_channel: profile.telegram, phone: profile.phone };

function App() {
  const location = useLocation();
  const [secretMode, setSecretMode] = useState(false);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [location.pathname]);
  useEffect(() => {
    const sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let index = 0;
    const onKeyDown = (event) => {
      index = event.key === sequence[index] ? index + 1 : 0;
      if (index === sequence.length) { setSecretMode((value) => !value); index = 0; }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
  useEffect(() => {
    const onPointerMove = (event) => {
      document.documentElement.style.setProperty('--cursor-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--cursor-y', `${event.clientY}px`);
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, []);

  return <div className={`site-shell ${secretMode ? 'secret-mode' : ''}`}>
    <Navbar settings={settings} />
    <Routes>
      <Route path="/" element={<Home />} /><Route path="/projects" element={<Projects />} />
      <Route path="/about" element={<About />} /><Route path="/blog" element={<BlogList settings={settings} />} />
      <Route path="/blog/:slug" element={<BlogPost settings={settings} />} /><Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    <Footer profile={profile} /><div className="cursor-aura" aria-hidden="true" />
    {secretMode && <div className="secret-toast">GOD MODE // unlocked</div>}
  </div>;
}
export default App;
