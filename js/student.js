const studentsAdd = new URLSearchParams(location.search);
const teacherId = studentsAdd.get("teachers");
const studentRow = document.querySelector(".student-row");
const studentCount = document.querySelector(".student-count");
const studentForm = document.querySelector(".student-form");
const studentModal = document.querySelector("#student-modal");
const addSaveStudentBtn = document.querySelector("#save-btn");
const addStudentBtn = document.querySelector("#add-student-btn");
const studentSearchInput = document.querySelector(".student-search-input");

let selected = null;
let stSearch = "";
function getStudentsCard({
  firstName,
  avatar,
  lastName,
  isWork,
  isMarried,
  email,
  field,
  phoneNumber,
  birthday,
  teacherId,
  id,
}) {
  return `

    <div class="mb-5 bg-black shadow-xl studentCard group">
    
      <div class="flex gap-3 items-center mb-3">
      <img
      src="${avatar}"
      alt=""
      class="object-cover duration-500 hover:scale-105 hover:rounded-lg h-[200px] w-44"
    />
     <div class="flex gap-2"> 
     <p class="text-base text-yellow-300 font-titleText">
     ${firstName},
   </p>

   <p class="text-base text-yellow-300 font-titleText">${lastName}</p>
     </div>
    </div>



      <div class="px-4 py-3 cardBody">
        

        <p class="text-base text-white font-beaText">${email}</p>
        <p class="text-base text-white font-beaText">${field}</p>
     
        <div class="flex items-center justify-between my-3">
          <p class="text-sm text-yellow-500 font-beaText">
            isWork: <span class="text-sm text-white">${
              isWork ? "Yes of Course" : "No he is'nt"
            }</span>
          </p>
          <p class="text-sm text-yellow-500 font-beaText">
            isMarried: <span class="text-sm text-white">${
              isMarried ? "Oilali" : "Nikohda bo'lmagan"
            }</span>
          </p>
          <p class="text-sm text-yellow-500 font-beaText flex flex-col">
          birthDay: <span class="text-sm text-white">${birthday}</span>
        </p>

        </div>
        <a href="tel:${phoneNumber}" class="text-sm font-bold text-yellow-500">
          Phone: <span class="text-base text-white">${phoneNumber}</span>
        </a>
        <div class="flex justify-between gap-3 mt-3">
          <a href="index.html" class="text-xs neo-btn">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Teachers
          </a>
          <a href="#!"
          data-bs-toggle="modal"
          data-bs-target="#student-modal" id="${
            (teacherId, id)
          }" class="text-xs neo-btn edit-btn">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Edit
          </a>
          <a href="#!" id="${
            (teacherId, id)
          }" class="text-xs neo-btn delete-btn">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Delete
          </a>
        </div>
      </div>
    </div>
  </div>
    
    `;
}

async function getStudents() {
  try {
    studentRow.innerHTML = ` <div class="lds-hourglass"></div>`;
    let params = { firstName: stSearch };
    let res = await axiosStudents(`${teacherId}/students`, { params });

    studentCount.textContent = res.data.length;
    studentRow.innerHTML = "";
    studentRow.innerHTML = "";
    res.data.map((student) => {
      studentRow.innerHTML += getStudentsCard(student);
    });
  } catch (err) {
    console.log(err);
  }
}

getStudents();

// Search
studentSearchInput.addEventListener("keyup", function () {
  stSearch = this.value;
  getStudents();
});

// Student Form
studentForm.addEventListener("submit", async function (e) {
  e.preventDefault(e);
  let studentData = {
    firstName: this.firstName.value,
    lastName: this.lastName.value,
    email: this.email.value,
    avatar: this.avatar.value,
    phoneNumber: this.phoneNumber.value,
    isWork: this.isWork.checked,
    isMarried: this.isMarried.checked,
    birthday: this.birthday.value,
    field: this.field.value,
  };
  if (selected === null) {
    await axiosStudents.post(`${teacherId}/students`, studentData);
  } else {
    await axiosStudents.put(`${teacherId}/students/${selected}`, studentData);
  }
  getStudents();
  bootstrap.Modal.getInstance(studentModal).hide();
});

addStudentBtn.addEventListener("click", () => {
  selected = null;
  studentForm.firstName.value = "";
  studentForm.lastName.value = "";
  studentForm.email.value = "";
  studentForm.avatar.value = "";
  studentForm.phoneNumber.value = "";
  studentForm.isWork.checked = "";
  studentForm.isMarried.checked = "",
  studentForm.birthday.value = "",
  studentForm.field.value = "",
  addSaveStudentBtn.innerHTML = "Add Student";
});

// student form edit && delete
window.addEventListener("click", async (e) => {
  let id = e.target.getAttribute("id");

  let checkEdit = e.target.classList.contains("edit-btn");
  if (checkEdit) {
    selected = id;
    let { data } = await axiosStudents(`${teacherId}/students/${selected}`);
    console.log(data);
    studentForm.firstName.value = data.firstName;
    studentForm.lastName.value = data.lastName;
    studentForm.email.value = data.email;
    studentForm.avatar.value = data.avatar;
    studentForm.phoneNumber.value = data.phoneNumber;
    studentForm.isWork.checked = data.isWork;
    studentForm.isMarried.checked = data.isMarried;
    studentForm.birthday.value = data.birthday;
    studentForm.field.value = data.field;
    addSaveStudentBtn.innerHTML = "Save Student";
  }

  let checkDelete = e.target.classList.contains("delete-btn");
  if (checkDelete) {
    let deleteConfirm = confirm("Do you want to delete this teacher?");
    if (deleteConfirm) {
      await axiosStudents.delete(`${teacherId}/students/${id}
      `);
      getStudents();
    }
  }
});
