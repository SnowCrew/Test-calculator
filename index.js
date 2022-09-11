//history of operations and result
const resultsStore = [];

//displayed current operations chain
let currentOperationsSessionStore = [];

//displayed information (curr. operations chain and result)
const calcOperationsChainDisplay = document.querySelector('#display-state');
const calcResultDisplay = document.querySelector('#display-result');

//Calc logic variables
let operationSign = '';
let lastOperationNumber = '';
let nextOperationNumber = '';
let finish = false;

//Calc button's keys arrays
//Elements digit key-values in buttons [".","0",...,"9"]
let digitKeys = [];
document.querySelectorAll('.digits').forEach(el => { digitKeys.push(el.textContent) })
//Elements math operations key-values in buttons ["+", "-", "/", "*", "%"]
let mathOperationKeys = [];
document.querySelectorAll('.math-oper').forEach(el => { mathOperationKeys.push(el.textContent) })
//Elements clearing one and all ["C", "DEL"]
let clearOperationKeys = [];
document.querySelectorAll('.clear-oper').forEach(el => { clearOperationKeys.push(el.textContent) })

//Helpers functions
const switchCaseMainCalculation = (sign) => {
  switch (sign) {
    case "+":
      lastOperationNumber = Number(lastOperationNumber) + Number(nextOperationNumber);
      break;
    case "-":
      lastOperationNumber = Number(lastOperationNumber) - Number(nextOperationNumber)
      break;
    case "*":
      lastOperationNumber = Number(lastOperationNumber) * Number(nextOperationNumber)
      break;
    case "/":
      if (Number(nextOperationNumber) === 0) {
        lastOperationNumber = 'Error DIV/0!'
        calcResultDisplay.textContent = lastOperationNumber;
      } else {
        lastOperationNumber = Number(lastOperationNumber) / Number(nextOperationNumber)
      }
      break;
  }
}

//Clear/delete functions for clear button operations
const allClear = () => {
  lastOperationNumber = '';
  nextOperationNumber = '';
  operationSign = '';
  finish = false;
  currentOperationsSessionStore = [];
  calcResultDisplay.textContent = 0;
  calcOperationsChainDisplay.textContent = 0;
}
const deleteOneNum = () => {
  if (calcResultDisplay.textContent.length > 1) {
    //del last digit on display
    //if we typing digits first time or don't have second number yet
    if (nextOperationNumber === "") {
      if (lastOperationNumber.length > 1) {
        lastOperationNumber = lastOperationNumber.slice(0, -1);
        calcResultDisplay.textContent = calcResultDisplay.textContent.slice(0, -1);

        console.log(lastOperationNumber, "del")
      }
    }
    //if we already have one number to calculate
    if (nextOperationNumber.length > 1) {
      nextOperationNumber = nextOperationNumber.slice(0, -1);
      calcResultDisplay.textContent = calcResultDisplay.textContent.slice(0, -1);

      console.log(nextOperationNumber, "del")

    }
  }
}

//EventListeners
document.querySelector('.calc-operations').addEventListener('click', (event) => {
  if (!event.target.classList.contains('btn')) return;

  //if pressed Clear(C) or delete(DEL)
  if (clearOperationKeys.includes("C" || "DEL")) {
    if (event.target.textContent === 'C') {
      allClear();
    }
    if (event.target.textContent === 'DEL') {
      deleteOneNum();
    }
  }

  // Button identification for digits and math operations
  const key = event.target.textContent;

  //if pressed digit 0-9 or "."
  if (digitKeys.includes(key)) {
    //First time enter digits
    if (nextOperationNumber === "" && operationSign === "") {
      lastOperationNumber += key;
      calcResultDisplay.textContent = lastOperationNumber;
      //Calculate result after "="
    } else if (lastOperationNumber !== "" && nextOperationNumber !== "" && finish) {
      nextOperationNumber = key;
      finish = false;
      calcResultDisplay.textContent = nextOperationNumber;
    } else {
      nextOperationNumber += key;
      calcResultDisplay.textContent = nextOperationNumber;
      // calcOperationsChainDisplay.textContent = `${lastOperationNumber}${operationSign}`;
    }
    console.log("a=", lastOperationNumber, "b=", nextOperationNumber, operationSign, 'digit press');
    return;
  }

  //if pressed operation +-/* etc. 
  if (mathOperationKeys.includes(key)) {
    //CALCULATING before "=" 
    //(if we select one numbers and click on action)
    if (operationSign !== "" && nextOperationNumber === "") {
      //collection session store data
      currentOperationsSessionStore.push(lastOperationNumber, operationSign, nextOperationNumber);


      switchCaseMainCalculation(operationSign);

      calcOperationsChainDisplay.textContent = `${lastOperationNumber}${operationSign}${nextOperationNumber}`;

      //Collection operations you did
      if (lastOperationNumber && nextOperationNumber) {
        currentOperationsSessionStore.push("=", lastOperationNumber);
        resultsStore.push(currentOperationsSessionStore.join(""));
      }
      currentOperationsSessionStore = [];
      console.log(resultsStore, currentOperationsSessionStore);
    }
    operationSign = key;
    calcOperationsChainDisplay.textContent = `${lastOperationNumber}${operationSign}`;
    console.log("a=", lastOperationNumber, "b=", nextOperationNumber, operationSign, "oper press");
    return;
  }

  //Calculation After pressing Result btn "="
  if (key === '=') {
    if (lastOperationNumber === "" && operationSign === "") {
      return;
    }
    if (lastOperationNumber === "" && nextOperationNumber === "") {
      return;
    }

    calcOperationsChainDisplay.textContent = `${lastOperationNumber}${operationSign}${nextOperationNumber}`;

    //Only one number entered, we'll count with the same numbers
    if (nextOperationNumber === '' && operationSign !== "") {
      nextOperationNumber = Number(lastOperationNumber);
      calcOperationsChainDisplay.textContent = `${lastOperationNumber}${operationSign}${nextOperationNumber}`;
    };

    //collection session store data
    currentOperationsSessionStore.push(lastOperationNumber, operationSign, nextOperationNumber);

    //Counting logic !
    switchCaseMainCalculation(operationSign);

    finish = true;
    calcResultDisplay.textContent = lastOperationNumber;
    console.log("a=", lastOperationNumber, "b=", nextOperationNumber, operationSign, 'result press')

    //Collection operations you did
    if (lastOperationNumber && nextOperationNumber) {
      currentOperationsSessionStore.push("=", lastOperationNumber);
      resultsStore.push(currentOperationsSessionStore.join(""));
    }
    currentOperationsSessionStore = [];
    console.log(resultsStore, currentOperationsSessionStore);
  }

})