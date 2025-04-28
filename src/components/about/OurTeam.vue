<script setup>

</script>

<template>
    <div class="team-section">
        <div class="container">
            <div class="d-flex flex-column justify-content-center align-items-center position-relative team-main">
                <div class="team-title">
                    <h3 class="text-capitalize">Our Expert Team</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper
                        mattis, pulvinar</p>
                </div>
                <div class="team-block d-flex justify-content-center align-items-center flex-wrap">
                    <div class="team-item">
                        <div class="team-member">
                            <img src="/assets/images/team/team-member-1.png" alt="team-member-1.png">
                        </div>
                        <div class="team-member-info">
                            <p class="text-capitalize">Lorem Ipsum</p>
                            <span class="text-capitalize">QA Engineer</span>
                        </div>
                    </div>
                    <div class="team-item">
                        <div class="team-member">
                            <img src="/assets/images/team/team-member-2.png" alt="team-member-2.png">
                        </div>
                        <div class="team-member-info">
                            <p class="text-capitalize">Lorem Ipsum</p>
                            <span class="text-capitalize">QA Engineer</span>
                        </div>
                    </div>
                    <div class="team-item">
                        <div class="team-member">
                            <img src="/assets/images/team/team-member-3.png" alt="team-member-3.png">
                        </div>
                        <div class="team-member-info">
                            <p class="text-capitalize">Lorem Ipsum</p>
                            <span class="text-capitalize">QA Engineer</span>
                        </div>
                    </div>
                    <div class="team-item">
                        <div class="team-member">
                            <img src="/assets/images/team/team-member-4.png" alt="team-member-4.png">
                        </div>
                        <div class="team-member-info">
                            <p class="text-capitalize">Lorem Ipsum</p>
                            <span class="text-capitalize">QA Engineer</span>
                        </div>
                    </div>
                    <div class="team-item">
                        <div class="team-member">
                            <img src="/assets/images/team/team-member-4.png" alt="team-member-4.png">
                        </div>
                        <div class="team-member-info">
                            <p class="text-capitalize">Lorem Ipsum</p>
                            <span class="text-capitalize">QA Engineer</span>
                        </div>
                    </div>
                    <div class="team-item">
                        <div class="team-member">
                            <img src="/assets/images/team/team-member-5.png" alt="team-member-5.png">
                        </div>
                        <div class="team-member-info">
                            <p class="text-capitalize">Lorem Ipsum</p>
                            <span class="text-capitalize">QA Engineer</span>
                        </div>
                    </div>
                    <div class="team-item">
                        <div class="team-member">
                            <img src="/assets/images/team/team-member-6.png" alt="team-member-6.png">
                        </div>
                        <div class="team-member-info">
                            <p class="text-capitalize">Lorem Ipsum</p>
                            <span class="text-capitalize">QA Engineer</span>
                        </div>
                    </div>
                    <div class="team-item">
                        <div class="team-member">
                            <img src="/assets/images/team/team-member-7.png" alt="team-member-7.png">
                        </div>
                        <div class="team-member-info">
                            <p class="text-capitalize">Lorem Ipsum</p>
                            <span class="text-capitalize">QA Engineer</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped>
.team-section {
    padding: 8% 0;
    background-image: url("/assets/images/home/online-course.png");
    background-size: cover;
    position: relative;
}

.team-section:before {
    content: "";
    top: 0;
    left: 0;
    background: var(--about-team-bg);
    width: 100%;
    height: 100%;
    position: absolute;
}

.team-block {
    gap: 60px;
}

.team-main {
    gap: 60px;
}

.team-title {
    width: 42%;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.team-title h3 {
    font-family: var(--font-montserrat);
    font-weight: 500;
    font-size: 42px;
    line-height: normal;
    letter-spacing: 2%;
    text-align: center;
    color: var(--white-245);
    margin: 0;
}

.team-title p {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 0%;
    text-align: center;
    color: var(--primary-10);
}

.team-item {
    width: 254px;
    min-height: 237px;
    gap: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.team-member {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    overflow: hidden;
}

.team-member img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.team-member-info {
    border-radius: 16px;
    background: var(--general-btn);
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    gap: 4px;
}

.team-member-info p,
.team-member-info span {
    font-family: var(--font-montserrat);
    font-weight: 300;
    line-height: 100%;
    letter-spacing: 0%;
    color: var(--white-245);
    text-align: center;
}

.team-member-info p {
    font-size: 20px;
    margin: 0;
}

.team-member-info span {
    font-size: 16px;
}

@media (max-width: 575px) {
    .team-section {
        padding: 18% 0 13%;
        background-position: center;
    }

    .team-title {
        width: 100%;
    }

    .team-title h3 {
        font-size: 22px;
        font-weight: 300;
    }

    .team-title p {
        font-size: 14px;
    }

    .team-block{
        gap:30px;
    }

    .team-item{
        width: 147px;
        min-height: 146px;
    }

    .team-member {
        width: 80px;
        height: 80px;
    }

    .team-member-info{
        border-radius: 8px;
    }

    .team-member-info p {
        font-size: 14px;
        margin: 0;
    }

    .team-member-info span {
        font-size: 12px;
    }

    .team-main {
        gap: 30px;
    }
}

/* Small Devices */
@media (min-width: 576px) and (max-width: 767px) {
    .team-section {
        padding: 18% 0 13%;
        background-position: center;
    }

    .team-title {
        width: 100%;
    }

    .team-title h3 {
        font-size: 22px;
        font-weight: 300;
    }

    .team-title p {
        font-size: 14px;
    }

    .team-block{
        gap:30px;
    }

    .team-item{
        width: 147px;
        min-height: 146px;
    }

    .team-member {
        width: 80px;
        height: 80px;
    }

    .team-member-info{
        border-radius: 8px;
    }

    .team-member-info p {
        font-size: 14px;
        margin: 0;
    }

    .team-member-info span {
        font-size: 12px;
    }

    .team-main {
        gap: 30px;
    }
}


/* Medium Devices */
@media (min-width: 768px) and (max-width: 991px) {
    .team-section {
        padding: 10% 0 13%;
        background-position: center;
    }

    .team-title {
        width: 100%;
    }

    .team-title h3 {
        font-size: 38px;
        font-weight: 300;
    }

    .team-title p {
        font-size: 16px;
    }

    .team-block{
        gap:30px;
    }

    .team-item{
        width: 147px;
        min-height: 146px;
    }

    .team-member {
        width: 80px;
        height: 80px;
    }

    .team-member-info{
        border-radius: 8px;
    }

    .team-member-info p {
        font-size: 14px;
        margin: 0;
    }

    .team-member-info span {
        font-size: 12px;
    }

    .team-main {
        gap: 30px;
    }
}

/* Large Devices */
@media (min-width: 992px) and (max-width: 1199px) {
   .team-title{
       width: 80%;
   }
}


</style>