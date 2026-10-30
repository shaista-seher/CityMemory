
import pandas as pd
from pathlib import Path

# =====================================================
# CITYMEMORY - DATA STANDARDIZATION
# =====================================================

PROJECT_ROOT = Path(__file__).resolve().parents[3]

INPUT_DIR = PROJECT_ROOT / "datasets" / "processed" / "grievances"
OUTPUT_DIR = PROJECT_ROOT / "datasets" / "processed" / "standardized"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


# Original column names mapped to CityMemory names
COLUMN_MAPPING = {
    "Complaint ID": "complaint_id",
    "Category": "category",
    "Sub Category": "subcategory",
    "Grievance Date": "reported_at",
    "Ward Name": "ward_name",
    "Grievance Status": "status",
    "Staff Remarks": "staff_remarks",
    "Staff Name": "staff_name"
}


def standardize_file(file_path):

    print("\nProcessing:", file_path.name)

    df = pd.read_csv(file_path, low_memory=False)

    # Rename original columns
    df = df.rename(columns=COLUMN_MAPPING)

    # Convert complaint ID to string
    df["complaint_id"] = df["complaint_id"].astype("string")

    # Convert date into datetime
    df["reported_at"] = pd.to_datetime(
        df["reported_at"],
        errors="coerce"
    )

    # Extract source year from filename
    if "2024" in file_path.name:
        source_year = 2024
    elif "2025" in file_path.name:
        source_year = 2025
    else:
        source_year = None

    df["source_year"] = source_year
    df["source_dataset"] = file_path.name

    # Reorder columns
    standard_columns = [
        "complaint_id",
        "category",
        "subcategory",
        "reported_at",
        "ward_name",
        "status",
        "staff_remarks",
        "staff_name",
        "source_year",
        "source_dataset"
    ]

    df = df[standard_columns]

    return df


def main():

    print("\nCITYMEMORY DATA STANDARDIZATION")
    print("=" * 60)

    files = [
        INPUT_DIR / "BBMP Grievances 2024_cleaned.csv",
        INPUT_DIR / "BBMP Grievances 2025_cleaned.csv"
    ]

    standardized_datasets = []

    for file_path in files:

        if not file_path.exists():
            print("File not found:", file_path)
            continue

        df = standardize_file(file_path)

        standardized_datasets.append(df)

        print("Rows:", len(df))
        print("Columns:", len(df.columns))

    if not standardized_datasets:
        print("No cleaned datasets found.")
        return

    # Combine 2024 and 2025
    combined_df = pd.concat(
        standardized_datasets,
        ignore_index=True
    )

    # Save individual standardized datasets
    for df in standardized_datasets:

        year = df["source_year"].iloc[0]

        output_file = (
            OUTPUT_DIR / f"complaints_{year}_standardized.csv"
        )

        df.to_csv(output_file, index=False)

        print("\nSaved:", output_file)

    # Save combined dataset
    combined_file = OUTPUT_DIR / "all_complaints_standardized.csv"

    combined_df.to_csv(combined_file, index=False)

    print("\n" + "=" * 60)
    print("STANDARDIZATION COMPLETED")
    print("=" * 60)

    print("Total complaints:", len(combined_df))
    print("Total columns:", len(combined_df.columns))
    print("2024 complaints:", (combined_df["source_year"] == 2024).sum())
    print("2025 complaints:", (combined_df["source_year"] == 2025).sum())

    print("\nCombined dataset saved:", combined_file)


if __name__ == "__main__":
    main()
