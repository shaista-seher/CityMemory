
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.neighbors import BallTree


# Project root
PROJECT_ROOT = Path(__file__).resolve().parents[3]

DATA_PATH = (
    PROJECT_ROOT
    / "datasets"
    / "processed"
    / "geography"
    / "fix_my_street_full_records.csv"
)

EARTH_RADIUS_METRES = 6_371_000


class GeographicMatcher:
    def __init__(self, data_path=DATA_PATH):
        print("Loading historical geographic records...")

        self.data = pd.read_csv(data_path)

        # Ensure coordinates are numeric
        self.data["Latitude"] = pd.to_numeric(
            self.data["Latitude"], errors="coerce"
        )
        self.data["Longitude"] = pd.to_numeric(
            self.data["Longitude"], errors="coerce"
        )

        # Keep only records with valid coordinates
        self.data = self.data.dropna(
            subset=["Latitude", "Longitude"]
        ).copy()

        # BallTree with Haversine distance expects radians
        coordinates = np.radians(
            self.data[["Latitude", "Longitude"]].to_numpy()
        )

        self.tree = BallTree(coordinates, metric="haversine")

        print(f"Loaded {len(self.data)} records.")
        print("Geographic index created successfully.")

    def find_nearby_complaints(
        self,
        latitude,
        longitude,
        radius_metres=100,
        max_results=10
    ):
        """
        Find historical complaints within a given radius.

        Returns matching records ordered by distance.
        """

        if not -90 <= latitude <= 90:
            raise ValueError("Latitude must be between -90 and 90.")

        if not -180 <= longitude <= 180:
            raise ValueError("Longitude must be between -180 and 180.")

        if radius_metres <= 0:
            raise ValueError("Radius must be greater than zero.")

        query = np.radians([[latitude, longitude]])

        radius_radians = radius_metres / EARTH_RADIUS_METRES

        indices, distances = self.tree.query_radius(
            query,
            r=radius_radians,
            return_distance=True,
            sort_results=True
        )

        matched_indices = indices[0][:max_results]
        matched_distances = distances[0][:max_results]

        results = self.data.iloc[matched_indices].copy()

        results["distance_metres"] = np.round(
            matched_distances * EARTH_RADIUS_METRES, 2
        )

        return results.reset_index(drop=True)


if __name__ == "__main__":
    print("\nCITYMEMORY GEOGRAPHIC MATCHING TEST")
    print("=" * 50)

    matcher = GeographicMatcher()

    # Use the first real KML record as the test location
    sample = matcher.data.iloc[0]

    latitude = float(sample["Latitude"])
    longitude = float(sample["Longitude"])

    print("\nTest location:")
    print(f"Latitude: {latitude}")
    print(f"Longitude: {longitude}")

    nearby = matcher.find_nearby_complaints(
        latitude=latitude,
        longitude=longitude,
        radius_metres=100,
        max_results=10
    )

    print("\nNearby historical complaints:")
    print("-" * 50)

    if nearby.empty:
        print("No nearby complaints found.")
    else:
        columns = [
            "Request_Id",
            "Ward_Name",
            "Problem_De",
            "Status",
            "distance_metres"
        ]

        print(nearby[columns].to_string(index=False))

    print("\nGEOGRAPHIC MATCHING TEST COMPLETED!")
