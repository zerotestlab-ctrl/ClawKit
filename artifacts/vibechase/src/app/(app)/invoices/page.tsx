import { getInvoices } from "@/actions/invoices";
import { InvoiceForm } from "@/components/invoice-form";
import { InvoiceActions } from "@/components/invoice-actions";
import { CSVUpload } from "@/components/csv-upload";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload } from "lucide-react";
import { formatUSD, formatDate, daysOverdue } from "@/lib/utils";

const statusVariant: Record<string, "success" | "warning" | "destructive" | "info" | "outline"> = {
  paid: "success",
  sent: "info",
  partial: "warning",
  overdue: "destructive",
  unpaid: "outline",
};

export default async function InvoicesPage() {
  const invoices = await getInvoices();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {invoices.length} total invoices
          </p>
        </div>
        <InvoiceForm />
      </div>

      {/* CSV Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Bulk Import
          </CardTitle>
          <CardDescription>Upload a CSV file to import multiple invoices at once</CardDescription>
        </CardHeader>
        <CardContent>
          <CSVUpload />
        </CardContent>
      </Card>

      {/* Invoice List */}
      {invoices.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="font-semibold mb-2">No invoices yet</h3>
            <p className="text-sm text-muted-foreground">
              Add your first invoice manually or upload a CSV to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {invoices.map((invoice) => (
            <Card key={invoice.id} className="hover:border-border/80 transition-colors">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold truncate">{invoice.client_name}</h3>
                      <Badge variant={statusVariant[invoice.status] || "outline"}>
                        {invoice.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {formatUSD(Number(invoice.amount))}
                      </span>
                      <span>Due {formatDate(invoice.due_date)}</span>
                      {invoice.status !== "paid" && daysOverdue(invoice.due_date) > 0 && (
                        <span className="text-destructive">
                          {daysOverdue(invoice.due_date)} days overdue
                        </span>
                      )}
                      {invoice.email && <span>{invoice.email}</span>}
                      {invoice.phone && <span>{invoice.phone}</span>}
                    </div>
                    {invoice.notes && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {invoice.notes}
                      </p>
                    )}
                  </div>
                  <InvoiceActions invoice={invoice} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
