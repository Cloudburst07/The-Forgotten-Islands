

window.addEventListener("keyup", function(e){
    switch (e.key.toLowerCase()) {
        case "w":
            key.w = false;
            player.spriteType = "stop";

            break;

        case "a":
            key.a = false;
            player.spriteType = "stop";

            break;

        case "s":
            key.s = false;
            player.spriteType = "stop";

            break;

        case "d":
            key.d = false;
            player.spriteType = "stop";

            break;
    }
})

window.addEventListener("keydown", function(e){
    switch (e.key.toLowerCase()) {
        case "w":
            key.w = true;

            break;

        case "a":
            key.a = true;

            break;

        case "s":
            key.s = true;
            
            break;

        case "d":
            key.d = true;

            break;

        case "e":
            if(sceneToShow == 5 && isPage) return;
            if(player.hint && !isPage){
                showScene();
            } else if(isPage) closeScene();

            break;
    }
})

// On return to game's tab, ensure delta time is reset
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    lastTime = performance.now()
  }
})
