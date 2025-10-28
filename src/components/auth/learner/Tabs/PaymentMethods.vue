<script setup>

</script>
<template>
    <div>
        <div class="settings-tab-header">
            <h3 class="settings-tab-h3 text-capitalize">{{ $t('auth.paymentMethods.title') }}</h3>
            <p class="settings-tab-p">{{ $t('auth.paymentMethods.subtitle') }}</p>
        </div>

        <form class="settings-tab-body">
            <div class="d-flex flex-column settings-detail-item">
                <p class="settings-tab-p p mb-0 text-capitalize">{{ $t('auth.paymentMethods.saved_methods') }}</p>

                <div class="card-method">
                    <div class="card-details d-flex gap-3">
                        <div class="card-image">
                            <svg width="46" height="14" viewBox="0 0 46 14" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M42.4753 0.289398H39.6464C38.7911 0.289398 38.1332 0.552556 37.7385 1.40782L32.3438 13.7105H36.1595C36.1595 13.7105 36.8174 12.0657 36.949 11.671C37.3438 11.671 41.0937 11.671 41.6201 11.671C41.7516 12.1315 42.0806 13.6447 42.0806 13.6447H45.5016L42.4753 0.289398ZM38.0016 8.90782C38.3306 8.11835 39.449 5.15782 39.449 5.15782C39.449 5.22361 39.778 4.36835 39.9095 3.90782L40.1727 5.09203C40.1727 5.09203 40.8964 8.31571 41.028 8.97361H38.0016V8.90782Z"
                                      fill="#3362AB"/>
                                <path d="M32.609 9.3026C32.609 12.0658 30.109 13.9079 26.2274 13.9079C24.5826 13.9079 23.0037 13.5789 22.1484 13.1842L22.6748 10.1579L23.1353 10.3552C24.3195 10.8815 25.109 11.0789 26.5563 11.0789C27.609 11.0789 28.7274 10.6842 28.7274 9.76312C28.7274 9.17102 28.2669 8.77628 26.8195 8.11839C25.4379 7.46049 23.5958 6.40786 23.5958 4.49997C23.5958 1.86839 26.1616 0.0920715 29.78 0.0920715C31.1616 0.0920715 32.3458 0.355229 33.0695 0.684177L32.5432 3.57891L32.28 3.31576C31.6221 3.0526 30.7669 2.78944 29.5169 2.78944C28.1353 2.85523 27.4774 3.44733 27.4774 3.97365C27.4774 4.56576 28.2669 5.02628 29.5169 5.61839C31.6221 6.60523 32.609 7.72365 32.609 9.3026Z"
                                      fill="#3362AB"/>
                                <path d="M0.5 0.421056L0.565789 0.157898H6.22368C7.01316 0.157898 7.60526 0.421056 7.80263 1.27632L9.05263 7.19737C7.80263 4.03948 4.90789 1.47369 0.5 0.421056Z"
                                      fill="#F9B50B"/>
                                <path d="M17.0119 0.289453L11.2882 13.6447H7.40666L4.11719 2.46051C6.48561 3.97366 8.45929 6.34208 9.18298 7.98682L9.57771 9.3684L13.1303 0.223663H17.0119V0.289453Z"
                                      fill="#3362AB"/>
                                <path d="M18.5292 0.223663H22.1476L19.845 13.6447H16.2266L18.5292 0.223663Z"
                                      fill="#3362AB"/>
                            </svg>
                        </div>
                        <span class="card-number">{{ $t('auth.paymentMethods.card_number_masked') }}</span>
                    </div>
                    <button class="delete-button">{{ $t('auth.paymentMethods.delete_button') }}</button>
                </div>

                <div class="no-exist-card-method d-flex justify-content-center align-items-center">
                    <span class="text-center">{{ $t('auth.paymentMethods.no_saved_methods') }}</span>
                </div>
            </div>

            <div class="settings-btn-div d-flex justify-content-center align-items-center">
                <button class="settings-btn text-capitalize">{{ $t('auth.paymentMethods.add_new_button') }}</button>
            </div>
        </form>
    </div>
</template>

<style scoped>
.settings-tab-body label {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 20px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--primary-100);
    margin-bottom: 15px;
}

.settings-btn-div {
    width: 100%;
    height: 53px;
    margin-top: 8%;
}

.settings-btn {
    width: 273px;
    height: 50px;
    border-radius: 25px;
    background: var(--general-btn-light);
    border: none;
    outline: none;
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--white-245);
}

.settings-detail-item {
    gap: 20px;
}

.card-image {
    width: 54px;
    height: 36px;
    background-color: var(--payment-method-bg);
    border-radius: 5px;
}

.card-image svg {
    width: 90%;
    height: 100%;
    object-fit: cover;
}

.card-method {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border-width: 0.5px;
    border-style: solid;
    border-color: var(--primary-50);
    border-radius: 10px;
    background-color: #fff;
    margin-bottom: 1rem;
    box-sizing: border-box;
    -webkit-appearance: none;
}

.card-details {
    display: flex;
    align-items: center;
}

.delete-button {
    padding: 10px;
    border: 1px solid var(--required);
    background-color: transparent;
    color: var(--required);
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    min-width: 15%;
    font-family: var(--font-inter);
    font-weight: 400;
    font-size: 14px;
    line-height: normal;
    letter-spacing: 2%;
    text-align: center;
}

.no-exist-card-method{
    border-radius: 8px;
    min-height: 165px;
    background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%23808793FF' stroke-width='2' stroke-dasharray='7%2c 16' stroke-dashoffset='8' stroke-linecap='round'/%3e%3c/svg%3e");
}

.no-exist-card-method span{
    font-family: var(--font-montserrat);
    font-weight: 300;
    font-size: 20px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--primary-90);
}

.card-number{
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--primary-90);
}

/* Extra Small Devices */
@media (max-width: 575px) {
    .settings-tab-body label{
        font-size: 14px;
    }

    .p{
       font-size: 18px;
    }

    .card-method{
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
    }

    .delete-button{
        min-width: 40%;
    }

    .no-exist-card-method span{
        font-size: 16px;
        width: 80%;
    }

    .no-exist-card-method {
        min-height: 120px;
    }
    .card-image {
        width: 44px;
        height: 29px;
    }

    .card-number{
        font-size: 14px;
    }
}

@media (min-width: 575px) and (max-width: 991px) {
    .settings-tab-body label{
        font-size: 14px;
    }

    .p{
        font-size: 18px;
    }

    .no-exist-card-method span{
        font-size: 16px;
        width: 80%;
    }

    .no-exist-card-method {
        min-height: 120px;
    }
}

/* Extra Large Devices */
@media (min-width: 1000px) {
    .settings-btn:hover {
        width: 283px;
        height: 53px;
        font-size: 20px;
    }

    .delete-button:hover {
        background-color: var(--payment-method-delete-btn-hover);
    }

}

</style>

