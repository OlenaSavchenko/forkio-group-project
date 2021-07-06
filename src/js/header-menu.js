(function () {
   'use strict'
   const menuBurger = document.querySelector('.burger');
   const burgerLine = menuBurger.children[0];
   const menuList = document.querySelector('.menu');

   function toggleClasses(){
      burgerLine.classList.toggle('burger__line--open');
      menuList.classList.toggle('menu--open');
   }

   // Бургер меню
   menuBurger.addEventListener('click',toggleClasses );
   
   // Клик вне крестика
  

})();