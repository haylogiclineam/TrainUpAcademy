<script setup>
const helpTopics = [
    {
        id: 'account-profile',
        title: 'Account/Profile',
        description: 'Manage your account settings',
        pdf: '/assets/files/learnerHelpSupport/Account Profile.pdf',
        svg:`<svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.0012 22C27.861 22 32.6072 17.2537 32.6072 11.394C32.6072 5.53409 27.861 0.787842 22.0012 0.787842C16.1413 0.787842 11.3951 5.53409 11.3951 11.394C11.3951 17.2537 16.1413 22 22.0012 22ZM22.0012 27.3031C14.9217 27.3031 0.789062 30.856 0.789062 37.9091V43.2122H43.2133V37.9091C43.2133 30.856 29.0808 27.3031 22.0012 27.3031Z" fill="#F5F5F5"/>
              </svg>`
    },
    {
        id: 'troubleshooting',
        title: 'Troubleshooting',
        description: 'Experiencing a technical issue? Check here.',
        pdf: '/assets/files/learnerHelpSupport/Troubleshooting.pdf',
        svg:`<svg width="60" height="51" viewBox="0 0 60 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.835938 50.4546H59.1692L30.0025 0.0758057L0.835938 50.4546ZM32.6541 42.5H27.3511V37.1969H32.6541V42.5ZM32.6541 31.894H27.3511V18.6364H32.6541V31.894Z" fill="#F5F5F5"/>
            </svg>`
    },
    {
        id: 'learning-experience',
        title: 'Learning Experience',
        description: 'Everything about the HayLogic Academy learning experience.',
        pdf: '/assets/files/learnerHelpSupport/Learning Experience.pdf',
        svg:`<svg width="60" height="48" viewBox="0 0 60 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M53.8663 0.136353H6.13901C3.19582 0.136353 0.835938 2.49624 0.835938 5.43942V37.2576C0.835938 40.1742 3.19582 42.5606 6.13901 42.5606H19.3965V47.8636H40.6087V42.5606H53.8663C56.7829 42.5606 59.1428 40.1742 59.1428 37.2576L59.1692 5.43942C59.1692 2.49624 56.7829 0.136353 53.8663 0.136353ZM53.8663 37.2576H6.13901V5.43942H53.8663V37.2576ZM40.6087 21.3485L22.0481 31.9545V10.7424L40.6087 21.3485Z" fill="#F5F5F5"/>
            </svg>
            `
    },
    {
        id: 'purchase-refunds',
        title: 'Purchase/Refunds',
        description: 'Learn about purchasing courses, how to send gifts, and refunds.',
        pdf: '/assets/files/learnerHelpSupport/Purchase Refunds.pdf',
        svg:`<svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M39.4155 29.6515C41.4041 29.6515 43.1541 28.5644 44.0556 26.9204L53.5481 9.71213C54.5291 7.96213 53.2564 5.78782 51.2413 5.78782H11.9988L9.50639 0.484863H0.835938V5.78782H6.13901L15.6845 25.9128L12.1049 32.3826C10.1692 35.9355 12.7147 40.2576 16.745 40.2576H48.5632V34.9545H16.745L19.6617 29.6515H39.4155ZM14.5178 11.0909H46.7337L39.4155 24.3485H20.8018L14.5178 11.0909ZM16.745 42.9091C13.8283 42.9091 11.4686 45.2954 11.4686 48.2121C11.4686 51.1287 13.8283 53.5151 16.745 53.5151C19.6617 53.5151 22.0481 51.1287 22.0481 48.2121C22.0481 45.2954 19.6617 42.9091 16.745 42.9091ZM43.2601 42.9091C40.3436 42.9091 37.9837 45.2954 37.9837 48.2121C37.9837 51.1287 40.3436 53.5151 43.2601 53.5151C46.1768 53.5151 48.5632 51.1287 48.5632 48.2121C48.5632 45.2954 46.1768 42.9091 43.2601 42.9091Z" fill="#F5F5F5"/>
            </svg>
            `
    },
    {
        id: 'mobile',
        title: 'Mobile',
        description: 'On the go? Learn about our mobile app.',
        pdf: '/assets/files/learnerHelpSupport/Mobile.pdf',
        svg:`<svg width="38" height="60" viewBox="0 0 38 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M32.2557 0.859844L5.74057 0.833252C2.82386 0.833252 0.4375 3.21962 0.4375 6.13632V53.8636C0.4375 56.7803 2.82386 59.1667 5.74057 59.1667H32.2557C35.1724 59.1667 37.5588 56.7803 37.5588 53.8636V6.13632C37.5588 3.21962 35.1724 0.859844 32.2557 0.859844ZM32.2557 48.5605H5.74057V11.4394H32.2557V48.5605Z" fill="#F5F5F5"/>
            </svg> `
    },
    {
        id: 'trust-safety',
        title: 'Trust & Safety',
        description: 'Trust & Safety information and reporting.',
        pdf: '/assets/files/learnerHelpSupport/Trust & Safety.pdf',
        svg: `<svg width="44" height="56" viewBox="0 0 44 56" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M37.9103 18.6364H35.2588V13.3333C35.2588 6.01512 29.3194 0.0758057 22.0012 0.0758057C14.683 0.0758057 8.74361 6.01512 8.74361 13.3333V18.6364H6.09213C3.17543 18.6364 0.789062 21.0227 0.789062 23.9394V50.4546C0.789062 53.3713 3.17543 55.7576 6.09213 55.7576H37.9103C40.827 55.7576 43.2134 53.3713 43.2134 50.4546V23.9394C43.2134 21.0227 40.827 18.6364 37.9103 18.6364ZM22.0012 42.5C19.0845 42.5 16.6982 40.1137 16.6982 37.1969C16.6982 34.2804 19.0845 31.894 22.0012 31.894C24.9179 31.894 27.3043 34.2804 27.3043 37.1969C27.3043 40.1137 24.9179 42.5 22.0012 42.5ZM30.2209 18.6364H13.7816V13.3333C13.7816 8.79921 17.4671 5.11365 22.0012 5.11365C26.5353 5.11365 30.2209 8.79921 30.2209 13.3333V18.6364Z" fill="#F5F5F5"/></svg>`
    }
]

</script>

<template>
    <div class="container">
        <div class="help-support-main">
            <h2 class="text-capitalize h2">Select a Topic to Search for Help</h2>
            <div class="help-support-list d-flex flex-wrap">
                <a
                    v-for="topic in helpTopics"
                    :key="topic.id"
                    :href="topic.pdf"
                    download
                    class="help-support-item text-decoration-none"
                >
                    <div class="icon-block" v-html="topic.svg"></div>
                    <h6 class="text-capitalize h6">{{ topic.title }}</h6>
                    <p class="text-center p">{{ topic.description }}</p>
                </a>
            </div>
        </div>
    </div>
</template>

<style scoped>
.h2 {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 42px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--primary-100);
}

.help-support-main {
    padding: 8% 0;
    display: flex;
    flex-direction: column;
    gap: 60px;
}

.help-support-list {
    gap: 40px;
}

.help-support-item {
    border: 1px solid var(--primary-90);
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    flex: 0 0 calc(32.333% - 1rem);
    max-width: calc(32.333% - 1rem);
    box-sizing: border-box;
}

.icon-block {
    width: 100px;
    height: 100px;
    background-color: var(--primary-90);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}

.h6,
.p {
    font-family: var(--font-inter);
    line-height: normal;
    letter-spacing: 0%;
    color: var(--primary-90);
}

.h6 {
    margin-top: 10px;
    font-weight: 500;
    font-size: 20px;
}

.p {
    font-weight: 400;
    font-size: 16px;
}

/* Extra Small Devices */
@media (max-width: 575px) {
    .help-support-main {
        padding: 15% 0;
        gap: 30px;
    }

    .h2 {
        font-size: 22px;
        text-align: center;
    }

    .help-support-item {
        flex: 0 0 100%;
        max-width: 100%;
    }

    .h6 {
        font-size: 18px;
    }

    .p {
        font-size: 16px;
    }

    .icon-block svg {
        width: 53px;
        height: 42px;
    }
}

/* Small Devices */
@media (min-width: 576px) and (max-width: 767px) {
    .help-support-main {
        padding: 10% 0;
        gap: 30px;
    }

    .h2 {
        font-size: 22px;
        text-align: center;
    }

    .help-support-item {
        flex: 0 0 100%;
        max-width: 100%;
    }

    .h6 {
        font-size: 18px;
    }

    .p {
        font-size: 16px;
    }

    .icon-block svg {
        width: 53px;
        height: 42px;
    }
}

/* Medium Devices */
@media (min-width: 768px) and (max-width: 991px) {
    .help-support-main {
        padding: 10% 0;
        gap: 30px;
    }

    .h2 {
        font-size: 32px;
        text-align: center;
    }

    .help-support-item {
        flex: 0 0 100%;
        max-width: 100%;
    }

    .h6 {
        font-size: 18px;
    }

    .p {
        font-size: 16px;
    }

    .icon-block svg {
        width: 53px;
        height: 42px;
    }
}

/* Large Devices */
@media (min-width: 992px) and (max-width: 1199px) {
    .help-support-item {
        flex: 0 0 30%;
        max-width: 30%;
    }
}

@media (min-width: 1200px) {
    .help-support-item:hover {
        background: var(--primary-10);
        cursor: pointer;
    }
}
</style>