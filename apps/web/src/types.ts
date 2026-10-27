export type InvoiceItemInput = { productName: string; unit: string; unitPrice: string; quantity: string };
export type InvoiceInput = {
  invoiceNumber: string; issueDate: string; customerName: string; customerAddress: string;
  companyName: string; companyAddress: string; companyEmail: string; companyPhone: string;
  taxRate: string; items: InvoiceItemInput[];
};
