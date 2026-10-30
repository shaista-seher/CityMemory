
from pathlib import Path

import pandas as pd
from sklearn.neighbors import BallTree
import numpy as np


PROJECT_ROOT = Path(__file__).resolve().parents[3]

DATA_PATH = (
    PROJECT_ROOT
    / "datasets"
    / "processed"
    / "geography"
    / "fix_my_street_full_records.csv"
)

EARTH_RADIUS_METRES = 6_371_000


class RecurrenceDetector:

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

        print(f"Loaded {len(self.data)} records.")
        print("Recurrence detection index created.")

    def detect_recurrence(
        self,
        latitude,
        longitude,
        radius_metres=100
    ):
        """
        Count historical records within a specified radius.
        """

        if not -90 <= latitude <= 90:
            raise ValueError("Invalid latitude.")

        if not -180 <= longitude <= 180:
            raise ValueError("Invalid longitude.")

        if radius_metres <= 0:
            raise ValueError("Radius must be greater than zero.")

        query = np.radians([[latitude, longitude]])

        radius_radians = radius_metres / EARTH_RADIUS_METRES

        indices = self.tree.query_radius(
            query,
            r=radius_radians
        )[0]

        nearby = self.data.iloc[indices].copy()

        # Exclude the exact same record if the test location
        # is taken from the historical dataset.
        nearby = nearby[
            ~(
                (nearby["Latitude"] == latitude)
                & (nearby["Longitude"] == longitude)
            )
        ]

        recurrence_count = len(nearby)

        return {
            "recurrence_count": recurrence_count,
            "radius_metres": radius_metres,
            "nearby_records": nearby
        }


if __name__ == "__main__":

    print("\nCITYMEMORY RECURRENCE DETECTION TEST")
    print("=" * 50)

    detector = RecurrenceDetector()

    # Test using a real historical location
    sample = detector.data.iloc[0]

    latitude = float(sample["Latitude"])
    longitude = float(sample["Longitude"])

    result = detector.detect_recurrence(
        latitude=latitude,
        longitude=longitude,
        radius_metres=100
    )

    print("\nTest location:")
    print(f"Latitude: {latitude}")
    print(f"Longitude: {longitude}")

    print("\nRecurrence analysis:")
    print(f"Search radius: {result['radius_metres']} metres")
    print(
        "Other historical records nearby:",
        result["recurrence_count"]
    )

    print("\nNearby historical issues:")

    if result["nearby_records"].empty:
        print("No other historical records found.")
    else:
        columns = [
            "Request_Id",
            "Ward_Name",
            "Problem_De",
            "Status"
        ]

        print(
            result["nearby_records"][columns]
            .head(10)
            .to_string(index=False)
        )

    print("\nRECURRENCE DETECTION TEST COMPLETED!")
