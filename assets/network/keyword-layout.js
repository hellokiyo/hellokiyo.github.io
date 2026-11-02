(function(root){
 'use strict';let observer=null;
 function span(height,gap){return Math.max(1,Math.ceil((height+gap)/(1+gap)));}
 function unmount(){observer?.disconnect();observer=null;}
 function mount(grid){
  unmount();if(!grid||!root.ResizeObserver)return;
  grid.classList.add('keyword-masonry');
  const update=card=>{if(!card.isConnected)return;const gap=parseFloat(root.getComputedStyle(grid).rowGap)||12;const value='span '+span(card.getBoundingClientRect().height,gap);if(card.style.gridRowEnd!==value)card.style.gridRowEnd=value;};
  const cards=Array.from(grid.querySelectorAll('.flash-card'));cards.forEach(update);
  observer=new root.ResizeObserver(entries=>entries.forEach(e=>update(e.target)));cards.forEach(card=>observer.observe(card));
 }
 const api={mount,unmount,span};if(typeof module!=='undefined'&&module.exports)module.exports=api;root.KeywordLayout=api;
})(typeof window!=='undefined'?window:globalThis);
