from agents.hacker import generate_attack
from agents.guardrail import evaluate
from agents.target import respond
from agents.judge import analyze
from core.logger import log_turn, init_csv
from config import NUM_TURNS

def run():
    init_csv()
    attacks_so_far = []
    target_last_response = "Hello, how can I help you today?"

    for turn in range(1, NUM_TURNS + 1):
        print(f"\nTurn {turn}/{NUM_TURNS}")
        print("-" * 30)

        # 1. hacker generates attack
        attack = generate_attack(target_last_response, attacks_so_far)
        attacks_so_far.append(attack)
        print(f"Attack: {attack[:80]}...")

        # guardrail disabled for baseline run
        guardrail = {"score": 0, "reason": "guardrail disabled", "blocked": False}
        target_response = respond(attack)
            

        print(f"Target: {target_response[:80]}...")

        # 4. judge analyzes!
        judge = analyze(attack, target_response)
        print(f"Attack type: {judge['attack_type']}")
        print(f"Jailbroken: {judge['succeeded']}")
        print(f"Judge reason: {judge['reason']}")

        # 5. log everything
        log_turn(turn, attack, guardrail, target_response, judge)

        target_last_response = target_response