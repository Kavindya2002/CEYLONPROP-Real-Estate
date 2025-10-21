import { useFormContext, Controller } from "react-hook-form";

const FormSelect = ({
  name,
  label,
  options,
  placeholder = "Select an option",
  rules,
  disabled
}) => {
  const { control, formState: { errors } } = useFormContext();
  const errorMessage = errors[name]?.message;

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block mb-1 text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <div className="relative">
            <select
              {...field}
              id={name}
              disabled={disabled}
              className={`form-input ${
                errorMessage ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
              }`}
              value={field.value || ""}
            >
              <option value="" disabled>
                {placeholder}
              </option>
              
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            {errorMessage && (
              <p className="mt-1 text-xs text-red-500 animate-fade-in">
                {errorMessage}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default FormSelect;
