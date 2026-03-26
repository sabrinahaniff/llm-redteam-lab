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

        # Step 1: Hacker generates attack
        attack = generate_attack(target_last_response, attacks_so_far)
        attacks_so_far.append(attack)
        print(f"Attack: {attack[:80]}...")

        # Step 2: Guardrail evaluates
        guardrail = evaluate(attack)
        print(f"Guardrail: {guardrail['score']}/10 — "
              f"{'BLOCKED' if guardrail['blocked'] else 'ALLOWED'}")
        print(f"Reason: {guardrail['reason']}")

        # Step 3: Target responds (skip if blocked)
        if guardrail["blocked"]:
            target_response = "[BLOCKED BY GUARDRAIL]"
        else:
            target_response = respond(attack)

        print(f"Target: {target_response[:80]}...")

        # Step 4: Judge analyzes
        judge = analyze(attack, target_response)
        print(f"Attack type: {judge['attack_type']}")
        print(f"Jailbroken: {judge['succeeded']}")
        print(f"Judge reason: {judge['reason']}")

        # Step 5: Log everything
        log_turn(turn, attack, guardrail, target_response, judge)

        target_last_response = target_response