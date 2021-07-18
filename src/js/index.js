import DevUtils from './demo.js'
import barba from '@barba/core'
import gsap from 'gsap'
import LocomotiveScroll from 'locomotive-scroll'

const scroll = new LocomotiveScroll({
  el: document.querySelector('[data-scroll-container]'),
  smooth: true
});

barba.hooks.before(() => {
  scroll.stop()
})

barba.hooks.after((data) => {
  scroll.update()
  scroll.start()
})

barba.init({
  preventRunning: true,
  transitions: [{
    name: 'opacity-transition',
    leave(data) {
      return gsap.to(data.current.container, {
        opacity: 0
      });
    },
    after(data) {
      return gsap.from(data.next.container, {
        opacity: 0
      });
    }
  }]
});
