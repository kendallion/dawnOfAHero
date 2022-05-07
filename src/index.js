//bacon

//TODO:
//Change sky color based on time

var isWriting = false;

const INPUTSTATE = {
    READY: 0,
    BUILDING: 1,
    FORGING: 2,
    FORGINGCOUNT: 3,
    TRAINING: 4,
    TRAININGCOUNT: 5
};
var inputState;
//var forgeItem;
var forgeItem = {
    name: null,
    code: null,
    woodCost: null,
    stoneCost: null,
    ironCost: null,
    vineCost: null,
    forgeTime: null,
    forgeLevel: null
};

var TrainItem = {
    name: null,
    variable: null,
    neededItemVariable: null,
    goldCost: null,
    trainTime: null,
    barracksLevel: null
}

var time;
var day;

//resources
var stone;
var wood;
var iron;
var vines;
var gold;

//population
var idlePeasants;
var farmers;

//buildings
var blacksmith;
var barracks;
var farm;
var smallHouse;
var largeHouse;
var stable;
var stockpile;
var market;

function updateResources(){
    document.getElementById('stone').textContent = stone;
    document.getElementById('wood').textContent = wood;
    document.getElementById('vines').textContent = vines;
    document.getElementById('iron').textContent = iron;
    document.getElementById('gold').textContent = gold;

document.getElementById('idlePeasants').textContent = idlePeasants;
    document.getElementById('farmers').textContent = farmers;

    document.getElementById('hoes').textContent = hoes;

    document.getElementById('day').textContent = day;
    var timeSpan = document.getElementById('time');
    timeSpan.textContent = '';
    var hour = Math.floor(time / 4);
    var minute = time % 4 * 15;
    if (minute == 0) minute = "00";
    if (time < 24) timeSpan.textContent = hour + 6 + ":" + minute + " am";
    else if (23 < time  && time < 28) timeSpan.textContent = hour + 6 + ":" + minute + " PM";
    else timeSpan.textContent = hour - 6 + ":" + minute + " PM";
}

const pluralize = (count, noun, suffix = 's') =>
  `${count} ${noun}${count !== 1 ? suffix : ''}`;

function write(text) {
//let text = document.getElementById("inputTextBox").innerHTML;
    if(isWriting) return;
    isWriting = true;
    var i = 0;
    var speed = 20;
    document.getElementById('content').innerHTML += '<br>';
    document.getElementById('content').innerHTML += '<br>';

    var timer=setInterval(function(){
        if(i<text.length) {
            if(text.charAt(i) == '^') {
                document.getElementById("content").innerHTML += '<br>';
                i++;
            }
            else {
                document.getElementById('content').innerHTML += text.charAt(i);
                i++;
            }
        }
        else {
            clearInterval(timer);
            isWriting = false;
        }
    },speed)
}

function init(){
    inputState = INPUTSTATE.READY;
    time = 0;
    day = 1;

    stone = 5;
    wood = 8;
    iron = 4;
    vines = 7;
    gold = 10;

    idlePeasants = 4;
    farmers = 0;

    hoes = 0;

    blacksmith = 1; //should be 0 for game
    barracks = 1; //should be 0 for game
    farm = 1;
    smallHouse = 1;
    largeHouse = 2;
    stable = 0;
    stockpile = 1;
    market = 0;

    updateResources();
    //write("It's a war torn land. Villages are being raided every day by the elusive Woodland Prowlers. Every day, more and more of them arrive. Every day, more and more villagers die. They need a leader. A hero. This hero... is You!^^Welcome to our village. My name is Andor. We have been raided by the Woodland Prowlers. We have a small militia left and some resources, but not many. Please help us. I am giving you control of the village.^You can build new buildings, hire workers, train soldiers, and gather materials.");
}

function processInput(){
    if(isWriting) return;

    if(inputState == INPUTSTATE.BUILDING) {
        processBuilding();
        return;
    }
    if(inputState == INPUTSTATE.FORGING) {
        processForging();
        return;
    }

    if(inputState == INPUTSTATE.FORGINGCOUNT) {
        processForgingCount();
        return;
    }

    if(inputState == INPUTSTATE.TRAINING) {
        processTraining();
        return;
    }

    if(inputState == INPUTSTATE.TRAININGCOUNT) {
        processTrainingCount();
        return;
    }

    switch(document.getElementById('inputTextBox').value) {
        case 'h':
        case 'H':
            giveHelp();
            break;
        case 'p':
            idlePeasants += 1;
            document.getElementById('idlePeasants').textContent = idlePeasants;
            break;
        case 'm':
        case 'M':
            goMining();
            break;
        case 'w':
        case 'W':
            goWoodCutting();
            break;
        case 't':
            train();
            break;
        case 's':
        case 'S':
            sleep();
            break;
        case 'b':
        case 'B':
            build();
            break;
        case 'f':
        case 'F':
            forge();
            break;
        default:
            write("Not a valid input!");
    }
    document.getElementById('inputTextBox').value = "";
}

function giveHelp(){
    write("Options:^m: Go mining^w: Go woodcutting^b: Build buildings^u: Upgrade buildings^t: Train workers^f: Forge equipment^a: Sell supplies^g: Scout for enemy camps^l: View enemy camp stats^s: Sleep^r: Throw out items^n: Manage carts");
}

function goMining(){
    if(time > 60) {
        write("It's too late to go mining.")
        return;
    }
    var stoneGet = Math.floor(Math.random() * 13 + 10);
    var ironGet = Math.floor(Math.random() * 11 - 5)
    if (ironGet > 0) {
        write("You got " + stoneGet + " stone and " + ironGet + " iron from mining.");
        iron += ironGet;
    }
    else write("You got " + stoneGet + " stone from mining.")
    stone += stoneGet;
    time +=4;
    updateResources();
}

function goWoodCutting(){
    if(time > 60) {
        write("It's too late to go woodcutting.")
        return;
    }
    var woodGet = Math.floor(Math.random() * 14 + 11);
    var vineGet = Math.floor(Math.random() * 10 - 5)
    if (vineGet > 0) {
        write("You got " + woodGet + " wood and " +  pluralize(vineGet, "vine") + " from woodcutting.");
        vines += vineGet;
    }
    else write("You got " + woodGet + " wood from woodcutting.")
    wood += woodGet;
    time += 4;
    updateResources();
}

function sleep(){
    time = 0;
    day += 1;
    write("You got a good night's rest!\n\nIt is now 6:00 am on day " + day + ".");

    updateResources();
}

function build(){
    if (time > 60) {
        write("It's too late to build anything right now.");
        return;
    }
    write("What would you like to build?^B: Blacksmith^A: Barracks^H: Help^C: Cancel");
    inputState = INPUTSTATE.BUILDING;
}

function processBuilding(){
    switch(document.getElementById('inputTextBox').value) {
        case 'h':
            write("I can help!");
            break;
        case 'b':
            if(wood < 50 || stone < 75 || iron < 5){
                write("You do not have enough resources to upgrade your barracks. It costs 50 wood, 75 stone, and 5 iron.^^What would you like to build?");
                break;
            }
            wood -= 50;
            stone -= 75;
            iron -= 5;
            blacksmith += 1;
            time += 4;
            updateResources();
            write("You have upgraded your blacksmith.^^What would you like to do next?");
            inputState = INPUTSTATE.READY;
            break;
        case 'a':
            if(wood < 75 || stone < 50 || iron < 5){
                write("You do not have enough resources to upgrade your barracks. It costs 50 wood, 75 stone, and 5 iron.^^What would you like to build?");
                break;
            }
            wood -= 75;
            stone -= 50;
            iron -= 5;
            barracks += 1;
            time += 4;
            updateResources();
            write("You have upgraded your barracks.^^What would you like to do next?");
            inputState = INPUTSTATE.READY;
            break;
        case 'c':
            write("Cancelled build.^^What would you like to do next?");
            inputState = INPUTSTATE.READY;
            break;
        default:
            write("Not a valid build. Please try again.");
            break;
    }
    document.getElementById('inputTextBox').value = "";
}

function forge(){
    if (time > 63) {
        write("It's too late to forge anything right now.^^What would you like to do next?");
        return;
    }
    if(blacksmith == 0) {
        write("You must build a blacksmith before you can forge weapons and tools.^^What would you like to do next?");
        return;
    }
    write("What would you like to forge?^o: Hoe^p: Pick^h: Help^c: Cancel");
    inputState = INPUTSTATE.FORGING;
}

function processForging(){
    switch(document.getElementById('inputTextBox').value) {
        case 'h':
            write("I can help!");
            break;
        case 'o':
            write("How many hoes would you like to forge?");
            forgeItem = {
                name: "hoe",
                variable: "hoes",
                stoneCost: 0,
                woodCost: 1,
                ironCost: 1,
                vineCost: 0,
                forgeTime: 1,
                forgeLevel: 1
            };
            inputState = INPUTSTATE.FORGINGCOUNT;
            break;
        case 'p':
            write("How many picks would you like to forge?");
            forgeItem = {
                name: "pick",
                variable: "picks",
                stoneCost: 0,
                woodCost: 1,
                ironCost: 1,
                vineCost: 0,
                forgeTime: 1,
                forgeLevel: 1
            };
            inputState = INPUTSTATE.FORGINGCOUNT;
            break;
        default:
            write("Not a valid choice. Please try again.");
            break;
    }
    document.getElementById('inputTextBox').value = "";
}

function processForgingCount(){
    if(document.getElementById('inputTextBox').value == 'c'){
        write("Cancelled forge.^^What would you like to do next?")
        inputState = INPUTSTATE.READY;
        document.getElementById('inputTextBox').value = "";
        return;
    }
    var count = parseInt(document.getElementById('inputTextBox').value);
    var canForge = true;
    var forgeError = "";
    if(isNaN(count)){
        write("Please input a number.");
        document.getElementById('inputTextBox').value = "";
        return;
    }

    if(blacksmith < forgeItem.forgeLevel){
        write("You must upgrade your blacksmith to forge " + forgeItem.variable + ".^Current level: " + blacksmith + "^Required level: " + forgeItem.forgeLevel + "^^What would you like to do next?");
        inputState = INPUTSTATE.READY;
        document.getElementById('inputTextBox').value = "";
        return;
    }

    if(time + forgeItem.forgeTime * count > 64){
        write("You don't have enough time to forge " + pluralize(count, forgeItem.name) + ".^^What would you like to do next?");
        inputState = INPUTSTATE.READY;
        document.getElementById('inputTextBox').value = "";
        return;
    }

    if(stone < forgeItem.stoneCost * count){
        forgeError += "Not enough stone.^Required: " + forgeItem.stoneCost * count + "^Curent: " + stone + "^^";
        canForge = false;
    }

    if(wood < forgeItem.woodCost * count){
        forgeError += "Not enough wood.^Required: " + forgeItem.woodCost * count + "^Current: " + stone + "^^";
        canForge = false;
    }

    if(iron < forgeItem.ironCost * count){
        forgeError += "Not enough iron.^Required: " + forgeItem.ironCost * count + "^Current: " + iron + "^^";
        canForge = false;
    }

    if(vines < forgeItem.vineCost * count){
        forgeError += "Not enough iron.^Required: " + forgeItem.ironCost * count + "^Current: " + iron + "^^";
        canForge = false;
    }

    if(canForge){
        stone -= forgeItem.stoneCost * count;
        wood -= forgeItem.woodCost * count;
        iron -= forgeItem.ironCost * count;
        vines -= forgeItem.vineCost * count;
        window[forgeItem.variable] += count;
        updateResources();
        write("You have forged " + pluralize(count, forgeItem.name) + ".^^What would you like to do next?");
        inputState = INPUTSTATE.READY;
    }
    else{
        write(forgeError + "What would you like to do next?");
        inputState = INPUTSTATE.READY;
    }
    document.getElementById('inputTextBox').value = "";
}

function train(){
    if (time > 63) {
        write("It's too late to train troops or workers right now.^^What would you like to do next?");
        return;
    }
    if(barracks == 0) {
        write("You must build a barracks before you can train troops or workers.^^What would you like to do next?");
        return;
    }
    if(idlePeasants == 0) {
        write("You do not have any idle peasants that can be trained.^^What would you like to do next?");
        return;
    }
    write("What would you like to train?^f: Farmer^m: Miner^h: Help^c: Cancel");
    inputState = INPUTSTATE.TRAINING;
}

function processTraining(){
    switch(document.getElementById('inputTextBox').value) {
        case 'h':
            write("I can help!");
            break;
        case 'f':
            write("How many farmers would you like to train?");
            trainItem = {
                name: "farmer",
                variable: "farmers",
                neededItemVariable: "hoes",
                goldCost: 1,
                trainTime: 1,
                barracksLevel: 1
            };
            inputState = INPUTSTATE.TRAININGCOUNT;
            break;
        case 'm':
            write("How many miners would you like to train?");
            trainItem = {
                name: "miner",
                variable: "miners",
                neededItemVariable: "picks",
                goldCost: 1,
                trainTime: 1,
                barracksLevel: 1
            };
            inputState = INPUTSTATE.TRAININGCOUNT;
            break;
        default:
            write("Not a valid choice. Please try again.");
            break;
    }
    document.getElementById('inputTextBox').value = "";
}

function processTrainingCount(){
    if(document.getElementById('inputTextBox').value == 'c'){
        write("Cancelled training.^^What would you like to do next?")
        inputState = INPUTSTATE.READY;
        document.getElementById('inputTextBox').value = "";
        return;
    }
    var count = parseInt(document.getElementById('inputTextBox').value);
    var canTrain = true;
    var trainError = "";
    if(isNaN(count)){
        write("Please input a number.");
        document.getElementById('inputTextBox').value = "";
        return;
    }

    if(barracks < trainItem.barracksLevel){
        write("You must upgrade your barracks to train " + trainItem.variable + ".^Current level: " + barracks + "^Required level: " + trainItem.barracksLevel + "^^What would you like to do next?");
        inputState = INPUTSTATE.READY;
        document.getElementById('inputTextBox').value = "";
        return;
    }

    if(time + trainItem.trainTime * count > 64){
        write("You don't have enough time to train " + pluralize(count, trainItem.name) + ".^^What would you like to do next?");
        inputState = INPUTSTATE.READY;
        document.getElementById('inputTextBox').value = "";
        return;
    }

    if(gold < trainItem.goldCost * count){
        trainError += "Not enough gold.^Required: " + trainItem.goldCost * count + "^Curent: " + gold + "^^";
        canTrain = false;
    }

    if(idlePeasants < count){
        trainError += "Not enough idle peasants to train.^Required: " + count + "^Curent: " + idlePeasants + "^^";
        canTrain = false;
    }

    if(count > window[trainItem.neededItemVariable]) {
        trainError += "Not enough " + trainItem.neededItemVariable + ".^Required: " + count + "^Current: " + window[trainItem.neededItemVariable] + "^^";
        canTrain = false;
    }

    if(canTrain){
        gold -= trainItem.goldCost * count;
        window[trainItem.neededItemVariable] -= count;
        idlePeasants -= count;
        window[trainItem.variable] += count;
        updateResources();
        write("You have trained " + pluralize(count, trainItem.name) + ".^^What would you like to do next?");
        inputState = INPUTSTATE.READY;
    }
    else{
        write(trainError + "What would you like to do next?");
        inputState = INPUTSTATE.READY;
    }
    document.getElementById('inputTextBox').value = "";
}
