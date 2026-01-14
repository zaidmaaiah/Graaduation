const Checkbox = ({ name, label, className = '' }) => {
  return (
    <label className={`flex items-center text-sm ${className}`}>
      <input type="checkbox" name={name} className="mr-2" />
      {label}
    </label>
  );
};

export default Checkbox;