import { FC, useEffect, useRef } from "react";

interface EditableTextProps {
  value: string | number;
  onContentChange?: (value: string) => void;
}

const EditableText: FC<EditableTextProps> = ({ value, onContentChange }) => {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (spanRef.current) {
      spanRef.current.textContent = String(value);
    }
  }, [value]);

  return (
    <span
      ref={spanRef}
      contentEditable
      suppressContentEditableWarning
      onInput={(e) => {
        onContentChange && onContentChange(e.currentTarget.textContent || "");
      }}
      className="outline-none custom-input editor caret-effect inline-block whitespace-pre-wrap"
    />
  );
};

export default EditableText;
