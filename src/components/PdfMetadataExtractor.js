import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import * as XLSX from 'xlsx';

function PdfMetadataExtractor() {
  const [metadata, setMetadata] = useState([]);
  const [fileName, setFileName] = useState("");

  // Function to handle PDF file input and extract metadata
  const handlePdfFile = async (event) => {
    const file = event.target.files[0];
    setFileName(file.name);
    const pdfBytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const { info } = pdfDoc.context;
    const metadata = {
      createdDate: info.CreationDate ? new Date(info.CreationDate) : 'Unknown',
      modifiedDate: info.ModDate ? new Date(info.ModDate) : 'Unknown',
      fileName: file.name
    };

    setMetadata([metadata]);
  };

  // Function to export the metadata to an Excel file
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(metadata);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Metadata");

    XLSX.writeFile(wb, `PDF_Metadata_${fileName}.xlsx`);
  };

  return (
    <div>
      <h1>PDF Metadata Extractor</h1>
      <input type="file" accept=".pdf" onChange={handlePdfFile} />

      {metadata.length > 0 && (
        <div className="metadata-preview">
          <h2>Metadata Preview</h2>
          <table>
            <thead>
              <tr>
                <th>File Name</th>
                <th>Created Date</th>
                <th>Modified Date</th>
              </tr>
            </thead>
            <tbody>
              {metadata.map((data, index) => (
                <tr key={index}>
                  <td>{data.fileName}</td>
                  <td>{data.createdDate.toString()}</td>
                  <td>{data.modifiedDate.toString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={exportToExcel}>Export to Excel</button>
        </div>
      )}
    </div>
  );
}

export default PdfMetadataExtractor;
