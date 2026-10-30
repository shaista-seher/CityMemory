
from pathlib import Path

import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


# Project paths
PROJECT_ROOT = Path(__file__).resolve().parents[3]

MASTER_FILE = (
    PROJECT_ROOT
    / "datasets"
    / "processed"
    / "final"
    / "citymemory_master_complaints.csv"
)

EMBEDDING_DIR = (
    PROJECT_ROOT
    / "datasets"
    / "processed"
    / "embeddings"
)

EMBEDDING_FILE = EMBEDDING_DIR / "complaint_embeddings.npy"
ID_FILE = EMBEDDING_DIR / "complaint_ids.csv"

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"


class SemanticComplaintMatcher:

    def __init__(self):
        print("Loading historical complaints...")

        self.complaints = pd.read_csv(
            MASTER_FILE,
            low_memory=False
        )

        print("Loading saved embeddings...")

        self.embeddings = np.load(
            EMBEDDING_FILE,
            mmap_mode="r"
        )

        self.complaint_ids = pd.read_csv(ID_FILE)

        if len(self.complaints) != len(self.embeddings):
            raise ValueError(
                "Complaint and embedding counts do not match."
            )

        if len(self.complaint_ids) != len(self.embeddings):
            raise ValueError(
                "Complaint ID and embedding counts do not match."
            )

        print("Loading Sentence Transformer model...")

        self.model = SentenceTransformer(MODEL_NAME)

        print("Semantic matcher ready!")

    def find_similar_complaints(
        self,
        complaint_text,
        top_k=5
    ):

        if not complaint_text or not complaint_text.strip():
            raise ValueError("Complaint text cannot be empty.")

        # Convert new complaint into an embedding
        new_embedding = self.model.encode(
            [complaint_text],
            normalize_embeddings=True,
            convert_to_numpy=True
        )

        # Calculate cosine similarity against historical embeddings
        similarities = cosine_similarity(
            new_embedding,
            self.embeddings
        )[0]

        # Get indices of the most similar complaints
        top_indices = np.argsort(similarities)[::-1][:top_k]

        results = self.complaints.iloc[top_indices].copy()

        results["similarity_score"] = similarities[top_indices]

        results["complaint_id"] = (
            self.complaint_ids.iloc[top_indices]["complaint_id"].values
        )

        return results[
            [
                "complaint_id",
                "category",
                "subcategory",
                "ward_name",
                "reported_at",
                "status",
                "similarity_score"
            ]
        ]


if __name__ == "__main__":

    print("\nCITYMEMORY SEMANTIC COMPLAINT MATCHING")
    print("=" * 55)

    matcher = SemanticComplaintMatcher()

    sample_complaint = (
        "There is a damaged road with several potholes "
        "causing problems for vehicles."
    )

    print("\nNew complaint:")
    print(sample_complaint)

    print("\nFinding similar historical complaints...")

    matches = matcher.find_similar_complaints(
        sample_complaint,
        top_k=5
    )

    print("\nTOP MATCHING COMPLAINTS")
    print("=" * 55)

    print(
        matches.to_string(
            index=False
        )
    )

    print("\nSEMANTIC MATCHING COMPLETED!")
