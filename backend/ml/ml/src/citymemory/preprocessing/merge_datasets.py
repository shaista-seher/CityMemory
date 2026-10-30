
import pandas as pd
from pathlib import Path

# =====================================================
# CITYMEMORY - DATASET MERGING AND VALIDATION
# =====================================================

PROJECT_ROOT = Path(__file__).resolve().parents[3]

INPUT_FILE = (
    PROJECT_ROOT
    / "datasets"
    / "processed"
    / "standardized"
    / "all_complaints_standardized.csv"
)

OUTPUT_DIR = (
    PROJECT_ROOT
    / "datasets"
    / "processed"
    / "final"
)

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


REQUIRED_COLUMNS = [
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


def validate_dataset(df):

    print("\nSTARTING DATA VALIDATION")
    print("=" * 60)

    # Check required columns
    missing_columns = [
        col for col in REQUIRED_COLUMNS
        if col not in df.columns
    ]

    if missing_columns:
        raise ValueError(
            f"Missing required columns: {missing_columns}"
        )

    # Missing complaint IDs
    missing_ids = df["complaint_id"].isna().sum()

    # Duplicate complaint IDs
    duplicate_ids = df["complaint_id"].duplicated().sum()

    # Missing dates
    missing_dates = df["reported_at"].isna().sum()

    # Missing categories
    missing_categories = df["category"].isna().sum()

    # Missing wards
    missing_wards = df["ward_name"].isna().sum()

    # Invalid source years
    invalid_years = (
        ~df["source_year"].isin([2024, 2025])
    ).sum()

    # Check records by year
    year_counts = df["source_year"].value_counts().to_dict()

    report = {
        "total_records": len(df),
        "missing_complaint_ids": int(missing_ids),
        "duplicate_complaint_ids": int(duplicate_ids),
        "missing_dates": int(missing_dates),
        "missing_categories": int(missing_categories),
        "missing_wards": int(missing_wards),
        "invalid_source_years": int(invalid_years),
        "records_2024": int(year_counts.get(2024, 0)),
        "records_2025": int(year_counts.get(2025, 0))
    }

    for key, value in report.items():
        print(f"{key}: {value}")

    return report


def main():

    print("\nCITYMEMORY DATASET MERGING")
    print("=" * 60)

    if not INPUT_FILE.exists():
        print("Standardized dataset not found!")
        print(INPUT_FILE)
        return

    # Load standardized dataset
    df = pd.read_csv(
        INPUT_FILE,
        low_memory=False
    )

    print("\nRecords loaded:", len(df))

    # Run validation
    report = validate_dataset(df)

    # Do not silently delete potentially meaningful records.
    # Preserve all records and flag issues in the report.

    # Save validated master dataset
    master_file = OUTPUT_DIR / "citymemory_master_complaints.csv"

    df.to_csv(master_file, index=False)

    # Save validation report
    report_file = OUTPUT_DIR / "data_quality_report.csv"

    pd.DataFrame(
        [report]
    ).to_csv(report_file, index=False)

    print("\n" + "=" * 60)
    print("MERGING AND VALIDATION COMPLETED")
    print("=" * 60)

    print("Master dataset:", master_file)
    print("Quality report:", report_file)

    print("\nAll records preserved:", len(df))


if __name__ == "__main__":
    main()

