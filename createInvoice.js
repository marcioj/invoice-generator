const fs = require("fs");
const PDFDocument = require("pdfkit");

function createInvoice(invoice, path) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });

  generateHeader(doc, invoice);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);
  generateFooter(doc);

  doc.end();
  doc.pipe(fs.createWriteStream(path));
}

function generateHeader(doc, invoice) {
  const company = invoice.company
  const customerInfoX = 100
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text(company.name, 50, 57)
    .fontSize(10)
    .text(company.identifier, 200, customerInfoX, { align: "right" })
    .text(company.address, 200, customerInfoX + 15, { align: "right" })
    .text(`${company.city}, ${company.country}, ${company.postal_code}`, 200, customerInfoX + 30, { align: "right" })
    .moveDown();
}

function generateCustomerInformation(doc, invoice) {
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text("Invoice", 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text("Invoice Number:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(String(invoice.invoice_nr).padStart(4, '0'), 150, customerInformationTop)
    .font("Helvetica")
    .text("Issued on:", 50, customerInformationTop + 15)
    .text(formatDate(new Date()), 150, customerInformationTop + 15)
    .text("Due by:", 50, customerInformationTop + 30)
    .text(formatDate(invoice.due_by), 150, customerInformationTop + 30)

    .font("Helvetica-Bold")
    .text(invoice.customer.name, 300, customerInformationTop)
    .font("Helvetica")
    .text(invoice.customer.address, 300, customerInformationTop + 15)
    .text(
      invoice.customer.city +
        ", " +
        invoice.customer.country,
      300,
      customerInformationTop + 30
    )
    .moveDown();

  generateHr(doc, 252);
}

function generateInvoiceTable(doc, invoice) {
  let i;
  const invoiceTableTop = 330;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Description",
    "Unit Cost",
    "Quantity",
    "Line Total"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.description,
      formatCurrency(item.amount / item.quantity),
      item.quantity,
      formatCurrency(item.amount)
    );

    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "Total",
    "",
    formatCurrency(invoice.subtotal)
  );

}

function generateFooter(doc) {
  // doc
  //   .fontSize(10)
  //   .text(
  //     "Payment is due within 15 days. Thank you for your business.",
  //     50,
  //     780,
  //     { align: "center", width: 500 }
  //   );
}

function generateTableRow(
  doc,
  y,
  description,
  unitCost,
  quantity,
  lineTotal
) {
  doc
    .fontSize(10)
    .text(description, 50, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(quantity, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function formatCurrency(cents) {
  return "$" + cents.toFixed(2);
}

function formatDate(date) {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + "/" + String(month).padStart(2, '0') + "/" + String(day).padStart(2, '0');
}

module.exports = {
  createInvoice
};
