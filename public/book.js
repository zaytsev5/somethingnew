
  const app = {
    pages: [],
    show: new Event('show'),
    init: function(){

        app.pages = document.querySelectorAll('.page');
        app.pages.forEach((pg)=>{
            pg.addEventListener('show', app.pageShown);
        })

        if( window.location.search.slice() == "")
            history.replaceState({}, 'Step1', '#step1');
        else history.replaceState({}, 'Step2', '#step2');

        let hash = location.hash.replace('#' ,'');
        console.log(hash)

         document.querySelectorAll('.forward').forEach((link)=>{
            link.addEventListener('click', app.nav);
        })

        document.getElementById(hash).classList.add('active');
     
        window.addEventListener('popstate', app.poppin);
        console.log("1")

    },
    nav: function(ev){
        console.log("2")
        ev.preventDefault();

        let currentPage = ev.target.getAttribute('data-target');
        console.log(currentPage)
        // reset all
        document.querySelector('.active').classList.remove('active');
        // set link to active
        document.getElementById(currentPage).classList.add('active');

        document.querySelector('.instep').classList.remove('instep');
        // set link to active
        document.querySelector(`.${currentPage}`).classList.add('instep');

        history.pushState({}, currentPage, `#${currentPage}`);
        console.log(location.href)
        document.getElementById(currentPage).dispatchEvent(app.show);
         $(window). scrollTop(0);

    },
    pageShown: function(ev){
        console.log("3")
        $(window).scrollTop(0);
        console.log($(window).scrollTop())
        console.log('Page', ev.target.id, 'just shown');
        // let h1 = ev.target.querySelector('h1');
        // h1.classList.add('big')
        // setTimeout((h)=>{
        //     h.classList.remove('big');
        // }, 1200, h1);
       $(window). scrollTop(0);

    },
    poppin: function(ev){
        console.log("4")
   
        console.log(location.hash, 'popstate event');
        let hash = location.hash.replace('#' ,'');
        document.querySelector('.active').classList.remove('active');
        document.getElementById(hash).classList.add('active');

        document.querySelector('.instep').classList.remove('instep');
        document.querySelector(`.${hash}`).classList.add('instep');

        console.log(hash)
        history.pushState({}, hash, `#${hash}`);
        document.getElementById(hash).dispatchEvent(app.show);
         $(window).scrollTop(0);
        

    }
}
    

document.addEventListener('DOMContentLoaded', app.init);

window.onclick = function(e){
    if(e.target == document.querySelector('.modal') )
        document.querySelector('.modal').style.display = "none"
}

let seatNums = 0;
let tickets = [];
let postSelected;
const buttons = document.querySelectorAll('.seat');
console.log(buttons.length)
const timer = document.querySelector('#time');
const inputDate = document.querySelector('#basicDate');
const modal = document.querySelector('.loader')

inputDate.value = localStorage.getItem('dateTrip');

//Initzalize some stuff
setSeatDisabledAll()

checkPostByURL();

// when user pick time
timer.addEventListener('change',() =>{
     $(window). scrollTop(0);
    tickets = [];
    seatNums = 0;
    modal.style.visibility = "visible";
    modal.classList.add("show");
    findPostTime();

    
})
// when user pick date
inputDate.addEventListener('change',() =>{
    location.href =`http://localhost:5000/mua-ve-saigon-kiengiang?d=${inputDate.value}#step1`
    checkPostByURL();
    setDisabledAll()
})
//some function
function checkPostByURL(){
    inputDate.value = window.location.search.slice(3,window.location.search.length);
    findPostDate();

}

function resetSeat(){
    buttons.forEach((btn) =>{
        btn.disabled = false;
     btn.classList.remove("selected");

    })
    document.querySelector('.showcase').style.opacity="1";
    document.querySelector('.showcase').style.pointerEvents="unset";

}

// document.querySelector('.close').addEventListener('click', () =>{
//     document.querySelector('.modal').style.display = "none"
// })

function setSeatDisabledAll(){
    buttons.forEach((btn) =>{
        btn.disabled = true;
    })
    inputDate.value = "";
    document.querySelector('.showcase').style.opacity="0.5";
    document.querySelector('.showcase').style.pointerEvents="none";


}

async function  findPostDate(){
    let dateTrip = inputDate.value;
    // fetch data available post
    const response = await fetch(`http://localhost:5000/post/T001/${dateTrip}`);
    const myJson = await response.json();

    if(myJson.length != 0) {

        fillTimePicker();
    }
    else {
        // alert("Không có chuyến phù hợp")
        document.querySelector('.modal').style.display = "block"
        setSeatDisabledAll();
    }
   
}

async function fillTimePicker(){
    let output ='<option selected disabled>Giờ đi</option>'
    let dateTrip = inputDate.value;
    const response = await fetch(`http://localhost:5000/time/T001/${dateTrip}`);
    const myJson = await response.json();
    
    if(myJson.length != 0) {
        myJson.forEach((time) =>{
            output +=  `<option id=${time.MaCX} value="${time.gioDi}">${time.gioDi}</option>`

        })
        $('#time').html(output);
     }
     else {
        alert("code loi")
     }
}

async function findPostTime(){

    let dateTrip = inputDate.value;
    console.log(dateTrip)
    let time = timer.value;
    const response = await fetch(`http://localhost:5000/post/T001/${dateTrip}/${time}`);
    const myJson = await response.json();
    const options = timer.options;
    postSelected = options[options.selectedIndex].id
    
     console.log(postSelected)
    if(myJson.length != 0) {
       
        resetSeat();
        console.log("Available")
        myJson.forEach((ticket) => {
            document.querySelector(`#${ticket.SoGhe}`).disabled = true;
        })
       
       

    }else {
         console.log("Out of ticket")

         resetSeat();
     }
      location.href=`http://localhost:5000/mua-ve-saigon-kiengiang?d=${dateTrip}#step2`
    modal.style.visibility = "hidden";
    modal.classList.remove("show");
}


function checkSeatForBook(list){
    // let seat = {isBooked:true}
   for(let i in list){
        for(let k in tickets){
            if(list[i].SoGhe ==tickets[k]) return {isBooked:true}
        }
    }
    return {isBooked:false}
}

async function addCustomerAndTicket(){

  console.log("Bạn đã click đặt vé")

  const response =  await fetch(`http://localhost:5000/checkseat/${postSelected}`)
  const result = await response.json();
  const seat = await checkSeatForBook(result)

if(seat.isBooked) return alert("Vé đã đặt trước bạn ")

 fetch('http://localhost:5000/customer/insert',{
        method: 'POST',
        headers:{
            'Content-Type' :'application/json'
        },
        body: JSON.stringify({
          'CMND':'123456124',
          'TenKH':'DinhTienaN',
          'Email':'dinhan@gmail.com',
          'SDT': '0333157629',
          'GioiTinh': 'Nam',
          'DiaChi': 'TPHCM',
          'SLGhe' :tickets,
          'Dongia':'170000',
          'NgayDat': "2020-05-21",
          "MaCX":postSelected
        })
    })
    .then(res => res.json())
    .then(res => typeof res.link != 'undefined' ? window.location = res.link : alert("Có lỗi trong quá trình đặt vé! Thử lại"))
  
   // if(res.status == true) return console.log("OK")
   //  console.log("Not OK")
}

// when user pick seats
var ticketToString ;
    buttons.forEach((btn) =>{
      btn.addEventListener('click',(e)=>{
        if(e.target.className.includes("selected")) {

            btn.classList.remove("selected");
            seatNums --;
            for (var i = 0; i <  tickets.length; i++) {
                if(tickets[i] === btn.id)
                    tickets.splice(i,1);
            }
             console.log(tickets.toString())
            document.querySelector('.seat-pick').textContent = `Số ghế ${tickets.toString()}`
            console.log(tickets)
        }
        else if(seatNums < 5){
            btn.classList.add("selected")
            seatNums ++;
            tickets.push(btn.id)
            console.log(tickets)
             console.log(tickets.toString())
            document.querySelector('.seat-pick').textContent = `Số ghế ${tickets.toString()}`



        }
        else{
            alert("Bạn đã chọn đủ số ghế tối đa !")
        }
        
      });
    });
// config date picker
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() +  14);

  $("#basicDate").flatpickr({
    dateFormat:"Y-m-d",
    minDate:new Date(),
    maxDate:maxDate
});
 