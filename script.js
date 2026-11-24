// ====== JsonPowerDB configuration (replace with your own token) ======
const JPDB_BASE_URL = "https://api.login2explore.com:5577";
const JPDB_IML = "/api/iml";   // insert / update
const JPDB_IRL = "/api/irl";   // read
const CONNECTION_TOKEN = "YOUR  CONNECTION TOKEN";
const DB_NAME = "SCHOOL-DB";
const REL_NAME = "STUDENT-TABLE";
// =====================================================================

const $ = (id) => document.getElementById(id);
const OTHER_FIELDS = ["fullName", "stuClass", "birthDate", "address", "enrollDate"];

function showMsg(text) { $("msg").textContent = text; }

async function executeCommand(reqBody, endpoint) {
    const res = await fetch(JPDB_BASE_URL + endpoint, {
        method: "POST",
        // A "simple" content type avoids the CORS preflight request, which JPDB does not answer
        headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: JSON.stringify(reqBody)
    });
    return res.json();
}

// Step 2: empty form, cursor in primary key, everything else disabled
function resetForm() {
    $("rollNo").value = "";
    OTHER_FIELDS.forEach((id) => { $(id).value = ""; $(id).disabled = true; });
    $("rollNo").disabled = false;
    ["save", "update", "reset"].forEach((id) => ($(id).disabled = true));
    $("rollNo").focus();
}

function enableOtherFields() {
    OTHER_FIELDS.forEach((id) => ($(id).disabled = false));
}

function saveRecNo(resp) {
    localStorage.setItem("recno", JSON.parse(resp.data).rec_no);
}

function fillData(resp) {
    saveRecNo(resp);
    const rec = JSON.parse(resp.data).record;
    $("fullName").value = rec.fullName;
    $("stuClass").value = rec.stuClass;
    $("birthDate").value = rec.birthDate;
    $("address").value = rec.address;
    $("enrollDate").value = rec.enrollDate;
}

// Returns the record object, or null if any field is empty
function validateAndGetFormData() {
    const labels = {
        rollNo: "Roll-No", fullName: "Full-Name", stuClass: "Class",
        birthDate: "Birth-Date", address: "Address", enrollDate: "Enrollment-Date"
    };
    const rec = {};
    for (const id of ["rollNo", ...OTHER_FIELDS]) {
        const val = $(id).value.trim();
        if (!val) {
            alert(labels[id] + " is required");
            $(id).focus();
            return null;
        }
        rec[id] = val;
    }
    return rec;
}

// Step 3: check primary key when user leaves the Roll-No field
async function checkRollNo() {
    const roll = $("rollNo").value.trim();
    if (!roll) return;
    const req = {
        token: CONNECTION_TOKEN,
        cmd: "GET_BY_KEY",
        dbName: DB_NAME,
        rel: REL_NAME,
        jsonStr: { rollNo: roll }
    };
    try {
        const resp = await executeCommand(req, JPDB_IRL);
        if (resp.status !== 200 && resp.status !== 400) {
            // e.g. invalid token or database error - don't treat as a new student
            showMsg("JsonPowerDB error: " + (resp.message || "status " + resp.status));
            return;
        }
        $("rollNo").disabled = true;
        enableOtherFields();
        $("reset").disabled = false;
        if (resp.status === 200) {
            fillData(resp);
            $("update").disabled = false;
            showMsg("Student found. Edit details and click Update.");
        } else {
            $("save").disabled = false;
            showMsg("New student. Enter details and click Save.");
        }
        $("fullName").focus();
    } catch (e) {
        showMsg("Network error: " + e.message);
    }
}

async function saveData() {
    const rec = validateAndGetFormData();
    if (!rec) return;
    const req = {
        token: CONNECTION_TOKEN,
        cmd: "PUT",
        dbName: DB_NAME,
        rel: REL_NAME,
        jsonStr: rec
    };
    try {
        await executeCommand(req, JPDB_IML);
        resetForm();
        showMsg("Record saved.");
    } catch (e) {
        showMsg("Network error: " + e.message);
    }
}

async function updateData() {
    const rec = validateAndGetFormData();
    if (!rec) return;
    const req = {
        token: CONNECTION_TOKEN,
        cmd: "UPDATE",
        dbName: DB_NAME,
        rel: REL_NAME,
        jsonStr: { [localStorage.getItem("recno")]: rec }
    };
    try {
        await executeCommand(req, JPDB_IML);
        resetForm();
        showMsg("Record updated.");
    } catch (e) {
        showMsg("Network error: " + e.message);
    }
}

$("rollNo").addEventListener("change", checkRollNo);
$("save").addEventListener("click", saveData);
$("update").addEventListener("click", updateData);
$("reset").addEventListener("click", () => { resetForm(); showMsg(""); });
resetForm();