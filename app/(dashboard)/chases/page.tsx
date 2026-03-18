import { getChases } from "@/lib/actions/chases";
import { ChaseCard } from "@/components/chase-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import Link from "next/link";

export default async function ChasesPage() {
  const chases = await getChases();

  const grouped = chases.reduce(
    (acc, ch) => {
      (acc[ch.invoice_id] ??= []).push(ch);
      return acc;
    },
    {} as Record<string, typeof chases>,
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Chases</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {chases.length} message{chases.length !== 1 && "s"} across{" "}
          {Object.keys(grouped).length} invoice
          {Object.keys(grouped).length !== 1 && "s"}
        </p>
      </div>

      {chases.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
            <h3 className="font-semibold mb-2">No chases yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Go to Invoices and hit &quot;Chase&quot; to generate AI reminders.
            </p>
            <Link href="/invoices">
              <Button variant="outline">Go to Invoices</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([invId, items]) => {
            const client =
              items[0]?.invoice?.client_name ?? "Unknown Client";
            const sorted = [...items].sort((a, b) => a.step - b.step);
            return (
              <div key={invId} className="space-y-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {client}
                  </h2>
                  <div className="flex-1 h-px bg-border" />
                </div>
                {sorted.map((ch) => (
                  <ChaseCard key={ch.id} chase={ch} />
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
