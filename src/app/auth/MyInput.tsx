import React, { ChangeEventHandler, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(secureTextEntry);

  return (
    <div className="flex flex-col mb-4 w-64">
      <div className={`flex border-2 p-2 rounded text-black ${
            required ? "border-red-500" : "border-gray-400"
          }`}>
        <input
          className="outline-none w-full"
          type={showPassword ? "password" : "text"}
          placeholder={placeholder}
          value={value}
          onChange={onChangeText}
        />
        {secureTextEntry && (showPassword ? 
          <Eye color="#9ca3af" className="cursor-pointer" onClick={() => setShowPassword(false)}/> 
          : 
          <EyeOff className="cursor-pointer" color="#9ca3af" onClick={() => setShowPassword(true)}/>)}
      </div>
      {errorMessage && (
        <span className="text-red-500 text-sm mt-1">{errorMessage}</span>
      )}
    </div>
  );
}
