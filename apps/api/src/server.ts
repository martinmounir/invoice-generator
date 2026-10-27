import "dotenv/config";
import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";

const app = express();
const prisma = new PrismaClient();
const PORT = Number(process.env.PORT || 4000);
const COMPANY = {
  id: "heavendent-default-company",
  name: "HEAVENDENT LLC",
  address: "6010 HUNTERS VILLAGE DR\\nLEBANON TN 37087-4338",
  email: "admin@heavendent.com",
  phone: ""
};
const allowedOrigins = (process.env.WEB_ORIGIN || "http://localhost:5173").split(",").map(v => v.trim());
app.use(cors({ origin: (origin, callback) => {
  if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
  return callback(new Error("Origin not allowed by CORS"));
} }));
app.use(express.json({ limit: "1mb" }));

const itemSchema = z.object({
  productName: z.string().trim().min(1).max(200),
  unit: z.string().trim().min(1).max(50),
  unitPrice: z.coerce.number().finite().min(0).max(100000000),
  quantity: z.coerce.number().int().min(1).max(1000000)
});
const invoiceSchema = z.object({
  invoiceNumber: z.string().trim().min(1).max(50),
  issueDate: z.string().date(),
  customerName: z.string().trim().min(1).max(200),
  customerAddress: z.string().trim().max(500).optional().default(""),
  companyName: z.string().trim().min(1).max(200),
  companyAddress: z.string().trim().max(500).optional().default(""),
  companyEmail: z.string().trim().max(200).optional().default(""),
  companyPhone: z.string().trim().max(80).optional().default(""),
  taxRate: z.coerce.number().finite().min(0).max(100),
  items: z.array(itemSchema).min(1).max(200)
});
app.get("/api/health", (_req, res) => res.json({ status: "ok", application: "HeavenDent Invoice API" }));
app.get("/api/invoices", async (_req, res, next) => {
  try { res.json(await prisma.invoice.findMany({ orderBy: { createdAt: "desc" }, include: { items: true }, take: 100 })); }
  catch (error) { next(error); }
});
app.get("/api/invoices/:id", async (req, res, next) => {
  try {
    const invoice = await prisma.invoice.findUnique({ where: { id: req.params.id }, include: { items: true } });
    if (!invoice) return res.status(404).json({ error: "Invoice not found." });
    return res.json(invoice);
  } catch (error) { return next(error); }
});
app.post("/api/invoices", async (req, res, next) => {
  const parsed = invoiceSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Please check the invoice fields.", details: parsed.error.flatten() });
  try {
    const data = parsed.data;
    // Development-only single company. Add auth and authorization before public deployment.
    const company = await prisma.company.upsert({
      where: { id: COMPANY.id },
      update: { name: COMPANY.name, address: COMPANY.address, email: COMPANY.email, phone: COMPANY.phone },
      create: { id: "heavendent-default-company", name: COMPANY.name, address: COMPANY.address, email: COMPANY.email, phone: COMPANY.phone }
    });
    const items = data.items.map(item => {
      const unitPriceCents = Math.round(item.unitPrice * 100);
      return { productName: item.productName, unit: item.unit, unitPriceCents, quantity: item.quantity, lineTotalCents: unitPriceCents * item.quantity };
    });
    const subtotalCents = items.reduce((sum, item) => sum + item.lineTotalCents, 0);
    const taxCents = Math.round(subtotalCents * data.taxRate / 100);
    const totalCents = subtotalCents + taxCents;
    const invoice = await prisma.invoice.create({
      data: {
        companyId: company.id, invoiceNumber: data.invoiceNumber,
        issueDate: new Date(`${data.issueDate}T12:00:00.000Z`),
        customerName: data.customerName, customerAddress: data.customerAddress || null,
        companyName: data.companyName, companyAddress: data.companyAddress || null,
        companyEmail: data.companyEmail || null, companyPhone: data.companyPhone || null,
        taxRate: new Prisma.Decimal(data.taxRate.toFixed(2)), subtotalCents, taxCents, totalCents,
        items: { create: items }
      }, include: { items: true }
    });
    return res.status(201).json(invoice);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return res.status(409).json({ error: "That invoice number already exists. Choose a different number." });
    return next(error);
  }
});
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  if (error instanceof Error && error.message.includes("Origin not allowed")) return res.status(403).json({ error: "Origin not allowed." });
  return res.status(500).json({ error: "An unexpected server error occurred." });
});
const server = app.listen(PORT, () => console.log(`HeavenDent API running at http://localhost:${PORT}`));
async function shutdown() { server.close(); await prisma.$disconnect(); }
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
