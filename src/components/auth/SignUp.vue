<script setup>

</script>

<template>
    <div class="auth-form">
        <h3 class="h3 text-capitalize">Sign Up</h3>
        <div class="form d-flex flex-column">
            <div class="d-flex flex-column form-input-block align-items-center">
                <div class="w-100">
                    <label for="first-name">First name*</label>
                </div>
                <input id="first-name" name="first-name" class="form-input" type="text" placeholder="Your First Name">
            </div>
<!--            <p class="required-field">Անվան դաշտը պարտադիր է:</p>-->
            <div class="d-flex flex-column form-input-block align-items-center">
                <div class="w-100">
                    <label for="last-name">Last name*</label>
                </div>
                <input id="last-name" name="last-name" class="form-input" type="text" placeholder="Your Last Name">
            </div>
            <div class="d-flex flex-column form-input-block align-items-center">
                <div class="w-100">
                    <label for="email">Email*</label>
                </div>
                <input id="email" name="email" class="form-input" type="text" placeholder="Your email">
            </div>
            <div class="d-flex flex-column form-input-block align-items-center">
                <div class="w-100">
                    <label for="password">Password*</label>
                </div>
                <input id="password" name="password" class="form-input" type="text" placeholder="Your password">
            </div>
            <div class="d-flex flex-column form-input-block align-items-center">
                <div class="w-100">
                    <label for="repeat-password">Repeat Password*</label>
                </div>
                <input id="repeat-password" name="repeat-password" class="form-input" type="text"
                       placeholder="Repeat password">
            </div>
            <div class="d-flex align-items-center form-input-block form-input-radio-block align-items-center">
                <div class="form-check-custom d-flex align-items-center">
                    <input class="form-check-input-custom" type="radio" name="flexRadioDefault" id="flexRadioDefault1">
                    <label class="form-check-label-custom" for="flexRadioDefault1">
                        Continue As Student
                    </label>
                </div>
                <div class="form-check-custom d-flex align-items-center">
                    <input class="form-check-input-custom" type="radio" name="flexRadioDefault" id="flexRadioDefault2"
                           checked>
                    <label class="form-check-label-custom" for="flexRadioDefault2">
                        Continue As Lecturer
                    </label>
                </div>
            </div>
            <div class="d-flex form-input-block align-items-center">
                <p class="auth-already-have-account">
                    You already have an account?
                    <router-link to="/sign-in">Sign in</router-link>
                </p>

            </div>
            <div class="auth-btn-div d-flex justify-content-center align-items-center">
                <button class="auth-btn text-capitalize">
                    Sign up
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.auth-form {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 30px;
    width: 100%;
}

.auth-form .h3 {
    font-family: var(--font-montserrat);
    font-weight: 300;
    font-size: 42px;
    line-height: normal;
    letter-spacing: 2%;
    text-align: center;
    color: var(--primary-10);
}

.form {
    backdrop-filter: blur(104px);
    background: var(--white-217);
    width: 60%;
    border-radius: 16px;
    gap: 10px;
    padding: 4%;
}

.form-input {
    width: 100%;
    border-radius: 16px;
    background: var(--white-179);
    outline: none;
    border: none;
    color: var(--white-245);
    font-weight: 300;
    padding: 18px 23px;
}

.form-input::placeholder {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--white-245);
    text-transform: capitalize;
    resize: none;
}

.form-input:focus {
    color: var(--primary-20);
}

.form-input:focus::placeholder {
    color: var(--primary-20);
}

.auth-btn-div {
    width: 100%;
    margin-top: 3%;
}

.auth-btn {
    width: 100%;
    height: 64px;
    border-radius: 70px;
    background: var(--general-btn-light);
    border: none;
    outline: none;
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 22px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--white-245);
}

.auth-btn:hover {
    background: var(--book-cal-btn-hover);
}

.form-input-block {
    width: 100%;
}

.w-100 {
    width: 100%;
}

.form-input-block label {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 22px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--white-255);
    margin: 10px 0;
    text-transform: capitalize;
}

.auth-already-have-account,
.auth-already-have-account a {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--white-255);
}

.form-input-radio-block {
    gap: 30px;
}

.form-check-input-custom {
    width: 24px;
    height: 24px;
    background-color: var(--white-245);
    margin-right: 17px;
    border-radius: 50% !important; /* Optional, for rounded corners */
    position: relative;
    appearance: none; /* Remove default styling */
    display: flex;
    justify-content: center;
    align-items: center;
}

.form-check-input-custom:checked {
    background-color: transparent !important;
    border: 3px solid var(--secondary-1-100) !important;
}

.form-check-input-custom:checked::after {
    content: "";
    position: absolute;
    width: 12px;
    height: 12px;
    background-color: var(--secondary-1-100);
    border-radius: 50%;
}


/* Extra Small Devices */
@media (max-width: 575px) {
    .auth-form .h3 {
        font-size: 22px;
        font-weight: 300;
    }

    .auth-form{
        gap:10px;
    }

    .form {
        width: 100%;
        min-height: 285px !important;
    }

    .form-input {
        width: 100%;
        border-radius: 6px;
        padding: 11px 13px;
    }

    .form-input::placeholder {
        font-size: 14px;
    }

    .aut-btn-div {
        width: 100%;
    }

    .auth-btn {
        width: 100%;
        font-size: 18px;
        height: 47px;
    }

    .form-input-block label {
        font-size: 16px !important;
    }

    .form-input-radio-block{
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .form-check-custom{
        width: 100%;
    }

    .auth-already-have-account,
    .auth-already-have-account a {
        font-size: 14px;
    }
}

/* Small Devices */
@media (min-width: 576px) and (max-width: 767px) {
    .auth-form .h3 {
        font-size: 22px;
        font-weight: 300;
    }

    .auth-form{
        gap:10px;
    }

    .form {
        width: 100%;
        min-height: 285px !important;
    }

    .form-input {
        width: 100%;
        border-radius: 6px;
    }

    .form-input::placeholder {
        font-size: 14px;
    }

    .auth-btn-div {
        width: 100%;
    }

    .auth-btn {
        width: 100%;
        font-size: 18px;
        height: 47px;
    }

    .auth-already-have-account,
    .auth-already-have-account a {
        font-size: 14px;
    }

    .form-input-block label {
        font-size: 16px !important;
    }
}

/* Medium Devices */
@media (min-width: 768px) and (max-width: 991px) {
    .auth-form .h3 {
        font-size: 38px;
        font-weight: 300;
    }

    .form {
        width: 100%;
        min-height: 285px !important;
    }

    .form-input {
        width: 100%;
        border-radius: 6px;
    }

    .form-input::placeholder {
        font-size: 14px;
    }

    .auth-btn-div {
        width: 100%;
    }

    .auth-btn {
        width: 100%;
        font-size: 18px;
        height: 47px;
    }
    .auth-already-have-account,
    .auth-already-have-account a {
        font-size: 16px;
    }
}

/* Large Devices */
@media (min-width: 992px) and (max-width: 1199px) {
    .form {
        width: 70%;
    }
}

</style>