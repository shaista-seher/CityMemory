
from pathlib import Path
import xml.etree.ElementTree as ET

PROJECT_ROOT = Path(__file__).resolve().parents[3]

KML_FILE = (
    PROJECT_ROOT
    / "datasets"
    / "raw"
    / "fix_my_street"
    / "BBMP Fix My Street Data - May and June 2022.kml"
)

print("\nCITYMEMORY KML INSPECTION")
print("=" * 50)

if not KML_FILE.exists():
    print("KML file not found:", KML_FILE)
    raise SystemExit(1)

tree = ET.parse(KML_FILE)
root = tree.getroot()

namespace = {"kml": "http://www.opengis.net/kml/2.2"}

placemarks = root.findall(".//kml:Placemark", namespace)

print("Total placemarks:", len(placemarks))

for index, placemark in enumerate(placemarks[:10], start=1):

    name = placemark.find("kml:name", namespace)
    description = placemark.find("kml:description", namespace)
    coordinates = placemark.findall(
        ".//kml:coordinates",
        namespace
    )

    print(f"\nPlacemark {index}")
    print("Name:", name.text if name is not None else "N/A")

    print(
        "Description:",
        description.text[:300]
        if description is not None and description.text
        else "N/A"
    )

    for coordinate in coordinates:
        print("Coordinates:", coordinate.text.strip()[:300])

print("\nKML INSPECTION COMPLETED")
