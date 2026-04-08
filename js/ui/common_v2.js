$(document).on("click", ".b-container", function() {
    // 같은 b-list 안의 다른 b-container radio 해제
    var $bList = $(this).closest(".b-list");
    var $bWrap = $(this).closest(".b-wrap");
    var $pagination = $bWrap.next(".pagination");

    // radio 체크
    $(this).find('input[type="radio"]').prop("checked", true);

    // 클릭한 아이템 index
    var index = $bList.find(".b-container").index(this);

    // scrollLeft - 클릭한 아이템이 보이도록
    var itemLeft = $(this).position().left;
    var currentScroll = $bWrap.scrollLeft();
    $bWrap.animate({ scrollLeft: currentScroll + itemLeft - 16 }, 300);

    // pagination active 이동
    $pagination.find(".page-index").removeClass("active");
    $pagination.find(".page-index").eq(index).addClass("active");
});

let currentPage = "gate";
let selectedPrd = null;

// ==========================================
// 페이지 이동
// ==========================================
function goPage(targetId) {
    let $current = $('#' + currentPage);
    let $target = $('#' + targetId);

    $target.show();

    gsap.to($current, {
        duration: 0.4, x: "-100%", ease: "power2.inOut",
        onComplete: function() {
            gsap.set($current, { x: "100%" });
            $current.hide();
        }
    });
    gsap.fromTo($target,
        { x: "100%" },
        { duration: 0.4, x: "0%", ease: "power2.inOut",
          onComplete: function() { onPageEnter(targetId); }
        }
    );
    currentPage = targetId;
}

function goBackToMain() {
    let $current = $('#' + currentPage);

    if (currentPage === 'chatMain') {
        gsap.set('#gate', { x: '-100%' });
        $('#gate').show();
        gsap.to($current, {
            duration: 0.4, x: '100%', ease: 'power2.inOut',
            onComplete: function() {
                $current.hide();
                gsap.set($current, { x: '0%' });
            }
        });
        gsap.to('#gate', { duration: 0.4, x: '0%', ease: 'power2.inOut' });
        currentPage = 'gate';
        return;
    }

    let $main = $('#chatMain');
    $main.show();
    gsap.set(".step01, .step02", { height: "auto", opacity: 1, overflow: "visible" });
    gsap.set(".step03, .step04", { opacity: 1 });

    gsap.to($current, {
        duration: 0.4, x: "100%", ease: "power2.inOut",
        onComplete: function() {
            gsap.set($current, { x: "100%" });
            $current.hide();
        }
    });
    gsap.fromTo($main,
        { x: "-100%" },
        { duration: 0.4, x: "0%", ease: "power2.inOut" }
    );
    currentPage = "chatMain";
}

function onPageEnter(pageId) {
    switch (pageId) {
        case "chatMain":
            initMainAnimation();
            break;
        case "chatPage":
            var $lottieBg = $("#chatPage .lottie-bg");
            $lottieBg.empty();
            lottie.loadAnimation({
                container: $lottieBg[0],
                renderer: "svg",
                loop: true,
                autoplay: true,
                animationData: bgMoving02,
                rendererSettings: { preserveAspectRatio: "xMidYMid slice" }
            });
            initChatScenario();
            break;
        case "carResearch02":
            if (selectedPrd) {
                var d = prdDetailMap[selectedPrd.name];

                // 상단 텍스트
                $("#carResearch02 .get-car-info").html(selectedPrd.desc);

                // 차량명 + 월 납입금
                $("#carResearch02 .txt01").text(selectedPrd.name);
                $("#carResearch02 .txt02").text("월 " + d.monthlyPrice + "원");

                // 차량 이미지
                $("#carResearch02 .midle-info-wrap .top .right img").attr("src", selectedPrd.img);

                // 견적 상세
                $("#carResearch02 .car-price .car-txt em").text(d.carPrice);
                $("#carResearch02 .car-use-time .car-txt em").text(d.usePeriod);
                $("#carResearch02 .car-km .car-txt em").text(d.mileage);
                $("#carResearch02 .car-worth .car-txt em").text(d.residual);
            }
            break;
    }
}

// ==========================================
// 메인 애니메이션
// ==========================================
function initMainAnimation() {
    // gsap.set("#chatMain .step01, #chatMain .step02", { height: 0, opacity: 0, overflow: "hidden" });
    // gsap.set("#chatMain .step03, #chatMain .step04", { opacity: 0 });

    let tl = gsap.timeline({ delay: 0.3 });
    tl.to("#chatMain .step01", { duration: 0.2, height: "auto", ease: "none" })
      .to("#chatMain .step01", { duration: 0.8, opacity: 1, ease: "none" })
      .to("#chatMain .step02", { duration: 0.2, height: "auto", ease: "none" }, "+=0.3")
      .to("#chatMain .step02", { duration: 0.8, opacity: 1, ease: "none" })
      .to("#chatMain .step03", { duration: 0.8, opacity: 1, ease: "none" }, "+=0.3")
      .to("#chatMain .step04", { duration: 0.8, opacity: 1, ease: "none" }, "+=0.3");
}

// ==========================================
// 채팅 진입 애니메이션
// ==========================================
function initChatAnimation() {
    let $items = $("#chatPage .chat-list > li.anim-item");
    let tl = gsap.timeline();
    $items.each(function(index) {
        let position = index === 0 ? 0 : ">";
        tl.to(this, { duration: 0.4, opacity: 1, ease: "none" }, position);
    });
}

// ==========================================
// 채팅 메시지 append
// ==========================================
function appendAiMsg(html, delay) {
    return new Promise(function(resolve) {
        setTimeout(function() {
            var $newMsg = $(html);
            $('#' + currentPage + ' .chat-list').append($newMsg);
            gsap.set($newMsg, { opacity: 0 });

            requestAnimationFrame(function() {
                scrollToLastMsg(); // 먼저 스크롤 시작
                gsap.to($newMsg, {
                    opacity: 1,
                    duration: 0.4,
                    ease: 'power2.out',
                    onComplete: resolve // 페이드인 완료 후 다음 then
                });
            });
        }, delay);
    });
}

function scrollToLastMsg() {
    var $chatWrap = $('#' + currentPage + ' .chat-wrap');
    if (!$chatWrap.length || !$chatWrap[0]) return;
    $chatWrap.animate({
        scrollTop: $chatWrap[0].scrollHeight - $chatWrap[0].clientHeight + 1000
    }, 300);
}

// ==========================================
// 로딩 말풍선
// ==========================================
var loadMsgHtml = `
    <li class="ai-msg loading-msg">
        <div class="bubble"><div class="lottie-loading"></div></div>
    </li>`;

function appendLoadingMsg() {
    return new Promise(function(resolve) {
        var $chatList = $('#' + currentPage + ' .chat-list');
        $chatList.append(loadMsgHtml);
        setTimeout(function() {
            var container = $chatList.find('.lottie-loading').last()[0];
            lottie.loadAnimation({
                container: container, renderer: "svg",
                loop: true, autoplay: true, animationData: loadJson,
            });
            scrollToLastMsg();
            resolve();
        }, 50);
    });
}

function removeLoadingMsg() {
    $(".loading-msg").remove();
}

// ==========================================
// 브릿지 모달
// ==========================================
function openBridgePage() {
    $("#bridgePage").addClass("active");
    gsap.fromTo("#bridgePage",
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: "power2.out" }
    );
}

function closeBridgePage(callback) {
    gsap.to("#bridgePage", {
        opacity: 0, duration: 0.3, ease: "power2.in",
        onComplete: function() {
            $("#bridgePage").removeClass("active");
            gsap.set("#bridgePage", { opacity: 1 });
            if (callback) callback();
        }
    });
}

let bgJsonMap = {
    bgMoving01:bgMoving01,
    bgMoving02:bgMoving02,
};

$(document).ready(function() {
    // 초기 페이지 세팅
    gsap.set('.page:not(#gate)', { x: '100%' });
    gsap.set('#gate', { x: '0%' });

    // lottie 헤더 아이콘
    if ($(".animates-star-lottie").length) {
        $(".animates-star-lottie").each(function() {
            lottie.loadAnimation({
                container: this, renderer: "svg",
                loop: true, autoplay: true, animationData: aiStartJson,
            });
        });
    }
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

    // 스크롤 감지해서 lottie 위치 보정
    $('.chat-wrap').on('scroll', function() {
        let scrollTop = $(this).scrollTop();
        let $page = $(this).closest('.page');
        let $lottie = $page.find('.lottie-bg');
        let $header = $page.find('.header');
        let chatWrapOffsetTop = $(this).position().top;

        if (scrollTop === 0) {
            $lottie.css({ transform: '', top: '' }); // 초기화
        } else {
            $lottie.css({
                'transform': 'translateY(-' + (scrollTop + chatWrapOffsetTop) + 'px)',
                'top': -chatWrapOffsetTop + 'px'
            });
        }

        if (scrollTop > 0) {
            $header.addClass('is-scrolled');
        } else {
            $header.removeClass('is-scrolled');
        }
    });

    // gate → chatMain (opacity)
    $('#gate button.open-gate').on('click', function() {
        $('#gate').hide();
        gsap.set('#chatMain', { x: '0%' });

        // show() 전에 미리 초기 상태 세팅
        gsap.set("#chatMain .step01, #chatMain .step02", { height: 0, opacity: 0, overflow: "hidden" });
        gsap.set("#chatMain .step03, #chatMain .step04", { opacity: 0 });

        $('#chatMain').css({ opacity: 0 }).show();

        gsap.to('#chatMain', {
            opacity: 1, duration: 0.6, ease: 'power2.out',
            onComplete: function() {
                currentPage = 'chatMain';
                initMainAnimation();
            }
        });
    });

    // a[href] 페이지 이동
    $(document).on("click", "a[href]", function(e) {
        let href = $(this).attr("href");
        if (!href || href === "#" || href.startsWith("http")) return;
        e.preventDefault();

        let pageMap = {
            "./ai02.html":     { pageId: "chatPage",      scenario: "carResearch" },
            "./result01.html": { pageId: "carResearch02", scenario: null },
        };
        let target = pageMap[href];
        if (!target) return;
        goPage(target.pageId);
    });

    // close 버튼
    $(document).on("click", ".close-btn-prime", function() {
        goBackToMain();
    });

    // 브릿지 모달 닫기
    $(document).on("click", "#bridgePage .close-modal", function() {
        closeBridgePage();
    });

    // css 변수
    let footerHeight = $(".footer").outerHeight(true);
    document.documentElement.style.setProperty("--footer-height", footerHeight + "px");
});

$(document).on("scroll", ".prd-list", function() {
    var $prdList   = $(this);
    var $pagination = $(this).closest(".ai-msg.has-prd-btn").find(".pagination");
    var scrollLeft  = $prdList.scrollLeft();
    var itemWidth   = $prdList.find(".prd-option").first().outerWidth(true);

    var index = Math.round(scrollLeft / itemWidth);

    $pagination.find(".page-index").removeClass("active");
    $pagination.find(".page-index").eq(index).addClass("active");
});