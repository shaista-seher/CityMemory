
from pathlib import Path

# =====================================================
# CITYMEMORY DATASET FIELD MAPPING
# Maps original BBMP dataset columns to common names.
# =====================================================

DATASET_MAPPINGS = {

    # -------------------------------------------------
    # 1. BBMP GRIEVANCES 2024 AND 2025
    # -------------------------------------------------

    "grievances": {
        "files": [
            "BBMP Grievances 2024.csv",
            "BBMP Grievances 2025.csv"
        ],

        "columns": {
            "Complaint ID": "complaint_id",
            "Category": "category",
            "Sub Category": "subcategory",
            "Grievance Date": "reported_at",
            "Ward Name": "ward_name",
            "Grievance Status": "status",
            "Staff Remarks": "staff_remarks",
            "Staff Name": "staff_name"
        },

        "unique_key": "complaint_id"
    },

    # -------------------------------------------------
    # 2. BBMP FIX MY STREET AGGREGATED DATA
    # -------------------------------------------------

    "fix_my_street_aggregated": {
        "files": [
            "BBMP Fix My Street Aggregated - May and June 2022.csv"
        ],

        "columns": {
            "Ward #": "ward_number",
            "Ward Name": "ward_name",
            "Constituency": "constituency",
            "Complaints": "complaints",
            "Constituency Level": "constituency_level",
            "Complaint Count": "complaint_count"
        },

        "unique_key": None
    },

    # -------------------------------------------------
    # 3. BBMP ROAD REPAIR 2017
    # -------------------------------------------------

    "road_repairs": {
        "files": [
            "BBMP Road Repair data (2017).csv"
        ],

        "columns": {
            "Sl. No .": "serial_number",
            "Name of the road": "road_name",
            "Length of the road (in. Kms.)": "road_length_km",
            "Date of Completion of work": "completion_date",
            "DLP/ Maintenance period": "maintenance_period",
            "Completion of DLP Date": "maintenance_end_date",
            "Name of the Agency": "agency",
            "BBMP Divison": "bbmp_division",
            "Name of the Executive Engineer & Contact No": "executive_engineer",
            "Name of the Assistant Executive Engineer & Contact No": "assistant_executive_engineer",
            "Name of the Assistant Engineer & Contact No": "assistant_engineer"
        },

        "unique_key": "serial_number"
    },

    # -------------------------------------------------
    # 4. WARD WORK ORDERS
    # All five files share the same column structure.
    # -------------------------------------------------

    "work_orders": {
        "files": [
            "Work Orders for Atturu(Num-3) WardCSV.csv",
            "Work Orders for Chowdeswari Ward(Num-2) WardCSV.csv",
            "Work Orders for Jakkuru(Num-5) WardCSV.csv",
            "Work Orders for Kempegowda Ward(Num-1) WardCSV.csv",
            "Work Orders for Yelahanka Satellite Town(Num-4) WardCSV.csv"
        ],

        "columns": {
            "Sl No": "serial_number",
            "Job Number": "job_number",
            "Start Date": "start_date",
            "End Date": "end_date",
            "Name of Work": "work_description",
            "Ward": "ward_name",
            "Office": "office",
            "Budget Head": "budget_head",
            "Contractor": "contractor",
            "Mobile": "contractor_mobile",
            "Email": "contractor_email",
            "Bill Type": "bill_type",
            "Order Number": "order_number",
            "Order Date": "order_date",
            "SBR Number": "sbr_number",
            "SBR Date": "sbr_date",
            "BR Number": "br_number",
            "BR Date": "br_date",
            "CBR Number": "cbr_number",
            "CBR Date": "cbr_date",
            "Payment": "payment_status",
            "Gross": "gross_amount",
            "Deduction": "deduction_amount",
            "Nett": "net_amount"
        },

        "unique_key": "job_number"
    }
}


# =====================================================
# FUNCTION 1: GET MAPPING FOR A DATASET
# =====================================================

def get_dataset_mapping(dataset_name):

    if dataset_name not in DATASET_MAPPINGS:
        raise ValueError(
            f"Unknown dataset: {dataset_name}"
        )

    return DATASET_MAPPINGS[dataset_name]["columns"]


# =====================================================
# FUNCTION 2: GET ALL EXPECTED FILES
# =====================================================

def get_expected_files():

    files = []

    for dataset in DATASET_MAPPINGS.values():
        files.extend(dataset["files"])

    return files


# =====================================================
# FUNCTION 3: VALIDATE DATASET COLUMNS
# =====================================================

def validate_columns(dataset_name, actual_columns):

    expected_mapping = get_dataset_mapping(dataset_name)

    expected_columns = set(expected_mapping.keys())
    actual_columns = set(actual_columns)

    missing_columns = expected_columns - actual_columns
    extra_columns = actual_columns - expected_columns

    return {
        "dataset": dataset_name,
        "valid": len(missing_columns) == 0,
        "missing_columns": sorted(missing_columns),
        "extra_columns": sorted(extra_columns)
    }


# =====================================================
# FUNCTION 4: GET DATASET UNIQUE KEY
# =====================================================

def get_unique_key(dataset_name):

    if dataset_name not in DATASET_MAPPINGS:
        raise ValueError(
            f"Unknown dataset: {dataset_name}"
        )

    return DATASET_MAPPINGS[dataset_name]["unique_key"]


# =====================================================
# TEST THE MAPPING
# =====================================================

if __name__ == "__main__":

    print("\nCITYMEMORY DATASET MAPPING")
    print("=" * 60)

    for dataset_name, details in DATASET_MAPPINGS.items():

        print(f"\nDataset: {dataset_name}")
        print("-" * 60)

        for original, standard in details["columns"].items():
            print(f"{original}  -->  {standard}")

        print(
            "\nUnique key:",
            details["unique_key"]
        )

    print("\nTotal expected CSV files:",
          len(get_expected_files()))

    print("\nMAPPING DEFINITION COMPLETED")
