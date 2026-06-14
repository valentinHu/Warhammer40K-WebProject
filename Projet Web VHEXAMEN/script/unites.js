// Lance le chargement des unités au démarrage
function initPage() {
  chargerUnites();
}

// Recharge les unités quand on change de langue ou de style
function rechargerContenu() {
  chargerUnites();
}

// Lit le paramètre ?faction= dans l'URL
function getFactionURL() {
  var params = window.location.search;
  var faction = "";
  if (params.indexOf("faction=") !== -1) {
    faction = params.split("faction=")[1];
    faction = faction.split("&")[0];
  }
  // Space Marines par défaut si pas de paramètre
  return faction || "space_marines";
}

// Charge le JSON et filtre les unités selon la faction choisie
function chargerUnites() {
  var factionId = getFactionURL();
  // Sauvegarde la faction pour que la page détails puisse la lire
  localStorage.setItem("faction_choisie", factionId);

  // Appel fetch vers le fichier JSON
  fetch("../json/unites.json")
    .then(function(reponse) {
      return reponse.json();
    })
    .then(function(data) {
      var unites = data[factionId] || [];
      afficherUnites(unites, factionId);
    });
}

// Crée et affiche une carte pour chaque unité de la faction
function afficherUnites(unites, factionId) {
  var langue = localStorage.getItem("langue") || "fr";
  var container = document.getElementById("liste-unites");
  container.innerHTML = "";

  // Met à jour le titre H2 avec le nom de la faction
  var nomsFactions = {
    space_marines: "Space Marines",
    necrons: "Necrons",
    orks: "Orks"
  };
  var titreEl = document.getElementById("titre-faction");
  if (titreEl) {
    titreEl.textContent = nomsFactions[factionId] || factionId;
  }

  if (unites.length === 0) {
    container.innerHTML = "<p>Aucune unité trouvée.</p>";
    return;
  }

  for (var i = 0; i < unites.length; i++) {
    var u = unites[i];
    // Prend la description et le type dans la bonne langue
    var description = u["description_" + langue] || u["description_fr"];
    var type = u["type_" + langue] || u["type_fr"];

    // Le lien passe la faction ET l'unité choisie dans l'URL
    var carte = document.createElement("a");
    carte.className = "card";
    carte.href = "details.html?faction=" + factionId + "&unite=" + u.id;

    carte.innerHTML =
      '<img src="../images/' + u.image.replace("../images/", "") + '" alt="' + u.nom + '">' +
      '<div class="card-body">' +
      "  <h3>" + u.nom + "</h3>" +
      "  <p><strong>" + type + "</strong> — " + u.points + " pts</p>" +
      "  <p>" + description + "</p>" +
      "</div>";

    container.appendChild(carte);
  }
}