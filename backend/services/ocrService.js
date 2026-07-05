// backend/services/ocrService.js
const Tesseract = require('tesseract.js');
const pdfParse = require('pdf-parse');

/**
 * Extract text from an image using Tesseract.js OCR
 * @param {Buffer} imageBuffer - Image file buffer
 * @returns {Object} - { text, confidence }
 */
const extractTextFromImage = async (imageBuffer) => {
  try {
    console.log('🔍 Starting OCR on image...');

    const {
      data: { text, confidence },
    } = await Tesseract.recognize(imageBuffer, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          console.log(`   OCR Progress: ${(m.progress * 100).toFixed(1)}%`);
        }
      },
    });

    console.log(`✅ OCR Complete. Confidence: ${confidence.toFixed(1)}%`);

    return {
      text: text.trim(),
      confidence: parseFloat(confidence.toFixed(2)),
    };
  } catch (error) {
    console.error('❌ OCR Error:', error.message);
    throw new Error(`OCR processing failed: ${error.message}`);
  }
};

/**
 * Extract text from a PDF file
 * First tries digital text extraction, falls back to OCR if empty
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Object} - { text, confidence, method }
 */
const extractTextFromPDF = async (pdfBuffer) => {
  try {
    console.log('📄 Parsing PDF...');

    // Step 1: Try digital text extraction with pdf-parse
    const pdfData = await pdfParse(pdfBuffer);
    const digitalText = pdfData.text.trim();

    if (digitalText && digitalText.length > 50) {
      // Digital text found — no OCR needed
      console.log(
        `✅ Digital text extracted: ${digitalText.length} characters`
      );
      return {
        text: digitalText,
        confidence: 99, // Digital extraction is highly accurate
        method: 'digital',
        pages: pdfData.numpages,
      };
    }

    // Step 2: If no digital text, the PDF is likely a scanned image
    // For simplicity, we'll try OCR on the raw buffer
    console.log('📸 PDF appears to be scanned. Attempting OCR...');

    const ocrResult = await extractTextFromImage(pdfBuffer);
    return {
      text: ocrResult.text,
      confidence: ocrResult.confidence,
      method: 'ocr',
      pages: pdfData.numpages,
    };
  } catch (error) {
    console.error('❌ PDF parsing error:', error.message);
    throw new Error(`PDF processing failed: ${error.message}`);
  }
};

/**
 * Main function: Extract text from any supported file
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} mimeType - File MIME type
 * @returns {Object} - { text, confidence, method }
 */
const extractText = async (fileBuffer, mimeType) => {
  if (mimeType === 'application/pdf') {
    return await extractTextFromPDF(fileBuffer);
  } else if (mimeType.startsWith('image/')) {
    const result = await extractTextFromImage(fileBuffer);
    return { ...result, method: 'ocr' };
  } else {
    throw new Error(`Unsupported file type: ${mimeType}`);
  }
};

module.exports = { extractText, extractTextFromImage, extractTextFromPDF };
