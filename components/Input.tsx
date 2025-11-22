"use client";

import React from "react";

type InputProps = {
  name: string;
  placeholder?: string;
  value?: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
};

export default function Input({
  name,
  placeholder,
  value,
  handleChange,
  required = false,
  className=""
}: InputProps) {
  return (
    <input
      type="text"
      name={name}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      required={required}
      className={`border w-full rounded-lg p-2 outline-none ${className}`}
    />
  );
}
