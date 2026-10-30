
from pathlib import Path

import pandas as pd
import networkx as nx
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


class InfrastructureMemoryGraph:

    def __init__(self, data_path=DATA_PATH):
        print("Loading historical infrastructure records...")

        self.data = pd.read_csv(data_path)

        self.data["Latitude"] = pd.to_numeric(
            self.data["Latitude"], errors="coerce"
        )
        self.data["Longitude"] = pd.to_numeric(
            self.data["Longitude"], errors="coerce"
        )

        self.data = self.data.dropna(
            subset=["Latitude", "Longitude", "Request_Id"]
        ).copy()

        self.graph = nx.Graph()

        print(f"Loaded {len(self.data)} records.")

    def build_graph(self, radius_metres=100):

        print("\nBuilding infrastructure memory graph...")

        coordinates = np.radians(
            self.data[["Latitude", "Longitude"]].to_numpy()
        )

        tree = BallTree(coordinates, metric="haversine")

        # Add complaint, ward and zone nodes
        for _, row in self.data.iterrows():

            complaint_id = f"complaint_{row['Request_Id']}"
            ward_id = f"ward_{row['Ward_Name']}"
            zone_id = f"zone_{row['Zone']}"

            self.graph.add_node(
                complaint_id,
                node_type="complaint",
                description=str(row.get("Problem_De", "")),
                status=str(row.get("Status", "Unknown")),
                latitude=float(row["Latitude"]),
                longitude=float(row["Longitude"])
            )

            self.graph.add_node(
                ward_id,
                node_type="ward",
                name=str(row["Ward_Name"])
            )

            self.graph.add_node(
                zone_id,
                node_type="zone",
                name=str(row["Zone"])
            )

            self.graph.add_edge(
                complaint_id,
                ward_id,
                relationship="reported_in"
            )

            self.graph.add_edge(
                complaint_id,
                zone_id,
                relationship="located_in"
            )

        # Connect complaints within the configured radius
        neighbourhoods = tree.query_radius(
            coordinates,
            r=radius_metres / EARTH_RADIUS_METRES
        )

        for index, neighbours in enumerate(neighbourhoods):

            source_id = (
                f"complaint_{self.data.iloc[index]['Request_Id']}"
            )

            for neighbour_index in neighbours:

                if index >= neighbour_index:
                    continue

                target_id = (
                    f"complaint_"
                    f"{self.data.iloc[neighbour_index]['Request_Id']}"
                )

                if source_id != target_id:
                    self.graph.add_edge(
                        source_id,
                        target_id,
                        relationship="nearby",
                        radius_metres=radius_metres
                    )

        print("Graph construction completed.")

        return self.graph

    def show_graph_summary(self):

        print("\nINFRASTRUCTURE MEMORY GRAPH SUMMARY")
        print("=" * 50)

        print("Total nodes:", self.graph.number_of_nodes())
        print("Total edges:", self.graph.number_of_edges())

        node_types = {}

        for _, attributes in self.graph.nodes(data=True):

            node_type = attributes.get("node_type", "unknown")

            node_types[node_type] = (
                node_types.get(node_type, 0) + 1
            )

        print("\nNode distribution:")

        for node_type, count in node_types.items():
            print(f"{node_type}: {count}")

        print("\nConnected components:",
              nx.number_connected_components(self.graph))

    def save_graph(self, output_path=None):

        if output_path is None:
            output_path = (
                PROJECT_ROOT
                / "datasets"
                / "processed"
                / "geography"
                / "citymemory_infrastructure_graph.graphml"
            )

        nx.write_graphml(self.graph, output_path)

        print(f"\nGraph saved to: {output_path}")


if __name__ == "__main__":

    print("\nCITYMEMORY INFRASTRUCTURE MEMORY GRAPH")
    print("=" * 50)

    memory = InfrastructureMemoryGraph()

    memory.build_graph(radius_metres=100)

    memory.show_graph_summary()

    memory.save_graph()

    print("\nINFRASTRUCTURE GRAPH TEST COMPLETED!")
