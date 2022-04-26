<script>
  import { afterUpdate } from 'svelte'
  import * as knobby from 'svelte-knobby'
  import renderWaterMark from '../src'

  const config = knobby.panel({
    debug: true,
    text: '全屏水印区域',
    fontSize: 14,
    rotate: {
      $label: 'rotate',
      value: -15,
      min: -45,
      max: 45,
      step: 1,
    },
    gap: {
      $label: 'gap',
      value: 10,
      min: 0,
      max: 40,
    },
    offset: {
      $label: 'offset',
      value: 0,
      min: 0,
      max: 100,
    },
    color: 'rgba(0, 0, 0, 0.1)',
    width: {
      $label: 'width',
      min: 0,
      max: 400,
      step: 1,
      value: 0,
    },
    height: {
      $label: 'height',
      min: 0,
      max: 400,
      step: 1,
      value: 0,
    },
  })

  let instance
  function createFixMark() {
    destroyMark()
    instance = renderWaterMark($config)
  }
  function createScrollMark() {
    destroyMark()
    instance = renderWaterMark({ ...$config, fixed: false })
  }
  function destroyMark() {
    instance && instance.destroy()
  }

  let box1Ref
  let box2Ref
  let _ins1
  let _ins2
  function init() {
    _ins1 && _ins1.destroy()
    _ins2 && _ins2.destroy()
    _ins1 = renderWaterMark({ el: box1Ref, ...$config })
    _ins2 = renderWaterMark({
      el: box2Ref,
      fixed: false,
      ...$config,
    })
  }

  afterUpdate(() => {
    init()
  })
</script>

<div class="wrapper">
  <div>
    <button on:click={() => createFixMark()}>全屏固定水印</button>
    <button on:click={() => createScrollMark()}>全屏跟随水印</button>
    <button on:click={() => destroyMark()}>关闭全屏水印</button>
  </div>

  <div style="display: flex">
    <div class="col">
      <div bind:this={box1Ref}>
        <span>区域水印-固定</span>
      </div>
    </div>
    <div class="col">
      <div bind:this={box2Ref}>
        <span>区域水印-跟随</span>
      </div>
    </div>
  </div>
</div>

<style>
  .wrapper {
    height: 2000px;
  }
  .col > div {
    width: 500px;
    height: 300px;
    border: 1px solid #ddd;
    overflow: auto;
  }
  .col > div::after {
    content: '';
    display: block;
    height: 1000px;
  }
  .col > div > span {
    display: block;
    text-align: center;
    line-height: 200px;
    font-size: 30px;
    color: rgba(0, 0, 0, 0.2);
  }
</style>
