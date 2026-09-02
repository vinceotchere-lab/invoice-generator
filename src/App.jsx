import { useEffect, useMemo, useState } from "react";
import { Building2, FileText, User, ListChecks, Wallet, Download, Clapperboard } from "lucide-react";
import Section from "./components/Section.jsx";
import Field from "./components/Field.jsx";
import LineItemsEditor from "./components/LineItemsEditor.jsx";
import InvoicePreview from "./components/InvoicePreview.jsx";
import { defaultState } from "./utils/defaultState.js";
import { loadState, saveState, clearState } from "./utils/storage.js";
import { generateInvoicePdf } from "./utils/pdfGenerator.js";

export default function App() {
  const [state, setState] = useState(() => loadState() || defaultState());
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    saveState(state);
  }, [state]);

  function updateSection(section, patch) {
    setState((prev) => ({ ...prev, [section]: { ...prev[section], ...patch } }));
  }

  const errors = useMemo(() => {
    const e = {};
    if (!state.client.name?.trim()) e.clientName = "Client name is required.";
    const hasValidItem = state.items.some((item) => item.description?.trim());
    if (!hasValidItem) e.items = "Add at least one line item with a description.";
    return e;
  }, [state.client.name, state.items]);

  const canDownload = Object.keys(errors).length === 0;

  function handleDownload() {
    if (!canDownload) {
      setShowValidation(true);
      return;
    }
    setShowValidation(false);
    generateInvoicePdf(state);
  }

  function handleReset() {
    if (window.confirm("Clear all invoice data and start over? This cannot be undone.")) {
      clearState();
      setState(defaultState());
      setShowValidation(false);
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <span className="app-header__mark">
          <Clapperboard size={14} style={{ verticalAlign: "-2px", marginRight: 4 }} />
          NAJERA
        </span>
        <div>
          <div className="app-header__title">Invoice Generator</div>
          <div className="app-header__subtitle">Fill in the details, preview live, download as PDF</div>
        </div>
      </header>

      <div className="app-body">
        <div className="form-col">
          <Section title="Business Settings" icon={<Building2 size={16} />} defaultOpen={false}>
            <Field label="Business Name" value={state.business.name} onChange={(v) => updateSection("business", { name: v })} />
            <Field label="Tagline" value={state.business.tagline} onChange={(v) => updateSection("business", { tagline: v })} />
            <Field label="Owner" value={state.business.owner} onChange={(v) => updateSection("business", { owner: v })} />
            <Field label="Address" value={state.business.address} onChange={(v) => updateSection("business", { address: v })} textarea />
            <Field label="Email" type="email" value={state.business.email} onChange={(v) => updateSection("business", { email: v })} />
            <Field label="Phone" value={state.business.phone} onChange={(v) => updateSection("business", { phone: v })} />
          </Section>

          <Section title="Invoice Details" icon={<FileText size={16} />}>
            <div className="field-row">
              <Field label="Invoice #" value={state.invoice.number} onChange={(v) => updateSection("invoice", { number: v })} />
              <Field label="Project / SOW #" value={state.invoice.projectRef} onChange={(v) => updateSection("invoice", { projectRef: v })} />
            </div>
            <div className="field-row">
              <Field label="Invoice Date" type="date" value={state.invoice.date} onChange={(v) => updateSection("invoice", { date: v })} />
              <Field label="Due Date" type="date" value={state.invoice.dueDate} onChange={(v) => updateSection("invoice", { dueDate: v })} />
            </div>
          </Section>

          <Section title="Bill To (Client)" icon={<User size={16} />}>
            <Field
              label="Client Name / Business Name"
              value={state.client.name}
              onChange={(v) => updateSection("client", { name: v })}
              error={showValidation ? errors.clientName : undefined}
            />
            <Field label="Client Address" value={state.client.address} onChange={(v) => updateSection("client", { address: v })} textarea />
            <div className="field-row">
              <Field label="Client Email" type="email" value={state.client.email} onChange={(v) => updateSection("client", { email: v })} />
              <Field label="Client Phone" value={state.client.phone} onChange={(v) => updateSection("client", { phone: v })} />
            </div>
          </Section>

          <Section title="Line Items" icon={<ListChecks size={16} />}>
            <LineItemsEditor items={state.items} onChange={(items) => setState((prev) => ({ ...prev, items }))} />
            {showValidation && errors.items && <span className="field-error">{errors.items}</span>}
          </Section>

          <Section title="Totals & Payment" icon={<Wallet size={16} />}>
            <div className="totals-mini">
              <div className="totals-mini__row">
                <span>Deposit Paid ($)</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={state.depositPaid}
                  onChange={(e) => setState((prev) => ({ ...prev, depositPaid: e.target.value }))}
                />
              </div>
              <div className="totals-mini__row">
                <span>Tax Rate (%)</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={state.taxRate}
                  onChange={(e) => setState((prev) => ({ ...prev, taxRate: e.target.value }))}
                />
              </div>
            </div>
            <Field label="Payment Method" value={state.payment.method} onChange={(v) => updateSection("payment", { method: v })} />
            <Field label="Payable To" value={state.payment.payableTo} onChange={(v) => updateSection("payment", { payableTo: v })} />
            <Field label="Bank / Account Details (optional)" value={state.payment.bankDetails} onChange={(v) => updateSection("payment", { bankDetails: v })} textarea />
            <Field label="Late Fee (% per month, optional)" type="number" value={state.payment.lateFeePercent} onChange={(v) => updateSection("payment", { lateFeePercent: v })} />
          </Section>

          <button className="download-btn" onClick={handleDownload} disabled={!canDownload && showValidation}>
            <Download size={17} /> Download PDF
          </button>
          {showValidation && !canDownload && (
            <div className="validation-note">Fix the highlighted fields above before downloading.</div>
          )}
          <button className="reset-btn" onClick={handleReset}>
            Clear all data and start over
          </button>
        </div>

        <div className="preview-col">
          <InvoicePreview state={state} />
        </div>
      </div>
    </div>
  );
}
