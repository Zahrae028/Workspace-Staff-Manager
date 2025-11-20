const addForm = document.getElementById('add-form')
const form = document.getElementById('form-div')
const staffForm = document.getElementById('staff-form')
const darkDiv = document.getElementById("dark-div")
const freeStaffList = document.getElementById('free-staff-list')
const assignRoomBtns = document.querySelectorAll('.plus')
const selectDiv = document.getElementById('select-div')
const staffSelectList = document.getElementById('staff-select-list')
const closeBtn = document.getElementById('close')
const closeInfo = document.getElementById('close-info')
const picInput = document.getElementById("pic-input")
const showPic = document.getElementById("show-pic")
const addExp = document.getElementById('add-exp-btn')
const experiencesDiv = document.getElementById('experiences')
const moreInfoDiv = document.getElementById('more-info')
// const staffContainers = document.querySelectorAll('staff-container')

const rooms = JSON.parse(localStorage.getItem("rooms")) || {
    "reception": { staff: [], roles: ["Receptionist", "Manager"] },
    "server-room": { staff: [], roles: ["IT Technician", "Manager"] },
    "security-room": { staff: [], roles: ["Security Officer", "Manager"] },
    "staff-room": { staff: [], roles: ["all"] },
    "conference-room": { staff: [], roles: ["all"] },
    "archives": { staff: [], roles: ["Manager"] },
    "free-staffs": { staff: [], roles: [] }
};

let expCount = 1

picInput.addEventListener("change", () => {
    if (picInput.files.length > 0) {
        showPic.src = URL.createObjectURL(picInput.files[0]);
    }
});

addExp.addEventListener("click", (e) => {
    expCount++;
    const expDiv = document.createElement('div');
    expDiv.classList.add('experience-item');
    expDiv.dataset.experienceId = expCount;
    expDiv.innerHTML = `
      <div class="experience-grid">
        
        <label>Company</label>
        <input type="text" class="companyName" placeholder="Company name">
        <label>Role</label>
        <input type="text" class="roleCompany" placeholder="Role in company">
        <label>From</label>
        <input type="date" class="experienceFrom">
        <label>To</label>
        <input type="date" class="experienceTo">
      </div>
    `;
    experiencesDiv.appendChild(expDiv);
    expDiv.querySelector(".remove-experience").addEventListener("click", () => {
        expDiv.remove();
    });
});

closeBtn.addEventListener("click", (e) => {
    selectDiv.classList.toggle("invis")
    darkDiv.classList.toggle("overlay")
});

function displayAssign(assignRoom) {
    const roomToBe = document.querySelector(`.${assignRoom}`);
    if (!roomToBe) return;
    roomToBe.innerHTML = "";

    for (let j = 0; j < rooms[assignRoom].staff.length; j++) {
        for (let i = 0; i < allStaff.length; i++) {
            if (allStaff[i].id == rooms[assignRoom].staff[j]) {
                const li = document.createElement("li");
                li.classList.add("staff-container");
                li.id = allStaff[i].id;
                li.innerHTML = `<img class="staff-pic" src="${allStaff[i].photo}" alt="">
                                <div>
                                    <p>${allStaff[i].name}</p>
                                    <p>${allStaff[i].role}</p>
                                </div>
                                <button onclick="unassignStaff(${allStaff[i].id})" class="delete">-</button>`;
                roomToBe.appendChild(li);
            }
        }
    }
}


function displayAllAssigned() {
    for (let room in rooms) {
        displayAssign(room)
    }
}

assignRoomBtns.forEach(plusBtn => {
    plusBtn.addEventListener("click", (e) => {
        displayFreeStaffToAssign()
        selectDiv.classList.toggle("invis")
        darkDiv.classList.toggle("overlay")

        const staffsToAssign = document.querySelectorAll('.select')
        staffsToAssign.forEach(toAssign => {
            toAssign.addEventListener("click", (e) => {
                let staffId = Number(toAssign.dataset.id)
                let roomArray = plusBtn.id
                let staff = allStaff.find(s => s.id === staffId)

                // Check if the staff role matches the allowed roles in the room
                if (staff && (rooms[roomArray].roles.includes(staff.role) || rooms[roomArray].roles.includes("all"))) {
                    rooms[roomArray].staff.push(staffId)
                    let index = rooms["free-staffs"].staff.indexOf(staffId)
                    if (index !== -1) rooms["free-staffs"].staff.splice(index, 1)

                    staff.isAssigned = true
                    displayAssign(roomArray)
                    localStorage.setItem("rooms", JSON.stringify(rooms))
                    localStorage.setItem("allStaff", JSON.stringify(allStaff))
                    selectDiv.classList.toggle("invis")
                    darkDiv.classList.toggle("overlay")
                    displayStaff()
                } else {
                    alert(`Cannot assign ${staff.name} to this room: role mismatch.`)
                }
            })
        })
    })
    emptyZone("reception")
    emptyZone("server-room")
    emptyZone("security-room")
})


function displayFreeStaffToAssign() {
    staffSelectList.innerHTML = "";
    rooms["free-staffs"].staff.forEach(staffId => {
        const staff = allStaff.find(s => s.id === staffId);
        if (!staff) return;
        const li = document.createElement("li");
        li.classList.add("staff-container");
        li.innerHTML = `<img class="staff-pic" src="${staff.photo}" alt="">
                        <div>
                            <p>${staff.name}</p>
                            <p>${staff.role}</p>
                        </div>
                        <button class="select" data-id="${staff.id}">+</button>`;
        staffSelectList.appendChild(li);
        
    });
   emptyZone("reception")
    emptyZone("server-room")
    emptyZone("security-room")
}

addForm.addEventListener('click', () => {
    form.classList.toggle("invis")
    darkDiv.classList.toggle("overlay")
});

const validationRules = {
    'full-name': { regex: /^[A-Za-z]+(?: [A-Za-z]+)+$/, message: "Enter your full name." },
    'role': { regex: /^[A-Za-z0-9 ,.-]{2,40}$/, message: "Enter a valid role." },
    'email': { regex: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, message: "Enter a valid email." },
    'phone': { regex: /^\d{10}$/, message: "Enter a 10-digit phone number." },
};

let isFormValid;

function validation(field) {
    let elementText = document.getElementById(`${field}-error`);
    let element = document.getElementById(`${field}`);
    if (element.value.trim() == "") {
        elementText.textContent = "please fill the required infos";
        isFormValid = false;
    } else if (!validationRules[field].regex.test(element.value)) {
        elementText.textContent = validationRules[field].message;
        isFormValid = false;
    } else {
        elementText.textContent = "";
    }
}


const allStaff = JSON.parse(localStorage.getItem("allStaff")) || [];

submit.addEventListener('click', (e) => {
    e.preventDefault()
    isFormValid = true;
    Object.keys(validationRules).forEach(field => validation(field));
    const fullName = document.getElementById("full-name").value
    const role = document.getElementById('role').value
    const email = document.getElementById("email").value
    const phoneNum = document.getElementById('phone').value
    let photoURL = "";
    if (picInput.files && picInput.files[0]) photoURL = URL.createObjectURL(picInput.files[0]);
    const newStaff = { id: Date.now(), photo: photoURL, name: fullName, role: role, email: email, phone: phoneNum, experience: [], isAssigned: false, location: "" }
    const experienceItems = staffForm.querySelectorAll('.experience-item');
    experienceItems.forEach(expDiv => {
        newStaff.experience.push({
            company: expDiv.querySelector('.companyName').value,
            role: expDiv.querySelector('.roleCompany').value,
            from: expDiv.querySelector('.experienceFrom').value,
            to: expDiv.querySelector('.experienceTo').value
        });
    });
    if (isFormValid) {
        allStaff.push(newStaff);
        rooms["free-staffs"].staff.push(newStaff.id)
        localStorage.setItem("allStaff", JSON.stringify(allStaff));
        localStorage.setItem("rooms", JSON.stringify(rooms));
        form.classList.toggle("invis")
        darkDiv.classList.toggle("overlay")
    }
    displayStaff()
})

function displayStaff() {
    freeStaffList.innerHTML = ""
    for (let i = 0; i < allStaff.length; i++) {
        if (!allStaff[i].isAssigned) {
            let li = document.createElement("li");
            li.classList.add("staff-container");
            li.id = allStaff[i].id
            li.innerHTML = `<img class="staff-pic" src="${allStaff[i].photo}" alt="">
                        <div>
                            <p>${allStaff[i].name}</p>
                            <p>${allStaff[i].role}</p>
                        </div>
                        <button onclick="removeStaff(${allStaff[i].id})" class="delete">x</button>`;
            freeStaffList.appendChild(li);
        }
    }
    displayFreeStaffToAssign()
     emptyZone("reception")
    emptyZone("server-room")
    emptyZone("security-room")
}

function removeStaff(id) {
    for (let i = 0; i < allStaff.length; i++) {
        if (allStaff[i].id === id) { allStaff.splice(i, 1); break; }
    }
    for (let room in rooms) {
        let staffArray = rooms[room].staff;
        let index = staffArray.indexOf(id);
        if (index !== -1) {
            staffArray.splice(index, 1);
            displayAssign(room)
        }
    }
    displayStaff();
    localStorage.setItem("allStaff", JSON.stringify(allStaff));
    localStorage.setItem("rooms", JSON.stringify(rooms));
}

function unassignStaff(staffId) {
    staffId = Number(staffId);
    for (let room in rooms) {
        let index = rooms[room].staff.indexOf(staffId);
        if (index !== -1) { rooms[room].staff.splice(index, 1); break; }
    }
    rooms["free-staffs"].staff.push(staffId);
    let staff = allStaff.find(s => s.id === staffId);
    if (staff) staff.isAssigned = false;
    localStorage.setItem("allStaff", JSON.stringify(allStaff));
    localStorage.setItem("rooms", JSON.stringify(rooms));
    displayFreeStaffToAssign();
    displayStaff();
    displayAllAssigned()
    displayFreeStaffToAssign()
    emptyZone("reception")
    emptyZone("server-room")
    emptyZone("security-room")
}

displayStaff()

freeStaffList.addEventListener('click', (e) => {
    moreInfoDiv.classList.toggle('invis')
    darkDiv.classList.toggle("overlay")
    

    const staffCard = document.getElementById('staff-card');
    const staffName = document.getElementById('staff-name');
    const staffRole = document.getElementById('staff-role');
    const staffEmail = document.getElementById('staff-email');
    const staffPhone = document.getElementById('staff-phone');
    const staffExperience = document.getElementById('staff-experience');
    const staffPhoto = document.getElementById('staff-photo');

    const container = e.target.closest('.staff-container');

    if (container) {
        const staffId = Number(container.id);
        const staff = allStaff.find(s => s.id === staffId);

        if (staff) {
            staffName.textContent = staff.name;
            staffRole.textContent = staff.role;
            staffEmail.textContent = staff.email;
            staffPhone.textContent = staff.phone;
            staffPhoto.src = staff.photo;

            staffExperience.innerHTML = '';
            for (let i = 0; i < staff.experience.length; i++) {
                const exp = staff.experience[i];
                const expDiv = document.createElement('div');
                expDiv.textContent = `${exp.company} | ${exp.role} | ${exp.from} - ${exp.to}`;
                staffExperience.appendChild(expDiv);
            }

            staffCard.classList.remove('invis');
        }
    }
});
closeInfo.addEventListener("click", (e) => {
    moreInfoDiv.classList.toggle("invis")
    darkDiv.classList.toggle("overlay")
});

function emptyZone(room) {
    const roomDiv = document.querySelector(`.${room}-div`);
    if (rooms[room].staff.length === 0) {
        roomDiv.classList.add('empty');
    } else {
        roomDiv.classList.remove('empty');
    }
}

