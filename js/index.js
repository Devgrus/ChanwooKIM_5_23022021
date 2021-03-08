//Création des cartes des produits (index.html)
async function allProductsList() {
    for(let i = 0; allProductsId.length > i; i++) {
        productId = allProductsId[i];
        productInfo = await getProduct();
        const div = document.createElement('div');
        div.className = 'col-12 col-md-4 col-lg-3';
        div.innerHTML = `<div class="card mb-5">
        <img src="${productInfo.imageUrl}" alt="${productInfo.name}">
        <div class="card-body">
        <h3 class="card-title h5">${productInfo.name}</h3>
        <p class="card-text">Option lentille : ${productInfo.lenses.length} choix</p>
        <a href="product.html?id=${productInfo._id}" class="stretched-link"></a>
        </div><div class="card-footer">${productInfo.price / 100} €</div>
        </div>`;
        document.getElementById('product-list').appendChild(div);
    }
    productId = "";
}

// Exécuter les fonctions lors d'une overture de la page.
getProduct().then(values => {
    callLocalStorage();
    for(value of values) {
        allProductsId.push(value._id);
    }
    allProductsList();
})