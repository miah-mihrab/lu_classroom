import "@babel/polyfill";
import {
  signInCredentials
} from "./signin";
import { deleteClassPost } from "./deleteClassPost";
import{
  getStudentsAssignments
} from "./assignmentSubmission";
const signin = document.querySelector('.form--login');


// SIGNIN
if (signin) {
  signin.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log("clicked" + signin.querySelector('#email').value)
    signInCredentials(signin.querySelector('#email').value, signin.querySelector('#password').value);
  })
}

//EDIT PROFILE
const editProfile = document.querySelector('#edit-profile');
if(editProfile){
    editProfile.addEventListener('click', (e)=>{
    e.preventDefault();
    const accountInfo = document.querySelectorAll('.form-control');
    accountInfo.forEach(e=>{
      e.disabled = false
    });
    document.getElementById('updateBasic').disabled = false
  });
}


//Check students who submitted assignments
const studentAssignments = document.querySelectorAll('.student-assignments');
if(studentAssignments){
    studentAssignments.forEach(e=>{
      e.addEventListener('click', ()=>{  
        getStudentsAssignments(e.dataset.assignmentid)
        
      })
    })
}

//Delete class post
const delete_post = document.querySelectorAll('#delete')
if (delete_post) {
  delete_post.forEach(e => {
    e.addEventListener('click', () => {
      console.log()  
      let data_id = e.getAttribute('data-id').split('+')
      deleteClassPost(data_id[0], data_id[1],e.parentElement.parentElement.parentElement.parentElement)
    })
  })
}
