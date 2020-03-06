let num;
let operator = "unknown";
let firstNumber = "unknown";

function onLoad() {
    init();
}


function init() {

    num = document.getElementById("num");
    //禁止用户输入
    num.value = 0;
    num.disable = true;

    //按钮点击事件
    let inputs = document.getElementsByTagName("input");
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].onclick = function () {
            onButtonClick(inputs[i].value);
        }
    }
}

function onButtonClick(value) {
    let isNumber = !isNaN(value);
    if (isNumber) {
        inputNumber(value);
    } else {
        handleValue(value);
    }
}

function inputNumber(number) {
    //获取原先输入框的值，如果是0直接使用输入的值，不是0就在后面添加
    let value = num.value;
    if (value === "0" || value.length === 0) {
        num.value = number;
    } else {
        num.value = value + number;
    }
}

/**
 * 其他按钮
 * @param value
 */
function handleValue(value) {

    switch (value) {
        case "+":
            operator = "+";
            firstNumber = Number(num.value);
            num.value = 0;

            break;
        case "-":
            operator = "-";
            firstNumber = Number(num.value);
            num.value = 0;

            break;
        case "*":
            operator = "*";
            firstNumber = Number(num.value);
            num.value = 0;

            break;
        case "/":
            operator = "/";
            firstNumber = Number(num.value);
            num.value = 0;

            break;
        case ".":
            addDecimals();
            break;
        case "←":
            del();
            break;
        case "c":
            num.value = "0";
            break;
        case "+/-":
            sign();
            break;
        case "=":
            calculate();
            break;
        case "m":
            // window.location.href="https://www.baidu.com";
            window.open("https://www.baidu.com");
            break;

    }
}

function calculate() {

    if (operator === "operator" || firstNumber === "operator") {
        alert("出错了");
        return
    }
    let number2 = Number(num.value);
    switch (operator) {
        case "+":
            num.value = firstNumber + number2;
            break;
        case "-":
            num.value = firstNumber - number2;
            break;
        case "*":
            num.value = firstNumber * number2;
            break;
        case "/":
            //除数不能为0
            if (num.value === "0") {
                alert("除数不能为0")
                return;
            }
            num.value = firstNumber / number2;
            break;
    }
}


function addDecimals() {
    let value = num.value;
    if (value.indexOf(".") === -1) {
        num.value = value + ".";
    }
}

function del() {
    let value = num.value;
    if (value === "0" || value.length === 0) {
        return;
    }

    let number = value.substr(0, value.length - 1);
    if (number.length === 0) {
        number = 0;
    }
    num.value = number;
}

function sign() {
    let value = num.value;
    num.value = Number(value) * -1;
}

