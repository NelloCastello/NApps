export {}

import $ from "jquery"

console.log($('.register'))

$('.header__reg-link').on('click', function(): any {
    $('.register').removeClass('register--hidden')
})
$('.header__auth-link').on('click', function(): any {
    $('.auth').removeClass('auth--hidden')
})
$('.login__close-btn').on('click', function(): any {
    $('.register').addClass('register--hidden')
    $('.auth').addClass('auth--hidden')
})