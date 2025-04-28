<script setup>

</script>

<template>
    <div class="send-us-message-section">
        <div class="container">
            <div class="msg-form">
                <h3 class="h3 text-capitalize">Send Us a Message</h3>
                <div class="form d-flex flex-column">
                    <div class="d-flex flex-column form-input-block align-items-center">
                        <div class="w-100">
                            <label for="email">Email*</label>
                        </div>
                        <input id="email" name="email" class="form-input" type="text" placeholder="Your email">
                    </div>
<!--                                <p class="required-field">Անվան դաշտը պարտադիր է:</p>-->
                    <div class="d-flex flex-column form-input-block align-items-center">
                        <div class="w-100">
                            <label for="name">Name</label>
                        </div>
                        <input id="name" name="name" class="form-input" type="text" placeholder="Your name">
                    </div>
                    <div class="d-flex flex-column form-input-block align-items-center">
                        <div class="w-100">
                            <label for="name">Message*</label>
                        </div>
                        <textarea rows="4" cols="50" class="form-input" type="text" placeholder="Your message"></textarea>
                    </div>

                    <div class="send-msg-btn-div d-flex justify-content-center align-items-center">
                        <button class="send-msg-btn text-capitalize">
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.send-us-message-section {
    position: relative;
    background-image: url("/assets/images/home/online-course.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    padding: 4% 0;
    width: 100%;
    z-index: 0;
    display: flex;
    align-items: center;
}

.send-us-message-section::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--send-us-mgs-bg);
    z-index: 1;
    display: block;
    pointer-events: none;
}

.msg-form {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 60px;
}

.msg-form .h3 {
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
    border-radius: 16px;
    gap: 10px;
    padding:  4%;
}

.form-input,
textarea{
    width: 100%;
    border-radius: 16px;
    background: var(--white-179);
    outline: none;
    border: none;
    color: var(--white-245);
    font-weight: 300;
    padding: 18px 23px;
}

.form-input::placeholder,
textarea{
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--white-245);
    text-transform: capitalize;
    resize: none;
}

.form-input:focus,
textarea:focus{
    color: var(--primary-20);
}

.form-input:focus::placeholder,
textarea:focus::placeholder{
    color: var(--primary-20);
}

.send-msg-btn-div {
    width: 100%;
    margin-top: 3%;
}

.send-msg-btn {
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

.send-msg-btn:hover {
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
    margin:10px 0;
    text-transform: capitalize;
}

/* Extra Small Devices */
@media (max-width: 575px) {
    .send-us-message-section {
        padding: 18% 0 13%;
    }

    .msg-form .h3 {
        font-size: 22px;
        font-weight: 300;
    }

    .form {
        width: 100%;
        min-height: 285px !important;
    }

    .msg-form {
        gap: 40px;
    }

    .form-input {
        width: 100%;
        border-radius: 6px;
        padding: 11px 13px;
    }

    .form-input::placeholder,
    textarea::placeholder{
        font-size: 14px;
    }

    .send-msg-btn-div {
        width: 100%;
    }

    .send-msg-btn {
        width: 100%;
        font-size: 18px;
        height: 47px;
    }


    .form-input-block label{
        font-size: 16px !important;
    }
}

/* Small Devices */
@media (min-width: 576px) and (max-width: 767px) {
    .send-us-message-section {
        padding: 10% 0 8%;
    }

    .msg-form .h3 {
        font-size: 22px;
        font-weight: 300;
    }

    .form {
        width: 100%;
        min-height: 285px !important;
    }

    .msg-form {
        gap: 40px;
    }

    .form-input {
        width: 100%;
        border-radius: 6px;
    }

    .form-input::placeholder {
        font-size: 14px;
    }

    .send-msg-btn-div {
        width: 100%;
    }

    .send-msg-btn {
        width: 100%;
        font-size: 18px;
        height: 47px;
    }
}

/* Medium Devices */
@media (min-width: 768px) and (max-width: 991px) {
    .send-us-message-section {
        padding: 10% 0 8%;
    }

    .msg-form .h3 {
        font-size: 38px;
        font-weight: 300;
    }

    .form {
        width: 100%;
        min-height: 285px !important;
    }

    .msg-form {
        gap: 40px;
    }

    .form-input {
        width: 100%;
        border-radius: 6px;
    }

    .form-input::placeholder {
        font-size: 14px;
    }

    .send-msg-btn-div {
        width: 100%;
    }

    .send-msg-btn {
        width: 100%;
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