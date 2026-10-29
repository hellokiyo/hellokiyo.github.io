(function(root){
  'use strict';
  function ipNumber(ip){
    if(typeof ip!=='string'||!/^\d{1,3}(\.\d{1,3}){3}$/.test(ip))throw new Error('IPv4 주소를 네 개의 숫자로 입력해 주세요.');
    const octets=ip.split('.').map(Number);
    if(octets.some(n=>n<0||n>255))throw new Error('각 옥텟은 0~255 사이여야 합니다.');
    return octets.reduce((n,o)=>n*256+o,0)>>>0;
  }
  function numberIp(n){return [24,16,8,0].map(shift=>(n>>>shift)&255).join('.');}
  function subnet(ip,prefix){
    const value=ipNumber(ip);
    if(!Number.isInteger(prefix)||prefix<0||prefix>32)throw new Error('프리픽스는 0~32 정수여야 합니다.');
    const mask=prefix===0?0:(0xffffffff<<(32-prefix))>>>0;
    const network=(value&mask)>>>0, broadcast=(network|(~mask>>>0))>>>0;
    return {ip,prefix,mask:numberIp(mask),network:numberIp(network),broadcast:prefix>=31?'해당 없음':numberIp(broadcast),first:numberIp(prefix>=31?network:network+1),last:numberIp(prefix>=31?broadcast:broadcast-1),hosts:prefix===32?1:prefix===31?2:2**(32-prefix)-2,note:prefix===31?'/31은 점대점 링크 기준으로 두 주소를 사용합니다.':prefix===32?'/32는 단일 호스트 경로입니다.':'네트워크·브로드캐스트 주소를 제외한 일반 LAN 기준입니다.'};
  }
  function shuffle(items,random=Math.random){const result=[...items];for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}
  function localDate(date=new Date()){return date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2,'0')+'-'+String(date.getDate()).padStart(2,'0');}
  function validDate(value){if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;const date=new Date(value+'T00:00:00');return !Number.isNaN(date.getTime())&&localDate(date)===value;}
  function daysUntil(value,now=new Date()){if(!validDate(value))return null;const d=new Date(value+'T00:00:00');return Math.round((Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())-Date.UTC(now.getFullYear(),now.getMonth(),now.getDate()))/86400000);}
  function cleanState(source,data,questions){
    if(!source||typeof source!=='object'||Array.isArray(source))throw new Error('학습 기록 형식이 올바르지 않습니다.');
    const allowed=(input,ids)=>Array.isArray(input)?[...new Set(input.filter(id=>ids.includes(id)))]:[];
    const qids=questions.map(q=>q.id), kids=data.keywords.map(k=>k.id), rids=data.sections.map(s=>s.id);
    const result={version:1,examDate:validDate(source.examDate)?source.examDate:'',mastered:allowed(source.mastered,kids),read:allowed(source.read,rids),plans:allowed(source.plans,data.plan.map(p=>p.day)),wrong:allowed(source.wrong,qids),routines:{},records:[],session:null,lastResult:null};
    if(source.routines&&typeof source.routines==='object')for(const [date,tasks] of Object.entries(source.routines)){if(validDate(date))result.routines[date]=allowed(tasks,[0,1,2]);}
    if(Array.isArray(source.records))result.records=source.records.filter(r=>r&&Number.isFinite(r.score)&&r.score>=0&&r.score<=100&&Number.isInteger(r.total)&&r.total>0&&r.total<=questions.length&&Number.isInteger(r.correct)&&r.correct>=0&&r.correct<=r.total&&typeof r.at==='string'&&!Number.isNaN(Date.parse(r.at))).slice(-30).map(r=>({score:Math.round(r.correct/r.total*100),total:r.total,correct:r.correct,at:r.at,mode:['exam','quick','wrong'].includes(r.mode)?r.mode:'quick'}));
    const cleanSession=s=>{
      if(!s||typeof s!=='object'||!['exam','quick','wrong'].includes(s.mode)||!Array.isArray(s.ids))return null;
      const ids=allowed(s.ids,qids);if(!ids.length)return null;
      const answers={},checked=[];
      for(const id of ids){const q=questions.find(q=>q.id===id);if(Number.isInteger(s.answers?.[id])&&s.answers[id]>=0&&s.answers[id]<q.options.length)answers[id]=s.answers[id];}
      if(s.mode!=='exam'&&Array.isArray(s.checked))for(const id of s.checked)if(ids.includes(id)&&Object.hasOwn(answers,id))checked.push(id);
      if(s.mode==='exam'&&(!Number.isFinite(s.endsAt)||s.endsAt<0))return null;
      return {mode:s.mode,ids,answers,checked,index:Number.isInteger(s.index)?Math.max(0,Math.min(s.index,ids.length-1)):0,endsAt:s.mode==='exam'?s.endsAt:null,startedAt:Number.isFinite(s.startedAt)?s.startedAt:Date.now()};
    };
    result.session=cleanSession(source.session);
    const last=cleanSession(source.lastResult);
    if(last)result.lastResult={...last,finishedAt:Number.isFinite(source.lastResult.finishedAt)?source.lastResult.finishedAt:Date.now()};
    return result;
  }
  const api={subnet,shuffle,localDate,validDate,daysUntil,cleanState};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.StudyCore=api;
})(typeof window!=='undefined'?window:globalThis);
