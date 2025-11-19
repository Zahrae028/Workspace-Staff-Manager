const addForm = document.getElementById('add-form')
const form = document.getElementById('form-div')
const darkDiv = document.getElementById("dark-div")
const freeStaffList = document.getElementById('free-staff-list')
const deleteBtn = document.getElementById('delete')
const assignRoomBtns = document.querySelectorAll('.plus')
const selectDiv = document.getElementById('select-div')
const staffSelect = document.getElementById('staff-select')
const staffSelectList = document.getElementById('staff-select-list')
const staffsToAssign = document.querySelectorAll('.select')
const closeBtn = document.getElementById('close')


const submit = document.getElementById('submit')

const fullNameError = document.getElementById('full-name-error')
const roleError = document.getElementById('role-error')
const emailError = document.getElementById("email-error")
const phoneNumError = document.getElementById('phone-error')
const experError = document.getElementById('experience-error')


const rooms = JSON.parse(localStorage.getItem("rooms")) || {
    "reception": {
        staff: [],
        roles: ["Receptionist", "Manager"]
    },
    "server-room": {
        staff: [],
        roles: ["IT Technician", "Manager"]
    },
    "security-room": {
        staff: [],
        roles: ["Security Officer", "Manager"]
    },
    "staff-room": {
        staff: [],
        roles: ["all"]
    },
    "conference-room": {
        staff: [],
        roles: ["all"]
    },
    "archives": {
        staff: [],
        roles: ["Manager"]
    },
    "free-staffs": {
        staff: [],
        roles: []
    }
};


closeBtn.addEventListener("click", (e) => {
    selectDiv.classList.toggle("invis")
    darkDiv.classList.toggle("overlay")
})
function displayAssign(assignRoom) {
    console.log('love')
    const roomToBe = document.querySelector(`.${assignRoom}`);
    roomToBe.innerHTML = ""
    for (let j = 0; j < rooms[assignRoom].staff.length; j++) {
        let li = document.createElement("li");



        li.classList.add("staff-container");
        for (let i = 0; i < allStaff.length; i++) {

            if (allStaff[i].id == rooms[assignRoom].staff[j]) {
                let li = document.createElement("li");
                li.classList.add("staff-container");
                li.id = allStaff[i].id

                li.innerHTML = `<img class="staff-pic" src="" alt="">
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




        console.log("hello")

        const staffsToAssign = document.querySelectorAll('.select')
        staffsToAssign.forEach(toAssign => {
            toAssign.addEventListener("click", (e) => {

                let roomDiv = document.getElementsByClassName(plusBtn.id)
                let roomArray = `${plusBtn.id}`
                rooms[roomArray].staff.push(Number(toAssign.dataset.id))

                let index = rooms["free-staffs"].staff.indexOf(Number(toAssign.dataset.id))
                rooms["free-staffs"].staff.splice(index, 1)

                console.log(Number(toAssign.dataset.id))
                let staff = allStaff.find(s => s.id === Number(toAssign.dataset.id))
                if (staff) staff.isAssigned = true

                displayAssign(plusBtn.id)
                console.log(`${plusBtn.id}`)
                // displayFreeStaffToAssign()
                localStorage.setItem("rooms", JSON.stringify(rooms));
                localStorage.setItem("allStaff", JSON.stringify(allStaff));
                selectDiv.classList.toggle("invis")
                darkDiv.classList.toggle("overlay")
                displayStaff()
            })

        })
    })

})


function displayFreeStaffToAssign() {
    staffSelectList.innerHTML = ""; // clear once at start

    rooms["free-staffs"].staff.forEach(staffId => {
        const staff = allStaff.find(s => s.id === staffId);
        if (!staff) return;

        const li = document.createElement("li");
        li.classList.add("staff-container");

        li.innerHTML = `<img class="staff-pic" src="" alt="">
                        <div>
                            <p>${staff.name}</p>
                            <p>${staff.role}</p>
                        </div>
                        <button class="select" data-id="${staff.id}">+</button>`;

        staffSelectList.appendChild(li);
    });
}

addForm.addEventListener('click', () => {


    form.classList.toggle("invis")
    darkDiv.classList.toggle("overlay")




});

const validationRules = {
    'full-name': {
        regex: /^[A-Za-z]+(?: [A-Za-z]+)+$/,
        message: "Enter your full name."
    },
    'role': {
        regex: /^[A-Za-z0-9 ,.-]{2,40}$/,
        message: "Enter a valid role."
    },
    'email': {
        regex: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
        message: "Enter a valid email."
    },
    'phone': {
        regex: /^\d{10}$/,
        message: "Enter a 10-digit phone number."
    },
};
// const fullNameRegex = /^[A-Za-z]+(?: [A-Za-z]+)+$/;
// const roleRegex = /^[A-Za-z0-9 ,.-]{2,40}$/;
// const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
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
    Object.keys(validationRules).forEach(field => {
        validation(field);
    });
    const fullName = document.getElementById("full-name").value
    const role = document.getElementById('role').value
    const email = document.getElementById("email").value
    const phoneNum = document.getElementById('phone').value
    const exper = document.getElementById('experience').value



    const newStaff = {
        id: Date.now(),
        name: fullName,
        role: role,
        email: email,
        phone: phoneNum,
        experience: exper,
        isAssigned: false,
        location: ""
    }
    Object.keys(validationRules).forEach(field => {
        validation(field);
    });
    // console.log("hello");

    if (isFormValid) {

        allStaff.push(newStaff);
        rooms["free-staffs"].staff.push(newStaff.id)
        localStorage.setItem("allStaff", JSON.stringify(allStaff));
        localStorage.setItem("rooms", JSON.stringify(rooms));

        form.classList.toggle("invis")
        darkDiv.classList.toggle("overlay")
    }

    console.log(allStaff[0].name)
    console.log(allStaff[0].id)
    displayStaff()
})

function displayStaff() {

    freeStaffList.innerHTML = ""
    console.log(rooms["free-staffs"].staff[0])


    for (let i = 0; i < allStaff.length; i++) {
        if (!allStaff[i].isAssigned) {


            let li = document.createElement("li");
            li.classList.add("staff-container");
            li.id = allStaff[i]

            li.innerHTML = `<img class="staff-pic" src="" alt="">
                        <div>
                            <p>${allStaff[i].name}</p>
                            <p>${allStaff[i].role}</p>
                        </div>
                        <button onclick="removeStaff(${allStaff[i].id})" class="delete">x</button>`;
            freeStaffList.appendChild(li);
        }
    }
    // displayAllAssigned()
    displayFreeStaffToAssign()

}

function removeStaff(id) {

    for (let i = 0; i < allStaff.length; i++) {
        if (allStaff[i].id === id) {
            allStaff.splice(i, 1);
            break;
        }
    }

    for (let room in rooms) {  // loop object keys
        let staffArray = rooms[room].staff;

        let index = staffArray.indexOf(id);
        if (index !== -1) {

            staffArray.splice(index, 1);
            displayAssign(room)
        }
    }


    localStorage.setItem("allStaff", JSON.stringify(allStaff));
    localStorage.setItem("rooms", JSON.stringify(rooms));
    displayStaff();
}
displayStaff()

function unassignStaff(staffId) {
    staffId = Number(staffId);


    for (let room in rooms) {
        let index = rooms[room].staff.indexOf(staffId);

        if (index !== -1) { 
            rooms[room].staff.splice(index, 1);
            break;
        }
    }


    rooms["free-staffs"].staff.push(staffId);

    let staff = allStaff.find(s => s.id === staffId);
    if (staff) staff.isAssigned = false;


    localStorage.setItem("allStaff", JSON.stringify(allStaff));
    localStorage.setItem("rooms", JSON.stringify(rooms));


    displayFreeStaffToAssign();
    displayStaff(); 
}

