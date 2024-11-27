import React, { ChangeEventHandler } from 'react'

type Props = {
    secureTextEntry?: boolean;
    placeholder?: string;
    value?: string;
    onChangeText?: ChangeEventHandler<HTMLInputElement>;
    required?: boolean;

}

export default function MyInput({placeholder, required, onChangeText}: Props) {
  return (
    <input
      type="text"
      className="p-2 border border-gray-300 rounded mb-4 w-64 text-black"
      placeholder={placeholder}
      required={required}
      onChange={onChangeText}
      
    />
  )
}
