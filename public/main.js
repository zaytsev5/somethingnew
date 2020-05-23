	
const buttons= document.querySelectorAll('button');
const apiButton = document.querySelector('#btn');

let setnums = 0;
console.log(buttons.length)
let trips;
 getApis();
 async function  getApis(){
	const response = await fetch('http://localhost:5000/trip');
    const myJson = await response.json();
    trips = myJson;
}

	buttons.forEach((btn) =>{
	  btn.addEventListener('click',(e)=>{
	  	if(e.target.className.includes("selected")) {
	  		btn.classList.remove("selected");
	  		setnums --;
	  	}
	 	else if(setnums < 5){
	    	btn.classList.add("selected")
	    	setnums ++;
	 	}
	 	else{
	 		alert("Bạn đã chọn đủ số ghế tối đa !")
	 	}
	    
	  });
	});

function active(){
	buttons.forEach((btn) =>{
	 	btn.classList.remove("active");
	});
}
const app = {
    pages: [],
    show: new Event('show'),
    init: function(){
        app.pages = document.querySelectorAll('.page');
        app.pages.forEach((pg)=>{
            pg.addEventListener('show', app.pageShown);
        })
        
        document.querySelectorAll('.nav-link').forEach((link)=>{
            link.addEventListener('click', app.nav);
        })
        history.replaceState({}, 'Home', '#home');
        window.addEventListener('popstate', app.poppin);
    },
    nav: function(ev){
        ev.preventDefault();
        let currentPage = ev.target.getAttribute('data-target');
        // reset all
        document.querySelector('.active').classList.remove('active');
        // set link to active
        document.getElementById(currentPage).classList.add('active');
        console.log(currentPage)

        history.pushState({}, currentPage, `#${currentPage}`);
        document.getElementById(currentPage).dispatchEvent(app.show);
    },
    pageShown: function(ev){
        console.log('Page', ev.target.id, 'just shown');
        let h1 = ev.target.querySelector('h1');
        h1.classList.add('big')
        setTimeout((h)=>{
            h.classList.remove('big');
        }, 1200, h1);
    },
    poppin: function(ev){
        console.log(location.hash, 'popstate event');
        let hash = location.hash.replace('#' ,'');
        document.querySelector('.active').classList.remove('active');
        document.getElementById(hash).classList.add('active');
        console.log(hash)
        //history.pushState({}, currentPage, `#${currentPage}`);
        document.getElementById(hash).dispatchEvent(app.show);
    }
}

// document.addEventListener('DOMContentLoaded', app.init);

 