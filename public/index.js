'use strict';

//list of bats
//useful for ALL 5 steps
//could be an array of objects that you fetched from api or database
const bars = [{
  'id': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'name': 'freemousse-bar',
  'pricePerHour': 50,
  'pricePerPerson': 20
}, {
  'id': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'name': 'solera',
  'pricePerHour': 100,
  'pricePerPerson': 40
}, {
  'id': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'name': 'la-poudriere',
  'pricePerHour': 250,
  'pricePerPerson': 80
}];

//list of current booking events
//useful for ALL steps
//the time is hour
//The `price` is updated from step 1 and 2
//The `commission` is updated from step 3
//The `options` is useful from step 4
const events = [{
  'id': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'booker': 'esilv-bde',
  'barId': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'time': 4,
  'persons': 8,
  'options': {
    'deductibleReduction': false
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}, {
  'id': '65203b0a-a864-4dea-81e2-e389515752a8',
  'booker': 'societe-generale',
  'barId': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'time': 8,
  'persons': 30,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}, {
  'id': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'booker': 'otacos',
  'barId': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'time': 5,
  'persons': 80,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}];

//list of actors for payment
//useful from step 5
const actors = [{
  'eventId': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'eventId': '65203b0a-a864-4dea-81e2-e389515752a8',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'eventId': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}];

//functions
//STEP 1 - Euro-People
function calculatePrice(time,persons,pricePerHour,pricePerPerson) {
    return time * pricePerHour + persons * pricePerPerson;
}


//STEP 2 - Send more, pay less
function decreasePricePerPerson(persons, pricePerPerson){
  if(persons>10 && persons<=20)
  {
    pricePerPerson = pricePerPerson - pricePerPerson*0.1;
  }
  if(persons>20 && persons<=60)
  {
    pricePerPerson = pricePerPerson - pricePerPerson*0.3;
  }
  if(persons>60)
  {
    pricePerPerson = pricePerPerson - pricePerPerson*0.5;
  }
  return pricePerPerson;
}


//Change price in the list of events (for STEP 1 & 2)
function changePrice(events,bars) {
  for(var i = 0; i < events.length; i++)
  {
    //First, we search the bar corresponding to the event
    var bar;
    for(var j = 0; j < bars.length; j++)
    {
      if(events[i].barId == bars[j].id)
      {
        bar = bars[j];
      }
    }
    //Then, we define the variables that will help us calculate the price
    var time = events[i].time;
    var persons = events[i].persons;
    var pricePerHour = bar.pricePerHour;
    var pricePerPerson = bar.pricePerPerson;
    //Finally, we change the price of the event with the correct formula
    pricePerPerson = decreasePricePerPerson(persons,pricePerPerson);
    events[i].price = calculatePrice(time,persons,pricePerHour,pricePerPerson);
  }
}


//STEP 3 - Give me all your money
function changeCommission(events){
  for(var i = 0; i < events.length; i++)
  {
    var commission = events[i].price * 0.3;
    var insurance = commission / 2;
    var treasury = events[i].persons;
    var privateaser = commission - insurance - treasury;
    events[i].commission = {insurance,treasury,privateaser};
  }
}


//STEP 4 - The famous deductible
function changePriceDeductible(events){
  for(var i = 0; i < events.length; i++)
  {
    if(events[i].options.deductibleReduction)
    {
      events[i].price += events[i].persons
<<<<<<< HEAD
      events[i].commission.privateaser += events[i].persons
=======
>>>>>>> c02a042860a9aadf95fb60c078678996e29958ab
    }
  }
}


<<<<<<< HEAD
//STEP 5 - Pay the actors
function changePayment(actors,events){
  for(var i = 0; i < actors.length; i++)
  {
    //We search for the corresponding event
    var event;
    for(var j = 0; j < events.length; j++)
    {
      if(actors[i].eventId == events[j].id)
      {
        event = events[j];
      }
    }
    var booker = event.price;
    var bar = event.price - (event.commission.insurance + event.commission.treasury + event.commission.privateaser);
    var insurance = event.commission.insurance;
    var treasury = event.commission.treasury;
    var privateaser = event.commission.privateaser;
    actors[i].payment[0].amount = booker;
    actors[i].payment[1].amount = bar;
    actors[i].payment[2].amount = insurance;
    actors[i].payment[3].amount = treasury;
    actors[i].payment[4].amount = privateaser;
  }
}


changePrice(events,bars);
changeCommission(events);
changePriceDeductible(events);
changePayment(actors,events);
=======
changePrice(events,bars);
changeCommission(events);
changePriceDeductible(events);
>>>>>>> c02a042860a9aadf95fb60c078678996e29958ab

console.log(bars);
console.log(events);
console.log(actors);
