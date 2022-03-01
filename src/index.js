//bacon

//TODO:
//Change sky color based on time

var isWriting = false;

const INPUTSTATE = {
    READY: 0,
    BUILDING: 1,
    FORGING: 2
};
var inputState;

var time;
var day;

//resources
var stone;
var wood;
var iron;
var vines;

//population
var idlePeasants;

//buildings
var blacksmith;
var barracks;
var farm;
var smallHouse;
var largeHouse;
var stable;
var stockpile;
var market;

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
    idlePeasants = 0;
    stone = 0;
    wood = 0;
    iron = 0;
    vines = 0;
    hoes = 0;
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

    switch(document.getElementById('inputTextBox').value) {
        case 'h':
        case 'H':
            write("Yeah, you look like you'd need help.");
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
            time += 1;
            updateResources();
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

function updateResources(){
    document.getElementById('stone').textContent = stone;
    document.getElementById('wood').textContent = wood;
    document.getElementById('vines').textContent = vines;
    document.getElementById('iron').textContent = iron;
    document.getElementById('hoes').textContent = hoes;

    document.getElementsByClassName('day').textContent = day;
    var timeSpan = document.getElementById('time');
    timeSpan.textContent = '';
    var hour = Math.floor(time / 4);
    var minute = time % 4 * 15;
    if (minute == 0) minute = "00";
    if (time < 24) timeSpan.textContent = hour + 6 + ":" + minute + " am";
    else if (23 < time  && time < 28) timeSpan.textContent = hour + 6 + ":" + minute + " PM";
    else timeSpan.textContent = hour - 6 + ":" + minute + " PM";
}

function goMining(){
    if(time > 60) {
        write("It's too late to go mining.")
        return;
    }
    var stoneGet = Math.floor(Math.random() * 13 + 10);
    var ironGet = Math.floor(Math.random() * 11 - 4)
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
            write("Let's pretend we built a blacksmith!^^What would you like to do next?");
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
        write("It's too late to forge anything right now.");
        return;
    }
    write("What would you like to forge?^O: Hoe^P: Pick^H: Help^C: Cancel");
    inputState = INPUTSTATE.FORGING;
}

function processForging(){
    switch(document.getElementById('inputTextBox').value) {
        case 'h':
            write("I can help!");
            break;
        case 'o':
            write("Let's pretend we forged a hoe!^^What would you like to do next?");
            hoes += 1;
            updateResources();
            inputState = INPUTSTATE.READY;
            break;
        default:
            write("Not a valid forge. Please try again.");
            break;
    }
    document.getElementById('inputTextBox').value = "";
}
