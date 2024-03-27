const baseURL = "https://employee-management-66vi.onrender.com/";

async function fetchEmployees(page = 1) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${baseURL}dashboard?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    displayEmployees(data.employees);
    createPaginationButtons(data.totalPages, page);
  } catch (error) {
    console.error("Error:", error);
  }
}

function displayEmployees(employees) {
  const tableBody = document.getElementById("employeeTableBody");
  tableBody.innerHTML = "";
  employees.forEach((employee, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
              <td>${index + 1}</td>
              <td>${employee.firstName}</td>
              <td>${employee.lastName}</td>
              <td>${employee.email}</td>
              <td>${employee.department}</td>
              <td>${employee.hireDate}</td>
              <td>${employee.salary}</td>
              <td><button onclick="editEmployee('${employee._id}')">Edit</button>
              <button onclick="deleteEmployee('${employee._id}')">Delete</button></td>
              
          `;
    tableBody.appendChild(row);
  });
}

async function createPaginationButtons(totalPages, currentPage) {
  const paginationContainer =
    document.getElementById("paginationButtons");
  paginationContainer.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.classList.add("paginationButton");

    if (i === currentPage) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      fetchEmployees(i);
    });

    paginationContainer.appendChild(button);
  }
}

fetchEmployees();


async function searchEmployeesByName(firstName) {
    try {
        const token = localStorage.getItem("token");
        
        const response = await fetch(`${baseURL}dashboard/search?search=${firstName}`,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        const data = await response.json();
        displayEmployees(data.employees);
    } catch (error) {
        console.error("Error:", error);
    }
}

function searchEmployees() {
    const firstName = document.getElementById("searchInput").value;
    if (firstName.trim() !== "") {
        searchEmployeesByName(firstName);
    } else {
        fetchEmployees();
    }
}
async function filterEmployeesByDepartment(department) {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${baseURL}dashboard/filter?department=${department}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        displayEmployees(data.employees);
    } catch (error) {
        console.error("Error:", error);
    }
}

function filterEmployees() {
    const department = document.getElementById("departmentFilter").value;
    if (department !== "") {
        filterEmployeesByDepartment(department);
    } else {
        fetchEmployees();
    }
}
const departmentFilter = document.getElementById("departmentFilter");

departmentFilter.addEventListener("change", () => {
    filterEmployees();
});

async function sortEmployeesBySalary(sortOrder = "asc") {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${baseURL}dashboard/sort?sortOrder=${sortOrder}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        console.log(data)
        displayEmployees(data.employees);
        
        localStorage.setItem("sortOrder", data.sortOrder)
    } catch (error) {
        console.error("Error:", error);
    }
}

function toggleSortOrder() {
    const currentSortOrder = localStorage.getItem("sortOrder") || "asc";
    const newSortOrder = currentSortOrder === "asc" ? "desc" : "asc";
    localStorage.setItem("sortOrder", newSortOrder);
    sortEmployeesBySalary(newSortOrder);
}

toggleSortOrder();

function openAddEmployeeModal() {
    document.getElementById("addEmployeeModal").style.display = "block";
}

function closeAddEmployeeModal() {
    document.getElementById("addEmployeeModal").style.display = "none";
}

document.getElementById("addEmployeeForm").addEventListener("submit", async function(event) {
    event.preventDefault(); 

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const department = document.getElementById("department").value;
    const salary = document.getElementById("salary").value;

  
    const formData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        department: department,
        salary: salary
    };

    try {
        const response = await fetch(`${baseURL}dashboard/addEmployye`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(formData)
        });
        if (response.ok) {
            console.log("Employee added successfully");
            closeAddEmployeeModal();

            fetchEmployees();
        } else {
            console.error("Error:", response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    }
});


async function deleteEmployee(employeeId) {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${baseURL}dashboard/delete/${employeeId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            console.log(data.message);
            
            fetchEmployees();
        } else {
            console.error("Error:", data.message);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// Function to logout the user
function logout() {
    localStorage.removeItem("token");
  
    window.location.href = "/index.html"; 
}