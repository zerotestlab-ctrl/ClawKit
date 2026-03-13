import { Link } from "wouter";
import { UploadCloud, Zap, Package, Activity, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetDashboardAnalytics, useListProducts } from "@workspace/api-client-react";
import { formatCurrency } from "@/lib/utils";

export function DashboardHome() {
  const { data: analytics, isLoading: analyticsLoading } = useGetDashboardAnalytics();
  const { data: productsData, isLoading: productsLoading } = useListProducts();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Overview</h1>
          <p className="text-muted-foreground mt-1">Manage and track your distributed agents.</p>
        </div>
        <Link href="/dashboard/products">
          <Button size="lg" className="shadow-lg shadow-primary/20">
            <UploadCloud className="w-5 h-5 mr-2" /> New Product
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/40 border-white/10 backdrop-blur-sm hover-elevate">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" /> Total Invocations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-display font-bold text-white">
              {analyticsLoading ? "..." : (analytics?.totalInvocations?.toLocaleString() || "0")}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/40 border-white/10 backdrop-blur-sm hover-elevate">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" /> Projected Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-display font-bold text-white">
              {analyticsLoading ? "..." : formatCurrency(analytics?.totalRevenue || 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-white/10 backdrop-blur-sm hover-elevate">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-400" /> Active Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-display font-bold text-white">
              {analyticsLoading ? "..." : (analytics?.totalProducts || 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 border-t border-white/10 pt-8">
        <h2 className="text-xl font-display font-semibold text-white mb-6">Recent Products</h2>
        {productsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-32 rounded-xl bg-white/5 animate-pulse" />
            <div className="h-32 rounded-xl bg-white/5 animate-pulse" />
          </div>
        ) : productsData?.products?.length === 0 ? (
          <div className="text-center py-16 px-4 border border-dashed border-white/10 rounded-2xl bg-card/20">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No products yet</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mb-6">Upload your first OpenAPI spec to generate your ClawKit distribution package.</p>
            <Link href="/dashboard/products">
              <Button variant="outline" className="border-white/20">Upload Now</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {productsData?.products?.slice(0, 4).map(product => (
              <Card key={product.id} className="bg-card/40 border-white/10 hover:bg-card/60 transition-colors">
                <CardContent className="p-6 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">{product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{product.description}</p>
                    <div className="flex items-center gap-4 mt-4 text-xs font-medium">
                      <span className="text-primary">{product.invocations.toLocaleString()} invokes</span>
                      <span className="text-emerald-400">{formatCurrency(product.revenue)}</span>
                    </div>
                  </div>
                  <Link href={`/dashboard/products`}>
                    <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-white rounded-full">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 text-center pt-8 border-t border-white/5">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
          Works with MCP, CLI, or API – no lock-in
        </p>
      </div>
    </div>
  );
}
