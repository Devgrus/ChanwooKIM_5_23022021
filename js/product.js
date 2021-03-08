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
        
        //Ajouter les options dans la balise <select>
        for(let i = 0; productInfo.lenses.length > i; i++) {
            const option = document.createElement('option');
            document.getElementById('product-option').appendChild(option);
            option.innerHTML = `
            ${productInfo.lenses[i]}`;
        }

        const addCartButton = document.getElementById('addCart')
        addCartButton.addEventListener("click", addCart);
    }
    productId = "";
}

//Ajouter le produit lors d'un clic sur le button "Ajoutez au panier"
let findIdPlace = "";
function addCart() {
    //Si l'id dans l'URL n'est pas correct
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

// Exécuter les fonctions lors d'une overture de la page.
getProduct().then(values => {
    callLocalStorage();
    for(value of values) {
        allProductsId.push(value._id);
    }
    showProduct();
})