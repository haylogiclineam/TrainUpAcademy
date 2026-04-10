const fs = require('fs');

const armStr = fs.readFileSync('src/locales/arm.json', 'utf8');
const enStr = fs.readFileSync('src/locales/en.json', 'utf8');
const ruStr = fs.readFileSync('src/locales/ru.json', 'utf8');

const arm = JSON.parse(armStr);
const en = JSON.parse(enStr);
const ru = JSON.parse(ruStr);

const chatbot_en = {
    "greeting": "Hi there! 👋 Welcome to TrainUp Academy. How can I help you today? Choose a question below:",
    "status_online": "Online",
    "questions": [
        {
            "q": "What courses do you offer?",
            "a": "We offer a wide range of courses including Web Development, UI/UX Design, Data Science, Mobile App Development, and more. Visit our Courses page to explore the full catalog!"
        },
        {
            "q": "How do I enroll in a course?",
            "a": "To enroll, simply create an account, browse our courses, and click \"Add to Cart\" on the course you like. Complete the checkout process and you'll get instant access!"
        },
        {
            "q": "Are there any free courses?",
            "a": "Yes! We have several free introductory courses available. Check out our Courses page and filter by price to find free options."
        },
        {
            "q": "How can I become an instructor?",
            "a": "We welcome new instructors! Visit the \"Teach on TrainUp\" page to learn about the requirements and apply. Our team will review your application and get back to you."
        },
        {
            "q": "What payment methods do you accept?",
            "a": "We accept credit/debit cards and wallet balance. You can add funds to your wallet from your account dashboard."
        },
        {
            "q": "How do I contact support?",
            "a": "You can reach us via email at info@trainup.academy or call us at +374 77 198238. You can also visit our Contact page to send us a message directly."
        },
        {
            "q": "Do I get a certificate after completing a course?",
            "a": "Yes! Upon successfully completing a course and passing the quizzes, you will receive a digital certificate that you can download and share."
        }
    ]
};

const chatbot_ru = {
    "greeting": "Привет! 👋 Добро пожаловать в TrainUp Academy. Чем могу помочь сегодня? Выберите вопрос ниже:",
    "status_online": "В сети",
    "questions": [
        {
            "q": "Какие курсы вы предлагаете?",
            "a": "Мы предлагаем широкий выбор курсов, включая веб-разработку, UI/UX-дизайн, Data Science, разработку мобильных приложений и многое другое. Посетите нашу страницу Курсы, чтобы изучить весь каталог!"
        },
        {
            "q": "Как записаться на курс?",
            "a": "Чтобы записаться, просто создайте аккаунт, просмотрите наши курсы и нажмите «В корзину» на нужном курсе. Завершите процесс оформления заказа, и вы получите мгновенный доступ!"
        },
        {
            "q": "Есть ли бесплатные курсы?",
            "a": "Да! У нас есть несколько бесплатных вводных курсов. Проверьте нашу страницу Курсы и отфильтруйте по цене, чтобы найти бесплатные варианты."
        },
        {
            "q": "Как стать преподавателем?",
            "a": "Мы приветствуем новых преподавателей! Посетите страницу «Преподавать на TrainUp», чтобы узнать о требованиях и подать заявку. Наша команда рассмотрит вашу заявку и свяжется с вами."
        },
        {
            "q": "Какие способы оплаты вы принимаете?",
            "a": "Мы принимаем кредитные/дебетовые карты и баланс кошелька. Вы можете добавить средства в свой кошелек из панели управления аккаунтом."
        },
        {
            "q": "Как связаться со службой поддержки?",
            "a": "Вы можете связаться с нами по электронной почте info@trainup.academy или позвонить нам по телефону +374 77 198238. Вы также можете посетить нашу страницу Контакты, чтобы отправить нам сообщение напрямую."
        },
        {
            "q": "Получу ли я сертификат после завершения курса?",
            "a": "Да! После успешного завершения курса и прохождения тестов вы получите цифровой сертификат, который можно загрузить и поделиться."
        }
    ]
};

const chatbot_arm = {
    "greeting": "Ողջույն! 👋 Բարի գալուստ TrainUp Academy: Ինչպե՞ս կարող եմ օգնել ձեզ այսօր: Ընտրեք հետևյալ հարցերից մեկը՝",
    "status_online": "Առցանց",
    "questions": [
        {
            "q": "Ի՞նչ դասընթացներ եք առաջարկում:",
            "a": "Մենք առաջարկում ենք դասընթացների լայն տեսականի, ներառյալ վեբ ծրագրավորում, UI/UX դիզայն, տվյալների գիտություն (Data Science), բջջային հավելվածների ծրագրավորում և այլն: Այցելեք մեր Դասընթացներ էջը՝ ամբողջ կատալոգին ծանոթանալու համար:"
        },
        {
            "q": "Ինչպե՞ս գրանցվել դասընթացին:",
            "a": "Գրանցվելու համար պարզապես ստեղծեք հաշիվ, ընտրեք դասընթացը և սեղմեք «Ավելացնել զամբյուղ»: Ավարտեք վճարման գործընթացը, և դուք անմիջապես մուտք կստանաք:"
        },
        {
            "q": "Կա՞ն արդյոք անվճար դասընթացներ:",
            "a": "Այո: Մենք ունենք մի քանի անվճար ներածական դասընթացներ: Ստուգեք մեր Դասընթացներ էջը և զտեք ըստ գնի՝ անվճար տարբերակներ գտնելու համար:"
        },
        {
            "q": "Ինչպե՞ս կարող եմ դառնալ դասախոս:",
            "a": "Մենք սիրով ողջունում ենք նոր դասախոսների: Այցելեք «Դասավանդել TrainUp-ում» էջը՝ պահանջներին ծանոթանալու և դիմելու համար: Մեր թիմը կուսումնասիրի ձեր հայտը և կկապվի ձեզ հետ:"
        },
        {
            "q": "Վճարման ի՞նչ եղանակներ եք ընդունում:",
            "a": "Մենք ընդունում ենք վարկային/դեբետային քարտեր և դրամապանակի մնացորդ: Դուք կարող եք միջոցներ ավելացնել ձեր դրամապանակում ձեր հաշվի վահանակից:"
        },
        {
            "q": "Ինչպե՞ս կապվել աջակցության թիմի հետ:",
            "a": "Կարող եք կապվել մեզ հետ info@trainup.academy էլ.փոստի միջոցով կամ զանգահարել +374 77 198238 հեռախոսահամարով: Կարող եք նաև այցելել մեր Կապ էջը՝ մեզ անմիջապես հաղորդագրություն ուղարկելու համար:"
        },
        {
            "q": "Դասընթացի ավարտից հետո ստանու՞մ եմ արդյոք վկայական:",
            "a": "Այո: Դասընթացը հաջողությամբ ավարտելուց և թեստերը հանձնելուց հետո դուք կստանաք թվային վկայական, որը կարող եք ներբեռնել և կիսվել:"
        }
    ]
};

arm.chatbot = chatbot_arm;
en.chatbot = chatbot_en;
ru.chatbot = chatbot_ru;

fs.writeFileSync('src/locales/arm.json', JSON.stringify(arm, null, 4));
fs.writeFileSync('src/locales/en.json', JSON.stringify(en, null, 4));
fs.writeFileSync('src/locales/ru.json', JSON.stringify(ru, null, 4));
