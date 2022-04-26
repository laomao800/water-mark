import waterMark from '../src'

waterMark({
  el: '#box1',
  text: '区域水印区域水印区域水印区域水印-固定',
})
waterMark({
  el: '#box2',
  text: '区域水印-跟随',
  fixed: false,
})

const $close = document.querySelector('#btn-close')
const $btn1 = document.querySelector('#btn1')
const $btn2 = document.querySelector('#btn2')
let instance

function cleanUp() {
  instance && instance.destroy()
}
$close.addEventListener('click', cleanUp)
$btn1.addEventListener('click', function () {
  cleanUp()
  instance = waterMark('全屏水印-固定')
})
$btn2.addEventListener('click', function () {
  cleanUp()
  instance = waterMark({
    text: '全屏水印-跟随',
    fixed: false,
  })
})
