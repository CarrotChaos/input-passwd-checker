function is_text() {
	const activeElement = document.activeElement;
	if (!activeElement) return false;
	
	const tag = activeElement.tagName.toLowerCase();

	if (tag === 'textarea') return true;

	if (tag === 'input') {
		const type = (activeElement.getAttribute('type') || 'text').toLowerCase();
		const textTypes = ['text', 'search', 'email', 'url', 'tel', 'password'];
		return textTypes.includes(type);
	}

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
  // Check if Alt key is pressed along with 'l' (or 'L')
  if (event.altKey && event.key.toLowerCase() === 'l') {

    event.preventDefault();
    const is_valid_text = is_text();
	if (is_valid_text) {
		copyToClipboard("T")
	}
	else {
	  copyToClipboard("F")
	}
  }
});

