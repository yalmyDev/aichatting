// 채팅 메세지 어펜드
function appendAiMsg(html, delay) {
    return new Promise((resolve) => {
        setTimeout(() => {
            $(".chat-list").append(html);
            resolve();
        }, delay);
    });
}

// 채팅창 자동 스크롤 스크립트
function scrollToLastMsg() {
    let lastMsg = $('.chat-list li[class*="-msg"]:last-child');
    let inputHeight = $(".user-input-wrap").outerHeight(true);
    let scrollTarget =
        lastMsg.position().top +
        $(".chat-wrap").scrollTop() -
        $(".chat-wrap").height() +
        lastMsg.outerHeight(true) +
        inputHeight +
        16;

    $(".chat-wrap").animate({ scrollTop: scrollTarget }, 300);
}

// gsap 페이지 간 이동 애니메이션
function onPageEnter(pageId) {
    switch (pageId) {
        case "chatMain":
            initMainAnimation();
            break;
        case "carResearch01":
        case "loanSearch01":
            initChatAnimation(pageId);
            break;
    }
}

let currentPage = "chatMain";

function goPage(targetId){
    let $current = $('#' + currentPage);
    let $target = $('#' + targetId);

    if(targetId === "carResearch01" || targetId === "loanSearch01"){
        let $chatList = $("#" + targetId + " .chat-list");
        let count = parseInt($chatList.data("animate-count")) || 4;

        $chatList.find("> li").slice(0, count).each(function(){
            gsap.set(this, {opacity:0});
        });
    }
    gsap.to($current,{
        duration:0.4,
        x:"-100%",
        ease:"power2.inOut",
        onComplete:function(){
            gsap.set($current, {x:"100%"});
        }
    });
    gsap.fromTo($target,
        {x:"100%"},
        {duration:0.4, x:"0%", ease:"power2Inout", onComplete:function(){onPageEnter(targetId);}}
    );

    currentPage = targetId;
    // onPageEnter(targetId);
}
function onPageEnter(pageId){
    switch(pageId){
        case "chatMain":
            initMainAnimation();
            break;
        case "carResearch01":
        case "loanSearch01":
            initChatAnimation(pageId);
            break
    }
}
function initMainAnimation() {
    gsap.set(".step01, .step02", { height: 0, opacity: 0, overflow: "hidden" });
    // gsap.set(".step03, .step04, .step05", { opacity: 0 });

    let tl = gsap.timeline({ delay: 0.3 });

    tl.to(".step01", { duration: 0.2, height: "auto", ease: "none" })
        .to(".step01", { duration: 0.8, opacity: 1, ease: "none" })
        .to(".step02", { duration: 0.2, height: "auto", ease: "none" }, "+=0.3")
        .to(".step02", { duration: 0.8, opacity: 1, ease: "none" })
        .to(".step03", { duration: 0.8, opacity: 1, ease: "none" }, "+=0.3")
        .from(".step04",{ duration: 0.3, clipPath: "inset(0 0 100% 0)", ease: "none" },"+=0.3",)
        .from(".step04", { duration: 0.8, opacity: 0, ease: "none" }, "<")
        .from(".step05",{ duration: 0.3, clipPath: "inset(0 0 100% 0)", ease: "none" },"+=0.3",)
        .from(".step05", { duration: 0.8, opacity: 0, ease: "none" }, "<");
}
function initChatAnimation(pageId) {
    let $chatList = $("#" + pageId + " .chat-list");
    let $items = $chatList.find("> li");
    let durations = [0.3, 0.3, 0.6, 0.9, 1.2, 1.5];
    let tl = gsap.timeline();

    $items.each(function(index){
        let $item = $(this);
        let d = durations[index] || 0.8;
        let position = (index === 1) ? "+=1.0" : ">";

        tl.to($item,{
            duration:d,
            opacity:1,
            ease:'none'
        }, position);
    });
}

$(document).ready(function () {
    gsap.set('.page:not(#chatMain)', {x:'100%'});
    initMainAnimation();
    // what's scrolling
    // $('*').on('scroll', function(){
    //     console.log($(this).attr('class') || $(this).prop('tagName'));
    // });

    // 요소의 높낮이값 변수로 받아오는 스크립트
    let inputHeight = $(".user-input-wrap").outerHeight(true);
    document.documentElement.style.setProperty(
        "--ai-chat-height",
        inputHeight + "px",
    );
    let headerHeight = $(".header").outerHeight(true);
    document.documentElement.style.setProperty(
        "--header-height",
        headerHeight + "px",
    );
    let footerHeight = $(".footer").outerHeight(true);
    document.documentElement.style.setProperty(
        "--footer-height",
        footerHeight + "px",
    );

    // 화면전환 애니메이션
    $(document).on("click", "a[href]", function (e) {
        let href = $(this).attr("href");

        if (!href || href === "#" || href.startsWith("http")) return;

        e.preventDefault();

        let pageMap = {
            "./ai02.html": "carResearch01",
            "./ai03.html": "loanSearch01",
            "./result01.html": "carResearch02",
        };

        let targetId = pageMap[href];
        if (targetId) goPage(targetId);
    });

    // 채팅애니메이션
    // if ($(".chat-list").length) {
    //     let count = parseInt($(".chat-list").data("animate-count")) || 4;
    //     let delays = [500, 800, 1100, 1400, 1700];

    //     $(".chat-list > li")
    //         .slice(0, count)
    //         .each(function (index) {
    //             $(this).css("transition-delay", delays[index] + "ms");
    //             setTimeout(() => {
    //                 $(this).addClass("visible");
    //             }, delays[index]);
    //         });
    // }

    // 채팅 구현 스크립트
    $(document).on("click", ".ai-msg.has-choice-btn .option", function () {
        // 이미 선택된 radio option일 경우 return
        if ($(this).hasClass("is-selected")) return;
        // 이전 선택 초기화
        $(".ai-msg.has-choice-btn .option").removeClass("is-selected");
        $(
            ".chat-list .appended, .chat-list .refresh-btn, .chat-list .prd-options",
        ).remove();
        // 현재 선택 처리
        $(this).addClass("is-selected");
        $(this).find('input[type="radio"]').prop("checked", true);

        let optionTxt = $(this).find(".card-info span").text();
        let userMsg = `
            <li class="user-msg appended">
                <div class="bubble"><span>${optionTxt}</span></div>
            </li>
        `;
        let loadingMsg = `
            <li class="ai-msg appended">
                <div class="bubble"><span>좋은 선택이에요! 짐이 많으시니 트렁크가 넓은 SUV 위주로 살펴볼게요!</span></div>
            </li>
        `;
        let prdList = `
            <li class="ai-msg has-prd-btn appended">
                <ul class="prd-list">
                    <li class="prd-option">
                        <input type="radio" name="prd01">
                        <div class="prd-card">
                            <img src="./../images/prd/palisade_v2.png" alt="">
                            <div class="txt-wrap">
                                <span class="txt1">준대형 SUV로 차박, 큰짐 운반에 최적</span>
                                <span class="txt2">현대 팰리세이드</span>
                                <span class="txt3">5,000만원</span>
                            </div>
                        </div>
                    </li>
                    <li class="prd-option">
                        <input type="radio" name="prd01">
                        <div class="prd-card">
                            <img src="./../images/prd/sorento.png" alt="">
                            <div class="txt-wrap">
                                <span class="txt1">중형 SUV로 가족 캠핑에 적합</span>
                                <span class="txt2">기아 쏘렌토</span>
                                <span class="txt3">3,600만원</span>
                            </div>
                        </div>
                    </li>
                    <li class="prd-option">
                        <input type="radio" name="prd01">
                        <div class="prd-card">
                            <img src="./../images/prd/volvo.png" alt="">
                            <div class="txt-wrap">
                                <span class="txt1">북유럽감성, 럭셔리 수입SUV</span>
                                <span class="txt2">볼보 XC90</span>
                                <span class="txt3">1억 1,000만원</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </li>
        `;
        let choicemsg = `
            <li class="ai-msg appended">
                <div class="bubble"><span>당신의 마음에 드는 차를 하나만 선택해보세요.</span></div>
            </li>
        `;
        let refreshMsg = `
            <li class="ai-msg refresh-btn">
                <button type="button">
                    <i class="ai-icon"></i>
                    <span>새로 추천받기</span>
                </button>
            </li>
        `;

        $(".chat-list").append(userMsg);
        scrollToLastMsg();
        appendAiMsg(loadingMsg, 1000)
            .then(() => appendAiMsg(prdList, 1000))
            .then(() => appendAiMsg(choicemsg, 300))
            .then(() => appendAiMsg(refreshMsg, 300))
            .then(() => scrollToLastMsg());
    });
    $(document).on("click", ".ai-msg.has-prd-btn .prd-option", function () {
        if ($(this).hasClass("is-selected")) return;

        $(".ai-msg.has-prd-btn .prd-option").removeClass("is-selected");
        // $('.chat-list .reminder, .chat-list .refresh-btn, .chat-list .prd-options').remove();
        $(".ai-msg.has-prd-btn").nextAll().remove();

        // 현재 선택 처리
        $(this).addClass("is-selected");
        $(this).find('input[type="radio"]').prop("checked", true);

        let prdTxt = $(this).find(".txt-wrap .txt2").text();
        let userMsg = `
            <li class="user-msg appended">
                <div class="bubble"><span>${prdTxt}</span></div>
            </li>
        `;

        let gotPrdName = `
            <li class="ai-msg reminder appended">
                <div class="bubble"><span>아주 좋은 선택이에요.<br>
                대형 짐과 차박, 가족 여행에 최적인 현대 펠리세이드를 고르셨네요.</span></div>
            </li>
        `;
        let infoTxt = `
            <li class="ai-msg prd-options">
                <p><i class="icon-bubble"></i>관심있는 차량 정보를 선택해주세요.</p>
                <ul class="info-list">
                    <li class="info-btn">
                        <div class="rd-wrap">
                            <a href="./result01.html">
                                <span>차량 견적보기</span>
                            </a>
                        </div>
                    </li>
                    <li class="info-btn">
                        <div class="rd-wrap">
                            <a href="#">
                                <span>신차 할부</span>
                            </a>
                        </div>
                    </li>
                    <li class="info-btn">
                        <div class="rd-wrap">
                            <a href="#">
                                <span>신차 리스</span>
                            </a>
                        </div>
                    </li>
                    <li class="info-btn">
                        <div class="rd-wrap">
                            <a href="#">
                                <span>장기렌터가</span>
                            </a>
                        </div>
                    </li>
                </ul>
            </li>
        `;

        $(".chat-list").append(userMsg);
        scrollToLastMsg();
        appendAiMsg(gotPrdName, 300)
            .then(() => appendAiMsg(infoTxt, 500))
            .then(() => scrollToLastMsg());

        // 가로 스크롤
        let $prdList = $(this).closest(".prd-list");
        let itemLeft = $(this).position().left;
        let currentScroll = $prdList.scrollLeft();

        $prdList.animate(
            {
                scrollLeft: currentScroll + itemLeft - 32,
            },
            300,
        );
    });
    $(document).on("click", ".ai-msg.prd-options .info-btn", function () {
        // 이미 선택된 radio option일 경우 return
        if ($(this).hasClass("is-selected")) return;

        let $currentPrdOptions = $(this).closest(".ai-msg.prd-options");

        // 이전 선택 초기화
        $(".ai-msg.prd-options .info-btn").removeClass("is-selected");
        // $('.chat-list .appended, .ai-msg.prd-options').remove();
        $currentPrdOptions.nextAll().remove();
        // 현재 선택 처리
        $(this).addClass("is-selected");
        $(this).find('input[type="radio"]').prop("checked", true);

        let choicedTxt = $(this).find(".rd-wrap span").text();
        let userMsg = `
            <li class="user-msg appended">
                <div class="bubble">
                    <span>${choicedTxt}</span>
                </div>
            </li>
        `;

        let nextAiMsg = `
            <li class="ai-msg">
                <div class="bubble">
                    <span>자동차 대출에 대해서 궁금하신가요? 쉽게 알려드릴게요.</span>
                </div>
            </li>
        `;
        let loanInfoMsg = `
            <li class="ai-msg prd-options">
                <p><i class="icon-money-pocket"></i>어떤 대출이 필요하신가요?</p>
                <ul class="info-list">
                    <li class="info-btn">
                        <div class="rd-wrap">
                            <input type="radio" name="prd2">
                            <span>신차 할부</span>
                        </div>
                    </li>
                    <li class="info-btn">
                        <div class="rd-wrap">
                            <input type="radio" name="prd2">
                            <span>신차 리스</span>
                        </div>
                    </li>
                    <li class="info-btn">
                        <div class="rd-wrap">
                            <input type="radio" name="prd2">
                            <span>장기렌트카</span>
                        </div>
                    </li>
                </ul>
            </li>
        `;

        $(".chat-list").append(userMsg);
        scrollToLastMsg();
        appendAiMsg(nextAiMsg, 1000)
            .then(() => appendAiMsg(loanInfoMsg, 300))
            .then(() => scrollToLastMsg());
    });

    // json 이미지 로딩
    // header icon
    if ($(".animates-star-lottie").length) {
        $(".animates-star-lottie").each(function(){
            lottie.loadAnimation({
                container: this,
                renderer: "svg",
                loop: true,
                autoplay: true,
                animationData: aiStartJson,
            });
        });
    }

    // bg-animation
    let bgJsonMap = {
        bgMoving01: bgMoving01,
        bgMoving02: bgMoving02,
    };

    if ($('.lottie-bg').length) {
        $('.lottie-bg').each(function(){
            let jsonKey = $(this).data("bg-json");
            let jsonData = bgJsonMap[jsonKey];

            if (jsonData) {
                const anim = lottie.loadAnimation({
                    container: this,
                    renderer: "svg",
                    loop: true,
                    autoplay: true,
                    animationData: jsonData,
                    rendererSettings: {
                        preserveAspectRatio: "xMidYMid slice"
                    }
                });

                const container = this;
                anim.addEventListener('DOMLoaded', function() {
                    const svg = container.querySelector('svg');
                    if (svg) {
                        // clip-path 무력화
                        container.querySelectorAll('[clip-path]').forEach(el => {
                            el.removeAttribute('clip-path');
                        });
                        container.querySelectorAll('clipPath').forEach(el => el.remove());

                        // viewBox 조정
                        svg.setAttribute('viewBox', '100 -50 300 800');
                        svg.style.width = '100%';
                        svg.style.height = '100%';
                    }
                });
            }
        });
    }

    // 차량 캐로셀
    let $ul = $(".prd-list-wrap ul");
    let $items = $(".prd-list-wrap ul li");
    let totalItems = $items.length;
    let currentIndex = 1;

    function updateCarousel() {
        let ulWidth = $ul.width();
        let itemWidth = $items.eq(0).outerWidth(true);
        let centerOffset = ulWidth / 2 - itemWidth / 2;

        $items.each(function (index) {
            let diff = index - currentIndex;
            let translateX = centerOffset + diff * (itemWidth + 8);

            $(this).css({
                transform: `translateX(${translateX}px)`,
                opacity: index === currentIndex ? 1 : 0.5,
                cursor: index === currentIndex ? "default" : "pointer",
                position: "absolute",
            });
            $(this)
                .find(".desc-wrap")
                .css({
                    opacity: index === currentIndex ? 1 : 0,
                    transition: "opacity 0.4s ease",
                });
        });
    }

    let maxHeight = 0;
    $items.each(function () {
        if ($(this).outerHeight(true) > maxHeight) {
            maxHeight = $(this).outerHeight(true);
        }
    });
    $ul.css({ position: "relative", height: maxHeight + 40 + "px" });
    updateCarousel();

    // 선택한 차량의 모델정보 가져오기
    let prdData = {
        prdPalisade: {
            desc01: "현대 팰리세이드",
            desc02: "45,000,000원",
            desc03: "합리적인 가격과 높은 안전성의<br>팰리세이드와 함께하세요.",
        },
        prdTesla: {
            desc01: "테슬라 모델 3",
            desc02: "50,000,000원",
            desc03: "글로벌 인기 모델<br>테슬라 모델 3와 함께하세요.",
        },
        prdKia: {
            desc01: "기아 EV6",
            desc02: "47,000,000원",
            desc03: "세련된 디자인과 안정적인<br>기아 EV6와 함께하세요.",
        },
    };

    function updateDesc(id) {
        let data = prdData[id];
        if (!data) return;
        $(".desc-txt-wrap .desc-wrap .desc01").html(data.desc01);
        $(".desc-txt-wrap .desc-wrap .desc02").html(data.desc02);
        $(".desc-txt-wrap .desc-wrap .desc03").html(data.desc03);
    }
    updateDesc($items.eq(currentIndex).attr("id"));

    $(document).on("click", ".prd-list-wrap ul li", function () {
        const clickedIndex = $items.index(this);
        if (clickedIndex === currentIndex) return;
        currentIndex = clickedIndex;
        updateCarousel();
        updateDesc($(this).attr("id"));
    });

    // 스크롤 감지해서 lottie 위치 보정
    $('.chat-wrap').on('scroll', function() {
        let scrollTop = $(this).scrollTop();
        let $page = $(this).closest('.page');
        let $lottie = $page.find('.lottie-bg');
        let $header = $page.find('.header');
        let headerHeight = $header.outerHeight(true);


    console.log('scrollTop:', scrollTop);
    console.log('lottie:', $(this).closest('.page').find('.lottie-bg').length);

        // page 안에서 chat-wrap이 시작하는 오프셋 계산
        let chatWrapOffsetTop = $(this).position().top;

        // lottie를 chat-wrap 스크롤 위치 + chat-wrap 시작점 기준으로 이동
        $lottie.css({
            'transform': 'translateY(-' + (scrollTop + chatWrapOffsetTop) + 'px)',
            'top': -chatWrapOffsetTop + 'px'
        });

        if (scrollTop > 0) {
            $header.addClass('is-scrolled');
        } else {
            $header.removeClass('is-scrolled');
        }
    });
});
