const loginForm = document.querySelector("form.login");
const signupForm = document.querySelector("form.signup");
const loginBtn = document.querySelector("label.login");
const signupBtn = document.querySelector("label.signup");
const signupLink = document.querySelector(".signup-link a");
const loginText = document.querySelector(".titleText .login");
const signupText = document.querySelector(".titleText .signup");
const invalidspan = document.getElementById("invalid-text");
const invalid1span = document.getElementById("invalid1-text");

signupBtn.onclick = () => {
  loginForm.style.marginLeft = "-50%";
  loginText.style.marginLeft = "-50%";
};

loginBtn.onclick = () => {
  loginForm.style.marginLeft = "0%";
  loginText.style.marginLeft = "0%";
};

signupLink.onclick = () => {
  signupBtn.click();
  return false;
};

const baseURL = "https://employee-management-66vi.onrender.com/";


document.getElementById("register_btn").addEventListener("click", registerUser);
async function registerUser() {

  const email_input = document.getElementById("sign-up-useremail");
  const password_input = document.getElementById("sign-up-password");
  const cpassword_input = document.getElementById("sign-up-cpassword");

  const email = email_input.value;
  const password = password_input.value;
  const confirmPassword = cpassword_input.value;
 
  try {
    if (email && password && confirmPassword) {
      const response = await fetch(`${baseURL}users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, confirmPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        invalid1span.innerHTML=`${data.msg}`; 
      invalid1span.style.color = "green"
      } else {
        invalid1span.innerHTML=`${data.msg}`; 
         invalid1span.style.color = "red"
        
      }
    } else {
      invalid1span.innerHTML= "Enter Your Details"
      invalid1span.style.color = "red";
    }
  } catch (error) {
    console.error("Error:", error);
    invalid1span.innerHTML= "Something went wrong"; 
    invalid1span.style.color = "red"
  }
}


const loginButton = document.getElementById("log-in-btn");

loginButton.addEventListener("click", loginUser);
async function loginUser() {
  const username_input = document.getElementById("log-in-useremail");
  const password_input = document.getElementById("log-in-password");

  const email = username_input.value;
  const password = password_input.value;
  try {
    if (email && password) {
      const response = await fetch(`${baseURL}users/login`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        invalidspan.innerHTML = `${data.msg}`;
        invalidspan.style.color = "green";

        localStorage.setItem("token", data.access_token);
        console.log(data);
        setTimeout(() => {}, 1000000);
        location.href = "../frontend/view/dashboard.html";
      } else {
        invalidspan.innerHTML = `${data.msg}`;
        invalidspan.style.color = "red";
      }
    } else {
      invalidspan.innerHTML = "Enter Your Details";
      invalidspan.style.color = "red";
    }
  } catch (error) {
    console.error("Error:", error);
    invalidspan.innerHTML = "Something went wrong";
    invalidspan.style.color = "red";
  }
}
