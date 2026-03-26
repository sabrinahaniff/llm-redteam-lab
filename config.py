import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
SECRET_WORD = os.getenv('SECRET_WORD', 'SABRINA_PROTOCOL')
GUARDRAIL_THRESHOLD = 6
NUM_TURNS = 20
MODEL = 'llama-3.3-70b-versatile'

BASE_URL = 'https://api.groq.com/openai/v1' 