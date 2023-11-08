
const errorElement = form.querySelector('#error');


function hideErrorMessage() {
    errorElement.innerHTML = "";
}

function showErrorMessage(message) {
    errorElement.innerHTML = `<div class="alert text-danger bg-none " role="alert">${message}</div>`

}

function submitform(e) {
    console.log('dxfcghjkl;');
    
    const form = document.querySelector("form");
    const email = document.querySelector("input[type=email]");
    const password = document.querySelector("input[type=password]");

    if (email.value === "" && password.value === "") {

        showErrorMessage("Username and Password is Required");
        return false;
    }
    if (email.value === "") {

        showErrorMessage("Username is Required");
        return false;
    }
    if (password.value === "") {

        showErrorMessage("Password is Required");
        return false;
    }
    if (email.value === "" && password.value === "") {

        showErrorMessage("Name and Password is Required");
        return false;
    }
    if (password.value !== "jas@12" && email.value !== "mjaseer43@gmail.com") {

        showErrorMessage("Email & Password is Incorrect");
        return false;
    }
    if (email.value !== "mjaseer43@gmail.com") {

        showErrorMessage("Email is incorrect");
        return false;
    }
    if (password.value !== "jas@12") {

        showErrorMessage("Password is Incorrect");
        return false;
    }

    hideErrorMessage()
    return true;

}