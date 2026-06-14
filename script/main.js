// Variable globale qui stocke les traductions de la langue choisie
var traductions = {};

// Lit le thème dans localStorage et l'applique au body
function appliquerTheme() {
  var theme = localStorage.getItem("theme") || "dark";
  document.body.className = "theme-" + theme;
  var selectTheme = document.getElementById("select-theme");
  if (selectTheme) {
    selectTheme.value = theme;
  }
}

// Appelée quand on change le style dans le select
function changerTheme() {
  var selectTheme = document.getElementById("select-theme");
  var theme = selectTheme.value;
  localStorage.setItem("theme", theme);
  document.body.className = "theme-" + theme;
  // Recharge les cartes pour appliquer la nouvelle mise en page
  if (typeof rechargerContenu === "function") {
    rechargerContenu();
  }
}

// Charge le fichier translations.json via fetch et applique la langue
function chargerTraductions(callback) {
  var langue = localStorage.getItem("langue") || "fr";

  fetch(getCheminJson() + "translations.json")
    .then(function(reponse) {
      return reponse.json();
    })
    .then(function(data) {
      // Garde seulement les traductions de la langue choisie
      traductions = data[langue];
      appliquerTraductions();
      // Lance la fonction suivante une fois les traductions chargées
      if (callback) {
        callback();
      }
    });
}

// Remplace le texte de tous les éléments qui ont data-lang
function appliquerTraductions() {
  var elements = document.querySelectorAll("[data-lang]");
  for (var i = 0; i < elements.length; i++) {
    var el = elements[i];
    var cle = el.getAttribute("data-lang");
    if (traductions[cle]) {
      el.textContent = traductions[cle];
    }
  }
  // Remet la bonne valeur dans le select-theme après la traduction
  var selectTheme = document.getElementById("select-theme");
  if (selectTheme) {
    selectTheme.value = localStorage.getItem("theme") || "dark";
  }
  var selectLang = document.getElementById("select-lang");
  if (selectLang) {
    selectLang.value = localStorage.getItem("langue") || "fr";
  }
}

// Appelée quand on change la langue dans le select
function changerLangue() {
  var selectLang = document.getElementById("select-lang");
  var langue = selectLang.value;
  localStorage.setItem("langue", langue);
  // Recharge les traductions sans recharger la page
  chargerTraductions();
  // Recharge les cartes avec les textes dans la nouvelle langue
  if (typeof rechargerContenu === "function") {
    rechargerContenu();
  }
}

// Retourne le bon chemin vers json/ selon la page courante
function getCheminJson() {
  var chemin = window.location.pathname;
  // Si on est dans html/, on remonte d'un dossier avec ../
  if (chemin.indexOf("/html/") !== -1) {
    return "../json/";
  }
  return "json/";
}

// Point de départ : s'exécute quand toute la page est chargée
window.onload = function () {
  appliquerTheme();
  // Charge les traductions puis lance la fonction de la page
  chargerTraductions(function () {
    if (typeof initPage === "function") {
      initPage();
    }
  });
};