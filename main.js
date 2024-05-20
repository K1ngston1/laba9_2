document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signup');
    const loginForm = document.getElementById('login');
    const togglePasswordIcons = document.querySelectorAll('.toggle-password');
    const USER_DATA_KEY = 's4e32q-32423-2348234-234';


    const tabLinks = document.querySelectorAll('.tab-link');
    tabLinks.forEach(link => {
        link.addEventListener('click', function() {
            tabLinks.forEach(link => link.classList.remove('active'));
            const forms = document.querySelectorAll('.form-tab');
            forms.forEach(form => form.classList.remove('active'));
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });


    togglePasswordIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const input = this.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                this.classList.add('visible');
            } else {
                input.type = 'password';
                this.classList.remove('visible');
            }
        });
    });

 
    function togglePasswordVisibility(event) {
        const input = event.target;
        const toggleIcon = input.nextElementSibling;
        if (input.type === 'password') {
            input.type = 'text';
            toggleIcon.classList.add('visible');
        } else {
            input.type = 'password';
            toggleIcon.classList.remove('visible');
        }
    }


    const passwordFields = document.querySelectorAll('input[type="password"]');
    passwordFields.forEach(field => {
        field.addEventListener('input', togglePasswordVisibility);
    });


    function validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            const formGroup = input.parentElement;
            const errorMessage = formGroup.querySelector('.error-message');

            input.style.borderColor = '';
            if (errorMessage) {
                formGroup.removeChild(errorMessage);
            }

            switch (input.id) {
                case 'username':
                case 'login-username':
                    if (input.value.length < 3 || input.value.length > 15) {
                        isValid = false;
                        showError(formGroup, 'Username must be between 3 and 15 characters.');
                    }
                    break;
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value)) {
                        isValid = false;
                        showError(formGroup, 'Invalid email format.');
                    }
                    break;
                case 'password':
                case 'login-password':
                    if (input.value.length < 6) {
                        isValid = false;
                        showError(formGroup, 'Password must be at least 6 characters long.');
                    }
                    break;
                case 'confirm-password':
                    const passwordInput = form.querySelector('#password');
                    if (input.value !== passwordInput.value) {
                        isValid = false;
                        showError(formGroup, 'Passwords do not match.');
                    }
                    break;
            }
            if (isValid) {
                input.style.borderColor = 'green';
            } else {
                input.style.borderColor = 'red';
            }
        });

        return isValid;
    }


    function showError(formGroup, message) {
        const errorElement = document.createElement('div');
        errorElement.classList.add('error-message');
        errorElement.textContent = message;
        formGroup.appendChild(errorElement);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const form = event.target;

        if (validateForm(form)) {
            const submitButton = form.querySelector('button');
            submitButton.disabled = true;
            submitButton.textContent = 'Loading...';

            const formData = new FormData(form);
            const result = form.id === 'signup' ? await signUp(formData) : await login(formData);

            showModal(result.message);
            if (result.isSuccess) {
                form.reset();
                if (form.id === 'signup') {
                    setTimeout(() => {
                        document.querySelector('.tab-link[data-tab="login"]').click();
                    }, 2000);
                } else if (form.id === 'login') {
                    window.location.href = 'index1.html';
                }
            }

            submitButton.disabled = false;
            submitButton.textContent = form.id === 'signup' ? 'Signup' : 'Login';
        }
    }

 
    signupForm.addEventListener('submit', handleSubmit);
    loginForm.addEventListener('submit', handleSubmit);

    // Signup function to store data in localStorage
    async function signUp(formData) {
        await new Promise(resolve => setTimeout(resolve, 3000));

        const dataString = localStorage.getItem(USER_DATA_KEY);
        const users = dataString ? JSON.parse(dataString) : [];
        const username = formData.get('username');

        if (users.find(u => u.username === username)) {
            return {
                isSuccess: false,
                message: 'This username is already taken'
            };
        }

        const user = {};
        for (const [key, value] of formData.entries()) {
            user[key] = value;
        }

        users.push(user);
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(users));

        return {
            isSuccess: true,
            message: 'Signed up successfully'
        };
    }

   
    async function login(formData) {
        await new Promise(resolve => setTimeout(resolve, 3000));

        const dataString = localStorage.getItem(USER_DATA_KEY);

        if (!dataString) {
            return {
                isSuccess: false,
                message: 'No users yet, register first'
            };
        }

        const users = JSON.parse(dataString);
        const username = formData.get('username');
        const user = users.find(u => u.username === username);

        if (!user) {
            return {
                isSuccess: false,
                message: 'No such user'
            };
        }

        const password = formData.get('password');

        if (password !== user.password) {
            return {
                isSuccess: false,
                message: 'Password is not correct'
            };
        }

        return {
            isSuccess: true,
            message: 'Logged in successfully'
        };
    }

    // Show modal with message
    function showModal(message) {
        const modal = document.getElementById('modal');
        const modalMessage = document.getElementById('modal-message');
        const closeModalButton = document.querySelector('.modal .close');
        modalMessage.textContent = message;
        modal.style.display = 'block';
        closeModalButton.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }


    function validateFormField(event) {
        const input = event.target;
        const formGroup = input.parentElement;
        const errorMessage = formGroup.querySelector('.error-message');

        if (errorMessage) {
            formGroup.removeChild(errorMessage);
        }
        input.style.borderColor = '';
        let isValid = true;
        switch (input.id) {
            case 'username':
            case 'login-username':
                if (input.value.length < 3 || input.value.length > 15) {
                    isValid = false;
                    showError(formGroup, 'Username must be between 3 and 15 characters.');
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    isValid = false;
                    showError(formGroup, 'Invalid email format.');
                }
                break;
            case 'password':
            case 'login-password':
                if (input.value.length < 6) {
                    isValid = false;
                    showError(formGroup, 'Password must be at least 6 characters long.');
                }
                break;
            case 'confirm-password':
                const passwordInput = formGroup.querySelector('#password');
                if (input.value !== passwordInput.value) {
                    isValid = false;
                    showError(formGroup, 'Passwords do not match.');
                }
                break;
            default:
                break;
        }
        if (isValid) { 
            input.style.borderColor = 'green';
        } else {
            input.style.borderColor = 'red';
        }
    }

    // Event listeners for form field validation on input
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', validateFormField);
    });
});
