function isPassword() {
	const activeElement = document.activeElement;
	if (!activeElement) return false;

	console.log(activeElement)

	// direct password input
	if ((activeElement.tagName.toLowerCase() === 'input' || activeElement.tagName.toLowerCase() === 'textarea') && activeElement.type === 'password') {
		return true;
	}

	// autocomplete hint
	if (activeElement.getAttribute('autocomplete') === 'current-password') return true;	

	// masked text input (CSS -webkit-text-security or custom masking)
	if (activeElement.tagName.toLowerCase() === 'input' && activeElement.type === 'text') {
		const style = window.getComputedStyle(activeElement);

		// CSS masking check
		if (style.webkitTextSecurity && ['disc', 'circle', 'square'].includes(style.webkitTextSecurity)) {
			return true;
		}

		// heuristics
		const name = (activeElement.name || '').toLowerCase();
		const id = (activeElement.id || '').toLowerCase();
		const type = (activeElement.type || '').toLowerCase();
		const placeholder = (activeElement.placeholder || '').toLowerCase();

		const hasPasswordHint =
			name.includes('pass') ||
			name.includes('pwd') ||
			id.includes('pass') ||
			id.includes('pwd') ||
			placeholder.includes('pass') ||
			placeholder.includes('pwd') ||
			type.includes('pass') ||
			type.includes('pwd')

		if (hasPasswordHint) {
			console.log("This element appears to have some password features")
		}
		else { 
			console.log("This element does not have any password features")
		}

		// extra safety: exclude obvious buttons / toggles / small elements
		const isLikelyButton =
			activeElement.tagName.toLowerCase() === 'button' ||
			activeElement.getAttribute('role') === 'button' ||
			activeElement.type === 'button' ||
			activeElement.type === 'checkbox' ||
			activeElement.classList.contains('toggle') ||
			activeElement.classList.contains('eye') ||
			activeElement.id.includes('toggle') ||
			activeElement.id.includes('eye') ||
			activeElement.closest('button') !== null; // if inside a button

		if (isLikelyButton) {
			console.log("This element appears to be a button")
		}
		else { 
			console.log("This element does not appear to be a button")
		}

		return hasPasswordHint && !isLikelyButton && activeElement.offsetWidth > 50; // must be reasonably wide
	}

	// contenteditable custom password fields
	if (activeElement.isContentEditable || activeElement.getAttribute('contenteditable') === 'true') {
		const label = (activeElement.getAttribute('aria-label') ||
			activeElement.closest('label')?.textContent || '').toLowerCase();

		if (label.includes('pass') || label.includes('pwd')) {
			console.log("The label(s) indicate this element is a password")
			return true
		}
		console.log("The label(s) indicate this element is not a password")
	}
	return false;
}

function isTotpInput() {
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
    const isValid = isPassword();
	if (isValid) {
		copyToClipboard("T")
	}
	else {
	  copyToClipboard("F")
	}
  }

  if (event.altKey && event.key.toLowerCase() === 't') {
    event.preventDefault();
    const isValid = isTotpInput();
	if (isValid) {
		copyToClipboard("T")
	}
	else {
	  copyToClipboard("F")
	}
  }
});

