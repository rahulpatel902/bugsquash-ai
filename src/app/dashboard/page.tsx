"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bug,
    Loader2,
    CheckCircle2,
    AlertCircle,
    FileCode,
    ArrowLeft,
    Terminal,
    Sparkles,
    Code2,
    Github,
    RefreshCw,
    Copy,
    Check,
    History,
    Clock,
    ChevronRight,
    Trash2,
    Link as LinkIcon,
    Command,
} from "lucide-react";
import Link from "next/link";
import { getHistory, addToHistory, clearHistory, formatTimeAgo, type HistoryItem } from "@/lib/history";
import { isGitHubIssueUrl, fetchGitHubIssue } from "@/lib/github";
import { generateClineCommands, type ClineCommand } from "@/lib/cline";

type AnalysisStep = "idle" | "analyzing" | "generating" | "reviewing" | "complete" | "error" | "fetching";

interface AnalysisResult {
    issue: {
        title: string;
        number: number;
        repo: string;
    };
    rootCause: string;
    affectedFiles: string[];
    fixStrategy: string;
    severity?: string;
    generatedFix: {
        files: Array<{
            path: string;
            changes: string;
        }>;
        commitMessage: string;
    };
    review: {
        score: number;
        comments: string[];
        passed: boolean;
    };
    prUrl: string;
}

export default function Dashboard() {
    const [input, setInput] = useState("");
    const [step, setStep] = useState<AnalysisStep>("idle");
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [copied, setCopied] = useState(false);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [showHistory, setShowHistory] = useState(true);
    const [clineCommands, setClineCommands] = useState<ClineCommand[]>([]);
    const [showCline, setShowCline] = useState(false);

    // Load history on mount
    useEffect(() => {
        setHistory(getHistory());
    }, []);

    const handleAnalyze = async () => {
        if (!input.trim()) return;

        let analysisInput = input;

        // Check if it's a GitHub URL and fetch the issue
        if (isGitHubIssueUrl(input)) {
            setStep("fetching");
            const issue = await fetchGitHubIssue(input);
            if (issue) {
                analysisInput = `GitHub Issue #${issue.number}: ${issue.title}\n\nRepository: ${issue.owner}/${issue.repo}\nLabels: ${issue.labels.join(", ") || "none"}\n\n${issue.body}`;
            }
        }

        setStep("analyzing");
        setResult(null);
        setClineCommands([]);

        try {
            const response = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ input: analysisInput }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Analysis failed");
            }

            setStep("generating");
            await new Promise((r) => setTimeout(r, 1000));
            setStep("reviewing");
            await new Promise((r) => setTimeout(r, 800));

            const data = await response.json();
            setResult(data);

            // Generate Cline CLI commands
            const commands = generateClineCommands(
                input,
                data.affectedFiles,
                data.generatedFix.commitMessage
            );
            setClineCommands(commands);

            // Save to history
            addToHistory({
                input: input.slice(0, 200),
                issue: data.issue,
                rootCause: data.rootCause,
                severity: data.severity,
                score: data.review.score,
            });
            setHistory(getHistory());

            setStep("complete");
        } catch (error) {
            console.error("Analysis error:", error);
            setStep("error");
        }
    };

    const handleReset = () => {
        setStep("idle");
        setResult(null);
        setInput("");
        setClineCommands([]);
        setShowCline(false);
    };

    const handleCopy = async (text: string) => {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                // Fallback for older browsers
                const textarea = document.createElement('textarea');
                textarea.value = text;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Copy failed:', err);
        }
    };

    const handleHistoryClick = (item: HistoryItem) => {
        setInput(item.input);
    };

    const handleClearHistory = () => {
        clearHistory();
        setHistory([]);
    };

    const getStepStatus = (targetStep: AnalysisStep) => {
        const stepOrder: AnalysisStep[] = ["fetching", "analyzing", "generating", "reviewing", "complete"];
        const currentIndex = stepOrder.indexOf(step);
        const targetIndex = stepOrder.indexOf(targetStep);

        if (step === "idle" || step === "error") return "pending";
        if (targetIndex < currentIndex) return "complete";
        if (targetIndex === currentIndex) return "active";
        return "pending";
    };

    return (
        <div className="min-h-screen bg-background relative">
            {/* Grid background */}
            <div className="fixed inset-0 grid-pattern opacity-30" />

            {/* Gradient orbs */}
            <div className="fixed top-0 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[128px]" />
            <div className="fixed bottom-0 left-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[128px]" />

            {/* Header */}
            <header className="relative z-50 flex items-center justify-between px-6 py-4 lg:px-12 border-b border-border/50">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-2 text-muted hover:text-foreground transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm hidden sm:inline">Back</span>
                    </Link>
                    <div className="h-6 w-px bg-border" />
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                            <Bug className="w-4 h-4 text-black" />
                        </div>
                        <span className="font-semibold">BugSquash</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors ${showHistory ? "bg-primary/20 text-primary" : "btn-secondary"}`}
                    >
                        <History className="w-4 h-4" />
                        <span className="hidden sm:inline">History</span>
                    </button>
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg btn-secondary"
                    >
                        <Github className="w-4 h-4" />
                        <span className="hidden sm:inline">GitHub</span>
                    </a>
                </div>
            </header>

            {/* Main Layout */}
            <div className="flex relative z-10">
                {/* History Sidebar */}
                <AnimatePresence>
                    {showHistory && (
                        <motion.aside
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 280, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="border-r border-border/50 h-[calc(100vh-65px)] overflow-hidden"
                        >
                            <div className="w-[280px] p-4 h-full overflow-y-auto">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-medium flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-muted" />
                                        Recent Analyses
                                    </h3>
                                    {history.length > 0 && (
                                        <button
                                            onClick={handleClearHistory}
                                            className="text-xs text-muted hover:text-destructive transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>

                                {history.length === 0 ? (
                                    <p className="text-sm text-muted/50 text-center py-8">
                                        No history yet
                                    </p>
                                ) : (
                                    <div className="space-y-2">
                                        {history.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => handleHistoryClick(item)}
                                                className="w-full text-left p-3 rounded-xl bg-card hover:bg-card-hover border border-border/50 transition-colors group"
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className="text-sm font-medium line-clamp-1">
                                                        {item.issue.title}
                                                    </p>
                                                    <ChevronRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`text-xs px-1.5 py-0.5 rounded ${item.score >= 80 ? "bg-green-500/20 text-green-400" :
                                                        item.score >= 60 ? "bg-yellow-500/20 text-yellow-400" :
                                                            "bg-red-500/20 text-red-400"
                                                        }`}>
                                                        {item.score}/100
                                                    </span>
                                                    <span className="text-xs text-muted">
                                                        {formatTimeAgo(item.timestamp)}
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* Main Content */}
                <main className="flex-1 px-6 py-8 lg:px-12 lg:py-12 overflow-y-auto h-[calc(100vh-65px)]">
                    <div className="max-w-4xl mx-auto">
                        {/* Title */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-10"
                        >
                            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                                <span className="gradient-text">Bug Analyzer</span>
                            </h1>
                            <p className="text-muted text-sm">
                                Paste a GitHub issue URL or error log to get started
                            </p>
                        </motion.div>

                        {/* Input Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mb-8"
                        >
                            <div className="relative">
                                <div className="glass rounded-2xl p-4">
                                    <textarea
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Paste GitHub issue URL (e.g., https://github.com/user/repo/issues/42)

Or paste an error log:
TypeError: Cannot read property 'user' of undefined
    at getUserProfile (auth.ts:127)"
                                        className="w-full h-32 bg-transparent resize-none text-sm font-mono placeholder:text-muted/50 focus:outline-none"
                                        disabled={step !== "idle"}
                                    />
                                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                                        <div className="flex items-center gap-2 text-xs text-muted">
                                            {isGitHubIssueUrl(input) ? (
                                                <>
                                                    <LinkIcon className="w-3.5 h-3.5 text-primary" />
                                                    <span className="text-primary">GitHub issue detected - will auto-fetch</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Terminal className="w-3.5 h-3.5" />
                                                    <span>Supports GitHub issues, error logs, and stack traces</span>
                                                </>
                                            )}
                                        </div>
                                        <button
                                            onClick={step === "idle" ? handleAnalyze : handleReset}
                                            disabled={step !== "idle" && step !== "complete" && step !== "error"}
                                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${step === "idle"
                                                ? "btn-primary text-black"
                                                : step === "complete" || step === "error"
                                                    ? "btn-secondary"
                                                    : "bg-card text-muted cursor-not-allowed"
                                                }`}
                                        >
                                            {step === "idle" ? (
                                                <>
                                                    <Sparkles className="w-4 h-4" />
                                                    Analyze & Fix
                                                </>
                                            ) : step === "complete" || step === "error" ? (
                                                <>
                                                    <RefreshCw className="w-4 h-4" />
                                                    Start Over
                                                </>
                                            ) : (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Processing...
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Progress Steps */}
                        <AnimatePresence mode="wait">
                            {step !== "idle" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="mb-8"
                                >
                                    <div className="glass rounded-2xl p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            {[
                                                { key: "analyzing", label: "Analyzing", icon: Bug },
                                                { key: "generating", label: "Generating Fix", icon: Code2 },
                                                { key: "reviewing", label: "AI Review", icon: CheckCircle2 },
                                                { key: "complete", label: "Ready", icon: Command },
                                            ].map((s, i) => {
                                                const status = getStepStatus(s.key as AnalysisStep);
                                                return (
                                                    <div key={s.key} className="flex items-center gap-2">
                                                        <div
                                                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${status === "complete"
                                                                ? "bg-primary/20 text-primary"
                                                                : status === "active"
                                                                    ? "bg-secondary/20 text-secondary"
                                                                    : "bg-card text-muted"
                                                                }`}
                                                        >
                                                            {status === "active" ? (
                                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                            ) : status === "complete" ? (
                                                                <CheckCircle2 className="w-5 h-5" />
                                                            ) : (
                                                                <s.icon className="w-5 h-5" />
                                                            )}
                                                        </div>
                                                        <div className="hidden sm:block">
                                                            <p className={`text-sm font-medium ${status === "active" ? "text-secondary" : status === "complete" ? "text-primary" : "text-muted"}`}>
                                                                {s.label}
                                                            </p>
                                                        </div>
                                                        {i < 3 && (
                                                            <div className={`hidden md:block w-12 lg:w-20 h-px mx-2 ${status === "complete" ? "bg-primary/50" : "bg-border"}`} />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="text-center py-4">
                                            {step === "fetching" && (
                                                <p className="text-muted animate-pulse">Fetching GitHub issue details...</p>
                                            )}
                                            {step === "analyzing" && (
                                                <p className="text-muted animate-pulse">Analyzing issue context and identifying root cause...</p>
                                            )}
                                            {step === "generating" && (
                                                <p className="text-muted animate-pulse">Cline CLI is generating the fix...</p>
                                            )}
                                            {step === "reviewing" && (
                                                <p className="text-muted animate-pulse">CodeRabbit is reviewing the changes...</p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Results */}
                        <AnimatePresence mode="wait">
                            {result && step === "complete" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-6"
                                >
                                    {/* Issue Summary */}
                                    <div className="glass rounded-2xl p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <div className="flex items-center gap-2 text-xs text-muted mb-2">
                                                    <Github className="w-3.5 h-3.5" />
                                                    {result.issue.repo} #{result.issue.number}
                                                </div>
                                                <h3 className="text-lg font-semibold">{result.issue.title}</h3>
                                            </div>
                                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${result.review.passed ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                                                {result.review.passed ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                                <span className="text-sm font-medium">Score: {result.review.score}/100</span>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="p-4 rounded-xl bg-card">
                                                <p className="text-xs text-muted uppercase tracking-wide mb-2">Root Cause</p>
                                                <p className="text-sm leading-relaxed">{result.rootCause}</p>
                                            </div>
                                            <div className="p-4 rounded-xl bg-card">
                                                <p className="text-xs text-muted uppercase tracking-wide mb-2">Fix Strategy</p>
                                                <p className="text-sm leading-relaxed">{result.fixStrategy}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Affected Files */}
                                    <div className="glass rounded-2xl p-6">
                                        <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                                            <FileCode className="w-4 h-4 text-secondary" />
                                            Affected Files ({result.affectedFiles.length})
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {result.affectedFiles.map((file) => (
                                                <span key={file} className="px-3 py-1.5 rounded-lg bg-card text-sm font-mono text-muted">
                                                    {file}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Cline CLI Commands */}
                                    <div className="glass rounded-2xl p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-sm font-medium flex items-center gap-2">
                                                <Terminal className="w-4 h-4 text-primary" />
                                                Cline CLI Commands
                                            </h4>
                                            <button
                                                onClick={() => setShowCline(!showCline)}
                                                className="text-xs text-muted hover:text-foreground transition-colors"
                                            >
                                                {showCline ? "Hide" : "Show"}
                                            </button>
                                        </div>

                                        <AnimatePresence>
                                            {showCline && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="terminal mt-2">
                                                        <div className="terminal-header">
                                                            <div className="terminal-dot bg-red-500" />
                                                            <div className="terminal-dot bg-yellow-500" />
                                                            <div className="terminal-dot bg-green-500" />
                                                            <span className="ml-3 text-xs text-muted">cline-cli</span>
                                                        </div>
                                                        <div className="terminal-content space-y-3">
                                                            {clineCommands.map((cmd, i) => (
                                                                <div key={i}>
                                                                    <p className="text-xs text-muted mb-1"># {cmd.description}</p>
                                                                    <p className="text-sm">
                                                                        <span className="text-primary">$</span> {cmd.command}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {!showCline && (
                                            <p className="text-xs text-muted">
                                                {clineCommands.length} commands ready to execute
                                            </p>
                                        )}
                                    </div>

                                    {/* Generated Changes */}
                                    <div className="glass rounded-2xl p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-sm font-medium flex items-center gap-2">
                                                <Code2 className="w-4 h-4 text-primary" />
                                                Generated Changes
                                            </h4>
                                            <button
                                                onClick={() => handleCopy(result.generatedFix.commitMessage)}
                                                className="flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors"
                                            >
                                                {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                                                Copy commit message
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            {result.generatedFix.files.map((file) => (
                                                <div key={file.path} className="code-block overflow-hidden">
                                                    <div className="px-4 py-2 bg-card/50 border-b border-border flex items-center justify-between">
                                                        <span className="text-xs font-mono text-muted">{file.path}</span>
                                                    </div>
                                                    <pre className="p-4 text-xs overflow-x-auto">
                                                        <code>
                                                            {file.changes.split("\n").map((line, i) => (
                                                                <div
                                                                    key={i}
                                                                    className={`${line.startsWith("+")
                                                                        ? "text-green-400 bg-green-500/10"
                                                                        : line.startsWith("-")
                                                                            ? "text-red-400 bg-red-500/10"
                                                                            : ""
                                                                        }`}
                                                                >
                                                                    {line}
                                                                </div>
                                                            ))}
                                                        </code>
                                                    </pre>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-4 p-3 rounded-lg bg-card flex items-center gap-3">
                                            <Command className="w-4 h-4 text-primary" />
                                            <span className="text-sm font-mono">{result.generatedFix.commitMessage}</span>
                                        </div>
                                    </div>

                                    {/* Review Results */}
                                    <div className="glass rounded-2xl p-6">
                                        <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                                            <span className="text-lg">🐰</span>
                                            CodeRabbit Review
                                        </h4>
                                        <div className="space-y-2">
                                            {result.review.comments.map((comment, i) => (
                                                <div key={i} className="flex items-center gap-2 text-sm text-muted">
                                                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                                                    {comment}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <button
                                            onClick={() => {
                                                const allChanges = result.generatedFix.files
                                                    .map(f => `// ${f.path}\n${f.changes}`)
                                                    .join('\n\n');
                                                handleCopy(allChanges);
                                            }}
                                            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl btn-primary text-black font-semibold"
                                        >
                                            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                            {copied ? "Copied!" : "Copy All Changes"}
                                        </button>
                                        <button
                                            onClick={handleReset}
                                            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl btn-secondary font-medium"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                            Analyze Another Issue
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Empty State */}
                        {step === "idle" && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-center py-12"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-card border border-border mb-4">
                                    <Bug className="w-8 h-8 text-muted" />
                                </div>
                                <p className="text-muted mb-2">No bugs analyzed yet</p>
                                <p className="text-sm text-muted/70">Paste a GitHub issue or error log above to get started</p>
                            </motion.div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
