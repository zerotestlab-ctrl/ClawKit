import { getInvoices } from "@/lib/actions/invoices";
import { InvoiceForm } from "@/components/invoice-form";
import { InvoiceRow } from "@/components/invoice-row";
import { CSVUpload } from "@/components/csv-upload";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { FileText, Upload } from "lucide-react";

export default async function InvoicesPage() {
  const invoices = await getInvoices();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {invoices.length} total invoice{invoices.length !== 1 && "s"}
          </p>
        </div>
        <InvoiceForm />
      </div>

      {/* csv */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Upload className="h-4 w-4" /> Bulk Import
          </CardTitle>
          <CardDescription>
            Upload a CSV to import multiple invoices at once
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CSVUpload />
        </CardContent>
      </Card>

      {/* list */}
      {invoices.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
            <h3 className="font-semibold mb-2">No invoices yet</h3>
            <p className="text-sm text-muted-foreground">
              Add your first invoice or upload a CSV to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {invoices.map((inv) => (
            <InvoiceRow key={inv.id} invoice={inv} />
          ))}
        </div>
      )}
    </div>
  );
}
