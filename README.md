# 🐛 BugSquash AI

> **Intelligent Issue Resolver** - Automatically analyze GitHub issues and error logs, generate AI-powered fix PRs, and squash bugs 10x faster.

![BugSquash AI Banner](./public/og-image.png)

## 🌟 Overview

BugSquash AI is an intelligent bug-fixing platform that leverages AI agents to automatically:

1. **Analyze** - Understand GitHub issues and error logs
2. **Identify** - Pinpoint root causes and affected files  
3. **Generate** - Create fixes using Cline CLI
4. **Review** - Validate changes with CodeRabbit
5. **Deploy** - Ship fixes with confidence

## 🎯 Hackathon Prize Tracks

This project targets multiple AssembleHack'25 sponsor awards:

| Award | Sponsor | Integration |
|-------|---------|-------------|
| ⚡ Infinity Build | Cline CLI | Autonomous fix generation |
| 🐰 Captain Code | CodeRabbit | Automated PR reviews |
| 🚀 Stormbreaker | Vercel | Production deployment |

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **AI Model**: Groq API (Llama 3.1 - FREE)
- **Code Gen**: Cline CLI
- **Reviews**: CodeRabbit
- **Hosting**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- GitHub account

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/bugsquash-ai.git
cd bugsquash-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file:

```env
# GitHub OAuth (optional for full functionality)
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret

# Groq AI API (FREE tier available)
GROQ_API_KEY=your_groq_api_key
```

## 📋 Features

### 🔍 Smart Issue Analysis
Paste any GitHub issue URL or error log. Our AI:
- Extracts context and error details
- Identifies root cause
- Maps affected files
- Suggests fix strategy

### ⚡ Cline CLI Integration
Leverages Cline CLI for autonomous code generation:
- Multi-file changes
- Proper git commits
- Full context awareness
- Safe execution

### 🐰 CodeRabbit Reviews
Every generated fix is automatically reviewed:
- Code quality checks
- Security scanning
- Best practice validation
- Detailed feedback

### 🎨 Premium UX
- Dark mode optimized
- Smooth animations
- Real-time progress
- Code diff visualization

## 📁 Project Structure

```
bugsquash-ai/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── dashboard/
│   │   │   └── page.tsx       # Bug analyzer
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   └── lib/
│       └── utils.ts           # Utilities
├── public/                     # Static assets
├── .coderabbit.yaml           # CodeRabbit config
└── package.json
```

## 🎥 Demo Video

[Watch the 2-minute demo →](#)

## 📄 License

MIT License - feel free to use this project for learning and inspiration.

## 🙏 Acknowledgments

Built for **AssembleHack'25** with:
- [Cline](https://docs.cline.bot/) - AI coding assistant
- [CodeRabbit](https://coderabbit.ai/) - AI code reviews  
- [Vercel](https://vercel.com/) - Deployment platform
- [WeMakeDevs](https://www.wemakedevs.org/) - Community

---

<p align="center">
  Made with 💚 for AssembleHack'25
</p>
