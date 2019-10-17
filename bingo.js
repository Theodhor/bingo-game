const ticketsStatus = [];
let ticketSelected = 0;
let ticketSerial = 1234321;
let max = 90;
let gameOver = false;
const winningTickets =[];
const humanTickets = [];
const computerTickets = [];
const analyzedTickets = [];
function reduceTikcet(){
  if(ticketSelected>0){
    ticketSelected--;
  }
}
function increaseTicket(){
  if(ticketSelected<3){
    ticketSelected++;
  }
}
function createNumbers(){
  const numbers = [];
  for(let a=1; a<91; a++){
    numbers.push(a);
  }
  return numbers;
}
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
const extractionsArray = createNumbers();
function generateTicketsPre(target){
  for(let a=0; a<15; a++){
    const element = {};
    element.ticket = generateTicket();
    element.status = false;
    element.serial = ticketSerial;
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
  const ticketsContainer = document.querySelector('.tickets-container');
  const activator = document.querySelector('.activator');
  const preGame = document.querySelector('.pre-game');
  const game = document.querySelector('.game');
  const humanTicketsContainer = document.querySelector('.human-tickets');
  const computerTicketsContainer = document.querySelector('.computer-tickets');
  const extractedNumbers = document.querySelector('.extracted-numbers');
  const extraction = document.querySelector('.new-extraction');
  let analyzedDomTickets;

  generateTicketsPre(ticketsContainer);
  const preTicketsArray = document.querySelectorAll('.ticket');
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
        ticketSelected === 3 ? activator.classList.remove('hide-activator') : activator.classList.add('hide-activator');
      });
    }
  }
  activateSelection();
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
  let domHumanTickets;
  let domComputerTickets;

  function scanTicket(a,b,extracted){
    for(let c=0; c<15; c++){
      if(extracted === parseInt(analyzedDomTickets[a][b][c].innerText)){

        analyzedDomTickets[a][b][c].classList.add('catched');
        analyzedTickets[a][b].catched++;

        if(analyzedTickets[a][b].catched===15){
          gameOver = true;
        }
      }
    }
  }

  function scanTicketsArray(array, extracted){
    for(let a=0; a<array.length; a++){
      for(let b=0; b<array[a].length; b++){
        scanTicket(a,b,extracted);
        assignWinningTickets(analyzedTickets[a][b].ticket,analyzedTickets[a][b].catched,a,b);
      }
    }
  }

  function assignWinningTickets(ticket, counter,a,b){
    const result = {};
    if(counter === 15){
      result.ticket = ticket;
      result.coord = [a,b];
    }
    winningTickets.push(result);
  }
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



  activator.addEventListener('click', function(){
    assignPlayTickets();
    preGame.style.visibility = 'hidden';
    game.style.visibility = 'visible';
    domHumanTickets = document.querySelectorAll('.human-ticket .ticket-body');
    domComputerTickets = document.querySelectorAll('.computer-ticket .ticket-body');
    function assignDom(array){
      const result = [];
      for(let a=0; a<array.length; a++){
        result.push(array[a].children);
      }
      return result;
    }
    function assignDomNumbers(a,b){
      const result =[];
      result.push(assignDom(a));
      result.push(assignDom(b));
      return result;
    }
    analyzedDomTickets = assignDomNumbers(domHumanTickets,domComputerTickets);


    const runGame = function(){
      const interval = setInterval(function() {
        bingo(analyzedDomTickets);
        if (gameOver) clearInterval(interval);
      }, 200);
      return interval();
    };
    setTimeout(function() {
      runGame();
    }, 1000);

  });

});
