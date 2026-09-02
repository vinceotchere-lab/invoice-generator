export default function Field({ label, value, onChange, type = "text", textarea = false, error, placeholder }) {
  const commonProps = {
    value: value ?? "",
    onChange: (e) => onChange(e.target.value),
    className: error ? "has-error" : "",
    placeholder,
  };

  return (
    <div className="field">
      <label>{label}</label>
      {textarea ? (
        <textarea rows={2} {...commonProps} />
      ) : (
        <input type={type} {...commonProps} />
      )}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
