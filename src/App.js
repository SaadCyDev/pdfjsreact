import React, { useEffect, useRef, useState } from "react";
import { pdfjs } from "pdfjs-dist";
import "./App.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function App() {
  const canvasRef = useRef();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const query = new URLSearchParams(window.location.search);
  const fileUrl = query.get("file");

  useEffect(() => {
    const loadPdf = async () => {
      if (!fileUrl) {
        setError("No file URL provided.");
        setLoading(false);
        return;
      }

      try {
        const loadingTask = pdfjs.getDocument(fileUrl);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;
        setLoading(false);
      } catch (err) {
        console.error("PDF loading error:", err);
        setError("Failed to load PDF.");
        setLoading(false);
      }
    };

    loadPdf();
  }, [fileUrl]);

  return (
    <div className="App">
      <h2>PDF Viewer</h2>
      {loading && <p>Loading PDF...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!error && <canvas ref={canvasRef} />}
    </div>
  );
}

export default App;
