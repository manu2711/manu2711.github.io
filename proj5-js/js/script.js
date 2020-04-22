
allItemRequest = () => {
  return new Promise((resolve, reject) => {
    let request = new XMLHttpRequest()
    request.open('get', 'http://localhost:3000/api/furniture')
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

async function loadAllItems() {
  try {
    const allItemRequestPromise = allItemRequest()
    const response = await allItemRequestPromise

    for (let item of response) {
      // Creation et ajout  d'une div article pour créer un nouveau produit
      const newItem = document.createElement('article')
      newItem.classList.add('item')
      const productList = document.getElementById('product-list')
      productList.appendChild(newItem)

      // Création et ajout de la balie img pour ajouter la photo du produit
      const itemImage = document.createElement('img')
      itemImage.setAttribute('src', item.imageUrl)

      // Création d'une div pour ajouter le NOM du produit, puis ajout de la class item-name
      const itemName = document.createElement('h2')
      itemName.classList.add('item__name')
      itemName.innerHTML = item.name

      // Création d'une div pour ajouter la DESCRIPTION du produit, puis ajout de la class item-description
      const itemDescription = document.createElement('div')
      itemDescription.classList.add('item__description')
      itemDescription.innerHTML = item.description

      // Création d'une div pour ajouter le PRIX du produit, puis ajout de la class item-price
      const itemPrice = document.createElement('div')
      itemPrice.classList.add('item__price')
      itemPrice.innerHTML = 'EUR ' + (item.price / 100).toFixed(2)

      // Création d'un BOUTON renvoyant à la page produit.html et correspondant au produit cliqué
      const itemURL = 'produit.html?id=' + item._id

      const itemLien = document.createElement('a')
      itemLien.classList.add('item__lien')
      itemLien.setAttribute('href', itemURL)
      itemLien.innerText = 'Voir le produit'

      // Ajout des div name, description et price a l'élément article parent
      newItem.append(itemImage, itemName, itemDescription, itemPrice, itemLien)
    }

  } catch (error){
    console.log(error.error)
  }
}

loadAllItems()