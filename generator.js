document.addEventListener("DOMContentLoaded", function(){
    // Déclaration des variables avec les changements
    let ponctuationRemplacement = [";", ":", "?", "!", "€"];
    let codeAccessibilite = [
        {"base": "oe", "remplacement": "&oelig;"},
        {"base": "œ", "remplacement": "&oelig;"},
        {"base": "€", "remplacement": "&euro;"}
    ]
    let termesRemplacement = [
        { "recherche": "Crédit Mutuel", "remplacement": "Crédit&nbsp;Mutuel" },
        { "recherche": "Alliance Fédérale", "remplacement": "Alliance&nbsp;Fédérale" },
    ]

    // Déclaration des variables utilisées
    let renduTexte = document.getElementById("rendu_texte");
    let rendu_code = document.getElementById("rendu_code");
    let baseTexte = document.getElementById("base");
    let button = document.getElementById("transform_button");

    // Fonction qui remplace les ponctuations
    function remplacerPonctuation(texte, avecStyle = false){
        ponctuationRemplacement.forEach(function(ponctuation){
            let regex = new RegExp(`\\s*\\${ponctuation}`, 'g');
            let style = avecStyle ? `<span style='color: red; font-weight: bold'>&nbsp;${ponctuation}</span>` : `&nbsp;${ponctuation}`;
            texte = texte.replace(regex, style);
        }); return texte;
    }

    // Fonction qui remplace les termes
    function remplacerTermes(texte, avecStyle = false){
        termesRemplacement.forEach(function(terme){
            let regex = new RegExp(terme.recherche, 'gi');
            let style = avecStyle ? `<span style='color: red; font-weight: bold'>${terme.remplacement}</span>` : terme.remplacement;
            texte = texte.replace(regex, style);
        }); return texte;
    }

    // Fonction qui remplace les caractères d'accès
    function remplacerCaracteres(texte, avecStyle = false){
        codeAccessibilite.forEach(function(caractere){
            let regex = new RegExp(`\\${caractere.base}`, 'g');
            let style = avecStyle ? `<span style='color: red; font-weight: bold'>${caractere.remplacement}</span>` : caractere.remplacement;
            texte = texte.replace(regex, style);
        }); return texte;
    }

    function remplacerEspaceApresChiffre(texte, avecStyle = false){
        // Remplacement des espaces dans les milliers : ex. "1 120" -> "1&nbsp;120"
        texte = texte.replace(/(\d)\s(?=\d{3})/g, (match, p1) => {
            return `${p1}&nbsp;`;
        });
        // Remplacement de l'espace avant le symbole "€" : ex. "12 €" -> "12&nbsp;€"
        texte = texte.replace(/(\d)\s(?=&euro;)/g, (match, p1) => {
            return `${p1}&nbsp;`;
        });
        // Remplacement de l'espace avant "euros"
        texte = texte.replace(/(\d)\s(?=euros)/g, (match, p1) => {
            return `${p1}&nbsp;`;
        }); 
        // Remplacement de l'espace avant "euro"
        texte = texte.replace(/(\d)\s(?=euro)/g, (match, p1) => {
            return `${p1}&nbsp;`;
        }); 
        return texte;
    }


    // Quand on clique sur le bouton
    button.addEventListener("click", function(){
        // Variables utilisées
        let langueValue = document.querySelector("html").getAttribute("data-langue");
        let texteBase = baseTexte.value;

        // Remplacement sans style (pour le rendu brut)
        let texteBrut = remplacerPonctuation(texteBase);
        texteBrut = remplacerTermes(texteBrut);
        texteBrut = remplacerCaracteres(texteBrut);
        texteBrut = remplacerEspaceApresChiffre(texteBrut);

        // Remplacement avec style (pour le rendu HTML)
        let texteAvecStyle = remplacerPonctuation(texteBase, true);
        texteAvecStyle = remplacerTermes(texteAvecStyle, true);
        texteAvecStyle = remplacerCaracteres(texteAvecStyle, true);
        texteAvecStyle = remplacerEspaceApresChiffre(texteAvecStyle, true);

        // Si la langue est française, on remplace les "" par des guillemets français
        if(langueValue === "fr"){
            let regex = new RegExp(`"([^"]*)"`, 'g');
            texteAvecStyle = texteAvecStyle.replace(regex, `<span style="color: red; font-weight: bold">«</span>&nbsp;$1&nbsp;<span style="color: red; font-weight: bold">»</span>`);
            texteBrut = texteBrut.replace(regex, "«&nbsp;$1&nbsp;»");
        }

        // Mise en place du texte dans le rendu
        renduTexte.innerHTML = texteAvecStyle; // Texte avec les balises <span>
        rendu_code.value = texteBrut; // Texte brut sans les balises
    });
        
});