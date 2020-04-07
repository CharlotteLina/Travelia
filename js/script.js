var lesDestinations=[];
var url=window.location.href;
var laDestinationChoisi=[];

//Modèle pour l'en tête
function htmlHeader()
{
	return 	 '<img src="css/images/test.png">'+
			 '<h1>Travelia</h1>'+
			 '<nav> <ul> '+
             '<li><a href="index.html">Accueil</a></li>'+
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
			.replace(/{{prix}}/g, v.prix)
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
	let idReservation = url.split('=');
	console.log(idReservation);
		//Récupération du template
		let templateWithId = document.querySelector("#templateReservationWithId");
	
		//Récupération de la destionation choisi
		for (var v of lesDestinations) {
			if(v.id===idReservation[1])	
			{			
				laDestinationChoisi=v;
				console.log(laDestinationChoisi);
				let cloneId = document.importNode(templateWithId.content, true);   
				newContent = cloneId.firstElementChild.innerHTML	
				.replace(/{{villeId}}/g, v.destination)	
				cloneId.firstElementChild.innerHTML = newContent;
				document.getElementById('containerReservationWithId').appendChild(cloneId);		
			}
		};

	//Ouverture de la page sans choix initial la liste
	if(idReservation.length==1)
	{
		console.log("here");
		//Récupération du template
		let templateWithoutId = document.querySelector("#templateReservationWithoutId");
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
	console.log("yes");
}

function recapitulatif(name, ursname)
{
	window.location.assign("http://127.0.0.1:5500/recapitulatif.html?name="+name+"/ursname="+ursname);
	console.log(recap);
}

//Lien pour la réservation
function reservation(id)
{
	window.location.assign("http://127.0.0.1:5500/reservation.html?id="+id);
}

function validForm()
{
	var leRecap=[];
	var nameValue = document.getElementById("name").value;
	//REMPLIR LE RECAP AVEC CHAQUE VALEUR ET VERIFIER AVANT DE PASSER LA PAGE DAPRES
	leRecap={name:nameValue, surname:nameValue};
	console.log(leRecap);
	recapitulatif(nameValue, nameValue);

}


