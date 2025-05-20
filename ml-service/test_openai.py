from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    raise ValueError("OPENAI_API_KEY not found in environment variables")

client = OpenAI(api_key=api_key)

try:
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": "Hello"}],
        temperature=0,
        max_tokens=5
    )
    print("OpenAI response:", response.choices[0].message.content)
except Exception as e:
    import traceback
    print("OpenAI connection error:", e)
    traceback.print_exc()
