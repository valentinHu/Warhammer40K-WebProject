// Lance le chargement des factions au démarrage
function initPage() {
  chargerFactions();
}

// Recharge les factions quand on change de langue ou de style
function rechargerContenu() {
  chargerFactions();
}

// Charge le fichier factions.json via fetch
function chargerFactions() {
  fetch("json/factions.json")
    .then(function(reponse) {
      return reponse.json();
    })
    .then(function(factions) {
      afficherFactions(factions);
    });
}

// Crée et affiche une carte HTML pour chaque faction
function afficherFactions(factions) {
  var langue = localStorage.getItem("langue") || "fr";
  var container = document.getElementById("liste-factions");
  container.innerHTML = "";

  for (var i = 0; i < factions.length; i++) {
    var f = factions[i];
    // Prend la description dans la bonne langue, français par défaut
    var description = f["description_" + langue] || f["description_fr"];

    // Crée un lien cliquable qui passe l'id de la faction dans l'URL
    var carte = document.createElement("a");
    carte.className = "card";
    carte.href = "html/unites.html?faction=" + f.id;

    carte.innerHTML =
      '<img src="images/' + f.image.replace("../images/", "") + '" alt="' + f.nom + '">' +
      '<div class="card-body">' +
      "  <h3>" + f.nom + "</h3>" +
      "  <p>" + description + "</p>" +
      "</div>";

    container.appendChild(carte);
  }
}