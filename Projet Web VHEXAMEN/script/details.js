// Lance la page : met à jour le lien retour et charge les détails
function initPage() {
  mettreAJourLienUnites();
  chargerDetails();
}

// Recharge les détails quand on change de langue ou de style
function rechargerContenu() {
  chargerDetails();
}

// Lit un paramètre dans l'URL (ex: ?faction=necrons → "necrons")
function getParam(nom) {
  var params = window.location.search;
  if (params.indexOf(nom + "=") !== -1) {
    var valeur = params.split(nom + "=")[1];
    valeur = valeur.split("&")[0];
    return valeur;
  }
  return null;
}

// Met à jour le lien "retour aux unités" avec la bonne faction
function mettreAJourLienUnites() {
  var factionId = getParam("faction") || localStorage.getItem("faction_choisie") || "space_marines";
  var lien = document.getElementById("lien-retour-unites");
  if (lien) {
    lien.href = "unites.html?faction=" + factionId;
  }
}

// Charge le JSON et cherche l'unité sélectionnée
function chargerDetails() {
  var factionId = getParam("faction") || localStorage.getItem("faction_choisie") || "space_marines";
  var uniteId = getParam("unite");

  // Appel fetch vers le fichier JSON
  fetch("../json/unites.json")
    .then(function(reponse) {
      return reponse.json();
    })
    .then(function(data) {
      var unites = data[factionId] || [];

      // Cherche l'unité dont l'id correspond au paramètre URL
      var unite = null;
      for (var i = 0; i < unites.length; i++) {
        if (unites[i].id === uniteId) {
          unite = unites[i];
          break;
        }
      }

      // Affiche l'unité trouvée, sinon la première de la liste
      if (unite) {
        afficherDetails(unite);
        afficherTableau(unite);
      } else if (unites.length > 0) {
        afficherDetails(unites[0]);
        afficherTableau(unites[0]);
      } else {
        document.getElementById("detail-unite").innerHTML = "<p>Aucune unité trouvée.</p>";
      }
    });
}

// Construit et affiche la boite de détails de l'unité
function afficherDetails(unite) {
  var langue = localStorage.getItem("langue") || "fr";
  var description = unite["description_" + langue] || unite["description_fr"];
  var type = unite["type_" + langue] || unite["type_fr"];

  // Récupère les étiquettes traduites depuis main.js
  var labelDesc   = traductions["description_label"] || "Description :";
  var labelPoints = traductions["points_label"]      || "Points :";
  var labelType   = traductions["type_label"]        || "Type :";

  var container = document.getElementById("detail-unite");
  container.innerHTML =
    '<div class="detail-box">' +
    '  <img src="../images/' + unite.image.replace("../images/", "") + '" alt="' + unite.nom + '" class="detail-img">' +
    '  <div class="detail-texte">' +
    "    <h3>" + unite.nom + "</h3>" +
    "    <p><strong>" + labelType   + "</strong> " + type         + "</p>" +
    "    <p><strong>" + labelPoints + "</strong> " + unite.points + " pts</p>" +
    "    <p><strong>" + labelDesc   + "</strong> " + description  + "</p>" +
    '  </div>' +
    "</div>";
}

// Remplit le tableau avec les ventes des 10 dernières années
function afficherTableau(unite) {
  var zoneTableau = document.getElementById("zone-tableau");
  var tbody = document.getElementById("tableau-ventes");

  // Cache le tableau si pas de données de ventes
  if (!unite.ventes || unite.ventes.length === 0) {
    zoneTableau.style.display = "none";
    return;
  }

  zoneTableau.style.display = "block";
  tbody.innerHTML = "";

  // Calcule l'année de départ selon le nombre de ventes
  var anneeActuelle = 2024;
  var anneeDepart = anneeActuelle - unite.ventes.length + 1;

  for (var i = 0; i < unite.ventes.length; i++) {
    var annee = anneeDepart + i;
    var ventes = unite.ventes[i];
    var ligne = document.createElement("tr");
    ligne.innerHTML =
      "<td>" + annee + "</td>" +
      "<td>" + ventes.toLocaleString() + "</td>";
    tbody.appendChild(ligne);
  }
}
