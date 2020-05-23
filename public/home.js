history.replaceState({}, 'Home', "/home");
  //initzalize variables
  const source = document.querySelector('#source')
  const findButton = document.querySelector('#findBtn')
  const des = document.querySelector('#destination')
  const inputDate = document.querySelector('#basicDate');
  let tripID;let dateTrip;let trips;
  var modal = document.getElementById("myModal");
  var span = document.getElementsByClassName("close")[0];
  let ids;
getApis();// GET INFO TRIPS
 getCusId()
// function get trips
async function  getApis(){
    const response = await fetch('http://localhost:5000/trip');
    const myJson = await response.json();
    trips = myJson;
}
async function  getCusId(){
    const response = await fetch('http://localhost:5000/customer/id');
    const myJson = await response.json();
    ids = myJson;
}
const removeField = () =>{
    source.value = "Chọn địa điểm đi";
    des.value = "Chọn địa điểm đến" ;
    inputDate.value = "";
    $('#findBtn').html('<i class="fas fa-search" style="margin-right:15px;"></i>TÌM VÉ') ;
    console.log('Removed')
}

// find Post with tripID and date go
async function  findPost(){

    if(source.value == "Chọn địa điểm đi") return source.className="invalid"
    if(des.value == "Chọn địa điểm đến") return des.className="invalid";
    if(inputDate.value =="") return inputDate.className = "invalid"

    findButton.textContent = "Đang tìm...";
    // fetch data available post
    const response = await fetch(`http://localhost:5000/post/${tripID}/${dateTrip}`);
    const myJson = await response.json();

     if(myJson.length != 0) {
      localStorage.setItem("dateStrip",dateTrip);
        getStringTripAndGo();
        removeField(); 
     }
     else modal.style.display = "block";
    $('#findBtn').html('<i class="fas fa-search" style="margin-right:15px;"></i>TÌM VÉ') ;
     
    

}

// everytime source change
source.addEventListener('change',() =>{
      trips.forEach((trip)=>{
         if(trip.DiemDi ==source.value && trip.DiemDen ==des.value) return tripID = trip.MaTX
      })
      console.log(tripID)
  })

// everytime source destination
des.addEventListener('change',() =>{
      trips.forEach((trip)=>{
         if(trip.DiemDi ==source.value && trip.DiemDen ==des.value) return tripID = trip.MaTX
      })
      console.log(tripID)

  })

// find Button click
findButton.addEventListener('click',() =>{
      dateTrip = inputDate.value;
      findPost();
})


// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
//handle datepicker

const maxDate = new Date();
 maxDate.setDate(maxDate.getDate() +  14);

$("#basicDate").flatpickr({
    dateFormat:"Y-m-d",
    minDate:new Date(),
    maxDate:maxDate
});
function getStringTripAndGo(){
    let from  = source.value.toLowerCase()
    let to  = des.value.toLowerCase()
    location.href =  `http://localhost:5000/mua-ve-${from}-${to}?d=${dateTrip}`;  
}
function sliderGroup(){
  
 // const images = slider.querySelectorAll('img');
  
}
new Glide('.glide', {
  type: 'carousel',
  startAt: 0,
  autoplay: 2000,
  hoverpause: true,
  gap: 0,
  // animationTimingFunc: ease,
  perView: 3
  
}).mount();

