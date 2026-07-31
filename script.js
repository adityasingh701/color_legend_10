/* ==========================================================
   COLOR LEGEND 100
   JavaScript Part 1
   Global Config • Game State • DOM • Save System
========================================================== */

/* ===========================
   STORAGE KEYS
=========================== */

const STORAGE = {

    level: "cl100_currentLevel",
    unlocked: "cl100_unlockedLevel",
    coins: "cl100_coins",
    xp: "cl100_xp",
    lives: "cl100_lives",
    bestTime: "cl100_bestTime",
    highest: "cl100_highestLevel",
    settings: "cl100_settings"

};

/* ===========================
   GAME CONFIG
=========================== */

const MAX_LEVEL = 100;

const DEFAULT_LIVES = 5;

const DEFAULT_COINS = 200;

/* ===========================
   GAME STATE
=========================== */

const game = {

    currentLevel:
        Number(localStorage.getItem(STORAGE.level)) || 1,

    unlockedLevel:
        Number(localStorage.getItem(STORAGE.unlocked)) || 1,

    coins:
        Number(localStorage.getItem(STORAGE.coins)) || DEFAULT_COINS,

    lives:
        Number(localStorage.getItem(STORAGE.lives)) || DEFAULT_LIVES,

    xp:
        Number(localStorage.getItem(STORAGE.xp)) || 0,

    bestTime:
        Number(localStorage.getItem(STORAGE.bestTime)) || 0,

    timer:0,

    timerInterval:null,

    oddIndex:-1,

    gridSize:3,

    playing:false,

    paused:false

};

/* ===========================
   DOM ELEMENTS
=========================== */

const UI = {

    grid:
        document.getElementById("grid"),

    currentLevel:
        document.getElementById("currentLevel"),

    highestLevel:
        document.getElementById("highestLevel"),

    coins:
        document.getElementById("coins"),

    lives:
        document.getElementById("lives"),

    timer:
        document.getElementById("timer"),

    xpBar:
        document.getElementById("xpBar"),

    xpText:
        document.getElementById("xpText"),

    rank:
        document.getElementById("rank"),

    levelTitle:
        document.getElementById("levelTitle"),

    homePage:
        document.getElementById("homePage"),

    gamePage:
        document.getElementById("gamePage"),

    levelsPage:
        document.getElementById("levelsPage"),

    trophyPage:
        document.getElementById("trophyPage"),

    loading:
        document.getElementById("loadingScreen")

};

/* ===========================
   PLAYER RANK
=========================== */

function getRank(level){

    if(level >= 100) return "Color Legend";

    if(level >= 90) return "Grand Master";

    if(level >= 75) return "Master";

    if(level >= 60) return "Expert";

    if(level >= 40) return "Pro";

    if(level >= 20) return "Skilled";

    return "Beginner";

}

/* ===========================
   SAVE GAME
=========================== */

function saveGame(){

    localStorage.setItem(
        STORAGE.level,
        game.currentLevel
    );

    localStorage.setItem(
        STORAGE.unlocked,
        game.unlockedLevel
    );

    localStorage.setItem(
        STORAGE.coins,
        game.coins
    );

    localStorage.setItem(
        STORAGE.lives,
        game.lives
    );

    localStorage.setItem(
        STORAGE.xp,
        game.xp
    );

    localStorage.setItem(
        STORAGE.bestTime,
        game.bestTime
    );

    localStorage.setItem(
        STORAGE.highest,
        Math.max(
            game.unlockedLevel,
            Number(
                localStorage.getItem(STORAGE.highest)
            ) || 1
        )
    );

}

/* ===========================
   UPDATE HUD
=========================== */

function updateHUD(){

    if(UI.currentLevel){

        UI.currentLevel.textContent =
            game.currentLevel;

    }

    if(UI.highestLevel){

        UI.highestLevel.textContent =
            localStorage.getItem(STORAGE.highest) || 1;

    }

    if(UI.coins){

        UI.coins.textContent =
            game.coins;

    }

    if(UI.lives){

        UI.lives.textContent =
            game.lives;

    }

    if(UI.rank){

        UI.rank.textContent =
            getRank(game.unlockedLevel);

    }

    if(UI.levelTitle){

        UI.levelTitle.textContent =
            "Level " + game.currentLevel;

    }

    updateXP();

}

/* ===========================
   XP
=========================== */

function updateXP(){

    if(!UI.xpBar) return;

    const progress =
        game.xp % 100;

    UI.xpBar.style.width =
        progress + "%";

    if(UI.xpText){

        UI.xpText.textContent =
            progress + "%";

    }

}

/* ===========================
   PAGE HELPERS
=========================== */

function hideAllPages(){

    document
        .querySelectorAll(".page")
        .forEach(page=>{

            page.classList.add("hidden");

        });

}

function showPage(id){

    hideAllPages();

    const page =
        document.getElementById(id);

    if(page){

        page.classList.remove("hidden");

    }

}

/* ===========================
   INIT
=========================== */

window.addEventListener("load",()=>{

    updateHUD();

});

/* ==========================================================
   COLOR LEGEND 100
   JavaScript Part 2A
   Timer • Difficulty • Color Engine
========================================================== */

/* ===========================
   TIMER
=========================== */

function formatTime(seconds){

    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;

    return (
        String(min).padStart(2,"0") +
        ":" +
        String(sec).padStart(2,"0")
    );

}

function updateTimer(){

    if(UI.timer){

        UI.timer.textContent =
            formatTime(game.timer);

    }

}

function startTimer(){

    stopTimer();

    game.timerInterval = setInterval(()=>{

        if(game.paused) return;

        game.timer++;

        updateTimer();

    },1000);

}

function stopTimer(){

    if(game.timerInterval){

        clearInterval(game.timerInterval);

        game.timerInterval = null;

    }

}

function resetTimer(){

    stopTimer();

    game.timer = 0;

    updateTimer();

}

/* ===========================
   LEVEL DIFFICULTY
=========================== */

function getGridSize(level){

    if(level <= 10) return 3;
    if(level <= 20) return 4;
    if(level <= 30) return 5;
    if(level <= 40) return 6;
    if(level <= 50) return 7;
    if(level <= 60) return 8;
    if(level <= 80) return 9;

    return 10;

}

function getColorDifference(level){

    if(level >= 100) return 1;
    if(level >= 95) return 2;
    if(level >= 90) return 3;
    if(level >= 80) return 5;
    if(level >= 70) return 7;
    if(level >= 60) return 10;
    if(level >= 50) return 13;
    if(level >= 40) return 16;
    if(level >= 30) return 20;
    if(level >= 20) return 25;

    return 35;

}

/* ===========================
   RANDOM COLOR
=========================== */

function randomChannel(){

    return Math.floor(
        Math.random()*180
    ) + 40;

}

function createBaseColor(){

    return{

        r:randomChannel(),

        g:randomChannel(),

        b:randomChannel()

    };

}

function rgb(color){

    return `rgb(${color.r},${color.g},${color.b})`;

}

function createOddColor(base,diff){

    return{

        r:Math.min(255,base.r+diff),

        g:Math.min(255,base.g+diff),

        b:Math.min(255,base.b+diff)

    };

}

/* ===========================
   XP SYSTEM
=========================== */

function addXP(amount){

    game.xp += amount;

    updateXP();

    saveGame();

}

/* ===========================
   COINS
=========================== */

function addCoins(amount){

    game.coins += amount;

    updateHUD();

    saveGame();

}

function spendCoins(amount){

    if(game.coins < amount){

        return false;

    }

    game.coins -= amount;

    updateHUD();

    saveGame();

    return true;

}

/* ===========================
   LIVES
=========================== */

function addLife(count=1){

    game.lives += count;

    updateHUD();

    saveGame();

}

function removeLife(){

    game.lives--;

    updateHUD();

    saveGame();

}

/* ===========================
   PAUSE
=========================== */

function pauseGame(){

    game.paused = true;

}

function resumeGame(){

    game.paused = false;

}

/* ===========================
   LEVEL REWARD
=========================== */

function getLevelReward(level){

    if(level >= 90) return 15;

    if(level >= 70) return 12;

    if(level >= 50) return 10;

    if(level >= 30) return 8;

    return 5;

}
/* ==========================================================
   COLOR LEGEND 100
   JavaScript Part 2B
   Board • Grid • Tile Engine • Level Loader
========================================================== */

/* ===========================
   CREATE BOARD
=========================== */

function createBoard(){

    if(!UI.grid) return;

    UI.grid.innerHTML = "";

    game.gridSize = getGridSize(game.currentLevel);

    UI.grid.className = "";

    UI.grid.id = "grid";

    UI.grid.classList.add(
        "grid-" + game.gridSize
    );

    const totalTiles =
        game.gridSize * game.gridSize;

    game.oddIndex =
        Math.floor(
            Math.random() * totalTiles
        );

    const difference =
        getColorDifference(
            game.currentLevel
        );

    const baseColor =
        createBaseColor();

    const oddColor =
        createOddColor(
            baseColor,
            difference
        );

    for(let i=0;i<totalTiles;i++){

        const tile =
            document.createElement("div");

        tile.className = "box";

        tile.dataset.index = i;

        tile.style.background =

            i === game.oddIndex

            ? rgb(oddColor)

            : rgb(baseColor);

        tile.addEventListener(
            "click",
            ()=>checkTile(i,tile)
        );

        UI.grid.appendChild(tile);

    }

}

/* ===========================
   LOAD LEVEL
=========================== */

function loadLevel(level){

    game.currentLevel = level;

    game.playing = true;

    updateHUD();

    createBoard();

}

/* ===========================
   START LEVEL
=========================== */

function startLevel(level){

    showPage("gamePage");

    resetTimer();

    startTimer();

    loadLevel(level);

}

/* ===========================
   NEXT LEVEL
=========================== */

function nextLevel(){

    if(game.currentLevel < MAX_LEVEL){

        game.currentLevel++;

    }

    if(game.currentLevel >

        game.unlockedLevel){

        game.unlockedLevel =
            game.currentLevel;

    }

    addCoins(

        getLevelReward(
            game.currentLevel
        )

    );

    addXP(10);

    saveGame();

    loadLevel(
        game.currentLevel
    );

}

/* ===========================
   TILE CLICK
=========================== */

function checkTile(index,tile){

    if(!game.playing) return;

    if(index === game.oddIndex){

        correctTile(tile);

    }

    else{

        wrongTile(tile);

    }

}

/* ===========================
   CORRECT
=========================== */

function correctTile(tile){

    game.playing = false;

    tile.classList.add(
        "correct"
    );

    UI.grid.classList.add(
        "board-win"
    );

    setTimeout(()=>{

        UI.grid.classList.remove(
            "board-win"
        );

        nextLevel();

    },500);

}

/* ===========================
   WRONG
=========================== */

function wrongTile(tile){

    tile.classList.add(
        "wrong"
    );

    UI.grid.classList.add(
        "board-fail"
    );

    removeLife();

    setTimeout(()=>{

        tile.classList.remove(
            "wrong"
        );

        UI.grid.classList.remove(
            "board-fail"
        );

    },450);

    if(game.lives <= 0){

        gameOver();

    }

}

/* ===========================
   CONTINUE GAME
=========================== */

function continueGame(){

    startLevel(
        game.currentLevel
    );

}

/* ===========================
   PLAY LEVEL
=========================== */

function playLevel(level){

    game.currentLevel = level;

    continueGame();

}

/* ==========================================================
   COLOR LEGEND 100
   JavaScript Part 3A
   Win • Game Over • Reset • Restart
========================================================== */

/* ===========================
   RESET LEVEL
=========================== */

function getResetLevel(level){

    if(level >= 100) return 80;
    if(level >= 95) return 70;
    if(level >= 90) return 60;
    if(level >= 80) return 50;
    if(level >= 70) return 40;
    if(level >= 60) return 30;
    if(level >= 50) return 20;
    if(level >= 30) return 10;

    return 1;

}

/* ===========================
   LEVEL COMPLETE
=========================== */

function levelComplete(){

    game.playing = false;

    stopTimer();

    if(
        game.bestTime === 0 ||

        game.timer < game.bestTime

    ){

        game.bestTime = game.timer;

    }

    addXP(10);

    addCoins(

        getLevelReward(

            game.currentLevel

        )

    );

    if(game.currentLevel >= MAX_LEVEL){

        showLegend();

        return;

    }

    game.currentLevel++;

    if(

        game.currentLevel >

        game.unlockedLevel

    ){

        game.unlockedLevel =

            game.currentLevel;

    }

    saveGame();

    setTimeout(()=>{

        startLevel(

            game.currentLevel

        );

    },700);

}

/* ===========================
   GAME OVER
=========================== */

function gameOver(){

    game.playing = false;

    stopTimer();

    saveGame();

    const reached =

        game.currentLevel;

    const resetLevel =

        getResetLevel(

            reached

        );

    setTimeout(()=>{

        alert(

            "Game Over!\n\n" +

            "Reached Level : " +

            reached +

            "\n\n" +

            "Restart From : " +

            resetLevel

        );

        game.currentLevel =

            resetLevel;

        game.unlockedLevel =

            Math.min(

                game.unlockedLevel,

                resetLevel

            );

        game.lives =

            DEFAULT_LIVES;

        game.timer = 0;

        updateHUD();

        updateTimer();

        saveGame();

        goHome();

    },300);

}

/* ===========================
   RESTART LEVEL
=========================== */

function restartLevel(){

    game.lives =

        DEFAULT_LIVES;

    resetTimer();

    updateHUD();

    startLevel(

        game.currentLevel

    );

}

/* ===========================
   RESET PROGRESS
=========================== */

function resetProgress(){

    if(

        !confirm(

            "Reset all progress?"

        )

    ){

        return;

    }

    Object.values(STORAGE)

    .forEach(key=>{

        localStorage.removeItem(key);

    });

    game.currentLevel = 1;

    game.unlockedLevel = 1;

    game.coins = DEFAULT_COINS;

    game.lives = DEFAULT_LIVES;

    game.xp = 0;

    game.bestTime = 0;

    game.timer = 0;

    updateHUD();

    updateTimer();

    goHome();

}

/* ===========================
   HOME
=========================== */

function goHome(){

    stopTimer();

    game.playing = false;

    showPage(

        "homePage"

    );

    updateHUD();

}

/* ===========================
   LEGEND
=========================== */

function showLegend(){

    stopTimer();

    game.playing = false;

    showPage(

        "trophyPage"

    );

}

/* ===========================
   PLAY AGAIN
=========================== */

function playAgain(){

    game.lives =

        DEFAULT_LIVES;

    resetTimer();

    startLevel(1);

}
/* ==========================================================
   COLOR LEGEND 100
   JavaScript Part 3B
   Hint • Levels • Navigation • Rewards
========================================================== */

/* ===========================
   HINT COST
=========================== */

function getHintCost(){

    if(game.currentLevel >= 90) return 150;

    if(game.currentLevel >= 75) return 100;

    if(game.currentLevel >= 50) return 75;

    return 50;

}

/* ===========================
   USE HINT
=========================== */

function useHint(){

    const cost = getHintCost();

    if(!spendCoins(cost)){

        alert(
            "Need " + cost + " coins"
        );

        return;

    }

    const tile =

        UI.grid.children[
            game.oddIndex
        ];

    if(!tile) return;

    tile.classList.add(
        "glow"
    );

    setTimeout(()=>{

        tile.classList.remove(
            "glow"
        );

    },1500);

}

/* ===========================
   LEVEL PAGE
=========================== */

function openLevels(){

    showPage(
        "levelsPage"
    );

    renderLevels();

}

/* ===========================
   RENDER LEVELS
=========================== */

function renderLevels(){

    const grid =

        document.getElementById(
            "levelGrid"
        );

    if(!grid) return;

    grid.innerHTML = "";

    for(

        let i=1;

        i<=MAX_LEVEL;

        i++

    ){

        const btn =

            document.createElement(
                "button"
            );

        btn.className =
            "level-btn";

        btn.textContent = i;

        if(

            i <= game.unlockedLevel

        ){

            btn.classList.add(
                "unlocked"
            );

            btn.onclick = ()=>{

                game.currentLevel = i;

                continueGame();

            };

        }

        else{

            btn.classList.add(
                "locked"
            );

            btn.disabled = true;

        }

        grid.appendChild(btn);

    }

}

/* ===========================
   CONTINUE
=========================== */

function continueGame(){

    startLevel(

        game.currentLevel

    );

}

/* ===========================
   SHOP
=========================== */

function openShop(){

    showPage(
        "shopPage"
    );

}

/* ===========================
   CONTACT
=========================== */

function openContact(){

    location.href =
        "contact.html";

}

/* ===========================
   BUY LIFE
=========================== */

function buyLife(){

    const price = 20;

    if(!spendCoins(price)){

        alert(
            "Need " +
            price +
            " coins"
        );

        return;

    }

    addLife(1);

    alert(
        "Life Added ❤️"
    );

}

/* ===========================
   DAILY REWARD
=========================== */

function claimDailyReward(){

    const today =

        new Date()
        .toDateString();

    if(

        localStorage.getItem(
            "dailyReward"
        ) === today

    ){

        alert(
            "Today's reward already claimed."
        );

        return;

    }

    const reward =

        Math.floor(

            Math.random()*41

        ) + 10;

    addCoins(reward);

    localStorage.setItem(

        "dailyReward",

        today

    );

    alert(

        "You received " +

        reward +

        " coins!"

    );

}

/* ===========================
   REDEEM CODE
=========================== */

const redeemCodes={

    CL100:100,

    LEGEND:500,

    MASTER:250,

    WELCOME:50

};

function redeemCode(){

    const input =

        document.getElementById(
            "redeemInput"
        );

    if(!input) return;

    const code =

        input.value
        .trim()
        .toUpperCase();

    if(!code){

        alert(
            "Enter redeem code"
        );

        return;

    }

    if(

        localStorage.getItem(

            "used_"+code

        )

    ){

        alert(
            "Code already used"
        );

        return;

    }

    if(

        redeemCodes[code]

    ){

        addCoins(

            redeemCodes[code]

        );

        localStorage.setItem(

            "used_"+code,

            "true"

        );

        alert(

            "+" +

            redeemCodes[code] +

            " Coins"

        );

        input.value="";

    }

    else{

        alert(
            "Invalid code"
        );

    }

}

/* ===========================
   AUTO SAVE
=========================== */

window.addEventListener(

    "beforeunload",

    ()=>{

        saveGame();

    }

);

/* ==========================================================
   COLOR LEGEND 100
   JavaScript Part 4
   Settings • Theme • Sound • Stats • Achievements
========================================================== */

/* ===========================
   SETTINGS
=========================== */

const defaultSettings={

    sound:true,

    music:true,

    vibration:true,

    particles:true,

    darkMode:true

};

let settings={

    ...defaultSettings,

    ...JSON.parse(

        localStorage.getItem(
            STORAGE.settings
        ) || "{}"

    )

};

function saveSettings(){

    localStorage.setItem(

        STORAGE.settings,

        JSON.stringify(settings)

    );

}

/* ===========================
   TOGGLE SETTING
=========================== */

function toggleSetting(name){

    if(settings[name]===undefined)

        return;

    settings[name]=

        !settings[name];

    saveSettings();

    updateSettingsUI();

}

/* ===========================
   SETTINGS UI
=========================== */

function updateSettingsUI(){

    document

    .querySelectorAll(

        "[data-setting]"

    )

    .forEach(item=>{

        const key=

            item.dataset.setting;

        if(

            settings[key]

        ){

            item.classList.add(

                "active"

            );

        }

        else{

            item.classList.remove(

                "active"

            );

        }

    });

}

/* ===========================
   SOUND
=========================== */

function playSound(name){

    if(!settings.sound)

        return;

    console.log(

        "Play:",name

    );

}

/* ===========================
   MUSIC
=========================== */

function toggleMusic(){

    settings.music=

        !settings.music;

    saveSettings();

}

/* ===========================
   THEME
=========================== */

function applyTheme(){

    document.body.classList.toggle(

        "light-theme",

        !settings.darkMode

    );

}

function toggleTheme(){

    settings.darkMode=

        !settings.darkMode;

    saveSettings();

    applyTheme();

}

/* ===========================
   ACHIEVEMENTS
=========================== */

const achievements=[

{

id:"first",

title:"First Victory",

condition:()=>game.currentLevel>=2

},

{

id:"level10",

title:"Reach Level 10",

condition:()=>game.unlockedLevel>=10

},

{

id:"level25",

title:"Reach Level 25",

condition:()=>game.unlockedLevel>=25

},

{

id:"legend",

title:"Color Legend",

condition:()=>game.unlockedLevel>=100

}

];

function checkAchievements(){

    achievements.forEach(a=>{

        if(

            a.condition()

        ){

            const key=

                "ach_"+a.id;

            if(

                !localStorage.getItem(

                    key

                )

            ){

                localStorage.setItem(

                    key,

                    "1"

                );

                showToast(

                    "🏆 "+a.title

                );

            }

        }

    });

}

/* ===========================
   PLAYER STATS
=========================== */

function getStats(){

    return{

        current:

            game.currentLevel,

        highest:

            game.unlockedLevel,

        coins:

            game.coins,

        xp:

            game.xp,

        bestTime:

            game.bestTime

    };

}

/* ===========================
   SHOW STATS
=========================== */

function refreshStats(){

    const stats=

        getStats();

    document

    .querySelectorAll(

        "[data-stat]"

    )

    .forEach(el=>{

        const key=

            el.dataset.stat;

        if(

            stats[key]!==undefined

        ){

            el.textContent=

                stats[key];

        }

    });

}

/* ===========================
   TOAST
=========================== */

function showToast(text){

    const toast=

        document.createElement(

            "div"

        );

    toast.className=

        "toast success";

    toast.textContent=

        text;

    document.body.appendChild(

        toast

    );

    setTimeout(()=>{

        toast.remove();

    },2500);

}

/* ===========================
   LOADING
=========================== */

function showLoading(){

    if(UI.loading)

        UI.loading.classList.remove(

            "hidden"

        );

}

function hideLoading(){

    if(UI.loading)

        UI.loading.classList.add(

            "hidden"

        );

}

/* ===========================
   GAME EVENTS
=========================== */

document.addEventListener(

    "visibilitychange",

    ()=>{

        if(

            document.hidden

        ){

            pauseGame();

        }

        else{

            resumeGame();

        }

    }

);

/* ===========================
   STARTUP
=========================== */

window.addEventListener(

    "load",

    ()=>{

        applyTheme();

        updateSettingsUI();

        refreshStats();

        hideLoading();

        checkAchievements();

    }

);
/* ==========================================================
   COLOR LEGEND 100
   JavaScript Part 5
   Final Engine • Effects • Bootstrap
========================================================== */

/* ===========================
   PARTICLES
=========================== */

function createParticles(count = 25){

    const container =

        document.querySelector(

            ".background-particles"

        );

    if(!container) return;

    container.innerHTML = "";

    if(!settings.particles)

        return;

    for(let i=0;i<count;i++){

        const p =

            document.createElement(

                "div"

            );

        p.className =

            "particle";

        const size =

            Math.random()*8 + 4;

        p.style.width =

            size + "px";

        p.style.height =

            size + "px";

        p.style.left =

            Math.random()*100 + "%";

        p.style.bottom =

            "-20px";

        p.style.animationDuration =

            (6 + Math.random()*8)

            + "s";

        p.style.animationDelay =

            Math.random()*5 + "s";

        p.style.background =

            `hsla(${Math.random()*360},
            90%,70%,.6)`;

        container.appendChild(p);

    }

}

/* ===========================
   PAGE TRANSITION
=========================== */

function fadeTo(pageId){

    document.body.classList.add(

        "page-fade"

    );

    setTimeout(()=>{

        showPage(pageId);

        document.body.classList.remove(

            "page-fade"

        );

    },180);

}

/* ===========================
   KEYBOARD SUPPORT
=========================== */

document.addEventListener(

    "keydown",

    e=>{

        if(

            e.key === "Escape"

        ){

            goHome();

        }

        if(

            e.key === "h" ||

            e.key === "H"

        ){

            useHint();

        }

    }

);

/* ===========================
   MOBILE TOUCH
=========================== */

document.addEventListener(

    "touchstart",

    ()=>{},

    {

        passive:true

    }

);

/* ===========================
   PERFORMANCE
=========================== */

function clearBoard(){

    if(UI.grid){

        UI.grid.innerHTML="";

    }

}

function reloadBoard(){

    clearBoard();

    createBoard();

}

/* ===========================
   DEBUG
=========================== */

const DEBUG = false;

function log(){

    if(!DEBUG) return;

    console.log(...arguments);

}

/* ===========================
   GAME VERSION
=========================== */

const GAME_INFO = {

    name:

        "Color Legend",

    version:

        "100 Edition",

    build:

        "2.0.0"

};

/* ===========================
   START GAME
=========================== */

function startGame(){

    showLoading();

    updateHUD();

    refreshStats();

    createParticles();

    applyTheme();

    updateSettingsUI();

    setTimeout(()=>{

        hideLoading();

        showPage(

            "homePage"

        );

    },500);

}

/* ===========================
   WINDOW EVENTS
=========================== */

window.addEventListener(

    "resize",

    ()=>{

        createParticles();

    }

);

window.addEventListener(

    "focus",

    ()=>{

        if(

            !game.paused &&

            game.playing

        ){

            log(

                "Focus"

            );

        }

    }

);

window.addEventListener(

    "blur",

    ()=>{

        if(

            game.playing

        ){

            pauseGame();

        }

    }

);

/* ===========================
   AUTO SAVE
=========================== */

setInterval(()=>{

    saveGame();

},30000);

/* ===========================
   INITIALIZE
=========================== */

window.addEventListener(

    "load",

    ()=>{

        startGame();

    }

);

/* ===========================
   END
=========================== */

console.log(

    GAME_INFO.name,

    GAME_INFO.version,

    "Ready"

);

