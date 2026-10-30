
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
OUTPUT_FILE = OUTPUT_DIR / "fix_my_street_full_records.csv"

NAMESPACE = {"kml": "http://www.opengis.net/kml/2.2"}

# Fields needed for CityMemory.
# Phone numbers and personal contact details are intentionally excluded.
SELECTED_FIELDS = [
    "FID",
    "Zone",
    "Ward_Name",
    "Department",
    "Is_Road_In",
    "Request_Id",
    "Open_Date",
    "Location",
    "Problem_De",
    "Latitude",
    "Longitude",
    "Status",
    "Color_code",
    "Latest_Com",
    "commentdat",
    "commentby",
    "Assigned_T",
    "Type_of_Ro",
    "Type_of_Wo",
    "Filling_Ty",
    "Length__in",
    "Width__in",
    "Area__in_s",
    "Total_Esti",
    "Is_Work_Or",
    "To_be_exec",
    "Estimated",
    "Estimate_1"
]


def extract_records():

    print("\nCITYMEMORY FULL KML DATA EXTRACTION")
    print("=" * 55)

    tree = ET.parse(KML_FILE)
    root = tree.getroot()

    placemarks = root.findall(
        ".//kml:Placemark",
        NAMESPACE
    )

    records = []

    for placemark in placemarks:

        record = {
            field: None for field in SELECTED_FIELDS
        }

        # Extract all ExtendedData fields
        simple_data = placemark.findall(
            ".//kml:SimpleData",
            NAMESPACE
        )

        for item in simple_data:

            field_name = item.attrib.get("name")

            if field_name in SELECTED_FIELDS:
                record[field_name] = (
                    item.text.strip()
                    if item.text
                    else None
                )

        # Extract coordinates directly from geometry
        coordinate_element = placemark.find(
            ".//kml:Point/kml:coordinates",
            NAMESPACE
        )

        if coordinate_element is not None and coordinate_element.text:

            parts = coordinate_element.text.strip().split(",")

            if len(parts) >= 2:
                record["Longitude"] = parts[0].strip()
                record["Latitude"] = parts[1].strip()

        records.append(record)

    df = pd.DataFrame(records)

    # Convert geographic and numerical columns
    numeric_columns = [
        "Latitude",
        "Longitude",
        "Length__in",
        "Width__in",
        "Area__in_s",
        "Total_Esti"
    ]

    for column in numeric_columns:
        df[column] = pd.to_numeric(
            df[column],
            errors="coerce"
        )

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    df.to_csv(OUTPUT_FILE, index=False)

    print("Total placemarks:", len(placemarks))
    print("Extracted records:", len(df))
    print("Total columns:", len(df.columns))

    print("\nMissing values in important fields:")

    important_fields = [
        "Ward_Name",
        "Problem_De",
        "Latitude",
        "Longitude",
        "Status",
        "Request_Id"
    ]

    print(df[important_fields].isna().sum())

    print("\nAvailable wards:", df["Ward_Name"].nunique())
    print("Available zones:", df["Zone"].nunique())
    print("Available statuses:", df["Status"].nunique())

    print("\nSample records:")
    print(
        df[
            [
                "Request_Id",
                "Zone",
                "Ward_Name",
                "Problem_De",
                "Latitude",
                "Longitude",
                "Status"
            ]
        ].head(5).to_string(index=False)
    )

    print("\nSaved file:", OUTPUT_FILE)
    print("\nFULL KML EXTRACTION COMPLETED!")


if __name__ == "__main__":
    extract_records()
