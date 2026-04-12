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

	// id heuristic
	const id = activeElement.getAttribute('id');
	if (id && /pass(word)?|pwd/i.test(id)) return true;

	// name heuristic
	const name = activeElement.getAttribute('name');
	if (name && /pass(word)?|pwd/i.test(name)) return true;

	// autocomplete hint
	if (activeElement.getAttribute('autocomplete') === 'current-password') return true;

	return false;
}

function is_totp_input() {
	const activeElement = document.activeElement;
	if (!activeElement) return false;

	const isInputLike =
		activeElement.tagName.toLowerCase() === 'input' ||
		activeElement.isContentEditable ||
		activeElement.getAttribute?.('role') === 'textbox' ||
		'value' in activeElement;

	if (!isInputLike) return false;

	if (activeElement.getAttribute('autocomplete') === 'one-time-code') return true;

	const inputMode = activeElement.getAttribute('inputmode');
	const maxLength = activeElement.getAttribute('maxlength');
	const pattern = activeElement.getAttribute('pattern');

	if (
		(inputMode === 'numeric' || pattern?.includes('[0-9]')) &&
		maxLength && Number(maxLength) <= 8
	) {
		return true;
	}

	const name = (activeElement.name || '') + (activeElement.id || '');
	if (/otp|totp|2fa|code|verify|verification|mfa|authentication|authenticator/i.test(name)) return true;

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

  if (event.altKey && event.key.toLowerCase() === 't') {
    event.preventDefault();
    const is_valid_totp = is_totp_input();
	if (is_valid_totp) {
		copyToClipboard("T")
	}
	else {
	  copyToClipboard("F")
	}
  }


});

