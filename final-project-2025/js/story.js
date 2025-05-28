const page = document.getElementById("pages-box");
let sceneToShow = 1;
let isPage = false;
let currentLang = "fr";
const answer = document.getElementById("answer");
const lastScene = document.getElementById("scene-5-box")

//updates the language selection
function updateLang(){
    if(currentLang == "fr"){
        currentLang = "en";
    } else {
        currentLang = "fr";
    }
    updateLore();
}

//updates the content of the params
function updateLore(){
    const text = LANG[currentLang];
    document.getElementById("scene-1").innerHTML = text.note1;
    document.getElementById("scene-2").innerHTML = text.note2;
    document.getElementById("scene-3").innerHTML = text.note3;
    document.getElementById("scene-4").innerHTML = text.note4;
    document.getElementById("special-text").innerHTML = text.warning;
    document.getElementById("scene-5").innerHTML = text.note5;
    document.getElementById("end-title").innerHTML = text.endTitle;
    document.getElementById("play-button").innerHTML = text.playButton;
    document.getElementById("info-button").innerHTML = text.infoButton;
    document.getElementById("language-button").innerHTML = text.languageButton;
    document.getElementById("credit-button").innerHTML = text.creditsButton;
    document.getElementById("title").innerHTML = text.title;
    document.getElementById("credits").innerHTML = text.credits;
    document.getElementById("info").innerHTML = text.info;
    document.getElementById("win-title").innerHTML = text.endText;

}

//shows the current scene
function showScene(){
    bookSound.load();
    bookSound.play();
    player.exposure += 10;
    if(sceneToShow != 5){
  	    page.style.display = "block";
    }
      	document.getElementById("scene-1-box").style.display = "none";
      	document.getElementById("scene-2-box").style.display = "none";
      	document.getElementById("scene-3-box").style.display = "none"; 
      	document.getElementById("scene-4-box").style.display = "none";
        lastScene.style.display = "none";
	isPage = true;
    if(sceneToShow == 1){
      	document.getElementById("scene-1-box").style.display = "block";
    } else if(sceneToShow == 2){
      	document.getElementById("scene-2-box").style.display = "block";
    } else if(sceneToShow == 3){
      	document.getElementById("scene-3-box").style.display = "block"; 
    } else if(sceneToShow == 4){
      	document.getElementById("scene-4-box").style.display = "block";
    } else if(sceneToShow == 5){
        lastScene.style.display = "block";
        answer.focus();
        setTimeout(() => {
            answer.value = "";
        }, 1);
    }
}

//closes the current scene
function closeScene(){
    bookSound.load();
    bookSound.play();
    page.style.display = "none";
    lastScene.style.display = "none";
	isPage = false;
}

function checkAnswer(){
    let playerInput = answer.value.toUpperCase();
    if(playerInput == "KHAZIRASH"){
        winGame();
    } else {

    }
}

answer.addEventListener("keydown", function(e){
    if(e.key === "Enter"){
        checkAnswer();
        answer.value = "";
        closeScene();
    }
})

//stores all the texts in different languages
const LANG = {
    en: {
        note1 : 
            `                
                To whoever finds this— <br>
                Read it. Memorize it. Burn it if you must, but do not ignore it.<br><br>
                These islands breathe. The roots pulse. The sky never blinks. You must continue to tread forth
                
                <span class="marked-words"> This place hates stillness. Stay moving — always. Stop too long, and your mind will be at risk. <br>
                But move too fast... too erratically... and it will notice. <br><br> </span>
                You must learn its name. Nothing else will save you.<br>
            `,
        warning : 
            `
                Don't let it hear you...
            
            `,
        note2 : 
            `
                I felt its presence before I saw it. <br>
                Curtain-like wings — each beat cracked the sky. <br>
                The air shook. My bones shook. <br><br>

                It circled the far island for hours.<br> 
                It didn't breathe. I don't think it needs to. <br><br>

                Its skull is wrong. Ram-like, but stretched, as if twisted by fire. And in its chest: a light. 
                No, a flame. A furnace that sees. <br><br>

                The first sound of its name struck something inside me. <br>
                Like breaking bone. 
                <span class="marked-words">“KH...”</span>
                or 
                <span class="marked-words"> “KA...”</span>
                — it hurts to think about.
            `,
        note3 : 
            `
                Dreams aren't safe here. <br><br>
                It spoke to me. It whispered a name I couldn't fully grasp. <br>

                I remember three glyphs—shining red in my mind when I awoke: <span class="marked-words">“A... Z... I...”</span>

                <br><br>I think they're part of the name. Or maybe they're bait. I can't tell anymore.
            `,
        note4 : 
            `
                I was so close. <br>
                I had all but one letter.
                Then it spoke. It took Cynthia's voice...
                so I screamed his name. I think I got it right. <br>

                It turned. <br>
                It saw me. <br>
                It laughed. <br>

                The last part, <span class="marked-words"> "RASH"</span>, burns in my mind like a brand. <br>
                That's all I know.
                That's all I can give you.
            `,
        note5 : 
            `Your final answer?`,
        endTitle : `You've failed. <br><br> Click to restart`,
        startText : `For the best experience, <br> consider using headphones.`,
        languageButton : `English`,
        playButton : `Begin`,
        creditsButton : `Credits`,
        infoButton : `Infos`,
        title : `The Forgotten Islands`,
        info : `Use WASD to move <br> The books will be your ally.<br><br> This game contains psychological horror and a tense, 
        unsettling atmosphere. Players may experience sudden loud sounds, screen shaking, 
        and intense visual effects. The narrative explores themes of isolation, dread, death, 
        and mental distress. Gameplay mechanics may induce anxiety.<br><br> Player discretion is advised. <br><br>
        Click to return.
        `,
        credits : 
        `
        Player sprites by <a href="https://lucky-loops.itch.io/">Luck</a> <br><br>
        Boss sprites by <a href="https://lizcheong.itch.io/">Liz Cheong</a> <br><br>
        Map sprites by <a href="https://pingupollas.itch.io/">Pingupollas</a> <br><br>
        Other visual assets by <a href="https://joshuajennerdev.itch.io/">Joshua Jenner</a><br>
        And <a href="https://srtoasty.itch.io/">Sr.Toasty</a> <br><br><br>

        Sounds from <a href="https://pixabay.com/sound-effects/">Pixabay</a> <br><br>
        Music by <a href="https://soundcloud.com/crowshade/sets/minds-eye">Crow Shade</a> <br><br>
        Click to return.
        `,
        endText : `
            You spoke its name. The sky cracked. The flame went out. <br><br>
            The islands are still now. The ground does not breathe.<br><br>
            You are safe.<br><br>
            <span class="marked-words">For now.</span><br><br>
            But something heard you speak. And some names… <span class="marked-words">echo.</span><br><br>
        `,
    },

    fr:{
note1 : 
            `                
                À quiconque trouvera ceci — <br>
                Lis-le. Apprends-le. Brûle-le si tu dois, mais ne l'ignore pas. <br><br>

                Ces îles respirent. Les racines pulsent. Le ciel ne cligne jamais des yeux.

                <span class="marked-words"> Cet endroit déteste l'inaction. Reste en mouvement — toujours.
                T'arrêter trop longtemps, et ton esprit sera en danger.
                Mais bouge trop vite… trop brutalement… et il te remarquera.
                </span> <br><br>

                Tu dois apprendre son nom. Rien d'autre ne te sauvera. <br>
            `,
        warning : 
            `
                Ne le laisse pas t'entendre...
            
            `,
        note2 : 
            `
                Je l'ai senti avant de le voir. <br>
                Des ailes comme des rideaux — chaque battement brisait le ciel. L'air tremblait. Mes os tremblaient. <br><br>

                Il a tourné autour de l'île lointaine pendant des heures. <br>
                Il ne respirait pas. Je ne pense pas qu'il en ait besoin. <br><br>

                Son crâne est faux. Cornu, comme un bélier, mais déformé, comme tordu par le feu.
                Et dans sa poitrine : une lumière. Non, une flamme. Un fourneau qui voit. <br><br>

                Le premier son de son nom m'a frappé au plus profond. Comme un os qui se casse.
                <span class="marked-words">« KH... »</span> ou <span class="marked-words">« KA... »</span>  — y penser me fait mal.
            `,
        note3 : 
            `
                Les rêves sont périlleux ici. <br><br>
                Il m'a parlé. Il a murmuré un nom que je n'ai pas pu saisir en entier. <br>

                Je me souviens de trois glyphes — rouges et brillants dans mon esprit à mon réveil : <span class="marked-words"> « A... Z... I... »</span>

                <br><br>Je crois qu'ils font partie du nom. Ou peut-être que ce sont des appâts. 
                Je ne sais plus.
            `,
        note4 : 
            `
                J'étais si proche. 
                Il ne me manquait qu'une lettre. <br>
                Puis il a parlé. Il a pris la voix de Cynthia... 

                alors j'ai crié son nom. Je crois que je l'ai dit correctement. <br>
                
                Il s'est retourné. <br>
                Il m'a vu. <br>
                Il a ri. <br>

                La dernière partie, <span class="marked-words"> « RASH »</span>, me brûle l'esprit comme une marque. <br>
                C'est tout ce que je sais.
                C'est tout ce que je peux te donner.
            `,
        note5 : 
            `Ta réponse finale?`,
        endTitle : `Tu as échoué. <br><br> Cliquer pour recommencer`,
        startText : `Pour une immersion totale, <br> portez des écouteurs.`,
        languageButton : `Français`,
        playButton : `Commencer`,
        creditsButton : `Crédits`,
        infoButton : `Infos`,
        title : `Les îles oubliées`,
        info : `Utilisez WASD pour bouger. <br> Les livres seront tes alliés. <br> <br> Ce jeu contient des éléments d'horreur psychologique et une atmosphère oppressante. 
        Des sons forts et soudains, des tremblements d'écran, ainsi que des effets visuels intenses 
        sont aussi présentent. L'histoire aborde des thèmes tels que l'isolement, la peur, 
        la mort et la détresse mentale. Certaines mécaniques de jeu peuvent provoquer de l'anxiété. 
        La discrétion des joueurs est conseillée. <br><br>
        Cliquer pour retourner.
        `,
        credits : 
        `
        Sprites du joueur par <a href="https://lucky-loops.itch.io/">Luck</a> <br><br>
        Sprites du boss par <a href="https://lizcheong.itch.io/">Liz Cheong</a> <br><br>
        Sprites de la carte par <a href="https://pingupollas.itch.io/">Pingupollas</a> <br><br>
        Autres éléments visuels par <a href="https://joshuajennerdev.itch.io/">Joshua Jenner</a><br>
        Et <a href="https://srtoasty.itch.io/">Sr.Toasty</a> <br><br>

        Sons provenant de <a href="https://pixabay.com/sound-effects/">Pixabay</a> <br><br>
        Musique par <a href="https://soundcloud.com/crowshade/sets/minds-eye">Crow Shade</a> <br><br>
        Cliquer pour retourner.

        `,
        endText : `
        Tu as prononcé son nom. Le ciel s'est fendu. La flamme s'est éteinte.<br><br>
        Les îles sont calmes à présent. Le sol ne respire plus.<br><br>
        Tu es en sécurité.<br><br>
        <span class="marked-words">Pour l'instant.</span><br><br>
        Mais quelque chose t'a entendu. Et certains noms… <span class="marked-words">résonnent.</span><br><br>
        `,

    }
}