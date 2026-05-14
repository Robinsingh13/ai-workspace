🚀 AI Workspace

An AI-native engineering workspace with memory, reasoning, task planning, and repository intelligence.

🧠 Overview

AI Workspace is an AI-powered software engineering assistant that helps developers plan, build, and understand software systems using persistent memory and contextual reasoning.

It combines:

🧠 Long-term AI memory (decisions, bugs, tasks)
🔍 Semantic search using embeddings
🤖 AI task decomposition
📦 GitHub repository intelligence
⚡ Streaming AI responses
🧩 Multi-project workspaces

Inspired by tools like:

Mem0
 (AI memory layer)
Cursor
 (AI developer workflow)
Linear
 (structured task systems)
🎯 Problem Statement

Modern AI assistants:

forget past context
lack structured engineering memory
don’t understand evolving codebases
cannot track long-term project decisions
AI Workspace solves this by introducing:

A persistent, structured memory system for software engineering workflows.

⚙️ Key Features
🧠 1. AI Memory System

Stores and classifies:

bugs 🐛
tasks 📌
decisions 🧭
architecture notes 🏗️

Each memory is:

auto-classified using LLM
stored per project
retrievable via semantic search
🔍 2. Semantic Memory (Vector Search)
Uses OpenAI embeddings (text-embedding-3-small)
Finds relevant past context
Improves AI responses over time
User Query → Embedding → Similar Memory → AI Context Injection
🤖 3. AI Task Planner

Transforms feature descriptions into structured engineering plans:

Backend tasks
Frontend tasks
Database design
Deployment steps

Example:

Input: “Build payment system”

Output:

API routes
Stripe integration
database schema
webhook handling
📦 4. Repository Analyzer

Analyzes GitHub repositories by:

cloning repo locally
parsing package.json
detecting:
framework (React / Next.js / Vue)
styling (Tailwind / Styled Components)
architecture type

Then AI generates:

architecture summary
improvement suggestions
⚡ 5. Streaming AI Chat
Real-time token streaming
ChatGPT-like UX
Memory-aware responses
🧩 6. Multi-Project Workspaces

Each project has isolated:

memory
chat history
tasks
repository context
🏗️ System Architecture
Frontend (React)
      ↓
Express Backend
      ↓
OpenAI API
      ↓
Memory Layer (Classification + Storage)
      ↓
Vector Store (Embeddings + Similarity Search)
      ↓
Repo Analyzer (Git + AST + heuristics)
📁 Project Structure
ai-workspace/
│
├── server/
│   ├── index.js
│   ├── memory/
│   │   ├── memoryStore.js
│   │   ├── vectorMemory.js
│   ├── projects/
│   │   ├── projectStore.js
│   ├── repos/
│
├── client/
│   ├── components/
│   ├── pages/
│
├── README.md
🔌 API Endpoints
💬 Chat API
POST /chat
{
  "message": "Build authentication system",
  "projectId": "project-1"
}
🧠 Memory API
GET /memory/:projectId
📌 Task Generator
POST /tasks/generate
{
  "prompt": "Build payment system with Stripe"
}
📦 Repo Analyzer
POST /repo/analyze
{
  "repoName": "https://github.com/user/repo"
}
📁 Projects
POST /projects
GET /projects
⚙️ Environment Variables

Create .env file:

OPENAI_API_KEY=your_api_key_here
🚀 Getting Started
1. Install dependencies
npm install
2. Start backend
node index.js
3. Start frontend
npm run dev
🎥 Demo Flow (Recommended)

Show these features in order:

Create project
Ask AI to design feature
Memory gets stored
Ask follow-up question (AI remembers context)
Generate tasks
Analyze repo
Show streaming response
