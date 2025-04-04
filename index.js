const { createInvoice } = require("./createInvoice.js");

const invoice = require("./invoice.json")
const fileName = `invoice-${invoice.invoice_nr}.pdf`
createInvoice(invoice, fileName);

console.log(`Invoice ${fileName} created successfully!`);
