import "@babel/polyfill";
import {
  update
} from "./updateAccount";
import {
  signInCredentials
} from "./signin";

const updateBasic = document.querySelector("#update_form");
const signin = document.querySelector('.form--login');


// SIGNIN
if (signin) {
  signin.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log("clicked" + signin.querySelector('#email').value)
    signInCredentials(signin.querySelector('#email').value, signin.querySelector('#password').value);
  })
}

// UPDATE INFORMATION
if (updateBasic) {
  // updateBasic.addEventListener("submit", async e => {
  //   e.preventDefault();

  //   const dob = document.querySelector("#dob") ? document.querySelector("#batch").value.toString() : null;
  //   const batch = document.querySelector("#batch") ? document.querySelector("#batch").value.toString() : null;
  //   const section = document.querySelector("#section") ? document.querySelector("#batch").value.toString() : null;

  //   const formData = new FormData();
  //   // const formdata = await new FormData();
  //   formData.append('firstname', (document.querySelector("#fname").value).toString());
  //   formData.append('lastname', document.querySelector("#lname").value.toString());
  //   formData.append('id', document.querySelector("#id").value.toString());
  //   formData.append('email', document.querySelector("#email").value.toString())
  //   formData.append('dob', dob);
  //   formData.append('batch', batch);
  //   formData.append('section', section);
  //   formData.append('photo', document.getElementById('photo').files[0]);


  //   //console.log(document.getElementById('photo').files[0])

  //   // const firstname = document.querySelector("#fname").value;
  //   // const lastname = document.querySelector("#lname").value;
  //   // const id = document.querySelector("#id").value;
  //   // const email = document.querySelector("#email").value;
  //   // const dob = document.querySelector("#dob") ?
  //   //   document.querySelector("#dob").value :
  //   //   null;
  //   // const batch = document.querySelector("#batch") ?
  //   //   document.querySelector("#batch").value :
  //   //   null;
  //   // const section = document.querySelector("#section") ?
  //   //   document.querySelector("#batch").value :
  //   //   null;
  //   //console.log(JSON.stringify(Array.from(form)));
  //   update(formData)
  //   // update({
  //   //   firstname,
  //   //   lastname,
  //   //   id,
  //   //   email,
  //   //   dob,
  //   //   batch,
  //   //   section
  //   // });
  // });
}