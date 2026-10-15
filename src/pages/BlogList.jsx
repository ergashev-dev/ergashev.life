import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, BookOpen, Send } from 'lucide-react';
import { getTelegraphPageList } from '../utils/telegraph';
import InteriorHero from '../components/InteriorHero';
import useSEO from '../hooks/useSEO';

const formatDate = (path) => {
  const parts = path.split('-');
  const monthNumber = Number(parts.at(-2));
  const day = Number(parts.at(-1));
  if (monthNumber >= 1 && monthNumber <= 12 && day) return `${day.toString().padStart(2, '0')} ${new Date(2026, monthNumber - 1).toLocaleString('en', { month: 'short' }).toUpperCase()}`;
  return 'JOURNAL';
};

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  useSEO({ title: 'Engineering Journal — Abdurashid Ergashev', description: 'Engineering notes by Abdurashid Ergashev about TypeScript, fullstack development, product decisions, automation and lessons from building Chatly.' });
  useEffect(() => {
    let mounted = true;
    getTelegraphPageList((fresh) => mounted && fresh && setPosts(fresh)).then((items) => mounted && setPosts(items || [])).catch(() => {}).finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);
  return <main className="interior-page journal-page">
    <InteriorHero index="03" eyebrow="JOURNAL" title="Thoughts in" accent="progress." description="Notes about engineering, product decisions and the useful lessons hidden inside difficult builds." />
    <section className="journal-content">
      <div className="journal-intro"><span className="overline dark">LATEST WRITING</span><h2>Ideas worth<br />keeping.</h2><p>No content treadmill. Just things I learned deeply enough to explain.</p><a href="https://t.me/ergashevdev" target="_blank" rel="noreferrer"><Send /> Follow on Telegram</a></div>
      <div className="journal-list">
        {loading ? [1,2,3,4].map((item) => <div className="journal-skeleton" key={item}><i /><span /></div>) : posts.length ? posts.map((post, index) => <Link className="journal-card" to={`/blog/${post.path}`} key={post.path}><span className="journal-number">{(index + 1).toString().padStart(2, '0')}</span><div><small>{formatDate(post.path)}</small><h3 dangerouslySetInnerHTML={{ __html: post.title }} />{post.description && <p>{post.description}</p>}</div><ArrowUpRight /></Link>) : <div className="journal-empty"><BookOpen /><h3>The next thought is being written.</h3><p>Fresh notes will appear here. Until then, follow the Telegram channel.</p></div>}
      </div>
    </section>
  </main>;
};
export default BlogList;
