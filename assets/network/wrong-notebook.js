(function(root){
 'use strict';
 const labels={daily:'오늘의 학습',game:'산성비',keywords:'키워드 암기',practice:'자체 문제풀이',past:'기출문제',legacy:'이전 기록'};
 function clean(raw,ids,legacy=[]){const out={};for(const source of Object.keys(labels))out[source]=Array.isArray(raw?.[source])?[...new Set(raw[source].filter(id=>ids.includes(id)))]:[];if(!raw||typeof raw!=='object')out.legacy=[...new Set(legacy.filter(id=>ids.includes(id)))];return out;}
 function update(state,source,id,correct){if(!Object.hasOwn(labels,source))return;const list=state.wrongByFeature[source];if(correct)state.wrongByFeature[source]=list.filter(x=>x!==id);else if(!list.includes(id))list.push(id);sync(state);}
 function sync(state){state.wrong=[...new Set(Object.values(state.wrongByFeature).flat())].filter(id=>!id.startsWith('k'));}
 function remove(state,id){for(const source of Object.keys(labels))state.wrongByFeature[source]=state.wrongByFeature[source].filter(x=>x!==id);sync(state);}
 function count(state){return new Set(Object.values(state.wrongByFeature).flat()).size;}
 const api={labels,clean,update,sync,remove,count};root.WrongNotebook=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
