import { NextRequest, NextResponse } from "next/server";
import { analyzeBug, generateCodeReview } from "@/lib/groq";

export async function POST(request: NextRequest) {
    try {
        const { input } = await request.json();

        if (!input || typeof input !== "string") {
            return NextResponse.json(
                { error: "Input is required" },
                { status: 400 }
            );
        }

        if (!process.env.GROQ_API_KEY) {
            return NextResponse.json(
                { error: "GROQ_API_KEY not configured" },
                { status: 500 }
            );
        }

        // Step 1: Analyze the bug
        const analysis = await analyzeBug(input);

        // Step 2: Generate code review for the suggested fix
        const codeToReview = analysis.suggestedFix.codeChanges
            .map((change) => `// ${change.file}\n${change.after}`)
            .join("\n\n");

        const review = await generateCodeReview(codeToReview);

        // Combine results
        const result = {
            issue: {
                title: extractTitle(input),
                number: Math.floor(Math.random() * 100) + 1,
                repo: "your-repo",
            },
            rootCause: analysis.rootCause,
            affectedFiles: analysis.affectedFiles,
            fixStrategy: analysis.fixStrategy,
            severity: analysis.severity,
            generatedFix: {
                files: analysis.suggestedFix.codeChanges.map((change) => ({
                    path: change.file,
                    changes: formatDiff(change.before, change.after),
                })),
                commitMessage: analysis.suggestedFix.commitMessage,
                description: analysis.suggestedFix.description,
            },
            review: {
                score: review.score,
                comments: [
                    ...review.issues.map((i) => `⚠️ ${i}`),
                    ...review.suggestions.map((s) => `💡 ${s}`),
                ],
                passed: review.passed,
            },
            prUrl: `https://github.com/user/repo/pull/${Math.floor(Math.random() * 200) + 1}`,
        };

        return NextResponse.json(result);
    } catch (error) {
        console.error("Analysis error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Analysis failed" },
            { status: 500 }
        );
    }
}

function extractTitle(input: string): string {
    // Try to extract a title from the input
    const lines = input.split("\n").filter((l) => l.trim());
    const firstLine = lines[0] || "Bug Report";

    // If it's an error, extract the error type
    const errorMatch = input.match(/(TypeError|ReferenceError|SyntaxError|Error):\s*(.+)/);
    if (errorMatch) {
        return `${errorMatch[1]}: ${errorMatch[2].slice(0, 50)}`;
    }

    return firstLine.slice(0, 60);
}

function formatDiff(before: string, after: string): string {
    const beforeLines = before.split("\n").map((l) => `- ${l}`);
    const afterLines = after.split("\n").map((l) => `+ ${l}`);
    return [...beforeLines, ...afterLines].join("\n");
}
