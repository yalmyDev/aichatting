let currentPage = "chatMain";
let currentScenarioAnim = null;
let selectedPrd = null;

// 시나리오 데이터
let chatScenarios = {
    carResearch:{
        bgJson : "bgMoving02",
        messages:[
            {type: "user", text: "나에게 꼭 맞는 차량은?"},
            {type: "ai", text: "좋아요! 5가지 질문에 답해주시면, 꼭 맞는 차량을 찾아 드릴께요!"},
            {type: "ai", text: "주말엔 주로 어디로 떠나시나요?"},
            {type: "ai-choice", options:[
                { id: "natureOption", img: "./../images/gif/personality/5.gif", text: "자연 속 주말러" },
                { id: "cityOption",   img: "./../images/gif/personality/6.gif", text: "도심 드라이버" },
            ]},
        ]
    },
    loanSearch:{
        bgJson: "bgMoving02",
        messages: [
            { type: "user",           text: "나에게 딱맞는 금융상품 추천" },
            { type: "ai",             text: "대출상품을 찾고있으시군요!<br>관심있는 상품을 선택하시면 상세한 상품을 찾아드릴게요." },
            { type: "ai-prd-options", icon: "icon-prd-list", label: "관심있는 상품을 선택해주세요.", options: [
                { text: "개인 대출" },
                { text: "자동차 대출" },
                { text: "기업 대출" },
            ]},
        ]
    }
};

// 메시지 템플릿 생성
function buildMsgHtml(msg){
    switch (msg.type) {
        case "user":
            return `<li class="user-msg"><div class="bubble"><span>${msg.text}</span></div></li>`;
        case "ai":
            return `<li class="ai-msg"><div class="bubble"><span>${msg.text}</span></div></li>`;
        case "ai-choice":
            let options = msg.options.map(opt => `
                <li class="option" id="${opt.id}">
                    <div class="card-wrap">
                        <input type="radio" name="option1">
                        <div class="card-info">
                            <img src="${opt.img}" alt="">
                            <span>${opt.text}</span>
                        </div>
                    </div>
                </li>`).join('');
            return `<li class="ai-msg has-choice-btn"><ul class="options">${options}</ul></li>`;
        case "ai-prd-options":
            let optList = msg.options.map(opt => `
                <li class="info-btn">
                    <div class="rd-wrap">
                        <input type="radio" name="prd1">
                        <span>${opt.text}</span>
                    </div>
                </li>`).join('');
            return `
                <li class="ai-msg prd-options">
                    <p><i class="${msg.icon}"></i>${msg.label}</p>
                    <ul class="info-list">${optList}</ul>
                </li>`;
    }
}

let bgJsonMap = {
    bgMoving01:bgMoving01,
    bgMoving02:bgMoving02,
};

function loadScenario(scenarioKey){
    let scenario = chatScenarios[scenarioKey];
    if (!scenario) return;

    // 날짜 세팅
    let now = new Date();
    $("#chatPage .chat-year").text(now.getFullYear());
    $("#chatPage .chat-month").text(now.getMonth() + 1);
    $("#chatPage .chat-date").text(now.getDate());

    // 채팅 초기화
    let $chatList = $("#chatPage .chat-list");
    $chatList.empty();

    // 메시지 렌더링 (gsap 적용 위해 한 번에 DOM에 추가 후 opacity:0 세팅)
    scenario.messages.forEach(function(msg) {
        let html = buildMsgHtml(msg);
        $chatList.append(html);
    });

    // gsap 초기 opacity 0 세팅
    gsap.set("#chatPage .chat-list > li", { opacity: 0 });

    // lottie bg 교체
    let $lottieBg = $("#chatPage .lottie-bg");
    $lottieBg.empty();
    if (currentScenarioAnim) {
        currentScenarioAnim.destroy();
        currentScenarioAnim = null;
    }
    currentScenarioAnim = lottie.loadAnimation({
        container: $lottieBg[0],
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: bgJsonMap[scenario.bgJson],
        rendererSettings: { preserveAspectRatio: "xMidYMid slice" }
    });
}


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

function goPage(targetId){
    let $current = $('#' + currentPage);
    let $target  = $('#' + targetId);

    gsap.to($current, {
        duration: 0.4,
        x: "-100%",
        ease: "power2.inOut",
        onComplete: function() {
            gsap.set($current, { x: "100%" });
        }
    });
    gsap.fromTo($target,
        { x: "100%" },
        { duration: 0.4, x: "0%", ease: "power2.inOut", onComplete: function() {
            onPageEnter(targetId);
        }}
    );

    currentPage = targetId;
}

// close 버튼 - 현재 페이지 오른쪽으로, chatMain 왼쪽에서 진입
function goBackToMain() {
    let $current = $('#' + currentPage);
    let $main    = $('#chatMain');

    // chatMain을 완성된 상태로 미리 세팅
    gsap.set(".step01, .step02", { height: "auto", opacity: 1, overflow: "visible" });
    gsap.set(".step03, .step04, .step05", { opacity: 1, clipPath: "none" });

    gsap.to($current, {
        duration: 0.4,
        x: "100%",
        ease: "power2.inOut",
        onComplete: function() {
            gsap.set($current, { x: "100%" });
        }
    });
    gsap.fromTo($main,
        { x: "-100%" },
        { duration: 0.4, x: "0%", ease: "power2.inOut" }
        // onComplete에서 initMainAnimation 호출 안 함
    );

    currentPage = "chatMain";
}
function onPageEnter(pageId){
    switch (pageId) {
        case "chatMain":
            initMainAnimation();
            break;
        case "chatPage":
            initChatAnimation();
            break;
        case "carResearch02":
            if (selectedPrd) {
                $("#carResearch02 .desc01").text(selectedPrd.name);
                $("#carResearch02 .desc02").text(selectedPrd.price);
                $("#carResearch02 .desc03").html(selectedPrd.desc);
                $("#carResearch02 .prd-list-wrap .prd-img img").attr("src", selectedPrd.img);
            }
            break;
    }
}
function initMainAnimation() {
    gsap.set(".step01, .step02", { height: 0, opacity: 0, overflow: "hidden" });
    let tl = gsap.timeline({ delay: 0.3 });
    tl.to(".step01", { duration: 0.2, height: "auto", ease: "none" })
      .to(".step01", { duration: 0.8, opacity: 1, ease: "none" })
      .to(".step02", { duration: 0.2, height: "auto", ease: "none" }, "+=0.3")
      .to(".step02", { duration: 0.8, opacity: 1, ease: "none" })
      .to(".step03", { duration: 0.8, opacity: 1, ease: "none" }, "+=0.3")
      .from(".step04", { duration: 0.3, clipPath: "inset(0 0 100% 0)", ease: "none" }, "+=0.3")
      .from(".step04", { duration: 0.8, opacity: 0, ease: "none" }, "<")
      .from(".step05", { duration: 0.3, clipPath: "inset(0 0 100% 0)", ease: "none" }, "+=0.3")
      .from(".step05", { duration: 0.8, opacity: 0, ease: "none" }, "<");
}
function initChatAnimation(pageId) {
    let $items = $("#chatPage .chat-list > li");
    let durations = [0.3, 0.3, 0.6, 0.9, 1.2, 1.5];
    let tl = gsap.timeline();

    $items.each(function(index) {
        let d = durations[index] || 0.8;
        let position = (index === 1) ? "+=1.0" : ">";
        tl.to(this, { duration: d, opacity: 1, ease: "none" }, position);
    });
}

$(document).ready(function () {
    gsap.set('.page:not(#chatMain)', {x:'100%'});
    initMainAnimation();
    // what's scrolling
    // $('*').on('scroll', function(){
    //     console.log($(this).attr('class') || $(this).prop('tagName'));
    // });

    let chatMainContainer = document.querySelector("#chatMain .lottie-bg");
    if (chatMainContainer) {
        lottie.loadAnimation({
            container: chatMainContainer,
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData: bgMoving01,
            rendererSettings: { preserveAspectRatio: "xMidYMid slice" }
        });
    }
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
            "./ai02.html":     { pageId: "chatPage",      scenario: "carResearch" },
            "./ai03.html":     { pageId: "chatPage",      scenario: "loanSearch"  },
            "./result01.html": { pageId: "carResearch02", scenario: null          },
        };

        let target = pageMap[href];
        if (!target) return;

        if (target.scenario) loadScenario(target.scenario);
        goPage(target.pageId);
    });


    // close 버튼
    $(document).on("click", ".close-btn-prime", function() {
        goBackToMain();
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
