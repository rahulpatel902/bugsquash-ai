import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export interface BugAnalysis {
    rootCause: string;
    affectedFiles: string[];
    fixStrategy: string;
    severity: "low" | "medium" | "high" | "critical";
    suggestedFix: {
        description: string;
        codeChanges: Array<{
            file: string;
            before: string;
            after: string;
        }>;
        commitMessage: string;
    };
}

export async function analyzeBug(input: string): Promise<BugAnalysis> {
    const systemPrompt = `You are an expert software engineer specialized in debugging and fixing code issues. 
Analyze the given bug report, error log, or GitHub issue and provide a detailed analysis.

Respond in this exact JSON format:
{
  "rootCause": "Clear explanation of what's causing the bug",
  "affectedFiles": ["list", "of", "likely", "affected", "files"],
  "fixStrategy": "Step-by-step strategy to fix this issue",
  "severity": "low|medium|high|critical",
  "suggestedFix": {
    "description": "What the fix does",
    "codeChanges": [
      {
        "file": "path/to/file.ts",
        "before": "code before fix",
        "after": "code after fix"
      }
    ],
    "commitMessage": "fix: concise commit message"
  }
}

Be specific and practical. If you can infer the programming language and framework, tailor your response accordingly.
Always provide working code that would actually fix the issue.`;

    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Analyze this bug and suggest a fix:\n\n${input}` },
        ],
        temperature: 0.3,
        max_tokens: 2000,
        response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
        throw new Error("No response from AI");
    }

    try {
        const analysis = JSON.parse(content) as BugAnalysis;
        return analysis;
    } catch {
        throw new Error("Failed to parse AI response");
    }
}

export async function generateCodeReview(code: string): Promise<{
    score: number;
    issues: string[];
    suggestions: string[];
    passed: boolean;
}> {
    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: `You are a code reviewer. Review the provided code changes and respond in JSON format:
{
  "score": 0-100,
  "issues": ["list of issues found"],
  "suggestions": ["list of improvements"],
  "passed": true/false (true if score >= 70)
}`,
            },
            { role: "user", content: `Review this code:\n\n${code}` },
        ],
        temperature: 0.2,
        max_tokens: 1000,
        response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
        throw new Error("No response from AI");
    }

    return JSON.parse(content);
}

export { groq };
