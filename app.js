document.addEventListener('DOMContentLoaded', function() {
  console.log('dom loaded');
  let switcher = true;
  const extractions = document.querySelector('.extractions');
  const extraction = document.querySelector('.extraction');
  const tickets = document.querySelector('.tickets');
  const ticketsreal = [];
  const ticketsvirtual = [];
  for(let a=0; a<90; a++){
    const div = document.createElement('div');
    div.classList.add('extract');
    extractions.appendChild(div);
  }
  const extractvector = document.querySelectorAll('.extract');
  for(let a=0; a<16; a++){
    const div = document.createElement('div');
    div.classList.add('ticket');
    tickets.appendChild(div);
  }
  const ticketvector = document.querySelectorAll('.ticket');
  ticketvector.forEach(ticket =>{
    for(let a=0; a<15; a++){
      const div = document.createElement('div');
      div.classList.add('square');
      ticket.appendChild(div);
    }
  });


  const createNumbers = function(){
    const numbers = [];
    for(let a=1; a<91; a++){
      numbers.push(a);
    }
    return numbers;
  };
  const ticketsarray =[];
  const generateticket = function(){
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
  for(let a=0; a<16; a++){
    const ticket = generateticket();
    ticketsarray.push(ticket);
    ticketsvirtual.push(15);
  }

  for(let a=0; a<ticketvector.length; a++){
    const ticket = ticketvector[a];
    const squares = ticket.children;
    ticketsreal.push(squares);
    const virtual = ticketsarray[a];
    for(let b=0; b<squares.length; b++){
      squares[b].innerText = virtual[b];
    }
  }

  const numbers = createNumbers();
  let counter = 0;
  let max = 90;

  const bingo = function(){
    const mid = Math.floor((Math.random() * max) + 1);
    const middle = numbers[mid-1];
    extraction.innerText = middle;
    extractvector[counter].innerText = middle;
    extractvector[counter].classList.add('extracted');

    for(let a=0;a<ticketsreal.length;a++){
      for(let b=0;b<ticketsreal[a].length;b++){
        if(parseInt(ticketsreal[a][b].innerText) === middle){
          ticketsreal[a][b].classList.add('catched');
          ticketsvirtual[a]--;
          if(ticketsvirtual[a] === 0){
            switcher = false;
            extraction.innerText = 'BINGO';
            for(let b=0;b<ticketsreal[a].length;b++){
              ticketsreal[a][b].classList.remove('catched');
              ticketsreal[a][b].classList.add('winning');
            }
          }
        }
      }
      console.log(switcher);
    }
    numbers.splice(mid-1,1);
    counter ++;
    max--;

  };

  function runGame(){
    const interval = setInterval(function() {
      bingo();
      if (switcher === false) clearInterval(interval);
    }, 200);
  }

  setTimeout(function() {
    runGame();
  }, 1000);

});
