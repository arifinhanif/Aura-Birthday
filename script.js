/* =====================================
   AURA WEBSITE JAVASCRIPT
   BASE64 VERSION
===================================== */


/* ==========================
   BASE64 ASSET
========================== */


const IMG = {


IMG1:
"data:image/jpeg;base64,PASTE_BASE64_FOTO_1_DISINI",


IMG2:
"data:image/jpeg;base64,PASTE_BASE64_FOTO_2_DISINI",


IMG3:
"data:image/jpeg;base64,PASTE_BASE64_FOTO_3_DISINI",


COVER:
"data:image/jpeg;base64,PASTE_BASE64_COVER_DISINI"



};





const MUSIC =

"data:audio/mp3;base64,PASTE_BASE64_AUDIO_DISINI";







/* ==========================
 PASSWORD
========================== */


const PASSWORD = "01072025";




function checkPassword(){


const value =

document
.getElementById(
"passwordInput"
)
.value;



const wrong =

document
.getElementById(
"wrongPass"
);



if(value === PASSWORD){


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



createStars();



loadAssets();



}

else{


wrong.innerHTML =
"Password salah ✦";


}



}







/* ==========================
 LOAD BASE64
========================== */


function loadAssets(){


document
.getElementById(
"img1"
)
.src = IMG.IMG1;



document
.getElementById(
"img2"
)
.src = IMG.IMG2;



document
.getElementById(
"img3"
)
.src = IMG.IMG3;



document
.getElementById(
"cover"
)
.src = IMG.COVER;



document
.getElementById(
"audio"
)
.src = MUSIC;



}







/* ==========================
 STAR EFFECT
========================== */


function createStars(){


const area =

document
.getElementById(
"stars"
);



for(let i=0;i<150;i++){


let star =
document.createElement(
"div"
);



star.className =
"star";



star.style.left =

Math.random()*100+"%";



star.style.top =

Math.random()*100+"%";



star.style.animationDelay =

Math.random()*5+"s";



area.appendChild(star);



}


}







/* ==========================
 MODAL
========================== */


function openModal(){


document
.getElementById(
"modal"
)
.style.display =
"flex";


}



function closeModal(){


document
.getElementById(
"modal"
)
.style.display =
"none";


}







/* ==========================
 MUSIC PLAYER
========================== */


let playing=false;



function toggleMusic(){



const audio =

document
.getElementById(
"audio"
);



if(!playing){


audio.play();



playing=true;



}

else{


audio.pause();



playing=false;



}


}








/* ==========================
 CANVAS CONSTELLATION
========================== */


const canvas =

document
.getElementById(
"canvas"
);



if(canvas){


const ctx =
canvas.getContext(
"2d"
);



canvas.width =
window.innerWidth;



canvas.height =
400;



let stars=[];



for(let i=0;i<80;i++){


stars.push({

x:
Math.random()*canvas.width,


y:
Math.random()*canvas.height,


r:
Math.random()*2


});


}




function animate(){


ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);



ctx.fillStyle="white";



stars.forEach(s=>{


ctx.beginPath();


ctx.arc(
s.x,
s.y,
s.r,
0,
Math.PI*2
);


ctx.fill();



});



requestAnimationFrame(
animate
);



}



animate();



}
