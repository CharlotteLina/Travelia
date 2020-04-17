var lesDestinations=[];
var url=window.location.href;
var laDestinationChoisi=[];

var prixMin=0;
var prixMax=2000;
var continent="tous";
var optAnimaux=false;
var optWifi=false;
var mybutton ;
////////////////////////////
///FONCTIONS GENERALES ///
////////////////////////////

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

	return 	`<button onclick="topFunction()" id="myBtn" title="Go to top">
	<img src="css/images/fleche.png" class="flecheDuHaut"></button>
			<p>© Copyright 2019-2020 Fourel-Gauthier- Tous droits réservés</p>`
}

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
 

//Fonction pour le chargement de toute les pages
function initLoad()
{

	//Chargement de l'en tête & pied de page
	document.querySelector('header').innerHTML +=htmlHeader();
	document.querySelector('footer').innerHTML +=htmlFooter();

	//Preparation pour le chargement des différentes pages
	var url=window.location.href;
	let testHome=url.indexOf("index");
	let testReservation=url.indexOf("reservation");
	let testRecapitulatif=url.indexOf("recapitulatif");

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
	});
	
}

////////////////////////////
///FONCTION POUR ACCUEIL ///
////////////////////////////

//Fonction pour le chargement de la page accueil
function chargementPageIndex()
{
	
	var template = document.querySelector("#templateVoyage");
	for (var v of lesDestinations) {
		//On met à jour le prix Max
		let clone = document.importNode(template.content, true);   
		newContent = clone.firstElementChild.innerHTML	
			.replace(/{{destination}}/g, v.destination)		
			.replace(/{{prix}}/g, v.prixVoyage)
			.replace(/{{monId}}/g, v.id);	
		
		clone.firstElementChild.innerHTML = newContent;
		clone.firstElementChild.style.backgroundImage=v.image;
		clone.firstElementChild.id=v.ShortName;
		document.getElementById('containeVoyage').appendChild(clone);
		temperature(v.id,v.destination);
	};
		slidderFunction();

}
function changementDestination()
{
	//ajoute et trie en fonction des val
	var template = document.querySelector("#templateVoyage");
	for (var v of lesDestinations) {
		$( "#"+v.ShortName ).remove();

	}
	continent=document.getElementById('continent-select').value;


	for (var v of lesDestinations) {
		//trie en fonction du prix
		if(v.prixVoyage>=prixMin&&v.prixVoyage<=prixMax)
		{
			if(continent=="tous"||continent==v.continent)
			{
				if(optAnimaux==false||optAnimaux==v.animaux)
				{
					if(optWifi==false||optWifi==v.wifi)
					{
						let clone = document.importNode(template.content, true);   
						newContent = clone.firstElementChild.innerHTML	
						.replace(/{{destination}}/g, v.destination)		
						.replace(/{{prix}}/g, v.prixVoyage)
						.replace(/{{monId}}/g, v.id);	
						clone.firstElementChild.innerHTML = newContent;
						clone.firstElementChild.style.backgroundImage=v.image;
						clone.firstElementChild.id=v.ShortName;
						document.getElementById('containeVoyage').appendChild(clone);
						temperature(v.id,v.destination);
					}
				}
			}
		}
	};

}

function animauxChange(){

	optAnimaux=document.getElementById("optAnimaux").checked;
	changementDestination();
}
function wifiChange(){

	optWifi=document.getElementById("optWiFi").checked;
	changementDestination();
}

//Fonction pour le slidder
function slidderFunction(){
	$( function () {
		$( "#slider-range" ).slider({
  range: true,
  min: 0,
  max: 1500,
  step:20,
  values: [ 50, 1500 ],
  slide: function( event, ui ) {
	$( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
	prixMax=ui.values[1];
	prixMin=ui.values[0];
  }
		});
	$( "#amount" ).val( prixMin + " € - "+ prixMax +" €");
	console.log("lesDestination") 
} );
}
function getVals(){
// Get slider values
var parent = this.parentNode;
var slides = parent.getElementsByTagName("input");
  var slide1 = parseFloat( slides[0].value );
  var slide2 = parseFloat( slides[1].value );
// Neither slider will clip the other, so make sure we determine which is larger
if( slide1 > slide2 ){ var tmp = slide2; slide2 = slide1; slide1 = tmp; }

var displayElement = parent.getElementsByClassName("rangeValues")[0];
	displayElement.innerHTML = "$ " + slide1 + "k - $" + slide2 + "k";
}
window.onload = function(){
// Initialize Sliders
var sliderSections = document.getElementsByClassName("range-slider");
	for( var x = 0; x < sliderSections.length; x++ ){
	  var sliders = sliderSections[x].getElementsByTagName("input");
	  for( var y = 0; y < sliders.length; y++ ){
		if( sliders[y].type ==="range" ){
		  sliders[y].oninput = getVals;
		  // Manually trigger event first time to display values
		  sliders[y].oninput();
		}
	  }
	}
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

////////////////////////////////
///FONCTION POUR RESERVATION ///
////////////////////////////////

//Lien pour la réservation
function reservation(id)
{
	window.location.assign("http://127.0.0.1:5500/reservation.html?id="+id);
}
//Lien pour réservation de l'onglet réservation
function reserverChoose() {
	
	var id=document.getElementById('listeVille').value;
	reservation(id);	
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
				document.getElementById('containerReservation').appendChild(cloneId);	
				let image=document.getElementById('imageDest');
				image.style.backgroundImage=v.imageRes;
				image.style.backgroundSize="cover";
				sessionStorage.setItem("ville",v.destination); 
				sessionStorage.setItem("descriptionVille",v.description); 

				//On conserve les prix 
				sessionStorage.setItem("prixVoyage",v.prixVoyage); 
				sessionStorage.setItem("prixHotel",v.prixHotel); 



			}	
		};


	//Ouverture de la page sans choix initial la liste
	if(idReservation==undefined )
	{
		//Récupération du template
		let templateWithoutId = document.querySelector("#templateReservationWithoutId");

		//Récupération des destionation
		var listeDestination="<FORM> <SELECT id='listeVille' name='dest' size='1' class='resSelect'>";
		for (var v of lesDestinations) {
			listeDestination+="<OPTION value='"+v.id+"'>"+v.destination;
		};
		listeDestination+="</SELECT></FORM>";
			console.log(v.destination);
			let clone = document.importNode(templateWithoutId.content, true);
			newContent = clone.firstElementChild.innerHTML
				.replace(/{{ListeVille}}/g, listeDestination)
			clone.firstElementChild.innerHTML = newContent;
			document.getElementById('containerReservation').appendChild(clone);		
	}
}
//Fonction pour valider le formulaire
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

	//Vérification informations personnelles
	if(nameValue==null||nameValue==""||usernameValue==null||usernameValue==""||email==null||email==""||phone==null||phone=="")
	{
		majErrorZone("Il faut un nom,un prénom,un email et un numéro de téléphone");
	}
	else
	{
		var resDate=ValiderDateDepart(dateD);
		var resEmail=ValiderEmail(email);
		var resTelephone=ValiderTelephone(phone);

		if(resDate==true && resEmail==true && resTelephone ==true)
		{
			var dD=new Date(dateD);
			var dR=new Date(dateR);
			//Vérication saisie des dates
			if(dD=="Invalid Date"||dR=="Invalid Date" )
			{
				majErrorZone("Il faut une date d'arrivée et de retour");
			}
			else
			{
				var nbJ=dateDiff(dD,dR);
				//Vérication date cohérente
				if(nbJ.day<0)
				{
					majErrorZone("La date de retour doit être supérieur à celle d'arrivée");
				}
				else
				{
					if(nbAdulte==0)
					{
						majErrorZone("Il faut au moins un adulte");
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


}

function majErrorZone(text)
{
	var errorZone=document.getElementById("errorMessage");
	errorZone.innerHTML=text;
	errorZone.style.visibility="visible";
	topFunction();

}
//Fonction pour calculer le prix
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
	if(dD!="Invalid Date")
	{
		ValiderDateDepart(document.getElementById("dateDepart").value);

	}
	if(dD!="Invalid Date"&&dR!="Invalid Date" && nbA!=0)
 	{
		//On calcule de nombre de jour
		var nbJ=dateDiff(dD,dR);
		if(nbJ.day<0)
		{
			//AFFICHER UN MESSAGE DERREUR
			majErrorZone("La date de retour ne peut pas être antérieur à la date de l'aller");
			lePrix.innerHTML="0€";


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

			var PrixVol=((nbA*prixVoyage)+(nbE*prixVoyage*0.4));
			
			var PrixHotel=(nbA*prixHotel*nbJ.day)+(nbE*(prixHotel*0.4)*nbJ.day)+((nbE+nbA)*nbJ.day*prixPetitDej);
			var PrixTotal=PrixVol+PrixHotel;
			sessionStorage.setItem("prixTotalVol",PrixVol);
			sessionStorage.setItem("prixTotalHotel",PrixHotel);

			lePrix.innerHTML=PrixTotal+"€";

		}

	}
	else
	{
		lePrix.innerHTML="0€";
	}
}
//Verifiier date de depart superieur a date aujourd'huii
function ValiderDateDepart(dateDep)
{
	var errorZone=document.getElementById("errorMessage");
	console.log("here");
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();

	console.log(dateDep);
	var dateDepC=dateDep.split('-');
	if(dateDepC[0]>=yyyy&&dateDepC[1]>=mm&&dateDepC[2]>=dd)
	{
		errorZone.innerHTML="";
		errorZone.style.visibility="hidden";
		return true;
	}
	else
	{
		majErrorZone("Date de départ doit être supérieur à aujourd'hui");
		return false;
	}
} 
//Vérification téléphone
function ValiderTelephone(phoneNum)
{
  	if(/^\d{10}$/.test(phoneNum))
	{
	return true;
	}
		majErrorZone("Numéro de téléphone invalide (Exemple : 0601020304)");
		return false;
	
}
//Verification email
function ValiderEmail(mail) 
{
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
	{
		return true;
	}
	majErrorZone("Email invalide (Exemple : test@email.fr)");


	return false;
}


//////////////////////////////////
///FONCTION POUR RECAPITULATIF ///
//////////////////////////////////

//Lien pour le récapitulatif
function recapitulatif(numeroRes)
{
	//AJOUTER ID RESERVATION
	window.location.assign("http://127.0.0.1:5500/recapitulatif.html?id+"+numeroRes);
}
//Fonction pour le chargement de la page récapitulatif
function chargementPageRecapitulatif()
{
	//On récupère le valeur selectionné général
	var ville = sessionStorage.getItem("ville"); 
	var numRes = sessionStorage.getItem("numeroReservation"); 

	//On récupere les valeur pour la zone personnelles
	var name = sessionStorage.getItem("name"); 
	var username = sessionStorage.getItem("username"); 
	var phone = sessionStorage.getItem("phone"); 
	var email = sessionStorage.getItem("email");

	//On récupere pour la zone du voyage
	var dateDepart = sessionStorage.getItem("dateD"); 
	var dateRetour = sessionStorage.getItem("dateR");	
	var nbAdulte = sessionStorage.getItem("nbAdulte"); 
	var nbEnfant = sessionStorage.getItem("nbEnfant");	
	var petitDej = sessionStorage.getItem("petitDej"); 
	var infoComple = sessionStorage.getItem("infoComple");
	var descritionVoyage=sessionStorage.getItem("descriptionVille"); 
	
	//On récupère les valeurs pour les dates
	var dateD=dateDepart.split('-');
	moisAller=getMoisDate(dateD[1]);
	var dateR=dateRetour.split('-');
	moisRetour=getMoisDate(dateR[1]);

	//On change la valeur pour adulte
	var textAdulte;
    if(nbAdulte==1){textAdulte=nbAdulte+" adulte";}
	else{textAdulte=nbAdulte+" adultes";}
	
	//On change la valeur de nbEnfant 
	var textEnfant;
    if(nbEnfant==0){textEnfant="."}
    else{
        if(nbEnfant==1){textEnfant=" et "+nbEnfant+ " enfant. ";}
        else{textEnfant=" et "+nbEnfant+ " enfants. ";}
	}

	//On change la valeur écrite de petitDej
	if(petitDej){petitDej="Petit déjeuner compris.";}
	else{petitDej="Petit déjeuner NON compris";}

	//On change la valeur des infoComple
	if(!infoComple){infoComple="";}
	else{infoComple="<div>Infos complémentaires:"+infoComple+"</div>"}

	//On prepare les variables
	var lesDates=dateD[2]+ " "+ moisAller+ " "+ dateD[0]+" au " +dateR[2]+ " "+ moisRetour+ " "+ dateR[0];
	var lesVoyageurs=textAdulte+ textEnfant;
	var autreInfo=petitDej+infoComple;

	//On récupere les variables pour le prix
	var prixVol=sessionStorage.getItem("prixTotalVol"); 
	var prixHotel=sessionStorage.getItem("prixTotalHotel"); 			
	var prixUnitaireVol=sessionStorage.getItem("prixVoyage"); 
	var prixUnitaireHotel=sessionStorage.getItem("prixHotel"); 
	var petitDej=12;
	var prixTotal=new Number(prixVol)+new Number(prixHotel);
	var nbJ=dateDiff(new Date(dateDepart),new Date(dateRetour));

	//Calcul des prix adultes
	var prixAdulteVol=prixUnitaireVol*nbAdulte;
	var prixAdulteHotel=prixUnitaireHotel*nbAdulte*nbJ.day;
	var prixAdultePetitDej=petitDej*nbAdulte*nbJ.day;
	//Calcul des priix enfants

	var ContentEnfant="";
	if(nbEnfant>0)
	{
		var prixEnfantVol=prixUnitaireVol*nbEnfant*0.4;
		var prixEnfantHotel=prixUnitaireHotel*nbEnfant*0.4*nbJ.day;
		var prixEnfantPetitDej=petitDej*nbEnfant*nbJ.day;	
		ContentEnfant="<tr><th>Enfant</th>"+
							"<td>"+nbEnfant+"</td>"+
							"<td>"+prixEnfantVol+" €</td>"+
							"<td>"+prixEnfantHotel+" €</td>"+
							"<td>"+prixEnfantPetitDej+"€</td>"+
						"</tr>";
	}
	var Content="<table><tr><th></th><th>Passagers</th><th>Vol</th><th>Hotel</th><th>Petit déjeuner</th></tr><tr><th>Adulte</th>"+
							"<td>"+nbAdulte+"</td>"+
							"<td>"+prixAdulteVol+" €</td>"+
							"<td>"+prixAdulteHotel+" €</td>"+
							"<td>"+prixAdultePetitDej+"€</td>"+
						"</tr>"+ContentEnfant+"</table>";

	//Récupération des template
	let templateRecap = document.querySelector("#templateRecapitulatif");

	//On met en place directement dans la vie
	let cloneRecap = document.importNode(templateRecap.content, true); 
	newContent=cloneRecap.firstElementChild.innerHTML
		.replace(/{{villeName}}/g, ville)
		.replace(/{{numeroReservation}}/g, numRes)

		.replace(/{{name}}/g, name)
		.replace(/{{username}}/g, username)
		.replace(/{{email}}/g, email)
		.replace(/{{phone}}/g, phone)

		.replace(/{{descriptionDestination}}/g,descritionVoyage)
		.replace(/{{lesDates}}/g,lesDates)
		.replace(/{{lesVoyageurs}}/g,lesVoyageurs)
		.replace(/{{autresInformation}}/g,autreInfo)

		.replace(/{{theTable}}/g,Content)

		.replace(/{{prixTotal}}/g,prixTotal);
		
	cloneRecap.firstElementChild.innerHTML = newContent;
	document.getElementById('recapitulatif').appendChild(cloneRecap);
}

////////////////////////////
///FONCTION COMPLEMENTAIRES ///
////////////////////////////

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
//Fonction pour récuperer parametre dans URL
function getUrlParam() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
//Fonction pour avoir le mois écrit en toute lettre
function getMoisDate(number)
{
	console.log(number);
	switch (number) {
		case '01':
			return "janvier";break;
		case '02':
			return "février";break;		
		case '03':
			return "mars";break;		
		case '04':
			return "avril";break;		
		case '05':
			return "mai";break;		
		case '06':
			return "juin";break;		
		case '07':
			return "juillet";break;		
		case '08':	
			return "aout";break;		
		case '09':
			return "septembre";break;		
		case '10':
			return "octobre";break;	
		case '11':
			return "novembre";break;
		case '12':
			return "décembre";break;	
		default:
			break;
	}
}


// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {
	mybutton = document.getElementById("myBtn");
	scrollFunction()
};

function scrollFunction() {
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}


