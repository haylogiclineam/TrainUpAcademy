<script setup>

</script>

<template>
    <div class="online-learning-section">
        <div class="container">
            <div class="online-learning-content d-flex align-items-center justify-content-between">
                <div class="content-img">
                    <div class="content-img-footer">
                        <h6 class="text-capitalize">{{ $t('about.goals_title') }}</h6>
                        <ul>
                            <li>{{ $t('about.goal_1') }}</li>
                            <li>{{ $t('about.goal_2') }}</li>
                            <li>{{ $t('about.goal_3') }}</li>
                            <li>{{ $t('about.goal_4') }}</li>
                        </ul>
                    </div>
                </div>
                <div class="content">
                    <h4 class="text-capitalize">{{ $t('about.empowering_growth') }}</h4>
                    <div class="mission-vision-block">
                        <div class="vision vision-mission-div">
                            <div class="vision-mission-content d-flex align-items-center justify-content-between">
<!--                                <div class="vision-icon">-->
<!--                                    <svg width="39" height="31" viewBox="0 0 39 31" fill="none"-->
<!--                                         xmlns="http://www.w3.org/2000/svg">-->
<!--                                        <path d="M19.5 5.75C14.1229 5.75 9.74999 10.1229 9.74999 15.5C9.74999 20.8771 14.1229 25.25 19.5 25.25C24.8771 25.25 29.25 20.8771 29.25 15.5C29.25 10.1229 24.8771 5.75 19.5 5.75ZM19.5 23.625C16.5132 23.625 13.9246 21.9854 12.5141 19.5771L15.4781 16.6895L16.6871 17.8985C17.3225 18.5339 18.4291 18.5339 19.0645 17.8985L22.7516 14.2114V17.125C22.7516 17.5735 23.1156 17.9375 23.5641 17.9375C24.0126 17.9375 24.3766 17.5735 24.3766 17.125V13.0625C24.3766 12.1671 23.6486 11.4375 22.7516 11.4375H18.6891C18.2406 11.4375 17.8766 11.8015 17.8766 12.25C17.8766 12.6985 18.2406 13.0625 18.6891 13.0625H21.5914L17.836 16.7496L16.627 15.5406C15.9737 14.8857 14.9029 14.8857 14.2496 15.5406L11.8056 17.9846C11.5505 17.1965 11.3766 16.3726 11.3766 15.5C11.3766 11.0199 15.0215 7.375 19.5016 7.375C23.9817 7.375 27.6266 11.0199 27.6266 15.5C27.6266 19.9801 23.9817 23.625 19.5016 23.625H19.5ZM37.8154 11.4586C35.2934 7.50662 29.562 0.875 19.5 0.875C9.43799 0.875 3.70336 7.50825 1.18461 11.4619C-0.404637 13.953 -0.404637 17.0486 1.18461 19.5381C3.70661 23.4934 9.43636 30.125 19.5 30.125C29.5636 30.125 35.2934 23.4934 37.8154 19.5381C39.4046 17.0486 39.4046 13.953 37.8154 11.4586ZM36.4439 18.6671C34.1022 22.3396 28.7836 28.5016 19.4984 28.5016C10.2131 28.5016 4.89611 22.338 2.55449 18.6655C1.30811 16.7122 1.30811 14.2878 2.55449 12.3345C4.89449 8.662 10.2115 2.49838 19.5 2.49838C28.7885 2.49838 34.1022 8.65875 36.4455 12.3296C37.6919 14.2845 37.6919 16.7122 36.4455 18.6639L36.4439 18.6671Z"-->
<!--                                              fill="#001028"/>-->
<!--                                    </svg>-->
<!--                                </div>-->
                                <div class="vision-text">
                                    <h3 class="text-capitalize">{{ $t('about.vision') }}</h3>
                                    <p>{{ $t('about.vision_text') }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="mission vision-mission-div">
                            <div class="vision-mission-content d-flex align-items-center justify-content-between">
<!--                                <div class="mission-icon">-->
<!--                                    <svg width="33" height="33" viewBox="0 0 33 33" fill="none"-->
<!--                                         xmlns="http://www.w3.org/2000/svg">-->
<!--                                        <path d="M32.615 12.9113C32.8762 14.08 33 15.29 33 16.5C33 25.6025 25.6025 33 16.5 33C7.3975 33 0 25.6025 0 16.5C0 7.3975 7.3975 0 16.5 0C17.71 0 18.92 0.1375 20.0887 0.385C20.46 0.4675 20.6938 0.83875 20.6112 1.21C20.5287 1.58125 20.1575 1.815 19.7863 1.7325C18.7138 1.49875 17.6 1.375 16.5 1.375C8.15375 1.375 1.375 8.15375 1.375 16.5C1.375 24.8463 8.15375 31.625 16.5 31.625C24.8463 31.625 31.625 24.8463 31.625 16.5C31.625 15.3862 31.5012 14.2862 31.2675 13.2137C31.185 12.8425 31.4188 12.4713 31.79 12.3888C32.1613 12.3063 32.5325 12.54 32.615 12.9113ZM18.425 7.0675C18.7962 7.13625 19.1537 6.9025 19.2362 6.53125C19.305 6.16 19.0713 5.8025 18.7 5.72C17.985 5.56875 17.2425 5.5 16.5 5.5C10.4363 5.5 5.5 10.4363 5.5 16.5C5.5 22.5637 10.4363 27.5 16.5 27.5C22.5637 27.5 27.5 22.5637 27.5 16.5C27.5 15.7575 27.4312 15.015 27.28 14.3C27.2113 13.9287 26.84 13.695 26.4688 13.7638C26.0975 13.8463 25.85 14.2038 25.9325 14.575C26.0563 15.2075 26.125 15.8538 26.125 16.5C26.125 21.8075 21.8075 26.125 16.5 26.125C11.1925 26.125 6.875 21.8075 6.875 16.5C6.875 11.1925 11.1925 6.875 16.5 6.875C17.1462 6.875 17.7925 6.94375 18.425 7.0675ZM15.9087 12.4162C16.28 12.3612 16.5413 12.0175 16.4862 11.6325C16.4312 11.2475 16.0875 10.9862 15.7025 11.055C13.0075 11.44 10.9862 13.7775 10.9862 16.5C10.9862 19.5387 13.4475 22 16.4862 22C19.2087 22 21.5462 19.9788 21.9312 17.2837C21.9862 16.9125 21.725 16.555 21.3538 16.5C20.9825 16.445 20.625 16.7062 20.57 17.0775C20.2812 19.0988 18.5212 20.6112 16.4862 20.6112C14.2175 20.6112 12.3612 18.755 12.3612 16.4862C12.3612 14.4513 13.8738 12.6913 15.895 12.4025L15.9087 12.4162ZM22 10.0238V5.95375C22 5.0325 22.3575 4.16625 23.0037 3.52L26.3312 0.20625C26.5238 0.01375 26.8263 -0.055 27.0738 0.055C27.335 0.165 27.5 0.4125 27.5 0.6875V5.5H32.3125C32.5875 5.5 32.835 5.665 32.945 5.92625C33.055 6.1875 32.9863 6.47625 32.7938 6.66875L29.48 9.9825C28.8338 10.6287 27.9675 10.9862 27.0462 10.9862H22.9762L16.995 16.9675C16.8575 17.105 16.6788 17.1737 16.5138 17.1737C16.3488 17.1737 16.1562 17.105 16.0325 16.9675C15.7575 16.6925 15.7575 16.2663 16.0325 15.9913L22.0138 10.01L22 10.0238ZM23.375 9.625H27.0462C27.5963 9.625 28.1187 9.405 28.5037 9.02L30.6488 6.875H26.8125C26.4275 6.875 26.125 6.5725 26.125 6.1875V2.35125L23.98 4.49625C23.595 4.88125 23.375 5.40375 23.375 5.95375V9.625Z"-->
<!--                                              fill="#001028"/>-->
<!--                                    </svg>-->
<!--                                </div>-->
                                <div class="mission-text">
                                    <h3 class="text-capitalize">{{ $t('about.mission') }}</h3>
                                    <p>{{ $t('about.mission_text') }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="line"></div>
                    <div class="social-media-block d-flex justify-content-between align-items-center">
                        <p class="text-capitalize">{{ $t('about.social_media') }}</p>
                        <div class="social-media-icons d-flex">
                            <img src="/assets/icons/social-media/facebook.svg" alt="facebook">
                            <img src="/assets/icons/social-media/instagram.svg" alt="instagram">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.online-learning-section {
    background: var(--secondary-2-10);
    padding: 8% 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.online-learning-content{
    gap:20px;
}

.content-img {
    width: 100%;
    max-width: 522px;
    min-height: 323px;
    border-radius: 16px;
    background-image: url("/assets/images/home/online-learning.jpeg");
    background-size: cover;
    position: relative;
}

.content-img:before {
    content: '';
    width: 100%;
    height: 100%;
    border-radius: 16px;
    background: var(--online-learning);
    position: absolute;
}

.content-img-footer {
    width: 100%;
    height: auto;
    background-color: var(--secondary-2-10);
    border-radius: 26px;
    position: absolute;
    bottom: -32%;
    display: flex;
    flex-direction: column;
    padding: 25px;
}

.content-img-footer h6 {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 24px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--primary-100);
    margin: 0 0 12px 11px;
}

.content-img-footer ul {
    list-style-type: disc;
    padding-left: 30px;
    margin: 0;
}

.content-img-footer li {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 16px;
    line-height: 1.5;
    color: var(--primary-60);
    margin-bottom: 5px;
}

.content-img-footer p {
    /* Kept for compatibility if p is used elsewhere, but removed from usage in footer */
    width: 77%;
    margin: 0 0 12px 11px;
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--primary-60);
}

.content {
    width: 53%;
}

.content h4 {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 38px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--primary-100);
}

.mission-vision-block {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin: 10% 0 4%;
}

.vision-mission-div {
    width: 100%;
    height: 170px;
    gap: 10px;
    border-radius: 16px;
    background: var(--secondary-2-10);
    box-shadow: 0 0 10px 2px rgba(96, 96, 96, 0.13);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.vision-icon,
.mission-icon {
    width: 73px;
    height: 73px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--secondary-2-10);
    box-shadow: 0 0 10px 2px rgba(96, 96, 96, 0.13);
    border-radius: 50%;
    cursor: pointer;
}

.vision-icon:hover svg path,
.mission-icon:hover svg path {
    fill: var(--secondary-1-100)
}

.vision-mission-content {
    padding: 0 20px;
    width: 100%;
}

.vision-text,
.mission-text {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 83%;
    margin-top: 2%;
}

.vision-text h3,
.mission-text h3 {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 22px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--primary-100);
    text-transform: capitalize;
}

.vision-text p,
.mission-text p {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 16px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--primary-60);
    width: 86%;
}

.line {
    width: 100%;
    border: 0.5px var(--primary-50);
    border-style: solid;
    box-sizing: border-box;
}

.social-media-block {
    margin: 3% 0;
}

.social-media-block p {
    font-family: var(--font-montserrat);
    font-weight: 300;
    font-size: 22px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--primary-100);
}

.social-media-icons {
    width: 13%;
    justify-content: space-between;
}

/* Extra Small Devices */
@media (max-width: 575px) {
    .online-learning-section {
        padding: 18% 0;
    }

    .online-learning-content {
        flex-direction: column-reverse;
    }

    .content {
        width: 100% !important;
    }

    .content h4 {
        font-weight: 300 !important;
        font-size: 22px !important;
        text-align: center;
    }

    .vision-mission-div {
        height: unset !important;
    }

    .vision-mission-content {
        flex-direction: column;
        padding: 17px;
    }

    .vision-text,
    .mission-text {
        width: 100%;
        display: flex;
        align-items: center;
    }

    .vision-text h3,
    .mission-text h3 {
        font-size: 18px;
        text-align: center;
    }

    .vision-text p,
    .mission-text p {
        font-size: 16px !important;
        text-align: center;
        width: 100%;
        margin: 0;
    }

    .vision-icon,
    .mission-icon {
        width: 43px;
        height: 43px;
    }

    .vision-icon svg,
    .mission-icon svg {
        width: 21px;
        height: 21px;
    }

    .social-media-block p {
        font-size: 16px;
    }

    .social-media-icons {
        width: 53px;
    }

    .social-media-icons img {
        width: 20px;
        height: 20px;
    }

    .content-img {
        width: 100%;
        min-height: 230px;
        height: 100%;
        border-radius: 8px;
    }

    .content-img::before {
        border-radius: 8px;
    }

    .content-img-footer {
        width: 100%;
        height: fit-content;
        border-radius: 16px;
        padding: 12px;
    }

    .content-img-footer h6,
    .content-img-footer p {
        font-size: 16px;
    }

    .content-img-footer p {
        width: 100%;
        margin: 10px 0 0 0;
        max-height: 60px !important;
        overflow: scroll;
    }

    .content-img-footer h6{
        margin: 0;
    }

}

/* Small Devices */
@media (min-width: 576px) and (max-width: 767px) {
    .online-learning-section {
        padding: 15% 0;
    }

    .online-learning-content {
        flex-direction: column-reverse;
    }

    .content {
        width: 100% !important;
    }

    .content h4 {
        font-weight: 300 !important;
        font-size: 22px !important;
        text-align: center;
    }

    .vision-mission-div {
        height: unset !important;
    }

    .vision-mission-content {
        flex-direction: column;
        padding: 17px;
    }

    .vision-text,
    .mission-text {
        width: 100%;
        display: flex;
        align-items: center;
    }

    .vision-text h3,
    .mission-text h3 {
        font-size: 18px;
        text-align: center;
    }

    .vision-text p,
    .mission-text p {
        font-size: 16px !important;
        text-align: center;
        width: 100%;
        margin: 0;
    }

    .vision-icon,
    .mission-icon {
        width: 43px;
        height: 43px;
    }

    .vision-icon svg,
    .mission-icon svg {
        width: 21px;
        height: 21px;
    }

    .social-media-block p {
        font-size: 16px;
    }

    .social-media-icons {
        width: 53px;
    }

    .social-media-icons img {
        width: 20px;
        height: 20px;
    }

    .content-img {
        width: 100%;
        border-radius: 8px;
        max-width: 100%;
        height: auto;
        display: block;
    }

    .content-img::before {
        border-radius: 8px;
    }

    .content-img-footer {
        width: 100%;
        border-radius: 16px;
        padding: 12px;
        justify-content: normal;
    }

    .content-img-footer h6,
    .content-img-footer p {
        font-size: 16px;
    }

    .content-img-footer p {
        width: 100%;
        margin: 10px 0 0 0;
        max-height: 60px !important;
        overflow: scroll;
    }

    .content-img-footer h6 {
        margin: 0;
    }

}

/* Medium Devices */
@media (min-width: 768px) and (max-width: 991px) {
    .online-learning-section {
        padding: 15% 0;
    }

    .online-learning-content {
        flex-direction: column-reverse;
    }

    .content {
        width: 100% !important;
    }

    .content h4 {
        font-weight: 300 !important;
        font-size: 38px !important;
        text-align: center;
    }

    .vision-mission-div {
        height: unset !important;
    }

    .vision-mission-content {
        flex-direction: column;
        padding: 17px;
    }

    .vision-text,
    .mission-text {
        width: 100%;
        display: flex;
        align-items: center;
    }

    .vision-text h3,
    .mission-text h3 {
        font-size: 18px;
        text-align: center;
    }

    .vision-text p,
    .mission-text p {
        font-size: 16px !important;
        text-align: center;
        width: 100%;
        margin: 0;
    }

    .vision-icon,
    .mission-icon {
        width: 53px;
        height: 53px;
    }

    .vision-icon svg,
    .mission-icon svg {
        width: 24px;
        height: 24px;
    }

    .social-media-block p {
        font-size: 16px;
    }

    .social-media-icons {
        width: 53px;
    }

    .social-media-icons img {
        width: 24px;
        height: 24px;
    }

    .content-img {
        width: 100%;
        border-radius: 8px;
        max-width: 100%;
        height: auto;
        display: block;
        min-height: 360px;
    }

    .content-img::before {
        border-radius: 8px;
    }

    .content-img-footer {
        width: 100%;
        border-radius: 16px;
        padding: 12px;
        justify-content: normal;
    }

    .content-img-footer h6,
    .content-img-footer p {
        font-size: 16px;
    }

    .content-img-footer p {
        width: 100%;
        margin: 10px 0 0 0;
        max-height: 60px !important;
        overflow: scroll;
    }

    .content-img-footer h6 {
        margin: 0;
    }

    .mission-vision-block {
        margin: 8% 0 4%;
        flex-direction: row;
    }


}
/* Large Devices */
@media (min-width: 992px) and (max-width: 1199px) {
    .online-learning-content{
        gap:35px;
    }
    .content {
        width: 90%;
    }

    .content-img{
        min-height: 292px;
    }

    .mission-text h3,
    .vision-text h3{
        font-size: 20px;
    }

    .mission-text,
    .vision-text {
        width: 80%;
    }

    .vision-icon,
    .mission-icon{
        width: 55px;
        height:55px;
    }

    .mission-icon svg,
    .vision-icon svg{
        width: 30px;
        height: 30px;
    }

    .social-media-icons{
        width: 16%;
    }
}

/* Extra Large Devices */
@media (min-width: 1600px) {
    .content-img{
        max-width: 700px;
    }

    .social-media-icons{
        width: 9%;
    }
}



</style>