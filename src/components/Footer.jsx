import { FileText, Phone } from 'lucide-react';
import githubIcon from '../assets/icons/github.svg';
import linkedinIcon from '../assets/icons/linkedin.svg';

const Footer = ({ profile }) => <footer className="os-footer">
  <div className="footer-signature"><span>© {new Date().getFullYear()} Abdurashid Ergashev</span><span className="footer-status"><i /> Available for selected work</span></div>
  <div className="footer-socials" aria-label="Social links">
    <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub profile"><img src={githubIcon} alt="" /> GitHub</a>
    <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn profile"><img src={linkedinIcon} alt="" /> LinkedIn</a>
    <a href={profile.phone} aria-label={`Call ${profile.phoneLabel}`}><Phone /> {profile.phoneLabel}</a>
    <a href={profile.resume} target="_blank" rel="noreferrer" aria-label="Open resume PDF"><FileText /> Resume</a>
  </div>
  <a className="footer-top" href="/#home">Back to top ↑</a>
</footer>;

export default Footer;
