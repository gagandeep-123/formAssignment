const form = document.getElementById("multiStepForm");
const steps = document.querySelectorAll(".form-step");
const nextBtns = document.querySelectorAll(".next-btn");
const prevBtns = document.querySelectorAll(".prev-btn");
const progressSteps = document.querySelectorAll(".step");

let currentStep = 0;
let formData = JSON.parse(localStorage.getItem("formData")) || {};

// Load saved form data
document.addEventListener("DOMContentLoaded", () => {
  if (formData.currentStep !== undefined) {
    currentStep = formData.currentStep;
    showStep(currentStep);
  }

  populateForm();
});

// Show the current step
function showStep(step) {
  steps.forEach((s, i) => s.classList.toggle("active", i === step));
  progressSteps.forEach((s, i) => s.classList.toggle("active", i <= step));

  if (step === 2) {
    updateSummary();
  }

  formData.currentStep = step;
  localStorage.setItem("formData", JSON.stringify(formData));
}

// Validate input fields & show error messages
function validateStep(step) {
  let isValid = true;
  const inputs = steps[step].querySelectorAll("input, select, textarea");

  inputs.forEach((input) => {
    const errorSpan = document.getElementById(input.id + "Error");

    if (!input.value) {
      isValid = false;
      input.classList.add("invalid");
      errorSpan.innerText = `${input.previousSibling.textContent} is required.`;
    } else {
      input.classList.remove("invalid");
      errorSpan.innerText = "";
    }

    if (input.id === "email" && !/^\S+@\S+\.\S+$/.test(input.value)) {
      isValid = false;
      input.classList.add("invalid");
      errorSpan.innerText = "Please enter a valid email address.";
    }

    if (input.id === "phone" && !/^\d{10}$/.test(input.value)) {
      isValid = false;
      input.classList.add("invalid");
      errorSpan.innerText = "Phone number must be 10 digits.";
    }
  });

  return isValid;
}

// Handle navigation
nextBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    if (validateStep(index)) {
      saveFormData();
      currentStep++;
      showStep(currentStep);
    }
  });
});

prevBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentStep--;
    showStep(currentStep);
  });
});

// Submit form
form.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Form Submitted Successfully!");
  localStorage.removeItem("formData"); // Clear saved data after submission
});

// Save form data to localStorage
function saveFormData() {
  formData = {
    currentStep: currentStep,
    name: document.getElementById("name").value,
    dob: document.getElementById("dob").value,
    gender: document.getElementById("gender").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    address: document.getElementById("address").value,
  };
  localStorage.setItem("formData", JSON.stringify(formData));
}

// Populate form with saved data
function populateForm() {
  if (!formData) return;

  document.getElementById("name").value = formData.name || "";
  document.getElementById("dob").value = formData.dob || "";
  document.getElementById("gender").value = formData.gender || "";
  document.getElementById("email").value = formData.email || "";
  document.getElementById("phone").value = formData.phone || "";
  document.getElementById("address").value = formData.address || "";
}

// Update summary details before showing Step 3
function updateSummary() {
  document.getElementById("summary").innerHTML = `
        <h3>Review Your Details</h3>
        <p><strong>Name:</strong> ${formData.name || "Not provided"}</p>
        <p><strong>Date of Birth:</strong> ${formData.dob || "Not provided"}</p>
        <p><strong>Gender:</strong> ${formData.gender || "Not provided"}</p>
        <p><strong>Email:</strong> ${formData.email || "Not provided"}</p>
        <p><strong>Phone:</strong> ${formData.phone || "Not provided"}</p>
        <p><strong>Address:</strong> ${formData.address || "Not provided"}</p>
    `;
}

// Show first step initially
showStep(currentStep);
