const API = "/api/students";

const form = document.getElementById("studentForm");
const table = document.getElementById("studentTable");
const message = document.getElementById("message");

let students = [];

function showMessage(text) {
    message.textContent = text;
}

// Display Students
async function loadStudents() {
    try {
        const response = await fetch(API);
        if (!response.ok) throw new Error("Failed to load students");

        students = await response.json();
        table.innerHTML = "";

        students.forEach(student => {
            const row = document.createElement("tr");

            [
                student.studentId,
                student.name,
                student.email,
                student.department,
                student.course,
                student.semester,
                student.marks,
                student.grade
            ].forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            const actions = document.createElement("td");

            const edit = document.createElement("button");
            edit.textContent = "Edit";
            edit.className = "edit";
            edit.onclick = () => editStudent(student._id);

            const del = document.createElement("button");
            del.textContent = "Delete";
            del.className = "delete";
            del.onclick = () => deleteStudent(student._id);

            actions.append(edit, del);
            row.appendChild(actions);
            table.appendChild(row);
        });

    } catch (err) {
        showMessage(err.message);
    }
}

// Add and Update Student
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("editId").value;

    const student = {
        studentId: document.getElementById("studentId").value,
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        department: document.getElementById("department").value,
        course: document.getElementById("course").value,
        semester: Number(document.getElementById("semester").value),
        marks: Number(document.getElementById("marks").value),
        grade: document.getElementById("grade").value
    };

    try {
        const response = await fetch(
            id ? `${API}/${id}` : API,
            {
                method: id ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(student)
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Operation failed");
        }

        showMessage(id ? "Student updated successfully!" :
            "Student added successfully!");

        form.reset();
        document.getElementById("editId").value = "";
        document.getElementById("submitBtn").textContent = "Add Student";

        loadStudents();

    } catch (err) {
        showMessage(err.message);
    }
});

// Edit Student
function editStudent(id) {
    const student = students.find(s => s._id === id);

    if (!student) return;

    document.getElementById("editId").value = student._id;
    document.getElementById("studentId").value = student.studentId;
    document.getElementById("name").value = student.name;
    document.getElementById("email").value = student.email;
    document.getElementById("department").value = student.department;
    document.getElementById("course").value = student.course;
    document.getElementById("semester").value = student.semester;
    document.getElementById("marks").value = student.marks;
    document.getElementById("grade").value = student.grade;

    document.getElementById("submitBtn").textContent = "Update Student";
}

// Delete Student
async function deleteStudent(id) {
    if (!confirm("Do you want to delete this student?")) return;

    try {
        const response = await fetch(`${API}/${id}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Delete failed");
        }

        showMessage("Student deleted successfully!");
        loadStudents();

    } catch (err) {
        showMessage(err.message);
    }
}

// Initial Loading
loadStudents();