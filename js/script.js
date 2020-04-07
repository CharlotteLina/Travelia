var lesDestinations=[];
var url=window.location.href;
var laDestinationChoisi=[];

//Modèle pour l'en tête
function htmlHeader()
{
	return 	 '<img src="css/images/logo.png">'+
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
	/*var mybutton = document.getElementById("myBtn");
	window.onscroll = function() {scrollFunction()};
*/
	return 	`<button onclick="topFunction()" id="myBtn" title="Go to top">Top</button>
			<p>© Copyright 2019-2020 Fourel-Gauthier- Tous droits réservés</p>`
}
/*
function scrollFunction() {
	if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
	  mybutton.style.display = "block";
	} else {
	  mybutton.style.display = "none";
	}
  }

  function topFunction() {
	document.body.scrollTop = 0;
	document.documentElement.scrollTop = 0;
  }
*/
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
		temperature(v.id,v.destination);
	};
}

//Récupération de la température et maj du site
function temperature(id,dest){
	//Crée la requète a l'api openweathermap
	var xhttp = new XMLHttpRequest;
		let request='http://api.openweathermap.org/data/2.5/weather?q='+dest+'&appid=551afb494d45ea0dbed796d9c6efc0e6';
		xhttp.open("GET",request,true);

		//Setting de la fonction callback
		xhttp.onload=function()
		{
			let response=JSON.parse(xhttp.response);
			tmp=Math.floor(response.main.temp-273.15);
			document.getElementById(id).innerHTML+= " "+tmp +"°C";
		}
		xhttp.send();
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
				sessionStorage.setItem("prixHotel",v.prixHotel); 



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
		var listeDestination="<FORM> <SELECT id='listeVille' name='dest' size='1''>";
		for (var v of lesDestinations) {
			listeDestination+="<OPTION value='"+v.id+"'>"+v.destination;
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

    //On change la valeur écrite de petitDej
    if(petitDej==true){petitDej="Compris";}
    else{petitDej="Non Compris";}
    
    //On change la valeur de nbAdulte 
    if(nbAdulte==1){nbAdulte=nbAdulte+" adulte"}
    else{nbAdulte=nbAdulte+" adultes"}
    
    //On change la valeur de nbEnfant 
    if(nbEnfant==0){nbEnfant="."}
    else{
        if(nbEnfant==1){nbEnfant=" et "+nbEnfant+ " enfant. "}
        else{bEnfant=" et "+nbEnfant+ " enfants. "}
    }
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
//Lien pour réservation de l'onglet réservation
function reserverChoose() {
	
	var id=document.getElementById('listeVille').value;
	reservation(id);	
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
	var petitDej = document.getElementById("petitDej").checked;
	var infoComple = document.getElementById("infoComple").value;

	var errorZone=document.getElementById("errorMessage");

	//Vérification informations personnelles
	if(nameValue==null||nameValue==""||usernameValue==null||usernameValue==""||email==null||email==""||phone==null||phone=="")
	{
		errorZone.innerHTML="Il faut un nom,un prénom,un email et un numéro de téléphone";
		errorZone.style.visibility="visible";
	}
	else
	{

		var dD=new Date(dateD);
		var dR=new Date(dateR);
		//Vérication saisie des dates
		if(dD=="Invalid Date"||dR=="Invalid Date" )
		{
			errorZone.innerHTML="Il faut une date d'arrivée et de retour";
			errorZone.style.visibility="visible";

		}
		else
		{
			var nbJ=dateDiff(dD,dR);
			//Vérication date cohérente
			if(nbJ<0)
			{
				errorZone.innerHTML="La date de retour doit être supérieur à celle d'arrivée";
				errorZone.style.visibility="visible";

			}
			else
			{
				if(nbAdulte==0)
				{
					errorZone.innerHTML="Il faut au moins un adulte";
					errorZone.style.visibility="visible";
s
				}
				else
				{
					//On créer le numéro de reservation
					var numeroRes=Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
					sessionStorage.setItem("numeroReservation",numeroRes); 
					sessionStorage.setItem("name",nameValue); 
					sessionStorage.setItem("username",usernameValue); 
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
			}
		}

		
	
	}


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
			var prixHotel=sessionStorage.getItem("prixHotel"); 

			var PrixVol=((nbE+nbA)*prixVoyage);
			var PrixHotel=(nbA*prixHotel*nbJ.day)+(nbE*(prixHotel*0.4)*nbJ.day)+((nbE+nbA)*nbJ.day*prixPetitDej);
			var PrixTotal=PrixVol+PrixHotel;
			console.log(PrixTotal);

			lePrix.innerHTML=PrixTotal+"€";

		}

	}
	else
	{
		//mettre le prix a 0
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
