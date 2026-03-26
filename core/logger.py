import csv
import os
from datetime import datetime

RESULTS_FILE = "data/results.csv"
HEADERS = [
    "turn", "timestamp", "attack_prompt",
    "attack_type", "guardrail_score",
    "guardrail_blocked", "target_response",
    "jailbreak_succeeded", "judge_reason"
]

def init_csv():
    if not os.path.exists(RESULTS_FILE):
        with open(RESULTS_FILE, "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(HEADERS)

def log_turn(turn: int, attack_prompt: str,
             guardrail: dict, target_response: str,
             judge: dict):
    with open(RESULTS_FILE, "a", newline="") as f:
        writer = csv.writer(f)
        writer.writerow([
            turn,
            datetime.now().isoformat(),
            attack_prompt,
            judge["attack_type"],
            guardrail["score"],
            guardrail["blocked"],
            target_response,
            judge["succeeded"],
            judge["reason"]
        ])