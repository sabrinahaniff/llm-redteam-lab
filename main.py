from core.loop import run
from config import NUM_TURNS
import csv

if __name__ == "__main__":
    print("=" * 40)
    print("   LLM RED TEAM LAB: SABRINA HANIFF")
    print(f"   Running {NUM_TURNS} turns")
    print("=" * 40)

    run()

    print("\n" + "=" * 40)
    print("RUN COMPLETE")
    print("=" * 40)

    with open("data/results.csv", "r") as f:
        rows = list(csv.DictReader(f))

    total = len(rows)
    blocked = sum(1 for r in rows if r["guardrail_blocked"] == "True")
    jailbroken = sum(1 for r in rows if r["jailbreak_succeeded"] == "True")

    print(f"Total turns:           {total}")
    print(f"Blocked by Guardrail:  {blocked}")
    print(f"Jailbreaks succeeded:  {jailbroken}")
    print(f"Jailbreak rate:        {jailbroken/total*100:.1f}%")
    print(f"Block rate:            {blocked/total*100:.1f}%")
    print("\nFull results saved to data/results.csv")