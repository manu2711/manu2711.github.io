// Accès aux éléments du DOM
const item = document.getElementById('item')
const itemImage = document.getElementById("item-image");
const itemName = document.getElementById("item-name");
const itemDescription = document.getElementById("item-description");
const itemPrice = document.getElementById("item-price");
const itemButton = document.getElementById("item-button");
const itemAddedMessage = document.querySelector("#product p");
const noProduct = document.getElementById("no-product");

// Création de la classe ProductComponent qui va nous permettre d'enregistrer les produits qui seront ajoutés au panier via localStorage
class ProductComponent {
    constructor(name, price) {
        this.name = name;
        this.price = price;
    }
}

// On récupère le numéro de l'ID dans l'URL qui est enregistré dans la variable id
let id = ''

let url = new URL(window.location.href);
let search_id = new URLSearchParams(url.search);
if (search_id.has("id")) {
    id = search_id.get("id");
}

// Création de la fonction request
function request(data) {
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest()
        request.open('GET', 'http://localhost:3000/api/furniture/' + data)
        request.onreadystatechange = () => {
            if (request.readyState === 4) {
                if (request.status === 200 || request.status === 201) {
                    resolve(JSON.parse(request.response))
                } else {
                    reject(JSON.parse(request.response))
                }
            }
        }
        request.send()
    })
}

async function loadItem(itemId) {
    try {
        const requestPromise = request(itemId)
        const response = await requestPromise
        const options = response.varnish;
        item.style.display = 'flex'
        itemImage.setAttribute("src", response.imageUrl)
        itemName.textContent = response.name
        itemDescription.textContent = response.description
        itemPrice.textContent = "EUR " + (response.price / 100).toFixed(2); // toFixed permet de retourner deux chiffres décimaux
        for (let option of options) {
            const itemOption = document.getElementById("item-option");
            const addOption = document.createElement("option");
            addOption.innerHTML = option;
            itemOption.appendChild(addOption);
        }
        itemButton.addEventListener('click', ($event) => {
            $event.preventDefault()
            // On ajoute l'article au panier
            if (localStorage.getItem('basket')) {
                let basket = JSON.parse(localStorage.getItem('basket'));
                let newProductInBasket = new ProductComponent(response.name, response.price);
                basket.push(newProductInBasket);
                let basketStringified = JSON.stringify(basket);
                localStorage.setItem('basket', basketStringified);
            } else {
                let basket = [];
                let newProductInBasket = new ProductComponent(response.name, response.price);
                basket.push(newProductInBasket);
                let basketStringified = JSON.stringify(basket);
                localStorage.setItem('basket', basketStringified);
            }
            itemAddedMessage.style.display = 'block'
        });

    } catch (error) {
        itemName.textContent = error.error
    }
}

loadItem(id)
