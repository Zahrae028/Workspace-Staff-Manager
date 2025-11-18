const addForm = document.getElementById('add-form')
const form = document.getElementById('form-div')
const darkDiv = document.getElementById("dark-div")
const freeStaffList = document.getElementById('free-staff-list')

const submit = document.getElementById('submit')

const fullNameError = document.getElementById('full-name-error')
const roleError = document.getElementById('role-error')
const emailError = document.getElementById("email-error")
const phoneNumError = document.getElementById('phone-error')
const experError = document.getElementById('experience-error')









addForm.addEventListener('click', () => {

    console.log('hi')

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
    isFormValid = true;
    let elementText = document.getElementById(`${field}-error`)
    let element = document.getElementById(`${field}`)
    console.log(elementText.textContent)
    if (element.value == "") {
        elementText.textContent = "please fill the required infos"
        console.log(elementText.textContent)

        isFormValid = false

    } else if (!validationRules[field].regex.test(element.value)) {
        elementText.textContent = validationRules[field].message
        isFormValid = false
    } else {
        // console.log("it's full")
        elementText.textContent = ""
    }
}

const allStaff = JSON.parse(localStorage.getItem("allStaff")) || [];

submit.addEventListener('click', (e) => {
    e.preventDefault()

    Object.keys(validationRules).forEach(field => {
        validation(field);
    });
    const fullName = document.getElementById("full-name").value
    const role = document.getElementById('role').value
    const email = document.getElementById("email").value
    const phoneNum = document.getElementById('phone').value
    const exper = document.getElementById('experience').value



    const newStaff = {
        name: fullName,
        role: role,
        email: email,
        phone: phoneNum,
        experience: exper,
    }
    Object.keys(validationRules).forEach(field => {
        validation(field);
    });
    // console.log("hello");

    if (isFormValid) {

        allStaff.push(newStaff);
        localStorage.setItem("allStaff", JSON.stringify(allStaff));
    }

    console.log(allStaff[0].name)
    displayFreeStaff()
})

function displayFreeStaff() {

    freeStaffList.innerHTML = ""

    for (let i = 0; i < allStaff.length; i++) {
        let li = document.createElement("li");
        li.classList.add("staff-container");

        li.innerHTML = `<img class="staff-pic" src="" alt="">
                        <div>
                            <p>${allStaff[i].name}</p>
                            <p>${allStaff[i].role}</p>
                        </div>
                        <button class="delete">x</button>`;
        freeStaffList.appendChild(li);
        
    }
}
displayFreeStaff()