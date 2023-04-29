import values from "./values.json" assert { type: "json" };

const page = document.querySelector('body');
const keyValues = values;
let isCapsEntered = false;
let language = "eng";

function render() {
    let index = language == "eng" ? 3 : 1;
  
    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper');
    page.appendChild(wrapper);
  
    const title = document.createElement('h1');
    title.classList.add('title');
    title.innerText = 'Virtual keyboard';
    wrapper.appendChild(title);
  
    const enter = document.createElement('textarea');
    enter.setAttribute('rows', 10);
    enter.setAttribute('cols', 60);
    enter.classList.add('textarea');
    wrapper.appendChild(enter);
  
    const keyboard = document.createElement('ul'); 
    keyboard.classList.add('keyboard');
    wrapper.appendChild(keyboard);
  
    for (let i = 0; i < keyValues.length; i++) {
      const key = document.createElement('li');
      key.classList.add('key');
      key.classList.add(keyValues[i]["code"]);
      key.addEventListener('mousedown', () => {
        if (!key.classList.contains('CapsLock')) {
          key.classList.add('active');
        }
        enterSingleSymbol(key);
      })
      key.addEventListener('mouseup', () => {
        if (!key.classList.contains('CapsLock')) {
          key.classList.remove('active');
        }
      })
      keyboard.appendChild(key);
      for (let j = 1; j < 5; j++) {
        const symbol = document.createElement('span');
        symbol.classList.add('symbol');
        symbol.classList.add(`${Object.keys(keyValues[i])[j]}`);
        symbol.innerText = keyValues[i][Object.keys(keyValues[i])[j]];
        key.appendChild(symbol);
        if (j != index) {
          symbol.classList.add('hidden');
        }
      }
      if (keyValues[i]["special"]==="True") key.classList.add('special-key')
    }
    let note = document.createElement("div");
    note.innerText = "Change language: Ctrl + Alt";
    wrapper.appendChild(note);
  }
  
  render()

  function enterSingleSymbol(key) {
    const textarea = document.querySelector('.textarea');
    textarea.focus();
    let start = textarea.selectionStart;
    let end = textarea.selectionEnd;
    if (!key.classList.contains('special-key')) {
      textarea.value = textarea.value.slice(0, start) + key.innerText + textarea.value.slice(end);
      textarea.setSelectionRange(start + 1, end + 1);
    } else if (key.classList.contains('Backspace')) {
      if (start != end) {
        textarea.value = textarea.value.slice(0, start) + textarea.value.slice(end);
        textarea.setSelectionRange(start, start);
      } else {
        textarea.value = textarea.value.slice(0, start - 1) + textarea.value.slice(start);
        textarea.setSelectionRange(start - 1, start - 1);
      } 
    } else if (key.classList.contains('Delete')) {
      if (start != end) {
        textarea.value = textarea.value.slice(0, start) + textarea.value.slice(end);
        textarea.setSelectionRange(start, start);
      } else {
        textarea.value = textarea.value.slice(0, start) + textarea.value.slice(start + 1);
        textarea.setSelectionRange(start, start);
      } 
    } else if (key.classList.contains('Space')) {                                   
      textarea.value = textarea.value.slice(0, start) + ' ' + textarea.value.slice(end);
      textarea.setSelectionRange(start + 1, end + 1);
    } else if (key.classList.contains('Enter')) {
      textarea.value = textarea.value.slice(0, start) + '\n' + textarea.value.slice(end);
      textarea.setSelectionRange(start + 1, start + 1);
    } else if (key.classList.contains('Tab')) {
      textarea.value = textarea.value.slice(0, start) + '    ' + textarea.value.slice(end);
      textarea.setSelectionRange(start + 4, start + 4);
    } else if (key.classList.contains('CapsLock')) {                                      
      isCapsEntered ? key.classList.remove("active") : key.classList.add("active");
      changeSymbols()
    } else if (key.classList.contains('ShiftLeft') || key.classList.contains('ShiftRight')) {      
      changeSymbols();
      key.addEventListener('mouseup', () => {
        changeSymbols()
      }, {once: true})
    }
  }

  function changeSymbols() {
    let littleSymbols = document.querySelectorAll(`.${language}`);
    let bigSymbols = document.querySelectorAll(`.${language}Caps`);
    if (isCapsEntered) {
      isCapsEntered = false;
    } else {
      isCapsEntered = true;
    }
    toggleSymbols(littleSymbols);
    toggleSymbols(bigSymbols);
  }
  
  function toggleSymbols(symbols) {
    symbols.forEach(symbol => {
      if (symbol.classList.contains('hidden')) {
        symbol.classList.remove('hidden')
      } else {
        symbol.classList.add('hidden')
      }
      })
  }

  document.addEventListener('keydown', (event) => {
    event.preventDefault()
    let key = document.querySelector(`.${event.code}`);
    if (event.code != "CapsLock") key.classList.add('active');
    if (event.code.includes('Shift')) {
      if (event.repeat == false) {
        changeSymbols();
      }
    } else {
        enterSingleSymbol(key);
    }
   }
  );
  
  document.addEventListener('keyup', (event) => {
    if (event.code.includes('Shift')) {
      changeSymbols();
  }
  if (event.code != "CapsLock") {
    let keyUp = document.querySelector(`.${event.code}`);
    keyUp.classList.remove('active');
  }
  })