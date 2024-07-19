document.addEventListener("DOMContentLoaded", function() {
    /** Header **/
    
     // Récupérer tous les liens de navigation
     var navLinks = document.querySelectorAll(".nav-icons a");
 
     // Fonction pour déterminer la section actuellement visible
     function getActiveSection() {
         var sections = document.querySelectorAll("section");
         var scrollPosition = window.scrollY;
 
         for (var i = 0; i < sections.length; i++) {
             var currentSection = sections[i];
             var sectionTop = currentSection.offsetTop;
             var sectionBottom = sectionTop + currentSection.offsetHeight;
 
             if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                 return currentSection.id;
             }
         }
 
         // Si aucune section n'est entièrement visible, retourner l'ID de la première section
         return sections[0].id;
     }
 
     // Fonction pour mettre à jour la classe active
     function updateActiveLink() {
         var activeSection = getActiveSection();
         navLinks.forEach(function(link) {
             if (link.getAttribute("href") === "#" + activeSection) {
                 link.classList.add("active");
             } else {
                 link.classList.remove("active");
             }
         });
     }
 
     // Mettre à jour la classe active lors du chargement de la page et du défilement
     updateActiveLink();
     window.addEventListener("scroll", updateActiveLink);
 
     // Mettre à jour la classe active lors du clic sur un lien de navigation
     navLinks.forEach(function(link) {
         link.addEventListener("click", function(event) {
             event.preventDefault(); // Empêcher le comportement par défaut du lien
             var targetId = this.getAttribute("href").slice(1); // Récupérer l'ID de la section cible
             var targetSection = document.getElementById(targetId); // Trouver la section cible
             var targetOffset = targetSection.offsetTop; // Calculer le décalage de la section cible
             window.scrollTo({ top: targetOffset, behavior: "smooth" }); // Faire défiler jusqu'à la section cible
         });
     });
 });
 

/** Contact Envoi **/

document.getElementById('contact-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Empêche la soumission par défaut du formulaire

        const form = event.target;
        const data = new FormData(form);
        const formRect = form.getBoundingClientRect();
        const confirmationMessage = document.getElementById('confirmation-message');
        const errorMessage = document.getElementById('error-message');

        // Afficher le message pour calculer sa largeur correcte
        confirmationMessage.style.display = 'block';
        errorMessage.style.display = 'block';
        
        // Positionner les messages juste en dessous du formulaire et centré
        const formCenter = formRect.left + (formRect.width / 2);
        const confirmationWidth = confirmationMessage.offsetWidth;
        const errorWidth = errorMessage.offsetWidth;

        confirmationMessage.style.top = `${formRect.bottom + window.scrollY + 10}px`;
        confirmationMessage.style.left = `${formCenter - (confirmationWidth / 2)}px`;
        errorMessage.style.top = `${formRect.bottom + window.scrollY + 10}px`;
        errorMessage.style.left = `${formCenter - (errorWidth / 2)}px`;

        // Cacher les messages jusqu'à ce qu'on sache le résultat
        confirmationMessage.style.display = 'none';
        errorMessage.style.display = 'none';

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: data
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                confirmationMessage.style.display = 'block';
                errorMessage.style.display = 'none';
                form.reset(); // Réinitialise le formulaire
                setTimeout(() => {
                    confirmationMessage.style.display = 'none';
                }, 5000); // Cache le message après 5 secondes
            } else {
                errorMessage.style.display = 'block';
                confirmationMessage.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            errorMessage.style.display = 'block';
            confirmationMessage.style.display = 'none';
        });
    });

    