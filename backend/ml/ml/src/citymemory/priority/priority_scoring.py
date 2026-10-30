
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.neighbors import BallTree


PROJECT_ROOT = Path(__file__).resolve().parents[3]

DATA_PATH = (
    PROJECT_ROOT
    / "datasets"
    / "processed"
    / "geography"
    / "fix_my_street_full_records.csv"
)

EARTH_RADIUS_METRES = 6_371_000


class PriorityScorer:

    def __init__(self, data_path=DATA_PATH):
        print("Loading historical complaint records...")

        self.data = pd.read_csv(data_path)

        self.data["Latitude"] = pd.to_numeric(
            self.data["Latitude"], errors="coerce"
        )
        self.data["Longitude"] = pd.to_numeric(
            self.data["Longitude"], errors="coerce"
        )

        self.data = self.data.dropna(
            subset=["Latitude", "Longitude"]
        ).copy()

        coordinates = np.radians(
            self.data[["Latitude", "Longitude"]].to_numpy()
        )

        self.tree = BallTree(coordinates, metric="haversine")

        print(f"Loaded {len(self.data)} historical records.")
        print("Priority scoring index created.")

    def calculate_priority(
        self,
        latitude,
        longitude,
        radius_metres=100
    ):
        """
        Calculate a transparent rule-based priority score.

        Score components:
        - Nearby historical complaints: up to 60 points.
        - Very close historical complaints: up to 40 points.

        This is a prototype heuristic, not a trained prediction model.
        """

        if not -90 <= latitude <= 90:
            raise ValueError("Invalid latitude.")

        if not -180 <= longitude <= 180:
            raise ValueError("Invalid longitude.")

        if radius_metres <= 0:
            raise ValueError("Radius must be greater than zero.")

        query = np.radians([[latitude, longitude]])

        radius_radians = radius_metres / EARTH_RADIUS_METRES

        indices, distances = self.tree.query_radius(
            query,
            r=radius_radians,
            return_distance=True
        )

        nearby_indices = indices[0]
        nearby_distances = distances[0] * EARTH_RADIUS_METRES

        nearby = self.data.iloc[nearby_indices].copy()

        # Exclude the exact same historical record when testing
        # with coordinates taken directly from the dataset.
        exact_match = (
            (nearby["Latitude"] == latitude)
            & (nearby["Longitude"] == longitude)
        )

        nearby = nearby.loc[~exact_match].copy()

        # Recalculate distances after excluding exact matches.
        remaining_mask = ~exact_match.to_numpy()
        nearby_distances = nearby_distances[remaining_mask]

        complaint_count = len(nearby)

        # Component 1: recurrence score (maximum 60)
        recurrence_score = min(complaint_count * 15, 60)

        # Component 2: proximity score (maximum 40)
        if len(nearby_distances) > 0:
            closest_distance = float(np.min(nearby_distances))
            proximity_score = max(
                0,
                40 * (1 - closest_distance / radius_metres)
            )
        else:
            closest_distance = None
            proximity_score = 0

        total_score = round(
            recurrence_score + proximity_score
        )

        # Priority bands
        if total_score >= 70:
            priority = "HIGH"
        elif total_score >= 35:
            priority = "MEDIUM"
        else:
            priority = "LOW"

        return {
            "priority_score": total_score,
            "priority": priority,
            "nearby_complaint_count": complaint_count,
            "recurrence_score": round(recurrence_score, 2),
            "proximity_score": round(proximity_score, 2),
            "closest_distance_metres": (
                round(closest_distance, 2)
                if closest_distance is not None
                else None
            ),
            "search_radius_metres": radius_metres,
            "nearby_records": nearby
        }


if __name__ == "__main__":

    print("\nCITYMEMORY PRIORITY SCORING TEST")
    print("=" * 50)

    scorer = PriorityScorer()

    # Use a real historical record for testing
    sample = scorer.data.iloc[0]

    latitude = float(sample["Latitude"])
    longitude = float(sample["Longitude"])

    result = scorer.calculate_priority(
        latitude=latitude,
        longitude=longitude,
        radius_metres=100
    )

    print("\nTest location:")
    print(f"Latitude: {latitude}")
    print(f"Longitude: {longitude}")

    print("\nPriority analysis:")
    print(f"Nearby complaints: {result['nearby_complaint_count']}")
    print(f"Recurrence score: {result['recurrence_score']}")
    print(f"Proximity score: {result['proximity_score']}")
    print(f"Total score: {result['priority_score']}/100")
    print(f"Priority: {result['priority']}")
    print(
        "Closest historical issue:",
        result["closest_distance_metres"],
        "metres"
    )

    print("\nPRIORITY SCORING TEST COMPLETED!")
