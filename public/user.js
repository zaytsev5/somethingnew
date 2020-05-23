

const app = {
    pages: [],
    show: new Event('show'),
    init: function(){
        let hash = location.hash.replace('#' ,'');
        app.pages = document.querySelectorAll('.form');
        console.log(app.pages)
        app.pages.forEach((pg)=>{
            pg.addEventListener('show', app.pageShown);
        })
        document.querySelectorAll('.single').forEach((link)=>{
            link.addEventListener('click', app.nav);
        })
            history.replaceState({}, 'dangnhap', '#dangnhap');
     
        document.querySelector('.active').classList.remove('active');
         document.getElementById(hash).classList.add('active');
        console.log(hash)
        window.addEventListener('popstate', app.poppin);
    },
    nav: function(ev){
        ev.preventDefault();
        let currentPage = ev.target.getAttribute('data-target');
        console.log(currentPage)
        // reset all
        document.querySelector('.active').classList.remove('active');
        // set link to active
        document.getElementById(currentPage).classList.add('active');
        history.pushState({}, currentPage, `#${currentPage}`);
        console.log(location.href)
        document.getElementById(currentPage).dispatchEvent(app.show);
    },
    pageShown: function(ev){
        console.log('Page', ev.target.id, 'just shown');
       
    },
    poppin: function(ev){
        console.log(location.hash, 'popstate event');
        let hash = location.hash.replace('#' ,'');
        document.querySelector('.active').classList.remove('active');
        document.getElementById(hash).classList.add('active');
        console.log(hash)
        history.pushState({}, hash, `#${hash}`);
        console.log(location.href)
        document.getElementById(hash).dispatchEvent(app.show);
    }
}
document.addEventListener('DOMContentLoaded', app.init);