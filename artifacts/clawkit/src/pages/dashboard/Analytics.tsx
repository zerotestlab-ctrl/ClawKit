import { Activity, ArrowUpRight, TrendingUp, BarChart2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetDashboardAnalytics } from "@workspace/api-client-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils";

export function Analytics() {
  const { data, isLoading } = useGetDashboardAnalytics();

  if (isLoading) {
    return <div className="p-12 text-center animate-pulse text-muted-foreground">Loading analytics...</div>;
  }

  if (!data) return null;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">Distribution Analytics</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">Real-time insights across all agent runtimes.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        <Card className="bg-card/40 border-white/10 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 p-4 opacity-10"><Activity className="w-12 sm:w-16 h-12 sm:h-16 text-primary" /></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Total Invocations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl sm:text-4xl font-display font-bold text-white">{data.totalInvocations.toLocaleString()}</div>
            <p className="text-xs text-primary mt-2 flex items-center gap-1 font-medium"><ArrowUpRight className="w-3 h-3" /> +24% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-white/10 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 p-4 opacity-10"><TrendingUp className="w-12 sm:w-16 h-12 sm:h-16 text-emerald-400" /></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Generated Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl sm:text-4xl font-display font-bold text-emerald-400">{formatCurrency(data.totalRevenue)}</div>
            <p className="text-xs text-emerald-500/80 mt-2 flex items-center gap-1 font-medium"><ArrowUpRight className="w-3 h-3" /> Based on simulation</p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-white/10 backdrop-blur-sm sm:col-span-2 md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Platform Reach</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mt-2">
              {data.platformBreakdown.map((p: any) => (
                <div key={p.platform} className="flex items-center justify-between gap-3">
                  <span className="text-sm text-white capitalize shrink-0">{p.platform}</span>
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-[10rem]">
                    <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${p.percentage}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground w-8 text-right">{p.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/40 border-white/10 backdrop-blur-sm pt-4 sm:pt-6">
        <CardHeader className="px-4 sm:px-6 pb-0">
          <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
            <BarChart2 className="w-4 sm:w-5 h-4 sm:h-5 text-primary" /> Invocation Velocity
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[250px] sm:h-[350px] mt-4 px-2 sm:px-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.weeklyInvocations} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" fontSize={11} tickMargin={8} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} tickFormatter={(val: number) => `${val}`} width={30} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(10,15,30,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', fontSize: '13px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Line type="monotone" dataKey="invocations" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3, fill: 'hsl(var(--primary))' }} activeDot={{ r: 5, strokeWidth: 0, fill: '#fff' }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
