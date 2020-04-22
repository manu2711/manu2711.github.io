// Accès aux éléments du DPM
const firstName = document.getElementById('name')
const lastName = document.getElementById('surname')
const adress = document.getElementById('address')
const city = document.getElementById('city')
const email = document.getElementById('email')
const orderButton = document.getElementById('orderButton')
const form = document.getElementById('basket__form')
const totalPriceCell = document.getElementById('total-price')

const firstNameError = document.getElementById('firstname-error')
const lastNameError = document.getElementById('lastname-error')
const adressError = document.getElementById('adress-error')
const cityError = document.getElementById('city-error')
const emailError = document.getElementById('email-error')

let totalPrice = 0

// Récupération des produits ajoutés au panier
let itemsInBasket = ''

if (localStorage.getItem('basket') != '') {
    itemsInBasket = JSON.parse(localStorage.getItem('basket'))

    // On liste les produits contenu dans le panier
    for (item of itemsInBasket) {

        // Création des constante contenant les éléments HTML
        const rows = document.getElementById('table-row');
        const newRow = document.createElement('tr');
        const newRowName = document.createElement('td');
        const newRowPrice = document.createElement('td');

        rows.appendChild(newRow);
        newRow.append(newRowName, newRowPrice);

        newRowName.innerText = item.name;
        newRowPrice.innerText = 'EUR ' + (item.price / 100).toFixed(2);

        totalPrice += item.price
    }

} else {
    itemsInBasket = ''
}



// On calcul puis on affiche le prix total de la commande
totalPriceCell.textContent = 'EUR ' + (totalPrice / 100).toFixed(2)


// Fonction de validation des emails
function validateEmail(email) {
    let re = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
    return re.test(email);
}


// Fonction de validation des éléments du formulaire
// La fonction attends deux arguments, le premier est l'input à vérifier et le second est le paragraphe contenant le message d'erreur
validateInput = (input, error) => {
    const attributeType = input.getAttribute('type')
    const tagName = input.tagName

    if (attributeType === 'text' || tagName === 'TEXTAREA') {
        if (input.value != '') {
            input.style.border = '1px solid green'
            error.style.display = 'none'
            return true
        } else {
            input.style.border = '1px solid red'
            error.style.display = 'block'
            return false
        }
    } else if (attributeType === 'email') {
        if (input.value != '') {
            if (validateEmail(input.value)) {
                input.style.border = '1px solid green'
                error.style.display = 'none'
                return true
            } else {
                input.style.border = '1px solid red'
                error.style.display = 'block'
                return false
            }
        } else {
            input.style.border = '1px solid red'
            error.style.display = 'block'
            return false
        }
    }
}

// On vérifie que les éléments du formulaire sont bien remplis et avec les bons éléments (ex.: email)
firstName.addEventListener('blur', () => {
    validateInput(firstName, firstNameError)
})

lastName.addEventListener('blur', () => {
    validateInput(lastName, lastNameError)
})

adress.addEventListener('blur', () => {
    validateInput(adress, adressError)
})

city.addEventListener('blur', () => {
    validateInput(city, cityError)
})

email.addEventListener('blur', () => {
    validateInput(email, emailError)
})


orderButton.addEventListener('click', ($event) => {
    $event.preventDefault();

    //On vérifie que tous les éléments du formulaire sont bien remplis
    if (validateInput(firstName, firstNameError) && validateInput(lastName, lastNameError) && validateInput(adress, adressError) && validateInput(city, cityError) && validateInput(email, emailError)) {
        const contact = {
            firstName: firstName.value,
            lastName: lastName.value,
            adress: adress.value,
            city: city.value,
            email: email.value
        }
        const products = ["5be9cc611c9d440000c1421e", "5be9cc611c9d440000c1421e"]
        const post = { contact, products }

        submitFormData(post)
    } else {
        console.log('tous les champs sont obligatoires || il y a une erreur')
    }
})

function makePostRequest(data) {
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest()
        request.open('POST', 'http://localhost:3000/api/furniture/order')
        request.onreadystatechange = () => {
            if (request.readyState === 4) {
                if (request.status === 200 || request.status === 201) {
                    resolve(JSON.parse(request.response))
                } else {
                    reject(JSON.parse(request.response))
                }
            }
        }
        request.setRequestHeader('Content-Type', 'application/json')
        request.send(JSON.stringify(data))
    })
}

async function submitFormData(post) {
    try {
        const requestPromise = makePostRequest(post)
        const response = await requestPromise
        localStorage.clear()
        window.location = "confirmation.html?orderId=" + response.orderId + "&price=" + totalPrice
    } catch (error) {
        console.log(error.error)
    }
}



