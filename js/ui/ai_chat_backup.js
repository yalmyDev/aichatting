$(document).ready(function(){
    

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
    

    // 차량 캐로셀
    let $items = $(".prd-list-wrap ul li");
    let currentIndex = 1;

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
})