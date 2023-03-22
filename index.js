const buttonLogin = document.getElementById("button-login")
const loginForm = document.getElementById("form-login")

buttonLogin.addEventListener("click", (event) => {
    event.preventDefault()
    const user = {
        username: "",
        password: "",
    }
    const formData = new FormData(loginForm);
    user.username = formData.get("username")
    user.password = formData.get("password")

    if (checkAllFieldIsFuel(user)) {
        PostData(user)
    } else {
        alert("Input Wajib Diisi!!")
    }
})

function checkAllFieldIsFuel(object) {
    for (const key in object) {
        if (!object[key]) {
            return false
        }
    }
    return true
}

function PostData(user) {
    fetch("http://localhost:8090/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("login error");
        }
    })
        .then(async data => {
            await data
            document.cookie = "token=" + data.token
            location.href = '/service/customer/customers.html'
        })
        .catch(error => {
            console.error(error);
        });

}