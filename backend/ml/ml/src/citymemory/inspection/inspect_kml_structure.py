
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

tree = ET.parse(KML_FILE)
root = tree.getroot()

namespace = {"kml": "http://www.opengis.net/kml/2.2"}

print("\nKML STRUCTURE INSPECTION")
print("=" * 55)

# Print top-level KML elements
print("\nTop-level elements:")

for child in root:
    print(child.tag.split("}")[-1])

# Inspect folders
folders = root.findall(".//kml:Folder", namespace)

print("\nNumber of folders:", len(folders))

for folder in folders[:15]:
    name = folder.find("kml:name", namespace)

    print(
        "Folder:",
        name.text if name is not None else "Unnamed"
    )

# Inspect document metadata
document = root.find(".//kml:Document", namespace)

if document is not None:
    print("\nDocument children:")

    for child in document:
        print(child.tag.split("}")[-1])

# Inspect first placemark structure
placemarks = root.findall(".//kml:Placemark", namespace)

if placemarks:
    print("\nFirst placemark complete structure:")

    print(
        ET.tostring(
            placemarks[0],
            encoding="unicode"
        )[:3000]
    )

# Check ExtendedData and attributes
extended_data = root.findall(
    ".//kml:ExtendedData",
    namespace
)

print("\nExtendedData elements:", len(extended_data))

print("\nKML STRUCTURE INSPECTION COMPLETED")
