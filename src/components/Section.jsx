import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function Section({ title, icon, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="section">
      <button
        type="button"
        className="section__header"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <span className="section__title">
          {icon}
          {title}
        </span>
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      {open && <div className="section__body">{children}</div>}
    </div>
  );
}
