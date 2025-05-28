//file for shaders, filters, sounds, sfx, etc
let footstepIndex = 0;
let alertCounter = 0;
let chaseCounter = 0;
let sanityCounter = 0;

//screen shake effect
function applyShake(intensity) {
    if (intensity > 0) {
        const x = (Math.random() - 0.5) * 2 * intensity;
        const y = (Math.random() - 0.5) * 2 * intensity;
        const rot = (Math.random() - 0.5) * 2 * intensity;

        canvas.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${rot}deg)`;
    }
}

function resetShake(){
    canvas.style.transform = 'translate(-50%, -50%) rotate(0deg)';
}

//screen distort/blur effect (use css + html element)
function applyFilters(){
    document.getElementById("filter-overlay").style.opacity = (-player.health.value + 1000) / 1000;
}

function resetFilters(){
}

const footstepSound = [
    new Audio("./sounds/footstep/st1-footstep-sfx-323053.mp3"),
    new Audio("./sounds/footstep/st2-footstep-sfx-323055.mp3"),
    new Audio("./sounds/footstep/st3-footstep-sfx-323056.mp3"),
]

const ambianceSound = [
    new Audio("./sounds/Pack/2- Mental Vortex.mp3"),
    new Audio("./sounds/Pack/10- Time Whistle.mp3"),
]

const alertSound = [
    new Audio("./sounds/alert/CosmicHorror_Rumble2.mp3"),
    new Audio("./sounds/alert/CosmicHorror_Rumble3.mp3"),
    new Audio("./sounds/alert/DeepOne_Rumble3.mp3"),
]

const chaseSound = new Audio("./sounds/chase/horror-bgm-340816-[AudioTrimmer.com].mp3");
const caughtSound = new Audio("./sounds/chase/horror-sound-monster-roar-2-189933.mp3");
const bookSound = new Audio("./sounds/hint/turn-a-page-336933.mp3");

const winSound = new Audio("./sounds/Pack/3- Something's wrong.mp3");
const menuMusic = new Audio("./sounds/Pack/1- Midnight Dreams.mp3");

const sanitySounds = [
    new Audio("./sounds/sanity/Child laugh_7.wav"),
    new Audio("./sounds/sanity/Ghost_moan_2.wav"),
    new Audio("./sounds/sanity/Mechanical Randomness_Spooky_4.wav"),
    new Audio("./sounds/sanity/Spooky Ambience.wav"),
]

function setVolume(){
    for (let i = 0; i < 3; i++) {
        footstepSound[i].volume = 0.6;        
    }
    for (let i = 0; i < 2; i++) {
        ambianceSound[i].volume = 0.9;       
    }
}

function stopAllSound(){
    for (let i = 0; i < 3; i++) {
        footstepSound[i].volume = 0;      
        alertSound[i].volume = 0;  
    }
    for (let i = 0; i < 2; i++) {
        ambianceSound[i].volume = 0;       
    }
    for (let i = 0; i < 4; i++) {
        sanitySounds[i].volume = 0;       
    }
    chaseSound.volume = 0;
    caughtSound.volume = 0;
    bookSound.volume = 0;

}

ambianceSound[0].addEventListener("ended", () => {
    ambianceSound[1].load();
    ambianceSound[1].play();
});
ambianceSound[1].addEventListener("ended", () => {
    ambianceSound[0].load();
    ambianceSound[0].play();
});

alertSound[0].addEventListener("ended", () => {
    alertCounter = 0;
});

alertSound[1].addEventListener("ended", () => {
    alertCounter = 0;
});

alertSound[2].addEventListener("ended", () => {
    alertCounter = 0;
});

chaseSound.addEventListener("ended", () => {
    chaseCounter = 0;
});

sanitySounds[0].addEventListener("ended", () => {
    sanityCounter = 0;
});

sanitySounds[1].addEventListener("ended", () => {
    sanityCounter = 0;
});

sanitySounds[2].addEventListener("ended", () => {
    sanityCounter = 0;
});

sanitySounds[2].addEventListener("ended", () => {
    sanityCounter = 0;
});

function playSanity(){
    if(sanityCounter != 0) return;
    sanityCounter = 1;
    let index = Math.floor(Math.random()*4);
    sanitySounds[index].play();
}

function playHunt(){
    if(chaseCounter != 0) return;
    chaseCounter = 1;
    chaseSound.play();
}

function playAlert(){
    if(alertCounter != 0) return;
    alertCounter = 1;
    let index = Math.floor(Math.random()*3);
    alertSound[index].play();
}

function playAmbiance(){
    ambianceSound[0].play();
}

function alternateFootstepSound(){
    footstepSound[footstepIndex].load();
    footstepSound[footstepIndex].play();
    footstepIndex = (footstepIndex + 1) % 3;
}