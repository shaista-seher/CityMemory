
from pathlib import Path
import xml.etree.ElementTree as ET
import pandas as pd

PROJECT_ROOT = Path(__file__).resolve().parents[3]

KML_FILE = (
    PROJECT_ROOT
    / "datasets"
    / "raw"
    / "fix_my_street"
    / "BBMP Fix My Street Data - May and June 2022.kml"
)

OUTPUT_DIR = PROJECT_ROOT / "datasets" / "processed" / "geography"
OUTPUT_FILE = OUTPUT_DIR / "fix_my_street_coordinates.csv"

namespace = {"kml": "http://www.opengis.net/kml/2.2"}

print("\nCITYMEMORY KML COORDINATE EXTRACTION")
print("=" * 55)

tree = ET.parse(KML_FILE)
root = tree.getroot()

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

records = []

for placemark in root.findall(".//kml:Placemark", namespace):

    name = placemark.find("kml:name", namespace)
    description = placemark.find("kml:description", namespace)

    coordinates = placemark.findall(
        ".//kml:coordinates",
        namespace
    )

    for coordinate_element in coordinates:

        if not coordinate_element.text:
            continue

        coordinate_text = coordinate_element.text.strip()

        for item in coordinate_text.split():

            parts = item.split(",")

            if len(parts) < 2:
                continue

            try:
                longitude = float(parts[0])
                latitude = float(parts[1])

                records.append({
                    "placemark_name": (
                        name.text.strip()
                        if name is not None and name.text
                        else None
                    ),
                    "description": (
                        description.text.strip()
                        if description is not None
                        and description.text
                        else None
                    ),
                    "longitude": longitude,
                    "latitude": latitude
                })

            except ValueError:
                continue

df = pd.DataFrame(records)

df.to_csv(OUTPUT_FILE, index=False)

print("Coordinates extracted:", len(df))
print("Missing latitude:", df["latitude"].isna().sum())
print("Missing longitude:", df["longitude"].isna().sum())

print("\nSample extracted coordinates:")
print(df.head(10).to_string(index=False))

print("\nLatitude range:")
print(df["latitude"].min(), "to", df["latitude"].max())

print("\nLongitude range:")
print(df["longitude"].min(), "to", df["longitude"].max())

print("\nSaved to:", OUTPUT_FILE)
print("\nEXTRACTION COMPLETED!")
