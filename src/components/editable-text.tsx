import { FC, useEffect, useRef } from "react";

interface EditableTextProps {
  value: string | number;
  onContentChange?: (value: string) => void;
  readOnly?: boolean;
}

const EditableText: FC<EditableTextProps> = ({
  value,
  onContentChange,
  readOnly = false,
}) => {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (spanRef.current) {
      spanRef.current.textContent = String(value);
    }
  }, [value]);

  return (
    <span
      ref={spanRef}
      contentEditable={!readOnly}
      suppressContentEditableWarning
      onInput={(e) => {
        if (onContentChange) {
          onContentChange((e.target as HTMLSpanElement).textContent || "");
        }
      }}
      className="outline-none custom-input editor caret-effect inline-block whitespace-pre-wrap"
    />
  );
};

export default EditableText;
