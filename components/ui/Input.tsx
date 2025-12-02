export default function Input({
  label,
  type = "text",
  name,
  value,
  placeholder,
  handleChange,
  required
}: any) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        className="border-2 border-gray-700 rounded-md px-3 py-2 text-sm outline-none"
      />
    </div>
  );
}
