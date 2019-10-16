const ticketsStatus = [];
let ticketSelected = 0;
let ticketSerial = 1234321;
const humanTciekts = [];
const computerTickets = [];
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
const createNumbers = function(){
  const numbers = [];
  for(let a=1; a<91; a++){
    numbers.push(a);
  }
  return numbers;
};
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
        humanTciekts.push(ticketsStatus[a]);
        humanTicketsContainer.appendChild(domTicket);
      } else {
        computerTickets.push(ticketsStatus[a]);
        computerTicketsContainer.appendChild(domTicket);
      }
    }
  }

  activator.addEventListener('click', function(){
    function assignPlayers(){
      for(let a=0; a<15; a++){
        const element = {};
        element.ticket = ticketsStatus[a];
        if(ticketsStatus[a].status === true){
          element.owner = 'Human player';
          humanTciekts.push(element);
        } else {
          element.owner = 'Computer player';
          computerTickets.push(element);
        }
      }
    }
    assignPlayers();
    assignPlayTickets();
    preGame.style.visibility = 'hidden';
    game.style.visibility = 'visible';
    console.log(humanTciekts,computerTickets);
  });
});
