import React, { type ReactNode } from "react";

interface InputTextProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: ReactNode;
  children?: ReactNode;
}

const InputText: React.FC<InputTextProps> = ({
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  children,
}) => (
  <div className="flex items-center gap-2 mb-4 w-full">
    <span className="flex-shrink-0">{icon}</span>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="border rounded px-3 py-2 w-full focus:outline-none"
    />
    {children && <span className="flex-shrink-0">{children}</span>}
  </div>
);

export default InputText;