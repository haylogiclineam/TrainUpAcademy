<script setup>
const helpTopics = [
    {
        id: 'instructor-payment',
        title: 'Instructor Payment',
        description: 'Understand the revenue share and how to receive payments',
        pdf: '/assets/files/instructorHelpSupport/Instructor Payment.pdf',
        svg: `<svg width="54" height="44" viewBox="0 0 54 44" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M48.2117 0.787842H5.78744C2.84426 0.787842 0.510967 3.14773 0.510967 6.09091L0.484375 37.9091C0.484375 40.8523 2.84426 43.2122 5.78744 43.2122H48.2117C51.1548 43.2122 53.5147 40.8523 53.5147 37.9091V6.09091C53.5147 3.14773 51.1548 0.787842 48.2117 0.787842ZM48.2117 37.9091H5.78744V22H48.2117V37.9091ZM48.2117 11.394H5.78744V6.09091H48.2117V11.394Z" fill="#F5F5F5"/></svg>`
    },
    {
        id: 'selling-promotion',
        title: 'Selling & Promotion',
        description: 'Learn about the announcement and promotional tools',
        pdf: '/assets/files/instructorHelpSupport/Selling & Promotion.pdf',
        svg: `<svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M51.9503 25.4355L28.5374 2.0227C27.5563 1.04168 26.204 0.484863 24.7988 0.484863H5.78744C2.87074 0.484863 0.484375 2.87123 0.484375 5.78782V24.7992C0.484375 26.2045 1.04119 27.5568 2.04881 28.5378L25.4616 51.9508C27.5298 54.019 30.8972 54.019 32.9654 51.9508L51.9768 32.9394C54.0449 30.8712 54.0449 27.5303 51.9503 25.4355ZM12.4162 16.394C10.2154 16.394 8.43892 14.6174 8.43892 12.4167C8.43892 10.2159 10.2154 8.43941 12.4162 8.43941C14.617 8.43941 16.3935 10.2159 16.3935 12.4167C16.3935 14.6174 14.617 16.394 12.4162 16.394Z" fill="#F5F5F5"/></svg>`
    },
    {
        id: 'course-building',
        title: 'Course Building',
        description: 'Build your course curriculum and landing page',
        pdf: '/assets/files/instructorHelpSupport/Course Building.pdf',
        svg: `<svg width="60" height="48" viewBox="0 0 60 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M53.8663 0.136353H6.13901C3.19582 0.136353 0.835938 2.49624 0.835938 5.43942V37.2576C0.835938 40.1742 3.19582 42.5606 6.13901 42.5606H19.3965V47.8636H40.6087V42.5606H53.8663C56.7829 42.5606 59.1428 40.1742 59.1428 37.2576L59.1692 5.43942C59.1692 2.49624 56.7829 0.136353 53.8663 0.136353ZM53.8663 37.2576H6.13901V5.43942H53.8663V37.2576ZM40.6087 21.3485L22.0481 31.9545V10.7424L40.6087 21.3485Z" fill="#F5F5F5"/></svg>`
    },
    {
        id: 'course-management',
        title: 'Course Management',
        description: 'Maintain your course and engage with students',
        pdf: '/assets/files/instructorHelpSupport/Course Management.pdf',
        svg: `<svg width="54" height="50" viewBox="0 0 54 50" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M31.7166 33.7503L47.6257 49.6594L53.2204 43.9321L37.3113 28.023L31.7166 33.7503ZM41.5803 19.9624C40.5462 19.9624 39.4325 19.8298 38.5575 19.4586L8.35673 49.5268L2.76207 43.9321L22.4098 24.3108L17.7166 19.5912L15.8075 21.4472L11.9629 17.7086V25.2919L10.1067 27.148L0.773438 17.7086L2.62946 15.8525H10.0803L6.3681 12.1139L15.8075 2.67448C18.9098 -0.42779 23.8947 -0.42779 26.997 2.67448L21.4022 8.40175L25.1408 12.1139L23.2583 13.9964L28.0045 18.7162L32.8303 13.7313C32.459 12.8563 32.2999 11.7427 32.2999 10.7616C32.2999 5.53812 36.4363 1.42823 41.5803 1.42823C43.1447 1.42823 44.5234 1.79948 45.7696 2.54187L38.6901 9.62141L42.6674 13.5987L49.7468 6.51914C50.4893 7.76539 50.8605 9.09119 50.8605 10.7616C50.8605 15.8525 46.7507 19.9624 41.5803 19.9624Z" fill="#F5F5F5"/></svg>`
    },
    {
        id: 'trust-safety',
        title: 'Trust & Safety',
        description: 'Policy and copyright questions and guidance',
        pdf: '/assets/files/instructorHelpSupport/Trust & Safety.pdf',
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