//Envoyer les données (contact, id de produit) au serveur et récupérer l'id de commande.
let order = "order";
function sendForm(value) {
    return new Promise((resolve) => {
        let request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (this.readyState == XMLHttpRequest.DONE  && (this.status == 200 || this.status == 201)) {
                resolve(JSON.parse(this.responseText));
                location.href = "./payment-complete.html";
            }
        };
        request.open('POST', APIUrl + order);
        request.setRequestHeader("Content-Type", "application/json");
        request.send(value);
    });
}

// Afficher le panier
async function showCart() {
    let resultCart = JSON.parse(localStorage.getItem("cartJson"));
    // Si resultCart n'a pas de valeur ou n'existe pas, cela veut dire que le panier est vide.
    if(resultCart == "" || resultCart == null) {
        const div = document.createElement('div');
        div.className = 'row d-flex h-100 align-items-center justify-content-center';
        div.innerHTML = `<p>Votre panier est vide</p>`;
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
                div.className = 'row bg-light my-2';
                div.id = `product-${productInfo._id}`
                div.innerHTML = `<div class="col-9 my-3"><div class="row d-flex align-items-center my-2">
                <div class="col-5"><img src="${productInfo.imageUrl}" class="img-fluid rounded" /></div>
                <div class="col-7">${productInfo.name}</div></div>
                <div class="row d-flex align-items-center my-2">
                <div class="col d-flex">Qauntité&nbsp&nbsp<select id="amount-${productInfo._id}"></select></div>
                <div class="col price" id = "price-${productInfo._id}">${productInfo.price * object.amount / 100} €</div></div></div>
                <div class="col-3 d-flex align-items-center">
                <div><button type="submit" id="delete-${object.id}" class="btn btn-danger"><i class="far fa-trash-alt text-light"></i></button></div>
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
        div.className = 'my-2';
        document.getElementById('container-cart').append(div);
        priceTotal();
    }
    productId = "";
}

// Afficher le prix total
function priceTotal() {
    const getPrice = document.getElementsByClassName('price');
    let priceSum = 0;
    for(let i = 0; getPrice.length > i; i++) {
        priceSum += getPrice[i].innerText.replace('€', '') * 1;
    }
    document.getElementById('priceTotal').innerHTML = `Total : ${priceSum} €`;
    localStorage.setItem("priceTotal", priceSum);
}

//validation des données(contact, id de produit) et si cela est correct, elle va envoyer ces données au serveur à l'aide de la fonction sendForm();
function validateCart() {
    //règles Regex pour le formulaire
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const nameRegex = /^[a-zA-Zéèçà$$âêîôûäëïöüÂÊÎÔÛÄËÏÖÜÀÆæÇÉÈŒœÙ]+(([',. -][a-zA-Zéèçà$$âêîôûäëïöüÂÊÎÔÛÄËÏÖÜÀÆæÇÉÈŒœÙ ])?[a-zA-Zéèçà$$âêîôûäëïöüÂÊÎÔÛÄËÏÖÜÀÆæÇÉÈŒœÙ]*)*$/;
    const addressRegex = /^[#.0-9a-zA-Zéèçà$$âêîôûäëïöüÂÊÎÔÛÄËÏÖÜÀÆæÇÉÈŒœÙ\s,-]+$/;
    const cityRegex = /^[#.a-zA-Zéèçà$$âêîôûäëïöüÂÊÎÔÛÄËÏÖÜÀÆæÇÉÈŒœÙ\s,-]+$/;
    
    //Appliquez l'effet de Regex
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const address = document.getElementById('address');
    const city = document.getElementById('city');
    const email = document.getElementById('email');
    regexEffect(firstName, nameRegex);
    regexEffect(lastName, nameRegex);
    regexEffect(address, addressRegex);
    regexEffect(city, cityRegex);
    regexEffect(email, emailRegex);
    
    //Vérification de la commande
    const send = document.getElementById('form-customer');
    send.addEventListener('submit',(event) => {
        const firstNameValue = document.getElementById('firstName').value;
        const lastNameValue = document.getElementById('lastName').value;
        const addressValue = document.getElementById('address').value;
        const cityValue = document.getElementById('city').value;
        const emailValue = document.getElementById('email').value;
        const resultCart = JSON.parse(localStorage.getItem("cartJson"));
        // Si son panier est vide
        if (resultCart == "" || resultCart == null) {
            alert("Votre panier est vide !")
            event.preventDefault(); // Sans preventDefault, le button submit va rafraîchir la page.
        }
        else if((resultCart != "" || resultCart != null) && (nameRegex.test(firstNameValue) == false || nameRegex.test(lastNameValue) == false || addressRegex.test(addressValue) == false || cityRegex.test(cityValue) == false || emailRegex.test(emailValue) == false)){
            alert('Veuillez remplir le formulaire "Contact"');
        }
        // Si son panier n'est pas vide et l'utilisateur a rempli correctement le formulaire
        else if ((resultCart != "" || resultCart != null) && nameRegex.test(firstNameValue) && nameRegex.test(lastNameValue) && addressRegex.test(addressValue) && cityRegex.test(cityValue) && emailRegex.test(emailValue)) {
            const contact = {
                firstName : firstNameValue,
                lastName : lastNameValue,
                address : addressValue,
                city : cityValue,
                email : emailValue
            };
            const products = [];
            for(object of resultCart) {
                products.push(object.id);
            }
            orderInfo = {
                contact,
                products
            };

            const sendOrder = JSON.stringify(orderInfo);
            console.log(sendOrder);
            sendForm(sendOrder).then(response => {
                console.log(response);
                localStorage.setItem("orderResponse", JSON.stringify(response));
            })
            event.preventDefault(); // Sans preventDefault, le button submit va rafraîchir la page donc location.href ne fonctionne pas.
            
        }
        /* Si le panier n'est pas vide et l'utilisateur n'a pas rempli correctmenet le formulaire,
        le button submit va vérifer le formulaire et afficher une erreur.
        (à l'aide d'attribut "pattern" dans le fichier HTML)*/
    })
    
}

//Créer une effet regex dans le formulaire à l'aide des class de Bootstrap.
function regexEffect(target, regex) {
    target.addEventListener('input', (event)=> {
        if(regex.test(event.target.value) == false) {
            if(target.classList.contains("is-valid")) {
                target.classList.replace("is-valid","is-invalid");
            } else {
                target.classList.add("is-invalid");
            }
        } else {
            if(target.classList.contains("is-invalid")) {
                target.classList.replace("is-invalid","is-valid");
            } else {
                target.classList.add("is-valid");
            }
        }
    })
}

// Exécuter les fonctions lors d'une overture de la page.
getProduct().then(values => {
    callLocalStorage();
    for(value of values) {
        allProductsId.push(value._id);
    }
    showCart();
    validateCart();
})