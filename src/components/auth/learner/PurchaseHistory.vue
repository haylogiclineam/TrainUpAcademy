<script setup>
import {onMounted, ref} from 'vue';

const videos = ref([
    {src: '/assets/videos/courses/course-2.mp4'},
    {src: '/assets/videos/courses/course-3.mp4'},
    {src: '/assets/videos/courses/course-4.mp4'},
    {src: '/assets/videos/courses/course-5.mp4'},
]);

const showPlayIcons = ref([]);
const videoRefs = ref([]);

onMounted(() => {
    showPlayIcons.value = videos.value.map(() => true);
});

function setVideoRef(el, index) {
    videoRefs.value[index] = el;
    if (el) {
        el.addEventListener('pause', () => {
            showPlayIcons.value[index] = true;
        });
        el.addEventListener('play', () => {
            showPlayIcons.value[index] = false;
        });
    }
}

function playVideo(index) {
    const video = videoRefs.value[index];
    if (video) video.play();
}

function getStatus(index) {
    return ['completed', 'pending', 'declined'][index % 3];
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

</script>

<template>
    <div class="my-history-section">
        <div class="container">
            <div class="my-history-main">
                <div class="d-flex justify-content-between align-items-center my-history-title-block">
                    <h3 class="text-capitalize my-history-section-title">Purchase history</h3>
                </div>
                <div class="purchase-history">
                    <div class="table-wrapper">
                        <table class="purchase-table">
                            <thead>
                            <tr>
                                <th>Product</th>
                                <th>Date</th>
                                <th>Total Amount</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(video, index) in videos" :key="index">
                                <td class="product-info">
                                    <div class="course-video-div-main d-flex">
                                        <div class="course-video-div position-relative">
                                            <div
                                                    class="position-absolute play-icon-div"
                                                    v-if="showPlayIcons[index]"
                                                    @click.stop="playVideo(index)">
                                            </div>

                                            <video
                                                    class="course-video"
                                                    :src="video.src"
                                                    controls
                                                    preload="metadata"
                                                    @click="showPlayIcons[index] = false"
                                                    :ref="el => setVideoRef(el, index)"
                                            ></video>
                                        </div>
                                    </div>
                                    <div class="course-details">
                                        <p class="course-title">Certified Cloud Practitioner CLF-C02 2025</p>
                                        <p class="course-instructor-name">Instructor: By Stephane</p>
                                    </div>
                                </td>
                                <td>10/07/2023</td>
                                <td>$1,752,585.54</td>
                                <td>
                               <span :class="['status', getStatus(index)]">
                                  <span
                                      class="dot-symbol"
                                      :class="{'status-completed-dot': getStatus(index) === 'completed'}"
                                  >●</span>
                                  {{ capitalize(getStatus(index)) }}
                                </span>
                                </td>
                                <td>
                                    <button class="invoice-btn">Invoice</button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="mobile-wrapper">
                        <div
                            class="mobile-card"
                            v-for="(video, index) in videos"
                            :key="index">
                            <div class="mobile-row">
                                <p class="mobile-label">Product</p>
                                <hr>
                                <div class="product-info gap-2">
                                    <div class="course-video-div-main d-flex">
                                        <div class="course-video-div position-relative">
                                            <div
                                                class="position-absolute play-icon-div"
                                                v-if="showPlayIcons[index]"
                                                @click.stop="playVideo(index)">
                                            </div>

                                            <video
                                                class="course-video"
                                                :src="video.src"
                                                controls
                                                preload="metadata"
                                                @click="showPlayIcons[index] = false"
                                                :ref="el => setVideoRef(el, index)"
                                            ></video>
                                        </div>
                                    </div>
                                    <div>
                                        <p class="course-title">Certified Cloud Practitioner CLF-C02 2025</p>
                                        <p class="course-instructor-name">Instructor: By Stephane</p>
                                    </div>
                                </div>
                                <hr>
                            </div>

                            <div class="mobile-row">
                                <p class="mobile-label">Date</p>
                                <hr>
                                <p class="mobile-label-content">10/07/2023</p>
                            </div>
                            <hr>

                            <div class="mobile-row">
                                <p class="mobile-label">Total Amount</p>
                                <hr>
                                <p class="mobile-label-content">$1,752,585.54</p>
                            </div>
                            <hr>

                            <div class="mobile-row">
                                <p class="mobile-label">Status</p>
                                <hr>
                                <p class="mobile-label-content">
                                <span :class="['status', getStatus(index)]" >
                                  <span
                                      class="dot-symbol"
                                      :class="{'status-completed-dot': getStatus(index) === 'completed'}"
                                  >●</span>
                                  {{ capitalize(getStatus(index)) }}
                                </span>
                                </p>
                            </div>
                            <hr>

                            <div class="mobile-row no-border">
                                <button class="invoice-btn">Invoice</button>
                            </div>
                            <hr>
                        </div>
                    </div>

                </div>
                <nav>
                    <ul class="pagination d-flex justify-content-center mt-0">
                        <li class="page-item page-item-btn page-link-disabled">
                            <a class="page-link" href="#" tabindex="-1" aria-disabled="true">
                                <svg width="9" height="19" viewBox="0 0 9 19" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.62887 0.394604C8.74647 0.520754 8.83981 0.670837 8.90351 0.836199C8.96721 1.00156 9 1.17893 9 1.35807C9 1.5372 8.96721 1.71457 8.90351 1.87993C8.83981 2.04529 8.74647 2.19538 8.62887 2.32153L2.88245 8.53654C2.76485 8.66269 2.67151 8.81277 2.60781 8.97813C2.54411 9.1435 2.51131 9.32086 2.51131 9.5C2.51131 9.67914 2.54411 9.85651 2.60781 10.0219C2.67151 10.1872 2.76485 10.3373 2.88245 10.4635L8.62887 16.6785C8.74647 16.8046 8.83981 16.9547 8.90351 17.1201C8.96721 17.2854 9 17.4628 9 17.6419C9 17.8211 8.96721 17.9984 8.90351 18.1638C8.83981 18.3292 8.74647 18.4792 8.62887 18.6054C8.39379 18.8581 8.07579 19 7.74432 19C7.41285 19 7.09485 18.8581 6.85977 18.6054L1.1008 12.3768C0.395924 11.6135 0 10.5788 0 9.5C0 8.42119 0.395924 7.38649 1.1008 6.62318L6.85977 0.394604C7.09485 0.141865 7.41285 0 7.74432 0C8.07579 0 8.39379 0.141865 8.62887 0.394604Z"
                                          fill="#C2C2C2"/>
                                </svg>
                            </a>
                        </li>
                        <li>
                            <ul class="list-unstyled d-flex pagination-numbers">
                                <li class="page-item active"><a class="page-link" href="#">1</a></li>
                                <li class="page-item"><a class="page-link" href="#">2</a></li>
                                <li class="page-item"><a class="page-link" href="#">3</a></li>
                                <li class="page-item"><a class="page-link" href="#">4</a></li>
                                <li class="page-item"><a class="page-link" href="#">5</a></li>
                            </ul>

                        </li>

                        <li class="page-item page-item-btn page-link-active">
                            <a class="page-link" href="#">
                                <svg width="9" height="19" viewBox="0 0 9 19" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.371131 0.394604C0.253532 0.520754 0.160191 0.670837 0.0964931 0.836199C0.0327948 1.00156 0 1.17893 0 1.35807C0 1.5372 0.0327948 1.71457 0.0964931 1.87993C0.160191 2.04529 0.253532 2.19538 0.371131 2.32153L6.11755 8.53654C6.23515 8.66269 6.32849 8.81277 6.39219 8.97813C6.45589 9.1435 6.48869 9.32086 6.48869 9.5C6.48869 9.67914 6.45589 9.85651 6.39219 10.0219C6.32849 10.1872 6.23515 10.3373 6.11755 10.4635L0.371131 16.6785C0.253532 16.8046 0.160191 16.9547 0.0964931 17.1201C0.0327948 17.2854 0 17.4628 0 17.6419C0 17.8211 0.0327948 17.9984 0.0964931 18.1638C0.160191 18.3292 0.253532 18.4792 0.371131 18.6054C0.606211 18.8581 0.924211 19 1.25568 19C1.58715 19 1.90515 18.8581 2.14023 18.6054L7.8992 12.3768C8.60408 11.6135 9 10.5788 9 9.5C9 8.42119 8.60408 7.38649 7.8992 6.62318L2.14023 0.394604C1.90515 0.141865 1.58715 0 1.25568 0C0.924211 0 0.606211 0.141865 0.371131 0.394604Z"
                                          fill="#AEAEAE"/>
                                </svg>
                            </a>
                        </li>
                    </ul>
                </nav>

                <div class="d-flex align-items-center empty-my-cart-block gap-3">
                    <div class="not-exist-items">
                        <p class="mb-0">
                            You don't have any course purchases.
                        </p>
                    </div>
                    <div class="my-course-btn-div d-flex justify-content-center align-items-center">
                        <router-link>
                            <button class="my-course-btn">
                                Courses
                            </button>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.my-history-section {
    padding: 8% 0;
}

.my-history-section-title {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 42px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--primary-100);
}

.my-history-main {
    display: flex;
    flex-direction: column;
    gap: 60px;
}

.my-course-btn {
    gap: 10px;
    border-radius: 70px;
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 16px;
    line-height: normal;
    letter-spacing: 1px;
    color: var(--white-229);
    cursor: pointer;
    background: var(--general-btn);
    outline: none;
    border: none;
    text-transform: capitalize;
}

.my-course-btn {
    width: 176px;
    height: 53px;
}

.my-course-btn-div {
    height: 56px;
    width: 186px;
}

.not-exist-items p {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 20px;
    line-height: normal;
    letter-spacing: 0%;
}

.not-exist-items {
    width: 100%;
    display: flex;
    align-items: center;
}

.not-exist-items p {
    color: var(--primary-90);
}

.table-wrapper {
    overflow-x: auto;
}

.purchase-table {
    width: 100%;
    border-collapse: collapse;
}

.purchase-table th {
    padding:  1rem;
    text-align: left;
    border-bottom: 1px solid var(--primary-10);
    vertical-align: middle;
    font-family: var(--font-montserrat);
    font-weight:500;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 0%;
    color:var(--primary-90);
}

.purchase-table td {
    padding: 1rem;
    text-align: left;
    border-bottom: none;
    vertical-align: middle;
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 16px;
    line-height: normal;
    letter-spacing: 0%;
    color:var(--primary-100);
}

.product-info {
    display: flex;
    align-items: start !important;
}

.status {
    padding: 0.3rem 0.7rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 400;
    display: flex;
    align-items: center;
    gap: 4px;
    width: fit-content;
}

.status.completed {
    background-color: var(--status-completed-bg);
    color: var(--status-completed-text);
}

.status-completed-dot{
    color: var(--status-completed-dot);
}

.status.pending {
    background-color: var(--status-pending-bg);
    color: var(--status-pending-text);
}

.status.declined {
    background-color: var(--status-declined-bg);
    color: var(--status-declined-text);
}

.invoice-btn {
    background: var(--invoice-btn);
    border: none;
    padding: 0.6rem 2rem;
    cursor: pointer;
    font-family:var(--font-montserrat);
    font-weight: 500;
    font-size: 16px;
    line-height: normal;
    letter-spacing: 0%;
    text-align: center;
    color:var(--white-245);
    border-radius: 3px;

}

.mobile-wrapper {
    display: none;
}

.dot-symbol {
    font-size: 12px;
}

.course-video-div {
    width: 95%;
    height: 90px;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
}

.course-video-div-main {
    min-height:90px;
    border-radius: 16px;
    flex: 1 1 calc(30% - 10px);
    max-width: calc(30% - 10px);
    width: 100%;
}

.course-video-div:before {
    content: "";
    background: var(--single-course-item);
    width: 100%;
    height: 100%;
    position: absolute;
}

.course-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.play-icon-div {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    cursor: pointer;
}

.course-title,
.course-instructor-name{
    font-family: var(--font-montserrat);
    line-height: normal;
    letter-spacing: 2%;
    color:var(--primary-100);
}

.course-title{
    font-weight: 600;
    font-size: 14px;
}

.course-instructor-name{
    font-weight: 400;
    font-size: 12px;
}

.course-details{
    width: 43%;
}


.my-course-btn:hover {
    height: 56px;
    width: 186px;
    font-size: 18px;
}

@media (max-width: 575px) {
    .my-history-main {
        gap: 60px;
    }

    .my-history-title-block {
        flex-direction: column;
        gap: 30px;
    }

    .my-history-section-title {
        font-size: 22px;
        font-weight: 300;
    }

    .table-wrapper {
        display: none;
    }

    .mobile-wrapper {
        display: flex;
        flex-direction: column;
    }

    .mobile-card {
        display: flex;
        flex-direction: column;
    }

    .mobile-row.no-border {
        border-bottom: none;
    }

    .mobile-label {
        font-weight: 600;
        font-size: 18px;
        color: var(--primary-90);
        margin-bottom: 6px;
        font-family: var(--font-montserrat);
    }

    .product-info {
        display: flex;
        align-items: center;
    }

    .course-video-div {
        width: 100%;
        height: 90px;
    }

    .course-video-div-main {
        min-height: 90px;
        flex: 1 1 70%;
        max-width: 70%;
    }

    .mobile-label-content,
    .status{
        font-family: var(--font-montserrat);
        font-weight: 300;
        font-size: 16px;
        line-height: normal;
        letter-spacing: 0%;
        color:var(--primary-100);
        margin-bottom: 0;
    }

    .empty-my-cart-block {
        flex-direction: column;
    }

    .not-exist-items {
        justify-content: center;
    }

    .not-exist-items p {
        font-size: 18px;
        text-align: center;
    }

    .my-course-btn-div {
        width: 190px;
        height: 50px;
    }

    .my-course-btn:hover {
        width: 179px;
        height: 47px;
        font-size: 18px;
    }

    .my-course-btn {
        width: 179px;
        height: 47px;
        font-size: 18px;
    }
}

@media (min-width: 576px) and (max-width: 767px)  {
    .my-history-main {
        gap: 60px;
    }

    .my-history-title-block {
        flex-direction: column;
        gap: 30px;
    }

    .my-history-section-title {
        font-size: 22px;
        font-weight: 300;
    }

    .table-wrapper {
        display: none;
    }

    .mobile-wrapper {
        display: flex;
        flex-direction: column;
    }

    .mobile-card {
        display: flex;
        flex-direction: column;
    }

    .mobile-row.no-border {
        border-bottom: none;
    }

    .mobile-label {
        font-weight: 600;
        font-size: 18px;
        color: var(--primary-90);
        margin-bottom: 6px;
        font-family: var(--font-montserrat);
    }

    .product-info {
        display: flex;
        align-items: start;
    }

    .course-video-div {
        width: 100%;
        height: 120px;
    }

    .course-video-div-main {
        min-height: 120px;
        flex: 1 1 50%;
        max-width: 50%;
    }

    .mobile-label-content,
    .status{
        font-family: var(--font-montserrat);
        font-weight: 300;
        font-size: 16px;
        line-height: normal;
        letter-spacing: 0%;
        color:var(--primary-100);
        margin-bottom: 0;
    }

    .empty-my-cart-block {
        flex-direction: column;
    }

    .not-exist-items {
        justify-content: center;
    }

    .not-exist-items p {
        font-size: 18px;
        text-align: center;
    }

    .my-course-btn-div {
        width: 190px;
        height: 50px;
    }

    .my-course-btn:hover {
        width: 179px;
        height: 47px;
        font-size: 18px;
    }

    .my-course-btn {
        width: 179px;
        height: 47px;
        font-size: 18px;
    }
}

@media (min-width: 768px) and (max-width: 991px)   {
    .my-history-main {
        gap: 60px;
    }

    .my-history-title-block {
        flex-direction: column;
        gap: 30px;
    }

    .my-history-section-title {
        font-size: 22px;
        font-weight: 300;
    }

    .table-wrapper {
        display: none;
    }

    .mobile-wrapper {
        display: flex;
        flex-direction: column;
    }

    .mobile-card {
        display: flex;
        flex-direction: column;
    }

    .mobile-row.no-border {
        border-bottom: none;
    }

    .mobile-label {
        font-weight: 600;
        font-size: 18px;
        color: var(--primary-90);
        margin-bottom: 6px;
        font-family: var(--font-montserrat);
    }

    .product-info {
        display: flex;
        align-items: start;
    }

    .course-video-div {
        width: 100%;
        height: 200px;
    }

    .course-video-div-main {
        min-height: 200px;
        flex: 1 1 50%;
        max-width: 50%;
    }

    .mobile-label-content,
    .status{
        font-family: var(--font-montserrat);
        font-weight: 300;
        font-size: 16px;
        line-height: normal;
        letter-spacing: 0%;
        color:var(--primary-100);
        margin-bottom: 0;
    }

    .empty-my-cart-block {
        flex-direction: column;
    }

    .not-exist-items {
        justify-content: center;
    }

    .not-exist-items p {
        font-size: 18px;
        text-align: center;
    }

    .my-course-btn-div {
        width: 190px;
        height: 50px;
    }

    .my-course-btn:hover {
        width: 179px;
        height: 47px;
        font-size: 18px;
    }

    .my-course-btn {
        width: 179px;
        height: 47px;
        font-size: 18px;
    }
}

/* Large Devices */
@media (min-width: 992px) and (max-width: 1199px) {
    .course-video-div {
        width: 100%;
        height: 120px;
    }

    .course-video-div-main {
        min-height: 120px;
        flex: 1 1 50%;
        max-width: 50%;
    }

    .product-info{
        gap:10px;
        align-items: start !important;
    }

    .purchase-table th{
        font-size: 16px;
    }

    .purchase-table td{
        font-size: 14px;
    }

    .invoice-btn {
        padding: 0.6rem 1rem;
    }
}

</style>