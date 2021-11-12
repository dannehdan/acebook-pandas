// Code from: https://www.section.io/engineering-education/password-strength-checker-javascript/

let timeout;

// traversing the DOM and getting the input and span using their IDs

let password = document.getElementById('password');
let strengthBadge = document.getElementById('StrengthDisp');

// The strong and weak password Regex pattern checker

let strongPassword = new RegExp(
  '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})'
);
let veryStrongPassword = new RegExp(
  '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{12,})'
);
let mediumPassword = new RegExp(
  '((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))'
);

function StrengthChecker(PasswordParameter) {
  // We then change the badge's color and text based on the password strength

  if (veryStrongPassword.test(PasswordParameter)) {
    strengthBadge.style.backgroundColor = 'royalblue';
    strengthBadge.textContent = 'Very Strong';
  } else if (strongPassword.test(PasswordParameter)) {
    strengthBadge.style.backgroundColor = 'green';
    strengthBadge.textContent = 'Strong';
  } else if (mediumPassword.test(PasswordParameter)) {
    strengthBadge.style.backgroundColor = 'orange';
    strengthBadge.textContent = 'Medium';
  } else {
    strengthBadge.style.backgroundColor = 'red';
    strengthBadge.textContent = 'Weak';
  }
}

// Adding an input event listener when a user types to the  password input

password.addEventListener('input', () => {
  //The badge is hidden by default, so we show it

  strengthBadge.style.display = 'block';
  clearTimeout(timeout);

  //We then call the StrengChecker function as a callback then pass the typed password to it

  timeout = setTimeout(() => StrengthChecker(password.value), 0);

  //Incase a user clears the text, the badge is hidden again

  if (password.value.length !== 0) {
    strengthBadge.style.display != 'block';
  } else {
    strengthBadge.style.display = 'none';
  }
});
