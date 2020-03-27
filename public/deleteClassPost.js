import { showAlert } from "./alertMessage";
export async function deleteClassPost(postId, classId,post) {
    try {
    const deleteResponse = await axios({
        method: "DELETE",
        url: `/classroom/${classId}`,
        data: {
          postId: postId
      }
    });
    console.log(deleteResponse);
    showAlert("success", "Post deleted successfully");
        window.setTimeout(() => {
            post.style.display = "none";
    }, 1500);
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
}
