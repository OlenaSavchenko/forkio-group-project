(function () {
   
   'use strict'
   const menuBurger = document.querySelector('.burger');
   const burgerLine = menuBurger.children[0];
   const menuList = document.querySelector('.menu');

   // click on the burger
   menuBurger.addEventListener('click', function () {
      burgerLine.classList.toggle('burger__line--open');
      menuList.classList.toggle('menu--open');
   })

   // click out of the menu
   document.addEventListener('click', function (e) {
      if (!e.target.closest('.menu') &&
         !e.target.closest('.burger') &&
         menuList.classList.contains('menu--open')) {

         burgerLine.classList.remove('burger__line--open');
         menuList.classList.remove('menu--open');
      }
   });

})();