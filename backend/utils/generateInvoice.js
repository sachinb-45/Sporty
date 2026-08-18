import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

const generateInvoice = (order, res) => {
  const doc = new PDFDocument({
    size: "A4",
    margin: 40,
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=Invoice-${order._id}.pdf`
  );

  doc.pipe(res);

  // Background Watermark
  drawWatermark(doc);

  // Header & Divider
  drawHeader(doc);

  // Invoice & Customer Info Side-by-Side
  const nextY = drawInvoiceAndCustomerInfo(doc, order);

  // Products Table
  const tableEndY = drawProductsTable(doc, order, nextY);

  // Summary & Payment Section
  const summaryEndY = drawSummaryAndPayment(doc, order, tableEndY);

  // Signature & Terms
  drawTermsAndSignature(doc, summaryEndY);

  // Footer Line & Copyright
  drawFooter(doc);

  doc.end();
};

function drawWatermark(doc) {
  doc.save();
  doc.rotate(-35, { origin: [300, 420] });
  doc
    .fontSize(85)
    .fillColor("#CBD5E1")
    .opacity(0.15)
    .text("SPORTY", 90, 370, { align: "center" });
  doc.restore();
}

function drawHeader(doc) {
  const logo = path.join(process.cwd(), "assets", "sporty-logo.png");

  if (fs.existsSync(logo)) {
    try {
      doc.image(logo, 40, 28, { fit: [50, 50] });
    } catch (e) {
      // Fallback if logo fails
    }
  }

  // Brand Name
  doc
    .fontSize(24)
    .font("Helvetica-Bold")
    .fillColor("#0057D9")
    .text("SPORTY", 100, 32);

  doc
    .fontSize(9.5)
    .font("Helvetica")
    .fillColor("#64748B")
    .text("Gear Up Your Victory", 100, 60);

  // Company Details Right Aligned
  doc
    .fontSize(11)
    .font("Helvetica-Bold")
    .fillColor("#1E293B")
    .text("Sporty Hub Store", 300, 32, { align: "right" });

  doc
    .fontSize(9)
    .font("Helvetica")
    .fillColor("#64748B")
    .text("123, Sports Street, Coimbatore, India", 300, 48, { align: "right" })
    .text("support@sporty.com | +91 98765 43210", 300, 62, { align: "right" });

  // Blue Header Divider Line
  doc
    .strokeColor("#0057D9")
    .lineWidth(2.5)
    .moveTo(40, 88)
    .lineTo(555, 88)
    .stroke();
}

function drawInvoiceAndCustomerInfo(doc, order) {
  const startY = 112;

  // Left Column: Invoice Details
  doc
    .fontSize(13)
    .font("Helvetica-Bold")
    .fillColor("#0057D9")
    .text("INVOICE DETAILS", 40, startY);

  const invNum =
    order.invoiceNumber ||
    `INV-${new Date().getFullYear()}-${order._id.toString().slice(-5).toUpperCase()}`;

  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor("#334155")
    .text("Invoice No : ", 40, startY + 22, { continued: true })
    .font("Helvetica-Bold")
    .text(invNum)
    .font("Helvetica")
    .text("Order ID : ", 40, startY + 39, { continued: true })
    .font("Helvetica-Bold")
    .text(order._id.toString())
    .font("Helvetica")
    .text(`Order Date : ${new Date(order.createdAt || Date.now()).toLocaleDateString()}`, 40, startY + 56)
    .text("Status : ", 40, startY + 73, { continued: true })
    .font("Helvetica-Bold")
    .fillColor("#059669")
    .text(order.status || "Placed");

  // Right Column: Customer Details
  doc
    .fontSize(13)
    .font("Helvetica-Bold")
    .fillColor("#0057D9")
    .text("CUSTOMER DETAILS", 300, startY);

  const phone = order.customerPhone || "N/A";
  const address = order.shippingAddress || order.address || "N/A";

  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor("#334155")
    .text("Name : ", 300, startY + 22, { continued: true })
    .font("Helvetica-Bold")
    .text(order.customerName || "N/A")
    .font("Helvetica")
    .text(`Email : ${order.customerEmail || "N/A"}`, 300, startY + 39)
    .text(`Phone : ${phone}`, 300, startY + 56)
    .text(`Address : ${address}`, 300, startY + 73, { width: 255 });

  return startY + 105;
}

function drawProductsTable(doc, order, startY) {
  let tableTop = startY;

  // Header Table Background
  doc
    .rect(40, tableTop, 515, 28)
    .fill("#0057D9");

  // Header Titles
  doc
    .fillColor("#FFFFFF")
    .fontSize(10.5)
    .font("Helvetica-Bold")
    .text("Product Name", 55, tableTop + 8)
    .text("Qty", 310, tableTop + 8, { width: 40, align: "center" })
    .text("Price", 370, tableTop + 8, { width: 80, align: "right" })
    .text("Total", 465, tableTop + 8, { width: 80, align: "right" });

  let y = tableTop + 28;

  const products = order.products || [];

  products.forEach((item, index) => {
    const total = item.quantity * item.price;
    const productName = item.productId?.name || item.name || "Sports Product";

    // Row Background Zebra Striping
    if (index % 2 === 0) {
      doc.rect(40, y, 515, 28).fill("#F8FAFC");
    } else {
      doc.rect(40, y, 515, 28).fill("#FFFFFF");
    }

    doc
      .fillColor("#1E293B")
      .fontSize(10)
      .font("Helvetica")
      .text(productName, 55, y + 8, { width: 250, ellipsis: true })
      .text(item.quantity.toString(), 310, y + 8, { width: 40, align: "center" })
      .text(`Rs. ${item.price}`, 370, y + 8, { width: 80, align: "right" })
      .text(`Rs. ${total}`, 465, y + 8, { width: 80, align: "right" });

    // Border line
    doc
      .strokeColor("#E2E8F0")
      .lineWidth(0.5)
      .rect(40, y, 515, 28)
      .stroke();

    y += 28;
  });

  return y + 25;
}

function drawSummaryAndPayment(doc, order, startY) {
  let y = startY;

  // Left Box: Payment Details
  doc
    .roundedRect(40, y, 245, 100, 6)
    .strokeColor("#CBD5E1")
    .lineWidth(1)
    .stroke();

  doc
    .fontSize(11)
    .font("Helvetica-Bold")
    .fillColor("#0057D9")
    .text("Payment Information", 55, y + 14);

  doc
    .fontSize(9.5)
    .font("Helvetica")
    .fillColor("#334155")
    .text("Payment Method: ", 55, y + 38, { continued: true })
    .font("Helvetica-Bold")
    .text(order.paymentMethod || "Cash On Delivery")
    .font("Helvetica")
    .text("Payment Status: ", 55, y + 60, { continued: true })
    .font("Helvetica-Bold")
    .fillColor("#D97706")
    .text(order.paymentMethod === "Online" ? "Completed" : "Pending on Delivery");

  // Right Box: Order Summary
  const boxX = 305;
  const boxWidth = 250;

  doc
    .roundedRect(boxX, y, boxWidth, 100, 6)
    .strokeColor("#0057D9")
    .lineWidth(1)
    .stroke();

  doc
    .fontSize(9.5)
    .font("Helvetica")
    .fillColor("#334155")
    .text("Subtotal:", boxX + 15, y + 15)
    .text(`Rs. ${order.totalAmount}`, boxX + 120, y + 15, { width: 115, align: "right" })
    .text("Delivery Fee:", boxX + 15, y + 36)
    .text("FREE", boxX + 120, y + 36, { width: 115, align: "right" });

  doc
    .strokeColor("#E2E8F0")
    .lineWidth(0.5)
    .moveTo(boxX + 15, y + 56)
    .lineTo(boxX + 235, y + 56)
    .stroke();

  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .fillColor("#0057D9")
    .text("Grand Total:", boxX + 15, y + 68)
    .text(`Rs. ${order.totalAmount}`, boxX + 120, y + 68, { width: 115, align: "right" });

  return y + 130;
}

function drawTermsAndSignature(doc, startY) {
  let y = startY;

  // Terms & Conditions Left
  doc
    .fontSize(11)
    .font("Helvetica-Bold")
    .fillColor("#0057D9")
    .text("Terms & Conditions", 40, y);

  doc
    .fontSize(9)
    .font("Helvetica")
    .fillColor("#64748B")
    .text("1. Keep this invoice for any returns or warranty claims.", 40, y + 18)
    .text("2. Items can be returned within 7 days of delivery.", 40, y + 34)
    .text("3. For support, contact support@sporty.com", 40, y + 50);

  // Authorized Signature Right
  doc
    .fontSize(11)
    .font("Helvetica-Bold")
    .fillColor("#0057D9")
    .text("Authorized Signature", 370, y, { align: "right" });

  doc
    .strokeColor("#94A3B8")
    .lineWidth(1)
    .moveTo(370, y + 52)
    .lineTo(555, y + 52)
    .stroke();

  doc
    .fontSize(9.5)
    .font("Helvetica")
    .fillColor("#64748B")
    .text("SPORTY Authorized Team", 370, y + 60, { align: "right" });
}

function drawFooter(doc) {
  const footerY = 735;

  doc
    .strokeColor("#E2E8F0")
    .lineWidth(1)
    .moveTo(40, footerY)
    .lineTo(555, footerY)
    .stroke();

  doc
    .fontSize(13)
    .font("Helvetica-Bold")
    .fillColor("#0057D9")
    .text("THANK YOU FOR SHOPPING WITH SPORTY!", 40, footerY + 12, { align: "center" });

  doc
    .fontSize(9)
    .font("Helvetica")
    .fillColor("#94A3B8")
    .text("SPORTY Premium Sports Equipment Store | www.sporty.com", 40, footerY + 28, { align: "center" });
}

export default generateInvoice;