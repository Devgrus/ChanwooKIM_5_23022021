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
    productId = "";
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
    productId = "";
}

//Ajouter le product lors d'un clic sur le button "Ajoutez au panier"
let cart = []; // for test => {id : "5be1ed3f1c9d44000030b061", amount : 1}
let findIdPlace = "";
function addCart() {
    if(allProductsId.includes(window.location.search.replace('?id=', '')) == false) {
        alert("Désolé. Ce produit n'existe pas.");
    }
    else {    
        if(cart == "") {
            cart.push({id : `${window.location.search.replace('?id=', '')}`, amount : 1});
            alert("Ce produit a été ajouté à votre panier");
        }
        else {
            for(count in cart) {
                if(cart[count].id.includes(window.location.search.replace('?id=', ''))) {
                    findIdPlace = count;
                }
            }
            if(findIdPlace == "") {
                cart.push({id : `${window.location.search.replace('?id=', '')}`, amount : 1});
                alert("Ce produit a été ajouté à votre panier");
            }
            else {
                if(cart[findIdPlace].amount >= 5) {
                    alert("Qauntité maximum : 5");
                }
                else {
                    cart[findIdPlace].amount *= 1;
                    cart[findIdPlace].amount += 1;
                    alert("Ce produit a été ajouté à votre panier");
                }  
            }
        }
        localStorage.setItem("cartJson", JSON.stringify(cart));
    }
};

// Si les données de localStorage "cartJson" existe, on affecte cette valeur à la variable "cart"
function callLocalStorage() {
    if(JSON.parse(localStorage.getItem("cartJson")) != null) {
        cart = JSON.parse(localStorage.getItem("cartJson"));
    }

}

// Montrer le panier
async function showCart() {
    let resultCart = JSON.parse(localStorage.getItem("cartJson"));
    // Si resultCart n'a pas de valeur ou n'existe pas, cela veut dire que le panier est vide.
    if(resultCart == "" || resultCart == null) {
        const div = document.createElement('div');
        div.className = 'row';
        div.innerHTML = `Votre panier est vide`;
        document.getElementById('container-cart').appendChild(div);
    } else {
        for(const object of resultCart) {
            productId = object.id;
            if(allProductsId.indexOf(productId) == -1) {
                console.log("delete this product")
            } else {
                productInfo = await getProduct();
                let productPrice = productInfo.price;
                const div = document.createElement('div');
                div.className = 'row';
                div.id = `product-${productInfo._id}`
                div.innerHTML = `<div class="col-3">
                <img src="${productInfo.imageUrl}" class="img-fluid" /></div>
                <div class="col-9"><div class="row">
                <div class="col-4">${productInfo.name}</div>
                <div class="col-1"><select id="amount-${productInfo._id}"></select></div>
                <div class="col-3 price" id = "price-${productInfo._id}">${productInfo.price * object.amount / 100} €</div>
                <div class="col-3"><button type="submit" id="delete-${object.id}" class="btn btn-danger"><i class="far fa-trash-alt text-light"></i></button></div></div>
                </div>
                `;
                document.getElementById('container-cart').append(div);
                for(let i = 1; 5 >= i; i++) {
                    const option = document.createElement('option');
                    if(i == object.amount) {
                        option.setAttribute("selected", "");
                    }
                    option.innerHTML = i;
                    document.getElementById(`amount-${productInfo._id}`).append(option);    
                }         
                // Modifier la quantité de produit lors de changement de option de select "#amount-productID"
                document.getElementById(`amount-${object.id}`).addEventListener('change', (event) => {
                    object.amount = event.target.value;
                    document.getElementById(`price-${object.id}`).innerHTML = `${productPrice * object.amount / 100} €`;
                    localStorage.setItem("cartJson", JSON.stringify(resultCart));
                    priceTotal();
                })
                
                // Supprimer un produit lors d'un clic sur le button "#delete-productID"
                document.getElementById(`delete-${object.id}`).addEventListener('click', () => {
                    resultCart.splice(resultCart.indexOf(object), 1);
                    localStorage.setItem("cartJson", JSON.stringify(resultCart));
                    document.getElementById(`product-${object.id}`).remove();
                    console.log("supprimé")
                    priceTotal();
                    if(resultCart == "") {
                        showCart();
                        document.getElementById('priceTotal').remove();
                    }
                })
            }
        }
        const div = document.createElement('div');
        div.id = 'priceTotal';
        document.getElementById('container-cart').append(div);
        priceTotal();
    }
    productId = "";
}

function priceTotal() {
    const getPrice = document.getElementsByClassName('price');
    let priceSum = 0;
    for(let i = 0; getPrice.length > i; i++) {
        priceSum += getPrice[i].innerText.replace('€', '') * 1;
    }
    document.getElementById('priceTotal').innerHTML = `Total : ${priceSum} €`;
}

//Envoyer les données (contact, id de produit) au serveur
let order = "order";
function sendForm(value) {
    return new Promise((resolve) => {
        let request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (this.readyState == XMLHttpRequest.DONE  && this.status >= 200 && this.status <= 299) {
                resolve(JSON.parse(this.responseText));
                console.log('les données sont envoyées');
            } else {
                //new Error('les données ne sont pas envoyées');
                console.log("les données ne sont pas envoyées");
            }
        };
        request.open('POST', APIUrl + order);
        request.setRequestHeader("Content-Type", "application/json");
        request.send(value);
    });
}

//validation des données(contact, id de produit) et si cela est correct, elle va envoyer ces données au serveur à l'aide de la fonction sendForm();
function validateCart() {
    //règles Regex pour le formulaire
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const textRegex = /^[A-Za-z]+$/;
    const addressRegex = /^[#.0-9a-zA-Z\s,-]+$/;
    const cityRegex = /^[#.a-zA-Z\s,-]+$/;
    
    //Vérification de la commande
    let send = document.getElementById('form-customer');
    send.addEventListener('submit',(event) => {
        let firstNameValue = document.getElementById('firstName').value;
        let lastNameValue = document.getElementById('lastName').value;
        let addressValue = document.getElementById('address').value;
        let cityValue = document.getElementById('city').value;
        let emailValue = document.getElementById('email').value;
        let resultCart = JSON.parse(localStorage.getItem("cartJson"));
        // Si son panier est vide
        if (resultCart == "") {
            alert("Votre panier est vide !")
            event.preventDefault(); // Sans preventDefault, le button submit va rafraîchir la page.
        }
        // Si son panier n'est pas vide et l'utilisateur a rempli correctement le formulaire
        else if (resultCart != "" && textRegex.test(firstNameValue) && textRegex.test(lastNameValue) && addressRegex.test(addressValue) && cityRegex.test(cityValue) && emailRegex.test(emailValue)) {
            let contact = {
                firstName : firstNameValue,
                lastName : lastNameValue,
                address : addressValue,
                city : cityValue,
                email : emailValue
            };
            let orderedProducts = [];
            for(object of resultCart) {
                orderedProducts.push(object.id);
            }
            orderInfo = {
                contact,
                orderedProducts
            };

            let sendOrder = JSON.stringify(orderInfo);
            alert(sendOrder);
            localStorage.setItem("sendOrder", sendOrder);
            sendForm(sendOrder);
            //location.href = "./payment-success.html";
            event.preventDefault(); // Sans preventDefault, le button submit va rafraîchir la page donc location.href ne fonctionne pas.
            
        }
        /* Si le panier n'est pas vide et l'utilisateur n'a pas rempli correctmenet le formulaire,
        le button submit va vérifer le formulaire et afficher une erreur.
        (à l'aide d'attribut "pattern" dans le fichier HTML)*/
    })
}


// Exécuter les fonctions lors d'une overture de la page.
getProduct().then(values => {
    callLocalStorage();
    for(value of values) {
        allProductsId.push(value._id);
    }
    if(document.getElementById('product-list') != null) {
        allProductsList();
    } else if(window.location.pathname == "/product.html" && window.location.search.startsWith('?id=')) {
        showProduct();
    } else if(window.location.pathname == "/cart.html") {
        showCart();
        validateCart();
    };
});