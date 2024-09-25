document.addEventListener("DOMContentLoaded", function(){
// Fonctions pour changer de langues
    function addActiveClass(element){element.classList.add("active")}
    function removeActiveClass(element){element.classList.remove("active")}
    let html = document.querySelector("html");
    let differentsLangues = document.querySelectorAll(".langue");
    // Fonction pour ajouter/retirer les attributs data-disposition et data-langue
    function setDataAttributes(element, attribute){
        let data = element.getAttribute(attribute);
        html.setAttribute(attribute, data);
    }
    setDataAttributes(document.querySelector(".langue[data-langue='fr']"), "data-langue");
    // Choix de la langue
    differentsLangues.forEach(function(El){
        El.addEventListener("click", function(){
            differentsLangues.forEach(function(element){removeActiveClass(element)});
            addActiveClass(El); setDataAttributes(El, "data-langue");
        });
    });


// Mise en place des modifications de texte
    // Déclaration des variables avec les changements
    let ponctuationRemplacement = [";", ":", "?", "!", "€"];
    let codeAccessibilite = [
        {"base": "oe", "remplacement": "&oelig;"},
        {"base": "œ", "remplacement": "&oelig;"},
        {"base": "€", "remplacement": "&euro;"}
    ]
    let contenuText = document.getElementById("contenu");
    let buttonTransform = document.getElementById("transform-contenu")

    // Fonction qui remplace les ponctuations
    function remplacerPonctuation(texte){
        ponctuationRemplacement.forEach(function(ponctuation){
            let regex = new RegExp(`\\s*\\${ponctuation}`, 'g');
            let modif = `&nbsp;${ponctuation}`
            texte = texte.replace(regex, modif);
        }); return texte;
    }
    // Fonction qui remplace les caractères d'accès
    function remplacerCaracteres(texte){
        codeAccessibilite.forEach(function(caractere){
            let regex = new RegExp(`\\${caractere.base}`, 'g');
            texte = texte.replace(regex, caractere.remplacement);
        }); return texte;
    }
    // Fonction qui remplace les espaces après les chiffres et entre les chiffres
    function remplacerEspaceApresChiffre(texte){
        // Remplacement des espaces dans les milliers : ex. "1 120" -> "1&nbsp;120"
        texte = texte.replace(/(\d)\s(?=\d{3})/g, (match, p1) => {return `${p1}&nbsp;`});
        // Remplacement de l'espace avant le symbole "€" : ex. "12 €" -> "12&nbsp;€"
        texte = texte.replace(/(\d)\s(?=&euro;)/g, (match, p1) => {return `${p1}&nbsp;`});
        // Remplacement de l'espace avant "euros"
        texte = texte.replace(/(\d)\s(?=euros)/g, (match, p1) => {return `${p1}&nbsp;`}); 
        // Remplacement de l'espace avant "euro"
        texte = texte.replace(/(\d)\s(?=euro)/g, (match, p1) => {return `${p1}&nbsp;`}); 
        return texte;
    }

    function espaceGuillemets(texte){
        if (langue === "fr"){
            // Si on trouve déjà des guillemets français sans les espaces insécables, on les corrige
            texte = texte.replace(/«\s*([^»]*)\s*»/g, '«&nbsp;$1&nbsp;»')}
        if (langue === "en"){
            // Si on trouve déjà des guillemets anglais sans les espaces insécables, on les corrige
            texte = texte.replace(/"\s*([^"]*)\s*"/g, '"&nbsp;$1&nbsp;"')}
        return texte;
    }

    // Quand on clique sur le bouton pour transformer 
    buttonTransform.addEventListener("click", function(){
        // Variables utilisées
        let langueValue = document.querySelector("html").getAttribute("data-langue");
        let texteBase = contenuText.value;
        // Remplacement pour le rendu brut
        let texteBrut = remplacerPonctuation(texteBase);
        texteBrut = remplacerCaracteres(texteBrut);
        texteBrut = remplacerEspaceApresChiffre(texteBrut);
        // Si la langue est française, on remplace les "" par des guillemets français
        if(langueValue === "fr"){
            let regex = new RegExp(`\\s*"([^"]*)"`, 'g');
            if (regex){
                // Ajout des espaces insécables et suppression des espaces
                texteBrut = texteBrut.replace(regex, "«&nbsp;$1&nbsp;»");
            } else {
                texteBrut = espaceGuillemets(texteBrut)
            }
        } else { // On met les guillemets anglais
            let regex = new RegExp(`\\s*«([^"]*)»`, 'g');
            if (regex){
                // Ajout des espaces insécables et suppression des espaces
                texteBrut = texteBrut.replace(regex, '"&nbsp;$1&nbsp;"')
            } else {
                texteBrut = espaceGuillemets(texteBrut)
            }
        }
        contenuText.value = texteBrut;
    });

})