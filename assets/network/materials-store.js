/* Browser-local file library. No network requests or external dependencies. */
(function(root,factory){
  'use strict';
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.StudyMaterialsStore=api;
})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';
  const DB_NAME='network-notes-materials:v1',STORE='materials',MAX_FILE_BYTES=30*1024*1024;
  const MIME={hwp:'application/x-hwp',hwpx:'application/hwp+zip',pdf:'application/pdf',txt:'text/plain',md:'text/markdown',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp'};
  const KINDS=['필기','실기','해설','기타'];
  let databasePromise=null;
  function extension(name){return typeof name==='string'?name.split('.').pop().toLowerCase():'';}
  function validateFile(file){
    if(!file||typeof file.name!=='string'||!file.name.trim())throw new Error('파일 이름을 확인해 주세요.');
    const ext=extension(file.name);
    if(!Object.hasOwn(MIME,ext))throw new Error('HWP, HWPX, PDF, TXT, MD 또는 PNG·JPG·WEBP 파일을 넣어 주세요.');
    if(!Number.isFinite(file.size)||file.size<=0)throw new Error('비어 있는 파일은 추가할 수 없습니다.');
    if(file.size>MAX_FILE_BYTES)throw new Error('파일 하나의 크기는 30MB 이하여야 합니다.');
    return {extension:ext,mime:MIME[ext]};
  }
  function safeFilename(name){
    let value=String(name||'file').normalize('NFC').replace(/[^A-Za-z0-9_. \-\u0080-\uffff]/g,'-').replace(/[\u0000-\u001f\u007f-\u009f]/g,'-').replace(/\.{2,}/g,'.').replace(/\s+/g,' ').replace(/^[. ]+|[. ]+$/g,'');
    if(value.length>140){const suffix=value.match(/\.[^.]{1,10}$/)?.[0]||'';value=value.slice(0,140-suffix.length).trim()+suffix;}
    const safe=value||'file';
    return /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(safe)?'_'+safe:safe;
  }
  function inferMetadata(filename){
    const clean=String(filename||'').replace(/\.[^.]+$/,'').replace(/\s*-\s*\d+$/,'').trim();
    const yearMatch=clean.match(/((?:19|20)\d{2})\s*년?/);
    const roundMatch=clean.match(/(?:제\s*)?0*(\d{1,2})\s*회/);
    const year=yearMatch?Number(yearMatch[1]):null,round=roundMatch?Number(roundMatch[1]):null;
    const kind=/해설|정답|답안/.test(clean)?'해설':/실기/.test(clean)?'실기':/필기/.test(clean)?'필기':'기타';
    let title=clean||'제목 없는 자료';
    if(year&&round&&/네트워크\s*관리사/.test(clean))title=`${year}년 정기 제${round}회 네트워크관리사 2급${kind==='기타'?'':' '+kind}`;
    return {title:title.slice(0,200),year,round,kind};
  }
  function formatBytes(value){
    if(!Number.isFinite(value)||value<0)return '0 B';
    if(value<1024)return Math.round(value)+' B';
    if(value<1024**2)return (value/1024).toFixed(value<10240?1:0)+' KB';
    if(value<1024**3)return (value/1024**2).toFixed(1)+' MB';
    return (value/1024**3).toFixed(1)+' GB';
  }
  function safeId(value){
    if(typeof value!=='string'||!/^[A-Za-z0-9_-]{1,64}$/.test(value))throw new Error('자료 ID가 올바르지 않습니다.');
    return value;
  }
  function cleanNumber(value,min,max){return Number.isInteger(Number(value))&&String(value).trim()!==''&&Number(value)>=min&&Number(value)<=max?Number(value):null;}
  function cleanMetadata(record){
    if(!record||typeof record!=='object')throw new Error('자료 정보가 올바르지 않습니다.');
    const title=String(record.title||record.filename||'').trim().slice(0,200);
    if(!title)throw new Error('자료 제목을 입력해 주세요.');
    const filename=String(record.filename||'').slice(0,255),fileInfo=validateFile({name:filename,size:record.size});
    return {id:safeId(record.id),title,year:cleanNumber(record.year,1900,2199),round:cleanNumber(record.round,1,99),kind:KINDS.includes(record.kind)?record.kind:'기타',notes:String(record.notes||'').slice(0,5000),reviewed:record.reviewed===true,filename,mime:fileInfo.mime,size:record.size,addedAt:typeof record.addedAt==='string'&&!Number.isNaN(Date.parse(record.addedAt))?new Date(record.addedAt).toISOString():new Date().toISOString(),digest:typeof record.digest==='string'&&/^[a-f0-9]{64}$/i.test(record.digest)?record.digest.toLowerCase():''};
  }
  function storageError(error){
    const name=error?.name;
    if(name==='QuotaExceededError')return new Error('브라우저 저장 공간이 부족합니다. 자료를 내보낸 뒤 불필요한 파일을 정리해 주세요.');
    if(name==='SecurityError'||name==='InvalidStateError')return new Error('이 브라우저에서는 파일 저장이 허용되지 않습니다. 일반 창에서 HTTP 또는 HTTPS 주소로 접속해 주세요.');
    return new Error('자료 저장소를 사용할 수 없습니다. 새로고침하거나 브라우저의 저장 허용 설정을 확인해 주세요.');
  }
  function open(){
    if(databasePromise)return databasePromise;
    databasePromise=new Promise((resolve,reject)=>{
      if(typeof indexedDB==='undefined'){reject(storageError({name:'SecurityError'}));return;}
      let request;
      try{request=indexedDB.open(DB_NAME,1);}catch(error){reject(storageError(error));return;}
      request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains(STORE)){const store=db.createObjectStore(STORE,{keyPath:'id'});store.createIndex('digest','digest',{unique:false});}};
      request.onerror=()=>reject(storageError(request.error));
      request.onblocked=()=>reject(new Error('다른 탭에서 자료 저장소를 사용 중입니다. 다른 학습 탭을 닫고 다시 시도해 주세요.'));
      request.onsuccess=()=>{const db=request.result;db.onversionchange=()=>{db.close();databasePromise=null;};resolve(db);};
    }).catch(error=>{databasePromise=null;throw error;});
    return databasePromise;
  }
  async function transact(mode,action){
    const db=await open();
    return new Promise((resolve,reject)=>{
      let tx,request,result;
      try{tx=db.transaction(STORE,mode);request=action(tx.objectStore(STORE));}catch(error){reject(storageError(error));return;}
      request.onsuccess=()=>{result=request.result;};
      request.onerror=()=>reject(storageError(request.error));
      tx.oncomplete=()=>resolve(result);
      tx.onabort=()=>reject(storageError(tx.error));
      tx.onerror=()=>reject(storageError(tx.error));
    });
  }
  async function list(){return (await transact('readonly',store=>store.getAll())).sort((a,b)=>String(b.addedAt).localeCompare(String(a.addedAt)));}
  async function save(record){
    const metadata=cleanMetadata(record);
    if(typeof Blob==='undefined'||!(record.blob instanceof Blob))throw new Error('원본 파일이 없습니다. 파일을 다시 추가해 주세요.');
    if(record.blob.size!==metadata.size)throw new Error('파일 크기와 자료 정보가 일치하지 않습니다.');
    const clean={...metadata,blob:record.blob};await transact('readwrite',store=>store.put(clean));return clean;
  }
  async function remove(id){safeId(id);await transact('readwrite',store=>store.delete(id));}
  function normalizePublic(items){
    if(!Array.isArray(items))return [];
    const seen=new Set();
    return items.slice(0,1000).flatMap(item=>{
      try{
        if(!item||typeof item.url!=='string')return [];
        const url=item.url.replace(/^\.\//,'');
        if(!/^materials\/files\/[A-Za-z0-9_\- .가-힣\u0080-\uffff]+$/.test(url)||url.includes('..')||/[\\:%?#\u0000-\u001f\u007f]/.test(url))return [];
        const metadata=cleanMetadata(item);
        if(seen.has(metadata.id)||extension(url)!==extension(metadata.filename))return [];
        seen.add(metadata.id);return [{...metadata,url,published:true}];
      }catch{return [];}
    });
  }
  const encoder=new TextEncoder();
  const crcTable=Array.from({length:256},(_,n)=>{for(let k=0;k<8;k++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
  function crc32(bytes){let crc=0xffffffff;for(const byte of bytes)crc=crcTable[(crc^byte)&255]^(crc>>>8);return (crc^0xffffffff)>>>0;}
  function join(parts){const result=new Uint8Array(parts.reduce((n,p)=>n+p.length,0));let offset=0;for(const part of parts){result.set(part,offset);offset+=part.length;}return result;}
  function header(size,writer){const bytes=new Uint8Array(size);writer(new DataView(bytes.buffer));return bytes;}
  function buildZip(entries){
    if(!Array.isArray(entries)||entries.length>65535)throw new Error('내보낼 파일 수가 너무 많습니다.');
    const local=[],central=[],seen=new Set();let offset=0;
    for(const entry of entries){
      const name=String(entry.name||'');
      if(!name||name.startsWith('/')||name.includes('\\')||name.split('/').some(p=>p==='..'||p==='.'||!p)||/[\u0000-\u001f:\u007f]/.test(name)||seen.has(name))throw new Error('내보내기 파일 경로가 올바르지 않거나 중복되었습니다.');
      seen.add(name);const nameBytes=encoder.encode(name),bytes=typeof entry.data==='string'?encoder.encode(entry.data):entry.data;
      if(!(bytes instanceof Uint8Array)||bytes.length>0xffffffff||nameBytes.length>65535)throw new Error('내보낼 파일을 확인해 주세요.');
      const crc=crc32(bytes),size=bytes.length;
      const localHead=header(30,v=>{v.setUint32(0,0x04034b50,true);v.setUint16(4,20,true);v.setUint16(6,0x800,true);v.setUint16(12,0x21,true);v.setUint32(14,crc,true);v.setUint32(18,size,true);v.setUint32(22,size,true);v.setUint16(26,nameBytes.length,true);});
      const centralHead=header(46,v=>{v.setUint32(0,0x02014b50,true);v.setUint16(4,20,true);v.setUint16(6,20,true);v.setUint16(8,0x800,true);v.setUint16(14,0x21,true);v.setUint32(16,crc,true);v.setUint32(20,size,true);v.setUint32(24,size,true);v.setUint16(28,nameBytes.length,true);v.setUint32(42,offset,true);});
      local.push(localHead,nameBytes,bytes);central.push(centralHead,nameBytes);offset+=30+nameBytes.length+size;
      if(offset>0xffffffff)throw new Error('내보낼 자료의 전체 크기가 너무 큽니다.');
    }
    const centralBytes=join(central),end=header(22,v=>{v.setUint32(0,0x06054b50,true);v.setUint16(8,entries.length,true);v.setUint16(10,entries.length,true);v.setUint32(12,centralBytes.length,true);v.setUint32(16,offset,true);});
    return join([...local,centralBytes,end]);
  }
  async function packagePublishing(records){
    if(!Array.isArray(records)||!records.length)throw new Error('내보낼 자료를 확인해 주세요.');
    const entries=[],manifest=[],seen=new Set(),paths=new Set();let totalBytes=0;
    for(const record of records){
      const hasBlob=typeof Blob!=='undefined'&&record?.blob instanceof Blob;
      let metadata,url;
      if(hasBlob){
        metadata=cleanMetadata(record);
        if(record.blob.size!==metadata.size)throw new Error('자료의 원본 파일 크기가 일치하지 않습니다.');
        url='materials/files/'+metadata.id+'-'+safeFilename(metadata.filename);
        totalBytes+=metadata.size;
        if(totalBytes>250*1024*1024)throw new Error('한 번에 내보내는 새 파일은 총 250MB 이하여야 합니다.');
      }else{
        const normalized=normalizePublic([record]);
        if(normalized.length!==1)throw new Error('기존 공개 자료의 경로 또는 정보가 올바르지 않습니다.');
        ({url,...metadata}=normalized[0]);delete metadata.published;
      }
      if(seen.has(metadata.id)||paths.has(url))throw new Error('중복된 자료 ID 또는 파일 경로가 있습니다.');
      seen.add(metadata.id);paths.add(url);
      if(hasBlob)entries.push({name:url,data:new Uint8Array(await record.blob.arrayBuffer())});
      manifest.push({...metadata,url});
    }
    const content='/* 사이트 게시용 시험 자료 목록. ZIP의 materials 폴더와 함께 사용합니다. */\nwindow.PUBLIC_MATERIALS = '+JSON.stringify(manifest,null,2).replace(/</g,'\\u003c')+';\n';
    entries.push({name:'assets/network/public-materials.js',data:content});
    const bytes=buildZip(entries);return {blob:new Blob([bytes],{type:'application/zip'}),count:manifest.length};
  }
  return {DB_NAME,MAX_FILE_BYTES,MIME,KINDS,open,list,save,remove,validateFile,inferMetadata,formatBytes,safeFilename,normalizePublic,packagePublishing,buildZip,crc32};
});
