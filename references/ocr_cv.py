"""
OCR-based PDF text extraction using PyMuPDF.
Renders PDF pages to images and uses Tesseract OCR to extract text.

Requirements:
    pip install pymupdf pytesseract pillow

System dependencies (for OCR mode):
    - Tesseract OCR:
        Windows: Download from https://github.com/UB-Mannheim/tesseract/wiki
                 Add to PATH or set TESSERACT_CMD below
"""

import sys
from pathlib import Path

try:
    import fitz  # PyMuPDF
    from PIL import Image
    import io
except ImportError as e:
    print(f"Missing dependency: {e}")
    print("\nInstall with: pip install pymupdf pillow")
    sys.exit(1)

# Try to import pytesseract (optional)
try:
    import pytesseract
    HAS_TESSERACT = True
except ImportError:
    HAS_TESSERACT = False

# Configure Tesseract path (not in PATH by default on Windows)
if HAS_TESSERACT:
    pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

pdf_path = Path(__file__).parent / "Bruno Tachinardi - CV [EN].pdf"


def extract_with_pymupdf_text(pdf_path):
    """
    Extract text using PyMuPDF's built-in text extraction.
    This often works better than pdfplumber for certain PDF types.
    """
    results = []
    doc = fitz.open(pdf_path)

    for i, page in enumerate(doc, 1):
        # Get text with layout preservation
        text = page.get_text("text")
        results.append((i, text))

    doc.close()
    return results


def extract_with_ocr(pdf_path, dpi=300):
    """
    Render PDF to images and extract text using Tesseract OCR.
    """
    if not HAS_TESSERACT:
        print("pytesseract not available, skipping OCR")
        return []

    # Check if tesseract is actually installed
    try:
        pytesseract.get_tesseract_version()
    except Exception as e:
        print(f"Tesseract not found: {e}")
        print("\nInstall Tesseract OCR:")
        print("  Windows: https://github.com/UB-Mannheim/tesseract/wiki")
        print("  Then add to PATH or set TESSERACT_CMD in this script")
        return []

    results = []
    doc = fitz.open(pdf_path)

    # Calculate zoom factor for desired DPI (PyMuPDF default is 72 DPI)
    zoom = dpi / 72
    matrix = fitz.Matrix(zoom, zoom)

    for i, page in enumerate(doc, 1):
        print(f"OCR processing page {i}...")

        # Render page to pixmap (image)
        pix = page.get_pixmap(matrix=matrix)

        # Convert to PIL Image
        img_data = pix.tobytes("png")
        image = Image.open(io.BytesIO(img_data))

        # OCR the image
        try:
            # Try Portuguese + English first
            text = pytesseract.image_to_string(
                image,
                lang='por+eng',
                config='--psm 6'  # Assume uniform block of text
            )
        except Exception:
            # Fallback to just English
            text = pytesseract.image_to_string(image, config='--psm 6')

        results.append((i, text))

    doc.close()
    return results


def save_page_images(pdf_path, output_dir=None, dpi=200):
    """
    Save PDF pages as images for manual inspection.
    """
    if output_dir is None:
        output_dir = Path(pdf_path).parent / "cv_pages"

    output_dir = Path(output_dir)
    output_dir.mkdir(exist_ok=True)

    doc = fitz.open(pdf_path)
    zoom = dpi / 72
    matrix = fitz.Matrix(zoom, zoom)

    saved_files = []
    for i, page in enumerate(doc, 1):
        pix = page.get_pixmap(matrix=matrix)
        output_path = output_dir / f"page_{i}.png"
        pix.save(str(output_path))
        saved_files.append(output_path)
        print(f"Saved: {output_path}")

    doc.close()
    return saved_files


def main():
    if not pdf_path.exists():
        print(f"PDF not found: {pdf_path}")
        sys.exit(1)

    print(f"Processing: {pdf_path}\n")

    # Method 1: PyMuPDF built-in text extraction
    print("=" * 60)
    print("METHOD 1: PyMuPDF Text Extraction")
    print("=" * 60 + "\n")

    pymupdf_results = extract_with_pymupdf_text(pdf_path)
    for page_num, text in pymupdf_results:
        print(f"=== PAGE {page_num} ===")
        print(text[:2000] + "..." if len(text) > 2000 else text)
        print()

    # Save PyMuPDF results
    output_path = pdf_path.with_suffix('.pymupdf.txt')
    with open(output_path, 'w', encoding='utf-8') as f:
        for page_num, text in pymupdf_results:
            f.write(f"=== PAGE {page_num} ===\n")
            f.write(text)
            f.write("\n\n")
    print(f"PyMuPDF text saved to: {output_path}\n")

    # Method 2: OCR (if Tesseract available)
    print("=" * 60)
    print("METHOD 2: OCR with Tesseract")
    print("=" * 60 + "\n")

    ocr_results = extract_with_ocr(pdf_path, dpi=300)

    if ocr_results:
        for page_num, text in ocr_results:
            print(f"=== PAGE {page_num} ===")
            print(text[:2000] + "..." if len(text) > 2000 else text)
            print()

        # Save OCR results
        output_path = pdf_path.with_suffix('.ocr.txt')
        with open(output_path, 'w', encoding='utf-8') as f:
            for page_num, text in ocr_results:
                f.write(f"=== PAGE {page_num} ===\n")
                f.write(text)
                f.write("\n\n")
        print(f"OCR text saved to: {output_path}")
    else:
        print("OCR not available. Saving page images for manual inspection...")
        saved = save_page_images(pdf_path)
        print(f"\nSaved {len(saved)} page images to cv_pages/")
        print("You can use online OCR tools or install Tesseract to process these.")


if __name__ == "__main__":
    main()
