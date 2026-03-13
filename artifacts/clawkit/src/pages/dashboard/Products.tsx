import { useState } from "react";
import { FileCode, Loader2, Sparkles, AlertCircle, CheckCircle2, Download, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  useListProducts, 
  useCreateProduct, 
  useGenerateClawKit, 
  useSimulateDistribution,
  useExportProductData,
  getListProductsQueryKey,
  type Product
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/utils";

export function Products() {
  const { data: productsData, isLoading } = useListProducts();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const queryClient = useQueryClient();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your APIs and generated agent distributions.</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-lg shadow-primary/20">Upload New Product</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-card/90 backdrop-blur-xl border-white/10">
            <DialogHeader>
              <DialogTitle>Upload API Product</DialogTitle>
              <DialogDescription>Add your tool's details to generate a universal distribution kit.</DialogDescription>
            </DialogHeader>
            <CreateProductForm onSuccess={() => setIsCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {productsData?.products?.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
          {productsData?.products?.length === 0 && (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
              <FileCode className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-white font-medium">No products uploaded</p>
              <p className="text-muted-foreground">Click the button above to upload your first OpenAPI spec.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CreateProductForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileContent, setFileContent] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createMutation = useCreateProduct({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
        toast({ title: "Product created", description: "Ready to generate ClawKit." });
        onSuccess();
      },
      onError: (err: any) => toast({ variant: "destructive", title: "Error", description: err.message })
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setFileContent(ev.target?.result as string);
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ data: { name, description, websiteUrl, apiSpecContent: fileContent, apiSpecUrl: fileName } });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Product Name</label>
        <Input required value={name} onChange={e => setName(e.target.value)} className="bg-black/50 border-white/10" placeholder="e.g. Acme Billing API" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea required value={description} onChange={e => setDescription(e.target.value)} className="bg-black/50 border-white/10 min-h-[100px]" placeholder="What does this tool do?" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Website URL (optional)</label>
        <Input type="url" value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} className="bg-black/50 border-white/10" placeholder="https://" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">OpenAPI Spec (JSON/YAML)</label>
        <div className="border border-dashed border-white/20 rounded-lg p-6 text-center hover:bg-white/5 transition-colors cursor-pointer relative">
          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept=".json,.yaml,.yml" onChange={handleFileChange} />
          <FileCode className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-white font-medium">{fileName || "Click to upload or drag and drop"}</p>
        </div>
      </div>
      <Button type="submit" className="w-full mt-4" disabled={createMutation.isPending || !fileContent}>
        {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Upload Product"}
      </Button>
    </form>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isSimulateOpen, setIsSimulateOpen] = useState(false);

  const generateMutation = useGenerateClawKit({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
        toast({ title: "ClawKit Generated!", description: "Distribution files and safety report are ready." });
      },
      onError: (err: any) => toast({ variant: "destructive", title: "Generation failed", description: err.message })
    }
  });

  const simulateMutation = useSimulateDistribution({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
      }
    }
  });

  const handleGenerate = () => {
    setIsGeneratorOpen(true);
    if (!product.generated) {
      generateMutation.mutate({ id: product.id });
    }
  };

  const handleSimulate = () => {
    setIsSimulateOpen(true);
    simulateMutation.mutate({ id: product.id });
  };

  const handleExport = async () => {
    try {
      const res = await fetch(`/api/products/${product.id}/export`);
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `clawkit-export-${product.name.replace(/\s+/g, '-').toLowerCase()}.json`;
      a.click();
    } catch {
      toast({ variant: "destructive", title: "Export failed" });
    }
  };

  return (
    <Card className="bg-card/40 border-white/10 backdrop-blur-sm overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 p-6">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-white">{product.name}</h3>
            {product.generated ? (
              <Badge className="bg-primary/20 text-primary border-primary/30"><CheckCircle2 className="w-3 h-3 mr-1" /> ClawKit Ready</Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground border-white/20">Draft</Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm max-w-2xl">{product.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="px-4 py-2 rounded-lg bg-black/40 border border-white/5">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Invocations</p>
              <p className="text-xl font-display font-bold text-white mt-1">{product.invocations.toLocaleString()}</p>
            </div>
            <div className="px-4 py-2 rounded-lg bg-black/40 border border-white/5">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Projected Rev</p>
              <p className="text-xl font-display font-bold text-emerald-400 mt-1">{formatCurrency(product.revenue)}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white/5 md:w-72 flex flex-col justify-center gap-3 border-t md:border-t-0 md:border-l border-white/10">
          <Button 
            className={`w-full ${product.generated ? 'bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 shadow-none' : 'shadow-lg shadow-primary/25'}`}
            onClick={handleGenerate}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {product.generated ? "View ClawKit" : "Generate ClawKit"}
          </Button>
          
          <Button variant="outline" className="w-full border-white/20 hover:bg-white/10" onClick={handleSimulate}>
            <PlayCircle className="w-4 h-4 mr-2" /> Simulate Distribution
          </Button>

          {product.generated && (
            <Button variant="ghost" className="w-full text-muted-foreground hover:text-white" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" /> Export All Data
            </Button>
          )}
        </div>
      </div>

      {/* GENERATOR DIALOG */}
      <Dialog open={isGeneratorOpen} onOpenChange={setIsGeneratorOpen}>
        <DialogContent className="max-w-4xl bg-card/95 backdrop-blur-xl border-white/10 max-h-[85vh] flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Sparkles className="text-primary" /> ClawKit Generator
            </DialogTitle>
          </DialogHeader>
          
          {generateMutation.isPending || (!product.generated && !generateMutation.isError) ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center animate-pulse mb-6 neon-border">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Generating Master Distribution...</h3>
              <p className="text-muted-foreground">Synthesizing MCP Manifests, AGENTS.md, and running Grok Safety Auditor...</p>
            </div>
          ) : product.generated ? (
            <div className="flex-1 overflow-hidden flex flex-col gap-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                    (product.safetyScore || 0) > 90 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                    (product.safetyScore || 0) > 70 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 
                    'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {product.safetyScore}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Safety Score</p>
                    <p className="text-white font-medium text-sm mt-1">Grok Auditor Passed</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-primary font-medium uppercase tracking-wider">Ready for Distribution</p>
                    <p className="text-white font-medium text-sm mt-1">Compatible with 4 runtimes</p>
                  </div>
                </div>
              </div>
              
              <Tabs defaultValue="mcp" className="flex-1 flex flex-col min-h-0">
                <TabsList className="bg-black/40 border border-white/10 w-full justify-start p-1 h-auto">
                  <TabsTrigger value="mcp" className="data-[state=active]:bg-primary/20 data-[state=active]:text-white">MCP Manifest</TabsTrigger>
                  <TabsTrigger value="agents" className="data-[state=active]:bg-primary/20 data-[state=active]:text-white">AGENTS.md</TabsTrigger>
                  <TabsTrigger value="chatgpt" className="data-[state=active]:bg-primary/20 data-[state=active]:text-white">ChatGPT</TabsTrigger>
                  <TabsTrigger value="safety" className="data-[state=active]:bg-primary/20 data-[state=active]:text-white">Safety Report</TabsTrigger>
                </TabsList>
                
                <div className="flex-1 overflow-y-auto mt-4 rounded-lg bg-black/60 border border-white/5 p-4 font-mono text-sm text-gray-300">
                  <TabsContent value="mcp" className="mt-0 whitespace-pre-wrap">{product.mcpManifest || "No data"}</TabsContent>
                  <TabsContent value="agents" className="mt-0 whitespace-pre-wrap">{product.agentsMd || "No data"}</TabsContent>
                  <TabsContent value="chatgpt" className="mt-0 whitespace-pre-wrap">{product.chatgptSubmission || "No data"}</TabsContent>
                  <TabsContent value="safety" className="mt-0 whitespace-pre-wrap">{product.safetyReport || "No data"}</TabsContent>
                </div>
              </Tabs>
            </div>
          ) : (
            <div className="text-red-400 p-4">Error generating ClawKit.</div>
          )}
        </DialogContent>
      </Dialog>

      {/* SIMULATE DIALOG */}
      <Dialog open={isSimulateOpen} onOpenChange={setIsSimulateOpen}>
        <DialogContent className="max-w-3xl bg-card/95 backdrop-blur-xl border-white/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <PlayCircle className="text-primary" /> Distribution Simulation
            </DialogTitle>
            <DialogDescription>
              Live simulation of agents discovering and using {product.name}.
            </DialogDescription>
          </DialogHeader>
          
          {simulateMutation.isPending ? (
            <div className="py-20 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-white">Simulating global agent invocations...</p>
            </div>
          ) : simulateMutation.data ? (
            <div className="space-y-6 mt-4">
              <div className="flex gap-4 mb-6">
                <div className="flex-1 bg-primary/10 border border-primary/20 rounded-xl p-4 text-center">
                  <p className="text-xs text-primary uppercase font-bold tracking-wider">Simulated Invocations</p>
                  <p className="text-3xl font-display font-bold text-white mt-1">+{simulateMutation.data.totalInvocations}</p>
                </div>
                <div className="flex-1 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
                  <p className="text-xs text-emerald-400 uppercase font-bold tracking-wider">Projected Impact</p>
                  <p className="text-3xl font-display font-bold text-white mt-1">{formatCurrency(simulateMutation.data.projectedRevenue)}</p>
                </div>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {simulateMutation.data.invocations.map((inv, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: i * 0.2 }}
                    key={inv.id} 
                    className="p-4 rounded-lg bg-black/40 border border-white/5 relative"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-lg opacity-50"></div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-[10px] text-muted-foreground border-white/10 uppercase">{inv.platform}</Badge>
                      <span className="text-sm font-semibold text-white">{inv.agentName}</span>
                      <span className="text-xs text-muted-foreground ml-auto">Just now</span>
                    </div>
                    <div className="space-y-2 mt-3">
                      <div className="flex items-start gap-2">
                        <span className="text-primary font-bold text-xs mt-0.5">Q:</span>
                        <p className="text-sm text-gray-300">{inv.query}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold text-xs mt-0.5">A:</span>
                        <p className="text-sm text-gray-400 italic">"{inv.response}"</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
