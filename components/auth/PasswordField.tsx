"use client";

import { useState } from "react";

interface Props {
  label: string;
  name?: string;
  placeholder?: string;
}

export function PasswordField({
  label,
  name = "password",
  placeholder = "Enter your password",
}: Props) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs font-bold text-on-surface">{label}</label>
      <div className="flex items-center border border-outline bg-white dark:bg-black focus-within:border-primary transition-colors">
        <input
          type={show ? "text" : "password"}
          name={name}
          placeholder={placeholder}
          className="flex-1 py-5 px-5 bg-transparent text-sm font-bold text-on-surface outline-none placeholder:text-muted placeholder:font-normal"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="px-4 text-on-surface cursor-pointer"
          aria-label={show ? "Hide password" : "Show password"}
        >
          <span className="material-icons text-xl leading-none">
            {show ? "visibility_off" : "visibility"}
          </span>
        </button>
      </div>
    </div>
  );
}
