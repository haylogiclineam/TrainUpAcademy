<script setup>

</script>
<template>
    <div>
        <div class="settings-tab-header">
            <h3 class="settings-tab-h3 text-capitalize">{{ $t('auth.privacy.title') }}</h3>
            <p class="settings-tab-p">{{ $t('auth.privacy.subtitle') }}</p>
        </div>

        <form class="settings-tab-body">
            <div class="d-flex flex-column settings-detail-item">
                <p class="settings-tab-p mb-0">{{ $t('auth.privacy.profile_page_settings') }}</p>
                <div class="d-flex align-items-center gap-2">
                    <div class="d-flex gap-2 align-items-center">
                        <a href="/assets/files/learnerProfileSettingsPrivacy/Privacy.pdf" download class="span text-decoration-none d-flex align-items-center justify-content-center gap-2">
                            <img src="/assets/icons/pdf.png" alt="pdf" class="pdf-file">
                            {{ $t('auth.privacy.option1') }}
                        </a>
                    </div>
                </div>
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

.checkbox-custom {
    width: 24px;
    height: 24px;
    position: relative;
    appearance: none;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 2px;
    border: 1px solid var(--primary-40);
}

.checkbox-custom:checked {
    background-color: transparent;
}

.checkbox-custom:checked::before {
    content: "\2713";
    font-size: 20px;
    position: absolute;
    display: block;
    color: var(--primary-40);
}

.settings-detail-item {
    gap: 20px;
}

.span {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--primary-90);
}

.pdf-file{
    width: 24px;
    height: 24px;
}


/* Extra Small Devices */
@media (max-width: 991px) {
    .span {
        font-size: 16px;
    }
}

/* Extra Large Devices */
@media (min-width: 1000px) {
    .settings-btn:hover {
        width: 283px;
        height: 53px;
        font-size: 20px;
    }
}


</style>

