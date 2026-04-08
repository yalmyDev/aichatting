// ==========================================
// 로딩 말풍선
// ==========================================
var loadMsgHtml = `
    <li class="ai-msg loading-msg">
        <div class="bubble">
            <div class="lottie-loading"></div>
        </div>
    </li>`;

function appendLoadingMsg() {
    return new Promise(function(resolve) {
        var $chatList = $('#' + currentPage + ' .chat-list');
        $chatList.append(loadMsgHtml);

        setTimeout(function() {
            var container = $chatList.find('.lottie-loading').last()[0];

            lottie.loadAnimation({
                container: container,
                renderer: "svg",
                loop: true,
                autoplay: true,
                animationData: loadJson,
            });

            scrollToLastMsg();
            resolve();
        }, 50);
    });
}
function removeLoadingMsg() {
    $(".loading-msg").remove();
}

$(document).ready(function() {
    // ==========================================
    // 옵션 선택 (자연/도심)
    // ==========================================
    $(document).on("click", ".ai-msg.has-choice-btn .option", function() {
        console.log("클릭 시작");


        if ($(this).hasClass("is-selected")) return;

        $(".ai-msg.has-choice-btn .option").removeClass("is-selected");
        $(".chat-list .appended, .chat-list .refresh-btn, .chat-list .prd-options").remove();

        $(this).addClass("is-selected");
        $(this).find('input[type="radio"]').prop("checked", true);

        var optionTxt = $(this).find(".card-info span").text();
        var userMsg = `
            <li class="user-msg appended">
                <div class="bubble"><span>${optionTxt}</span></div>
            </li>`;
        var loadingMsg = `
            <li class="ai-msg appended">
                <div class="bubble"><span>좋은 선택이에요! 짐이 많으시니 트렁크가 넓은 SUV 위주로 살펴볼게요!</span></div>
            </li>`;
        var prdList = `
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
            </li>`;
        var choicemsg = `
            <li class="ai-msg appended">
                <div class="bubble"><span>당신의 마음에 드는 차를 하나만 선택해보세요.</span></div>
            </li>`;
        var refreshMsg = `
            <li class="ai-msg refresh-btn">
                <button type="button">
                    <i class="ai-icon"></i>
                    <span>새로 추천받기</span>
                </button>
            </li>`;

        $(".chat-list").append(userMsg);
        scrollToLastMsg();

        console.log('appendLoadingMsg 호출 전 chat-list:', $('.chat-list').length);


        appendLoadingMsg()
            .then(function() { return appendAiMsg(loadingMsg, 1500); })
            .then(function() {
            console.log('then 진입');
                // debugger;
                removeLoadingMsg();
                return appendAiMsg(prdList, 0);
            })
            .then(function() { return appendAiMsg(choicemsg, 300); })
            .then(function() { return appendAiMsg(refreshMsg, 300); })
            .then(function() { scrollToLastMsg(); });
    });

    // 차량별 상세 데이터 매핑
    var prdDetailMap = {
        "현대 팰리세이드": {
            price: "45,000,000원",
            desc:  "준대형 SUV로 차박, 큰짐 운반에 최적화된 현대 팰리세이드와 함께하세요.",
        },
        "기아 쏘렌토": {
            price: "36,000,000원",
            desc:  "중형 SUV로 가족과 함께하는 모든 순간을 위한 기아 쏘렌토와 함께하세요.",
        },
        "볼보 XC90": {
            price: "110,000,000원",
            desc:  "북유럽 감성과 최고의 안전성을 갖춘 볼보 XC90과 함께하세요.",
        },
    };

    // ==========================================
    // 차량 선택
    // ==========================================
    $(document).on("click", ".ai-msg.has-prd-btn .prd-option", function() {
        if ($(this).hasClass("is-selected")) return;

        $(".ai-msg.has-prd-btn .prd-option").removeClass("is-selected");
        $(".ai-msg.has-prd-btn").nextAll().remove();

        $(this).addClass("is-selected");
        $(this).find('input[type="radio"]').prop("checked", true);

        // 선택한 차량 정보 저장 (common.js의 selectedPrd에 저장)
        var name   = $(this).find(".txt-wrap .txt2").text();
        var detail = prdDetailMap[name] || {
            price: $(this).find(".txt-wrap .txt3").text(), // 매핑 없을 때 fallback
            desc:  $(this).find(".txt-wrap .txt1").text() + " " + name + "와 함께하세요.",
        };
        selectedPrd = {
            name:  name,
            price: detail.price,
            desc:  detail.desc,
            img:   $(this).find(".prd-card img").attr("src"),
        };

        var prdTxt = selectedPrd.name;
        var userMsg = `
            <li class="user-msg appended">
                <div class="bubble"><span>${prdTxt}</span></div>
            </li>`;
        var loadMsg = `
            <li class="ai-msg appended">
                <div class="lottie-loading"></div>
            </li>
        `
        var gotPrdName = `
            <li class="ai-msg reminder appended">
                <div class="bubble"><span>아주 좋은 선택이에요.<br>대형 짐과 차박, 가족 여행에 최적인 현대 펠리세이드를 고르셨네요.</span></div>
            </li>`;
        var infoTxt = `
            <li class="ai-msg prd-options">
                <p><i class="icon-bubble"></i>관심있는 차량 정보를 선택해주세요.</p>
                <ul class="info-list">
                    <li class="info-btn">
                        <div class="rd-wrap">
                            <a href="./result01.html"><span>차량 견적보기</span></a>
                        </div>
                    </li>
                    <li class="info-btn">
                        <div class="rd-wrap">
                            <a href="#"><span>신차 할부</span></a>
                        </div>
                    </li>
                    <li class="info-btn">
                        <div class="rd-wrap">
                            <a href="#"><span>신차 리스</span></a>
                        </div>
                    </li>
                    <li class="info-btn">
                        <div class="rd-wrap">
                            <a href="#"><span>장기렌터가</span></a>
                        </div>
                    </li>
                </ul>
            </li>`;

        $(".chat-list").append(userMsg);
        scrollToLastMsg();
        appendAiMsg(gotPrdName, 300)
            .then(function() { return appendAiMsg(infoTxt, 500); })
            .then(function() { scrollToLastMsg(); });

        // 가로 스크롤
        var $prdList = $(this).closest(".prd-list");
        var itemLeft = $(this).position().left;
        var currentScroll = $prdList.scrollLeft();
        $prdList.animate({ scrollLeft: currentScroll + itemLeft - 32 }, 300);
    });

    // ==========================================
    // 새로 고침
    // ==========================================
    $(document).on("click", ".ai-msg.refresh-btn button", function() {
        // refresh-btn 포함 그 이후 appended 메시지 전부 제거
    $('.chat-list .has-prd-btn').nextAll().remove();
    $('.chat-list .has-prd-btn').remove();

        // prdList 순서 섞기
        var items = [
            `<li class="prd-option">
                <input type="radio" name="prd01">
                <div class="prd-card">
                    <img src="./../images/prd/palisade_v2.png" alt="">
                    <div class="txt-wrap">
                        <span class="txt1">준대형 SUV로 차박, 큰짐 운반에 최적</span>
                        <span class="txt2">현대 팰리세이드</span>
                        <span class="txt3">5,000만원</span>
                    </div>
                </div>
            </li>`,
            `<li class="prd-option">
                <input type="radio" name="prd01">
                <div class="prd-card">
                    <img src="./../images/prd/sorento.png" alt="">
                    <div class="txt-wrap">
                        <span class="txt1">중형 SUV로 가족 캠핑에 적합</span>
                        <span class="txt2">기아 쏘렌토</span>
                        <span class="txt3">3,600만원</span>
                    </div>
                </div>
            </li>`,
            `<li class="prd-option">
                <input type="radio" name="prd01">
                <div class="prd-card">
                    <img src="./../images/prd/volvo.png" alt="">
                    <div class="txt-wrap">
                        <span class="txt1">북유럽감성, 럭셔리 수입SUV</span>
                        <span class="txt2">볼보 XC90</span>
                        <span class="txt3">1억 1,000만원</span>
                    </div>
                </div>
            </li>`
        ];

        // 순서 섞기
        items.sort(function() { return Math.random() - 0.5; });

        var newPrdList = `
            <li class="ai-msg has-prd-btn appended">
                <ul class="prd-list">${items.join('')}</ul>
            </li>`;
        var choicemsg = `
            <li class="ai-msg appended">
                <div class="bubble"><span>당신의 마음에 드는 차를 하나만 선택해보세요.</span></div>
            </li>`;
        var newRefreshMsg = `
            <li class="ai-msg refresh-btn">
                <button type="button">
                    <i class="ai-icon"></i>
                    <span>새로 추천받기</span>
                </button>
            </li>`;

        appendAiMsg(newPrdList, 0)
            .then(function() { return appendAiMsg(choicemsg, 300); })
            .then(function() { return appendAiMsg(newRefreshMsg, 300); })
            .then(function() { scrollToLastMsg(); });
    });

    // ==========================================
    // 차량 정보 선택 (견적/할부/리스 등)
    // ==========================================
    $(document).on("click", ".ai-msg.prd-options .info-btn", function() {
        // a href 있으면 페이지 이동이므로 return
        if ($(this).find('a[href]').length) return;
        
        if ($(this).hasClass("is-selected")) return;

        var $currentPrdOptions = $(this).closest(".ai-msg.prd-options");
        $(".ai-msg.prd-options .info-btn").removeClass("is-selected");
        $currentPrdOptions.nextAll().remove();

        $(this).addClass("is-selected");
        $(this).find('input[type="radio"]').prop("checked", true);

        var choicedTxt = $(this).find(".rd-wrap span").text();
        var userMsg = `
            <li class="user-msg appended">
                <div class="bubble"><span>${choicedTxt}</span></div>
            </li>`;
        var nextAiMsg = `
            <li class="ai-msg">
                <div class="bubble"><span>자동차 대출에 대해서 궁금하신가요? 쉽게 알려드릴게요.</span></div>
            </li>`;
        var loanInfoMsg = `
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
            </li>`;

        $(".chat-list").append(userMsg);
        scrollToLastMsg();
        appendAiMsg(nextAiMsg, 1000)
            .then(function() { return appendAiMsg(loanInfoMsg, 300); })
            .then(function() { scrollToLastMsg(); });
    });

});
