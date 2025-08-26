const jobRole = document.getElementById("title");
const inputName = document.getElementById("name");
const paymentMethods = document.getElementById("payment");
const registerForActivities = document.getElementById("activities");
const activitiesCheckboxes = registerForActivities.querySelectorAll("input[type='checkbox']");
const colorSelect = document.getElementById("color");
const designSelect = document.getElementById("design");
const paypalSection = document.getElementById("paypal");
const bitcoinSection = document.getElementById("bitcoin");
const otherJobRole = document.getElementById("other-job-role");
const form = document.querySelector("form");
const inputEmail = document.getElementById("email");

//Puts cursor in name field on page load
inputName.focus();

//Make sure other job role field is hidden
otherJobRole.style.display = "none";

//if other is selected, display text field and move focus
jobRole.addEventListener("change", (e) => {
    if (e.target.value === "other") {
        otherJobRole.style.display = "block";
        otherJobRole.focus();
    } else {
        otherJobRole.style.display = "none";
        jobRole.focus();
    }   
});

colorSelect.disabled = true;

designSelect.addEventListener("change", (e) => {
    colorSelect.disabled = false;
    const selectedDesign = e.target.value;
    const colors = colorSelect.children;

    for (let i = 0; i < colors.length; i++) {
        if (colors[i].getAttribute("data-theme") === selectedDesign) {
            colors[i].hidden = false;
        } else {
            colors[i].hidden = true;
        }
    }

    // Reset the color selection to the first available option
    colorSelect.selectedIndex = 0;
});

registerForActivities.addEventListener("change", (e) => {

    const totalCostField = document.getElementById("activities-cost");
    let totalCost = 0;

    //Loop through checkboxes to calculate total cost, then update field
    for (let checkbox of activitiesCheckboxes) {
        if (checkbox.checked) {
            const cost = parseInt(checkbox.getAttribute("data-cost"));
            totalCost += cost;
        }
    }

    totalCostField.textContent = `Total: $${totalCost}`;
});

paymentMethods.children[1].selected = true; // Set credit card as default
paypalSection.style.display = "none";
bitcoinSection.style.display = "none";

//Adjust display based on payment method selected
paymentMethods.addEventListener("change", (e) => toggleDisplay(e.target.value));

function inputValidator(input, hint = '', regex = null) {
    //default to true, set to false if any checks fail
    let isValid = true;
    const parent = input.parentElement;
    if (regex && !regex.test(input.value)) {
        isValid = false;
        parent.classList.remove("valid");
        parent.classList.add("not-valid");
        
        if (hint) {
            input.nextElementSibling.style.display = "block"; // Show error message
        }
                
        return isValid;

    } else if (regex && regex.test(input.value)) {
        isValid = true;
        parent.classList.remove("not-valid");
        parent.classList.add("valid");
        if (hint) {
            input.nextElementSibling.style.display = "none"; // Hide error message
        }
    } else if (input.value.trim() === "")  {

        isValid = false;
        parent.classList.remove("valid");
        parent.classList.add("not-valid");
        
        if (hint) {
            input.nextElementSibling.style.display = "block"; // Show hint
        }
    return isValid;
    } else {
        isValid = true;
        parent.classList.remove("not-valid");
        parent.classList.add("valid");
        if (hint) {
            input.nextElementSibling.style.display = "none"; // Hide hint
        }
    }
    return isValid;
}

function toggleDisplay(paymentType) {
    const sections = {
        "credit-card": document.getElementById("credit-card"),
        "paypal": document.getElementById("paypal"),
        "bitcoin": document.getElementById("bitcoin")
    };
    if (paymentType === "credit-card") {
        sections["credit-card"].style.display = "block";
        sections["paypal"].style.display = "none";
        sections["bitcoin"].style.display = "none";
    } else if (paymentType === "paypal") {
        sections["credit-card"].style.display = "none";
        sections["paypal"].style.display = "block";
        sections["bitcoin"].style.display = "none";
    } else if (paymentType === "bitcoin") {
        sections["credit-card"].style.display = "none";
        sections["paypal"].style.display = "none";
        sections["bitcoin"].style.display = "block";
    }
}

form.addEventListener("submit", (e) => {
    let isValid = true;

    // Validate name
    isValid = inputValidator(inputName,true);
    isValid = inputValidator(inputEmail,true,/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/);

    const selectedPaymentMethod = paymentMethods.value;
    if (selectedPaymentMethod === "credit-card") {
        const ccNum = document.getElementById("cc-num");
        const zip = document.getElementById("zip");
        const cvv = document.getElementById("cvv");
        
        isValid = inputValidator(ccNum, true, /^\d{13,16}$/);
        isValid = inputValidator(zip, true, /^\d{5}$/);
        isValid = inputValidator(cvv, true, /^\d{3}$/);
    }

    // Validate activities
    
    let atLeastOneIsChecked = false;
    
    for (let i = 0; i < activitiesCheckboxes.length; i++) {
        if (activitiesCheckboxes[i].checked) {
            atLeastOneIsChecked = true;
            break;  
        }
    }

    if (!atLeastOneIsChecked) {
        isValid = false;
        console.log(activitiesCheckboxes[0].parent);
        registerForActivities.classList.remove("valid");
        registerForActivities.classList.add("not-valid");
        document.getElementById("activities-hint").style.display = "block"; // Show error message
        }
     else {
        isValid = true;
        registerForActivities.classList.remove("not-valid");
        registerForActivities.classList.add("valid");
        document.getElementById("activities-hint").style.display = "none"; // Hide error message
    }
    
    if (!isValid) {
        e.preventDefault();
    }   
});

//includes #1 of "exceeds requirements"
for (let checkbox of activitiesCheckboxes) {
    checkbox.addEventListener("focus", (e) => {
        e.target.parentElement.classList.add("focus");
        for (checkbox of activitiesCheckboxes) {
            
            if(e.target.dataset.dayAndTime === checkbox.dataset.dayAndTime && e.target !== checkbox){
                checkbox.parentElement.classList.add('disabled');
                checkbox.disabled = true;
            } else {
                checkbox.parentElement.classList.remove('disabled');
                checkbox.disabled = false;
            }
        }
    });

    checkbox.addEventListener("blur", (e) => {
        e.target.parentElement.classList.remove("focus");
        for (checkbox of activitiesCheckboxes) {    
            if(e.target.dataset.dayAndTime === checkbox.dataset.dayAndTime && e.target !== checkbox && !e.target.checked ){
                 checkbox.parentElement.classList.remove('disabled');
                 checkbox.disabled = false;
             }

         }
    });

    //#2 and 3 of "exceeds requirements"       
    inputEmail.addEventListener("keyup",(e) => {
        const startMessage = "Please enter an email address";
        const typingMessage = "Please format your email correctly";
        const hint = document.getElementById("email-hint");
        hint.innerHTML =startMessage;
        
        isValid = inputValidator(inputEmail,true,/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/);
        if (inputEmail.value.length > 3 && !isValid) {
            hint.innerHTML = "Please format your email correctly using @ and .";
        } else if (inputEmail.value.length ===0) {
            inputEmail.parentElement.classList.remove("not-valid");
            hint.style.display = "none"; // Hide error message
        }
    });           
}