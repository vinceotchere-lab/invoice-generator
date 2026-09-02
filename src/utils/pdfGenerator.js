import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { lineAmount, computeSubtotal, computeTaxAmount, computeTotalDue, formatCurrency } from "./calculations.js";

const NAVY = [31, 56, 100]; // #1F3864
const GREY = [90, 96, 109];
const LIGHT = [242, 242, 242];

export function generateInvoicePdf(state) {
  const { business, invoice, client, items, depositPaid, taxRate, payment } = state;
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const marginLeft = 48;
  const marginRight = 564; // 612 - 48
  let y = 56;

  // Header: business name (left) / INVOICE (right)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(...NAVY);
  doc.text(business.name || "NAJERA", marginLeft, y);

  doc.setFontSize(24);
  doc.text("INVOICE", marginRight, y, { align: "right" });

  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...GREY);
  doc.text(business.tagline || "", marginLeft, y);

  // Right-aligned meta block
  let metaY = y + 6;
  const metaRows = [
    ["Invoice #:", invoice.number || "-"],
    ["Invoice Date:", invoice.date || "-"],
    ["Due Date:", invoice.dueDate || "-"],
    ["Project / SOW #:", invoice.projectRef || "-"],
  ];
  doc.setFontSize(9.5);
  metaRows.forEach(([label, value]) => {
    doc.setTextColor(...GREY);
    doc.setFont("helvetica", "bold");
    const labelWidth = doc.getTextWidth(label + " ");
    doc.text(label, marginRight - doc.getTextWidth(label + value), metaY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(20, 20, 20);
    doc.text(value, marginRight, metaY, { align: "right" });
    metaY += 13;
  });

  // Business contact block (left column, below tagline)
  let bizY = y + 22;
  doc.setFontSize(9.5);
  doc.setTextColor(60, 64, 74);
  const bizLines = [business.owner, business.address, business.email, business.phone].filter(Boolean);
  bizLines.forEach((line) => {
    doc.text(line, marginLeft, bizY);
    bizY += 13;
  });

  const afterHeaderY = Math.max(bizY, metaY) + 6;
  doc.setDrawColor(...NAVY);
  doc.setLineWidth(1.4);
  doc.line(marginLeft, afterHeaderY, marginRight, afterHeaderY);

  // Bill To
  let billY = afterHeaderY + 22;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...NAVY);
  doc.text("BILL TO", marginLeft, billY);

  billY += 15;
  doc.setFontSize(10.5);
  doc.setTextColor(20, 20, 20);
  doc.text(client.name || "-", marginLeft, billY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...GREY);
  const clientLines = [client.address, client.email, client.phone].filter(Boolean);
  let clientY = billY + 13;
  clientLines.forEach((line) => {
    const wrapped = doc.splitTextToSize(line, 300);
    doc.text(wrapped, marginLeft, clientY);
    clientY += 13 * wrapped.length;
  });

  // Line items table
  const tableStartY = clientY + 14;
  const rows = items.map((item) => [
    item.description || "-",
    item.qty || "-",
    item.rate ? formatCurrency(item.rate) : "-",
    formatCurrency(lineAmount(item)),
  ]);

  autoTable(doc, {
    startY: tableStartY,
    margin: { left: marginLeft, right: 48 },
    head: [["Description", "Qty", "Rate", "Amount"]],
    body: rows,
    styles: {
      font: "helvetica",
      fontSize: 9.5,
      cellPadding: 7,
      textColor: [20, 20, 20],
      lineColor: [229, 224, 211],
      lineWidth: 0.5,
    },
    headStyles: {
      fillColor: NAVY,
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: LIGHT,
    },
    columnStyles: {
      0: { cellWidth: 264 },
      1: { cellWidth: 60, halign: "center" },
      2: { cellWidth: 90, halign: "right" },
      3: { cellWidth: 90, halign: "right" },
    },
  });

  let afterTableY = doc.lastAutoTable.finalY + 18;

  // Totals block (right aligned)
  const subtotal = computeSubtotal(items);
  const taxAmount = computeTaxAmount(subtotal, taxRate);
  const totalDue = computeTotalDue(subtotal, depositPaid, taxAmount);

  const totalsX1 = marginRight - 200;
  const totalsRows = [
    ["Subtotal:", formatCurrency(subtotal)],
    ["Deposit Paid:", `-${formatCurrency(depositPaid || 0)}`],
    [`Tax (${taxRate || 0}%):`, formatCurrency(taxAmount)],
  ];

  doc.setFontSize(9.5);
  totalsRows.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...GREY);
    doc.text(label, totalsX1, afterTableY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(20, 20, 20);
    doc.text(value, marginRight, afterTableY, { align: "right" });
    afterTableY += 15;
  });

  // Grand total highlight bar
  doc.setFillColor(...NAVY);
  doc.rect(totalsX1 - 10, afterTableY - 4, marginRight - (totalsX1 - 10), 22, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(255, 255, 255);
  doc.text("TOTAL DUE:", totalsX1, afterTableY + 12);
  doc.text(formatCurrency(totalDue), marginRight, afterTableY + 12, { align: "right" });

  let paymentY = afterTableY + 44;

  // Payment details
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...NAVY);
  doc.text("PAYMENT DETAILS", marginLeft, paymentY);
  paymentY += 16;

  doc.setFontSize(9.5);
  const paymentLines = [
    ["Payment Method:", payment.method || "-"],
    ["Payable To:", payment.payableTo || "-"],
    ["Bank / Account Details:", payment.bankDetails || "To be provided separately"],
  ];
  paymentLines.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 20, 20);
    doc.text(label, marginLeft, paymentY);
    const labelW = doc.getTextWidth(label + " ");
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...GREY);
    const wrapped = doc.splitTextToSize(value, marginRight - marginLeft - labelW);
    doc.text(wrapped, marginLeft + labelW, paymentY);
    paymentY += 13 * wrapped.length;
  });

  if (payment.lateFeePercent) {
    const lateNote = `Late Payment: A late fee of ${payment.lateFeePercent}% per month applies to balances unpaid after the due date, per the signed Service Agreement.`;
    const wrapped = doc.splitTextToSize(lateNote, marginRight - marginLeft);
    doc.text(wrapped, marginLeft, paymentY + 4);
    paymentY += 13 * wrapped.length + 4;
  }

  // Footer
  const footerY = 740;
  doc.setDrawColor(...NAVY);
  doc.setLineWidth(1);
  doc.line(marginLeft, footerY - 18, marginRight, footerY - 18);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(...GREY);
  const thanks = `Thank you for choosing ${business.name || "NAJERA"}. This invoice is issued under the terms of the signed Videography & Video Production Service Agreement.`;
  const wrappedThanks = doc.splitTextToSize(thanks, marginRight - marginLeft);
  doc.text(wrappedThanks, (marginLeft + marginRight) / 2, footerY, { align: "center" });

  const filename = `${(business.name || "NAJERA").replace(/\s+/g, "-")}-Invoice-${invoice.number || "draft"}.pdf`;
  doc.save(filename);
}
