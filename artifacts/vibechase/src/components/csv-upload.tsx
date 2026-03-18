"use client";

import { useState, useRef } from "react";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { bulkCreateInvoices } from "@/actions/invoices";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";

interface CSVRow {
  client_name: string;
  amount: string | number;
  due_date: string;
  phone?: string;
  email?: string;
  notes?: string;
}

export function CSVUpload() {
  const [preview, setPreview] = useState<CSVRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; error?: string; count?: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setResult(null);

    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        const valid = results.data.filter(
          (row) => row.client_name && row.amount && row.due_date
        );
        setPreview(valid.slice(0, 10));
      },
      error() {
        setResult({ error: "Could not parse CSV. Make sure it has client_name, amount, due_date columns." });
      },
    });
  }

  async function handleUpload() {
    if (!preview.length) return;
    setLoading(true);
    setResult(null);

    const invoices = preview.map((row) => ({
      client_name: String(row.client_name).trim(),
      amount: parseFloat(String(row.amount)),
      due_date: String(row.due_date).trim(),
      phone: row.phone?.toString().trim(),
      email: row.email?.toString().trim(),
      notes: row.notes?.toString().trim(),
    }));

    const res = await bulkCreateInvoices(invoices);
    setResult(res);
    if (res.success) {
      setPreview([]);
      setFileName("");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => fileRef.current?.click()}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          onChange={handleFile}
          className="hidden"
        />
        <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
        <p className="text-sm font-medium">
          {fileName || "Drop your CSV here or click to upload"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Required columns: client_name, amount, due_date. Optional: phone, email, notes
        </p>
      </div>

      {preview.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <FileText className="h-4 w-4 text-primary" />
            <span>{preview.length} invoices ready to import</span>
          </div>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-2 font-medium">Client</th>
                  <th className="text-left p-2 font-medium">Amount</th>
                  <th className="text-left p-2 font-medium">Due Date</th>
                  <th className="text-left p-2 font-medium">Email</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="p-2">{row.client_name}</td>
                    <td className="p-2">${Number(row.amount).toLocaleString()}</td>
                    <td className="p-2">{row.due_date}</td>
                    <td className="p-2 text-muted-foreground">{row.email || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button onClick={handleUpload} disabled={loading} variant="glow">
            {loading ? "Importing..." : `Import ${preview.length} Invoices`}
          </Button>
        </div>
      )}

      {result?.success && (
        <div className="flex items-center gap-2 text-green-400 text-sm">
          <CheckCircle className="h-4 w-4" />
          Successfully imported {result.count} invoices!
        </div>
      )}
      {result?.error && (
        <div className="flex items-center gap-2 text-destructive text-sm">
          <AlertCircle className="h-4 w-4" />
          {result.error}
        </div>
      )}
    </div>
  );
}
