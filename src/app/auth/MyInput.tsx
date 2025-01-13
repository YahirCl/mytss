import React, { ChangeEventHandler } from "react";

type Props = {
  secureTextEntry?: boolean;
  placeholder?: string;
  value?: string;
  onChangeText?: ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
  errorMessage?: string; // Mensaje de error para mostrar debajo del input
};

export default function MyInput({
  placeholder,
  value,
  onChangeText,
  required,
  errorMessage,
  secureTextEntry = false,
}: Props) {
  return (
    <div className="flex flex-col mb-4 w-64">
      <input
        type={secureTextEntry ? "password" : "text"}
        className={`p-2 border-2 rounded text-black ${
          required ? "border-red-500" : "border-gray-400"
        }`}
        placeholder={placeholder}
        value={value}
        onChange={onChangeText}
      />
      {errorMessage && (
        <span className="text-red-500 text-sm mt-1">{errorMessage}</span>
      )}
    </div>
  );
}
