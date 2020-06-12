const toDoForm = document.querySelector(".js-toDoForm"),
  toDoInput = toDoForm.querySelector("input"),
  pendingList = document.querySelector(".js-pendingList"),
  finishedList = document.querySelector(".js-doneList");

const TODOS_LS = "toDos";
const PENDING_LS = "pendingToDos";
const FINISHED_LS = "finishedToDos";

let pendingToDos = [];
let pendingCounter = 0;
let finishedToDos = [];
let finishedCounter = 0;

// delete task items from each list
function deletePending(event) {
  const btn = event.target;
  const li = btn.parentNode;
  pendingList.removeChild(li);
  const cleanPending = pendingToDos.filter(function (toDo) {
    return toDo.id !== li.id;
  });
  pendingToDos = cleanPending;
  saveToPending();
}
function deleteFinished(event) {
  const btn = event.target;
  const li = btn.parentNode;
  finishedList.removeChild(li);
  const cleanFinished = finishedToDos.filter(function (toDo) {
    return toDo.id !== li.id;
  });
  finishedToDos = cleanFinished;
  saveToFinished();
}

// move task items between the two lists
function moveToFinished(event) {
  const btn = event.target;
  const li = btn.parentNode;
  const spanText = li.childNodes[2].textContent;
  paintFinished(spanText);
  deletePending(event);
}
function moveToPending(event) {
  const btn = event.target;
  const li = btn.parentNode;
  const spanText = li.childNodes[2].textContent;
  paintPending(spanText);
  deleteFinished(event);
}

// save the lists to local storage
function saveToPending() {
  localStorage.setItem(PENDING_LS, JSON.stringify(pendingToDos));
}
function saveToFinished() {
  localStorage.setItem(FINISHED_LS, JSON.stringify(finishedToDos));
}

// create items for each list
function paintFinished(text) {
  const finishedLi = document.createElement("li");
  const finishedDel = document.createElement("button");
  const finishedBack = document.createElement("button");
  finishedDel.addEventListener("click", deleteFinished);
  finishedBack.addEventListener("click", moveToPending);
  finishedDel.innerText = "❌";
  finishedBack.innerText = "⏪";
  const span = document.createElement("span");
  const finishedId = `finished-${finishedCounter + 1}`;
  finishedCounter += 1;
  if (text.innerText) {
    span.innerText = text.innerText;
  } else {
    span.innerText = text;
  }
  finishedLi.appendChild(finishedDel);
  finishedLi.appendChild(finishedBack);
  finishedLi.appendChild(span);
  finishedLi.id = finishedId;
  finishedList.appendChild(finishedLi);

  const finishedObj = {
    text: text,
    id: finishedId,
  };
  finishedToDos.push(finishedObj);
  saveToFinished();
}
function paintPending(text) {
  const pendingLi = document.createElement("li");
  const pendingDel = document.createElement("button");
  const pendingFin = document.createElement("button");
  pendingDel.addEventListener("click", deletePending);
  pendingFin.addEventListener("click", moveToFinished);
  pendingDel.innerText = "❌";
  pendingFin.innerText = "✅";
  const span = document.createElement("span");
  const pendingId = `pending-${pendingCounter + 1}`;
  pendingCounter += 1;
  if (text.innerText) {
    span.innerText = text.innerText;
  } else {
    span.innerText = text;
  }
  pendingLi.appendChild(pendingDel);
  pendingLi.appendChild(pendingFin);
  pendingLi.appendChild(span);
  pendingLi.id = pendingId;
  pendingList.appendChild(pendingLi);

  const pendingObj = {
    text: text,
    id: pendingId,
  };
  pendingToDos.push(pendingObj);
  saveToPending();
}

// user input event handler
function handleSubmit(event) {
  event.preventDefault();
  const currentValue = toDoInput.value;
  paintPending(currentValue);
  toDoInput.value = "";
}

// load the saved task lists from local storage
function loadToDos() {
  const loadedPending = localStorage.getItem(PENDING_LS);
  const loadedFinished = localStorage.getItem(FINISHED_LS);

  if (loadedPending !== null) {
    const parsedPending = JSON.parse(loadedPending);
    parsedPending.forEach(function (toDo) {
      paintPending(toDo.text);
    });
  }

  if (loadedFinished !== null) {
    const parsedPending = JSON.parse(loadedFinished);
    parsedPending.forEach(function (toDo) {
      paintFinished(toDo.text);
    });
  }
}

// program initiating function
function init() {
  loadToDos();
  toDoForm.addEventListener("submit", handleSubmit);
}

// start of program
init();
