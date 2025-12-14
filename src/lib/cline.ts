// Cline CLI Command Generator
// Generates the Cline CLI commands that would be used to implement fixes

export interface ClineCommand {
    command: string;
    description: string;
    type: "analyze" | "fix" | "commit" | "review";
}

export function generateClineCommands(
    input: string,
    affectedFiles: string[],
    commitMessage: string
): ClineCommand[] {
    const commands: ClineCommand[] = [];

    // Step 1: Analyze the issue
    commands.push({
        command: `cline analyze "${input.slice(0, 50)}..."`,
        description: "Analyze the bug report and identify affected code",
        type: "analyze",
    });

    // Step 2: Generate fixes for each file
    affectedFiles.forEach((file) => {
        commands.push({
            command: `cline fix ${file} --auto`,
            description: `Generate fix for ${file}`,
            type: "fix",
        });
    });

    // Step 3: Review changes
    commands.push({
        command: `cline review --all`,
        description: "Review all generated changes for quality",
        type: "review",
    });

    // Step 4: Commit changes
    commands.push({
        command: `cline commit -m "${commitMessage}"`,
        description: "Commit all fixes with descriptive message",
        type: "commit",
    });

    return commands;
}

export function formatClineOutput(commands: ClineCommand[]): string {
    return commands
        .map((cmd, i) => `# Step ${i + 1}: ${cmd.description}\n$ ${cmd.command}`)
        .join("\n\n");
}
