// ==========================================
// 시나리오 데이터
// ==========================================
var prdDetailMap = {
    "현대 팰리세이드": {
        price: "45,000,000원",
        desc:  "준대형 SUV로 차박, 큰짐 운반에 최적화된 현대 팰리세이드와 함께하세요.",
        tags:  ["대형SUV", "차박", "가족"],
        img:   "./../images/prd/palisade_v2.png",
        // 견적 페이지용
        monthlyPrice: "658,938",
        carPrice:     "49,678,793",
        usePeriod:    "48",
        mileage:      "20,000",
        residual:     "14,904,000",
    },
    "기아 쏘렌토": {
        price: "36,000,000원",
        desc:  "중형 SUV로 가족과 함께하는 모든 순간을 위한 기아 쏘렌토와 함께하세요.",
        tags:  ["중형SUV", "가족", "캠핑"],
        img:   "./../images/prd/sorento.png",
        monthlyPrice: "520,000",
        carPrice:     "36,000,000",
        usePeriod:    "48",
        mileage:      "20,000",
        residual:     "10,800,000",
    },
    "테슬라 model 3": {
        price: "50,000,000원",
        desc:  "뛰어난 가속력, 긴 주행 가능 거리 테슬라 model 3와 함께하세요.",
        tags:  ["전기차", "스포티", "장거리"],
        img:   "./../images/prd/teslamodel3.png",
        monthlyPrice: "780,000",
        carPrice:     "50,000,000",
        usePeriod:    "48",
        mileage:      "20,000",
        residual:     "15,000,000",
    },
};
var chatScenario = {
    intro: [
        { type: "user", text: "나에게 꼭 맞는 차량은?" },
        { type: "ai",   text: "좋아요! 5가지 질문에 답해주시면, 꼭 맞는 차량을 찾아 드릴께요!" },
    ],
    questions: [
        {
            aiText: "당신의 성향을 한마디로 표현한다면 어디에 가까운가요?",
            name: "persona01",
            options: [
                { img: "1.gif",  tit: "탐험가 DNA",    txt: "새로운 길을 개척하는게 내스타일!" },
                { img: "2.gif",  tit: "감각주의자",      txt: "남들과 다른 무드를 원해요!" },
                { img: "3.gif",  tit: "전략 설계자",     txt: "모든 선택엔 이유가 있어야죠." },
                { img: "4.gif",  tit: "에너지 드라이버", txt: "속도감과 액션이 나를 움직여요." },
            ]
        },
        {
            aiText: "당신의 일상은 어떤가요?",
            name: "persona02",
            options: [
                { img: "5.gif",  tit: "자연 속 주말러",    txt: "" },
                { img: "6.gif",  tit: "도심트렌더",         txt: "" },
                { img: "7.gif",  tit: "근거리 루틴러",      txt: "" },
                { img: "8.gif",  tit: "장거리 네비게이터",  txt: "" },
            ]
        },
        {
            aiText: "오늘 기분은 어떤 색깔에 가까운가요?",
            name: "persona03",
            options: [
                { img: "11.gif", tit: "그린 브리즈",   txt: "힐링되는 친환경차가 좋아요." },
                { img: "9.gif",  tit: "레드 스파크",   txt: "강렬한 스포티한 차가 끌려요." },
                { img: "10.gif", tit: "블루 밸런스",   txt: "조용함과 편안함이 우선이예요." },
                { img: "12.gif", tit: "옐로우 바이브", txt: "밝고 긍정적인 에너지를 느끼고 싶어요." },
            ]
        },
        {
            aiText: "미래에 당신의 차량이 어떤 역할을 해주길 바라나요?",
            name: "persona04",
            options: [
                { img: "13.gif", tit: "내 손안의 비서", txt: "" },
                { img: "14.gif", tit: "즉각 반응 머신", txt: "" },
                { img: "15.gif", tit: "든든한 보호자",  txt: "" },
                { img: "16.gif", tit: "가성비 마스터",  txt: "" },
            ]
        },
        {
            aiText: "이제 마지막 질문이예요! 당신에게 자동차는 어떤 의미인가요?",
            name: "persona05",
            options: [
                { img: "17.gif", tit: "가족의 안식처",  txt: "" },
                { img: "18.gif", tit: "비즈니스 파트너", txt: "" },
                { img: "19.gif", tit: "내 삶의 아이콘",  txt: "" },
                { img: "20.gif", tit: "실속 있는 자산",  txt: "" },
            ]
        },
    ]
};

var currentQuestionIndex = 0;

// ==========================================
// 템플릿 빌더
// ==========================================
function buildBWrap(q) {
    var items = q.options.map(function(opt) {
        return `
            <li class="b-container">
                <input type="radio" class="persona" name="${q.name}">
                <div class="img-wrap">
                    <img src="./../images/gif/personality/${opt.img}" alt="">
                </div>
                <div class="b-txt-wrap">
                    <div class="b-tit">${opt.tit}</div>
                    ${opt.txt ? `<div class="b-txt">${opt.txt}</div>` : ''}
                </div>
            </li>`;
    }).join('');

    var pageIndexes = q.options.map(function() {
        return `<div class="page-index"></div>`;
    }).join('');

    return `
        <li class="ai-msg b-question">
            <p class="caution-msg">다음 중 하나만 선택해주세요</p>
            <div class="b-wrap">
                <ul class="b-list">
                    ${items}
                    <li data-none="none"></li>
                </ul>
            </div>
            <div class="pagination">${pageIndexes}</div>
        </li>`;
}

function buildPrdList(prdItems) {
    var options = prdItems.map(function(name) {
        var d = prdDetailMap[name];
        return `
            <li class="prd-option">
                <div class="prd-card">
                    <img src="${d.img}" alt="">
                    <div class="txt-wrap">
                        <span class="txt1">${d.desc}</span>
                        <span class="txt2">${name}</span>
                        <span class="txt3">${d.price}</span>
                    </div>
                </div>
                <button type="button" class="prd-info-btn"><span>차량 정보 확인</span></button>
            </li>`;
    }).join('');

    var pageIndexes = prdItems.map(function() {
        return `<div class="page-index"></div>`;
    }).join('');

    return `
        <li class="ai-msg has-prd-btn">
            <ul class="prd-list">${options}</ul>
            <div class="pagination">${pageIndexes}</div>
        </li>`;
}

// ==========================================
// 초기 진입 애니메이션 (intro 메시지 + 첫 질문)
// ==========================================
function initChatScenario() {
    var $chatList = $("#chatPage .chat-list");
    $chatList.empty();
    currentQuestionIndex = 0;

    // 날짜
    var now = new Date();
    $("#chatPage .chat-year").text(now.getFullYear());
    $("#chatPage .chat-month").text(now.getMonth() + 1);
    $("#chatPage .chat-date").text(now.getDate());

    // intro 메시지 DOM 추가
    chatScenario.intro.forEach(function(msg) {
        var html = msg.type === "user"
            ? `<li class="user-msg anim-item"><div class="bubble"><span>${msg.text}</span></div></li>`
            : `<li class="ai-msg anim-item"><div class="bubble"><span>${msg.text}</span></div></li>`;
        $chatList.append($(html));
    });

    // 첫 질문 ai 텍스트 + b-wrap
    var q = chatScenario.questions[0];
    $chatList.append(
        $(`<li class="ai-msg anim-item"><div class="bubble"><span>${q.aiText}</span></div></li>`)
    );
    $chatList.append($(buildBWrap(q)).addClass('anim-item'));

    // gsap 순차 등장
    gsap.set("#chatPage .chat-list > li.anim-item", { opacity: 0 });
    var $items = $("#chatPage .chat-list > li.anim-item");
    var tl = gsap.timeline({ delay: 0.3 });
    $items.each(function(i) {
        tl.to(this, { opacity: 1, duration: 0.4, ease: "none" }, i === 0 ? 0 : "+=0.3");
    });
}

// ==========================================
// b-container 클릭 → userMsg + 다음 질문 or 결과
// ==========================================
$(document).on("click", ".b-container", function() {
    var $bList   = $(this).closest(".b-list");
    var $bWrap   = $(this).closest(".b-wrap");
    var $aiMsg   = $(this).closest(".ai-msg.b-question");
    var $pagination = $aiMsg.find(".pagination");

    var bTit = $(this).find(".b-tit").text();
    var index = $bList.find(".b-container").index(this);

    $pagination.find(".page-index").removeClass("active");
    $pagination.find(".page-index").eq(index).addClass("active");

    // is-answered면 다음에 붙은 userMsg 텍스트만 교체
    if ($aiMsg.hasClass("is-answered")) {
        $aiMsg.next(".user-msg").find("span").text(bTit);
        return;
    }

    $aiMsg.addClass("is-answered");

    var userMsg = `
        <li class="user-msg appended">
            <div class="bubble"><span>${bTit}</span></div>
        </li>`;

    appendAiMsg(userMsg, 400).then(function() {
        currentQuestionIndex++;

        if (currentQuestionIndex < chatScenario.questions.length) {
            var q = chatScenario.questions[currentQuestionIndex];
            var aiTextMsg = `
                <li class="ai-msg appended">
                    <div class="bubble"><span>${q.aiText}</span></div>
                </li>`;
            appendAiMsg(aiTextMsg, 600)
                .then(function() {
                    return appendAiMsg(buildBWrap(q), 400);
                });
        } else {
            var findingMsg = `
                <li class="ai-msg appended">
                    <div class="bubble"><span>당신과 꼭 닮은 차량을 찾고 있어요, 잠시만요!</span></div>
                </li>`;
            appendAiMsg(findingMsg, 600)
                .then(function() { return appendLoadingMsg(); })
                .then(function() {
                    return new Promise(function(resolve) {
                        setTimeout(function() {
                            removeLoadingMsg();
                            resolve();
                        }, 1500);
                    });
                })
                .then(function() {
                    return appendAiMsg(buildPrdList(["현대 팰리세이드", "기아 쏘렌토", "테슬라 model 3"]), 0);
                })
                .then(function() {
                    return appendAiMsg(`
                        <li class="ai-msg">
                            <div class="bubble"><span>당신의 마음에 드는 차를 하나만 선택해보세요.</span></div>
                        </li>`, 400);
                })
                .then(function() {
                    return new Promise(function(resolve) {
                        var $newMsg = $(`
                            <li class="ai-msg refresh-btn">
                                <div class="animates-star animates-star-lottie"></div>
                                <button type="button">
                                    <span>새로 추천받기</span>
                                </button>
                            </li>`);
                        setTimeout(function() {
                            $('#' + currentPage + ' .chat-list').append($newMsg);
                            gsap.set($newMsg, { opacity: 0 });
                            var container = $newMsg.find('.animates-star-lottie')[0];
                            if (container) {
                                lottie.loadAnimation({
                                    container: container,
                                    renderer: "svg",
                                    loop: true,
                                    autoplay: true,
                                    animationData: aiStartJson,
                                });
                            }
                            requestAnimationFrame(function() {
                                scrollToLastMsg();
                                gsap.to($newMsg, {
                                    opacity: 1, duration: 0.4, ease: 'power2.out',
                                    onComplete: resolve
                                });
                            });
                        }, 300);
                    });
                });
        }
    });
});

// ==========================================
// 차량 정보 확인 버튼 → 브릿지 모달
// ==========================================
$(document).on("click", ".prd-info-btn", function() {
    var $prdCard = $(this).closest(".prd-option").find(".prd-card");
    var name   = $prdCard.find(".txt2").text();
    var detail = prdDetailMap[name];
    if (!detail) return;

    selectedPrd = {
        name:  name,
        price: detail.price,
        desc:  detail.desc,
        img:   detail.img,
        tags:  detail.tags,
    };

    // 모달 데이터 세팅
    $("#bridgePage .modal-prd-img").attr("src", selectedPrd.img);
    $("#bridgePage .prd-txt01").text(selectedPrd.name);
    $("#bridgePage .prd-txt02").text(selectedPrd.price);
    $("#bridgePage .prd-txt03").html(selectedPrd.desc);

    var tagsHtml = selectedPrd.tags.map(function(t) {
        return `<li class="tag"><span>${t}</span></li>`;
    }).join('');
    $("#bridgePage .tag-wrap").html(tagsHtml);

    // pagination
    var $prdList   = $(this).closest(".prd-list");
    var $pagination = $(this).closest(".ai-msg.has-prd-btn").find(".pagination");
    var prdIndex   = $(this).closest(".prd-option").index();
    $pagination.find(".page-index").removeClass("active");
    $pagination.find(".page-index").eq(prdIndex).addClass("active");

    // 클릭한 아이템으로 가로 스크롤
    var $prdOption = $(this).closest(".prd-option");
    var itemLeft   = $prdOption.position().left;
    var currentScroll = $prdList.scrollLeft();
    $prdList.animate({ scrollLeft: currentScroll + itemLeft - 16 }, 300);

    setTimeout(function() { openBridgePage(); }, 300);
});

$(document).on("click", "#bridgePage .to-gyeonjuk", function() {
    closeBridgePage(function() {
        var gotPrdName = `
            <li class="ai-msg reminder appended">
                <div class="bubble"><span>아주 좋은 선택이에요.<br>${selectedPrd.desc}</span></div>
            </li>`;
        var pageLoadMsg = `
            <li class="ai-msg appended">
                <div class="bubble"><span>더 자세한 안내를 위해 상세 견적페이지로 이동할게요!</span></div>
            </li>`;

        appendAiMsg(gotPrdName, 300)
            .then(function() { return appendAiMsg(pageLoadMsg, 600); })
            .then(function() { return appendLoadingMsg(); })
            .then(function() {
                return new Promise(function(resolve) {
                    setTimeout(function() {
                        removeLoadingMsg();
                        resolve();
                    }, 1000);
                });
            })
            .then(function() {
                goPage("carResearch02");
            });
    });
});