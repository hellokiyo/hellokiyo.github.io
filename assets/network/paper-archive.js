(function(root){
 'use strict';
 const REVISION='2025-08-01';
 function create(latest,past=[]){
  const papers=[...(latest?[{...latest,year:Number(latest.date.slice(0,4)),round:Number(latest.title.match(/(\d+)회/)?.[1]),previousStandard:latest.date<REVISION,original:'materials/files/network-2026-04-a.hwp',sourceName:'ICQA 제공 시험지'}]:[]),...past].sort((a,b)=>b.date.localeCompare(a.date));
  const years=[...new Set(papers.map(p=>p.year))];
  const get=id=>papers.find(p=>p.id===id);
  const forIds=ids=>papers.find(p=>ids?.length&&p.questions.some(q=>q.id===ids[0]));
  return {papers,years,get,forIds,filter:(year,currentOnly=false)=>papers.filter(p=>(year==='all'||p.year===Number(year))&&(!currentOnly||!p.previousStandard))};
 }
 const api={create,REVISION};if(typeof module!=='undefined'&&module.exports)module.exports=api;root.PaperArchive=api;
})(typeof window!=='undefined'?window:globalThis);
