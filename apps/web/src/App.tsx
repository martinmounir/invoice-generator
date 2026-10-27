import { useMemo, useState } from 'react'

import type { InvoiceInput, InvoiceItemInput } from './types'

const COMPANY = {
  name: 'HEAVENDENT LLC',

  address: '6010 HUNTERS VILLAGE DR\nLEBANON TN 37087-4338',

  email: 'admin@heavendent.com',

  phone: '',
}

const initialForm: InvoiceInput = {
  invoiceNumber: '',

  issueDate:
    new Date().getFullYear() +
    '-' +
    String(new Date().getMonth() + 1).padStart(2, '0') +
    '-' +
    String(new Date().getDate()).padStart(2, '0'),

  customerName: '',

  customerAddress: '',

  companyName: COMPANY.name,

  companyAddress: COMPANY.address,

  companyEmail: COMPANY.email,

  companyPhone: COMPANY.phone,

  taxRate: '',

  items: [{ productName: '', unit: '', unitPrice: '', quantity: '' }],
}

const toCents = (v: string) => Math.round(Math.max(0, Number(v) || 0) * 100)

const qty = (v: string) => Math.max(0, Math.floor(Number(v) || 0))

const money = (c: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
    c / 100,
  )

async function saveInvoice(payload: InvoiceInput) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/invoices`,

    {
      method: 'POST',

      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({
        ...payload,

        companyName: COMPANY.name,

        companyAddress: COMPANY.address,

        companyEmail: COMPANY.email,

        companyPhone: COMPANY.phone,
      }),
    },
  )

  const data = await response.json().catch(() => ({}))

  if (!response.ok) throw new Error(data.error || 'Could not save invoice.')

  return data
}

const PRINT_STYLES = `
  @page {
    size: auto;
    margin: 8mm;
  }

  @media print {
    html,
    body,
    #root {
      width: 100% !important;
      height: auto !important;
      min-height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      background: #ffffff !important;
      overflow: visible !important;
    }

    body * {
      visibility: hidden !important;
    }

    /* The editor normally has .no-print on its workspace wrapper.
       Re-enable only the ancestors needed to expose the invoice. */
    .app-shell,
    .app-shell .workspace.no-print,
    .app-shell .workspace-main-grid,
    .app-shell .preview-panel,
    .app-shell .invoice-paper {
      display: block !important;
      visibility: visible !important;
    }

    .app-shell {
      width: 100% !important;
      min-height: 0 !important;
      height: auto !important;
      margin: 0 !important;
      padding: 0 !important;
      color: #101820 !important;
      background: #ffffff !important;
      overflow: visible !important;
    }

    .topbar,
    .page-heading,
    .notice,
    .left-work-column,
    .details-grid,
    .products-panel,
    .preview-label,
    .app-footer,
    .no-print:not(.workspace) {
      display: none !important;
    }

    .app-shell .workspace.no-print {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      max-width: none !important;
      background: #ffffff !important;
    }

    .app-shell .workspace-main-grid {
      display: block !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      grid-template-columns: 1fr !important;
      gap: 0 !important;
    }

    .app-shell .preview-panel {
      width: 100% !important;
      max-width: none !important;
      margin: 0 !important;
      padding: 0 !important;
      border: 0 !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      background: #ffffff !important;
      overflow: visible !important;
    }

    .app-shell .invoice-paper {
      box-sizing: border-box !important;
      position: relative !important;
      width: 100% !important;
      max-width: none !important;
      height: auto !important;
      min-height: 0 !important;
      aspect-ratio: auto !important;
      margin: 0 !important;
      padding: 8mm !important;
      border: 0 !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      background: #ffffff !important;
      color: #101820 !important;
      overflow: visible !important;
      break-inside: avoid !important;
      page-break-inside: avoid !important;
    }

    .app-shell .invoice-paper,
    .app-shell .invoice-paper * {
      visibility: visible !important;
      color-adjust: exact !important;
      print-color-adjust: exact !important;
      -webkit-print-color-adjust: exact !important;
    }

    .app-shell .invoice-paper img {
      max-width: 100% !important;
      object-fit: contain !important;
    }

    .app-shell .invoice-paper table {
      width: 100% !important;
      border-collapse: collapse !important;
    }

    .app-shell .invoice-paper tr,
    .app-shell .invoice-paper .invoice-brand-row,
    .app-shell .invoice-paper .invoice-meta,
    .app-shell .invoice-paper .invoice-bottom,
    .app-shell .invoice-paper .thank-you {
      break-inside: avoid !important;
      page-break-inside: avoid !important;
    }
  }
`

export default function App() {
  const [form, setForm] = useState<InvoiceInput>(initialForm)

  const [status, setStatus] = useState('')

  const [saving, setSaving] = useState(false)

  const [darkMode, setDarkMode] = useState(false)

  const subtotal = useMemo(
    () =>
      form.items.reduce(
        (s, it) => s + toCents(it.unitPrice) * qty(it.quantity),

        0,
      ),

    [form.items],
  )

  const taxRate = Math.min(100, Math.max(0, Number(form.taxRate) || 0))

  const tax = Math.round((subtotal * taxRate) / 100)

  const total = subtotal + tax

  const update = <K extends keyof InvoiceInput>(
    key: K,

    value: InvoiceInput[K],
  ) => setForm((old) => ({ ...old, [key]: value }))

  const updateItem = (i: number, key: keyof InvoiceItemInput, value: string) =>
    update(
      'items',

      form.items.map((it, n) => (n === i ? { ...it, [key]: value } : it)),
    )

  const addItem = () =>
    update('items', [
      ...form.items,

      { productName: '', unit: 'each', unitPrice: '0', quantity: '1' },
    ])

  const removeItem = (i: number) =>
    update(
      'items',

      form.items.filter((_, n) => n !== i),
    )

  async function handleSave() {
    if (!form.customerName.trim() || !form.invoiceNumber.trim()) {
      setStatus('Please enter the customer name and invoice number.')

      return
    }

    if (
      !form.items.length ||
      form.items.some(
        (it) =>
          !it.productName.trim() ||
          !it.unit.trim() ||
          !Number.isFinite(Number(it.unitPrice)) ||
          Number(it.unitPrice) < 0 ||
          !Number.isInteger(Number(it.quantity)) ||
          Number(it.quantity) < 1,
      )
    ) {
      setStatus('Please check each product name, unit, price, and quantity.')

      return
    }

    setSaving(true)

    setStatus('')

    try {
      const saved = await saveInvoice(form)

      setStatus(`Invoice saved successfully. Record ID: ${saved.id}`)
    } catch (e) {
      setStatus(
        `${e instanceof Error ? e.message : 'Could not save invoice.'} Make sure the API and database are running.`,
      )
    } finally {
      setSaving(false)
    }
  }

  async function handlePrint() {
    setStatus('')
    const invoice = document.querySelector<HTMLElement>('.invoice-paper')

    if (!invoice) {
      setStatus('Could not find the invoice preview to print.')
      return
    }

    // Wait for the invoice logo and web fonts so they appear in the PDF.
    const images = Array.from(invoice.querySelectorAll<HTMLImageElement>('img'))
    await Promise.all(
      images.map((image) =>
        image.complete
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              const finish = () => resolve()
              image.addEventListener('load', finish, { once: true })
              image.addEventListener('error', finish, { once: true })
            }),
      ),
    )

    if ('fonts' in document) {
      await document.fonts.ready
    }

    window.print()
  }

  return (
    <main className={`app-shell${darkMode ? ' dark-mode' : ''}`}>
      <style>{PRINT_STYLES}</style>

      <header className="topbar no-print">
        <a className="brand" href="#" aria-label="HeavenDent home">
          <img
            className="nav-logo"
            src="/heavendent-logo.png"
            alt="HeavenDent"
          />
        </a>

        <div className="top-actions">
          <span className="saved-indicator">
            <i /> Invoice editor
          </span>

          <button
            className={`theme-toggle${darkMode ? ' is-dark' : ''}`}
            type="button"
            role="switch"
            aria-checked={darkMode}
            onClick={() => setDarkMode((value) => !value)}
            aria-label={
              darkMode
                ? 'Dark mode enabled. Switch to light mode'
                : 'Light mode enabled. Switch to dark mode'
            }
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span className="theme-toggle-track" aria-hidden="true">
              <span className="theme-toggle-thumb">{darkMode ? '☾' : '☀'}</span>
            </span>

            <span className="theme-toggle-label">
              {darkMode ? 'Dark' : 'Light'}
            </span>
          </button>

          <button className="button button-secondary" onClick={handlePrint}>
            Print / Save PDF
          </button>
        </div>
      </header>

      <section className="workspace no-print">
        <div className="page-heading">
          <div>
            <p className="eyebrow">SALES · DOCUMENTS</p>

            <h1>Create invoice</h1>

            <p className="muted">
              Enter customer details and products. The invoice preview updates
              as you type.
            </p>
          </div>

          <div className="currency-pill">
            USD <span>United States Dollar</span>
          </div>
        </div>

        {status && (
          <div
            className={
              status.startsWith('Invoice saved') ? 'notice success' : 'notice'
            }
            role="status"
          >
            {status}
          </div>
        )}

        <div className="workspace-main-grid">
          <div className="left-work-column">
            <div className="details-grid">
              <div className="panel detail-card">
                <SectionTitle
                  number="1"
                  title="Bill to"
                  subtitle="Customer information"
                />

                <div className="form-grid single-column">
                  <Field
                    label="Customer / company name"
                    value={form.customerName}
                    onChange={(v) => update('customerName', v)}
                    placeholder="Company Name"
                  />

                  <Field
                    label="Billing address"
                    value={form.customerAddress}
                    onChange={(v) => update('customerAddress', v)}
                    placeholder="Street, city, state, ZIP"
                  />
                </div>
              </div>

              <div className="panel detail-card invoice-details-card">
                <SectionTitle
                  number="2"
                  title="Invoice details"
                  subtitle="Reference number and issue date"
                />

                <div className="form-grid single-column">
                  <Field
                    label="Invoice number"
                    value={form.invoiceNumber}
                    onChange={(v) => update('invoiceNumber', v)}
                    placeholder="1001"
                  />

                  <Field
                    label="Issue date"
                    type="date"
                    value={form.issueDate}
                    onChange={(v) => update('issueDate', v)}
                  />
                </div>
              </div>
            </div>

            <section className="panel products-panel">
              <SectionTitle
                number="3"
                title="Products & pricing"
                subtitle="Add each product on its own row"
              />

              <div className="items-editor">
                {form.items.map((item, i) => (
                  <div className="item-editor" key={i}>
                    <div className="item-topline">
                      <span className="item-index">
                        ITEM {String(i + 1).padStart(2, '0')}
                      </span>

                      <button
                        className="remove-button"
                        onClick={() => removeItem(i)}
                        disabled={form.items.length === 1}
                      >
                        Remove
                      </button>
                    </div>

                    <Field
                      label="Product"
                      value={item.productName}
                      onChange={(v) => updateItem(i, 'productName', v)}
                      placeholder="Gloves"
                    />

                    <div className="item-fields">
                      <Field
                        label="Unit"
                        value={item.unit}
                        onChange={(v) => updateItem(i, 'unit', v)}
                        placeholder="100"
                      />

                      <Field
                        label="Unit price ($)"
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(v) => updateItem(i, 'unitPrice', v)}
                        placeholder="100"
                      />

                      <Field
                        label="Quantity"
                        type="number"
                        min="1"
                        step="1"
                        value={item.quantity}
                        onChange={(v) => updateItem(i, 'quantity', v)}
                        placeholder="5"
                      />
                    </div>

                    <div className="item-total">
                      <span>Line total</span>

                      <strong>
                        {money(toCents(item.unitPrice) * qty(item.quantity))}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>

              <button className="add-item-button" onClick={addItem}>
                <span>＋</span> Add product
              </button>

              <div className="tax-row">
                <label htmlFor="taxRate">Tax rate (%)</label>

                <div className="tax-input">
                  <input
                    id="taxRate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={form.taxRate}
                    placeholder="0"
                    onChange={(e) => update('taxRate', e.target.value)}
                  />

                  <span>%</span>
                </div>
              </div>

              <div className="totals-card">
                <div>
                  <span>Subtotal</span>

                  <strong>{money(subtotal)}</strong>
                </div>

                <div>
                  <span>Tax ({taxRate.toFixed(2)}%)</span>

                  <strong>{money(tax)}</strong>
                </div>

                <div className="grand-total">
                  <span>Total due</span>

                  <strong>{money(total)}</strong>
                </div>
              </div>
            </section>
          </div>

          <section className="preview-panel tall-preview">
            <div className="preview-label no-print">
              <span>LIVE PREVIEW</span>

              <span>Letter / A4-friendly · Print ready</span>
            </div>

            <InvoicePreview
              form={form}
              subtotal={subtotal}
              taxRate={taxRate}
              tax={tax}
              total={total}
            />
          </section>
        </div>
      </section>

      <footer className="app-footer no-print">
        <div className="footer-brand">HEAVENDENT LLC</div>

        <div className="footer-contact">
          <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
        </div>

        <nav className="social-links" aria-label="HeavenDent social media">
          <span>Facebook</span>

          <span>Instagram</span>
        </nav>

        <p className="copyright">
          © {new Date().getFullYear()} MARTIN-MOUNIR. All rights reserved.
        </p>
      </footer>
    </main>
  )
}

function SectionTitle({
  number,

  title,

  subtitle,
}: {
  number: string

  title: string

  subtitle: string
}) {
  return (
    <div className="panel-title">
      <span className="step-number">{number}</span>

      <div>
        <h2>{title}</h2>

        <p>{subtitle}</p>
      </div>
    </div>
  )
}

function FixedField({ label, value }: { label: string; value: string }) {
  return (
    <div className="fixed-field">
      <span>{label}</span>

      <strong>{value}</strong>
    </div>
  )
}

function Field({
  label,

  value,

  onChange,

  placeholder,

  type = 'text',

  min,

  max,

  step,
}: {
  label: string

  value: string

  onChange: (value: string) => void

  placeholder?: string

  type?: string

  min?: string

  max?: string

  step?: string
}) {
  return (
    <label className={`field${type === 'date' ? ' date-field' : ''}`}>
      <span>{label}</span>

      <input
        lang={type === 'date' ? 'en-GB' : undefined}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
      />
    </label>
  )
}

function InvoicePreview({
  form,

  subtotal,

  taxRate,

  tax,

  total,
}: {
  form: InvoiceInput

  subtotal: number

  taxRate: number

  tax: number

  total: number
}) {
  return (
    <article className="invoice-paper" aria-label="Invoice document">
      <div className="invoice-brand-row">
        <div className="invoice-brand">
          <img
            className="invoice-logo"
            src="/heavendent-logo.png"
            alt="HeavenDent"
          />
        </div>

        <div className="invoice-title">INVOICE</div>
      </div>

      <div className="company-invoice-contact">
        <div>{COMPANY.address}</div>
      </div>

      <div className="invoice-meta">
        <div>
          <span className="invoice-label">BILLED TO:</span>

          <strong>{form.customerName || 'Customer name'}</strong>

          {form.customerAddress && <p>{form.customerAddress}</p>}
        </div>

        <div className="meta-right">
          <p>
            <strong style={{ fontWeight: 800 }}>INVOICE NUMBER:</strong>

            <strong style={{ fontWeight: 800 }}>
              {form.invoiceNumber || '—'}
            </strong>
          </p>

          <p>
            <strong style={{ fontWeight: 800 }}>DATE:</strong>

            <strong style={{ fontWeight: 800 }}>
              {formatDate(form.issueDate)}
            </strong>
          </p>
        </div>
      </div>

      <table className="invoice-table">
        <thead>
          <tr>
            <th>PRODUCT</th>

            <th>UNIT</th>

            <th>PRICE</th>

            <th>QUANTITY</th>

            <th>TOTAL</th>
          </tr>
        </thead>

        <tbody>
          {form.items.map((item, i) => (
            <tr key={i}>
              <td>{item.productName || '—'}</td>

              <td>{item.unit || '—'}</td>

              <td>{money(toCents(item.unitPrice))}</td>

              <td>{qty(item.quantity)}</td>

              <td>{money(toCents(item.unitPrice) * qty(item.quantity))}</td>
            </tr>
          ))}

          {Array.from({ length: Math.max(0, 3 - form.items.length) }).map(
            (_, i) => (
              <tr className="empty-row" key={`empty-${i}`}>
                <td> </td>

                <td />

                <td />

                <td />

                <td />
              </tr>
            ),
          )}
        </tbody>
      </table>

      <div className="invoice-bottom">
        <div className="invoice-totals">
          <div>
            <span>SUBTOTAL</span>

            <strong>{money(subtotal)}</strong>
          </div>

          <div>
            <span>TAX ({taxRate.toFixed(2)}%)</span>

            <strong>{money(tax)}</strong>
          </div>

          <div className="invoice-final-total">
            <span>TOTAL</span>

            <strong>{money(total)}</strong>
          </div>
        </div>
      </div>

      <div className="thank-you">THANK YOU</div>
    </article>
  )
}

function formatDate(value: string) {
  if (!value) return '—'

  const trimmed = value.trim()

  const ymd = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)

  if (ymd)
    return `${ymd[3].padStart(2, '0')}/${ymd[2].padStart(2, '0')}/${ymd[1]}`

  const dmy = trimmed.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/)

  if (dmy)
    return `${dmy[1].padStart(2, '0')}/${dmy[2].padStart(2, '0')}/${dmy[3]}`

  return trimmed
}
