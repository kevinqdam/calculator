const MAX_SCREEN_LENGTH = 15;
const plus = (a, b) => a + b;
const minus = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => {
  if (b === 0) return 'ERROR:DIV/0';
  return a / b;
};
let active = null;
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

function roundNumber(num) {
  if (num.length <= MAX_SCREEN_LENGTH) return num;
  if (num.indexOf('.') >= 0) return Number.parseFloat(num).toExponential(2).toString();
  return Number.parseInt(num, 10).toExponential(2).toString();
}

function handleSubscreenForInput() {
  if (screen.textContent === 'ERROR:DIV/0') return;
  if (screen.textContent.length >= MAX_SCREEN_LENGTH) return;
  if (subscreenEndsWithDecimal() && active.textContent === '.') return;
  if (subscreen.textContent === '0' || subscreen.textContent.slice(-1) === '=') {
    subscreen.textContent = '';
  }
  if (subscreen.textContent === '' && active.textContent === '.') subscreen.textContent = '0.';
  else if (screen.textContent === '0.' && active.textContent === '.') subscreen.textContent += '0.';
  else subscreen.textContent += active.textContent;
  subscreen.textContent = subscreen.textContent.trimLeft();
}

function handleScreenForInput() {
  if (screen.textContent === 'ERROR:DIV/0') return;
  if (screen.textContent === '0'
      || subscreen.textContent.slice(-1) === '='
      || subscreenEndsWithOperation()) {
    screen.textContent = '';
  }
  if (screen.textContent.length >= MAX_SCREEN_LENGTH) return;
  if (screenEndsWithDecimal() && active.textContent === '.') return;
  if (screen.textContent === '' && active.textContent === '.') screen.textContent = '0.';
  else screen.textContent += active.textContent;
  screen.textContent = roundNumber(screen.textContent.trimLeft());
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
  if (!str) return 0;
  if (str.indexOf('.') >= 0 || str.indexOf('e') >= 0) return Number.parseFloat(str.trim());
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
  if (subscreen.textContent.indexOf(' ÷ ') >= 0) {
    const [a, b] = subscreen.textContent.split(' ÷ ');
    return [strToNum(a), strToNum(b), divide];
  }
  return [0, 0, plus];
}

function evaluateSubscreen() {
  const [a, b, operation] = parseSubscreen();
  const result = operation(a, b);
  return result;
}

function isNotClearingError() {
  return (screen.textContent.indexOf('ERROR') >= 0 && active.id !== 'clear');
}

function isMidOperation() {
  return (subscreen.textContent.endsWith(' + ')
      || subscreen.textContent.endsWith(' - ')
      || subscreen.textContent.endsWith(' × ')
      || subscreen.textContent.endsWith(' ÷ '));
}

function isPendingEqualsOperation() {
  return (subscreen.textContent.split(' + ').length > 1
      || subscreen.textContent.split(' - ').length > 1
      || subscreen.textContent.split(' × ').length > 1
      || subscreen.textContent.split(' ÷ ').length > 1);
}

function handleScreenForOperation() {
  if (isNotClearingError()) return;
  if (isMidOperation() && active.id === 'equals') return;
  if (isPendingEqualsOperation()
      && active.id !== 'equals'
      && active.id !== 'clear'
      && active.id !== 'delete') return;
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
      screen.textContent = roundNumber(evaluateSubscreen().toString());
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

function handleSubscreenForOperation() {
  if (isNotClearingError()) return;
  if (subscreenEndsWithOperation()) return;
  if (subscreen.textContent.endsWith('=')) subscreen.textContent = screen.textContent;
  if (isPendingEqualsOperation()
      && active.id !== 'equals'
      && active.id !== 'clear'
      && active.id !== 'delete') return;
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
      if (isPendingEqualsOperation()) subscreen.textContent += ' =';
      break;
    default:
      subscreen.textContent = 'ERROR';
      break;
  }
}

function handleOperation() {
  handleScreenForOperation();
  handleSubscreenForOperation();
  clearSelectedStyling();
}

function isOperation(...args) {
  if (args.length === 1) {
    const btnId = args[0];
    return (btnId === 'clear'
        || btnId === 'delete'
        || btnId === 'plus'
        || btnId === 'minus'
        || btnId === 'multiply'
        || btnId === 'divide'
        || btnId === 'equals');
  }
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

function isDeletingAResult(btnId) {
  return (subscreen.textContent.endsWith('=') && btnId === 'delete');
}

function handleClickEvent(btn) {
  if (!btn) return;
  if (isDeletingAResult(btn.id)) return;
  if (isMidOperation()
      && isOperation(btn.id)
      && btn.id !== 'clear'
      && btn.id !== 'delete') return;
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
