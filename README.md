# LLM Red Team Lab

An automated red-teaming research system that tests LLM vulnerabilities using a 4-agent pipeline. Built for self experimentation.

## What it does

Runs automated jailbreak experiments against a target AI in two conditions: with and without a Guardrail defense agent and compares the results. Produces a structured dataset of attack types, guardrail scores, and jailbreak outcomes.

## Architecture

Four specialized agents work in a loop:

- **Hacker** — generates adversarial prompts using roleplay, authority impersonation, social engineering, gradual escalation, and distraction strategies
- **Guardrail** — scores each prompt 1-10 for manipulation risk and blocks high-risk prompts before they reach the target
- **Target** — the victim AI that must protect a secret
- **Judge** — classifies each attack type and determines whether the jailbreak succeeded

## Key findings

- With Guardrail: **0% jailbreak rate** (0/20 attacks succeeded)
- Without Guardrail: **40% jailbreak rate** (8/20 attacks succeeded)
- Guardrail blocked 40% of all prompts — false positive rate warrants further study
- Gradual escalation was the most effective attack type (75% success rate without defense)

## Stack

- Python, FastAPI, Groq API (Llama 3)
- React + Vite (frontend)
- Multi-agent orchestration with raw API calls

## Setup
```bash
# Backend
python3 -m venv venv
source venv/bin/activate
pip install openai python-dotenv fastapi uvicorn
cp .env.example .env  # add your Groq API key
python -m uvicorn server:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## Project structure
```
llm-redteam-lab/
├── agents/
│   ├── hacker.py
│   ├── guardrail.py
│   ├── target.py
│   └── judge.py
├── core/
│   ├── loop.py
│   └── logger.py
├── frontend/        # React dashboard
├── data/            # CSV results
├── server.py        # FastAPI backend
├── main.py          # CLI experiment runner
└── config.py
```

## Running experiments
```bash
# Run 20-turn experiment and save to CSV
python main.py

# Start interactive dashboard
python -m uvicorn server:app --reload
cd frontend && npm run dev
```