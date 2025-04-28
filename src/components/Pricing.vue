<!--<script setup>-->
<!--    // Import necessary packages-->
<!--    import 'vue3-carousel/carousel.css'-->
<!--    import {Carousel, Slide, Pagination, Navigation} from 'vue3-carousel'-->
<!--    import {ref} from 'vue'-->

<!--    const currentPage = ref(0);-->

<!--    const carouselConfig = {-->
<!--    itemsToShow: 3,  // Show 3 items per slide-->
<!--    wrapAround: true,  // Allow the carousel to loop back after reaching the last slide-->
<!--    autoplay: 3000,  // Enable autoplay-->
<!--}-->

<!--    const goToNextSlide = () => {-->
<!--    // Increment currentPage and wrap it to a valid index-->
<!--    currentPage.value = (currentPage.value + 1) % 3; // Adjust to match total number of slides-->
<!--};-->

<!--    const goToPreviousSlide = () => {-->
<!--    // Decrement currentPage and wrap it to a valid index-->
<!--    currentPage.value = (currentPage.value - 1 + 3) % 3; // Adjust to match total number of slides-->
<!--};-->

<!--    const goToSlide = (slideIndex) => {-->
<!--    // Update currentPage to the clicked slide-->
<!--    currentPage.value = slideIndex - 1; // Adjust to match zero-based index-->
<!--};-->
<!--</script>-->


<!--<template>-->
<!--    <div class="pricing-section">-->
<!--        <div class="container">-->
<!--            <div class="d-flex flex-column justify-content-center align-items-center position-relative pricing-main">-->
<!--                <div class="pricing-title">-->
<!--                    <h3 class="text-capitalize">Our Pricing</h3>-->
<!--                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper-->
<!--                        mattis, pulvinar</p>-->
<!--                </div>-->

<!--                &lt;!&ndash; Carousel integration &ndash;&gt;-->
<!--                <div class="slider-block carousel-inner row d-flex flex-column justify-content-start align-items-center">-->
<!--                    <Carousel v-bind="carouselConfig" v-model:currentPage="currentPage">-->
<!--                        &lt;!&ndash; Dynamically generate slides &ndash;&gt;-->
<!--                        <Slide v-for="(slide, index) in [1, 2, 3]" :key="index">-->
<!--                            <div class="d-flex justify-content-between align-items-center w-100">-->
<!--                                <div class="custom-slide ">-->
<!--                                    <div class="slide-content">-->
<!--                                        <div class="enroll-more-btn-div d-flex justify-content-center align-items-center">-->
<!--                                            <button class="enroll-more-btn text-capitalize">-->
<!--                                                Enroll now-->
<!--                                            </button>-->
<!--                                        </div>-->
<!--                                        <div class="package-detail">-->
<!--                                            <h3 class="text-capitalize h3">Basic Package</h3>-->
<!--                                            <p class="p">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut-->
<!--                                                elit-->
<!--                                                tellus, luctus nec </p>-->
<!--                                            <h4 class="text-capitalize h4">$ 3.75/month</h4>-->
<!--                                        </div>-->
<!--                                        <div class="line"></div>-->
<!--                                        <div class="package-include">-->
<!--                                            <p class="package-include-title">Featured Include</p>-->
<!--                                            <div class="d-flex flex-column include-item">-->
<!--                                                <div class="d-flex align-items-center">-->
<!--                                                    <img src="/assets/icons/pricing/checkmark.svg" alt="checkmark.svg">-->
<!--                                                    <span class="text-capitalize span">Best Conference</span>-->
<!--                                                </div>-->
<!--                                                <div class="line"></div>-->
<!--                                            </div>-->
<!--                                        </div>-->
<!--                                    </div>-->
<!--                                </div>-->
<!--                            </div>-->
<!--                        </Slide>-->

<!--                        &lt;!&ndash; Add navigation and pagination &ndash;&gt;-->
<!--                        <template #addons>-->
<!--                            <div class="slider-icons d-flex  align-items-center">-->
<!--                                <div class="next-prev d-flex">-->
<!--                                    <svg @click="goToPreviousSlide" width="35" height="35" viewBox="0 0 35 35" fill="none"-->
<!--                                         xmlns="http://www.w3.org/2000/svg">-->
<!--                                        <g clip-path="url(#clip0_190_418)">-->
<!--                                            <path d="M17.5 35C27.1498 35 35 27.1498 35 17.5C35 7.85021 27.1498 0 17.5 0C7.85021 0 0 7.85021 0 17.5C0 27.1498 7.85021 35 17.5 35ZM17.5 1.45833C26.3448 1.45833 33.5417 8.65521 33.5417 17.5C33.5417 26.3448 26.3448 33.5417 17.5 33.5417C8.65521 33.5417 1.45833 26.3448 1.45833 17.5C1.45833 8.65521 8.65521 1.45833 17.5 1.45833Z"-->
<!--                                                  fill="#4D5869"/>-->
<!--                                            <path d="M13.6195 21.1052L17.7451 25.3037C18.028 25.591 18.4889 25.5954 18.7762 25.3125C19.0634 25.031 19.0678 24.5687 18.7849 24.2814L14.6549 20.0785C14.3822 19.8044 14.0016 19.3858 13.6137 18.9512C12.8816 18.1244 12.8816 16.8789 13.6137 16.0535C14.0016 15.616 14.3822 15.1975 14.6593 14.9204L18.7849 10.7219C19.0678 10.4346 19.0634 9.97228 18.7762 9.69082C18.6332 9.55082 18.4495 9.48082 18.2643 9.48082C18.0762 9.48082 17.8866 9.55374 17.7451 9.69811L13.6239 13.8923C13.3351 14.1796 12.9326 14.6214 12.5214 15.0852C11.3022 16.4619 11.3022 18.5385 12.5214 19.9167C12.9326 20.3789 13.3351 20.8208 13.618 21.1037L13.6195 21.1052Z"-->
<!--                                                  fill="#4D5869"/>-->
<!--                                        </g>-->
<!--                                        <defs>-->
<!--                                            <clipPath id="clip0_190_418">-->
<!--                                                <rect width="35" height="35" fill="white" transform="matrix(-1 0 0 -1 35 35)"/>-->
<!--                                            </clipPath>-->
<!--                                        </defs>-->
<!--                                    </svg>-->
<!--                                    <svg @click="goToNextSlide" width="35" height="35" viewBox="0 0 35 35" fill="none"-->
<!--                                         xmlns="http://www.w3.org/2000/svg">-->
<!--                                        <g clip-path="url(#clip0_190_422)">-->
<!--                                            <path d="M17.5 0C7.85021 0 0 7.85021 0 17.5C0 27.1498 7.85021 35 17.5 35C27.1498 35 35 27.1498 35 17.5C35 7.85021 27.1498 0 17.5 0ZM17.5 33.5417C8.65521 33.5417 1.45833 26.3448 1.45833 17.5C1.45833 8.65521 8.65521 1.45833 17.5 1.45833C26.3448 1.45833 33.5417 8.65521 33.5417 17.5C33.5417 26.3448 26.3448 33.5417 17.5 33.5417Z"-->
<!--                                                  fill="#4D5869"/>-->
<!--                                            <path d="M21.3805 13.8948L17.2549 9.69626C16.972 9.40897 16.5111 9.40459 16.2238 9.68751C15.9366 9.96897 15.9322 10.4313 16.2151 10.7186L20.3451 14.9215C20.6178 15.1956 20.9984 15.6142 21.3863 16.0488C22.1184 16.8756 22.1184 18.1211 21.3863 18.9465C20.9984 19.384 20.6178 19.8025 20.3407 20.0796L16.2151 24.2781C15.9322 24.5654 15.9366 25.0277 16.2238 25.3092C16.3668 25.4492 16.5505 25.5192 16.7357 25.5192C16.9238 25.5192 17.1134 25.4463 17.2549 25.3019L21.3761 21.1077C21.6649 20.8204 22.0674 20.3786 22.4786 19.9148C23.6978 18.5381 23.6978 16.4615 22.4786 15.0833C22.0674 14.6211 21.6649 14.1792 21.382 13.8963L21.3805 13.8948Z"-->
<!--                                                  fill="#4D5869"/>-->
<!--                                        </g>-->
<!--                                        <defs>-->
<!--                                            <clipPath id="clip0_190_422">-->
<!--                                                <rect width="35" height="35" fill="white"/>-->
<!--                                            </clipPath>-->
<!--                                        </defs>-->
<!--                                    </svg>-->

<!--                                </div>-->
<!--                                <div class="slider-circle-block">-->
<!--                                    <div class="slider-circle d-flex justify-content-between align-items-center">-->
<!--                                        <svg  @click="goToSlide(1)" width="18" height="19" viewBox="0 0 18 19" fill="none"-->
<!--                                              xmlns="http://www.w3.org/2000/svg">-->
<!--                                            <circle :fill="currentPage === 0 ? '#1A283E' : '#66707E'" cx="9" cy="9.5" r="9"/>-->
<!--                                        </svg>-->
<!--                                        <svg @click="goToSlide(2)" width="18" height="19" viewBox="0 0 18 19" fill="none"-->
<!--                                             xmlns="http://www.w3.org/2000/svg">-->
<!--                                            <circle :fill="currentPage === 1 ? '#1A283E' : '#66707E'" cx="9" cy="9.5" r="9"/>-->
<!--                                        </svg>-->
<!--                                        <svg @click="goToSlide(3)" width="18" height="19" viewBox="0 0 18 19" fill="none"-->
<!--                                             xmlns="http://www.w3.org/2000/svg">-->
<!--                                            <circle :fill="currentPage === 2 ? '#1A283E' : '#66707E'" cx="9" cy="9.5" r="9"/>-->
<!--                                        </svg>-->
<!--                                    </div>-->
<!--                                </div>-->
<!--                            </div>-->
<!--                        </template>-->
<!--                    </Carousel>-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->
<!--    </div>-->
<!--</template>-->


<template>
    <div class="pricing-section">
        <div class="container">
            <div class="d-flex flex-column justify-content-center align-items-center position-relative pricing-main">
                <div class="pricing-title">
                    <h3 class="text-capitalize">Our Pricing</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper
                        mattis, pulvinar</p>
                </div>
                <div class="slider-block carousel-inner row d-flex flex-column justify-content-start align-items-center">
                    <div class=" d-flex justify-content-between align-items-center w-100">
                        <div class="custom-slide">
                            <div class="slide-content">
                                <div class="enroll-more-btn-div d-flex justify-content-center align-items-center">
                                    <button class="enroll-more-btn text-capitalize">
                                        Enroll now
                                    </button>
                                </div>
                                <div class="package-detail">
                                    <h3 class="text-capitalize h3">Basic Package</h3>
                                    <p class="p">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
                                        tellus, luctus nec </p>
                                    <h4 class="text-capitalize h4">$ 3.75/month</h4>
                                </div>
                                <div class="line"></div>
                                <div class="package-include">
                                    <p class="package-include-title">Featured Include</p>
                                    <div class="d-flex flex-column include-item">
                                        <div class="d-flex align-items-center">
                                            <img src="/assets/icons/pricing/checkmark.svg" alt="checkmark.svg">

                                            <span class="text-capitalize span">Best Conference</span>
                                        </div>
                                        <div class="line"></div>
                                    </div>
                                    <div class="d-flex flex-column include-item">
                                        <div class="d-flex align-items-center">
                                            <img src="/assets/icons/pricing/checkmark.svg" alt="checkmark.svg">
                                            <span class="text-capitalize span">Best Conference</span>
                                        </div>
                                        <div class="line"></div>
                                    </div>
                                    <div class="d-flex flex-column include-item">
                                        <div class="d-flex align-items-center">
                                            <img src="/assets/icons/pricing/checkmark.svg" alt="checkmark.svg">
                                            <span class="text-capitalize span">Best Conference</span>
                                        </div>
                                        <div class="line"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="slide-active">
                            <p class="text-capitalize">Lorem ipsum</p>
                            <div class="slide-active-content">
                                <div class="slide-content">
                                    <div class="enroll-more-btn-div d-flex justify-content-center align-items-center">
                                        <button class="enroll-more-btn text-capitalize">
                                            Enroll now
                                        </button>
                                    </div>
                                    <div class="package-detail">
                                        <h3 class="text-capitalize h3">Basic Package</h3>
                                        <p class="p">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                                            elit
                                            tellus, luctus nec </p>
                                        <h4 class="text-capitalize h4">$ 3.75/month</h4>
                                    </div>
                                    <div class="line"></div>
                                    <div class="package-include">
                                        <p class="package-include-title">Featured Include</p>
                                        <div class="d-flex flex-column include-item">
                                            <div class="d-flex align-items-center include-item-icons-title">
                                                <img src="/assets/icons/pricing/checkmark.svg" alt="checkmark.svg">
                                                <span class="text-capitalize span">Best Conference</span>
                                            </div>
                                            <div class="line"></div>
                                        </div>
                                        <div class="d-flex flex-column include-item">
                                            <div class="d-flex align-items-center include-item-icons-title">
                                                <img src="/assets/icons/pricing/checkmark.svg" alt="checkmark.svg">
                                                <span class="text-capitalize span">Best Conference</span>
                                            </div>
                                            <div class="line"></div>
                                        </div>
                                        <div class="d-flex flex-column include-item">
                                            <div class="d-flex align-items-center include-item-icons-title">
                                                <img src="/assets/icons/pricing/checkmark.svg" alt="checkmark.svg">
                                                <span class="text-capitalize span">Best Conference</span>
                                            </div>
                                            <div class="line"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div class="custom-slide ">
                            <div class="slide-content">
                                <div class="enroll-more-btn-div d-flex justify-content-center align-items-center">
                                    <button class="enroll-more-btn text-capitalize">
                                        Enroll now
                                    </button>
                                </div>
                                <div class="package-detail">
                                    <h3 class="text-capitalize h3">Basic Package</h3>
                                    <p class="p">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
                                        tellus, luctus nec </p>
                                    <h4 class="text-capitalize h4">$ 3.75/month</h4>
                                </div>
                                <div class="line"></div>
                                <div class="package-include">
                                    <p class="package-include-title">Featured Include</p>
                                    <div class="d-flex flex-column include-item">
                                        <div class="d-flex align-items-center">
                                            <img src="/assets/icons/pricing/checkmark.svg" alt="checkmark.svg">

                                            <span class="text-capitalize span">Best Conference</span>
                                        </div>
                                        <div class="line"></div>
                                    </div>
                                    <div class="d-flex flex-column include-item">
                                        <div class="d-flex align-items-center">
                                            <img src="/assets/icons/pricing/checkmark.svg" alt="checkmark.svg">
                                            <span class="text-capitalize span">Best Conference</span>
                                        </div>
                                        <div class="line"></div>
                                    </div>
                                    <div class="d-flex flex-column include-item">
                                        <div class="d-flex align-items-center ">
                                            <img src="/assets/icons/pricing/checkmark.svg" alt="checkmark.svg">
                                            <span class="text-capitalize span">Best Conference</span>
                                        </div>
                                        <div class="line"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

<!--                    <div class="slider-icons d-flex  align-items-center">-->
<!--                        <div class="next-prev d-flex">-->
<!--                            <svg width="35" height="35" viewBox="0 0 35 35" fill="none"-->
<!--                                 xmlns="http://www.w3.org/2000/svg">-->
<!--                                <g clip-path="url(#clip0_190_418)">-->
<!--                                    <path d="M17.5 35C27.1498 35 35 27.1498 35 17.5C35 7.85021 27.1498 0 17.5 0C7.85021 0 0 7.85021 0 17.5C0 27.1498 7.85021 35 17.5 35ZM17.5 1.45833C26.3448 1.45833 33.5417 8.65521 33.5417 17.5C33.5417 26.3448 26.3448 33.5417 17.5 33.5417C8.65521 33.5417 1.45833 26.3448 1.45833 17.5C1.45833 8.65521 8.65521 1.45833 17.5 1.45833Z"-->
<!--                                          fill="#4D5869"/>-->
<!--                                    <path d="M13.6195 21.1052L17.7451 25.3037C18.028 25.591 18.4889 25.5954 18.7762 25.3125C19.0634 25.031 19.0678 24.5687 18.7849 24.2814L14.6549 20.0785C14.3822 19.8044 14.0016 19.3858 13.6137 18.9512C12.8816 18.1244 12.8816 16.8789 13.6137 16.0535C14.0016 15.616 14.3822 15.1975 14.6593 14.9204L18.7849 10.7219C19.0678 10.4346 19.0634 9.97228 18.7762 9.69082C18.6332 9.55082 18.4495 9.48082 18.2643 9.48082C18.0762 9.48082 17.8866 9.55374 17.7451 9.69811L13.6239 13.8923C13.3351 14.1796 12.9326 14.6214 12.5214 15.0852C11.3022 16.4619 11.3022 18.5385 12.5214 19.9167C12.9326 20.3789 13.3351 20.8208 13.618 21.1037L13.6195 21.1052Z"-->
<!--                                          fill="#4D5869"/>-->
<!--                                </g>-->
<!--                                <defs>-->
<!--                                    <clipPath id="clip0_190_418">-->
<!--                                        <rect width="35" height="35" fill="white" transform="matrix(-1 0 0 -1 35 35)"/>-->
<!--                                    </clipPath>-->
<!--                                </defs>-->
<!--                            </svg>-->
<!--                            <svg width="35" height="35" viewBox="0 0 35 35" fill="none"-->
<!--                                 xmlns="http://www.w3.org/2000/svg">-->
<!--                                <g clip-path="url(#clip0_190_422)">-->
<!--                                    <path d="M17.5 0C7.85021 0 0 7.85021 0 17.5C0 27.1498 7.85021 35 17.5 35C27.1498 35 35 27.1498 35 17.5C35 7.85021 27.1498 0 17.5 0ZM17.5 33.5417C8.65521 33.5417 1.45833 26.3448 1.45833 17.5C1.45833 8.65521 8.65521 1.45833 17.5 1.45833C26.3448 1.45833 33.5417 8.65521 33.5417 17.5C33.5417 26.3448 26.3448 33.5417 17.5 33.5417Z"-->
<!--                                          fill="#4D5869"/>-->
<!--                                    <path d="M21.3805 13.8948L17.2549 9.69626C16.972 9.40897 16.5111 9.40459 16.2238 9.68751C15.9366 9.96897 15.9322 10.4313 16.2151 10.7186L20.3451 14.9215C20.6178 15.1956 20.9984 15.6142 21.3863 16.0488C22.1184 16.8756 22.1184 18.1211 21.3863 18.9465C20.9984 19.384 20.6178 19.8025 20.3407 20.0796L16.2151 24.2781C15.9322 24.5654 15.9366 25.0277 16.2238 25.3092C16.3668 25.4492 16.5505 25.5192 16.7357 25.5192C16.9238 25.5192 17.1134 25.4463 17.2549 25.3019L21.3761 21.1077C21.6649 20.8204 22.0674 20.3786 22.4786 19.9148C23.6978 18.5381 23.6978 16.4615 22.4786 15.0833C22.0674 14.6211 21.6649 14.1792 21.382 13.8963L21.3805 13.8948Z"-->
<!--                                          fill="#4D5869"/>-->
<!--                                </g>-->
<!--                                <defs>-->
<!--                                    <clipPath id="clip0_190_422">-->
<!--                                        <rect width="35" height="35" fill="white"/>-->
<!--                                    </clipPath>-->
<!--                                </defs>-->
<!--                            </svg>-->

<!--                        </div>-->
<!--                        <div class="slider-circle-block">-->

<!--                            <div class="slider-circle d-flex justify-content-between align-items-center">-->
<!--                                <svg width="18" height="19" viewBox="0 0 18 19" fill="none"-->
<!--                                     xmlns="http://www.w3.org/2000/svg">-->
<!--                                    <circle cx="9" cy="9.5" r="9" fill="rgba(26, 40, 62, 1)"/>-->
<!--                                </svg>-->
<!--                                <svg width="18" height="19" viewBox="0 0 18 19" fill="none"-->
<!--                                     xmlns="http://www.w3.org/2000/svg">-->
<!--                                    <circle cx="9" cy="9.5" r="9" fill="rgba(102, 112, 126, 1)"/>-->
<!--                                </svg>-->
<!--                                <svg width="18" height="19" viewBox="0 0 18 19" fill="none"-->
<!--                                     xmlns="http://www.w3.org/2000/svg">-->
<!--                                    <circle cx="9" cy="9.5" r="9" fill="rgba(102, 112, 126, 1)"/>-->
<!--                                </svg>-->
<!--                            </div>-->
<!--                        </div>-->
<!--                    </div>-->
                </div>
            </div>
        </div>
    </div>
</template>

<!--<template>-->
<!--    <Carousel v-bind="carouselConfig">-->
<!--        <Slide v-for="slide in 10" :key="slide">-->
<!--            <div class="carousel__item">{{ slide }}</div>-->
<!--        </Slide>-->

<!--        <template #addons>-->
<!--            <Navigation />-->
<!--            <Pagination />-->
<!--        </template>-->
<!--    </Carousel>-->
<!--</template>-->
<style scoped>
.pricing-section {
    padding: 8% 0;
    background-image: url("/assets/images/home/online-course.png");
    background-size: cover;
    position: relative;
}

.pricing-section:before {
    content: "";
    top: 0;
    left: 0;
    background: var(--pricing-bg);
    width: 100%;
    height: 100%;
    position: absolute;
}

.pricing-main {
    gap: 60px;
}

.pricing-title {
    width: 42%;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.pricing-title h3 {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 42px;
    line-height: normal;
    letter-spacing: 2%;
    text-align: center;
    color: var(--white-245);
    margin: 0;
}

.pricing-title p {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 0%;
    text-align: center;
    color: var(--primary-10);
}

.slider-block {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 60px;
}

.slider-icons {
    width: 100%;
}

.custom-slide {
    width: 370px;
    min-height: 501px;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid var(--secondary-1-100);
}

.slider-circle-block {
    width: 87%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.slider-circle {
    width: 7%;
}

.next-prev {
    justify-content: space-between;
    width: 7%;
}

.next-prev svg {
    cursor: pointer !important;
}

.next-prev svg:hover path {
    fill: var(--primary-50) !important;
    animation-timing-function: ease-out;
    animation-duration: 200ms;

}


.enroll-more-btn {
    gap: 10px;
    border-radius: 70px;
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 16px;
    line-height: normal;
    letter-spacing: 1px;
    color: var(--white-229);
    cursor: pointer;
    width: 163px;
    height: 47px;
    background: var(--general-btn);
    border: none;
    outline: none;
}

.enroll-more-btn:hover {
    height: 50px;
    width: 173px;
    font-size: 18px;
}

.enroll-more-btn-div {
    height: 50px;
    width: 173px;
}

.package-detail {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.package-detail .h3,
.package-detail .h4,
.package-detail .p {
    font-weight: 300;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--white-245);
}

.package-detail .h3 {
    font-family: var(--font-montserrat);
    font-size: 24px;
    margin: 0;
}

.package-detail .p {
    font-family: var(--font-inter);
    font-size: 16px;
    margin: 0;
}

.package-detail .h4 {
    font-family: var(--font-montserrat);
    font-size: 34px;
    margin: 0;
}

.slide-content {
    gap: 18px;
    display: flex;
    flex-direction: column;
    padding: 25px;
    border-radius: 16px;
    position: relative;
    z-index: 1;
    height: 100%;
    width: 100%;
}

.line {
    border-width: 0.5px;
    border-style: solid;
    box-sizing: border-box;
    border-color: var(--secondary-1-100) !important;
}

.package-include-title,
.package-include .p {
    font-weight: 300;
    line-height: normal;
    letter-spacing: 0%;

}

.package-include-title {
    font-family: var(--font-montserrat);
    font-size: 18px;
    color: var(--white-245);
}

.package-include .span {
    font-family: var(--font-inter);
    font-size: 16px;
    color: var(--primary-60);
}

.package-include img {
    margin-right: 10px;
}

.include-item {
    gap: 20px;
    margin-top: 6%;
}

.include-item:last-child .line {
    display: none;
}

.active-slide-text {
    font-family: var(--font-inter);
    position: absolute;
    top: -8%;
    color: var(--primary-10);
    font-weight: 300;
}

.slide-active {
    background: var(--pricing-slider-border);
    border-radius: 16px;
    background-clip: padding-box !important;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 15px 23px 17px;
    flex-direction: column;
}

.slide-active p {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--primary-10);
}

.slide-active-content {
    width: 370px;
    min-height: 501px;
    background: var(--primary-100);
    border-radius: 16px;
}

.carousel-item {
    width: unset !important;
    margin-right: unset;
}

.carousel-inner {
    gap: 20px !important;
}

.carousel-control-prev,
.carousel-control-next {
    position: relative !important;
    width: unset !important;
}


/* Extra Small Devices */
@media (max-width: 575px) {
    .pricing-section {
        padding: 18% 0 13%;
    }

    .pricing-title {
        width: 100%;
    }

    .pricing-title h3 {
        font-size: 22px;
        font-weight: 300;
    }

    .pricing-title p {
        font-size: 14px;
    }

    .next-prev {
        width: 65px;
    }

    .slider-circle {
        width: 45px;
    }

    .slider-circle-block {
        width: 60%;
    }

    .slider-circle-block svg {
        width: 12px;
        height: 12px;
    }

    .next-prev svg {
        width: 30px;
        height: 30px;
    }

    .custom-slide{
        display: none;
    }

    .slide-active,
    .slide-active-content{
        width: 100%;
    }

    .pricing-main{
        gap: 40px;
    }
    .enroll-more-btn,
    .enroll-more-btn-div{
        width: 100%;
    }

    .enroll-more-btn:hover{
        width: 100%;
        background: var(--general-btn-light);
        height: 47px;
    }

    .enroll-more-btn,
    .package-detail .h3{
        font-size: 18px;
        text-align: center;
    }

    .package-detail .p{
        font-size: 14px;
        text-align: center;
    }

    .slide-active{
        border-radius: 8px;
    }

    .slide-content{
        padding: 25px 11px;
    }

    .package-detail .h4{
        font-size: 22px;
        text-align: center;
    }

    .slide-active-content{
        min-height: 270px !important;
    }

    .slide-active p{
        text-align: center;
    }

    .include-item-icons-title{
        justify-content: center;
    }

}

/* Small Devices */
@media (min-width: 576px) and (max-width: 767px) {
    .pricing-section {
        padding: 10% 0 8%;
    }

    .pricing-title {
        width: 100%;
    }

    .pricing-title h3 {
        font-size: 22px;
        font-weight: 300;
    }

    .pricing-title p {
        font-size: 14px;
    }

    .next-prev {
        width: 65px;
    }

    .slider-circle {
        width: 45px;
    }

    .slider-circle-block {
        width: 78%;
    }

    .slider-circle-block svg {
        width: 12px;
        height: 12px;
    }

    .next-prev svg {
        width: 30px;
        height: 30px;
    }

    .custom-slide{
        display: none;
    }

    .slide-active,
    .slide-active-content{
        width: 100%;
    }

    .pricing-main{
        gap: 40px;
    }
    .enroll-more-btn,
    .enroll-more-btn-div{
        width: 100%;
    }

    .enroll-more-btn:hover{
        width: 100%;
        background: var(--general-btn-light);
        height: 47px;
    }

    .enroll-more-btn,
    .package-detail .h3{
        font-size: 18px;
        text-align: center;
    }

    .package-detail .p{
        font-size: 14px;
        text-align: center;
    }

    .slide-active{
        border-radius: 8px;
    }

    .slide-content{
        padding: 25px 11px;
    }

    .package-detail .h4{
        font-size: 22px;
        text-align: center;
    }

    .slide-active-content{
        min-height: 270px !important;
    }

    .slide-active p{
        text-align: center;
    }

    .include-item-icons-title{
        justify-content: center;
    }
    .w-100{
        width: 78% !important;
    }
}

/* Medium Devices */
@media (min-width: 768px) and (max-width: 991px) {
    .pricing-section {
        padding: 10% 0 8%;
    }

    .pricing-title {
        width: 100%;
    }

    .pricing-title h3 {
        font-size: 38px;
        font-weight: 300;
    }

    .pricing-title p {
        font-size: 16px;
    }

    .next-prev {
        width: 65px;
    }

    .slider-circle {
        width: 45px;
    }

    .slider-circle-block {
        width: 78%;
    }

    .slider-circle-block svg {
        width: 14px;
        height: 14px;
    }

    .next-prev svg {
        width: 34px;
        height: 34px;
    }

    .custom-slide{
        display: none;
    }

    .slide-active,
    .slide-active-content{
        width: 100%;
    }

    .pricing-main{
        gap: 35px;
    }
    .enroll-more-btn,
    .enroll-more-btn-div{
        width: 100%;
    }

    .enroll-more-btn:hover{
        width: 100%;
        background: var(--general-btn-light);
        height: 47px;
    }

    .enroll-more-btn,
    .package-detail .h3{
        font-size: 20px;
        text-align: center;
    }

    .package-detail .p{
        font-size: 16px;
        text-align: center;
    }

    .slide-active{
        border-radius: 8px;
    }

    .slide-content{
        padding: 25px 11px;
    }

    .package-detail .h4{
        font-size: 22px;
        text-align: center;
    }

    .slide-active-content{
        min-height: 270px !important;
    }

    .slide-active p{
        text-align: center;
        font-size: 18px;
    }

    .include-item-icons-title{
        justify-content: center;
    }

    .w-100{
        width: 68% !important;
    }
}

/* Large Devices */
@media (min-width: 992px) and (max-width: 1199px) {
    .w-100{
        gap:10px;
    }

    .custom-slide{
        width: 300px;
    }

    .slide-active{
        width: 337px;
    }

    .slide-active-content{
        width: 100%;
    }

    .package-detail .h4{
        font-size: 30px;
    }
}

/* Extra Large Devices */
@media (min-width: 1200px) {
    .w-100{
        gap:20px;
    }
}

/* Extra Large Devices */
@media (min-width: 1600px) {
    .custom-slide{
        width: 500px;
    }

    .slide-active{
        width:537px;
    }

    .slide-active-content{
        width: 100%;
    }

    .slide-content{
        padding: 49px;
        gap:44px;
    }
}


</style>