
import pandas as pd
from pathlib import Path

# Project directories
PROJECT_ROOT = Path(__file__).resolve().parents[3]
RAW_DATA_DIR = PROJECT_ROOT / "datasets" / "raw"
REPORT_DIR = PROJECT_ROOT / "datasets" / "reports"

REPORT_DIR.mkdir(parents=True, exist_ok=True)


def inspect_csv(file_path):
    """Inspect one CSV dataset."""

    print("\n" + "=" * 70)
    print(f"DATASET: {file_path.name}")
    print("=" * 70)

    try:
        df = pd.read_csv(file_path, low_memory=False)

        print(f"\nRows: {df.shape[0]}")
        print(f"Columns: {df.shape[1]}")

        print("\nCOLUMN NAMES:")
        for column in df.columns:
            print(f"- {column}")

        print("\nDATA TYPES:")
        print(df.dtypes)

        print("\nMISSING VALUES:")
        print(df.isnull().sum())

        print("\nDUPLICATE ROWS:")
        print(df.duplicated().sum())

        print("\nSAMPLE RECORDS:")
        print(df.head(5).to_string())

        return {
            "filename": file_path.name,
            "rows": df.shape[0],
            "columns": df.shape[1],
            "duplicates": df.duplicated().sum(),
            "missing_values": int(df.isnull().sum().sum())
        }

    except Exception as error:
        print(f"Could not inspect {file_path.name}: {error}")
        return None


def main():
    print("\nCITYMEMORY DATASET INSPECTION")
    print("=" * 70)

    if not RAW_DATA_DIR.exists():
        print(f"Dataset folder not found: {RAW_DATA_DIR}")
        return

    csv_files = list(RAW_DATA_DIR.rglob("*.csv"))

    if not csv_files:
        print("No CSV files found. Check datasets/raw/")
        return

    results = []

    for file_path in csv_files:
        result = inspect_csv(file_path)

        if result:
            results.append(result)

    if results:
        report = pd.DataFrame(results)

        output_path = REPORT_DIR / "dataset_inspection_report.csv"
        report.to_csv(output_path, index=False)

        print("\n" + "=" * 70)
        print("INSPECTION COMPLETED")
        print("=" * 70)

        print(report.to_string(index=False))
        print(f"\nReport saved to: {output_path}")


if __name__ == "__main__":
    main()
