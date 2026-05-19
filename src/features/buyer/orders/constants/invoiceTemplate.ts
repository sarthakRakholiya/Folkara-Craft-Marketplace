export interface InvoiceTemplateData {
  formattedOrderId: string;
  orderDate: string;
  title: string;
  artisan: string;
  price: number;
  shippingCost: number;
  grandTotal: number;
  shippingName?: string;
  shippingAddress?: string;
}

export function generateInvoiceHtml(data: InvoiceTemplateData): string {
  const {
    formattedOrderId,
    orderDate,
    title,
    artisan,
    price,
    shippingCost,
    grandTotal,
    shippingName,
    shippingAddress,
  } = data;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Folkara Invoice - #FLK-${formattedOrderId}</title>
        <style>
          body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            color: #1e293b;
            margin: 0;
            padding: 40px;
            line-height: 1.6;
            font-size: 14px;
            background-color: #fff;
          }
          .container {
            max-width: 768px;
            margin: 0 auto;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #f1f5f9;
            padding-bottom: 24px;
            margin-bottom: 30px;
          }
          .logo {
            font-family: 'Times New Roman', Times, serif;
            font-size: 26px;
            font-weight: 800;
            letter-spacing: 2px;
            color: #0f172a;
            text-transform: uppercase;
          }
          .meta {
            text-align: right;
          }
          .title {
            font-size: 28px;
            font-weight: 700;
            color: #0f172a;
            margin: 0 0 10px 0;
            letter-spacing: 1px;
          }
          .grid {
            display: grid;
            grid-template-columns: 1.2fr 0.8fr;
            gap: 40px;
            margin-bottom: 40px;
          }
          .section-title {
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
            color: #64748b;
            margin-bottom: 10px;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          .table th {
            text-align: left;
            padding: 12px;
            background-color: #f8fafc;
            border-bottom: 2px solid #e2e8f0;
            font-weight: 600;
            color: #475569;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .table td {
            padding: 16px 12px;
            border-bottom: 1px solid #f1f5f9;
          }
          .totals {
            width: 320px;
            margin-left: auto;
            margin-bottom: 40px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 13px;
          }
          .grand-total {
            border-top: 2px solid #0f172a;
            padding-top: 12px;
            font-size: 16px;
            font-weight: 700;
            color: #0f172a;
          }
          .footer {
            border-top: 1px solid #f1f5f9;
            padding-top: 30px;
            text-align: center;
            color: #94a3b8;
            font-size: 11px;
          }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div>
              <div class="logo">FOLKARA</div>
              <p style="margin: 6px 0 0 0; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Slow-Made Craft Marketplace</p>
            </div>
            <div class="meta">
              <h1 class="title">INVOICE</h1>
              <p style="margin: 0; font-weight: 700; font-size: 13px; color: #0f172a;">Invoice #: FLK-${formattedOrderId}</p>
              <p style="margin: 4px 0 0 0; color: #64748b; font-size: 12px;">Date: ${orderDate}</p>
            </div>
          </div>

          <div class="grid">
            <div>
              <div class="section-title">DELIVER TO</div>
              <p style="margin: 0; font-weight: 700; color: #334155; font-size: 13px;">${shippingName || 'Valued Customer'}</p>
              <p style="margin: 4px 0 0 0; color: #64748b; font-size: 12px; line-height: 1.5; max-width: 280px;">
                ${shippingAddress || 'Handcrafted Hub, Sector 4, Mumbai, MH 400051'}
              </p>
            </div>
            <div>
              <div class="section-title">PAYMENT STATUS</div>
              <p style="margin: 0; font-weight: 700; color: #334155; font-size: 13px;">Secure Stripe Gateway</p>
              <p style="margin: 6px 0 0 0; display: inline-block; background-color: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; font-weight: 700; font-size: 9px; padding: 4px 10px; border-radius: 6px; letter-spacing: 0.5px; text-transform: uppercase;">
                ✓ PAID
              </p>
            </div>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Craft Description</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div style="font-weight: 700; color: #1e293b; font-size: 14px;">${title}</div>
                  <div style="font-size: 11px; color: #94a3b8; margin-top: 4px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Artisan partner: ${artisan}</div>
                </td>
                <td style="text-align: center; color: #475569; font-weight: 600;">1</td>
                <td style="text-align: right; color: #475569;">₹${price.toFixed(2)}</td>
                <td style="text-align: right; font-weight: 700; color: #0f172a;">₹${price.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div class="totals">
            <div class="total-row">
              <span style="color: #64748b; font-weight: 500;">Cart Subtotal</span>
              <span style="font-weight: 700; color: #334155;">₹${price.toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span style="color: #64748b; font-weight: 500;">Shipping & Handling</span>
              <span style="font-weight: 700; color: #334155;">₹${shippingCost.toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span style="color: #64748b; font-weight: 500;">Estimated Taxes</span>
              <span style="font-weight: 700; color: #334155;">₹0.00</span>
            </div>
            <div class="total-row grand-total">
              <span>Grand Total</span>
              <span>₹${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div class="footer">
            <p style="font-weight: 600; color: #64748b;">Thank you for supporting independent artisans and keeping slow-crafted traditions alive.</p>
            <p style="margin-top: 10px; color: #94a3b8; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Folkara Marketplace • slow-made</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
