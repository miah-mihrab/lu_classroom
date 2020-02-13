const attach_file = document.querySelector('#attach-file');
const file_to_upload = document.querySelector('#file-to-upload');
const uploadFile = document.querySelector('#uploadFile');
const fileLogo = document.querySelector('.fileLogo');
const fileName = document.querySelector('.fileName');
attach_file.addEventListener('click', () => {
    uploadFile.click();
});

uploadFile.addEventListener('change', () => {
    file_to_upload.style.display = "block";
    let split_file = []
    split_file = (uploadFile.files[0].name).split('.');
    let ext = split_file[1];
    if (ext === 'png') {
        document.querySelector('.fileLogo img').src = "../public/images/png_logo.png"
    } else if (ext === 'jpg' || ext === 'jpeg') {
        document.querySelector('.fileLogo img').src = "../public/images/jpg_logo.png"
    } else if (ext === "pptx") {
        document.querySelector('.fileLogo img').src = "../public/images/pptx_logo.png"
    } else if (ext === 'doc' || ext === 'docx') {
        document.querySelector('.fileLogo img').src = "../public/images/word_logo.png"
    }
    fileName.innerHTML = uploadFile.files[0].name
    //file_to_upload.innerHTML = uploadFile.files[0].name
});



const createPost = async (content, id) => {
    const newPost = await axios({
        method: "POST",
        url: `/classroom/${id}`,
        data: {
            content
        }
    });

    console.log(newPost);
}


document.querySelector('#classroomForm').addEventListener('submit', (e) => {
    e.preventDefault();
    createPost(document.querySelector('textarea').value, document.querySelector('#classroomForm').dataset.id);
});