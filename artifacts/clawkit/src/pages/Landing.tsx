import { useState } from "react";
import { Link } from "wouter";
import { Zap, Code2, Globe, Terminal, Loader2, ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useJoinWaitlist } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export function Landing() {
  const [email, setEmail] = useState("");
  const [mobileNav, setMobileNav] = useState(false);
  const { toast } = useToast();
  
  const waitlistMutation = useJoinWaitlist({
    mutation: {
      onSuccess: () => {
        toast({ title: "You're on the list!", description: "We'll notify you when ClawKit is ready." });
        setEmail("");
      },
      onError: (err) => {
        toast({ variant: "destructive", title: "Error", description: err.message || "Failed to join waitlist" });
      }
    }
  });

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    waitlistMutation.mutate({ data: { email } });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      <div className="absolute inset-0 z-0">
        <img 
          src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
          alt="Premium abstract background"
          className="w-full h-full object-cover opacity-60 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-4 sm:py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/50 neon-border">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-white">ClawKit</span>
        </div>

        <div className="hidden sm:flex items-center gap-4 md:gap-6">
          <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">Pricing</Link>
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">Sign in</Link>
          <Link href="/register">
            <Button className="rounded-full shadow-lg shadow-primary/20">Get Started</Button>
          </Link>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden text-muted-foreground hover:text-white w-9 h-9"
          onClick={() => setMobileNav(!mobileNav)}
        >
          {mobileNav ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </nav>

      <AnimatePresence>
        {mobileNav && (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="relative z-10 sm:hidden overflow-hidden border-b border-white/5 bg-background/80 backdrop-blur-xl"
          >
            <div className="flex flex-col gap-1 px-4 pb-4">
              <Link href="/pricing" onClick={() => setMobileNav(false)} className="text-sm font-medium text-muted-foreground hover:text-white py-2.5 px-3 rounded-lg hover:bg-white/5 transition-colors">
                Pricing
              </Link>
              <Link href="/login" onClick={() => setMobileNav(false)} className="text-sm font-medium text-muted-foreground hover:text-white py-2.5 px-3 rounded-lg hover:bg-white/5 transition-colors">
                Sign in
              </Link>
              <Link href="/register" onClick={() => setMobileNav(false)}>
                <Button className="w-full rounded-full shadow-lg shadow-primary/20 mt-1">Get Started</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-24 pb-16 sm:pb-32 text-center flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 sm:mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-medium text-muted-foreground">The 2026 standard for agent tools</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight text-white max-w-4xl leading-[1.1]"
        >
          One upload. <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary/80 to-primary drop-shadow-sm">Invoked everywhere.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-5 sm:mt-8 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2"
        >
          While 90% of AI agents are free and stay invisible, ClawKit makes yours discoverable and trusted across every agent runtime. The open distribution layer for developer tools and coding agents.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 sm:mt-10 w-full max-w-md mx-auto px-2"
        >
          <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-3 sm:gap-0 w-full sm:relative">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="h-12 sm:h-14 px-5 sm:pl-6 sm:pr-36 rounded-full sm:rounded-full bg-black/40 border-white/10 backdrop-blur-xl text-base sm:text-lg focus-visible:ring-primary/50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button 
              type="submit" 
              className="h-12 sm:h-auto rounded-full px-6 sm:absolute sm:right-1.5 sm:top-1.5 sm:bottom-1.5"
              disabled={waitlistMutation.isPending}
            >
              {waitlistMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Join Waitlist"}
            </Button>
          </form>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-12 sm:mt-20 pt-8 sm:pt-10 border-t border-white/5 w-full flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 md:gap-12 text-muted-foreground"
        >
          <p className="text-sm font-medium flex items-center gap-2">
            <Code2 className="w-4 h-4 text-primary" /> Works with MCP
          </p>
          <p className="text-sm font-medium flex items-center gap-2">
            <Terminal className="w-4 h-4 text-primary" /> Native CLI Integration
          </p>
          <p className="text-sm font-medium flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" /> REST API — No lock-in
          </p>
        </motion.div>
      </main>

      <footer className="relative z-10 border-t border-white/5 bg-black/20 py-8 sm:py-12 text-center backdrop-blur-sm px-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-primary" />
          <span className="font-display font-bold text-xl text-white">ClawKit</span>
        </div>
        <p className="text-muted-foreground text-sm">Built for the 2026 agent economy.</p>
      </footer>
    </div>
  );
}
