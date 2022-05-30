const today = document.getElementById("day")
const customerRecord = document.getElementById("customerRecord")
const table = document.getElementById("table")
const theader = document.getElementById("theader")
const tbody = document.getElementById("tbody")
const btnFooter = document.querySelectorAll('.footer__btn');
const display = document.querySelectorAll('.display');
/*---------------------всплывающее окно записи клиента -------------------------- */
const newArrMonthName = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
const windowForRecording = document.getElementById("windowForRecording");
const body = document.querySelector("body")
/*-----------------------время записи------------------------------------*/
const windowsData = document.getElementById("windowsData");
const windowsTime = document.getElementById("windowsTime");
let currentTime = document.getElementById("currentTime");
/*-----------------------input данные клиента------------------------------------*/
let nameEntry = document.getElementById("nameEntry");
let phoneNumberEntry = document.getElementById("phoneNumberEntry");
let serviceType = document.getElementById("serviceType");
/*-------------------------input суммы--------------------------------------*/
let income = document.getElementById("income");
let tips = document.getElementById("tips");
let expenses = document.getElementById("expenses");

let totalIncome = document.getElementById("totalIncome")
let totaltips = document.getElementById("totaltips")
let totalExpenses = document.getElementById("totalExpenses")
let totalTable = document.getElementById("totalTable")
let btnIncome = document.getElementById("btnIncome")

let btnDeleteEntry = document.getElementById("deleteEntry");
let btnDeleteClient = document.getElementById("deleteClient")
let btnRecords = document.getElementById("btnRecords")
let eventName = ''
let idRecord = ''
const SERVER_URL = 'http://localhost:3002';

let date = new Date();
let day = date.getDate();
let month = date.getMonth();
let year = date.getFullYear()
let hours = date.getHours()
let minutes = date.getMinutes()

const arrMonthName = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
let arrayTable = []
let cellArray = []
let notesAll = []
let notesClient = []

/*---------------------server---------------------------------- */

function serv() {
  if (nameEntry.value) {
    if (windowsTime.value) {
      currentTime.innerHTML = ''
      currentTime.innerHTML = windowsTime.value
    }
    const note = {
      userName: nameEntry.value,
      phoneNumber: phoneNumberEntry.value,
      day: windowsData.innerText,
      time: currentTime.innerText,
      service: serviceType.value,
      income: +income.value,
      tips: +tips.value,
      expenses: +expenses.value,
      idRecord: idRecord
    };
    fetch(`${SERVER_URL}/new`, {
      method: 'POST',
      body: JSON.stringify(note),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
  }
}

async function fetchAllNotes() {
  const response = await fetch(`${SERVER_URL}/all`);
  notesAll = await response.json();
  writeCheck()
  recordInSummTable()
}

/*----------------------------удаление записи---------------------------*/
function servDel() {
  if (nameEntry.value) {
    const note = {
      idRecord: idRecord
    };
    fetch(`${SERVER_URL}/delete`, {
      method: 'DELETE',
      body: JSON.stringify(note),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
  }
}

btnDeleteEntry.addEventListener('click', () => {
  servDel();
  windowForRecording.classList.remove("windows");
  windowForRecording.classList.add("windows_none");
  body.classList.remove("lock");
  fetchAllNotes()
  cellArray.forEach((itemCell) => {
    notesAll.forEach((itemNote) => {
      if (itemCell.id === itemNote.idRecord) {
        itemCell.classList.remove("written-down")
        itemCell.innerHTML = ''
      }
    })
  })
})

function showDate() {
  today.innerHTML = `${arrMonthName[month]} ${year}`
}
showDate()

function calendar() {
  let date = new Date();
  date.setYear(year);
  date.setMonth(month);
  date.setDate(day);
  let numberOfDaysInMonth = new Date(year, month + 1, 0).getDate();
  let list = [];
  for (let i = 0; i < numberOfDaysInMonth; i++) {
    const trBody = document.createElement("tr");
    const trHeader = document.createElement("tr");
    trBody.classList.add("calendar__tr");
    trHeader.classList.add("calendar__tr");

    let date = new Date(year, month, i + 1);
    let dayWeek = date.toLocaleString('ru', { weekday: 'short' });
    let weekRed = (dayWeek === "сб" || dayWeek === "вс") ? "week_red" : "dayHeader"

    list.push(Array(5))
    arrayTable.push(Array())
    theader.append(trHeader)
    trHeader.innerHTML = `<th class=${weekRed}>${i + 1}<br>${dayWeek}</th>`

    for (let j = 0; j < 5; j++) {
      let cellToWrite = document.createElement("td");
      cellToWrite.classList.add("calendar__td")
      cellToWrite.innerText = '';
      cellToWrite.id = `${(i + 1).toString().padStart(2, 0)}${(month + 1).toString().padStart(2, 0)}${year}${j}`
      trBody.id = `${(i + 1).toString().padStart(2, 0)} ${(month + 1).toString().padStart(2, 0)}${year}`
      trBody.append(cellToWrite);
      arrayTable[i].push(cellToWrite)
    }
    tbody.append(trBody);
  }

  arrayTable.forEach((arrays) => {
    arrays.forEach((item) => {
      cellArray.push(item)

    })
  })
  fetchAllNotes()

}
calendar();

/*-----------------Навигация по месяцам------------------------*/
function navLeft() {
  tbody.innerHTML = "";
  theader.innerHTML = "";
  if (month > 0) {
    month--
  } else {
    month = 12
    year--
    month--
  }
  showDate()
  calendar()
}

function navRight() {
  tbody.innerHTML = "";
  theader.innerHTML = "";
  if (month < 11) {
    month++;
  } else {
    month = -1
    year++
    month++
  }
  showDate()
  calendar()
}


function writeWindowDate(eventData) {
  let eDay = eventData.slice(0, 2);
  windowsData.innerHTML = `${eDay} ${newArrMonthName[month]} ${year}`
}

/*----------------очистка полей input-------------------------------*/
function overwriting() {
  nameEntry.value = "";
  phoneNumberEntry.value = "";
  serviceType.value = "";
  income.value = '';
  tips.value = '';
  expenses.value = '';
}

tbody.addEventListener("click", (event) => {
  overwriting()
  let eventData = event.path[1].id;
  idRecord = event.path[0].id;
  windowForRecording.classList.add("windows");
  windowForRecording.classList.remove("windows_none");
  body.classList.add("lock");
  writeWindowDate(eventData);
  fetchAllNotes();
  writeDataToWindowHome()
})

/**-------------запись данных и закрытие окна для записи клиента----------------*/

function writeData() {
  windowForRecording.classList.remove("windows");
  windowForRecording.classList.add("windows_none");
  body.classList.remove("lock");
  serv()
  servClient()
  fetchAllNotes()
  writeCheck()
}

/*-----------------------переключение страницы---------------*/

btnFooter.forEach((value) => {
  fetchAllNotes()
  recordInSummTable()
  value.addEventListener("click", () => {
    let id = value.getAttribute("data-tab")
    let curentTab = document.querySelector(id)
    btnFooter.forEach((value) => {
      value.classList.remove("active")
    })
    display.forEach((value) => {
      value.classList.remove("active")
    })
    value.classList.add("active")
    curentTab.classList.add("active")
  })
})

document.querySelector(".footer__btn").click()

btnRecords.addEventListener("click", () => {
  fetchAllNotes()
  writeCheck()
})
/*---------------------------находим нужную ячейку-----------------------------------*/

function writeCheck() {
  cellArray.forEach((value) => {
    value.classList.remove("written-down");
    value.innerHTML = ''
  })

  cellArray.forEach((itemCell) => {
    notesAll.forEach((itemNote) => {
      if (itemCell.id === itemNote.idRecord) {
        itemCell.classList.add("written-down")
        itemCell.innerHTML = itemNote.time
      }
    })
  })
}


/*--------------------------------показать запись в ячейкe----------------------------------------------*/
function writeDataToWindowHome() {

  currentTime.innerHTML = `${hours.toString().padStart(2, 0)}:${minutes.toString().padStart(2, 0)}`
  currentTime.addEventListener('click', () => {
    windowsTime.classList.remove("none")
    currentTime.classList.add("none")
  })
  notesAll.forEach((value) => {
    if (idRecord === value.idRecord) {
      nameEntry.value = value.userName;
      phoneNumberEntry.value = value.phoneNumber;
      serviceType.value = value.service;
      income.value = value.income;
      tips.value = value.tips;
      expenses.value = value.expenses;
      currentTime.innerHTML = value.time;
    }
  })

}

/**----------------------страница клиент----------------------- */
let btnAccount = document.getElementById("btnAccount")
let clientsWrapper = document.getElementById("clientsWrapper")
let lastRecord = document.getElementById("lastRecord") //время последней записи
let windowClients = document.getElementById("windowClients") // окно клиента
let nameWindowClient = document.getElementById("nameWindowClient")
let numberWindowClient = document.getElementById("numberWindowClient")
let recordСount = document.getElementById("recordСount") //кол записей
let sumIncome = document.getElementById("sumIncome")
let sumTips = document.getElementById("sumTips")
let arrayClients = []
let numberTell = document.getElementById("numberTell")

/**----------------------сохранения аккаунта----------------------------- */

function servClient() {
  if (nameEntry.value) {
    const noteClient = {
      userName: nameEntry.value,
      phoneNumber: phoneNumberEntry.value,
      idRecord: idRecord,
      day: windowsData.innerText,
    };

    fetch(`${SERVER_URL}/client`, {
      method: 'POST',
      body: JSON.stringify(noteClient),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
  }
}

async function fetchAllClient() {
  const response = await fetch(`${SERVER_URL}/client/all`);
  notesClient = await response.json();
  console.log('notesClient: ', notesClient);
  addClients()
}

/*-------------------удаление аккаунта----------------------*/
function servDelClient() {
  const note = {
    userName: nameWindowClient.value,
  }
  fetch(`${SERVER_URL}/deleteclient`, {
    method: 'DELETE',
    body: JSON.stringify(note),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
}

btnDeleteClient.addEventListener('click', () => {
  servDelClient();
  closeWindow()
  fetchAllClient()
  addClients()
  writeCheck()
})


btnAccount.addEventListener("click", () => {
  fetchAllClient()
})


function addClients() {
  clientsWrapper.innerHTML = ""

  notesClient.forEach((value) => {
    let client = document.createElement("li")
    client.classList.add("client")
    client.id = value.idRecord
    client.innerHTML = value.userName
    arrayClients.push(client)
    clientsWrapper.append(client)
  })
}

clientsWrapper.addEventListener("click", (event) => {
  if (event) {
    eventName = event.path[0].innerHTML;
  }
  fetchAllClient();
  fetchAllNotes();
  idRecord = event.path[0].id;
  windowClients.classList.add("windows_clients");
  windowClients.classList.remove("windows_clients_none");
  writeDataToWindowClients();
  sumNumber();
})

function closeWindow() {
  windowClients.classList.add("windows_clients_none");
  windowClients.classList.remove("windows_clients");
  body.classList.remove("lock");
}

function writeDataToWindowClients() {
  notesClient.forEach((value) => {
    if (idRecord === value.idRecord) {
      nameWindowClient.value = value.userName;
      numberWindowClient.value = value.phoneNumber;
      lastRecord.innerHTML = value.day;
      numberTell.href = `tel:${value.phoneNumber}`
    }
  })
}

function sumNumber() {
  sumIncome.textContent = ''
  sumTips.textContent = ''
  recordСount.textContent = ''
  notesAll.forEach((value) => {
    if (value.userName == eventName) {
      let couter = 1
      sumIncome.textContent = Number(sumIncome.textContent) + value.income;
      sumTips.textContent = Number(sumTips.textContent) + value.tips;
      recordСount.textContent = Number(recordСount.textContent) + couter;
    }
  })
}

/*------------------------ДОХОДЫ---------------------------------------- */

function recordInSummTable() {
  totalIncome.textContent = 0;
  totaltips.textContent = 0;
  totalExpenses.textContent = 0;
  totalTable.textContent = 0;
  notesAll.forEach((value, index, array) => {
    totalIncome.textContent = Number(totalIncome.innerHTML) + value.income;
    totaltips.textContent = Number(totaltips.innerHTML) + value.tips;
    totalExpenses.textContent = Number(totalExpenses.innerHTML) + value.expenses;
    totalTable.textContent = Number(totalIncome.innerHTML) + Number(totaltips.innerHTML) - Number(totalExpenses.innerHTML)
  })
}



















