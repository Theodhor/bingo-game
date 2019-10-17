/* Thank you for viewing my code.
   The game is split in 2 phases
    - phase 1, you have to select 3 tickes from 15 randomly generated
    - phase 2, you have 3 tickets, the computer have 12, who makes bingo first wins
   The game is perfectly working and can graphically improved
   In this game i focused on data-structure , algorithms and callback functions.
*/

/* becomes true once a ticket matches all numbers*/
let gameOver = false;

/* array in which will be stored an array of 15 numbers and a status
to check if the ticket has been selected(to proced to phase 2)*/
const ticketsStatus = [];

/* controls the number of tickets selected*/
let ticketSelected = 0;

/* it can be any number*/
let ticketSerial = 1234321;

/* to be used when generating the 15 random numbers of a ticket*/
let max = 90;

/* stores the 3 tickets selected in phase 1 */
const humanTickets = [];

/* stores the remaining 12 tickets*/
const computerTickets = [];

/* human tickets + computer tickets, in the end the structure of this preTicketsArray
   will be: [[3{status,catched,ticket[15]}],[12{status,catched,ticket[]}]]*/
const analyzedTickets = [];


/* in phase 1 reduces ticketselected*/
function reduceTikcet(){
  if(ticketSelected>0){
    ticketSelected--;
  }
}

/* in phase 1 increases ticketselected counter*/
function increaseTicket(){
  if(ticketSelected<3){
    ticketSelected++;
  }
}

/* creates an array of 90 elements each of them is a number between 1 and 90*/
function createNumbers(){
  const numbers = [];
  for(let a=1; a<91; a++){
    numbers.push(a);
  }
  return numbers;
}

/* creates an array of 15 different numbers between 1 and 90*/
const generateTicket = function(){
  let max = 90;
  const ticket =[];
  const numbers = createNumbers();
  for(let a=0; a<15; a++){
    const mid = Math.floor(Math.random() * max);
    ticket.push(numbers[mid]);
    max--;
    numbers.splice(mid,1);
  }
  ticket.sort((a,b) => (a-b));
  return ticket;
};

/* for phase 2 creates an array of numbers from 1 to 90
  to be used as a pool for the extractions*/
const extractionsArray = createNumbers();

/* generates an array of 15 objects and create the relative dom elements*/
function generateTicketsPre(target){
  for(let a=0; a<15; a++){
    const element = {};
    element.ticket = generateTicket();
    element.status = false;
    element.serial = ticketSerial;
    /* in phase 2 increases every time the ticket matches an extraction*/
    element.catched = 0;
    ticketSerial++;
    ticketsStatus.push(element);

    const ticket= document.createElement('div');
    ticket.classList.add('ticket');

    const ticketHeader = document.createElement('div');
    ticketHeader.classList.add('ticket-header');
    ticketHeader.innerText = 'Ticket serial:  ' + ticketsStatus[a].serial;

    const ticketBody = document.createElement('div');
    ticketBody.classList.add('ticket-body');

    for(let b=0; b<15; b++){
      const ticketNumber = document.createElement('div');
      ticketNumber.classList.add('ticket-number');
      ticketNumber.innerText = ticketsStatus[a].ticket[b];
      ticketBody.appendChild(ticketNumber);
    }

    ticket.appendChild(ticketHeader);
    ticket.appendChild(ticketBody);

    target.appendChild(ticket);
  }
}


/* phase 2, creates the dom elements for player's and computer's tickets*/
function generatePlayTicket(index,condition,array){
  const ticket = document.createElement('div');
  condition ? ticket.classList.add('human-ticket') : ticket.classList.add('computer-ticket');

  const header = document.createElement('div');
  header.classList.add('header');
  header.innerText = 'Ticket serial: ' + array[index].serial;

  const ticketBody = document.createElement('div');
  ticketBody.classList.add('ticket-body');

  for(let a=0; a<15; a++){
    const ticketNumber = document.createElement('div');
    ticketNumber.classList.add('ticket-number');
    ticketNumber.innerText = array[index].ticket[a];

    ticketBody.appendChild(ticketNumber);
  }

  ticket.appendChild(header);
  ticket.appendChild(ticketBody);

  return ticket;
}

document.addEventListener('DOMContentLoaded', function() {

  /* dom element containing tickets in phase 1*/
  const ticketsContainer = document.querySelector('.tickets-container');

  /* clickable if you select 3 tickets in phase 1*/
  const activator = document.querySelector('.activator');

  /* the dom body for phase 1*/
  const preGame = document.querySelector('.pre-game');

  /* the dom body for phase 2*/
  const game = document.querySelector('.game');

  /* the containers of the relative tickets*/
  const humanTicketsContainer = document.querySelector('.human-tickets');
  const computerTicketsContainer = document.querySelector('.computer-tickets');

  /* dom container in phase 2 where is recorded every single extraction*/
  const extractedNumbers = document.querySelector('.extracted-numbers');

  /* dom container of the new extracted number*/
  const extraction = document.querySelector('.new-extraction');

  /* array of human tickets + computer tickets, needed to change the
     square color if an extraction is matched*/
  let analyzedDomTickets;

  /* in phase 2 shows if the game is in progress or a ticket made bingo*/
  const annauncer = document.querySelector('.announcer');

  /* commented up*/
  generateTicketsPre(ticketsContainer);

  /* dom tickets in phase 1*/
  const preTicketsArray = document.querySelectorAll('.ticket');

  /* phase 1 tickets become clickable, you can select a maximum of 3,
     and you can also deselect*/
  function activateSelection(){
    for(let a=0; a<preTicketsArray.length; a++){
      preTicketsArray[a].addEventListener('click', function(){
        if(ticketsStatus[a].status === true){
          preTicketsArray[a].classList.remove('selected');
          ticketsStatus[a].status = false;
          reduceTikcet();
        } else {
          if(ticketSelected<3){
            ticketsStatus[a].status = true;
            preTicketsArray[a].classList.add('selected');
            increaseTicket();
          }
        }
        /* if you have selected 3 tickets you can procede to phase 2*/
        ticketSelected === 3 ? activator.classList.remove('hide-activator') : activator.classList.add('hide-activator');
      });
    }
  }
  activateSelection();

  /* appends to the container the relative tickets*/
  function assignPlayTickets(){
    for (let a=0; a<15; a++){
      const domTicket = generatePlayTicket(a,ticketsStatus[a].status,ticketsStatus);
      if (ticketsStatus[a].status) {
        humanTickets.push(ticketsStatus[a]);
        humanTicketsContainer.appendChild(domTicket);
      } else {
        computerTickets.push(ticketsStatus[a]);
        computerTicketsContainer.appendChild(domTicket);
      }
    }
    analyzedTickets.push(humanTickets);
    analyzedTickets.push(computerTickets);
  }

  /* needed to add different styling to winning tickets*/
  let domHumanTickets;
  let domComputerTickets;

  /* phase 2 checks if any ticket contains a number that matches with
    the extraction, if so increases the catching counter of the ticket,
    if the catching counter reaches 15, switches to tue the gameOver boolean*/
  function scanTicket(a,b,extracted){
    for(let c=0; c<15; c++){
      if(extracted === parseInt(analyzedDomTickets[a][b][c].innerText)){

        analyzedDomTickets[a][b][c].classList.add('catched');
        analyzedTickets[a][b].catched++;

        if(analyzedTickets[a][b].catched===15){
          gameOver = true;
          annauncer.innerText = 'BINGO!!';
          for(let y=0;y<15;y++){
            analyzedDomTickets[a][b][y].classList.remove('catched');
            a === 0 ? analyzedDomTickets[a][b][y].classList.add('winning-human') :
              analyzedDomTickets[a][b][y].classList.add('winning-computer');
          }
        }
      }
    }
  }

  /* applies the ticket scan to a given array of tickets*/
  function scanTicketsArray(array, extracted){
    for(let a=0; a<array.length; a++){
      for(let b=0; b<array[a].length; b++){
        scanTicket(a,b,extracted);
      }
    }
  }

  /* main function of phase 2, executes the game*/
  function bingo(array){
    const extractedIndex = Math.floor(Math.random() * max);
    const extracted = extractionsArray[extractedIndex];

    extraction.innerText = extracted;

    const domExtracted = document.createElement('div');
    domExtracted.classList.add('extracted-number');
    domExtracted.innerText = extracted;

    extractedNumbers.appendChild(domExtracted);

    scanTicketsArray(array,extracted);

    extractionsArray.splice(extractedIndex,1);
    max--;
  }

  /* if clicked switches from phase 1 to phase 2. Once clicked all the
      functions of phase 2 will be called*/
  activator.addEventListener('click', function(){
    assignPlayTickets();
    preGame.style.visibility = 'hidden';
    game.style.visibility = 'visible';

    /* array of the number-containers of each ticket*/
    domHumanTickets = document.querySelectorAll('.human-ticket .ticket-body');
    domComputerTickets = document.querySelectorAll('.computer-ticket .ticket-body');

    /* given a number-container, creates an array of the numbers inside the container*/
    function assignDom(array){
      const result = [];
      for(let a=0; a<array.length; a++){
        result.push(array[a].children);
      }
      return result;
    }

    /* for each number container executes assignDom*/
    function assignDomNumbers(a,b){
      const result =[];
      result.push(assignDom(a));
      result.push(assignDom(b));
      return result;
    }

    /* [[3[15]],[12[15]] this is what it will be structured similar to line 26*/
    analyzedDomTickets = assignDomNumbers(domHumanTickets,domComputerTickets);

    /*an extraction every second till a ticket makes bingo*/
    const runGame = function(){
      const interval = setInterval(function() {
        bingo(analyzedDomTickets);
        if (gameOver) clearInterval(interval);
      }, 1000);
      return interval;
    };

    /* delaying of 1 s the start of the extractions*/
    setTimeout(function() {
      runGame();
    }, 1000);

  });

});
