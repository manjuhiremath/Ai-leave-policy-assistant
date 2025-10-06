# backend/scripts/ingest_policies.py
import asyncio
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())

from app.rag import ingest_files

if __name__ == "__main__":
    # Uses absolute STORE_DIR inside rag.py
    count = asyncio.run(ingest_files("./policies"))
    print(f"Ingestion done, chunks={count}")
