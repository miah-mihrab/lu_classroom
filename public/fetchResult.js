const result = document.querySelector("#results");

if (result) {
  result.addEventListener("click", async () => {
    axios({
      method: "get",
      url: "http://localhost:5000/result/5e3d8d4dda0742309c375e33"
    })
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        console.log(err);
      });
  });
}
