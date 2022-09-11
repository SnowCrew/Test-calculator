//history of operations and result
const resultsStore = [];

//displayed current operations chain
const currentOperationsStore = [];

//displayed information (curr. operations chain and result)
const calcOperationsChain = document.querySelector('#display-state');
const calcResult = document.querySelector('#display-result');

//Buttons
//operations buttons
const allClearBtn = document.querySelector('.clear');
const deleteOneNumBtn = document.querySelector('.delete');
const percentBtn = document.querySelector('.percent');
const plusBtn = document.querySelector('.plus');
const minusBtn = document.querySelector('.minus');
const multBtn = document.querySelector('.mult');
const divisionBtn = document.querySelector('.division');
const resultBtn = document.querySelector('.result');

//number buttons
const zeroBtn = document.querySelector('.zero');
const oneBtn = document.querySelector('.one');
const twoBtn = document.querySelector('.two');
const threeBtn = document.querySelector('.three');
const fourBtn = document.querySelector('.four');
const fiveBtn = document.querySelector('.five');
const sixBtn = document.querySelector('.six');
const sevenBtn = document.querySelector('.seven');
const eightBtn = document.querySelector('.eight');
const nineBtn = document.querySelector('.nine');

//functions for button operations
const allClear = () => {

}


//addEventListener


resultBtn.addEventListener('click', () => 123)
console.log(calcOperationsChain.textContent)