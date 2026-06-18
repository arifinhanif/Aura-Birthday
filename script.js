/* ===================================
   AURA WEBSITE SCRIPT
=================================== */



/* =========================
   PASSWORD SYSTEM
========================= */


const PASSWORD = "01072025";



function checkPassword(){


const input =
document.getElementById(
"passwordInput"
).value;



const message =
document.getElementById(
"wrongPass"
);



if(input === PASSWORD){


document
.getElementById(
"lock-screen"
)
.style.display="none";


document
.getElementById(
"main-content"
)
.classList.remove(
"hidden"
);


startStars();


}

else{


message.innerHTML =
"Password salah ✦";


}



}






/* =========================
   STAR ANIMATION
========================= */


function startStars(){


const container =
document.getElementById(
"stars"
);



for(let i=0;i<120;i++){


const star =
document.createElement(
"div"
);



star.className="star";



star.style.left =
Math.random()*100+"%";



star.style.top =
Math.random()*100+"%";



star.style.animationDelay =
Math.random()*3+"s";



star.style.opacity =
Math.random();



container.appendChild(
star
);



}



}




/* =========================
   MODAL
========================= */


function openModal(){


document
.getElementById(
"modal"
)
.style.display="flex";


}



function closeModal(){


document
.getElementById(
"modal"
)
.style.display="none";


}






/* =========================
   MUSIC PLAYER
========================= */


const audio =
document.getElementById(
"audio"
);



let playing=false;



function toggleMusic(){


const button =
document.querySelector(
"#music-player button"
);



if(!playing){


audio.play();


playing=true;


button.innerHTML="⏸";


}

else{


audio.pause();


playing=false;


button.innerHTML="▶";


}



}






/* =========================
   SMOOTH SCROLL
========================= */


document
.querySelectorAll(
"button"
)
.forEach(btn=>{


btn.addEventListener(
"click",
()=>{


btn.style.transform=
"scale(.95)";


setTimeout(()=>{


btn.style.transform="";


},150);



});


});






/* =========================
   PHOTO FALLBACK
========================= */


document
.querySelectorAll(
".gallery img"
)
.forEach(img=>{


img.onerror=function(){


this.src =
"https://picsum.photos/600/800";


};



});





/* =========================
   AUTO INIT
========================= */


window.onload=function(){


document
.getElementById(
"stars"
)
.innerHTML="";


};
