// Bug History Store - Using localStorage for persistence

export interface HistoryItem {
    id: string;
    timestamp: number;
    input: string;
    issue: {
        title: string;
        number: number;
        repo: string;
    };
    rootCause: string;
    severity?: string;
    score: number;
}

const HISTORY_KEY = "bugsquash_history";
const MAX_HISTORY = 10;

export function getHistory(): HistoryItem[] {
    if (typeof window === "undefined") return [];

    try {
        const stored = localStorage.getItem(HISTORY_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

export function addToHistory(item: Omit<HistoryItem, "id" | "timestamp">): void {
    if (typeof window === "undefined") return;

    const history = getHistory();

    // Generate unique ID (works in all browsers)
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2);

    const newItem: HistoryItem = {
        ...item,
        id,
        timestamp: Date.now(),
    };

    // Add to beginning, limit to MAX_HISTORY
    const updated = [newItem, ...history].slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export function clearHistory(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(HISTORY_KEY);
}

export function formatTimeAgo(timestamp: number): string {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}
