import {
    showAlert
} from './alertMessage';

export async function update(data) {
    try {
        console.log(Array.from(data))
        const updateResponse = await axios({
            method: "PATCH",
            url: "http://localhost:5000/account/update",
            data: Array.from(data)
        });
        if (updateResponse.status == 200) {
            showAlert('success', "Account Updated Successfully!")
            // window.setTimeout(() => {
            //     location.reload();
            // }, 1500)
        }
    } catch (err) {
        showAlert('err', "Something Bad Happend! Please Wait")
    }

}