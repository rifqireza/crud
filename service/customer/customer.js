const button = document.getElementById('add-customer-button')
const customerForm = document.getElementById("form-add-customer")
const bodyTable = document.getElementById("body-table-customer")
const cards = document.getElementById("cards")
const buttonLogout = document.getElementById("logout")

buttonLogout.addEventListener("click", (event) => {
    document.cookie.split(";").forEach(function (c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    location.replace('/index.html')
})

function getAllCustomers() {
    fetch("http://localhost:8090/api/customers", {
        headers: {
            'Authorization': 'bearer ' + document.cookie.split("=")[1]
        }
    })
        .then((resp) => resp.json())
        .then(res => {
            if (res.customer.length) {
                res.customer.map((element, i) => {
                    let newRow = document.createElement("tr")
                    newRow.addEventListener("click", () => getDetailByID(element.id))
                    for (const key in element) {
                        let newColumn = document.createElement("td");
                        newColumn.style.textAlign = 'center'
                        let textNode = document.createTextNode(element[key]);
                        newColumn.appendChild(textNode);
                        newRow.appendChild(newColumn)
                        if (key === Object.keys(element)[Object.keys(element).length - 1]) {
                            let newColumn = document.createElement("td");
                            newColumn.style.textAlign = 'center'
                            let button = document.createElement("button")
                            let textNode = document.createTextNode("Delete");
                            button.appendChild(textNode);
                            button.classList = "button delete-button"
                            button.addEventListener('click', () => deleteById(element.id))
                            newColumn.appendChild(button)
                            newRow.appendChild(newColumn)
                        }
                    }
                    bodyTable.appendChild(newRow)
                })
            }
        })
        .catch(err => location.replace('/index.html'))

}

function getDetailByID(id) {
    fetch(`http://localhost:8090/api/customer/${id}`, {
        headers: {
            'Authorization': 'bearer ' + document.cookie.split("=")[1]
        }
    })
        .then(resp => resp.json())
        .then(res => {
            cards.innerHTML = `<div class="card">
        <img src="../../images/img_avatar${res.jenis_kelamin === "P" ? "2" : ""}.png" alt="Avatar" style="width:100%">
        <div class="container">
          <h4><b>${res.nama_customer}</b></h4>
          <p>${res.no_hp}</p>
        </div>
      </div>`
        })
        .catch(err => location.replace('/index.html'))
}

function deleteById(id) {
    fetch(`http://localhost:8090/api/customer/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'bearer ' + document.cookie.split("=")[1]
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Gagal menghapus data');
            }
            return response.json()
        })
        .then(res => {
            alert(res)
            location.reload()
        })
        .catch(error => {
            location.replace('/index.html')
        });
}

getAllCustomers()

button.addEventListener("click", (event) => {
    console.log('sini');
    const customer = {
        nama_customer: "",
        jenis_kelamin: "",
        no_hp: "",
        alamat: "",
        tanggal_lahir: ""
    }
    const formData = new FormData(customerForm);
    customer.nama_customer = formData.get("nama_customer")
    customer.jenis_kelamin = formData.get("jenis_kelamin")
    customer.no_hp = formData.get("no_hp")
    customer.alamat = formData.get('alamat')
    const tanggal = formData.get("tanggal_lahir")
    if (tanggal) {
        customer.tanggal_lahir = `${tanggal.split("-")[2]}-${tanggal.split("-")[1]}-${tanggal.split("-")[0]}`
    }
    if (checkAllFieldIsFuel(customer)) {
        PostData(customer)
    } else {
        alert("Input Wajib Diisi!!")
    }
    event.preventDefault()
})

function checkAllFieldIsFuel(object) {
    for (const key in object) {
        if (!object[key]) {
            return false
        }
    }
    return true
}

function PostData(customer) {
    fetch("http://localhost:8090/api/customer", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'bearer ' + document.cookie.split("=")[1]
        },
        body: JSON.stringify(customer)
    }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Error creating customer.");
        }
    })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error(error);
        });

    location.href = "./customers.html"
}