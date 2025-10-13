import { useCallback, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function DiseaseDetection() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = useCallback((selectedFile) => {
    if (!selectedFile) {
      setFile(null);
      setPreview(null);
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  }, []);

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await axios.post(`${API_BASE_URL}/disease`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(data);
    } catch (apiError) {
      const message = apiError?.response?.data?.error || apiError.message;
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Disease Detection</h1>
        <p className="mt-2 text-sm text-slate-600">
          Upload a clear image of the plant leaf to detect possible diseases and suggested treatment.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div
          className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-slate-300 bg-white p-8 text-center shadow"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <p className="text-sm text-slate-600">
            Drag & drop an image here, or click to select
          </p>
          <label className="cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary/90">
            Choose Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => handleFile(event.target.files?.[0])}
            />
          </label>
          {preview && (
            <img
              src={preview}
              alt="Selected leaf"
              className="mt-4 h-48 w-48 rounded-md object-cover shadow"
            />
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-primary px-4 py-2 text-white font-semibold shadow hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/60"
        >
          {loading ? "Analyzing..." : "Detect Disease"}
        </button>
        {loading && <Loader label="Processing" />}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>

      {result && (
        <section className="rounded-lg bg-white p-6 shadow space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Detection Result</h2>
          <p className="text-sm text-slate-700">
            Disease identified: <span className="font-semibold text-primary">{result.disease}</span>
          </p>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Suggested Pesticide</h3>
            <p className="mt-2 text-sm text-slate-600">{result.recommended_pesticide}</p>
          </div>
        </section>
      )}
    </section>
  );
}

export default DiseaseDetection;
