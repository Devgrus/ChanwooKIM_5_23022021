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

//Création de la description des produits (product.html)
async function showProduct() {
    productId = window.location.search.replace('?id=', '');
    if(allProductsId.includes(productId) == false) {
        console.log('Wrong product ID !');
    }
    else {
        productInfo = await getProduct();
        const div = document.createElement('div');
        div.className = 'row my-5';
        div.innerHTML = `
        <div class="col-12 col-md-6 d-flex align-items-center"><img class="img-fluid rounded-lg" src="${productInfo.imageUrl}" /></div>
        <div class="col-12 col-md-6">
        <h1 class="h3 text-center my-2">${productInfo.name}</h1>
        <p class="text-justify my-2">${productInfo.description}</p>
        <form><label for="product-option">Lentille</label>
        <select class="form-control" id="product-option">
        <option>Choisissez une option</option></select></form>
        <p class="text-right h4 my-2">${productInfo.price / 100} €</p>
        <button type="submit" id="addCart" class="btn btn-primary btn-block"><i class="fas fa-shopping-basket text-light mr-3"></i>Ajoutez au panier</button>
        </div>`;
        document.getElementById('product-description').appendChild(div);
        
        for(let i = 0; productInfo.lenses.length > i; i++) {
            const option = document.createElement('option');
            document.getElementById('product-option').appendChild(option);
            option.innerHTML = `
            ${productInfo.lenses[i]}`;
        }

        const addCartButton = document.getElementById('addCart')
        addCartButton.addEventListener("click", await addCart);
    }
}

//Ajouter le product lors d'un clic sur le button "Ajoutez au panier"
const cart = []; // test: {id : "5be1ed3f1c9d44000030b061", amount : 1}
let findIdPlace = "";
function addCart() {
    if(allProductsId.includes(window.location.search.replace('?id=', '')) == false) {
        alert("Désolé. Ce produit n'existe pas.");
    }
    else {
        alert("Ce produit a été ajouté à votre panier");
        if(cart == "") {
            cart.push(`{id : ${window.location.search.replace('?id=', '')}, amount : 1}`);
        }
        else {
            for(count in cart) {
                if(cart[count].id.includes(window.location.search.replace('?id=', ''))) {
                    findIdPlace = count;
                }
            }
            if(findIdPlace == "") {
                cart.push(`{id : ${window.location.search.replace('?id=', '')}, amount : 1}`);
            }
            else {
                cart[findIdPlace].amount += 1;
            }
        }
        localStorage.setItem("cartJson", JSON.stringify(cart));
    }
};

getProduct().then(values => {
    for(value of values) {
        allProductsId.push(value._id);
    }
    if(document.getElementById('product-list') != null) {
        allProductsList();
    } else if(window.location.pathname == "/product.html" && window.location.search.startsWith('?id=')) {
        showProduct();
    }
});