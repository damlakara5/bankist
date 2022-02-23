'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');
///////////////////////////////////////
// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//SMOOTH SCROLLING

btnScrollTo.addEventListener('click', function (e) {
  /*   const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect()); */

  /*   console.log(window.pageXOffset, window.pageYOffset);
   */
  /*   window.scrollTo(
    s1coords.left + window.pageXOffset, //the current position and the current scroll
    s1coords.top + window.pageYOffset
  ); */

  //fonka obje göndererek smoothluk ekliyoruz. sıra tam olarak böyle olmalı
  /* 
  window.scrollTo({
    left: s1coords.left + window.pageXOffset, //the current position and the current scroll
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth',
  }); */

  section1.scrollIntoView({ behavior: 'smooth' });
});

//Page navigation

document.querySelectorAll('.nav__link').forEach(function (el) {
  el.addEventListener('click', function (e) {
    e.preventDefault();
    const id = this.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
});

//Tabbed component2

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab'); /// closest parent which class name is operationstab
  //butondaki span elementine basınca da butona erişmeye çalışıyoruz. parentElement dersek o zaman butona basınca buton elementine ulaşamayız

  //Guard clause
  if (!clicked) return;

  //ACTIVE TAB
  //clearing class all of them then adding the one we need
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  //ACTIVE CONTent area
  tabsContent.forEach(cont =>
    cont.classList.remove('operations__content--active')
  );
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`) //attribute ismi data ile başladığı için dataset ve sonrasında attribute ismninde data kısmından sonraki
    .classList.add('operations__content--active');
});

//link animation

const handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('nav').querySelectorAll('.nav__link');
    const logo = link.closest('nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = opacity;
        logo.style.opacity = opacity;
      }
    });
  }
};
nav.addEventListener('mouseover', function (e) {
  //mouseover like hover . mouseenter dan farkı mouseenter da bubble yok
  handleHover(e, 0.5);
});

nav.addEventListener('mouseout', function (e) {
  handleHover(e, 1);
});

//Sticky Navigation

/* const initialCoords = section1.getBoundingClientRect();
window.addEventListener('scroll', function () {
  if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
});

const obsCallback = function (entries, observer) {
  entries.forEach(entry => {});
};

const obsOptions = {
  root: null, //if root is null it  means root is the viewport
  threshold: [0, 0.2], // rootta bu yüzde kadar visible olmak    0% target hiç görünmediğinde
};

const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(section1); */
const navHeight = nav.getBoundingClientRect().height;
const stcikyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stcikyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

//reveal sections

const revealSections = function (entries, observer) {
  const [entry] = entries;
  //bütün sectionları observelediğimiz için hangi sectionun target old önemli
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSections, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//Lazy Loading Images
const imgTargets = document.querySelectorAll('img[data-src]'); //img s which has data-src attributes

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  //Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

//Slide

slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`));
let curSlide = 0;
const maxSlide = slides.length;

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

createDots();

const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

activateDot(0);

const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};

// Next slide
const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }

  goToSlide(curSlide);
  activateDot(curSlide);
};

const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};

// Event handlers
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') prevSlide();
  e.key === 'ArrowRight' && nextSlide();
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    goToSlide(slide);
    activateDot(slide);
  }
});
/////LESSONS
/////////////////////////
////////////////////////////
//Creating and inserting elements

const message = document.createElement('div'); //tag ismi alır
message.classList.add('cookie-message');
/* message.textContent =
  'We used cookies for improved functionality and analytics '; */
message.innerHTML =
  'We used cookies for improved functionality and analytics <button class="btn btn--close-cookie">Got it!</button>';

/* header.prepend(message); //prepend elementi first child olarak ekler*/
header.append(message); //last child olarak ekler
/* //iki kere eklemiş gibi görünse de element live old için aynı anda iki yere eklenemez
header.before(message); //headerdan önce
header.after(message); //headerdan sonra */

//Delete elements
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  });

//Styles
console.log(getComputedStyle(message).color); //js dosyasında olmadığı sürece normal şekilde erişemem
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px'; //getComputedStyle(message).height direkt 40px gibi bir
//şey basacağı için int ile toplarken sıkıntı olur o yüzden num kısmını alıyoruz

//document.documentElement.style.setProperty('--color-primary', 'orangered');
//root variables için document.documentElement

/////////////
//Attributes

//SMOOTH SCROLLING
/* const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect()); */

/*   console.log(window.pageXOffset, window.pageYOffset);
 */
/*   window.scrollTo(
    s1coords.left + window.pageXOffset, //the current position and the current scroll
    s1coords.top + window.pageYOffset
  ); */

//fonka obje göndererek smoothluk ekliyoruz. sıra tam olarak böyle olmalı
/* 
  window.scrollTo({
    left: s1coords.left + window.pageXOffset, //the current position and the current scroll
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth',
  }); */

/*   section1.scrollIntoView({ behavior: 'smooth' });
}); */

/* //event handlers
const h1 = document.querySelector('h1');

const alerth1 = function (e) {
  alert('lkadjlkdjlakjlajdl');

  //h1.removeEventListener('mouseenter', alerth1); //bunun için fonkun dışada tanımlanması gerekir
  //böylelikle sadece bir kere olmuş olur
};

h1.addEventListener('mouseenter', alerth1);

setTimeout(() => h1.removeEventListener('mouseenter', alerth1), 3000); //belli bir süre sonra olmaması için
 */
/* h1.onmouseenter = function (e) {   old school
  alert('fafafa');
}; */

/////BUBBLING AND  CAPTURING
/* const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgba(${randomInt(0, 255)}, ${randomInt(0, 255)},${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  //in event handlers this keyword points always to the element on which event handlers is attached
  this.style.backgroundColor = randomColor();
  //this === e.currentTarget

  //e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
}); */

//sibling, child, parent
/* const h1 = document.querySelector('h1');

console.log(h1.querySelectorAll('.highlight'));
//querySelector bu classtaki bütün childları seçer, direct child olmasına gerek yok ve aynı ısimde class olan başka elemen varsa onları seçmez sadece h1 ın childlarını seçer
console.log(h1.firstElementChild);
console.log(h1.closest('.header')); //bu classa sahip ilk parent lement

console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling); */

//direct parent element bulup çocuklarına inersek ve h1 ın bütün siblinglerini bulmuş oluruz
/* [...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.5)';
}); */

window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  e.returnValue = '';
});
