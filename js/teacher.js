const teachRow = document.querySelector(".teach-row");
const teachSearchInput = document.querySelector(".search-input");
const teacherCount = document.querySelector(".teachers-count");
const pagination = document.querySelector(".pagination");
const teacherForm = document.querySelector(".teacher-form");
const teacherModal = document.querySelector("#teacher-modal");
const addSaveTeacherBtn = document.querySelector("#save-btn");
const addTeachBtn = document.querySelector("#add-teacher-btn");
const teachMarriedFilter = document.querySelector(".teach-merried-filter");
console.log(teachMarriedFilter);

let search = "";
let selected = null;
let activePage = 1;
let married;
let selectedValue = null;
function getTeachCard({
  id,
  firstName,
  lastName,
  email,
  groups,
  avatar,
  isMarried,
  phoneNumber,
}) {
  return `
    <div class="col-12 col-md-6 col-lg-4">
      <div class="bg-black shadow-xl teachCard group mb-5">
        <img
          src="${avatar}"
          alt=""
          class="object-cover w-full duration-500 hover:scale-105 hover:rounded-lg h-[367px] img-fluid"
        />
  
        <div class="px-4 py-3 cardBody">
          <div class="flex gap-2 items-center mb-3">
            <p class="text-base text-yellow-300 font-titleText">
              ${firstName},
            </p>
  
            <p class="text-base font-titleText text-yellow-300">${lastName}</p>
          </div>
  
          <p class="text-base text-white font-beaText">${email}</p>
          <div class=" my-3">
            <p class="text-sm text-yellow-500 font-beaText mb-3 font-bold">
  
              Groups: <span class="text-white text-sm">${groups}</span>
            </p>
            <p class="text-sm text-yellow-500 font-beaText">
              isMarried: <span class="text-white text-sm">${
                isMarried ? "Oilali" : "Nikohda bo'lmagan"
              }</span>
            </p>
          </div>
          <a href="tel:${phoneNumber}" class="text-sm font-bold text-yellow-500">
            Phone: <span class="text-base text-white">${phoneNumber}</span>
          </a>
          <div class="flex justify-between gap-3 mt-3">
            <a href="students.html?teachers=${id}" class="text-xs neo-btn">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              Students
            </a>
            <a href="#!" id="${id}" data-bs-toggle="modal"
            data-bs-target="#teacher-modal" class="text-xs neo-btn  edit-btn">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              Edit
            </a>
            <a href="#!" id="${id}" class="text-xs neo-btn delete-btn">
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

// Get teachers api
async function getTeachers() {
  try {
    teachRow.innerHTML = ` <div class="lds-hourglass"></div>`;
    let params = { firstName: search };
    let paramsWithPagination = {
      firstName: search,
      page: activePage,
      limit: LIMIT,
      isMarried: married,
    };
    let { data } = await request.get(`teachers`, { params });
    // pagination
    let { data: dataWithPagination } = await request.get("teachers", {
      params: paramsWithPagination,
    });

    let pages = Math.ceil(data.length / LIMIT);

    pagination.innerHTML = `<li class="page-item ${
      activePage === 1 ? "disabled" : ""
    }">
       <button page="-" class="page-link">Previous</button>
     </li>`;

    for (let i = 1; i <= pages; i++) {
      pagination.innerHTML += `
         <li class="page-item ${
           i === activePage ? "active" : "bg-transparent"
         }"><button page="${i}" class="page-link">${i}</button></li>
       `;
    }
    pagination.innerHTML += `<li class="page-item ${
      activePage === pages ? "disabled" : ""
    }">
       <button page="+" class="page-link">Next</button>
     </li>`;

     teachRow.innerHTML = "";
    teacherCount.textContent = data.length;
    dataWithPagination.map((teach) => {
      teachRow.innerHTML += getTeachCard(teach);
    });
  } catch (err) {
    console.log(err);
  }
}

getTeachers();

// Search
teachSearchInput.addEventListener("keyup", function () {
  search = this.value;
  activePage = 1;
  getTeachers();
});

// Pagination
pagination.addEventListener("click", (e) => {
  let page = e.target.getAttribute("page");
  if (page !== null) {
    if (page === "+") {
      activePage++;
    } else if (page === "-") {
      activePage--;
    } else {
      activePage = +page;
    }
    getTeachers();
  }
});

// Form
teacherForm.addEventListener("submit", async function (e) {
  e.preventDefault(e);
  let teachData = {
    firstName: this.firstName.value,
    lastName: this.lastName.value,
    avatar: this.avatar.value,
    group: this.group.value,
    phoneNumber: this.phoneNumber.value,
    email: this.email.value,
    isMarried: this.isMarried.checked,
  };
  if (selected === null) {
    await request.post("teachers", teachData);
  } else {
    await request.put(`teachers/${selected}`, teachData);
  }
  getTeachers();
  bootstrap.Modal.getInstance(teacherModal).hide();
});

//
addTeachBtn.addEventListener("click", () => {
  selected = null;
  teacherForm.firstName.value = "";
  teacherForm.lastName.value = "";
  teacherForm.avatar.value = "";
  teacherForm.group.value = "";
  teacherForm.phoneNumber.value = "";
  teacherForm.email.value = "";
  (teacherForm.isMarried.checked = ""),
    (addSaveTeacherBtn.textContent = "Add Teacher");
});
// Edit && Delete
window.addEventListener("click", async (e) => {
  let id = e.target.getAttribute("id");
  let checkEdit = e.target.classList.contains("edit-btn");
  if (checkEdit) {
    selected = id;
    let { data } = await request.get(`teachers/${id}`);
    teacherForm.firstName.value = data.firstName;
    teacherForm.lastName.value = data.lastName;
    teacherForm.avatar.value = data.avatar;
    teacherForm.group.value = data.group;
    teacherForm.phoneNumber.value = data.phoneNumber;
    teacherForm.email.value = data.email;
    teacherForm.isMarried.checked = data.isMarried;
    addSaveTeacherBtn.textContent = "Save Teach";
  }

  let checkDelete = e.target.classList.contains("delete-btn");
  if (checkDelete) {
    let deleteConfirm = confirm("Do you want to delete this teacher?");
    if (deleteConfirm) {
      await request.delete(`teachers/${id}`);
      getTeachers();
    }
  }
});

// teacher married filter start here

teachMarriedFilter.addEventListener("change", function () {
  married = this.value;
  console.log(married);
  getTeachers();
});
