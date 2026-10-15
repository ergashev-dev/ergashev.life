import { ArrowLeft, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import useSEO from '../hooks/useSEO';

const NotFound = ({ isPostNotFound = false }) => {
  useSEO({ title: isPostNotFound ? 'Article Not Found' : 'Page Not Found', description: 'The requested page or article could not be found.' });
  return <main className="lost-page"><div className="lost-grid" /><div className="lost-orbit"><i /><i /><i /></div><span className="lost-code">404</span><p className="overline">SIGNAL LOST</p><h1>{isPostNotFound ? 'This article drifted away.' : 'You found empty space.'}</h1><p className="lost-copy">{isPostNotFound ? 'It may have been renamed, moved or is temporarily unavailable.' : 'The page you are looking for does not exist in this universe.'}</p><div className="lost-actions"><Link to="/" className="ios-button primary"><ArrowLeft /> Back home</Link><Link to="/blog" className="ios-button glass"><BookOpen /> Open journal</Link></div></main>;
};
export default NotFound;
