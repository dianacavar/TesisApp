function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  icon,
  required = false,
}) {
  return (
    <div className="field">
      <label htmlFor={name} className="field-label">
        {icon && <span className="field-icon">{icon}</span>}
        <span>{label}</span>
        {required && <span className="field-required">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="field-select"
        required={required}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectField;
