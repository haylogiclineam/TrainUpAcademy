<script setup>

</script>

<template>
    <div class="auth-form">
        <h3 class="h3 text-capitalize">Change password</h3>
        <div class="form d-flex flex-column">
            <div class="d-flex flex-column form-input-block align-items-center">
                <div class="w-100">
                    <label for="password">Create new password*</label>
                </div>
                <input id="password" name="password" class="form-input" type="text" placeholder="New password">
            </div>
            <!--            <p class="required-field">Անվան դաշտը պարտադիր է:</p>-->
            <div class="d-flex flex-column form-input-block align-items-center">
                <div class="w-100">
                    <label for="password">Confirm your password*</label>
                </div>
                <input id="password" name="password" class="form-input" type="text" placeholder="Your password">
            </div>
            <!--            <p class="required-field">Անվան դաշտը պարտադիր է:</p>-->
            <div class="auth-btn-div d-flex justify-content-center align-items-center">
                <button class="auth-btn text-capitalize">
                    Change
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

.auth-dont-have-account,
.auth-dont-have-account a {
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

    .auth-btn-div {
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
    .auth-dont-have-account,
    .auth-dont-have-account a {
        font-size: 14px;
    }
}

/* Small Devices */
@media (min-width: 576px) and (max-width: 767px) {
    .auth-form .h3 {
        font-size: 22px;
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

    .auth-dont-have-account,
    .auth-dont-have-account a {
        font-size: 14px;
    }

    .auth-form{
        gap:10px;
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

    .auth-dont-have-account,
    .auth-dont-have-account a {
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