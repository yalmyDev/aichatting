function appendAiMsg(html, delay){
    return new Promise(resolve => {
        setTimeout(()=>{
            $('.chat-list').append(html);
            resolve();
        }, delay);
    });
}

// 채팅창 자동 스크롤 스크립트
function scrollToLastMsg(){
    let lastMsg = $('.chat-list li[class*="-msg"]:last-child');
    console.log(lastMsg);
    let inputHeight = $('.user-input-wrap').outerHeight(true);
    let scrollTarget = lastMsg.position().top + $('.chat-wrap').scrollTop() - $('.chat-wrap').height() + lastMsg.outerHeight(true) + inputHeight + 16;

    $('.chat-wrap').animate({scrollTop: scrollTarget}, 300);
}

$(document).ready(function(){
    // what's scrolling
    // $('*').on('scroll', function(){
    //     console.log($(this).attr('class') || $(this).prop('tagName'));
    // });

    // 요소의 높낮이값 변수로 받아오는 스크립트
    let inputHeight = $('.user-input-wrap').outerHeight(true);
    document.documentElement.style.setProperty('--ai-chat-height', inputHeight + 'px');
    let headerHeight = $('.header').outerHeight(true);
    document.documentElement.style.setProperty('--header-height', headerHeight + 'px');
    let footerHeight = $('.footer').outerHeight(true);
    document.documentElement.style.setProperty('--footer-height', footerHeight + 'px');

    // 채팅 구현 스크립트
    $(document).on('click', '.ai-msg.has-choice-btn .option', function(){
        // 이미 선택된 radio option일 경우 return
        if($(this).hasClass('is-selected')) return;
        // 이전 선택 초기화
        $('.ai-msg.has-choice-btn .option').removeClass('is-selected');
        $('.chat-list .appended, .chat-list .refresh-btn, .chat-list .prd-options').remove();
        // 현재 선택 처리
        $(this).addClass('is-selected');
        $(this).find('input[type="radio"]').prop('checked', true)

        let optionTxt = $(this).find('.card-info span').text();
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
                            <img src="./../images/prd/ionic.png" alt="">
                            <div class="txt-wrap">
                                <span class="txt1">준대형 SUV로 차박, 큰짐 운반에 최적</span>
                                <span class="txt2">현대 페리세이드</span>
                                <span class="txt3">5,000만원</span>
                            </div>
                        </div>
                    </li>
                    <li class="prd-option">
                        <input type="radio" name="prd01">
                        <div class="prd-card">
                            <img src="./../images/prd/ionic.png" alt="">
                            <div class="txt-wrap">
                                <span class="txt1">준대형 SUV로 차박, 큰짐 운반에 최적</span>
                                <span class="txt2">기아</span>
                                <span class="txt3">5,000만원</span>
                            </div>
                        </div>
                    </li>
                    <li class="prd-option">
                        <input type="radio" name="prd01">
                        <div class="prd-card">
                            <img src="./../images/prd/ionic.png" alt="">
                            <div class="txt-wrap">
                                <span class="txt1">준대형 SUV로 차박, 큰짐 운반에 최적</span>
                                <span class="txt2">현대 페리세이드</span>
                                <span class="txt3">5,000만원</span>
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
        `
        let refreshMsg = `
            <li class="ai-msg refresh-btn">
                <button type="button">
                    <i class="ai-icon"></i>
                    <span>새로 추천받기</span>
                </button>
            </li>
        `;

        $('.chat-list').append(userMsg);
        scrollToLastMsg();
        appendAiMsg(loadingMsg, 1000)
            .then(()=>appendAiMsg(prdList, 1000))
            .then(()=>appendAiMsg(choicemsg, 300))
            .then(()=>appendAiMsg(refreshMsg, 300))
            .then(()=>scrollToLastMsg());
    });
    $(document).on('click', '.ai-msg.has-prd-btn .prd-option', function(){
        if($(this).hasClass('is-selected')) return;

        $('.ai-msg.has-prd-btn .prd-option').removeClass('is-selected');
        // $('.chat-list .reminder, .chat-list .refresh-btn, .chat-list .prd-options').remove();
        $('.ai-msg.has-prd-btn').nextAll().remove();

        // 현재 선택 처리
        $(this).addClass('is-selected');
        $(this).find('input[type="radio"]').prop('checked', true)

        let prdTxt = $(this).find('.txt-wrap .txt2').text();
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
                            <input type="radio" name="prd1">
                            <span>차량 견적보기</span>
                        </div>
                    </li>
                    <li class="info-btn">
                        <div class="rd-wrap">
                            <input type="radio" name="prd1">
                            <span>신차 할부</span>
                        </div>
                    </li>
                    <li class="info-btn">
                        <div class="rd-wrap">
                            <input type="radio" name="prd1">
                            <span>신차 리스</span>
                        </div>
                    </li>
                    <li class="info-btn">
                        <div class="rd-wrap">
                            <input type="radio" name="prd1">
                            <span>장기렌터카</span>
                        </div>
                    </li>
                </ul>
            </li>
        `

        $('.chat-list').append(userMsg);
        scrollToLastMsg();
        appendAiMsg(gotPrdName, 300)
            .then(()=>appendAiMsg(infoTxt, 500))
            .then(()=>scrollToLastMsg());

        // 가로 스크롤
        let $prdList = $(this).closest('.prd-list');
        let itemLeft = $(this).position().left;
        let currentScroll = $prdList.scrollLeft();

        $prdList.animate({
            scrollLeft: currentScroll + itemLeft - 32
        }, 300);
    });
    $(document).on('click', '.ai-msg.prd-options .info-btn', function(){
         // 이미 선택된 radio option일 경우 return
        if($(this).hasClass('is-selected')) return;

        let $currentPrdOptions = $(this).closest('.ai-msg.prd-options');

        // 이전 선택 초기화
        $('.ai-msg.prd-options .info-btn').removeClass('is-selected');
        // $('.chat-list .appended, .ai-msg.prd-options').remove();
        $currentPrdOptions.nextAll().remove();
        // 현재 선택 처리
        $(this).addClass('is-selected');
        $(this).find('input[type="radio"]').prop('checked', true)

        let choicedTxt = $(this).find('.rd-wrap span').text();
        let userMsg = `
            <li class="user-msg appended">
                <div class="bubble">
                    <span>${choicedTxt}</span>
                </div>
            </li>
        `

        let nextAiMsg = `
            <li class="ai-msg">
                <div class="bubble">
                    <span>자동차 대출에 대해서 궁금하신가요? 쉽게 알려드릴게요.</span>
                </div>
            </li>
        `
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
        `

        $('.chat-list').append(userMsg);
        scrollToLastMsg();
        appendAiMsg(nextAiMsg, 1000)
            .then(()=>appendAiMsg(loanInfoMsg, 300))
            .then(()=>scrollToLastMsg());
    });

    // 화면 이동 시 채팅 시작 애니메이션
    let items = $('.chat-list > li');

    items.each(function(index){
        let $item = $(this);

        setTimeout(function(){
            $item.addClass('visible');
        }, index * 1000);
    });
});