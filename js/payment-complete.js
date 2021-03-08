//afficher l'id de commande et le nom d'utilisateur
function showOrderInfo() {
    const orderResponse = JSON.parse(localStorage.getItem("orderResponse"));
    const div = document.getElementById('container-payment');
    div.innerHTML = `<div class="d-flex flex-column align-items-center">
    <i id="check-circle" class="fas fa-check-circle text-success display-1"></i>
    <h1 class="my-3">Paiement réussi</h1>
    <p class="h5 my-2">Merci pour votre commande !</p>
    <!-- Return to main page -->
    <a class="btn btn-primary" href="index.html">Revenir à la page d'acceuil</a>
    <!-- End Return to main page -->
    <!-- Show client name and order ID -->
    <div class="my-5"><h2 class="h4 my-3">Information de la commande</h2>
    <p><strong>Nom du client :</strong> ${orderResponse.contact.firstName} ${orderResponse.contact.lastName}</p>
    <p><strong>Numéro de la commande :</strong>  ${orderResponse.orderId}</p>
    <p><strong>Prix total :</strong> ${localStorage.getItem("priceTotal")} €</p>
    </div>
    <!-- End Show client name and product -->
    </div>
    `;

    localStorage.clear();
}

// Exécuter les fonctions après le chargement d'un élément HTML.
document.getElementById("container-payment").addEventListener("load", showOrderInfo());