# LLM Red Team Lab

I built this to see how easily you could break an LLM using automated attacks,
and whether a guardrail agent could actually stop them. Ended up being way more
interesting than I expected.

## What it does

Runs automated jailbreak experiments using a 4 agent pipeline. Two conditions:
with a guardrail defense and without. Compares how many attacks get through.

## The 4 agents

- **Hacker**: generates adversarial prompts using roleplay, authority 
  impersonation, social engineering, gradual escalation, and distraction
- **Guardrail**: scores each prompt 1-10 for manipulation risk and blocks 
  anything too suspicious before it reaches the target
- **Target**: the victim AI that's trying to protect a secret
- **Judge**: classifies the attack type and determines if the jailbreak worked

## What I found

<img width="1377" height="764" alt="image" src="https://github.com/user-attachments/assets/1de5072b-1a74-4bbf-bb84-a851aed414cc" />


- Without guardrail: 40% jailbreak rate (8/20 attacks succeeded)
- With guardrail: 0% jailbreak rate (0/20 attacks succeeded)
- Gradual escalation was by far the most effective attack, 75% success rate
- The guardrail blocked 40% of all prompts which is a high false positive rate worth looking into

The gradual escalation finding was the most interesting to me. Attacks that 
slowly built up context over multiple turns worked much better than direct 
attempts. The guardrail catches obvious attacks but the slow burn ones are harder.

## Stack

Python, FastAPI, Groq API (Llama 3), React + Vite

## Setup

```bash
# backend
python3 -m venv venv
source venv/bin/activate
pip install openai python-dotenv fastapi uvicorn
cp .env.example .env
python -m uvicorn server:app --reload

# frontend
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
├── frontend/
├── data/
├── server.py
├── main.py
└── config.py
```

## Running experiments

```bash
# run 20 turn experiment and save results to CSV
python main.py

# start the dashboard
python -m uvicorn server:app --reload
cd frontend && npm run dev
```
