//history of operations and result
const resultsStore = [];

//displayed current operations chain store
let currentOperationsSessionStore = [];

//Displayed information (curr. operations chain and result)
const calcOperationsChainDisplay = document.querySelector('#display-state');
const calcResultDisplay = document.querySelector('#display-result');
const equalBeforeZero = document.querySelector('#equalBeforeZero');

//Calc logic variables
let operationSign = '';
let lastOperationNumber = '';
let nextOperationNumber = '';
let finish = false;

//Calc button's keys arrays
//Elements digit key-values in buttons [".","0",...,"9"]
let digitKeys = [];
const digits = document.querySelectorAll('.digits');
digits.forEach(el => { digitKeys.push(el.textContent) })
//Elements math operations key-values in buttons ["+", "-", "/", "*", "%"]
let mathOperationKeys = [];
const mathOperations = document.querySelectorAll('.math-oper');
mathOperations.forEach(el => { mathOperationKeys.push(el.textContent) });
//Elements clearing one and all ["C", "DEL"]
let clearOperationKeys = [];
document.querySelectorAll('.clear-oper').forEach(el => { clearOperationKeys.push(el.textContent) })
//Elements All Buttons
let allBtns = document.querySelectorAll('.btn');

//Helper functions
//Helper do some magic toFix number and then delete unnecessary zeroes
const fixedNumbers = (num) => {
  return Number(num.toFixed(8))
}
//Helper main calculations
const switchCaseMainCalculation = (sign) => {
  switch (sign) {
    case "+":
      lastOperationNumber = fixedNumbers(Number(lastOperationNumber) + Number(nextOperationNumber));
      break;
    case "-":
      lastOperationNumber = fixedNumbers(Number(lastOperationNumber) - Number(nextOperationNumber));
      break;
    case "*":
      lastOperationNumber = fixedNumbers(Number(lastOperationNumber) * Number(nextOperationNumber));
      break;
    case "/":
      if (nextOperationNumber === "0" || nextOperationNumber === 0) {
        lastOperationNumber = 'Error DIV/0!';
        calcResultDisplay.textContent = 'Error DIV/0!';
        return;
      } else {
        lastOperationNumber = fixedNumbers(Number(lastOperationNumber) / Number(nextOperationNumber));
      }
      break;
  }
}

//Helper add or remove "active" class to elements/buttons using keyboard
const allKeyboardKeys = [...digitKeys, ...mathOperationKeys, "Delete", "Backspace", "=", "Enter", "%"];
const helperswitchCaseActiveClass = (item) => {
  allBtns.forEach(e => {
    if (e.textContent === item) {
      e.classList.toggle('active')
    }
  })
}
const switchCaseActiveClass = (key) => {
  switch (key) {
    case "Enter":
      helperswitchCaseActiveClass("=")
      break;
    case "Backspace":
      helperswitchCaseActiveClass("DEL")
      break;
    case "Delete":
      helperswitchCaseActiveClass("C");
      break;
    case "%":
      helperswitchCaseActiveClass("%");
      break;
  }

  if ([...digitKeys, ...mathOperationKeys].includes(key)) {
    helperswitchCaseActiveClass(key)
  }
}

//Hepler Clear/delete functions for clear button operations
//All clear
const allClear = () => {
  lastOperationNumber = '';
  nextOperationNumber = '';
  operationSign = '';
  finish = false;
  currentOperationsSessionStore = [];
  calcResultDisplay.textContent = 0;
  calcOperationsChainDisplay.textContent = 0;
}

//delete
const deleteOneNum = () => {
  //del last digit on display
  //if we typing digits first time or don't have second number yet
  if (calcResultDisplay.textContent === "0") {
    return;
  }
  if (nextOperationNumber === "") {
    if (lastOperationNumber.length > 1) {
      lastOperationNumber = lastOperationNumber.slice(0, -1);
      calcResultDisplay.textContent = calcResultDisplay.textContent.slice(0, -1);
      return;
    } else if (lastOperationNumber.length === 1 && operationSign !== "") {
      return;
    } else {
      lastOperationNumber = '';
      calcResultDisplay.textContent = "0";
      return;
    }
  }
  //if we already have one/first number to calculate
  if (nextOperationNumber.length > 1) {
    nextOperationNumber = nextOperationNumber.slice(0, -1);
    calcResultDisplay.textContent = calcResultDisplay.textContent.slice(0, -1);
    return;
  } else {
    nextOperationNumber = "";
    calcResultDisplay.textContent = "0";
    return;
  }
}

//EventListeners
//onclick
document.querySelector('.calc-operations').addEventListener('click', (event) => {
  //Check if click buttons
  if (!event.target.classList.contains('btn')) return;

  // Button identification for digits and math operations (what event happened)
  const key = event.target.textContent;

  //if pressed Clear(C) or delete(DEL)
  if (clearOperationKeys.includes(key)) {
    if (event.target.textContent === 'C') {
      allClear();
      equalBeforeZero.textContent = "";
      return;
    }
    if (event.target.textContent === 'DEL') {
      deleteOneNum();
    }
  }

  //if pressed digit 0-9 or "."
  if (digitKeys.includes(key)) {

    //Check double '.' case
    if (calcResultDisplay.textContent.includes('.') && key === ".") {
      return;
    }

    //First time enter digits
    if (nextOperationNumber === "" && operationSign === "") {
      //Check amount of digits, 15 max
      if (calcResultDisplay.textContent.length === 15) {
        return;
      }
      //Check two 00
      if (lastOperationNumber === "" && key === "0") {
        return;
      }
      //Check for only "." without zero before it
      if (key === "." && lastOperationNumber === "") {
        lastOperationNumber = "0.";
        calcResultDisplay.textContent = lastOperationNumber;
        return;
      }
      lastOperationNumber += key;
      calcResultDisplay.textContent = lastOperationNumber;

      //Check equal before zero if zero
      if (calcResultDisplay.textContent === "0") {
        equalBeforeZero.textContent = "";
      } else {
        equalBeforeZero.textContent = "=";
      }

      //Calculate result after "="
    } else if (lastOperationNumber !== "" && nextOperationNumber !== "" && finish) {
      nextOperationNumber += key;
      finish = false;
      calcResultDisplay.textContent = nextOperationNumber;
    } else {
      //Check amount of digits, 15 max
      if (nextOperationNumber.length === 15) {
        return;
      }
      if (key === "." && nextOperationNumber === "") {
        nextOperationNumber = "0.";
        calcResultDisplay.textContent = nextOperationNumber;
        return;
      }
      if (nextOperationNumber === "0" && key === "0") {
        return;
      } else if (nextOperationNumber === "0" && key !== "0" && key !== ".") {
        nextOperationNumber = key;
        calcResultDisplay.textContent = nextOperationNumber;
        return;
      }
      nextOperationNumber += key;
      calcResultDisplay.textContent = nextOperationNumber;
      // calcOperationsChainDisplay.textContent = `${lastOperationNumber}${operationSign}`;
    }
    return;
  }

  //Percent "%" calculation
  if (key === "%") {
    if (lastOperationNumber === "" || lastOperationNumber === "0" || operationSign === "") {
      lastOperationNumber = "";
      calcResultDisplay.textContent = "0";
      return;
    } else if (lastOperationNumber !== "" && lastOperationNumber !== "0" && operationSign !== "" && nextOperationNumber === "") {
      let temporaryPercentVar = lastOperationNumber;
      nextOperationNumber = fixedNumbers(Number(lastOperationNumber) * 0.01 * Number(lastOperationNumber));
      switchCaseMainCalculation(operationSign);
      //variables magic
      lastOperationNumber = nextOperationNumber;
      lastOperationNumber = temporaryPercentVar;

      calcResultDisplay.textContent = nextOperationNumber;
      calcOperationsChainDisplay.textContent = `${Number(lastOperationNumber)}${operationSign}${Number(nextOperationNumber)}`;

      return;
    } else {
      nextOperationNumber = fixedNumbers(Number(lastOperationNumber) * 0.01 * Number(nextOperationNumber));
      calcResultDisplay.textContent = nextOperationNumber;
    }
  }

  //if pressed operation +-/* 
  if (mathOperationKeys.includes(key)) {

    // //Check if first number should be negative 
    // if (lastOperationNumber === "" && key === "-") {
    //   lastOperationNumber = "0";
    //   operationSign = "-";
    //   calcOperationsChainDisplay.textContent = `${lastOperationNumber}${operationSign}`
    //   return;
    // }

    if (lastOperationNumber === "") {
      return;
    }
    if ((key === "*" && operationSign === "*") || (key === "/" && operationSign === "/")) {
      return;
    }
    //CALCULATING before "=" 
    //(if we select one numbers and click on action)
    if (operationSign !== "" && nextOperationNumber !== "") {
      //collection session store data
      currentOperationsSessionStore.push(Number(lastOperationNumber), operationSign, Number(nextOperationNumber));
      //Calculation
      switchCaseMainCalculation(operationSign);

      //Collection operations you did
      currentOperationsSessionStore.push("=", Number(lastOperationNumber));
      resultsStore.push(currentOperationsSessionStore.join(""));

      nextOperationNumber = "";
      calcResultDisplay.textContent = lastOperationNumber;
      calcOperationsChainDisplay.textContent = `${Number(lastOperationNumber)}${operationSign}${Number(nextOperationNumber)}`;

      currentOperationsSessionStore = [];
      console.log(resultsStore);
    }
    operationSign = key;
    calcResultDisplay.textContent = `${Number(lastOperationNumber)}`;
    calcOperationsChainDisplay.textContent = `${Number(lastOperationNumber)}${operationSign}`;
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
    calcOperationsChainDisplay.textContent = `${Number(lastOperationNumber)}${operationSign}${(nextOperationNumber)}`;

    //Only first number entered, we'll count with the same numbers
    if (nextOperationNumber === '' && operationSign !== "") {
      nextOperationNumber = Number(lastOperationNumber);
      calcOperationsChainDisplay.textContent = `${Number(lastOperationNumber)}${operationSign}${Number(nextOperationNumber)}`;
    };

    //collection session store data
    currentOperationsSessionStore.push(Number(lastOperationNumber), operationSign, Number(nextOperationNumber));

    //Calculation
    switchCaseMainCalculation(operationSign);

    finish = true;
    calcResultDisplay.textContent = lastOperationNumber;
    nextOperationNumber = "";

    //Collection operations you did
    currentOperationsSessionStore.push("=", Number(lastOperationNumber));
    resultsStore.push(currentOperationsSessionStore.join(""));

    currentOperationsSessionStore = [];

    console.log(resultsStore);
  }
})

//---------------------
//onpressdown buttons
document.addEventListener('keydown', (event) => {
  //Check if click buttons
  if (!allKeyboardKeys.includes(event.key)) {
    return;
  }

  // Button identification for digits and math operations (what event happened)
  const key = event.key;

  //Add 'active' class on buttons
  //for bug fix at first remove class 'active'
  allBtns.forEach(e => { e.classList.remove('active') });//remove "active"
  switchCaseActiveClass(key);

  //if pressed Clear(C)/Delete or delete(DEL)/Backspace
  if (key === 'Delete') {
    allClear();
    equalBeforeZero.textContent = "";
    return;
  }
  if (key === 'Backspace') {
    deleteOneNum();
  }

  //if pressed digit 0-9 or "."
  if (digitKeys.includes(key)) {

    //Check double '.' case
    if (calcResultDisplay.textContent.includes('.') && key === ".") {
      return;
    }

    //First time enter digits
    if (nextOperationNumber === "" && operationSign === "") {
      //Check amount of digits, 15 max
      if (calcResultDisplay.textContent.length === 15) {
        return;
      }
      //Check two 00
      if (lastOperationNumber === "" && key === "0") {
        return;
      }
      //Check for only "." without zero before it
      if (key === "." && lastOperationNumber === "") {
        lastOperationNumber = "0.";
        calcResultDisplay.textContent = lastOperationNumber;
        return;
      }
      lastOperationNumber += key;
      calcResultDisplay.textContent = lastOperationNumber;

      //Check equal before zero if zero
      if (calcResultDisplay.textContent === "0") {
        equalBeforeZero.textContent = "";
      } else {
        equalBeforeZero.textContent = "=";
      }

      //Calculate result after "="
    } else if (lastOperationNumber !== "" && nextOperationNumber !== "" && finish) {
      nextOperationNumber += key;
      finish = false;
      calcResultDisplay.textContent = nextOperationNumber;
    } else {
      //Check amount of digits, 15 max
      if (nextOperationNumber.length === 15) {
        return;
      }
      if (key === "." && nextOperationNumber === "") {
        nextOperationNumber = "0.";
        calcResultDisplay.textContent = nextOperationNumber;
        return;
      }
      if (nextOperationNumber === "0" && key === "0") {
        return;
      } else if (nextOperationNumber === "0" && key !== "0" && key !== ".") {
        nextOperationNumber = key;
        calcResultDisplay.textContent = nextOperationNumber;
        return;
      }
      nextOperationNumber += key;
      calcResultDisplay.textContent = nextOperationNumber;
      // calcOperationsChainDisplay.textContent = `${lastOperationNumber}${operationSign}`;
    }

    return;
  }

  //Percent "%" calculation
  if (key === "%") {
    if (lastOperationNumber === "" || lastOperationNumber === "0" || operationSign === "") {
      lastOperationNumber = "";
      calcResultDisplay.textContent = "0";
      return;
    } else if (lastOperationNumber !== "" && lastOperationNumber !== "0" && operationSign !== "" && nextOperationNumber === "") {
      let temporaryPercentVar = lastOperationNumber;
      nextOperationNumber = fixedNumbers(Number(lastOperationNumber) * 0.01 * Number(lastOperationNumber));

      switchCaseMainCalculation(operationSign);
      //variables magic
      lastOperationNumber = nextOperationNumber;
      lastOperationNumber = temporaryPercentVar;

      calcResultDisplay.textContent = nextOperationNumber;
      calcOperationsChainDisplay.textContent = `${Number(lastOperationNumber)}${operationSign}${Number(nextOperationNumber)}`;

      return;
    } else {
      nextOperationNumber = fixedNumbers(Number(lastOperationNumber) * 0.01 * Number(nextOperationNumber));
      calcResultDisplay.textContent = nextOperationNumber;
    }
  }

  //if pressed operation +-/*
  if (mathOperationKeys.includes(key)) {

    //Check if first number should be negative 
    if (lastOperationNumber === "" && key === "-") {
      lastOperationNumber = "0";
      operationSign = "-";
      calcOperationsChainDisplay.textContent = `${lastOperationNumber}${operationSign}`
      return;
    }

    if (lastOperationNumber === "") {
      return;
    }
    if ((key === "*" && operationSign === "*") || (key === "/" && operationSign === "/")) {
      return;
    }
    //CALCULATING before "="
    //(if we select one numbers and click on action)
    if (operationSign !== "" && nextOperationNumber !== "") {
      //collection session store data
      currentOperationsSessionStore.push(Number(lastOperationNumber), operationSign, Number(nextOperationNumber));
      //Calculation
      switchCaseMainCalculation(operationSign);

      //Collection operations you did
      currentOperationsSessionStore.push("=", Number(lastOperationNumber));
      resultsStore.push(currentOperationsSessionStore.join(""));

      nextOperationNumber = "";
      calcResultDisplay.textContent = lastOperationNumber;
      calcOperationsChainDisplay.textContent = `${Number(lastOperationNumber)}${operationSign}${Number(nextOperationNumber)}`;

      currentOperationsSessionStore = [];
      console.log(resultsStore);
    }

    operationSign = key;
    calcResultDisplay.textContent = `${Number(lastOperationNumber)}`;
    calcOperationsChainDisplay.textContent = `${Number(lastOperationNumber)}${operationSign}`;
    return;
  }

  //Calculation After pressing Result btn "="
  if (key === '=' || key === "Enter") {
    if (lastOperationNumber === "" && operationSign === "") {
      return;
    }
    if (lastOperationNumber === "" && nextOperationNumber === "") {
      return;
    }
    calcOperationsChainDisplay.textContent = `${Number(lastOperationNumber)}${operationSign}${(nextOperationNumber)}`;

    //Only first number entered, we'll count with the same numbers
    if (nextOperationNumber === '' && operationSign !== "") {
      nextOperationNumber = Number(lastOperationNumber);
      calcOperationsChainDisplay.textContent = `${Number(lastOperationNumber)}${operationSign}${Number(nextOperationNumber)}`;
    };

    //collection session store data
    currentOperationsSessionStore.push(Number(lastOperationNumber), operationSign, Number(nextOperationNumber));

    //Calculation
    switchCaseMainCalculation(operationSign);
    finish = true;
    nextOperationNumber = ""
    calcResultDisplay.textContent = lastOperationNumber;

    //Collection operations you did
    currentOperationsSessionStore.push("=", Number(lastOperationNumber));
    resultsStore.push(currentOperationsSessionStore.join(""));
    currentOperationsSessionStore = [];
    console.log(resultsStore);
  }
})
//onpressup
document.addEventListener('keyup', (event) => {
  //Check if click buttons
  if (!allKeyboardKeys.includes(event.key)) {
    return;
  }

  // Button identification for digits and math operations (what event happened)
  const key = event.key;
  switchCaseActiveClass(key);
});