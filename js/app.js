/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// CONCATENATED MODULE: ./src/js/files/functions.js
let isMobile = { Android: function () { return navigator.userAgent.match(/Android/i); }, BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); }, iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, Opera: function () { return navigator.userAgent.match(/Opera Mini/i); }, Windows: function () { return navigator.userAgent.match(/IEMobile/i); }, any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } };

// Уникализация массива
function uniqArray(array) {
  return array.filter(function (item, index, self) {
    return self.indexOf(item) === index;
  });
}

function addTouchClass() {
  // Добавление класса _touch для HTML, если мобильный браузер
  if (isMobile.any()) document.documentElement.classList.add('touch');
}

function getHash() {
  if (location.hash) { return location.hash.replace('#', ''); }
}

function menuOpen() {
  window.addEventListener("load", function () {
    document.addEventListener("click", function (e) {
      const targetElement = e.target;
      if (!targetElement.closest(".icon-menu")) return;
      if (targetElement.closest(".icon-menu")) {
        document.documentElement.classList.toggle("menu-open");
        document.documentElement.classList.toggle("lock");
      }
    });
  });
}
// Показ шапки при скролле
function headerScroll() {
  const headerElement = document.querySelector(".header");

  const callback = function (entries, callback) {
    if (entries[0].isIntersecting) {
      headerElement.classList.remove("_header-scroll");
    } else {
      headerElement.classList.add("_header-scroll");
    }
  }
  const observerHeader = new IntersectionObserver(callback);
  observerHeader.observe(headerElement);
};

// Watcher 
function elementWatches() {
  const watchElements = document.querySelectorAll("[data-watch]");
  const observerSections = function (entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("_watching");
        observer.unobserve(entry.target);
      }
    });
  };
  watchElements.forEach(section => {
    let thresholdValue;
    if (section.dataset.watchThreshold) {
      thresholdValue = section.dataset.watchThreshold ? section.dataset.watchThreshold : 0;
    }
    if (section.dataset.watchParallax) {
      let parallaxValue = section.dataset.watchParallax ? section.dataset.watchParallax : 500;
      console.log(parallaxValue);
    }
    const observer = new IntersectionObserver(observerSections, {
      threshold: thresholdValue,
    });
    observer.observe(section);
  });
}
// Скролл к нужному блоку
function gotoScroll() {
  const gotoLinks = document.querySelectorAll("[data-goto]");
  if (gotoLinks.length) {
    gotoLinks.forEach(gotoLink => {
      gotoLink.addEventListener("click", onMenuLinkClick);
    });

    function onMenuLinkClick(e) {
      e.preventDefault();
      const gotoTargetLink = e.target;
      const gotoCurrentLink = gotoTargetLink.closest("[data-goto]").dataset.goto;
      if (gotoTargetLink.dataset.goto && document.querySelector(gotoTargetLink.dataset.goto)) {
        const gotoBlock = document.querySelector(gotoCurrentLink);
        const gotoLinkHeader = gotoTargetLink.hasAttribute("data-goto-header");
        const gotoLinkHeaderHeight = document.querySelector("header").offsetHeight;
        const gotoLinkOffsetTop = gotoTargetLink.hasAttribute("data-goto-top");
        const gotoLinkOffsetTopValue = gotoTargetLink.dataset.gotoTop ? gotoTargetLink.dataset.gotoTop : 0;
        let gotoTargetBlockPosition = gotoBlock.offsetTop;
        gotoTargetBlockPosition = gotoLinkHeader ? gotoTargetBlockPosition - gotoLinkHeaderHeight : gotoTargetBlockPosition;
        gotoTargetBlockPosition = gotoLinkOffsetTop ? gotoTargetBlockPosition - gotoLinkOffsetTopValue : gotoTargetBlockPosition;
        window.scrollTo({
          top: gotoTargetBlockPosition,
          behavior: "smooth",
        });
      }

      if (document.documentElement.classList.contains("menu-open")) {
        document.documentElement.classList.remove("menu-open", "lock")
      }

    };
  }
}

// Переключение темы сайта
//========================================================================================================================================================
function themeToggle() {
  const html = document.documentElement, mode = localStorage.getItem('mode') || 'auto';
  const getPreferredMode = () => matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  const switchMode = mode => {
    const newMode = mode === 'auto' ? getPreferredMode() : mode
    html.classList.remove('light', 'dark')
    html.classList.add(`${newMode}`)
    localStorage.setItem('mode', mode)
    document.querySelectorAll('[data-mode]').forEach(el => el.classList.toggle('_active-theme-btn', el.dataset.mode === mode))
  }

  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (localStorage.getItem('mode') === 'auto') switchMode('auto')
  })

  document.addEventListener('click', e => e.target.dataset.mode && switchMode(e.target.dataset.mode))
  switchMode(mode)
}
//========================================================================================================================================================

/*Модуль звездного рейтинга */
function formRating() {
  const ratings = document.querySelectorAll('.rating');
  if (ratings.length > 0) {
    initRatings();
  }
  // Основная функция
  function initRatings() {
    let ratingActive, ratingValue;
    // "Бегаем" по всем рейтингам на странице
    for (let index = 0; index < ratings.length; index++) {
      const rating = ratings[index];
      initRating(rating);
    }
    // Инициализируем конкретный рейтинг
    function initRating(rating) {
      initRatingVars(rating);

      setRatingActiveWidth();

      if (rating.classList.contains('rating_set')) {
        setRating(rating);
      }
    }
    // Инициализация переменных
    function initRatingVars(rating) {
      ratingActive = rating.querySelector('.rating__active');
      ratingValue = rating.querySelector('.rating__value');
    }
    // Изменяем ширину активных звезд
    function setRatingActiveWidth(index = ratingValue.innerHTML) {
      const ratingActiveWidth = index / 0.05;
      ratingActive.style.width = `${ratingActiveWidth}%`;
    }
    // Возможность указать оценку
    function setRating(rating) {
      const ratingItems = rating.querySelectorAll('.rating__item');
      for (let index = 0; index < ratingItems.length; index++) {
        const ratingItem = ratingItems[index];
        ratingItem.addEventListener("mouseenter", function (e) {
          // Обновление переменных
          initRatingVars(rating);
          // Обновление активных звезд
          setRatingActiveWidth(ratingItem.value);
        });
        ratingItem.addEventListener("mouseleave", function (e) {
          // Обновление активных звезд
          setRatingActiveWidth();
        });
        ratingItem.addEventListener("click", function (e) {
          // Обновление переменных
          initRatingVars(rating);

          if (rating.dataset.ajax) {
            // "Отправить" на сервер
            setRatingValue(ratingItem.value, rating);
          } else {
            // Отобразить указанную оценку
            ratingValue.innerHTML = index + 1;
            setRatingActiveWidth();
          }
        });
      }
    }
    async function setRatingValue(value, rating) {
      if (!rating.classList.contains('rating_sending')) {
        rating.classList.add('rating_sending');

        // // Отправка данных (value) на сервер
        // let response = await fetch('/files/product.json', {
        //   method: 'GET',

        //   body: JSON.stringify({
        //     userRating: value
        //   }),
        //   headers: {
        //     'content-type': 'application/json'
        //   }

        // });
        if (response.ok) {
          const result = await response.json();

          // Получаем новый рейтинг
          const newRating = result.newRating;

          // Вывод нового среднего результата
          ratingValue.innerHTML = newRating;

          // Обновление активных звезд
          setRatingActiveWidth();

          rating.classList.remove('rating_sending');
        } else {
          alert("Ошибка");

          rating.classList.remove('rating_sending');
        }
      }
    }
  }
}
//========================================================================================================================================================
function loopScroller() {
  const scroller = document.querySelectorAll(".scroller");
  if (scroller) {
    scroller.forEach(scrollerBlock => {
      scrollerBlock.setAttribute("data-scroll-animation", "true");
      const count = 4;  // Количество копий всех элементов
      const scrollerInner = scrollerBlock.querySelector(".scroller__inner");
      const scrollerContent = Array.from(scrollerInner.children);

      // Сначала добавляем оригинальные элементы (если они не добавлены)
      scrollerContent.forEach(contentScroller => {
        scrollerInner.append(contentScroller);
      });

      // Клонируем все элементы count раз
      for (let i = 0; i < count; i++) {
        scrollerContent.forEach(contentScroller => {
          const scrollerInnerClone = contentScroller.cloneNode(true);
          scrollerInnerClone.setAttribute("aria-hidden", "true");
          scrollerInner.append(scrollerInnerClone);
        });
      }
    });
  }
}
//========================================================================================================================================================
let _slideUp = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains('_slide')) {
    target.classList.add('_slide');
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = duration + 'ms';
    target.style.height = `${target.offsetHeight}px`;
    target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout(() => {
      target.hidden = !showmore ? true : false;
      !showmore ? target.style.removeProperty('height') : null;
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      !showmore ? target.style.removeProperty('overflow') : null;
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
      target.classList.remove('_slide');
      // Создаем событие
      document.dispatchEvent(new CustomEvent("slideUpDone", {
        detail: {
          target: target
        }
      }));
    }, duration);
  }
}
let _slideDown = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains('_slide')) {
    target.classList.add('_slide');
    target.hidden = target.hidden ? false : null;
    showmore ? target.style.removeProperty('height') : null;
    let height = target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + 'ms';
    target.style.height = height + 'px';
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    window.setTimeout(() => {
      target.style.removeProperty('height');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
      target.classList.remove('_slide');
      // Создаем событие
      document.dispatchEvent(new CustomEvent("slideDownDone", {
        detail: {
          target: target
        }
      }));
    }, duration);
  }
}
let _slideToggle = (target, duration = 500) => {
  if (target.hidden) {
    return _slideDown(target, duration);
  } else {
    return _slideUp(target, duration);
  }
}
//========================================================================================================================================================
let bodyLockStatus = true;
let bodyLockToggle = (delay = 500) => {
  if (document.documentElement.classList.contains('lock')) {
    bodyUnlock(delay);
  } else {
    bodyLock(delay);
  }
}
let bodyUnlock = (delay = 500) => {
  let body = document.querySelector("body");
  if (bodyLockStatus) {
    let lock_padding = document.querySelectorAll("[data-lp]");
    setTimeout(() => {
      for (let index = 0; index < lock_padding.length; index++) {
        const el = lock_padding[index];
        el.style.paddingRight = '0px';
      }
      body.style.paddingRight = '0px';
      document.documentElement.classList.remove("lock");
    }, delay);
    bodyLockStatus = false;
    setTimeout(function () {
      bodyLockStatus = true;
    }, delay);
  }
}
let bodyLock = (delay = 500) => {
  let body = document.querySelector("body");
  if (bodyLockStatus) {
    let lock_padding = document.querySelectorAll("[data-lp]");
    for (let index = 0; index < lock_padding.length; index++) {
      const el = lock_padding[index];
      el.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
    }
    body.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
    document.documentElement.classList.add("lock");

    bodyLockStatus = false;
    setTimeout(function () {
      bodyLockStatus = true;
    }, delay);
  }
}
//========================================================================================================================================================

// Спойлеры
function spollers() {
  const spollersArray = document.querySelectorAll('[data-spollers]');
  if (spollersArray.length > 0) {
    // Событие клика
    document.addEventListener("click", setSpollerAction);
    // Получение обычных слойлеров
    const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
      return !item.dataset.spollers.split(",")[0];
    });
    // Инициализация обычных слойлеров
    if (spollersRegular.length) {
      initSpollers(spollersRegular);
    }
    // Получение слойлеров с медиа-запросами
    let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
    if (mdQueriesArray && mdQueriesArray.length) {
      mdQueriesArray.forEach(mdQueriesItem => {
        // Событие
        mdQueriesItem.matchMedia.addEventListener("change", function () {
          initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
        });
        initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
      });
    }
    // Инициализация
    function initSpollers(spollersArray, matchMedia = false) {
      spollersArray.forEach(spollersBlock => {
        spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
        if (matchMedia.matches || !matchMedia) {
          spollersBlock.classList.add('_spoller-init');
          initSpollerBody(spollersBlock);
        } else {
          spollersBlock.classList.remove('_spoller-init');
          initSpollerBody(spollersBlock, false);
        }
      });
    }
    // Работа с контентом
    function initSpollerBody(spollersBlock, hideSpollerBody = true) {
      let spollerItems = spollersBlock.querySelectorAll('details');
      if (spollerItems.length) {
        //spollerItems = Array.from(spollerItems).filter(item => item.closest('[data-spollers]') === spollersBlock);
        spollerItems.forEach(spollerItem => {
          let spollerTitle = spollerItem.querySelector('summary');
          if (hideSpollerBody) {
            spollerTitle.removeAttribute('tabindex');
            if (!spollerItem.hasAttribute('data-open')) {
              spollerItem.open = false;
              spollerTitle.nextElementSibling.hidden = true;
            } else {
              spollerTitle.classList.add('_spoller-active');
              spollerItem.open = true;
            }
          } else {
            spollerTitle.setAttribute('tabindex', '-1');
            spollerTitle.classList.remove('_spoller-active');
            spollerItem.open = true;
            spollerTitle.nextElementSibling.hidden = false;
          }
        });
      }
    }
    function setSpollerAction(e) {
      const el = e.target;
      if (el.closest('summary') && el.closest('[data-spollers]')) {
        e.preventDefault();
        if (el.closest('[data-spollers]').classList.contains('_spoller-init')) {
          const spollerTitle = el.closest('summary');
          const spollerBlock = spollerTitle.closest('details');
          const spollersBlock = spollerTitle.closest('[data-spollers]');
          const oneSpoller = spollersBlock.hasAttribute('data-one-spoller');
          const scrollSpoller = spollerBlock.hasAttribute('data-spoller-scroll');
          const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
          if (!spollersBlock.querySelectorAll('._slide').length) {
            if (oneSpoller && !spollerBlock.open) {
              hideSpollersBody(spollersBlock);
            }

            !spollerBlock.open ? spollerBlock.open = true : setTimeout(() => { spollerBlock.open = false }, spollerSpeed);

            spollerTitle.classList.toggle('_spoller-active');
            _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);

            if (scrollSpoller && spollerTitle.classList.contains('_spoller-active')) {
              const scrollSpollerValue = spollerBlock.dataset.spollerScroll;
              const scrollSpollerOffset = +scrollSpollerValue ? +scrollSpollerValue : 0;
              const scrollSpollerNoHeader = spollerBlock.hasAttribute('data-spoller-scroll-noheader') ? document.querySelector('.header').offsetHeight : 0;

              //setTimeout(() => {
              window.scrollTo(
                {
                  top: spollerBlock.offsetTop - (scrollSpollerOffset + scrollSpollerNoHeader),
                  behavior: "smooth",
                }
              );
              //}, spollerSpeed);
            }
          }
        }
      }
      // Закрытие при клике вне спойлера
      if (!el.closest('[data-spollers]')) {
        const spollersClose = document.querySelectorAll('[data-spoller-close]');
        if (spollersClose.length) {
          spollersClose.forEach(spollerClose => {
            const spollersBlock = spollerClose.closest('[data-spollers]');
            const spollerCloseBlock = spollerClose.parentNode;
            if (spollersBlock.classList.contains('_spoller-init')) {
              const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
              spollerClose.classList.remove('_spoller-active');
              _slideUp(spollerClose.nextElementSibling, spollerSpeed);
              setTimeout(() => { spollerCloseBlock.open = false }, spollerSpeed);
            }
          });
        }
      }
    }
    function hideSpollersBody(spollersBlock) {
      const spollerActiveBlock = spollersBlock.querySelector('details[open]');
      if (spollerActiveBlock && !spollersBlock.querySelectorAll('._slide').length) {
        const spollerActiveTitle = spollerActiveBlock.querySelector('summary');
        const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
        spollerActiveTitle.classList.remove('_spoller-active');
        _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
        setTimeout(() => { spollerActiveBlock.open = false }, spollerSpeed);
      }
    }
  }
}
//========================================================================================================================================================

// ТАБЫ
function tabs() {
  const tabs = document.querySelectorAll('[data-tabs]');
  let tabsActiveHash = [];

  if (tabs.length > 0) {
    const hash = getHash();
    if (hash && hash.startsWith('tab-')) {
      tabsActiveHash = hash.replace('tab-', '').split('-');
    }
    tabs.forEach((tabsBlock, index) => {
      tabsBlock.classList.add('_tab-init');
      tabsBlock.setAttribute('data-tabs-index', index);
      tabsBlock.addEventListener("click", setTabsAction);
      initTabs(tabsBlock);
    });

    // Получение слойлеров с медиа-запросами
    let mdQueriesArray = dataMediaQueries(tabs, "tabs");
    if (mdQueriesArray && mdQueriesArray.length) {
      mdQueriesArray.forEach(mdQueriesItem => {
        // Подія
        mdQueriesItem.matchMedia.addEventListener("change", function () {
          setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
        });
        setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
      });
    }
  }
  // Установка позиций заголовков
  function setTitlePosition(tabsMediaArray, matchMedia) {
    tabsMediaArray.forEach(tabsMediaItem => {
      tabsMediaItem = tabsMediaItem.item;
      let tabsTitles = tabsMediaItem.querySelector('[data-tabs-titles]');
      let tabsTitleItems = tabsMediaItem.querySelectorAll('[data-tabs-title]');
      let tabsContent = tabsMediaItem.querySelector('[data-tabs-body]');
      let tabsContentItems = tabsMediaItem.querySelectorAll('[data-tabs-item]');
      tabsTitleItems = Array.from(tabsTitleItems).filter(item => item.closest('[data-tabs]') === tabsMediaItem);
      tabsContentItems = Array.from(tabsContentItems).filter(item => item.closest('[data-tabs]') === tabsMediaItem);
      tabsContentItems.forEach((tabsContentItem, index) => {
        if (matchMedia.matches) {
          tabsContent.append(tabsTitleItems[index]);
          tabsContent.append(tabsContentItem);
          tabsMediaItem.classList.add('_tab-spoller');
        } else {
          tabsTitles.append(tabsTitleItems[index]);
          tabsMediaItem.classList.remove('_tab-spoller');
        }
      });
    });
  }
  // Работа с контентом
  function initTabs(tabsBlock) {
    let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-titles]>*');
    let tabsContent = tabsBlock.querySelectorAll('[data-tabs-body]>*');
    const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
    const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;

    if (tabsActiveHashBlock) {
      const tabsActiveTitle = tabsBlock.querySelector('[data-tabs-titles]>._tab-active');
      tabsActiveTitle ? tabsActiveTitle.classList.remove('_tab-active') : null;
    }
    if (tabsContent.length) {
      //tabsContent = Array.from(tabsContent).filter(item => item.closest('[data-tabs]') === tabsBlock);
      //tabsTitles = Array.from(tabsTitles).filter(item => item.closest('[data-tabs]') === tabsBlock);
      tabsContent.forEach((tabsContentItem, index) => {
        tabsTitles[index].setAttribute('data-tabs-title', '');
        tabsContentItem.setAttribute('data-tabs-item', '');

        if (tabsActiveHashBlock && index == tabsActiveHash[1]) {
          tabsTitles[index].classList.add('_tab-active');
        }
        tabsContentItem.hidden = !tabsTitles[index].classList.contains('_tab-active');
      });
    }
  }
  function setTabsStatus(tabsBlock) {
    let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-title]');
    let tabsContent = tabsBlock.querySelectorAll('[data-tabs-item]');
    const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
    function isTabsAnamate(tabsBlock) {
      if (tabsBlock.hasAttribute('data-tabs-animate')) {
        return tabsBlock.dataset.tabsAnimate > 0 ? Number(tabsBlock.dataset.tabsAnimate) : 500;
      }
    }
    const tabsBlockAnimate = isTabsAnamate(tabsBlock);
    if (tabsContent.length > 0) {
      const isHash = tabsBlock.hasAttribute('data-tabs-hash');
      tabsContent = Array.from(tabsContent).filter(item => item.closest('[data-tabs]') === tabsBlock);
      tabsTitles = Array.from(tabsTitles).filter(item => item.closest('[data-tabs]') === tabsBlock);
      tabsContent.forEach((tabsContentItem, index) => {
        if (tabsTitles[index].classList.contains('_tab-active')) {
          if (tabsBlockAnimate) {
            _slideDown(tabsContentItem, tabsBlockAnimate);
          } else {
            tabsContentItem.hidden = false;
          }
          if (isHash && !tabsContentItem.closest('.popup')) {
            setHash(`tab-${tabsBlockIndex}-${index}`);
          }
        } else {
          if (tabsBlockAnimate) {
            _slideUp(tabsContentItem, tabsBlockAnimate);
          } else {
            tabsContentItem.hidden = true;
          }
        }
      });
    }
  }
  function setTabsAction(e) {
    const el = e.target;
    if (el.closest('[data-tabs-title]')) {
      const tabTitle = el.closest('[data-tabs-title]');
      const tabsBlock = tabTitle.closest('[data-tabs]');
      if (!tabTitle.classList.contains('_tab-active') && !tabsBlock.querySelector('._slide')) {
        let tabActiveTitle = tabsBlock.querySelectorAll('[data-tabs-title]._tab-active');
        tabActiveTitle.length ? tabActiveTitle = Array.from(tabActiveTitle).filter(item => item.closest('[data-tabs]') === tabsBlock) : null;
        tabActiveTitle.length ? tabActiveTitle[0].classList.remove('_tab-active') : null;
        tabTitle.classList.add('_tab-active');
        setTabsStatus(tabsBlock);
      }
      e.preventDefault();
    }
  }
}
//========================================================================================================================================================

// Показать еще 
function showMore() {
  window.addEventListener("load", function (e) {
    const showMoreBlocks = document.querySelectorAll('[data-showmore]');
    let showMoreBlocksRegular;
    let mdQueriesArray;
    if (showMoreBlocks.length) {
      // Получение обычных объектов
      showMoreBlocksRegular = Array.from(showMoreBlocks).filter(function (item, index, self) {
        return !item.dataset.showmoreMedia;
      });
      // Инициализация обычных объектов
      showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;

      document.addEventListener("click", showMoreActions);
      window.addEventListener("resize", showMoreActions);

      // Получение объектов с медиа-запросами
      mdQueriesArray = dataMediaQueries(showMoreBlocks, "showmoreMedia");
      if (mdQueriesArray && mdQueriesArray.length) {
        mdQueriesArray.forEach(mdQueriesItem => {
          // Событие
          mdQueriesItem.matchMedia.addEventListener("change", function () {
            initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
          });
        });
        initItemsMedia(mdQueriesArray);
      }
    }
    function initItemsMedia(mdQueriesArray) {
      mdQueriesArray.forEach(mdQueriesItem => {
        initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
      });
    }
    function initItems(showMoreBlocks, matchMedia) {
      showMoreBlocks.forEach(showMoreBlock => {
        initItem(showMoreBlock, matchMedia);
      });
    }
    function initItem(showMoreBlock, matchMedia = false) {
      showMoreBlock = matchMedia ? showMoreBlock.item : showMoreBlock;
      let showMoreContent = showMoreBlock.querySelectorAll('[data-showmore-content]');
      let showMoreButton = showMoreBlock.querySelectorAll('[data-showmore-button]');
      showMoreContent = Array.from(showMoreContent).filter(item => item.closest('[data-showmore]') === showMoreBlock)[0];
      showMoreButton = Array.from(showMoreButton).filter(item => item.closest('[data-showmore]') === showMoreBlock)[0];
      const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
      if (matchMedia.matches || !matchMedia) {
        if (hiddenHeight < getOriginalHeight(showMoreContent)) {
          _slideUp(showMoreContent, 0, showMoreBlock.classList.contains('_showmore-active') ? getOriginalHeight(showMoreContent) : hiddenHeight);
          showMoreButton.hidden = false;
        } else {
          _slideDown(showMoreContent, 0, hiddenHeight);
          showMoreButton.hidden = true;
        }
      } else {
        _slideDown(showMoreContent, 0, hiddenHeight);
        showMoreButton.hidden = true;
      }
    }
    function getHeight(showMoreBlock, showMoreContent) {
      let hiddenHeight = 0;
      const showMoreType = showMoreBlock.dataset.showmore ? showMoreBlock.dataset.showmore : 'size';
      const rowGap = parseFloat(getComputedStyle(showMoreContent).rowGap) ? parseFloat(getComputedStyle(showMoreContent).rowGap) : 0;
      if (showMoreType === 'items') {
        const showMoreTypeValue = showMoreContent.dataset.showmoreContent ? showMoreContent.dataset.showmoreContent : 3;
        const showMoreItems = showMoreContent.children;
        for (let index = 1; index < showMoreItems.length; index++) {
          const showMoreItem = showMoreItems[index - 1];
          const marginTop = parseFloat(getComputedStyle(showMoreItem).marginTop) ? parseFloat(getComputedStyle(showMoreItem).marginTop) : 0;
          const marginBottom = parseFloat(getComputedStyle(showMoreItem).marginBottom) ? parseFloat(getComputedStyle(showMoreItem).marginBottom) : 0;
          hiddenHeight += showMoreItem.offsetHeight + marginTop;
          if (index == showMoreTypeValue) break;
          hiddenHeight += marginBottom;
        }
        rowGap ? hiddenHeight += (showMoreTypeValue - 1) * rowGap : null;
      } else {
        const showMoreTypeValue = showMoreContent.dataset.showmoreContent ? showMoreContent.dataset.showmoreContent : 150;
        hiddenHeight = showMoreTypeValue;
      }
      return hiddenHeight;
    }

    function getOriginalHeight(showMoreContent) {
      let parentHidden;
      let hiddenHeight = showMoreContent.offsetHeight;
      showMoreContent.style.removeProperty('height');
      if (showMoreContent.closest(`[hidden]`)) {
        parentHidden = showMoreContent.closest(`[hidden]`);
        parentHidden.hidden = false;
      }
      let originalHeight = showMoreContent.offsetHeight;
      parentHidden ? parentHidden.hidden = true : null;
      showMoreContent.style.height = `${hiddenHeight}px`;
      return originalHeight;
    }
    function showMoreActions(e) {
      const targetEvent = e.target;
      const targetType = e.type;
      if (targetType === 'click') {
        if (targetEvent.closest('[data-showmore-button]')) {
          const showMoreButton = targetEvent.closest('[data-showmore-button]');
          const showMoreBlock = showMoreButton.closest('[data-showmore]');
          const showMoreContent = showMoreBlock.querySelector('[data-showmore-content]');
          const showMoreSpeed = showMoreBlock.dataset.showmoreButton ? showMoreBlock.dataset.showmoreButton : '500';
          const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
          if (!showMoreContent.classList.contains('_slide')) {
            showMoreBlock.classList.contains('_showmore-active') ? _slideUp(showMoreContent, showMoreSpeed, hiddenHeight) : _slideDown(showMoreContent, showMoreSpeed, hiddenHeight);
            showMoreBlock.classList.toggle('_showmore-active');
          }
        }
      } else if (targetType === 'resize') {
        showMoreBlocksRegular && showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;
        mdQueriesArray && mdQueriesArray.length ? initItemsMedia(mdQueriesArray) : null;
      }
    }
  });
}
//========================================================================================================================================================

function dataMediaQueries(array, dataSetValue) {
  // Получение объектов с медиа-запросами
  const media = Array.from(array).filter(function (item, index, self) {
    if (item.dataset[dataSetValue]) {
      return item.dataset[dataSetValue].split(",")[0];
    }
  });
  // Инициализация объектов с медиа-запросами
  if (media.length) {
    const breakpointsArray = [];
    media.forEach(item => {
      const params = item.dataset[dataSetValue];
      const breakpoint = {};
      const paramsArray = params.split(",");
      breakpoint.value = paramsArray[0];
      breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
      breakpoint.item = item;
      breakpointsArray.push(breakpoint);
    });
    // Получаем уникальные брейкпоинты
    let mdQueries = breakpointsArray.map(function (item) {
      return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
    });
    mdQueries = uniqArray(mdQueries);
    const mdQueriesArray = [];

    if (mdQueries.length) {
      // Работаем с каждым брейкпоинтом
      mdQueries.forEach(breakpoint => {
        const paramsArray = breakpoint.split(",");
        const mediaBreakpoint = paramsArray[1];
        const mediaType = paramsArray[2];
        const matchMedia = window.matchMedia(paramsArray[0]);
        // Объекты с необходимыми условиями
        const itemsArray = breakpointsArray.filter(function (item) {
          if (item.value === mediaBreakpoint && item.type === mediaType) {
            return true;
          }
        });
        mdQueriesArray.push({
          itemsArray,
          matchMedia
        })
      });
      return mdQueriesArray;
    }
  }
}
;// CONCATENATED MODULE: ./src/js/files/modules.js
const modules_flsModules = {};
;// CONCATENATED MODULE: ./src/js/files/forms.js


function formsFieldsInit(options = { viewpass: false, maskTel: false, valid: false }) {
  document.body.addEventListener("focusin", function (e) {
    const targetElement = e.target;
    if (targetElement.tagName === "INPUT" || targetElement.tagName === "TEXTAREA") {
      targetElement.parentElement.classList.add("_form-focus");
      targetElement.classList.add("_form-focus");
      forms_formValidate.removeErrorClass(targetElement);
      forms_formValidate.errorRemoveBlock(targetElement);
    }
  });
  document.body.addEventListener("focusout", function (e) {
    const targetElement = e.target;
    if (targetElement.tagName === "INPUT" || targetElement.tagName === "TEXTAREA") {
      targetElement.parentElement.classList.remove("_form-focus");
      targetElement.classList.remove("_form-focus");
    }
    targetElement.hasAttribute("data-validate") ? forms_formValidate.validateInput(targetElement) : null;
    // setTimeout(function () {
    //   if (targetElement.value.length === 0) {
    //     formValidate.removeErrorClass(targetElement);
    //     formValidate.errorRemoveBlock(targetElement);
    //   }
    // }, 5000);
  });
  if (options.viewpass) {
    document.addEventListener("click", function (e) {
      const targetElement = e.target;
      if (targetElement.closest(`[class*="__viewpass"]`)) {
        let inputPasswordType = targetElement.classList.contains("_viewpass-active") ? "password" : "text";
        targetElement.parentElement.querySelector("input").setAttribute("type", inputPasswordType);
        targetElement.classList.toggle("_viewpass-active");
      }
    });
  }
  if (options.maskTel) {
    const phoneInput = document.querySelectorAll("[data-tel-input]");
    if (phoneInput) {
      phoneInput.forEach(input => {
        input.addEventListener("input", onPhoneInput);
        input.addEventListener("keydown", onPhoneKeyDown);
        input.addEventListener("paste", onPhonePaste);
        input.addEventListener("focusin", onInputFocus);
        input.addEventListener("focusout", onInputFocusOut);
      });
    }
    function onPhoneInput(e) {
      const input = e.target;
      let inputNumbersValue = getInputNumbersValue(input);
      let formattedInputValue = "";
      let selecitonStart = input.selectionStart;
      if (!inputNumbersValue) {
        return input.value = "";
      }
      if (input.value.length != selecitonStart) {
        if (e.data && /\D/g.test(e.data)) {
          input.value = inputNumbersValue;
        }
        return;
      }
      if (["7", "8", "9"].indexOf(inputNumbersValue[0]) > -1) {
        input.setAttribute("maxlength", "18");
        // Русский номер телефона
        if (inputNumbersValue[0] == "8") {
          input.setAttribute("maxlength", "17");
        }
        if (inputNumbersValue[0] == "9") inputNumbersValue = "7" + inputNumbersValue;
        let firstSymbols = (inputNumbersValue[0] == "8") ? "8" : "+7";
        formattedInputValue = firstSymbols + " ";
        if (inputNumbersValue.length > 1) {
          formattedInputValue += "(" + inputNumbersValue.substring(1, 4);
        }
        if (inputNumbersValue.length >= 5) {
          formattedInputValue += ") " + inputNumbersValue.substring(4, 7);
        }
        if (inputNumbersValue.length >= 8) {
          formattedInputValue += "-" + inputNumbersValue.substring(7, 9);
        }
        if (inputNumbersValue.length >= 10) {
          formattedInputValue += "-" + inputNumbersValue.substring(9, 11);
        }
      } else {
        input.setAttribute("maxlength", "12");
        // НЕ Русский номер телефона
        formattedInputValue = "+" + inputNumbersValue.substring(0, 11);
      }
      input.value = formattedInputValue;
    }
    function getInputNumbersValue(input) {
      return input.value.replace(/\D/g, "");
    };
    function onPhoneKeyDown(e) {
      const input = e.target;
      if (e.keyCode == 8 && getInputNumbersValue(input).length == 1) {
        input.value = "";
        if (input.hasAttribute("data-input-valid")) {
          forms_formValidate.removeValidClass(input);
          forms_formValidate.removeErrorClass(input);
        }
      }
    };
    function onPhonePaste(e) {
      const pasted = e.clipboardData || window.Clipboard;
      const input = e.target;
      const inputNumbersValue = getInputNumbersValue(input);
      if (pasted) {
        const pastedText = pasted.getData("Text");
        if (/\D/g.test(pastedText)) {
          input.value = inputNumbersValue;
        }
      };
    };
    function onInputFocus(e) {
      const input = e.target;
      if (input.dataset.inputLabel) {
        input.parentElement.insertAdjacentHTML("beforeend", `<div class="form__label-block">${input.dataset.inputLabel}</div>`);
      }
    };
    function onInputFocusOut(e) {
      const input = e.target;
      if (input.parentElement.querySelector('.form__label-block')) {
        input.parentElement.removeChild(input.parentElement.querySelector('.form__label-block'));
      }
    };
  }
  // if (options.valid) {
  //   const inputValid = document.querySelectorAll("[data-input-valid]");
  //   if (inputValid) {
  //     inputValid.forEach(inputValidEl => {
  //       inputValidEl.addEventListener("input", function () {
  //         if (inputValidEl.value !== "") {
  //           inputValidEl.classList.add("_input-valid", "_input-valid-success");
  //         } else {
  //           inputValidEl.classList.remove("_input-valid", "_input-valid-success");
  //           formValidate.removeErrorClass(inputValidEl);
  //         }

  //         if (inputValidEl.hasAttribute("data-min-length")) {
  //           const inputMinLength = inputValidEl.dataset.minLength;
  //           if (inputValidEl.value.length < inputMinLength) {
  //             inputValidEl.classList.remove("_input-valid-success");
  //             formValidate.addErrorClass(inputValidEl);
  //             if (inputValidEl.value == "") {
  //               formValidate.removeErrorClass(inputValidEl);
  //             }
  //           } else {
  //             inputValidEl.classList.add("_input-valid-success");
  //             formValidate.removeErrorClass(inputValidEl);
  //           }
  //         }

  //         if (inputValidEl.hasAttribute("data-tel-input")) {
  //           const inputPhoneMask = inputValidEl.getAttribute("maxlength");
  //           if (inputValidEl.value.length < inputPhoneMask) {
  //             inputValidEl.classList.remove("_input-valid-success");
  //             formValidate.addErrorClass(inputValidEl);
  //             if (inputValidEl.value.length == 0) {
  //               formValidate.removeErrorClass(inputValidEl);
  //             }
  //           } else {
  //             inputValidEl.classList.add("_input-valid-success");
  //             formValidate.removeErrorClass(inputValidEl);
  //           }
  //         }
  //       })

  //     })
  //   }
  // }

  if (options.valid) {
    const inputValid = document.querySelectorAll("[data-input-valid]");
    if (inputValid) {
      inputValid.forEach(inputValidEl => {
        inputValidEl.addEventListener("input", function () {
          if (inputValidEl.value !== "") {
            forms_formValidate.addValidClass(inputValidEl);
            forms_formValidate.addValidSuccessClass(inputValidEl);
          } else {
            forms_formValidate.removeErrorClass(inputValidEl);
            forms_formValidate.removeValidClass(inputValidEl);
            forms_formValidate.removeValidSuccessClass(inputValidEl);
          }

          if (inputValidEl.hasAttribute("data-min-length")) {
            const inputMinLength = inputValidEl.dataset.minLength;
            if (inputValidEl.value.length < inputMinLength) {
              forms_formValidate.removeValidSuccessClass(inputValidEl);
              forms_formValidate.addErrorClass(inputValidEl);
              if (inputValidEl.value == "") {
                forms_formValidate.removeErrorClass(inputValidEl);
              }
            } else {
              forms_formValidate.addValidSuccessClass(inputValidEl);
              forms_formValidate.removeErrorClass(inputValidEl);
            }
          }

          if (inputValidEl.hasAttribute("data-max-length")) {
            const inputMaxLength = inputValidEl.dataset.maxLength;
            if (inputValidEl.value.length > inputMaxLength) {
              forms_formValidate.removeValidSuccessClass(inputValidEl);
              forms_formValidate.addErrorClass(inputValidEl);
            } else {
              forms_formValidate.addValidSuccessClass(inputValidEl);
              forms_formValidate.removeErrorClass(inputValidEl);
              forms_formValidate.addValidClass(inputValidEl);
            }
            if (inputValidEl.value == '') {
              forms_formValidate.removeValidClass(inputValidEl);
              forms_formValidate.removeValidSuccessClass(inputValidEl);
            }
          }

          if (inputValidEl.hasAttribute("data-tel-input")) {
            const inputPhoneMask = inputValidEl.getAttribute("maxlength");
            if (inputValidEl.value.length < inputPhoneMask) {
              forms_formValidate.removeValidSuccessClass(inputValidEl);
              forms_formValidate.addErrorClass(inputValidEl);
              if (inputValidEl.value == "") {
                forms_formValidate.removeErrorClass(inputValidEl);
              }
            } else {
              inputValidEl.classList.add("_input-valid-success");
              forms_formValidate.removeErrorClass(inputValidEl);
            }
          }
        })

      })
    }
  }

};
let forms_formValidate = {
  getErrors(form) {
    let error = 0;
    const formRequired = form.querySelectorAll("[data-required]");
    formRequired.forEach(input => {
      error += this.validateInput(input);
    });

    // const passwordConfirm = form.querySelector('[data-required="pass-confirm"]');
    // if (passwordConfirm) {
    //   error += this.checkPasswordConfirm(passwordConfirm);
    // }

    return error;
  },

  // checkPasswordConfirm(input) {
  //   let error = 0;
  //   const passwordInput = input.closest('[data-pass-confirms]').querySelector('[data-pass-input]');

  //   if (passwordInput.value !== input.value) {
  //     this.errorAddBlock(input, `Пароли не совпадают`);
  //     this.addErrorClass(input);
  //     error++;
  //   }
  //   return error;
  // },

  validateInput(input) {
    let error = 0;
    if (input.dataset.required === "tel") {
      if (input.value.length < input.getAttribute("maxlength")) {
        forms_formValidate.errorAddBlock(input, `Введите корректный номер телефона`);
        forms_formValidate.addErrorClass(input);
        error++;
      }
    }
    if (input.dataset.maxLength) {
      if (input.value.length > input.dataset.maxLength) {
        forms_formValidate.errorAddBlock(input, `Максимальное количество символов ${input.dataset.maxLength}`);
        forms_formValidate.addErrorClass(input);
        error++;
      }
    }
    if (input.dataset.minLength) {
      if (input.value.length < input.dataset.minLength) {
        forms_formValidate.errorAddBlock(input, `Минимальное количество символов ${input.dataset.minLength}`);
        forms_formValidate.addErrorClass(input);
        error++;
      }
    }
    if (input.dataset.required === "email") {
      if (forms_formValidate.emailTest(input)) {
        forms_formValidate.errorAddBlock(input, `Введите корректный email`);
        forms_formValidate.addErrorClass(input);
        error++;
      }
    } else if (input.getAttribute("type") === "checkbox" && input.checked === false) {
      forms_formValidate.addErrorClass(input);
      error++;
    }
    if (input.value === "") {
      forms_formValidate.errorAddBlock(input, "Заполните это поле");
      forms_formValidate.addErrorClass(input);
      error++;
    }
    return error;
  },
  addErrorClass(input) {
    input.parentElement.classList.add("_form-error");
    input.classList.add("_form-error");
  },
  removeErrorClass(input) {
    input.parentElement.classList.remove("_form-error");
    input.classList.remove("_form-error");
  },
  emailTest(input) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
  },
  errorAddBlock(input, text) {
    const errorBlock = input.parentElement.querySelector(".input-error");
    if (errorBlock) input.parentElement.removeChild(errorBlock);
    input.parentElement.insertAdjacentHTML("beforeend", `<div class="input-error">${text}</div>`)
  },
  errorRemoveBlock(input) {
    if (input.parentElement.querySelector(".input-error")) {
      input.parentElement.removeChild(input.parentElement.querySelector(".input-error"));
    }
  },
  addValidClass(input) {
    input.classList.add("_input-valid");
  },
  removeValidClass(input) {
    input.classList.remove("_input-valid");
  },
  addValidSuccessClass(input) {
    input.classList.add("_input-valid-success");
  },
  removeValidSuccessClass(input) {
    input.classList.remove("_input-valid-success");
  },
}
function formSubmit() {
  const forms = document.forms;
  if (forms.length) {
    for (const form of forms) {
      form.addEventListener("submit", function (e) {
        const form = e.target;
        formSubmitActions(form, e);
      });
    }
  }
  async function formSubmitActions(form, e) {
    const error = forms_formValidate.getErrors(form);
    if (error === 0) {
      const ajax = form.hasAttribute("data-ajax");
      if (ajax) {
        e.preventDefault();
        const formAction = form.getAttribute("action") ? form.getAttribute("action").trim() : "#";
        const formMethod = form.getAttribute("method") ? form.getAttribute("method").trim() : "GET";
        const formData = new FormData(form);

        form.classList.add("_sending");

        const response = await fetch(formAction, {
          method: formMethod,
          body: formData
        });
        if (response.ok) {
          // let responseResult = await response.json();
          formSent(form);
          form.classList.remove("_sending");
        } else {
          form.setAttribute("data-response-error", "#response-error");
          if (flsModules.popup) {
            const popup = form.dataset.responseError;
            popup ? flsModules.popup.open(popup) : null;
          };
          form.removeAttribute("data-response-error");
          form.classList.remove("_sending");
        }
      } else if (form.hasAttribute("data-dev")) {
        e.preventDefault();
        formSent(form);
      }
    } else {
      e.preventDefault();
    }
  }

  function formSent(form, responseResult = '') {
    document.dispatchEvent(new CustomEvent("formSent", {
      detail: {
        form: form
      }
    }));
    if (flsModules.popup) {
      const popup = form.dataset.popupMessage;
      popup ? flsModules.popup.open(popup) : null;
    }
    form.reset();
  };
}

;// CONCATENATED MODULE: ./src/js/files/select.js
// Подключение функционала "Чертоги Фрилансера"


// import { formValidate } from "../files/forms/forms.js";

// Подключение файла стилей
// Базовые стили состоят в src/scss/forms.scss
// Файл базовых стилей src/scss/forms/select.scss
/*
Документация:
Сниппет (HTML): sel
*/
/*
//Настройка
Для селектора (select):
class="имя класса" -модификатор к конкретному селекту
multiple – мультивыбор
data-class-modif= "имя модификатора"
data-tags – режим тегов, только для (только для multiple)
data-scroll -включить прокрутку для выпадающего списка дополнительно можно подключить кастомный скролл simplebar в app.js. Указанное число для атрибута ограничит высоту
data-checkbox – стилизация элементов по checkbox (только для multiple)
data-show-selected – выключает сокрытие выбранного элемента
data-search -позволяет искать по выпадающему списку
data-open – селект открыт сразу
data-submit – отправляет форму при смене селлекта

data-one-select -селекты внутри оболочки с атрибутом будут показываться только по одному
data-pseudo-label – добавляет псевдоэлемент к заголовку селлекта с указанным текстом

Для плейсхолдера (плейсхолдер – это option из value=""):
data-label для плейсхолдера, добавляет label к селектору.
data-show для плейсхолдера, показывает его в списке (только для единичного выбора)

Для элемента (option):
data-class="имя класса" -добавляет класс
data-asset="путь к картинке или текст" -добавляет структуру 2х колонок и данным
data-href="адрес ссылки" -добавляет ссылку в элемент списка
data-href-blank – откроет ссылку в новом окне
*/
/*
//Возможные доработки:
попап на мобилке
*/
// Класс постройки Select
class SelectConstructor {
  constructor(props, data = null) {
    let defaultConfig = {
      init: true,
      logging: true,
      speed: 150
    }
    this.config = Object.assign(defaultConfig, props);
    // CSS классы модуля
    this.selectClasses = {
      classSelect: "select", // Главный блок
      classSelectBody: "select__body", // Тело селекта
      classSelectTitle: "select__title", // Заголовок
      classSelectValue: "select__value", // Значения у заголовка
      classSelectLabel: "select__label", // Лейбл
      classSelectInput: "select__input", // Поле ввода
      classSelectText: "select__text", // Оболочка текстовых данных
      classSelectLink: "select__link", // Ссылка в элементе
      classSelectOptions: "select__options", // Выпадающий список
      classSelectOptionsScroll: "select__scroll", // Оболочка при скролле
      classSelectOption: "select__option", // Пункт
      classSelectContent: "select__content", // Оболочка контента в заголовке
      classSelectRow: "select__row", // Ряд
      classSelectData: "select__asset", // Дополнительные данные
      classSelectDisabled: "_select-disabled", // Запрещено
      classSelectTag: "_select-tag", // Класс тега
      classSelectOpen: "_select-open", // Список открыт
      classSelectActive: "_select-active", // Список выбран
      classSelectFocus: "_select-focus", // Список в фокусе
      classSelectMultiple: "_select-multiple", // Мульти-выбор
      classSelectCheckBox: "_select-checkbox", // Стиль чекбоксу
      classSelectOptionSelected: "_select-selected", // Выбранный пункт
      classSelectPseudoLabel: "_select-pseudo-label", // Псевдо-лейбл
    }
    this._this = this;
    // Запуск инициализации
    if (this.config.init) {
      // Получение всех select на странице
      const selectItems = data ? document.querySelectorAll(data) : document.querySelectorAll('select');
      if (selectItems.length) {
        this.selectsInit(selectItems);
      } else {
      }
    }
  }
  // Конструктор CSS класса
  getSelectClass(className) {
    return `.${className}`;
  }
  // Геттер элементов псевдоселекта
  getSelectElement(selectItem, className) {
    return {
      originalSelect: selectItem.querySelector('select'),
      selectElement: selectItem.querySelector(this.getSelectClass(className)),
    }
  }
  // Функция инициализации всех селектов
  selectsInit(selectItems) {
    selectItems.forEach((originalSelect, index) => {
      this.selectInit(originalSelect, index + 1);
    });
    // Обработчики событий...
    // ...при клике
    document.addEventListener('click', function (e) {
      this.selectsActions(e);
    }.bind(this));
    // ...при нажатии клавиши
    document.addEventListener('keydown', function (e) {
      this.selectsActions(e);
    }.bind(this));
    // ...при фокусе
    document.addEventListener('focusin', function (e) {
      this.selectsActions(e);
    }.bind(this));
    // ...при потере фокуса
    document.addEventListener('focusout', function (e) {
      this.selectsActions(e);
    }.bind(this));
  }
  // Функция инициализации конкретного селекта
  selectInit(originalSelect, index) {
    const _this = this;
    // Создаем оболочку
    let selectItem = document.createElement("div");
    selectItem.classList.add(this.selectClasses.classSelect);
    // Выводим оболочку перед оригинальным селектом
    originalSelect.parentNode.insertBefore(selectItem, originalSelect);
    // Помещаем оригинальный селект в оболочку
    selectItem.appendChild(originalSelect);
    // Скрываем оригинальный селект
    originalSelect.hidden = true;
    // Присваиваем уникальный ID
    index ? originalSelect.dataset.id = index : null;

    // Работа с плейсхолдером
    if (this.getSelectPlaceholder(originalSelect)) {
      // Запоминаем плейсхолдер
      originalSelect.dataset.placeholder = this.getSelectPlaceholder(originalSelect).value;
      // Если включен режим label
      if (this.getSelectPlaceholder(originalSelect).label.show) {
        const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement;
        selectItemTitle.insertAdjacentHTML('afterbegin', `<span class="${this.selectClasses.classSelectLabel}">${this.getSelectPlaceholder(originalSelect).label.text ? this.getSelectPlaceholder(originalSelect).label.text : this.getSelectPlaceholder(originalSelect).value}</span>`);
      }
    }
    // Конструктор основных элементов
    selectItem.insertAdjacentHTML('beforeend', `<div class="${this.selectClasses.classSelectBody}"><div hidden class="${this.selectClasses.classSelectOptions}"></div></div>`);
    // Запускаем конструктор псевдоселекта
    this.selectBuild(originalSelect);

    // Запоминаем скорость
    originalSelect.dataset.speed = originalSelect.dataset.speed ? originalSelect.dataset.speed : this.config.speed;
    this.config.speed = +originalSelect.dataset.speed;

    // Событие при изменении исходного select
    originalSelect.addEventListener('change', function (e) {
      _this.selectChange(e);
    });
  }
  // Конструктор псевдоселекта
  selectBuild(originalSelect) {
    const selectItem = originalSelect.parentElement;
    // Добавляем ID селекта
    selectItem.dataset.id = originalSelect.dataset.id;
    // Получаем класс оригинального селекта, создаем модификатор и добавляем его
    originalSelect.dataset.classModif ? selectItem.classList.add(`select_${originalSelect.dataset.classModif}`) : null;
    // Если множественный выбор, добавляем класс
    originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectMultiple) : selectItem.classList.remove(this.selectClasses.classSelectMultiple);
    // Стилизация элементов под checkbox (только для multiple)
    originalSelect.hasAttribute('data-checkbox') && originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectCheckBox) : selectItem.classList.remove(this.selectClasses.classSelectCheckBox);
    // Сеттер значение заголовка селекта
    this.setSelectTitleValue(selectItem, originalSelect);
    // Сеттер элементов списка (options)
    this.setOptions(selectItem, originalSelect);
    // Если включена опция поиска data-search, запускаем обработчик
    originalSelect.hasAttribute('data-search') ? this.searchActions(selectItem) : null;
    // Если указана настройка data-open, открываем селект
    originalSelect.hasAttribute('data-open') ? this.selectAction(selectItem) : null;
    // Обработчик disabled
    this.selectDisabled(selectItem, originalSelect);
  }
  // Функция реакций на события
  selectsActions(e) {
    const targetElement = e.target;
    const targetType = e.type;
    if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelect)) || targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag))) {
      const selectItem = targetElement.closest('.select') ? targetElement.closest('.select') : document.querySelector(`.${this.selectClasses.classSelect}[data-id="${targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag)).dataset.selectId}"]`);
      const originalSelect = this.getSelectElement(selectItem).originalSelect;
      if (targetType === 'click') {
        if (!originalSelect.disabled) {
          if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag))) {
            // Обработка клика на тег
            const targetTag = targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag));
            const optionItem = document.querySelector(`.${this.selectClasses.classSelect}[data-id="${targetTag.dataset.selectId}"] .select__option[data-value="${targetTag.dataset.value}"]`);
            this.optionAction(selectItem, originalSelect, optionItem);
          } else if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTitle))) {
            // Обработка клика на заголовок селекта
            this.selectAction(selectItem);
          } else if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectOption))) {
            // Обработка клика на элемент селекта
            const optionItem = targetElement.closest(this.getSelectClass(this.selectClasses.classSelectOption));
            this.optionAction(selectItem, originalSelect, optionItem);
          }
        }
      } else if (targetType === 'focusin' || targetType === 'focusout') {
        if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelect))) {
          targetType === 'focusin' ? selectItem.classList.add(this.selectClasses.classSelectFocus) : selectItem.classList.remove(this.selectClasses.classSelectFocus);
        }
      } else if (targetType === 'keydown' && e.code === 'Escape') {
        this.selectsСlose();
      }
    } else {
      this.selectsСlose();
    }
  }
  // Функция закрытия всех селектов
  selectsСlose(selectOneGroup) {
    const selectsGroup = selectOneGroup ? selectOneGroup : document;
    const selectActiveItems = selectsGroup.querySelectorAll(`${this.getSelectClass(this.selectClasses.classSelect)}${this.getSelectClass(this.selectClasses.classSelectOpen)}`);
    if (selectActiveItems.length) {
      selectActiveItems.forEach(selectActiveItem => {
        this.selectСlose(selectActiveItem);
      });
    }
  }
  // Функция закрытия конкретного селекта
  selectСlose(selectItem) {
    const originalSelect = this.getSelectElement(selectItem).originalSelect;
    const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
    if (!selectOptions.classList.contains('_slide')) {
      selectItem.classList.remove(this.selectClasses.classSelectOpen);
      _slideUp(selectOptions, originalSelect.dataset.speed);
      setTimeout(() => {
        selectItem.style.zIndex = '';
      }, originalSelect.dataset.speed);
    }
  }
  // Функция открытия / закрытия конкретного селекта
  selectAction(selectItem) {
    const originalSelect = this.getSelectElement(selectItem).originalSelect;
    const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
    const selectOpenzIndex = originalSelect.dataset.zIndex ? originalSelect.dataset.zIndex : 3;

    // Определяем, где отобразить выпадающий список
    this.setOptionsPosition(selectItem);

    // Если селектив размещены в элементе с дата атрибутом data-one-select
    // закрываем все открытые селективный
    if (originalSelect.closest('[data-one-select]')) {
      const selectOneGroup = originalSelect.closest('[data-one-select]');
      this.selectsСlose(selectOneGroup);
    }

    setTimeout(() => {
      if (!selectOptions.classList.contains('_slide')) {
        selectItem.classList.toggle(this.selectClasses.classSelectOpen);
        _slideToggle(selectOptions, originalSelect.dataset.speed);

        if (selectItem.classList.contains(this.selectClasses.classSelectOpen)) {
          selectItem.style.zIndex = selectOpenzIndex;
        } else {
          setTimeout(() => {
            selectItem.style.zIndex = '';
          }, originalSelect.dataset.speed);
        }
      }
    }, 0);
  }
  // Сеттер значение заголовка селекта
  setSelectTitleValue(selectItem, originalSelect) {
    const selectItemBody = this.getSelectElement(selectItem, this.selectClasses.classSelectBody).selectElement;
    const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement;
    if (selectItemTitle) selectItemTitle.remove();
    selectItemBody.insertAdjacentHTML("afterbegin", this.getSelectTitleValue(selectItem, originalSelect));
    originalSelect.hasAttribute('data-search') ? this.searchActions(selectItem) : null;
  }
  // Конструктор значения заголовка
  getSelectTitleValue(selectItem, originalSelect) {
    // Получаем выбранные текстовые значения
    let selectTitleValue = this.getSelectedOptionsData(originalSelect, 2).html;
    // Обработка значений мультивыбор
    // Если включен режим тегов (указаны настройки data-tags)
    if (originalSelect.multiple && originalSelect.hasAttribute('data-tags')) {
      selectTitleValue = this.getSelectedOptionsData(originalSelect).elements.map(option => `<span role="button" data-select-id="${selectItem.dataset.id}" data-value="${option.value}" class="_select-tag">${this.getSelectElementContent(option)}</span>`).join('');
      // Если вывод тегов во внешний блок
      if (originalSelect.dataset.tags && document.querySelector(originalSelect.dataset.tags)) {
        document.querySelector(originalSelect.dataset.tags).innerHTML = selectTitleValue;
        if (originalSelect.hasAttribute('data-search')) selectTitleValue = false;
      }
    }
    // Значение или плейсхолдер
    selectTitleValue = selectTitleValue.length ? selectTitleValue : (originalSelect.dataset.placeholder ? originalSelect.dataset.placeholder : '');
    // Если включен режим pseudo
    let pseudoAttribute = '';
    let pseudoAttributeClass = '';
    if (originalSelect.hasAttribute('data-pseudo-label')) {
      pseudoAttribute = originalSelect.dataset.pseudoLabel ? ` data-pseudo-label="${originalSelect.dataset.pseudoLabel}"` : ` data-pseudo-label="Заповніть атрибут"`;
      pseudoAttributeClass = ` ${this.selectClasses.classSelectPseudoLabel}`;
    }
    // Если есть значение, добавляем класс
    this.getSelectedOptionsData(originalSelect).values.length ? selectItem.classList.add(this.selectClasses.classSelectActive) : selectItem.classList.remove(this.selectClasses.classSelectActive);
    // Возвращаем поле ввода для поиска или текст
    if (originalSelect.hasAttribute('data-search')) {
      // Выводим поле ввода для поиска
      return `<div class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}"><input autocomplete="off" type="text" placeholder="${selectTitleValue}" data-placeholder="${selectTitleValue}" class="${this.selectClasses.classSelectInput}"></span></div>`;
    } else {
      // Если выбран элемент со своим классом
      const customClass = this.getSelectedOptionsData(originalSelect).elements.length && this.getSelectedOptionsData(originalSelect).elements[0].dataset.class ? ` ${this.getSelectedOptionsData(originalSelect).elements[0].dataset.class}` : '';
      // Выводим текстовое значение
      return `<button type="button" class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}${pseudoAttributeClass}"><span class="${this.selectClasses.classSelectContent}${customClass}">${selectTitleValue}</span></span></button>`;
    }
  }
  // Конструктор данных для значения заголовка
  getSelectElementContent(selectOption) {
    // Если для элемента указан вывод картинки или текста, перестраиваем конструкцию
    const selectOptionData = selectOption.dataset.asset ? `${selectOption.dataset.asset}` : '';
    const selectOptionDataHTML = selectOptionData.indexOf('img') >= 0 ? `<img src="${selectOptionData}" alt="">` : selectOptionData;
    let selectOptionContentHTML = ``;
    selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectRow}">` : '';
    selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectData}">` : '';
    selectOptionContentHTML += selectOptionData ? selectOptionDataHTML : '';
    selectOptionContentHTML += selectOptionData ? `</span>` : '';
    selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectText}">` : '';
    selectOptionContentHTML += selectOption.textContent;
    selectOptionContentHTML += selectOptionData ? `</span>` : '';
    selectOptionContentHTML += selectOptionData ? `</span>` : '';
    return selectOptionContentHTML;
  }
  // Получение данных плейсхолдера
  getSelectPlaceholder(originalSelect) {
    const selectPlaceholder = Array.from(originalSelect.options).find(option => !option.value);
    if (selectPlaceholder) {
      return {
        value: selectPlaceholder.textContent,
        show: selectPlaceholder.hasAttribute("data-show"),
        label: {
          show: selectPlaceholder.hasAttribute("data-label"),
          text: selectPlaceholder.dataset.label
        }
      }
    }
  }
  // Получение данных из выбранных элементов
  getSelectedOptionsData(originalSelect, type) {
    //Получаем все выбранные объекты из select
    let selectedOptions = [];
    if (originalSelect.multiple) {
      // Если мультивыбор
      // Забираем плейсхолдер, получаем остальные избранные элементы
      selectedOptions = Array.from(originalSelect.options).filter(option => option.value).filter(option => option.selected);
    } else {
      // Если единичный выбор
      selectedOptions.push(originalSelect.options[originalSelect.selectedIndex]);
    }
    return {
      elements: selectedOptions.map(option => option),
      values: selectedOptions.filter(option => option.value).map(option => option.value),
      html: selectedOptions.map(option => this.getSelectElementContent(option))
    }
  }
  // Конструктор элементов списка
  getOptions(originalSelect) {
    // Настройка скролла элементов
    const selectOptionsScroll = originalSelect.hasAttribute('data-scroll') ? `data-simplebar` : '';
    const customMaxHeightValue = +originalSelect.dataset.scroll ? +originalSelect.dataset.scroll : null;
    // Получаем элементы списка
    let selectOptions = Array.from(originalSelect.options);
    if (selectOptions.length > 0) {
      let selectOptionsHTML = ``;
      // Если указана настройка data-show, показываем плейсхолдер в списке
      if ((this.getSelectPlaceholder(originalSelect) && !this.getSelectPlaceholder(originalSelect).show) || originalSelect.multiple) {
        selectOptions = selectOptions.filter(option => option.value);
      }
      // Строим и выводим основную конструкцию
      selectOptionsHTML += `<div ${selectOptionsScroll} ${selectOptionsScroll ? `style="max-height: ${customMaxHeightValue}px"` : ''} class="${this.selectClasses.classSelectOptionsScroll}">`;
      selectOptions.forEach(selectOption => {
        // Получаем конструкцию конкретного элемента списка
        selectOptionsHTML += this.getOption(selectOption, originalSelect);
      });
      selectOptionsHTML += `</div>`;
      return selectOptionsHTML;
    }
  }
  // Конструктор конкретного елемента списку
  getOption(selectOption, originalSelect) {
    // Если элемент выбран и включен режим мультивыбора, добавляем класс
    const selectOptionSelected = selectOption.selected && originalSelect.multiple ? ` ${this.selectClasses.classSelectOptionSelected}` : '';
    // Если элемент выбран и нет настройки data-show-selected, скрываем элемент
    const selectOptionHide = selectOption.selected && !originalSelect.hasAttribute('data-show-selected') && !originalSelect.multiple ? `hidden` : ``;
    // Если для элемента указанный класс добавляем
    const selectOptionClass = selectOption.dataset.class ? ` ${selectOption.dataset.class}` : '';
    // Если указан режим ссылки
    const selectOptionLink = selectOption.dataset.href ? selectOption.dataset.href : false;
    const selectOptionLinkTarget = selectOption.hasAttribute('data-href-blank') ? `target="_blank"` : '';
    // Строим и возвращаем конструкцию элемента
    let selectOptionHTML = ``;
    selectOptionHTML += selectOptionLink ? `<a ${selectOptionLinkTarget} ${selectOptionHide} href="${selectOptionLink}" data-value="${selectOption.value}" class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}">` : `<button ${selectOptionHide} class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}" data-value="${selectOption.value}" type="button">`;
    selectOptionHTML += this.getSelectElementContent(selectOption);
    selectOptionHTML += selectOptionLink ? `</a>` : `</button>`;
    return selectOptionHTML;
  }
  // Сеттер списков (options)
  setOptions(selectItem, originalSelect) {
    // Получаем объект тела псевдоселлекта
    const selectItemOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
    // Запускаем конструктор элементов списка (options) и добавляем в тело псевдоселектора
    selectItemOptions.innerHTML = this.getOptions(originalSelect);
  }
  // Определяем, где отобразить выпадающий список
  setOptionsPosition(selectItem) {
    const originalSelect = this.getSelectElement(selectItem).originalSelect;
    const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
    const selectItemScroll = this.getSelectElement(selectItem, this.selectClasses.classSelectOptionsScroll).selectElement;
    const customMaxHeightValue = +originalSelect.dataset.scroll ? `${+originalSelect.dataset.scroll}px` : ``;
    const selectOptionsPosMargin = +originalSelect.dataset.optionsMargin ? +originalSelect.dataset.optionsMargin : 10;

    if (!selectItem.classList.contains(this.selectClasses.classSelectOpen)) {
      selectOptions.hidden = false;
      const selectItemScrollHeight = selectItemScroll.offsetHeight ? selectItemScroll.offsetHeight : parseInt(window.getComputedStyle(selectItemScroll).getPropertyValue('max-height'));
      const selectOptionsHeight = selectOptions.offsetHeight > selectItemScrollHeight ? selectOptions.offsetHeight : selectItemScrollHeight + selectOptions.offsetHeight;
      const selectOptionsScrollHeight = selectOptionsHeight - selectItemScrollHeight;
      selectOptions.hidden = true;

      const selectItemHeight = selectItem.offsetHeight;
      const selectItemPos = selectItem.getBoundingClientRect().top;
      const selectItemTotal = selectItemPos + selectOptionsHeight + selectItemHeight + selectOptionsScrollHeight;
      const selectItemResult = window.innerHeight - (selectItemTotal + selectOptionsPosMargin);

      if (selectItemResult < 0) {
        const newMaxHeightValue = selectOptionsHeight + selectItemResult;
        if (newMaxHeightValue < 100) {
          selectItem.classList.add('select--show-top');
          selectItemScroll.style.maxHeight = selectItemPos < selectOptionsHeight ? `${selectItemPos - (selectOptionsHeight - selectItemPos)}px` : customMaxHeightValue;
        } else {
          selectItem.classList.remove('select--show-top');
          selectItemScroll.style.maxHeight = `${newMaxHeightValue}px`;
        }
      }
    } else {
      setTimeout(() => {
        selectItem.classList.remove('select--show-top');
        selectItemScroll.style.maxHeight = customMaxHeightValue;
      }, +originalSelect.dataset.speed);
    }
  }
  // Обработчик клика на пункт списка
  optionAction(selectItem, originalSelect, optionItem) {
    const selectOptions = selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOptions)}`);
    if (!selectOptions.classList.contains('_slide')) {
      if (originalSelect.multiple) { // Если мультивыбор
        // Выделяем классом элемент
        optionItem.classList.toggle(this.selectClasses.classSelectOptionSelected);
        // Очищаем выбранные элементы
        const originalSelectSelectedItems = this.getSelectedOptionsData(originalSelect).elements;
        originalSelectSelectedItems.forEach(originalSelectSelectedItem => {
          originalSelectSelectedItem.removeAttribute('selected');
        });
        // Выбираем элементы
        const selectSelectedItems = selectItem.querySelectorAll(this.getSelectClass(this.selectClasses.classSelectOptionSelected));
        selectSelectedItems.forEach(selectSelectedItems => {
          originalSelect.querySelector(`option[value = "${selectSelectedItems.dataset.value}"]`).setAttribute('selected', 'selected');
        });
      } else { // Если единичный выбор
        // Если не указана настройка data-show-selected, скрываем выбранный элемент
        if (!originalSelect.hasAttribute('data-show-selected')) {
          setTimeout(() => {
            // Сначала все показать
            if (selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOption)}[hidden]`)) {
              selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOption)}[hidden]`).hidden = false;
            }
            // Скрываем избранное
            optionItem.hidden = true;
          }, this.config.speed);
        }
        originalSelect.value = optionItem.hasAttribute('data-value') ? optionItem.dataset.value : optionItem.textContent;
        this.selectAction(selectItem);
      }
      // Обновляем заголовок селекта
      this.setSelectTitleValue(selectItem, originalSelect);
      // Вызываем реакцию на смену селлекта
      this.setSelectChange(originalSelect);
    }
  }
  // Реакция на изменение оригинального select
  selectChange(e) {
    const originalSelect = e.target;
    this.selectBuild(originalSelect);
    this.setSelectChange(originalSelect);
  }
  // Обработчик смены в селекторе
  setSelectChange(originalSelect) {
    // Мгновенная валидация селлекта
    if (originalSelect.hasAttribute('data-validate')) {
      formValidate.validateInput(originalSelect);
    }
    // При смене селлекта присылаем форму
    if (originalSelect.hasAttribute('data-submit') && originalSelect.value) {
      let tempButton = document.createElement("button");
      tempButton.type = "submit";
      originalSelect.closest('form').append(tempButton);
      tempButton.click();
      tempButton.remove();
    }
    const selectItem = originalSelect.parentElement;
    // Вызов коллбек функции
    this.selectCallback(selectItem, originalSelect);
  }
  // Обработчик disabled
  selectDisabled(selectItem, originalSelect) {
    if (originalSelect.disabled) {
      selectItem.classList.add(this.selectClasses.classSelectDisabled);
      this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = true;
    } else {
      selectItem.classList.remove(this.selectClasses.classSelectDisabled);
      this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = false;
    }
  }
  // Обработчик поиска по элементам списка
  searchActions(selectItem) {
    const originalSelect = this.getSelectElement(selectItem).originalSelect;
    const selectInput = this.getSelectElement(selectItem, this.selectClasses.classSelectInput).selectElement;
    const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
    const selectOptionsItems = selectOptions.querySelectorAll(`.${this.selectClasses.classSelectOption} `);
    const _this = this;
    selectInput.addEventListener("input", function () {
      selectOptionsItems.forEach(selectOptionsItem => {
        if (selectOptionsItem.textContent.toUpperCase().includes(selectInput.value.toUpperCase())) {
          selectOptionsItem.hidden = false;
        } else {
          selectOptionsItem.hidden = true;
        }
      });
      // Если список закрыт открываем
      selectOptions.hidden === true ? _this.selectAction(selectItem) : null;
    });
  }
  // Коллбек функция
  selectCallback(selectItem, originalSelect) {
    document.dispatchEvent(new CustomEvent("selectCallback", {
      detail: {
        select: originalSelect
      }
    }));
  }
}
// Запускаем и добавляем в объект модулей
modules_flsModules.select = new SelectConstructor({});



;// CONCATENATED MODULE: ./src/js/files/script.js
window.addEventListener("DOMContentLoaded", function () {
  // windowObserver();
  document.addEventListener("click", documentActions);
});


function documentActions(e) {
  const targetElement = e.target;

  if (targetElement.closest(".profile-aside__account-current")) {
    targetElement.closest(".profile-aside__accounts").classList.toggle("_open-accounts");
  } else if (!targetElement.closest(".profile-aside__wrapper") && document.querySelector(".profile-aside__accounts._open-accounts")) {
    document.querySelector(".profile-aside__accounts").classList.remove("_open-accounts")
  }
};


function filesCheckedUpdates() {

  const fileCheckbox = document.querySelector(".list-files__checkbox");
  const checkboxInput = fileCheckbox?.querySelector(".checkbox__input");

  if (fileCheckbox && checkboxInput) {
    const filesItems = document.querySelectorAll(".item-files");

    const updateMasterCheckbox = () => {
      const allChecked = Array.from(filesItems).every(item => {
        const checkbox = item.querySelector(".checkbox__input");
        return checkbox?.checked;
      });
      checkboxInput.checked = allChecked;
    };

    checkboxInput.addEventListener("change", function (e) {
      filesItems.forEach(item => {
        const checkboxItemFiles = item.querySelector(".checkbox__input");
        if (checkboxItemFiles) {
          checkboxItemFiles.checked = e.target.checked;
          if (e.target.checked) {
            item.classList.add("item-files--active");
          } else {
            item.classList.remove("item-files--active");
          }
        }
      });
    });

    filesItems.forEach(item => {
      const checkboxItemFiles = item.querySelector(".checkbox__input");
      if (checkboxItemFiles) {
        checkboxItemFiles.addEventListener("change", function () {
          updateMasterCheckbox();

          if (this.checked) {
            item.classList.add("item-files--active");
          } else {
            item.classList.remove("item-files--active");
          }
        });
      }
    });
  }
}

filesCheckedUpdates();
;// CONCATENATED MODULE: ./src/js/app.js


// myFunctions.addTouchClass();
// Бургер меню
menuOpen();
//========================================================================================================================================================

// Переключение темы сайта
// myFunctions.themeToggle();

// показ шапки при скролле
// myFunctions.headerScroll();

//========================================================================================================================================================
// Wathcer
// myFunctions.elementWatches();
//========================================================================================================================================================

// Скролл к нужному блоку
// myFunctions.gotoScroll();

//========================================================================================================================================================

// Табы
// myFunctions.tabs();
//========================================================================================================================================================

// Spollers
// myFunctions.spollers();

//========================================================================================================================================================
// Scroller
// myFunctions.loopScroller();

//========================================================================================================================================================

// Звездный рейтинг
// myFunctions.formRating();
//========================================================================================================================================================
// import "./libs/popup.js";

//====Показать еще ====================================================================================================================================================
// myFunctions.showMore();

//========================================================================================================================================================



// formsSettings.formsFieldsInit({
//   viewpass: false,
//   maskTel: false,
//   valid: false,
// });

// Отправка формы
// formsSettings.formSubmit();



//Quantity
// import "./files/quantity.js";
//========================================================================================================================================================

// Подключение Range Slider --------------------------------------------------------------
// Документация https://refreshless.com/nouislider/
// import "./files/range.js";
//========================================================================================================================================================
// Слайдер свайпер
// import "./files/swiper.js";

// Динамический адаптив
// import "./libs/dynamic_adapt.js";


/******/ })()
;