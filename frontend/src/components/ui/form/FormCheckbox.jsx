import { useFormContext, Controller } from "react-hook-form";

const FormCheckbox = ({ name, label, rules, disabled }) => {
  const { control, formState: { errors } } = useFormContext();
  const errorMessage = errors[name]?.message;

  return (
    <div className="mb-4">
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id={name}
                type="checkbox"
                checked={field.value || false}
                onChange={(e) => field.onChange(e.target.checked)}
                disabled={disabled}
                className="h-4 w-4 rounded border-gray-300 text-villain-500 focus:ring-villain-500/20"
              />
            </div>
            
            <div className="ml-3 text-sm">
              <label htmlFor={name} className="font-medium text-gray-700">
                {label}
              </label>
              
              {errorMessage && (
                <p className="mt-1 text-xs text-red-500 animate-fade-in">
                  {errorMessage}
                </p>
              )}
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default FormCheckbox;
