if (document.querySelector('.errormsg')) {
    const errormsg = document.querySelector('.errormsg');

    setTimeout(() => {
        errormsg.style.display = 'none'
    }, 3000);
}

// let formValidate = false;
// let count_click = 0;
// const firstname = document.querySelector('#fname'),
//     lastname = document.querySelector('#lname'),
//     id_number = document.querySelector('#id_number'),
//     email = document.querySelector('#email'),
//     password = document.querySelector('#password'),
//     password2 = document.querySelector('#password2'),
//     department = document.querySelector('#department'),
//     profession = document.querySelector('#profession');
// if (!formValidate || count_click <= 0) {
//     document.querySelector('#reg-button').disabled = true;
// }


// let fname_count = 1,
//     lname_count = 1,
//     email_count = 1,
//     id_num_count = 1,
//     pass_count = 1,
//     pass2_count = 1,
//     department_count = 1,
//     profession_count = 1;



// firstname.addEventListener('keyup', e => {
//     if (fname_count == 1) {
//         count_click++;
//         fname_count++;
//     }
//     const fname = firstname.value;

//     if (!fname.match((/^[A-Za-z]+$/))) {
//         firstname.style.borderBottom = "1px solid red";
//         formValidate = false;
//     } else {
//         firstname.style.border = "none";
//         formValidate = true;
//     }
//     submitEnable();
// });
// lastname.addEventListener('keyup', e => {
//     const lname = lastname.value;
//     if (lname_count == 1) {
//         count_click++;
//         lname_count++;
//     }
//     if (!lname.match((/^[A-Za-z]+$/))) {
//         lastname.style.border = "1px solid red";
//         formValidate = false;
//     } else {
//         lastname.style.borderBottom = "none";
//         formValidate = true;
//     }
//     submitEnable();
// });
// email.addEventListener('keyup', e => {
//     const em = email.value;
//     if (email_count == 1) {
//         count_click++;
//         email_count++;
//     }
//     if (!em.match((/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))) {
//         email.style.border = "1px solid red";
//         formValidate = false;
//     } else {
//         email.style.borderBottom = "none";
//         formValidate = true;
//     }
//     submitEnable();
// });
// id_number.addEventListener('keyup', e => {
//     const id = id_number.value;
//     if (id_num_count == 1) {
//         count_click++;
//         id_num_count++;
//     }
//     if (!id.match((/^[0-9]+$/))) {
//         id_number.style.borderBottom = "1px solid red";
//         formValidate = false;
//     } else {
//         id_number.style.border = "none";
//         formValidate = true;
//     }
//     submitEnable();
// });
// password.addEventListener('keyup', e => {
//     const pass = password.value;
//     if (pass_count == 1) {
//         count_click++;
//         pass_count++;
//     }
//     if (!pass.match((/^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/))) {
//         password.style.borderBottom = "1px solid red";
//         formValidate = false;
//     } else {
//         password.style.border = "none";
//         formValidate = true;
//     }
//     submitEnable();
// });
// password2.addEventListener('keyup', e => {
//     const pass = password2.value;
//     if (pass2_count == 1) {
//         count_click++;
//         pass2_count++;
//     }
//     if (!pass.match(password.value)) {
//         password2.style.borderBottom = "1px solid red";
//         formValidate = false;
//     } else {
//         password2.style.border = "none";
//         formValidate = true;
//     }
//     submitEnable();
// });
// department.addEventListener('change', () => {
//     submitEnable();
// });

// profession.addEventListener('change', () => {

//     submitEnable();
// });


// function submitEnable() {
//     if (formValidate && count_click >= 6 && department.value != "Department" && profession.value != "Choose...") {
//         document.querySelector('button[type=submit]').disabled = false;
//     } else {
//         document.querySelector('button[type=submit]').disabled = true;
//     }
// }