document.addEventListener('DOMContentLoaded', function () {
  // NAV toggle for mobile
  const navToggleButtons = document.querySelectorAll('.nav-toggle');
  navToggleButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const nav = document.getElementById('mainNav');
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      if (nav) {
        if (!expanded) nav.style.display = 'flex';
        else nav.style.display = '';
      }
    });
  });

  // Ensure date inputs can't pick past dates
  const todayIso = new Date().toISOString().split('T')[0];
  const dateInputs = document.querySelectorAll('input[type="date"]');
  dateInputs.forEach(i => i.setAttribute('min', todayIso));

  // Search form: if no destination selected, prevent navigating to booking (gives user prompt)
  const searchForm = document.getElementById('searchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', function (ev) {
      const dest = document.getElementById('search-destination').value;
      if (!dest) {
        ev.preventDefault();
        alert('Please select a destination before searching.');
        document.getElementById('search-destination').focus();
        return;
      }
      // otherwise let the form go to booking.html with query params (native behavior)
    });
  }

  // Booking form validation
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', validateForm);
    // If page has query params (like ?destination=Agra) prefill destination
    const params = new URLSearchParams(window.location.search);
    const qDest = params.get('destination');
    if (qDest) {
      const destEl = document.getElementById('destination');
      if (destEl) destEl.value = qDest;
    }
  }

  // Contact form validation (if present)
  const contactForm = document.querySelector('.contact-form form');
  if (contactForm) {
    contactForm.addEventListener('submit', validateContactForm);
  }
});


function showMessage(container, messages, type = 'error') {
  let el = typeof container === 'string' ? document.getElementById(container) : container;
  if (!el) return;
  el.innerHTML = '';
  const wrapper = document.createElement('div');
  wrapper.className = 'alert ' + (type === 'success' ? 'alert-success' : 'alert-danger');
  if (Array.isArray(messages)) {
    const ul = document.createElement('ul');
    messages.forEach(m => {
      const li = document.createElement('li');
      li.textContent = m;
      ul.appendChild(li);
    });
    wrapper.appendChild(ul);
  } else {
    wrapper.textContent = messages;
  }
  el.appendChild(wrapper);
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function validateForm(event) {
  event.preventDefault();
  const name = (document.getElementById('name') || {}).value || '';
  const email = (document.getElementById('email') || {}).value || '';
  const destination = (document.getElementById('destination') || {}).value || '';
  const date = (document.getElementById('date') || {}).value || '';

  const errors = [];

  // Name
  if (name.trim().length < 2) {
    errors.push('Please enter your full name (at least 2 characters).');
  }

  // Email (basic pattern)
  const emailPattern = /^\S+@\S+\.\S+$/;
  if (!emailPattern.test(email.trim())) {
    errors.push('Please enter a valid email address.');
  }

  // Destination
  if (!destination) {
    errors.push('Please select a destination.');
  }

  // Date: must exist and not be in the past
  if (!date) {
    errors.push('Please choose a travel date.');
  } else {
    const selected = new Date(date);
    const today = new Date();
    selected.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    if (selected < today) {
      errors.push('Travel date cannot be in the past.');
    }
  }

  const messageBox = document.getElementById('formMessage');

  if (errors.length) {
    showMessage(messageBox, errors, 'error');
    return false;
  }

  showMessage(messageBox, 'Thanks! Your booking request has been received. We will contact you soon.', 'success');
  return false;
}

function validateContactForm(event) {
  event.preventDefault();

  const name = (document.getElementById('name') || {}).value || '';
  const email = (document.getElementById('email') || {}).value || '';
  const message = (document.getElementById('message') || {}).value || '';

  const errors = [];

  if (name.trim().length < 2) {
    errors.push('Please enter your name (at least 2 characters).');
  }

  const emailPattern = /^\S+@\S+\.\S+$/;
  if (!emailPattern.test(email.trim())) {
    errors.push('Please enter a valid email address.');
  }

  if (message.trim().length < 10) {
    errors.push('Please enter a message (at least 10 characters).');
  }

  const messageBox = document.getElementById('contactFormMessage');
  if (messageBox) {
    // clear previous messages
    messageBox.innerHTML = '';
  }

  if (errors.length) {
    if (messageBox) {
      showMessage(messageBox, errors, 'error');
      messageBox.focus();
    } else {
      alert(errors.join('\n'));
    }
    return false;
  }

  if (messageBox) {
    showMessage(messageBox, 'Thank you for contacting us! We will respond shortly.', 'success');
  } else {
    alert('Thank you for contacting us! We will respond shortly.');
  }

  event.target.reset();
  return false;
}
