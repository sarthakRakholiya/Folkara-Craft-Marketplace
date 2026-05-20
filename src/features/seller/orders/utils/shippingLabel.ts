import { SellerOrder } from "../views/SellerOrdersView";

export const getShippingLabelHtml = (activeOrder: SellerOrder) => `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Folkara Shipping Label - #${activeOrder.orderId.substring(0, 8).toUpperCase()}</title>
            <style>
              @page {
                size: 4in 6in;
                margin: 0;
              }
              body {
                font-family: 'Courier New', Courier, monospace;
                color: #000;
                margin: 0;
                padding: 20px;
                box-sizing: border-box;
                width: 100%;
                height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                border: 4px solid #000;
              }
              .header {
                border-bottom: 2px dashed #000;
                padding-bottom: 8px;
                text-align: center;
              }
              .logo {
                font-size: 24px;
                font-weight: bold;
                letter-spacing: 2px;
                text-transform: uppercase;
                margin-bottom: 4px;
              }
              .marketplace-text {
                font-size: 9px;
                text-transform: uppercase;
                letter-spacing: 1px;
              }
              .routing-row {
                display: flex;
                border-bottom: 2px dashed #000;
                font-size: 11px;
                padding: 8px 0;
              }
              .routing-block {
                flex: 1;
                border-right: 1px dashed #000;
                padding-left: 4px;
              }
              .routing-block:last-child {
                border-right: none;
              }
              .address-section {
                padding: 12px 0;
                font-size: 11px;
                line-height: 1.4;
                flex-grow: 1;
              }
              .sender-address {
                font-size: 9px;
                margin-bottom: 12px;
                border-bottom: 1px dashed #000;
                padding-bottom: 8px;
              }
              .recipient-address {
                font-size: 12px;
              }
              .recipient-title {
                font-weight: bold;
                font-size: 10px;
                text-transform: uppercase;
                margin-bottom: 4px;
              }
              .recipient-name {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 4px;
              }
              .barcode-section {
                text-align: center;
                border-top: 2px dashed #000;
                padding-top: 12px;
                margin-bottom: 12px;
              }
              .barcode {
                width: 100%;
                height: 60px;
                background: linear-gradient(90deg, 
                  #000 0%, #000 4%, transparent 4%, transparent 6%,
                  #000 6%, #000 12%, transparent 12%, transparent 14%,
                  #000 14%, #000 16%, transparent 16%, transparent 20%,
                  #000 20%, #000 28%, transparent 28%, transparent 30%,
                  #000 30%, #000 32%, transparent 32%, transparent 36%,
                  #000 36%, #000 42%, transparent 42%, transparent 44%,
                  #000 44%, #000 46%, transparent 46%, transparent 52%,
                  #000 52%, #000 58%, transparent 58%, transparent 60%,
                  #000 60%, #000 68%, transparent 68%, transparent 70%,
                  #000 70%, #000 72%, transparent 72%, transparent 78%,
                  #000 78%, #000 84%, transparent 84%, transparent 86%,
                  #000 86%, #000 90%, transparent 90%, transparent 92%,
                  #000 92%, #000 100%
                );
                margin-bottom: 6px;
              }
              .tracking-text {
                font-size: 10px;
                font-weight: bold;
                letter-spacing: 2px;
              }
              .footer {
                font-size: 9px;
                text-align: center;
                border-top: 1px dashed #000;
                padding-top: 6px;
                display: flex;
                justify-content: space-between;
              }
              @media print {
                body {
                  border: none;
                  padding: 10px;
                }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">FOLKARA</div>
              <div class="marketplace-text">Slow-Made Craft Marketplace</div>
            </div>
            
            <div class="routing-row">
              <div class="routing-block">
                <strong>METHOD:</strong><br/>
                ${activeOrder.deliveryMethod}
              </div>
              <div class="routing-block">
                <strong>ORDER ID:</strong><br/>
                #${activeOrder.orderId.substring(0, 8).toUpperCase()}
              </div>
            </div>

            <div class="address-section">
              <div class="sender-address">
                <strong>FROM:</strong><br/>
                Folkara Artisan Studio Partner<br/>
                Handcrafted Hub, Sector 4<br/>
                Mumbai, MH 400051
              </div>
              <div class="recipient-address">
                <div class="recipient-title">DELIVER TO:</div>
                <div class="recipient-name">${activeOrder.customerName}</div>
                <div>${activeOrder.shippingAddress}</div>
              </div>
            </div>

            <div class="barcode-section">
              <div class="barcode"></div>
              <div class="tracking-text">FK-${activeOrder.orderId.substring(0, 8).toUpperCase()}-IN</div>
            </div>

            <div class="footer">
              <span>Date: ${activeOrder.orderDate}</span>
              <span>Qty: ${activeOrder.quantity} item(s)</span>
            </div>
            
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() {
                  window.close();
                }, 1000);
              };
            </script>
          </body>
        </html>
      `;
