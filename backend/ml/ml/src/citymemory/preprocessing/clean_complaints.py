
import pandas as pd
from pathlib import Path

# =====================================================
# CITYMEMORY - COMPLAINT DATA CLEANING
# =====================================================

PROJECT_ROOT = Path(__file__).resolve().parents[3]

RAW_DIR = PROJECT_ROOT / "datasets" / "raw" / "grievances"
PROCESSED_DIR = PROJECT_ROOT / "datasets" / "processed" / "grievances"

PROCESSED_DIR.mkdir(parents=True, exist_ok=True)


# Columns required for complaint processing
REQUIRED_COLUMNS = [
    "Complaint ID",
    "Category",
    "Sub Category",
    "Grievance Date",
    "Ward Name",
    "Grievance Status",
    "Staff Remarks",
    "Staff Name"
]


def clean_text(value):
    """Clean whitespace without changing the meaning."""

    if pd.isna(value):
        return pd.NA

    value = str(value).strip()

    if value == "":
        return pd.NA

    return value


def clean_complaint_file(file_path):

    print("\n" + "=" * 60)
    print("CLEANING:", file_path.name)
    print("=" * 60)

    # Load original dataset
    df = pd.read_csv(file_path, low_memory=False)

    original_rows = len(df)

    # Validate columns
    missing_columns = set(REQUIRED_COLUMNS) - set(df.columns)

    if missing_columns:
        raise ValueError(
            f"Missing columns in {file_path.name}: {missing_columns}"
        )

    # Keep only required complaint columns
    df = df[REQUIRED_COLUMNS].copy()

    # Remove leading and trailing spaces from text fields
    text_columns = [
        "Category",
        "Sub Category",
        "Ward Name",
        "Grievance Status",
        "Staff Remarks",
        "Staff Name"
    ]

    for column in text_columns:
        df[column] = df[column].apply(clean_text)

    # Standardize complaint ID as string
    df["Complaint ID"] = (
        df["Complaint ID"]
        .astype("string")
        .str.strip()
    )

    # Parse grievance dates
    df["Grievance Date"] = pd.to_datetime(
        df["Grievance Date"],
        errors="coerce"
    )

    # Remove rows without a complaint ID
    df = df.dropna(subset=["Complaint ID"])

    # Remove exact duplicate rows
    df = df.drop_duplicates()

    # Save cleaned dataset
    output_file = PROCESSED_DIR / (
        file_path.stem + "_cleaned.csv"
    )

    df.to_csv(output_file, index=False)

    print("Original rows:", original_rows)
    print("Cleaned rows:", len(df))
    print("Removed rows:", original_rows - len(df))
    print("Missing dates:", df["Grievance Date"].isna().sum())
    print("Output:", output_file)

    return {
        "filename": file_path.name,
        "original_rows": original_rows,
        "cleaned_rows": len(df),
        "removed_rows": original_rows - len(df),
        "output_file": str(output_file)
    }


def main():

    print("\nCITYMEMORY COMPLAINT DATA CLEANING")
    print("=" * 60)

    if not RAW_DIR.exists():
        print("Grievance dataset folder not found:", RAW_DIR)
        return

    files = [
        RAW_DIR / "BBMP Grievances 2024.csv",
        RAW_DIR / "BBMP Grievances 2025.csv"
    ]

    results = []

    for file_path in files:

        if not file_path.exists():
            print("File not found:", file_path.name)
            continue

        result = clean_complaint_file(file_path)
        results.append(result)

    if results:

        report = pd.DataFrame(results)

        report_file = (
            PROCESSED_DIR / "cleaning_report.csv"
        )

        report.to_csv(report_file, index=False)

        print("\n" + "=" * 60)
        print("CLEANING COMPLETED")
        print("=" * 60)

        print(report.to_string(index=False))
        print("\nCleaning report saved:", report_file)


if __name__ == "__main__":
    main()
