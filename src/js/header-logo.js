(function () {
   'use strict'
   
   // Change viewbox attribute for svg logo
   const logo = document.querySelector('.header__logo');

   changeLogoViewBox();
   window.addEventListener('resize', changeLogoViewBox);

   function changeLogoViewBox() {
      if (document.documentElement.clientWidth <= 480) {
         logo.setAttribute("viewBox", "35 0 150 211");
      } else {
         logo.setAttribute("viewBox", "0 0 765.3 211");
      }
   }
})();
