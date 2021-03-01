//Récupération d'URL de l'API
const productType = "cameras"; // 3 choix (teddies, cameras, furniture)
const APIUrl = `http://localhost:3000/api/${productType}/`;

const allProductsId = [];
let productId ="";
let productInfo = "";

//Récupération des données de l'API
function getProduct() {
    return new Promise((resolve) => {
        let request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                resolve(JSON.parse(this.responseText));
                console.log('Réussi : Récupération des données de l\'API');
            } else {
                new Error('Récupération des données de l\'API');
            }
        };
        request.open("GET", APIUrl + productId);
        request.send();
    });
}


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
}

getProduct().then(values => {
    for(value of values) {
        allProductsId.push(value._id);
    }
    if(document.getElementById('product-list') != null) {
        allProductsList();
});