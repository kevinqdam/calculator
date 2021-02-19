const MAX_SCREEN_LENGTH = 15;
const plus = (a, b) => a + b;
const minus = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;
let active;
const subscreen = document.querySelector('.subscreen');
const screen = document.querySelector('.screen');
const buttons = Array.from(document.querySelectorAll('button'));

function clear() {
  subscreen.textContent = '0';
  screen.textContent = '0';
}

function screenEndsWithDecimal() {
  return (screen.textContent.slice(-1) === '.');
}

function subscreenEndsWithDecimal() {
  return (subscreen.textContent.slice(-1) === '.');
}

function subscreenEndsWithOperation() {
  return (subscreen.textContent.endsWith(' + ')
    || subscreen.textContent.endsWith(' - ')
    || subscreen.textContent.endsWith(' × ')
    || subscreen.textContent.endsWith(' ÷ '));
}

function handleSubscreenForInput() {
  if (screen.textContent.length >= MAX_SCREEN_LENGTH) return;
  if (subscreenEndsWithDecimal() && active.textContent === '.') return;
  if (subscreen.textContent === '0'
      || subscreen.textContent.slice(-1) === '=') {
    subscreen.textContent = '';
  }
  if (subscreen.textContent === '' && active.textContent === '.') subscreen.textContent = '0.';
  else subscreen.textContent += active.textContent;
  subscreen.textContent = subscreen.textContent.trimLeft();
}

function handleScreenForInput() {
  if (screen.textContent.length >= MAX_SCREEN_LENGTH) return;
  if (screenEndsWithDecimal() && active.textContent === '.') return;
  if (screen.textContent === '0'
      || subscreen.textContent.slice(-1) === '='
      || subscreenEndsWithOperation()) {
    screen.textContent = '';
  }
  if (screen.textContent === '' && active.textContent === '.') screen.textContent = '0.';
  else screen.textContent += active.textContent;
  screen.textContent = screen.textContent.trimLeft();
}

function clearSelectedStyling() {
  buttons.forEach((btn) => { btn.classList.remove('selected'); });
}

function handleDisplayForInput() {
  handleScreenForInput();
  handleSubscreenForInput();
  clearSelectedStyling();
  active = null;
}

function handleScreenDelete() {
  screen.textContent = screen.textContent.slice(0, -1);
  if (screen.textContent.length === 0) screen.textContent = '0';
}

function strToNum(str) {
  if (str.indexOf('.') >= 0) return Number.parseFloat(str.trim());
  return Number.parseInt(str.trim(), 10);
}

function parseSubscreen() {
  if (subscreen.textContent.indexOf(' + ') >= 0) {
    const [a, b] = subscreen.textContent.split(' + ');
    return [strToNum(a), strToNum(b), plus];
  }
  if (subscreen.textContent.indexOf(' - ') >= 0) {
    const [a, b] = subscreen.textContent.split(' - ');
    return [strToNum(a), strToNum(b), minus];
  }
  if (subscreen.textContent.indexOf(' × ') >= 0) {
    const [a, b] = subscreen.textContent.split(' × ');
    return [strToNum(a), strToNum(b), multiply];
  }
  const [a, b] = subscreen.textContent.split(' ÷ ');
  return [strToNum(a), strToNum(b), divide];
}

function evaluateSubscreen() {
  const [a, b, operation] = parseSubscreen();
  const result = operation(a, b);
  return result;
}

function handleScreenForOperation() {
  switch (active.id) {
    case 'clear':
      clear();
      break;
    case 'delete':
      handleScreenDelete();
      break;
    case 'plus':
      break;
    case 'minus':
      break;
    case 'multiply':
      break;
    case 'divide':
      break;
    case 'equals':
      screen.textContent = evaluateSubscreen().toString();
      break;
    default:
      clear();
      screen.textContent = 'ERROR';
      break;
  }
}

function handleSubscreenDelete() {
  if (!subscreenEndsWithOperation()) subscreen.textContent = subscreen.textContent.slice(0, -1);
  if (subscreen.textContent.length === 0) subscreen.textContent = '0';
}

function handleSubscreenSerialCalculation() {
  if (subscreen.textContent.slice(-1) === '=') subscreen.textContent = screen.textContent;
}

function handleSubscreenForOperation() {
  handleSubscreenSerialCalculation();
  switch (active.id) {
    case 'clear':
      clear();
      break;
    case 'delete':
      handleSubscreenDelete();
      break;
    case 'plus':
      subscreen.textContent += ' + ';
      break;
    case 'minus':
      subscreen.textContent += ' - ';
      break;
    case 'multiply':
      subscreen.textContent += ' × ';
      break;
    case 'divide':
      subscreen.textContent += ' ÷ ';
      break;
    case 'equals':
      subscreen.textContent += ' =';
      break;
    default:
      subscreen.textContent = 'ERROR';
      break;
  }
}

function handleSelectedStylingForOperation() {
  if (active.id !== 'plus'
      && active.id !== 'minus'
      && active.id !== 'multiply'
      && active.id !== 'divide') clearSelectedStyling();
}

function handleOperation() {
  handleScreenForOperation();
  handleSubscreenForOperation();
  handleSelectedStylingForOperation();
}

function isOperation() {
  return (active.id === 'clear'
      || active.id === 'delete'
      || active.id === 'plus'
      || active.id === 'minus'
      || active.id === 'multiply'
      || active.id === 'divide'
      || active.id === 'equals');
}

function selectButtonOfKey(e) {
  let keyPressed = e.key;
  if (keyPressed === 'Backspace') keyPressed = 'd';
  if (keyPressed === 'Enter') keyPressed = '=';
  const button = document.querySelector(`button[key="${keyPressed.toString().toLowerCase()}"]`);
  return button;
}

function handleClickEvent(btn) {
  if (!btn) return;
  btn.classList.add('selected');
  active = btn;
  if (!isOperation()) handleDisplayForInput();
  else handleOperation();
}

function handleKeyPress(e) {
  const button = selectButtonOfKey(e);
  if (!button) return;
  button.click();
}

window.addEventListener('load', () => { clear(); });
window.addEventListener('keypress', (e) => { handleKeyPress(e); });
buttons.forEach((btn) => {
  btn.addEventListener('click', () => { handleClickEvent(btn); });
});
