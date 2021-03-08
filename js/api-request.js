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
            }
        };
        request.open("GET", APIUrl + productId);
        request.send();
    });
}

// Si les données de localStorage "cartJson" existent, on affecte cette valeur à la variable "cart"
let cart = []; // for test => {id : "5be1ed3f1c9d44000030b061", amount : 1}
function callLocalStorage() {
    if(JSON.parse(localStorage.getItem("cartJson")) != null) {
        cart = JSON.parse(localStorage.getItem("cartJson"));
    }
}