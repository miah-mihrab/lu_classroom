import "@babel/polyfill"
import {
    update
} from './updateAccount';

const updateBasic = document.querySelector('#updateForm');











// UPDATE INFORMATION
if (updateBasic) {
    updateBasic.addEventListener('submit', (e) => {
        e.preventDefault();
        const firstname = document.querySelector('#fname').value;
        const lastname = document.querySelector('#lname').value;
        const id = document.querySelector('#id').value;
        const email = document.querySelector('#email').value;
        const dob = document.querySelector('#dob') ? document.querySelector('#dob').value : null;
        const batch = document.querySelector('#batch') ? document.querySelector('#batch').value : null;
        const section = document.querySelector('#section') ? document.querySelector('#batch').value : null;
        update({
            firstname,
            lastname,
            id,
            email,
            dob,
            batch,
            section
        })
    });
}