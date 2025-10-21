import { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { useDropzone } from 'react-dropzone';

const FormFileUpload = (props) => {
  const {
    name,
    label,
    rules,
    disabled,
    accept = "image/jpeg, image/png",
    multiple = false,
    maxFiles = 1,
    maxSize = 2,
    errorMessage: externalErrorMessage,
    onFileSelect
  } = props;

  const { control, formState: { errors } } = useFormContext();
  const [previews, setPreviews] = useState([]);
  
  const errorMessage = externalErrorMessage || errors[name]?.message;
  const maxSizeBytes = maxSize * 1024 * 1024;

  const validateFiles = (files) => {
    const validFiles = [];
    const errors = [];

    if (files.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} file${maxFiles !== 1 ? 's' : ''} allowed`);
      return { valid: validFiles, errors };
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileType = file.type;
      
      if (!accept.includes(fileType)) {
        errors.push(`File "${file.name}" has an unsupported format`);
        continue;
      }

      if (file.size > maxSizeBytes) {
        errors.push(`File "${file.name}" exceeds the ${maxSize}MB size limit`);
        continue;
      }

      validFiles.push(file);
    }

    return { valid: validFiles, errors };
  };

  const handleRemoveFile = (index, field) => {
    if (multiple) {
      const newFiles = Array.isArray(field.value) 
        ? field.value.filter((_, i) => i !== index) 
        : [];
      field.onChange(newFiles);
      
      if (onFileSelect) {
        onFileSelect(newFiles);
      }
      
      setPreviews(prev => {
        const newPreviews = [...prev];
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
        return newPreviews;
      });
    } else {
      field.onChange(null);
      
      if (onFileSelect) {
        onFileSelect(null);
      }
      
      setPreviews([]);
    }
  };

  const handleDrop = (field) => (acceptedFiles) => {
    const { valid, errors: fileErrors } = validateFiles(acceptedFiles);
          
    if (fileErrors.length) {
      console.error(fileErrors);
      return;
    }
          
    const newPreviews = valid.map(file => URL.createObjectURL(file));
          
    setPreviews(prevPreviews => {
      prevPreviews.forEach(url => URL.revokeObjectURL(url));
      return newPreviews;
    });
          
    const filesValue = multiple ? valid : valid[0] || null;
    field.onChange(filesValue);
          
    if (onFileSelect) {
      onFileSelect(filesValue);
    }
  };

  return (
    <div className="mb-4">
      <label className="block mb-1 text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => {
          const { getRootProps, getInputProps, isDragActive } = useDropzone({
            onDrop: handleDrop(field),
            accept: accept.split(',').reduce((acc, type) => ({
              ...acc,
              [type.trim()]: []
            }), {}),
            multiple,
            maxFiles,
            maxSize: maxSizeBytes,
            disabled
          });

          return (
            <div className="space-y-2">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors ${
                  isDragActive
                    ? "border-villain-500 bg-villain-50"
                    : "border-gray-300 hover:border-villain-500"
                } ${disabled ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <input {...getInputProps()} />
                <div className="space-y-2">
                  {/* Upload Icon SVG */}
                  <div className="text-sm text-gray-600">
                    <span className={`font-medium ${
                      disabled ? "text-gray-400" : "text-villain-500 hover:text-villain-600"
                    }`}>
                      Upload {multiple ? "files" : "a file"}
                    </span>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {accept.split(",").map(type => type.split("/")[1]).join(", ")} up to {maxSize}MB
                  </p>
                  {multiple && (
                    <p className="text-xs text-gray-500">
                      Maximum {maxFiles} file{maxFiles !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>

              {/* File Preview Section */}
              {field.value && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-2">Selected files:</p>
                  <ul className="text-sm text-gray-500">
                    {multiple 
                      ? Array.isArray(field.value) && field.value.map((file, index) => (
                          <li key={index}>{file.name}</li>
                        ))
                      : <li>{field.value.name}</li>
                    }
                  </ul>
                </div>
              )}

              {/* Image Previews */}
              {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {previews.map((previewUrl, index) => (
                    <div key={index} className="relative rounded-lg overflow-hidden h-24">
                      <img
                        src={previewUrl}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index, field)}
                        className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {errorMessage && (
                <p className="mt-1 text-xs text-red-500 animate-fade-in">
                  {errorMessage}
                </p>
              )}
            </div>
          );
        }}
      />
    </div>
  );
};

export default FormFileUpload;