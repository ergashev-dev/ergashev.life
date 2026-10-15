const InteriorHero = ({ index, eyebrow, title, accent, description, children }) => (
  <section className="interior-hero">
    <div className="interior-aurora" /><div className="interior-orb orb-small" /><div className="interior-orb orb-large" />
    <div className="interior-index">{index}</div>
    <div className="interior-copy">
      <span className="overline">{eyebrow}</span>
      <h1>{title}<br /><em>{accent}</em></h1>
      {description && <p>{description}</p>}
      {children}
    </div>
  </section>
);
export default InteriorHero;
