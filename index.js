const data = {
    messages: [{
        left: '工作怎么样呀？',
        right: [{
            text: '不如您家孩子厉害，还要继续学习',
            score: 3
        }, {
            text: '一般啦，比您家孩子好一点。',
            score: -2
        }, {
            text: '领导经常叫我加班',
            score: 1
        }]
    }, {
        left: '有对象了吗？',
        right: [{
            text: '被你家孩子租回家过年了。',
            score: -2
        }, {
            text: '我还是个孩子，妈妈说不要早恋',
            score: 1
        }, {
            text: '对象对我挺好的，谢谢关心。',
            score: 3
        }]
    }, {
        left: '工资多少啊？',
        right: [{
            text: '刚好比你家孩子多那么一点。',
            score: -2
        }, {
            text: '一般，我刚买了个表',
            score: 1
        }, {
            text: '不多，刚好够基本生活。',
            score: 3
        }]
    }, {
        left: '明年有什么打算呢？',
        right: [{
            text: '还没有什么打算。',
            score: 1
        }, {
            text: '多多努力，向您学习。',
            score: 3
        }, {
            text: '凑钱把房子买了，阿姨打算给我多少红包呀？',
            score: -2
        }]
    }],
    result: [{
        score: 8,
        tips: '传说中别人家的孩子，给你99分，多给一分怕你骄傲',
        say: '好孩子'
    }, {
        score: 4,
        tips: '来年继续加油吧！别人家的孩子都在虎视眈眈想超过你呢',
        say: '不错'
    }, {
        score: 0,
        tips: '恭喜你捡回一条命！来年可没这么好运了，保重。',
        say: '呵呵'
    }, {
        score: -10,
        tips: '请问你是怎么活过这么多年的？还是好好找个洞藏起来保命吧。',
        say: '这孩子怎么这样子'
    }]
}

function createDom(tpl) {
    const div = document.createElement('div');
    div.innerHTML = tpl;
    return div.children[0];
}
  
function $(selector) {
    return document.querySelector(selector);
}
  
function addClass(element, className) {
    element.classList.add(className);
}
  
function removeClass(element, className) {
    element.classList.remove(className);
}
  
function hasClass(element, className) {
    return element.classList.contains(className);
}

const firstPage = $('.first-page');
const continueBtn = $('.js-continue');
const chatList = $('.message-list');
const msgSelector = $('.message-select');
const chatPage = $('.chat-page');
const tips = $('.cover-tips ');

function bindEvents() {
    continueBtn.addEventListener('click', () => {
        const firstPage = $('.first-page');
        addClass(firstPage, 'fadeout');
        setTimeout(() => {
            addClass(firstPage, 'hide');
            oneStep(0);
        }, 300)
    })

    // 实现事件委托
    msgSelector.addEventListener('click', (event) => {
        let target = event.target
        const currentTarget = event.currentTarget
        while (target !== currentTarget) {
            if (hasClass(target, 'js-to-select')) {
                const currentScore = +target.getAttribute('data-score');
                const message = target.querySelector('.message-bubble').innerText;
                appendMessage('right', message);
                score += currentScore;
                nextStep();
                return;
            }
            target = target.parentNode;
        }
    })

    // 重新启动
    $('.icon-replay').addEventListener('click', (event) => {
        window.location.reload();
    })
}

let step = 0;
let score = 0;
const MAX_STEP = data.messages.length;

// function getDomByStr(str) {
//     const div = document.createElement('div');
//     div.innerHTML = str;
//     return div.children[0];
// }

// function getMessage(side, str) {
//     const template = `
//         <div class="message-item message-item--${side}">
//             <img class="avatar" src="./img/${side === 'left' ? 'girl' : 'boy'}.png" alt="头像">
//             <div class="message-bubble">
//                 ${str}
//             </div>
//         </div>
//     `
//     return getDomByStr(template);
// }

// function getSelectMessage() {
//     const template = `
//         <div class="message-item message-item--right js-to-select" data-score=${messageObj.score}>
//             <img class="avatar" src="./img/boy.png" alt="头像">
//             <div class="message-bubble">
//                 ${messageObj.text}
//             </div>
//         </div>
//     `

//     return getDomByStr(template);
// }


function getMessageStr(side, str) {
    return `
      <div class="message-item message-item--${side}">
        <img class="avatar" src="./img/${side === 'left' ? 'girl' : 'boy'}.png" alt="头像">
        <div class="message-bubble">${str}</div>
      </div>
    `
}
  
function getSelectorStr(messageObj) {
    return `
      <div class="message-item message-item--right js-to-select" data-score=${messageObj.score}>
        <img class="avatar" src="./img/boy.png" alt="头像">
        <div class="message-bubble">${messageObj.text}</div>
      </div>
    `
}

function createMessage(side, str) {
    return createDom(messageStr);
}
  
function appendMessage(side, str) {
    const messageStr = getMessageStr(side, str);
    const messageDom = createDom(messageStr);
    chatList.appendChild(messageDom);
}
  
function changeSelectList(step) {
    const currentMsg = data.messages[step];
    selectListStr = '';
    currentMsg.right.forEach((selectMessage)=> {
        selectListStr += getSelectorStr(selectMessage);
    })
    msgSelector.innerHTML = selectListStr;
}
  
function toggleSelector(isShow) {
    if (isShow) {
        addClass(chatPage, 'show-selector');
    } else {
        removeClass(chatPage, 'show-selector');
    }
}
  
function oneStep(step) {
    const currentMsg = data.messages[step];
    appendMessage('left', currentMsg.left);
    setTimeout(()=> {
      changeSelectList(step);
      toggleSelector(true);
    }, 300)
}
  
function showTips (resultObj) {
    tips.querySelector('.tips-text').innerText = `
        分数：${score}
        ${resultObj.tips}
    `;
    removeClass(tips, 'hide');
}
  
function showResult() {
    setTimeout(() => {
        const resultObj = getResultByScore(score); // 显示左边最后的对话
        appendMessage('left', resultObj.say); // 延时 1s 显示结果窗口
        // 显示结果窗口
        setTimeout(()=> {
            showTips(resultObj);
        }, 1000)
    }, 1000)
}
  
// 根据分数获取结果对象
function getResultByScore (score) {
    const resultMsg = data.result
    let result;
    resultMsg.every((resultObj)=> {
        if (score >= resultObj.score) {
            result = resultObj;
            return false;
        }
        return true;
    })
    return result;
}

function nextStep() {
    step += 1;
    toggleSelector(false);
    if (step < MAX_STEP) {
        setTimeout(()=> {
            oneStep(step);
        }, 500)
    } else {
        showResult();
    }
}
  
bindEvents();