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
	console.log(idReservation);
		//Récupération du template
		let templateWithId = document.querySelector("#templateReservationWithId");
		//Récupération de la destionation choisi
		for (var v of lesDestinations) {
			if(v.id===idReservation)	
			{			
				laDestinationChoisi=v;
				console.log(laDestinationChoisi);
				let cloneId = document.importNode(templateWithId.content, true);   
				newContent = cloneId.firstElementChild.innerHTML	
					.replace(/{{villeId}}/g, v.destination)	
				cloneId.firstElementChild.innerHTML = newContent;
				document.getElementById('containerReservationWithId').appendChild(cloneId);	
				
				let header=document.querySelector('header');
				console.log(header);

			}	
		};

	//Ouverture de la page sans choix initial la liste
	if(idReservation==undefined )
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

function getUrlParam() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

