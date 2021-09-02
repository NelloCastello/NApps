export {};

import $ from "jquery";



// Показать/скрыть "логин"

$('.header__reg-link').on('click', function() {
    $('.register').removeClass('register--hidden');
});
$('.header__auth-link').on('click', function() {
    $('.auth').removeClass('auth--hidden');
});
$('.login__close-btn').on('click', function() {
    $('.register').addClass('register--hidden');
    $('.auth').addClass('auth--hidden');
});



// Регистрация

interface RegisterInterface {
    name: string;
    HTMLElem: JQuery;
    HTMLElemBtn: JQuery;
    HTMLElemBtnPrev: boolean;
};

let registerBtnPrevElem: JQuery = $('#js-register__prevBtn');

let registerList: RegisterInterface[] = [
    {
        name: "nickname",
        HTMLElem: $('#js-register__nicknameInput'),
        HTMLElemBtn: $('#js-register__nextBtn'),
        HTMLElemBtnPrev: false
    },
    {
        name: "email",
        HTMLElem: $('#js-register__emailInput'),
        HTMLElemBtn: $('#js-register__nextBtn'),
        HTMLElemBtnPrev: true
    },
    {
        name: "code",
        HTMLElem: $('#js-register__codeInput'),
        HTMLElemBtn: $('#js-register__nextBtn'),
        HTMLElemBtnPrev: true
    },
    {
        name: "passwd1",
        HTMLElem: $('#js-register__passwd1Input'),
        HTMLElemBtn: $('#js-register__nextBtn'),
        HTMLElemBtnPrev: true
    },
    {
        name: "passwd2",
        HTMLElem: $('#js-register__passwd2Input'),
        HTMLElemBtn: $('#js-register__doneBtn'),
        HTMLElemBtnPrev: true
    }
];

let registerInputActive: number = 0;

let getRegisterElemActive = function(active: number): RegisterInterface {
    let result: RegisterInterface;

    registerList.forEach(function(item: RegisterInterface) {
        if (item.name === registerList[active].name) {
            result = item;
            return;
        }
    });

    return result;
};

getRegisterElemActive(registerInputActive).HTMLElemBtn.removeClass('login__btn--hidden');
getRegisterElemActive(registerInputActive).HTMLElem.removeClass('login__input--hidden');

$('.login__btn:not(#js-register__prevBtn)').on('click', function() {
    registerInputActive++;

    console.log(registerInputActive);

    if(getRegisterElemActive(registerInputActive).HTMLElemBtnPrev === true) {
        registerBtnPrevElem.removeClass('login__btn--hidden');
    } else {
        registerBtnPrevElem.addClass('login__btn--hidden');
    }

    getRegisterElemActive(registerInputActive-1).HTMLElemBtn.addClass('login__btn--hidden');
    getRegisterElemActive(registerInputActive-1).HTMLElem.addClass('login__input--hidden');

    getRegisterElemActive(registerInputActive).HTMLElemBtn.removeClass('login__btn--hidden');
    getRegisterElemActive(registerInputActive).HTMLElem.removeClass('login__input--hidden');
});

registerBtnPrevElem.on('click', function() {
    registerInputActive--;

    console.log(registerInputActive);

    if(getRegisterElemActive(registerInputActive).HTMLElemBtnPrev === true) {
        registerBtnPrevElem.removeClass('login__btn--hidden');
    } else {
        registerBtnPrevElem.addClass('login__btn--hidden');
    }

    getRegisterElemActive(registerInputActive+1).HTMLElemBtn.addClass('login__btn--hidden');
    getRegisterElemActive(registerInputActive+1).HTMLElem.addClass('login__input--hidden');

    getRegisterElemActive(registerInputActive).HTMLElemBtn.removeClass('login__btn--hidden');
    getRegisterElemActive(registerInputActive).HTMLElem.removeClass('login__input--hidden');
});