<script setup>

</script>

<template>
    <div class="book-call-section">
        <div class="container">
            <div class="call-form">
                <h3 class="h3 text-capitalize">Book a Call & Join the Experience!</h3>
                <div class="form d-flex flex-column justify-content-center align-items-center">
                    <div class="w-100 d-flex flex-column align-items-center">
                        <input class="form-input" type="text" placeholder="Full Name*">
<!--                        <p class="required-field mt-1">Անվան դաշտը պարտադիր է:</p>-->
                    </div>
                    <div class="w-100 d-flex flex-column align-items-center">
                        <input class="form-input" type="text" placeholder="Phone Number*">
<!--                        <p class="required-field mt-1">Անվան դաշտը պարտադիր է:</p>-->
                    </div>
<!--                    <div class="w-100 d-flex flex-column align-items-center">-->
<!--                        <input class="form-input" type="text" placeholder="Email*">-->
<!--                        &lt;!&ndash;                        <p class="required-field mt-1">Անվան դաշտը պարտադիր է:</p>&ndash;&gt;-->
<!--                    </div>-->
                    <div class="book-call-btn-div d-flex justify-content-center align-items-center">
                        <button class="book-call-btn text-capitalize">
                            Book a call
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.book-call-section {
    position: relative;
    background-image: url("/assets/images/home/header-background.jpeg");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    padding: 4% 0;
    width: 100%;
    z-index: 0;
    display: flex;
    align-items: center;
}

.book-call-section::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--book-call-bg); /* Your overlay color */
    z-index: 1;
    display: block;
    pointer-events: none;
}

.call-form {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 60px;
}

.call-form .h3 {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 42px;
    line-height: normal;
    letter-spacing: 2%;
    text-align: center;
    color: var(--white-245);
}

.form {
    backdrop-filter: blur(104px);
    background: var(--white-217);
    width: 60%;
    min-height: 344px;
    border-radius: 16px;
    gap: 15px;
}

.form-input {
    width: 62%;
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
}

.form-input:focus {
    color: var(--primary-20);
}

.form-input:focus::placeholder {
    color: var(--primary-20);
}

.required-field{
    width: 62%;
}

.book-call-btn-div {
    width: 100%;
    margin-top: 3%;
}

.book-call-btn {
    width: 62%;
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

.book-call-btn:hover {
    background: var(--book-cal-btn-hover);
}

/* Extra Small Devices */
@media (max-width: 575px) {
    .book-call-section {
        padding: 18% 0 13%;
    }

    .call-form .h3 {
        font-size: 22px;
        font-weight: 300;
    }

    .form {
        width: 100%;
        min-height: 285px !important;
    }

    .call-form {
        gap: 40px;
    }

    .form-input {
        width: 90%;
        border-radius: 6px;
    }

    .required-field{
        width: 90%;
        font-size: 14px;
    }

    .form-input::placeholder {
        font-size: 14px;
    }

    .book-call-btn-div {
        width: 100%;
    }

    .book-call-btn {
        width: 90%;
        font-size: 18px;
        height: 47px;
    }
}


/* Small Devices */
@media (min-width: 576px) and (max-width: 767px) {
    .book-call-section {
        padding: 10% 0 8%;
    }

    .call-form .h3 {
        font-size: 22px;
        font-weight: 300;
    }

    .form {
        width: 100%;
        min-height: 285px !important;
    }

    .call-form {
        gap: 40px;
    }

    .form-input {
        width: 90%;
        border-radius: 6px;
    }

    .required-field{
        width: 90%;
        font-size: 14px;
    }

    .form-input::placeholder {
        font-size: 14px;
    }

    .book-call-btn-div {
        width: 100%;
    }

    .book-call-btn {
        width: 90%;
        font-size: 18px;
        height: 47px;
    }
}

/* Medium Devices */
@media (min-width: 768px) and (max-width: 991px) {
    .book-call-section {
        padding: 10% 0 8%;
    }

    .call-form .h3 {
        font-size: 38px;
        font-weight: 300;
    }

    .form {
        width: 100%;
        min-height: 285px !important;
    }

    .call-form {
        gap: 40px;
    }

    .form-input {
        width: 90%;
        border-radius: 6px;
    }

    .required-field{
        width: 90%;
        font-size: 14px;
    }

    .form-input::placeholder {
        font-size: 14px;
    }

    .book-call-btn-div {
        width: 100%;
    }

    .book-call-btn {
        width: 90%;
        font-size: 18px;
        height: 47px;
    }
}

/* Large Devices */
@media (min-width: 992px) and (max-width: 1199px) {
    .form {
        width: 70%;
    }
}

</style>