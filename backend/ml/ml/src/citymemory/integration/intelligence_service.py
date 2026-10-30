
from pathlib import Path
import sys
import networkx as nx
import math
import numpy as np

# Make the src directory importable
PROJECT_ROOT = Path(__file__).resolve().parents[3]
SRC_PATH = PROJECT_ROOT / "src"

if str(SRC_PATH) not in sys.path:
    sys.path.insert(0, str(SRC_PATH))

from citymemory.geography.geo_matching import GeographicMatcher
from citymemory.recurrence.recurrence_detector import RecurrenceDetector
from citymemory.priority.priority_scoring import PriorityScorer
from citymemory.graph.infrastructure_graph import InfrastructureMemoryGraph
from citymemory.matching.semantic_matching import SemanticComplaintMatcher


class CityMemoryIntelligence:

    def clean_for_json(self, data):
        if isinstance(data, dict):
            return {
                key: self.clean_for_json(value)
                for key, value in data.items()
            }

        elif isinstance(data, list):
            return [self.clean_for_json(item) for item in data]

        elif isinstance(data, tuple):
            return [self.clean_for_json(item) for item in data]

        elif isinstance(data, (float, np.floating)):
            return float(data) if math.isfinite(float(data)) else None

        elif isinstance(data, np.integer):
            return int(data)

        return data

    def __init__(self):
        print("Initializing CityMemory Intelligence...")

        self.geographic_matcher = GeographicMatcher()
        self.recurrence_detector = RecurrenceDetector()
        self.priority_scorer = PriorityScorer()

        self.memory_graph = InfrastructureMemoryGraph()
        self.memory_graph.build_graph(radius_metres=100)

        # Load semantic model only when first needed
        self.semantic_matcher = None

        print("All intelligence modules initialized.")

    def get_semantic_matcher(self):
        """Initialize semantic matching on demand."""

        if self.semantic_matcher is None:
            self.semantic_matcher = SemanticComplaintMatcher()

        return self.semantic_matcher

    def analyze_complaint(
        self,
        latitude,
        longitude,
        radius_metres=100,
        complaint_text=None
    ):
        """
        Run geographic matching, recurrence detection,
        priority scoring and optional semantic matching.
        """

        # 1. Geographic matching
        nearby = self.geographic_matcher.find_nearby_complaints(
            latitude=latitude,
            longitude=longitude,
            radius_metres=radius_metres,
            max_results=10
        )

        # 2. Recurrence detection
        recurrence = self.recurrence_detector.detect_recurrence(
            latitude=latitude,
            longitude=longitude,
            radius_metres=radius_metres
        )

        # 3. Priority scoring
        priority = self.priority_scorer.calculate_priority(
            latitude=latitude,
            longitude=longitude,
            radius_metres=radius_metres
        )

        # 4. Optional semantic matching
        semantic_results = []

        if complaint_text and complaint_text.strip():

            matcher = self.get_semantic_matcher()

            semantic_matches = matcher.find_similar_complaints(
                complaint_text=complaint_text,
                top_k=5
            )

            semantic_results = semantic_matches.to_dict(
                orient="records"
            )

        # Convert DataFrames into JSON-friendly records
        nearby_records = nearby.to_dict(orient="records")

        recurrence_records = (
            recurrence["nearby_records"]
            .head(10)
            .to_dict(orient="records")
        )

        return {
            "location": {
                "latitude": latitude,
                "longitude": longitude
            },

            "geographic_matching": {
                "nearby_complaint_count": len(nearby),
                "records": nearby_records
            },

            "recurrence": {
                "recurrence_count": recurrence["recurrence_count"],
                "radius_metres": radius_metres,
                "records": recurrence_records
            },

            "priority": {
                "score": priority["priority_score"],
                "level": priority["priority"],
                "recurrence_score": priority["recurrence_score"],
                "proximity_score": priority["proximity_score"],
                "closest_distance_metres": priority[
                    "closest_distance_metres"
                ]
            },

            "semantic_matching": {
                "available": bool(complaint_text and complaint_text.strip()),
                "matches": semantic_results
            }
        }
        return self.clean_for_json(result)

    def get_graph_summary(self):
        """Return infrastructure graph statistics."""

        graph = self.memory_graph.graph

        node_types = {}

        for _, attributes in graph.nodes(data=True):
            node_type = attributes.get("node_type", "unknown")
            node_types[node_type] = (
                node_types.get(node_type, 0) + 1
            )

        return {
            "total_nodes": graph.number_of_nodes(),
            "total_edges": graph.number_of_edges(),
            "connected_components": (
                nx.number_connected_components(graph)
            ),
            "node_distribution": node_types
        }


if __name__ == "__main__":

    print("\nCITYMEMORY INTELLIGENCE SERVICE TEST")
    print("=" * 50)

    intelligence = CityMemoryIntelligence()

    sample = intelligence.geographic_matcher.data.iloc[0]

    latitude = float(sample["Latitude"])
    longitude = float(sample["Longitude"])

    result = intelligence.analyze_complaint(
        latitude=latitude,
        longitude=longitude,
        radius_metres=100,
        complaint_text=(
            "There is a damaged road with several potholes "
            "causing problems for vehicles."
        )
    )

    print("\nCOMPLAINT ANALYSIS")
    print("=" * 50)

    print("Location:", result["location"])
    print(
        "Nearby complaints:",
        result["geographic_matching"]["nearby_complaint_count"]
    )
    print(
        "Recurrence count:",
        result["recurrence"]["recurrence_count"]
    )
    print(
        "Priority score:",
        result["priority"]["score"]
    )
    print(
        "Priority level:",
        result["priority"]["level"]
    )

    print("\nSEMANTIC MATCHING")
    print(
        result["semantic_matching"]["matches"]
    )

    print("\nGRAPH SUMMARY")
    print(intelligence.get_graph_summary())

    print("\nINTELLIGENCE SERVICE TEST COMPLETED!")
