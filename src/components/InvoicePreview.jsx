import { lineAmount, computeSubtotal, computeTaxAmount, computeTotalDue, formatCurrency } from "../utils/calculations.js";

export default function InvoicePreview({ state }) {
  const { business, invoice, client, items, depositPaid, taxRate, payment } = state;

  const subtotal = computeSubtotal(items);
  const taxAmount = computeTaxAmount(subtotal, taxRate);
  const totalDue = computeTotalDue(subtotal, depositPaid, taxAmount);

  return (
    <div className="invoice-sheet" id="invoice-sheet">
      <div className="invoice-sheet__top">
        <div>
          <p className="invoice-sheet__brand-name">{business.name || "Your Business"}</p>
          <p className="invoice-sheet__tagline">{business.tagline}</p>
          <div className="invoice-sheet__biz-line">
            {business.owner && <div>{business.owner}</div>}
            {business.address && <div>{business.address}</div>}
            {business.email && <div>{business.email}</div>}
            {business.phone && <div>{business.phone}</div>}
          </div>
        </div>
        <div className="invoice-sheet__meta">
          <p className="invoice-sheet__meta-title">INVOICE</p>
          <div className="invoice-sheet__meta-row">Invoice #: <b>{invoice.number || "—"}</b></div>
          <div className="invoice-sheet__meta-row">Invoice Date: <b>{invoice.date || "—"}</b></div>
          <div className="invoice-sheet__meta-row">Due Date: <b>{invoice.dueDate || "—"}</b></div>
          <div className="invoice-sheet__meta-row">Project / SOW #: <b>{invoice.projectRef || "—"}</b></div>
        </div>
      </div>

      <div className="invoice-sheet__billto">
        <div className="invoice-sheet__label">BILL TO</div>
        <div className="invoice-sheet__billto-name">{client.name || "Client name"}</div>
        {client.address && <div className="invoice-sheet__billto-line">{client.address}</div>}
        {client.email && <div className="invoice-sheet__billto-line">{client.email}</div>}
        {client.phone && <div className="invoice-sheet__billto-line">{client.phone}</div>}
      </div>

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th className="num">Qty</th>
            <th className="num">Rate</th>
            <th className="num">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.description || "—"}</td>
              <td className="num">{item.qty || "—"}</td>
              <td className="num">{item.rate ? formatCurrency(item.rate) : "—"}</td>
              <td className="num">{formatCurrency(lineAmount(item))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="invoice-sheet__totals">
        <div className="invoice-sheet__totals-row">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="invoice-sheet__totals-row">
          <span>Deposit Paid</span>
          <span>-{formatCurrency(depositPaid || 0)}</span>
        </div>
        <div className="invoice-sheet__totals-row">
          <span>Tax ({taxRate || 0}%)</span>
          <span>{formatCurrency(taxAmount)}</span>
        </div>
        <div className="invoice-sheet__totals-row grand">
          <span>Total Due</span>
          <span>{formatCurrency(totalDue)}</span>
        </div>
      </div>

      <div className="invoice-sheet__payment">
        <div><b>Payment Method:</b> {payment.method || "—"}</div>
        <div><b>Payable To:</b> {payment.payableTo || "—"}</div>
        <div><b>Bank / Account Details:</b> {payment.bankDetails || "To be provided separately"}</div>
        {payment.lateFeePercent && (
          <div>
            <b>Late Payment:</b> A late fee of {payment.lateFeePercent}% per month applies to balances
            unpaid after the due date, per the signed Service Agreement.
          </div>
        )}
      </div>

      <div className="invoice-sheet__footer">
        Thank you for choosing {business.name || "us"}. This invoice is issued under the terms of the
        signed Videography &amp; Video Production Service Agreement.
      </div>
    </div>
  );
}
