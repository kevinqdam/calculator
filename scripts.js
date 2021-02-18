function selectKeyPressed(e) {
  let keyPressed = e.key;
  if (keyPressed === 'Backspace') keyPressed = 'd';
  const button = document.querySelector(`button[key="${keyPressed.toString().toLowerCase()}"]`);
  return button;
}

function handleKeyUpEvent(e) {
  const button = selectKeyPressed(e);
  if (!button) return;
  button.style.backgroundColor = '#FFFFFF';
}

function handleKeyDownEvent(e) {
  const button = selectKeyPressed(e);
  if (!button) return;
  button.style.backgroundColor = '#EAECEE';
}

window.addEventListener('keydown', (e) => { handleKeyDownEvent(e); });
window.addEventListener('keyup', (e) => { handleKeyUpEvent(e); });
