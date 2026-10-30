
from sentence_transformers import SentenceTransformer
from pathlib import Path
import numpy as np
import pandas as pd

# =====================================================
# CITYMEMORY - TEXT EMBEDDING GENERATOR
# =====================================================

PROJECT_ROOT = Path(__file__).resolve().parents[3]

INPUT_FILE = (
    PROJECT_ROOT
    / "datasets"
    / "processed"
    / "final"
    / "citymemory_master_complaints.csv"
)

OUTPUT_DIR = PROJECT_ROOT / "datasets" / "processed" / "embeddings"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"


def generate_embeddings():

    print("\nCITYMEMORY TEXT EMBEDDING GENERATION")
    print("=" * 60)

    if not INPUT_FILE.exists():
        raise FileNotFoundError(f"Dataset not found: {INPUT_FILE}")

    df = pd.read_csv(INPUT_FILE, low_memory=False)

    # Use category and description together.
    # Subcategory provides additional issue context.
    text_data = (
        df["category"].fillna("").astype(str)
        + ". "
        + df["subcategory"].fillna("").astype(str)
    ).str.strip()

    print("Complaints loaded:", len(df))
    print("Loading model:", MODEL_NAME)

    model = SentenceTransformer(MODEL_NAME)

    print("\nGenerating embeddings...")

    embeddings = model.encode(
        text_data.tolist(),
        batch_size=64,
        show_progress_bar=True,
        normalize_embeddings=True,
        convert_to_numpy=True
    )

    # Save embeddings
    embedding_file = OUTPUT_DIR / "complaint_embeddings.npy"
    np.save(embedding_file, embeddings)

    # Save corresponding complaint IDs separately
    ids_file = OUTPUT_DIR / "complaint_ids.csv"
    df[["complaint_id"]].to_csv(ids_file, index=False)

    print("\n" + "=" * 60)
    print("EMBEDDINGS GENERATED SUCCESSFULLY")
    print("=" * 60)

    print("Embedding shape:", embeddings.shape)
    print("Embedding dimension:", embeddings.shape[1])
    print("Embedding file:", embedding_file)
    print("ID file:", ids_file)


if __name__ == "__main__":
    generate_embeddings()
