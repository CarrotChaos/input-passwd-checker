function is_password() {
	const activeElement = document.activeElement;
	if (!activeElement) return false;
	console.log(activeElement)
	// direct password input
	if (activeElement.tagName.toLowerCase() === 'input' && activeElement.type.toLowerCase() === 'password') return true;

	// css masking check
	const style = window.getComputedStyle(activeElement);
	if (style.webkitTextSecurity && style.webkitTextSecurity !== 'none') return true;

	// type heuristic
	const type = activeElement.getAttribute('type');
	if (type && /pass(word)?|pwd/i.test(type)) return true;

	// name heuristic
	const name = activeElement.getAttribute('name');
	if (name && /pass(word)?|pwd/i.test(name)) return true;

	// autocomplete hint
	if (activeElement.getAttribute('autocomplete') === 'current-password') return true;

	return false;
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    console.log('Text copied to clipboard');
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}


document.addEventListener('keydown', function(event) {
  // Check if Alt key is pressed along with 'p' (or 'P')
  if (event.altKey && event.key.toLowerCase() === 'p') {
    event.preventDefault();
    const is_valid_pass = is_password();
	if (is_valid_pass) {
		copyToClipboard("T")
	}
	else {
	  copyToClipboard("F")
	}
  }

});

