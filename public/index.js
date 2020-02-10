import "@babel/polyfill";
import {
  update
} from "./updateAccount";
import {
  signInCredentials
} from "./signin";

const updateBasic = document.querySelector("#updateForm");
const signin = document.querySelector('.form--login');



// SIGNIN
if (signin) {
  signin.addEventListener('submit', (e) => {
    e.preventDefault();
    signInCredentials(signin.querySelector('#email').value, signin.querySelector('#password').value);
  })
}


// UPDATE INFORMATION
if (updateBasic) {
  updateBasic.addEventListener("submit", e => {
    e.preventDefault();
    const firstname = document.querySelector("#fname").value;
    const lastname = document.querySelector("#lname").value;
    const id = document.querySelector("#id").value;
    const email = document.querySelector("#email").value;
    const dob = document.querySelector("#dob") ?
      document.querySelector("#dob").value :
      null;
    const batch = document.querySelector("#batch") ?
      document.querySelector("#batch").value :
      null;
    const section = document.querySelector("#section") ?
      document.querySelector("#batch").value :
      null;
    update({
      firstname,
      lastname,
      id,
      email,
      dob,
      batch,
      section
    });
  });
}