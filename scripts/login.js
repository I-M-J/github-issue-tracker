const inputName = document.getElementById('input-name');
const inputPass = document.getElementById('input-pass');

const validateLogin = () => {
    inputNameValue = inputName.value;
    inputPassValue = inputPass.value;

    if (inputNameValue === 'admin' && inputPassValue === 'admin123') {
        alert('Login Successful');

        window.location.replace('issues.html');
    }
    else {
        alert('Login Failed');
    }
}