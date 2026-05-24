function SectionHeader({ icon, title, description }) {
  return (
    <div className="section-header">
      <div className="section-icon" aria-hidden="true">
        {icon}
      </div>
      <div className="section-title">
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
    </div>
  );
}

export default SectionHeader;
