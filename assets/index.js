import domready from 'domready'
import Gallery from './gallery'
import SizeChart from './sizechart'
import NestedLists from './nested-lists'
import Drawer from './drawer'
import PasswordSecurity from './password-security'
import Carousel from './carousel'
import AnchorsNav from './anchors-nav'
import Smoothscroll from './smoothscroll'
import {TweenMax, Power3} from 'gsap'
import Basket from './basket'
import FileInput from './fileinput'
import SelectNav from './select-nav'
import HeaderSubmenu from './header-submenu'

class App {
  constructor() {
    console.log('[Unlabel App]')

    this.browserCheck()
    this.initAnimations()
    this.initComponents()
  }
  browserCheck() {
    window.Modernizr.addTest('webkit', 'WebkitAppearance' in document.documentElement.style)
  }
  initAnimations() {
    // Default easing for all components
    TweenMax.defaultEase = Power3.easeOut
  }
  initComponents() {
    // Gallery
    const galleries_arr = [].slice.call(document.querySelectorAll('.gallery'))
    galleries_arr.forEach((el) => {
      new Gallery({
        el: el
      })
    })

    // Sizeharts
    const sizecharts_arr = [].slice.call(document.querySelectorAll('.sizechart'))
    sizecharts_arr.forEach((el) => {
      new SizeChart({
        el: el
      })
    })

    // Nested Lists
    const nested_lists_arr = [].slice.call(document.querySelectorAll('.nested-lists'))
    nested_lists_arr.forEach((el) => {
      new NestedLists({
        el: el
      })
    })

    // Drawers
    const drawers_arr = [].slice.call(document.querySelectorAll('.drawer'))
    drawers_arr.forEach((el) => {
      new Drawer({
        el: el,
        options: {
          closeSelector: '.drawer__close, .drawer__backdrop, a[href="#close-drawer"]'
        }
      })
    })

    // Password Security
    const passwordSecurity_arr = [].slice.call(document.querySelectorAll('.password-security'))
    passwordSecurity_arr.forEach((el) => {
      new PasswordSecurity({
        el: el
      })
    })

    // Carousel
    const carousel_arr = [].slice.call(document.querySelectorAll('.carousel'))
    carousel_arr.forEach((el) => {
      new Carousel({
        el: el
      })
    })

    // Anchors Nav
    const anchorsNav_arr = [].slice.call(document.querySelectorAll('.anchors-nav'))
    anchorsNav_arr.forEach((el) => {
      new AnchorsNav({
        el: el
      })
    })

    // Smoothscroll
    const smoothscroll_arr = [].slice.call(document.querySelectorAll('.smoothscroll'))
    smoothscroll_arr.forEach((el) => {
      new Smoothscroll({
        el: el,
        options: {
          offsetTop: 32
        }
      })
    })

    // Basket
    new Basket()

    // FileInput
    const fileinput_arr = [].slice.call(document.querySelectorAll('.fileinput'))
    fileinput_arr.forEach((el) => {
      new FileInput({
        el: el
      })
    })

    // SelectNav
    const selectNav_arr = [].slice.call(document.querySelectorAll('.select-nav'))
    selectNav_arr.forEach((el) => {
      new SelectNav({
        el: el
      })
    })

    // HeaderSubmenu
    const headerSubmenu_arr = [].slice.call(document.querySelectorAll('.header__submenu'))
    headerSubmenu_arr.forEach((el) => {
      new HeaderSubmenu({
        el: el
      })
    })
  }
}

domready(() => {
  new App()
})