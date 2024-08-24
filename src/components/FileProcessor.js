import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

function FileProcessor() {
  const [excelData, setExcelData] = useState([]);
  const [pdfPreviews, setPdfPreviews] = useState([]);

  // Function to handle Excel file input
  const handleExcelFile = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const filteredData = jsonData.map(row => ({
        serialNumber: row['Serial Number'],
        email: row['Email']
      }));

      setExcelData(filteredData);
    };

    reader.readAsArrayBuffer(file);
  };

  // Function to handle PDF file input and process it
  const handlePdfFile = async (event) => {
    const file = event.target.files[0];
    const pdfBytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const pdfPages = pdfDoc.getPages();
    const previews = [];

    for (let i = 0; i < pdfPages.length; i++) {
      const pagePdf = await PDFDocument.create();
      const [copiedPage] = await pagePdf.copyPages(pdfDoc, [i]);
      pagePdf.addPage(copiedPage);

      const pdfData = await pagePdf.save();

      const { serialNumber } = excelData[i] || {}; // Handle cases where excelData is shorter than pdfPages
      const fileName = `${serialNumber || 'Unnamed'}_page_${i + 1}.pdf`; // Fallback to Unnamed if no serial number

      // Create a preview URL for the PDF page
      const previewUrl = URL.createObjectURL(new Blob([pdfData], { type: 'application/pdf' }));

      previews.push({ fileName, previewUrl, pdfData });
    }

    setPdfPreviews(previews);
  };

  // Function to create a zip file and download all PDFs
  const downloadAllPdfsAsZip = async () => {
    const zip = new JSZip();

    pdfPreviews.forEach(({ fileName, pdfData }) => {
      zip.file(fileName, pdfData);
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, 'pdf_files.zip');
  };

  return (
    <div>
      <h1>Excel and PDF Processor</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleExcelFile} />
      <input type="file" accept=".pdf" onChange={handlePdfFile} />

      <div className="pdf-previews">
        {pdfPreviews.length > 0 && (
          <>
            <h2>Preview and Download PDFs</h2>
            {pdfPreviews.map(({ fileName, previewUrl }, index) => (
              <div key={index} className="pdf-preview">
                <h3>{fileName}</h3>
                <iframe src={previewUrl} width="100%" height="500px" title={fileName}></iframe>
              </div>
            ))}
            <button onClick={downloadAllPdfsAsZip}>Download All PDFs as Zip</button>
          </>
        )}
      </div>
    </div>
  );
}

export default FileProcessor;
