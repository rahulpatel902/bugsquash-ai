"use client";

import { motion } from "framer-motion";
import {
  Bug,
  GitPullRequest,
  Zap,
  Shield,
  ArrowRight,
  Github,
  CheckCircle2,
  Code2,
  Sparkles,
  Terminal,
  GitBranch,
  Play
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Bug,
    title: "Smart Issue Analysis",
    description: "Paste any GitHub issue or error log. Our AI understands context, identifies root causes, and maps affected files.",
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
  {
    icon: Zap,
    title: "Instant Fix Generation",
    description: "Cline CLI autonomously generates fixes, handling multi-file changes with proper git commits.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  {
    icon: Shield,
    title: "Auto Code Review",
    description: "Every fix is automatically reviewed by CodeRabbit for quality, security, and best practices.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: GitPullRequest,
    title: "One-Click Merge",
    description: "Review the AI-generated PR with full explanations, then merge with a single click.",
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
];

const steps = [
  { step: "01", title: "Paste Issue", desc: "GitHub URL or error log" },
  { step: "02", title: "AI Analyzes", desc: "Understands the bug" },
  { step: "03", title: "Fix Generated", desc: "Code changes ready" },
  { step: "04", title: "Auto Review", desc: "Quality verified" },
  { step: "05", title: "Merge & Done", desc: "Bug squashed!" },
];

const sponsors = [
  { name: "Cline CLI", desc: "Autonomous coding", color: "#22c55e" },
  { name: "CodeRabbit", desc: "AI code review", color: "#a855f7" },
  { name: "Vercel", desc: "Instant deploy", color: "#ffffff" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Grid background */}
      <div className="fixed inset-0 grid-pattern opacity-50" />

      {/* Gradient orbs */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[128px] -translate-y-1/2" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/15 rounded-full blur-[128px] translate-y-1/2" />
      <div className="fixed top-1/2 right-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px]" />

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 lg:px-12">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Bug className="w-5 h-5 text-black" />
          </div>
          <span className="font-semibold text-lg">BugSquash</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted">
          <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</Link>
          <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg btn-secondary"
          >
            <Github className="w-4 h-4" />
            Sign in
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg btn-primary text-black"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-16 pb-24 lg:px-12 lg:pt-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-muted">Powered by AI Agents</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">New</span>
            </div>

            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              Squash Bugs
              <br />
              <span className="gradient-text">10x Faster</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
              Paste a GitHub issue or error log. AI analyzes it, generates the fix,
              and creates a reviewed PR. You just merge.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-xl btn-primary text-black animate-pulse-glow"
              >
                <Play className="w-5 h-5" />
                Start Squashing Bugs
              </Link>
              <Link
                href="#how-it-works"
                className="flex items-center gap-2 px-8 py-4 text-base font-medium rounded-xl btn-secondary"
              >
                See How It Works
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Terminal Demo */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="terminal shadow-2xl shadow-black/50">
              <div className="terminal-header">
                <div className="terminal-dot bg-red-500" />
                <div className="terminal-dot bg-yellow-500" />
                <div className="terminal-dot bg-green-500" />
                <span className="ml-3 text-xs text-muted">bugsquash-ai</span>
              </div>
              <div className="terminal-content text-sm">
                <div className="flex items-start gap-2 mb-3">
                  <span className="text-primary">$</span>
                  <span className="text-foreground">bugsquash analyze https://github.com/user/repo/issues/42</span>
                </div>
                <div className="text-muted mb-2">
                  <span className="text-secondary">→</span> Analyzing issue #42: &quot;TypeError in user authentication&quot;
                </div>
                <div className="text-muted mb-2">
                  <span className="text-yellow-400">⚡</span> Root cause: Missing null check in auth.ts:127
                </div>
                <div className="text-muted mb-2">
                  <span className="text-primary">✓</span> Generated fix: 3 files modified
                </div>
                <div className="text-muted mb-2">
                  <span className="text-accent">🐰</span> CodeRabbit review: PASSED (score: 95/100)
                </div>
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-medium">PR #156 created → Ready to merge!</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="relative z-10 px-6 py-12 border-y border-border/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-sm text-muted mb-8">Built with industry-leading tools</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {sponsors.map((sponsor) => (
              <div key={sponsor.name} className="flex items-center gap-3 opacity-70 hover:opacity-100 transition-opacity">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: sponsor.color }}
                />
                <div>
                  <p className="font-medium text-sm">{sponsor.name}</p>
                  <p className="text-xs text-muted">{sponsor.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-24 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to
              <span className="gradient-text"> Ship Faster</span>
            </h2>
            <p className="text-muted max-w-xl mx-auto">
              From bug detection to fix deployment, we&apos;ve automated the entire process.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group p-6 rounded-2xl glass card-hover"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 px-6 py-24 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Bug to Fix in
              <span className="gradient-text"> 5 Simple Steps</span>
            </h2>
            <p className="text-muted max-w-xl mx-auto">
              Our AI agents handle the heavy lifting while you focus on building.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-2">
            {steps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative flex flex-col items-center p-6 w-44"
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-border to-transparent" />
                )}

                <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center mb-4 group-hover:border-primary transition-colors">
                  <span className="text-lg font-bold gradient-text">{item.step}</span>
                </div>
                <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-muted text-center">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 px-6 py-16 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10x", label: "Faster Fixes" },
              { value: "95%", label: "Success Rate" },
              { value: "<2min", label: "Avg Fix Time" },
              { value: "24/7", label: "Always Ready" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-4"
              >
                <p className="text-3xl md:text-4xl font-bold gradient-text mb-1">{stat.value}</p>
                <p className="text-sm text-muted">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-24 lg:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-12 rounded-3xl glass"
          >
            <Code2 className="w-12 h-12 mx-auto mb-6 text-primary" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Squash Some Bugs?
            </h2>
            <p className="text-muted mb-8 max-w-md mx-auto">
              Stop wasting hours debugging. Let AI handle the fixes while you build amazing things.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-xl btn-primary text-black"
            >
              <Terminal className="w-5 h-5" />
              Launch BugSquash
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Bug className="w-4 h-4 text-black" />
              </div>
              <span className="font-semibold">BugSquash AI</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted">
              <Link href="#" className="hover:text-foreground transition-colors">Documentation</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted hover:text-foreground transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted hover:text-foreground transition-colors">
                <GitBranch className="w-5 h-5" />
              </a>
            </div>
          </div>
          <p className="text-center text-xs text-muted mt-8">
            © 2024 BugSquash AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
