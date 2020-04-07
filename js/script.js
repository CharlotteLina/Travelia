var lesDestinations=[];
var url=window.location.href;
var laDestinationChoisi=[];

//Modèle pour l'en tête
function htmlHeader()
{
	return 	 '<img src="css/images/test.png">'+
			 '<h1>Travelia</h1>'+
			 '<nav> <ul> '+
             '<li><a href="/index.html">Accueil</a></li>'+
             '<li><a href="reservation.html">Réservation</a></li>'+
             '<li><a href="contact.html">A propos & Contact</a></li>'+
             '</ul> </nav> '
}

//Modèle pour le pied de page
function htmlFooter()
{
	return 	 '<p>© Copyright 2019-2020 Fourel-Gauthier- Tous droits réservés</p>'
}


function initLoad()
{

	//Chargement de l'en tête & pied de page
	document.querySelector('header').innerHTML +=htmlHeader();
	document.querySelector('footer').innerHTML +=htmlFooter();

	//Preparation pour le chargement des différentes pages
	let testHome=url.indexOf("index");
	let testReservation=url.indexOf("reservation");
	let testRecapitulatif=url.indexOf("recapitulatif");
	let testAproposContact=url.indexOf("contact");

	//Chargement des différentes destinations
	fetch("http://127.0.0.1:5500/voyages.json").then(response => response.json()).then(response => {
		lesDestinations=response;
		console.log(lesDestinations);
		//Chargement de la page d'accueil
		if(testHome!=-1)
		{
			chargementPageIndex()
		}
		//Chargement de la page de réservation
		if(testReservation!=-1)
		{
			chargementPageReservation()

		}
		//Chargement de la page de récapitulatif
		if(testRecapitulatif!=-1)
		{
			chargementPageRecapitulatif()

		}
		
		//Chargement de la page à propos & contact
		if(testAproposContact!=-1)
		{

		}
	});


	
}


//Fonction pour le chargement de la page accueil
function chargementPageIndex()
{
	var template = document.querySelector("#templateVoyage");
	for (var v of lesDestinations) {					
		let clone = document.importNode(template.content, true);   
		newContent = clone.firstElementChild.innerHTML	
			.replace(/{{destination}}/g, v.destination)		
			.replace(/{{prix}}/g, v.prixVoyage)
			.replace(/{{monId}}/g, v.id);	
		clone.firstElementChild.innerHTML = newContent;
		clone.firstElementChild.style.backgroundImage=v.image;
		document.getElementById('containeVoyage').appendChild(clone);			
	};
}

//Fonction pour le chargement de la page réservation
function chargementPageReservation()
{

	//Ouverture page réservation avec un id choisi 
	var idReservation = getUrlParam()["id"];

		//Récupération du template
		let templateWithId = document.querySelector("#templateReservationWithId");

		//Récupération de la destionation choisi
		for (var v of lesDestinations) {
			if(v.id===idReservation)	
			{			
				laDestinationChoisi=v;
				let cloneId = document.importNode(templateWithId.content, true);   
				newContent = cloneId.firstElementChild.innerHTML	
					.replace(/{{villeId}}/g, v.destination)
					.replace(/{{Description}}/g, v.description);
				cloneId.firstElementChild.innerHTML = newContent;
				document.getElementById('containerReservationWithId').appendChild(cloneId);	
				let image=document.getElementById('imageDest');
				image.style.backgroundImage=v.imageRes;
				image.style.backgroundSize="cover";
				sessionStorage.setItem("ville",v.destination); 
				
				//On conserve les prix 
				sessionStorage.setItem("prixVoyage",v.prixVoyage); 
				sessionStorage.setItem("prixAdulte",v.prixAdulte); 
				sessionStorage.setItem("prixEnfant",v.prixEnfant); 



			}	
		};


	//Ouverture de la page sans choix initial la liste
	if(idReservation==undefined )
	{
		//Récupération des template
		let templateTitle = document.querySelector("#TitleReservation");
		let templateWithoutId = document.querySelector("#templateReservationWithoutId");

		//Mise a jour titre
		let cloneTitle = document.importNode(templateTitle.content, true);   
		document.getElementById('containerReservationWithoutId').appendChild(cloneTitle);	


		//Récupération des destionation
		var listeDestination="<FORM> <SELECT name='dest' size='1''>";
		for (var v of lesDestinations) {
			listeDestination+="<OPTION>"+v.destination;
		};
		listeDestination+="</SELECT></FORM>";
			console.log(v.destination);
			let clone = document.importNode(templateWithoutId.content, true);
			newContent = clone.firstElementChild.innerHTML
				.replace(/{{ListeVille}}/g, listeDestination)
			clone.firstElementChild.innerHTML = newContent;
			document.getElementById('containerReservationWithoutId').appendChild(clone);		

	}

}

function chargementPageRecapitulatif()
{

	//On récupère le valeur selectionné
	var ville = sessionStorage.getItem("ville"); 
	var numRes = sessionStorage.getItem("numeroReservation"); 

	var name = sessionStorage.getItem("name"); 
	var username = sessionStorage.getItem("username"); 
	var phone = sessionStorage.getItem("phone"); 
	var email = sessionStorage.getItem("email");
	var dateD = sessionStorage.getItem("dateD"); 
	var dateR = sessionStorage.getItem("dateR");	
	var nbAdulte = sessionStorage.getItem("nbAdulte"); 
	var nbEnfant = sessionStorage.getItem("nbEnfant");	
	var petitDej = sessionStorage.getItem("petitDej"); 
	var infoComple = sessionStorage.getItem("infoComple");

	//Récupération des template
	let templateRecap = document.querySelector("#templateRecapitulatif");

	console.log(templateRecap);
	//Mise a jour titre
	let cloneRecap = document.importNode(templateRecap.content, true); 
	newContent=cloneRecap.firstElementChild.innerHTML
		.replace(/{{villeName}}/g, ville)
		.replace(/{{name}}/g, name)
		.replace(/{{username}}/g, username)
		.replace(/{{email}}/g, email)
		.replace(/{{phone}}/g, phone)
		.replace(/{{dateDepart}}/g, dateD)		
		.replace(/{{dateRetour}}/g, dateR)
		.replace(/{{nbAdulte}}/g, nbAdulte)
		.replace(/{{nbEnfant}}/g, nbEnfant)		
		.replace(/{{petitDej}}/g, petitDej)
		.replace(/{{infosCompl}}/g, infoComple)	
		.replace(/{{numeroReservation}}/g, numRes);
	cloneRecap.firstElementChild.innerHTML = newContent;
	console.log(newContent);
	document.getElementById('recapitulatif').appendChild(cloneRecap);


}

function recapitulatif(numeroRes)
{
	//AJOUTER ID RESERVATION
	window.location.assign("http://127.0.0.1:5500/recapitulatif.html?id+"+numeroRes);

}

//Lien pour la réservation
function reservation(id)
{
	window.location.assign("http://127.0.0.1:5500/reservation.html?id="+id);
}

function validForm()
{
	//On récupère les informations personnelles
	var nameValue = document.getElementById("name").value;
	var usernameValue = document.getElementById("username").value;
	var email = document.getElementById("email").value;
	var phone = document.getElementById("phone").value;

	//On récupère les informations du voyage
	var dateD = document.getElementById("dateDepart").value;
	var dateR = document.getElementById("dateRetour").value;
	var nbAdulte = document.getElementById("nbAdulte").value;
	var nbEnfant = document.getElementById("nbEnfant").value;
	var petitDej = document.getElementById("petitDej").value;
	var infoComple = document.getElementById("infoComple").value;


	//FAIRE TOUT LES TESTS POUR CHAQUE CHAMPS AVANT LE RESTE

	//On créer le numéro de reservation
	var numeroRes=Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

	sessionStorage.setItem("numeroReservation",numeroRes); 
	sessionStorage.setItem("name",nameValue); 
	sessionStorage.setItem("email",email); 
	sessionStorage.setItem("phone",phone); 
	sessionStorage.setItem("dateD",dateD); 	
	sessionStorage.setItem("dateR",dateR); 
	sessionStorage.setItem("nbAdulte",nbAdulte); 	
	sessionStorage.setItem("nbEnfant",nbEnfant); 
	sessionStorage.setItem("petitDej",petitDej); 	
	sessionStorage.setItem("infoComple",infoComple); 

	recapitulatif(numeroRes);

}

function getUrlParam() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function calculerPrix()
{

	//On récupere les deux dates
	var dD= new Date(document.getElementById("dateDepart").value);
	var dR= new Date(document.getElementById("dateRetour").value);
	var nbA= new Number(document.getElementById("nbAdulte").value);
	var nbE= new Number(document.getElementById("nbEnfant").value);
	var petitDej=document.getElementById("petitDej").checked;
	var lePrix= document.getElementById("thePrice");

	//Si une des dates est vide
	if(dD!="Invalid Date"&&dR!="Invalid Date" && nbA!=0)
 	{
		//On calcule de nombre de jour
		var nbJ=dateDiff(dD,dR);
		console.log(nbJ.day);
		if(nbJ.day<0)
		{
			//AFFICHER UN MESSAGE DERREUR
			console.log("La date de retour ne peut pas être antérieur à la date de l'aller");
		}
		//On a un nombre de jour positif 
		else
		{
			var prixPetitDej=0;
			console.log(petitDej);
			if(petitDej==true)
			prixPetitDej=12;

			console.log(prixPetitDej)
			//On récupère les variables nécessaires
			var prixVoyage=sessionStorage.getItem("prixVoyage"); 
			var prixAdulte=sessionStorage.getItem("prixAdulte"); 
			var prixEnfant=sessionStorage.getItem("prixEnfant"); 

			var PrixVol=((nbE+nbA)*prixVoyage);
			var PrixHotel=(nbA*prixAdulte*nbJ.day)+(nbE*prixEnfant*nbJ.day)+((nbE+nbA)*nbJ.day*prixPetitDej);
			var PrixTotal=PrixVol+PrixHotel;
			console.log(PrixTotal);

			lePrix.innerHTML=PrixTotal+"€";

		}

	}
	else
	{
		//mettre le prix à 0
	}
}


//Calcule du nombre de jour
function dateDiff(date1, date2){
    var diff = {}                           // Initialisation du retour
    var tmp = date2 - date1;
 
    tmp = Math.floor(tmp/1000);             // Nombre de secondes entre les 2 dates
    diff.sec = tmp % 60;                    // Extraction du nombre de secondes

    tmp = Math.floor((tmp-diff.sec)/60);    // Nombre de minutes (partie entière)
    diff.min = tmp % 60;                    // Extraction du nombre de minutes
 
    tmp = Math.floor((tmp-diff.min)/60);    // Nombre d'heures (entières)
    diff.hour = tmp % 24;                   // Extraction du nombre d'heures
     
    tmp = Math.floor((tmp-diff.hour)/24);   // Nombre de jours restants
    diff.day = tmp;
     
    return diff;
}
