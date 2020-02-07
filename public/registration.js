console.log("REGISTRATION")
let formValidate = false;
let count_click = 0;
const firstname = document.querySelector('#fname'),
    lastname = document.querySelector('#lname'),
    id_number = document.querySelector('#id_number'),
    email = document.querySelector('#email'),
    password = document.querySelector('#password'),
    password2 = document.querySelector('#password2'),
    department = document.querySelector('#department'),
    profession = document.querySelector('#profession');
if (!formValidate || count_click <= 0) {
    document.querySelector('#reg-button').style.backgroundColor = "#ff7730"
    document.querySelector('#reg-button').disabled = true;
}


let fname_count = 1,
    lname_count = 1,
    email_count = 1,
    id_num_count = 1,
    pass_count = 1,
    pass2_count = 1,
    department_count = 1,
    profession_count = 1;



firstname.addEventListener('keyup', e => {
    if (fname_count == 1) {
        count_click++;
        fname_count++;
    }
    const fname = firstname.value;

    if (!fname.match((/^[A-Za-z ]+$/))) {
        firstname.style.borderBottom = "3px solid #ff7730";
        formValidate = false;
    } else {
        firstname.style.borderBottom = "3px solid #55c57a";
        formValidate = true;
    }
    submitEnable();
});
lastname.addEventListener('keyup', e => {
    const lname = lastname.value;
    if (lname_count == 1) {
        count_click++;
        lname_count++;
    }
    if (!lname.match((/^[A-Za-z ]+$/))) {
        lastname.style.borderBottom = "3px solid #ff7730";
        formValidate = false;
    } else {
        lastname.style.borderBottom = "3px solid #55c57a";
        formValidate = true;
    }
    submitEnable();
});
email.addEventListener('keyup', e => {
    const em = email.value;
    if (email_count == 1) {
        count_click++;
        email_count++;
    }
    if (!em.match((/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))) {
        email.style.borderBottom = "3px solid #ff7730";
        formValidate = false;
    } else {
        email.style.borderBottom = "3px solid #55c57a";
        formValidate = true;
    }
    submitEnable();
});
id_number.addEventListener('keyup', e => {
    const id = id_number.value;
    if (id_num_count == 1) {
        count_click++;
        id_num_count++;
    }
    if (!id.match((/^[0-9]+$/))) {
        id_number.style.borderBottom = "3px solid #ff7730";
        formValidate = false;
    } else {
        id_number.style.borderBottom = "3px solid #55c57a";
        formValidate = true;
    }
    submitEnable();
});
password.addEventListener('keyup', e => {
    const pass = password.value;
    if (pass_count == 1) {
        count_click++;
        pass_count++;
    }
    if (!pass.match((/^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/))) {
        password.style.borderBottom = "3px solid #ff7730";
        formValidate = false;
    } else {
        password.style.borderBottom = "3px solid #55c57a";
        formValidate = true;
    }
    submitEnable();
});
password2.addEventListener('keyup', e => {
    const pass = password2.value;
    if (pass2_count == 1) {
        count_click++;
        pass2_count++;
    }
    if (!pass.match(password.value)) {
        password2.style.borderBottom = "3px solid #ff7730";
        formValidate = false;
    } else {
        password2.style.borderBottom = "3px solid #55c57a";
        formValidate = true;
    }
    submitEnable();
});
department.addEventListener('click', () => {
    if (department.value != "Department") {
        console.log(e.target.value)
        department.style.borderBottom = "3px solid #55c57a";
        submitEnable();
    } else {
        department.style.borderBottom = "3px solid #ff7730";
    }
});
profession.addEventListener('click', () => {
    if (profession.value != "Profession") {
        console.log(e.target.value)
        profession.style.borderBottom = "3px solid #55c57a";
        submitEnable();
    } else {
        profession.style.borderBottom = "3px solid #ff7730";
    }
})
department.addEventListener('change', (e) => {
    if (e.target.value != "Department") {
        console.log(e.target.value)
        department.style.borderBottom = "3px solid #55c57a";
        submitEnable();
    } else {
        department.style.borderBottom = "3px solid #ff7730";
    }
});

profession.addEventListener('change', (e) => {
    if (e.target.value != "Profession") {
        console.log(e.target.value)
        profession.style.borderBottom = "3px solid #55c57a";
        submitEnable();
    } else {
        profession.style.borderBottom = "3px solid #ff7730";
    }
});


function submitEnable() {
    if (formValidate && count_click >= 6 && department.value != "Department" && profession.value != "Profession") {
        department
        document.querySelector('#reg-button').style.backgroundColor = "#55c57a"
        document.querySelector('#reg-button').disabled = false;
    } else {
        document.querySelector('#reg-button').style.backgroundColor = "#ff7730"

        document.querySelector('#reg-button').disabled = true;
    }
}