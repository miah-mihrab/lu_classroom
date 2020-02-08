import {
    showAlert
} from './alertMessage';

export async function update(body) {
    try {
        const updateResponse = await axios({
            method: "PATCH",
            url: "http://localhost:5000/account/update",
            data: {
                firstname: body.firstname,
                lastname: body.lastname,
                email: body.email,
                id: body.id,
                dob: body.dob,
                batch: body.batch,
                section: body.section
            }
        });
        console.log(updateResponse.status)
        if (updateResponse.status == 200) {
            showAlert('success', "Account Updated Successfully")
            window.setTimeout(() => {
                location.reload();
            }, 1500)
        }
    } catch (err) {
        showAlert('err', "Something Bad Happend! Please Wait")
    }

}