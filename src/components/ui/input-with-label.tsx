"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function InputWithLabel({
  id,
  name,
  className,
  label,
  onChange,
  value,
  placeholder,
  type = "text",
  error,
}: {
  id?: string;
  name?: string;
  className?: string;
  onChange?: (value: string) => void;
  value?: string;
  label: string;
  placeholder: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  error?: string;
}) {
  return (
    <div className={cn(className, "grid w-full max-w-sm items-center gap-1.5")}>
      <Label>{label}</Label>
      <Input
        id={id}
        name={name}
        type={type}
        onChange={(event) => {
          if (onChange) {
            onChange(event.target.value);
          }
        }}
        value={value}
        placeholder={placeholder}
        className={error ? "border-red-500" : ""}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
