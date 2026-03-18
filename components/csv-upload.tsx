"use client";

import { useState, useRef } from "react";
import Papa from "papaparse";
import { bulkCreateInvoices } from "@/lib/actions/invoices";
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";

interface Row {
  client_name: string;
  amount: string | number;
  due_date: string;
  phone?: string;
  email?: string;
  notes?: string;
}

export function CSVUpload() {
  const [preview, setPreview] = useState<Row[]>([]);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    error?: string;
    count?: number;
  } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setResult(null);

    Papa.parse<Row>(file, {
      header: true,
      skipEmptyLines: true,
      complete(r) {
        setPreview(
          r.data
            .filter((row) => row.client_name && row.amount && row.due_date)
            .slice(0, 50),
        );
      },
      error() {
        setResult({
          error:
            "Could not parse CSV. Required columns: client_name, amount, due_date",
        });
      },
    });
  }

  async function upload() {
    if (!preview.length) return;
    setLoading(true);
    setResult(null);
    const res = await bulkCreateInvoices(
      preview.map((r) => ({
        client_name: String(r.client_name).trim(),
        amount: parseFloat(String(r.amount)),
        due_date: String(r.due_date).trim(),
        phone: r.phone?.toString().trim(),
        email: r.email?.toString().trim(),
        notes: r.notes?.toString().trim(),
      })),
    );
    setResult(res);
    if (res.success) {
      setPreview([]);
      setFileName("");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        className="w-full border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => fileRef.current?.click()}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          onChange={onFile}
          className="hidden"
        />
        <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
        <p className="text-sm font-medium">
          {fileName || "Drop CSV here or click to upload"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Required: client_name, amount, due_date · Optional: phone, email,
          notes
        </p>
      </button>

      {preview.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <FileText className="h-4 w-4 text-primary" />
            {preview.length} invoices ready
          </div>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-2.5 font-medium">Client</th>
                  <th className="text-left p-2.5 font-medium">Amount</th>
                  <th className="text-left p-2.5 font-medium">Due</th>
                  <th className="text-left p-2.5 font-medium">Email</th>
                </tr>
              </thead>
              <tbody>
                {preview.slice(0, 8).map((r, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="p-2.5">{r.client_name}</td>
                    <td className="p-2.5">
                      ${Number(r.amount).toLocaleString()}
                    </td>
                    <td className="p-2.5">{r.due_date}</td>
                    <td className="p-2.5 text-muted-foreground">
                      {r.email || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {preview.length > 8 && (
            <p className="text-xs text-muted-foreground">
              +{preview.length - 8} more…
            </p>
          )}
          <Button onClick={upload} disabled={loading} variant="glow">
            {loading ? "Importing…" : `Import ${preview.length} Invoices`}
          </Button>
        </div>
      )}

      {result?.success && (
        <p className="flex items-center gap-2 text-emerald-400 text-sm">
          <CheckCircle className="h-4 w-4" /> Imported {result.count} invoices!
        </p>
      )}
      {result?.error && (
        <p className="flex items-center gap-2 text-destructive text-sm">
          <AlertCircle className="h-4 w-4" /> {result.error}
        </p>
      )}
    </div>
  );
}
