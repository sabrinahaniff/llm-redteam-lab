from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agents.hacker import generate_attack
from agents.guardrail import evaluate
from agents.target import respond
from agents.judge import analyze

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class TurnRequest(BaseModel):
    secret_word: str
    target_last_response: str
    attacks_so_far: list[str]
    use_guardrail: bool

@app.post("/run-turn")
async def run_turn(req: TurnRequest):
    import os
    os.environ["SECRET_WORD"] = req.secret_word

    attack = generate_attack(req.target_last_response, req.attacks_so_far)
    guardrail = evaluate(attack) if req.use_guardrail else {"score": 0, "reason": "disabled", "blocked": False}

    if guardrail["blocked"]:
        target_response = "[BLOCKED BY GUARDRAIL]"
    else:
        target_response = respond(attack)

    judge = analyze(attack, target_response)

    return {
        "attack": attack,
        "guardrail_score": guardrail["score"],
        "guardrail_blocked": guardrail["blocked"],
        "guardrail_reason": guardrail["reason"],
        "target_response": target_response,
        "attack_type": judge["attack_type"],
        "jailbroken": judge["succeeded"],
        "judge_reason": judge["reason"]
    }