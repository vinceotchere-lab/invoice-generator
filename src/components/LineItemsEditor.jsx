import { Plus, Trash2 } from "lucide-react";
import { nextId } from "../utils/defaultState.js";
import { lineAmount, formatCurrency } from "../utils/calculations.js";

export default function LineItemsEditor({ items, onChange }) {
  function updateItem(id, field, value) {
    onChange(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  }

  function removeItem(id) {
    onChange(items.filter((item) => item.id !== id));
  }

  function addItem() {
    onChange([...items, { id: nextId(), description: "", qty: "1", rate: "" }]);
  }

  return (
    <div>
      <div className="col-labels">
        <span>Description</span>
        <span>Qty</span>
        <span>Rate</span>
        <span></span>
      </div>
      {items.map((item) => (
        <div className="line-item" key={item.id}>
          <input
            type="text"
            value={item.description}
            placeholder="Line item description"
            onChange={(e) => updateItem(item.id, "description", e.target.value)}
          />
          <input
            type="number"
            min="0"
            value={item.qty}
            onChange={(e) => updateItem(item.id, "qty", e.target.value)}
          />
          <input
            type="number"
            min="0"
            step="0.01"
            value={item.rate}
            placeholder="0.00"
            onChange={(e) => updateItem(item.id, "rate", e.target.value)}
          />
          <button
            type="button"
            className="line-item__remove"
            onClick={() => removeItem(item.id)}
            aria-label={`Remove line item: ${item.description || "untitled"}`}
            title="Remove line item"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ))}
      <button type="button" className="add-item-btn" onClick={addItem}>
        <Plus size={15} /> Add line item
      </button>
    </div>
  );
}
