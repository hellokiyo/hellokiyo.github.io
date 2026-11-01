/* 시험 자료 화면. 원본 파일은 IndexedDB에 보관하며 서버로 전송하지 않습니다. */
(() => {
  'use strict';
  const S = window.StudyMaterialsStore;
  const TYPES = ['전체', '필기', '실기', '해설', '기타'];
  let dispose = () => {};
  const escape = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

  function mount({root, toast, confirmAction}) {
    dispose();
    let active = true, locals = [], published = S.normalizePublic(window.PUBLIC_MATERIALS || []);
    let loading = true, busy = false, storageError = '', search = '', kind = '전체', editId = null;
    let previewUrl = '', previewId = '', previewRevision = 0, dragDepth = 0;
    const controller = new AbortController();
    const options = {signal:controller.signal};
    const localDate = value => new Intl.DateTimeFormat('ko-KR', {year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(value));
    const allRecords = () => [...new Map([...published.map(r => ({...r,local:false})),...locals.map(r => ({...r,local:true}))].map(r=>[r.id,r])).values()];
    const find = id => allRecords().find(r => r.id === id);
    const status = message => { if (active) root.querySelector('#materials-upload-status').textContent = message; };
    const showError = error => { const message = error?.message || '자료를 처리하지 못했습니다. 다시 시도해 주세요.'; status(message); toast(message); };

    root.innerHTML = `
      <div class="page-heading materials-heading"><div><h1>시험 자료</h1><p>회차별 시험문제와 해설을 파일로 모아 두세요.</p></div>
        <button type="button" class="button secondary" data-material-action="publish" disabled>게시용 ZIP 받기</button></div>
      <section class="materials-dropzone" id="materials-dropzone" aria-labelledby="materials-drop-title">
        <span class="materials-drop-icon" aria-hidden="true">↓</span>
        <div><h2 id="materials-drop-title">시험문제 파일을 여기에 놓으세요</h2><p>HWP · HWPX · PDF · TXT · MD · 이미지 / 파일당 최대 30MB</p></div>
        <button type="button" class="button primary" data-material-action="choose">파일 선택</button>
        <input type="file" id="materials-file-input" accept=".hwp,.hwpx,.pdf,.txt,.md,.png,.jpg,.jpeg,.webp" multiple hidden>
      </section>
      <p class="materials-storage-note">드롭한 파일은 이 브라우저에만 저장됩니다. 다른 방문자에게 공개하려면 게시용 ZIP을 사이트에 반영하세요.</p>
      <p class="materials-upload-status" id="materials-upload-status" role="status" aria-live="polite"></p>
      <details class="materials-publish-help"><summary>사이트에 공개하는 방법</summary><ol><li>파일을 추가하고 제목·회차를 정리합니다.</li><li><strong>게시용 ZIP 받기</strong>를 누릅니다. 기존 공개 자료 목록도 함께 유지합니다.</li><li>ZIP을 풀어 나온 <code>materials/</code>와 <code>assets/</code>를 프로젝트 폴더에 넣습니다.</li><li>Git 관리와 GitHub Pages 게시 작업을 직접 진행합니다.</li></ol><p>단순히 드롭하는 것만으로 홈페이지가 배포되지는 않습니다. 파일은 자동으로 퀴즈 문항으로 변환되지 않습니다.</p></details>
      <div class="toolbar materials-toolbar"><label class="sr-only" for="materials-search">시험 자료 검색</label><input id="materials-search" class="search-input" type="search" placeholder="제목, 회차, 파일 이름 검색" autocomplete="off"><label class="sr-only" for="materials-kind">자료 분류</label><select id="materials-kind" aria-label="자료 분류">${TYPES.map(t=>`<option>${t}</option>`).join('')}</select></div>
      <div id="materials-results" aria-live="polite"></div>
      <dialog class="materials-dialog" id="materials-editor" aria-labelledby="materials-edit-title"><form id="materials-edit-form"><div class="dialog-heading"><h2 id="materials-edit-title">자료 정보 수정</h2><button class="icon-button" type="button" data-material-action="close-editor" aria-label="자료 정보 닫기">×</button></div><label class="field-label" for="materials-title">제목</label><input id="materials-title" type="text" maxlength="200" required><div class="materials-edit-grid"><div><label class="field-label" for="materials-year">연도</label><input id="materials-year" type="number" min="1900" max="2199" placeholder="2026"></div><div><label class="field-label" for="materials-round">회차</label><input id="materials-round" type="number" min="1" max="99" placeholder="4"></div><div><label class="field-label" for="materials-edit-kind">분류</label><select id="materials-edit-kind">${TYPES.slice(1).map(t=>`<option>${t}</option>`).join('')}</select></div></div><label class="field-label" for="materials-notes">메모</label><textarea id="materials-notes" rows="4" maxlength="3000" placeholder="다시 볼 문제 번호, 정답 확인 사항 등을 적어 두세요."></textarea><p class="fine-print">메모도 게시용 ZIP에 포함됩니다.</p><button class="button primary full" type="submit">저장</button><p class="materials-form-error" id="materials-form-error" role="status"></p></form></dialog>
      <dialog class="materials-preview-dialog" id="materials-preview" aria-labelledby="materials-preview-title"><div class="dialog-heading"><h2 id="materials-preview-title">자료 보기</h2><button class="icon-button" type="button" data-material-action="close-preview" aria-label="자료 보기 닫기">×</button></div><div id="materials-preview-content"></div><div class="materials-preview-actions"><button class="button secondary" type="button" data-material-action="preview-download">원본 내려받기</button><button class="button primary" type="button" data-material-action="close-preview">닫기</button></div></dialog>`;

    const dropzone = root.querySelector('#materials-dropzone');
    const picker = root.querySelector('#materials-file-input');
    const editor = root.querySelector('#materials-editor');
    const preview = root.querySelector('#materials-preview');

    function renderList() {
      if (!active) return;
      dropzone.setAttribute('aria-busy',String(busy));
      const list = allRecords().filter(r => (kind === '전체' || r.kind === kind) && [r.title,r.filename,r.year,r.round,r.notes].join(' ').toLowerCase().includes(search.toLowerCase()));
      root.querySelector('[data-material-action="publish"]').disabled = busy || loading || (!locals.length && !published.length);
      root.querySelector('[data-material-action="choose"]').disabled = busy || loading || Boolean(storageError);
      picker.disabled = busy || loading || Boolean(storageError);
      if (loading) { root.querySelector('#materials-results').innerHTML='<p class="results-meta">저장된 자료를 불러오는 중입니다.</p>'; return; }
      const warning = storageError ? `<p class="materials-error" role="alert">${escape(storageError)} 파일을 추가하려면 저장 기능을 허용한 브라우저에서 다시 열어 주세요.</p>` : '';
      root.querySelector('#materials-results').innerHTML = warning + `<div class="section-heading materials-list-heading"><h2>자료 목록 <span>${allRecords().length}</span></h2><span class="results-meta">이 브라우저 ${locals.length} · 공개 자료 ${published.length}</span></div>` + (list.length ? `<div class="materials-list">${list.map(r=>`
        <article class="material-card"><div class="material-file-icon" aria-hidden="true">${escape(extension(r.filename).toUpperCase())}</div><div class="material-content"><div class="material-tags"><span>${escape(r.kind)}</span><span class="${r.local?'local-material':'published-material'}">${r.local?'브라우저 보관':'공개 자료'}</span>${r.reviewed?'<span>✓ 검토 완료</span>':''}</div><h3><button type="button" data-material-action="preview" data-id="${escape(r.id)}">${escape(r.title)}</button></h3><p class="material-meta">${r.year?escape(r.year)+'년 ':''}${r.round?'제'+escape(r.round)+'회 · ':''}${escape(r.filename)} · ${escape(S.formatBytes(r.size))}</p>${r.notes?`<p class="material-notes">${escape(r.notes)}</p>`:''}<div class="material-actions"><button type="button" class="text-button" data-material-action="preview" data-id="${escape(r.id)}">${canPreview(r)?'미리보기':'자료 보기'}</button><button type="button" class="text-button" data-material-action="download" data-id="${escape(r.id)}">내려받기</button>${r.local?`<button type="button" class="text-button" data-material-action="edit" data-id="${escape(r.id)}">정보 수정</button><button type="button" class="text-button" data-material-action="review" data-id="${escape(r.id)}" aria-pressed="${Boolean(r.reviewed)}">${r.reviewed?'검토 표시 해제':'검토 완료'}</button><button type="button" class="text-button danger" data-material-action="remove" data-id="${escape(r.id)}">삭제</button>`:''}</div></div><time class="material-added" datetime="${escape(r.addedAt)}">${escape(localDate(r.addedAt))}</time></article>`).join('')}</div>` : `<div class="empty-state materials-empty"><h2>${allRecords().length?'검색 결과가 없어요.':'아직 등록한 자료가 없어요.'}</h2><p>${allRecords().length?'제목이나 분류를 바꿔 보세요.':'위 영역에 시험문제 파일을 끌어 놓거나 파일 선택을 눌러 주세요.'}</p></div>`);
    }

    async function refresh() { locals = (await S.list()).sort((a,b)=>Date.parse(b.addedAt)-Date.parse(a.addedAt)); renderList(); }
    async function addFiles(fileList) {
      if (loading) { toast('자료 목록을 불러오는 중입니다. 잠시 후 다시 넣어 주세요.'); return; }
      if (busy) { toast('현재 파일을 저장하고 있습니다. 잠시 기다려 주세요.'); return; }
      const files = Array.from(fileList || []);
      if (!files.length) return;
      if (files.length > 10) { status('한 번에 10개 이하의 파일을 선택해 주세요.'); return; }
      busy = true; renderList();
      let added = 0, duplicates = 0; const failures=[];
      try {
        for (let i=0;i<files.length;i++) {
          const file=files[i];
          status(`${i+1} / ${files.length} · ${file.name} 저장 중…`);
          try {
            const validated=S.validateFile(file);
            const bytes=await file.arrayBuffer();
            const digest=window.crypto?.subtle?Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join(''):'file:'+file.name+':'+file.size+':'+file.lastModified;
            if (locals.some(r=>r.digest===digest || (!window.crypto?.subtle && r.filename===file.name && r.size===file.size))) { duplicates++; continue; }
            const metadata=S.inferMetadata(file.name);
            const id='m'+Date.now().toString(36)+'-'+(crypto.randomUUID?crypto.randomUUID():Math.random().toString(36).slice(2));
            const record={...metadata,id,filename:file.name,mime:validated.mime,size:file.size,addedAt:new Date().toISOString(),digest,notes:'',reviewed:false,blob:new Blob([bytes],{type:validated.mime})};
            await S.save(record); locals.unshift(record); added++;
          } catch(error) { failures.push(file.name+': '+(error.message||'저장 실패')); }
        }
        const message=[`${added}개 자료를 저장했습니다.`,duplicates?`중복 ${duplicates}개는 건너뛰었습니다.`:'',failures.length?`실패 ${failures.length}개 — ${failures.join(' / ')}`:''].filter(Boolean).join(' ');
        status(message); toast(failures.length?'일부 자료를 저장하지 못했습니다. 결과를 확인해 주세요.':added?`${added}개 자료를 저장했습니다.`:'이미 저장된 자료입니다.');
      } finally { busy=false; renderList(); }
    }

    function extension(filename) { return filename.split('.').pop().toLowerCase(); }
    function canPreview(record) { return ['pdf','txt','md','png','jpg','jpeg','webp'].includes(extension(record.filename)); }
    function canonicalMime(record) { return {pdf:'application/pdf',txt:'text/plain',md:'text/plain',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp'}[extension(record.filename)]||'application/octet-stream'; }
    function clearPreview() { previewRevision++; if(previewUrl)URL.revokeObjectURL(previewUrl);previewUrl='';const content=root.querySelector('#materials-preview-content');if(content)content.replaceChildren(); }
    function source(record) { if(record.local)return URL.createObjectURL(new Blob([record.blob],{type:canonicalMime(record)}));return new URL(record.url,document.baseURI).href; }
    async function openPreview(record) {
      clearPreview(); const revision=previewRevision; previewId=record.id;
      root.querySelector('#materials-preview-title').textContent=record.title;
      const content=root.querySelector('#materials-preview-content');
      const ext=extension(record.filename);
      if(['hwp','hwpx'].includes(ext)) {
        content.innerHTML='<div class="materials-preview-unavailable"><strong>HWP · HWPX 원본 자료</strong><p>브라우저에서 본문 미리보기를 지원하지 않습니다. 원본을 내려받아 한글에서 열거나, PDF로 저장해 다시 추가하세요.</p></div>';
      } else if(['txt','md'].includes(ext)) {
        content.innerHTML='<p class="fine-print">텍스트를 불러오는 중입니다.</p>';
        try {
          const blob=record.local?record.blob:await fetch(new URL(record.url,document.baseURI)).then(r=>{if(!r.ok)throw new Error('자료 파일을 불러오지 못했습니다.');return r.blob();});
          const bytes=await blob.slice(0,512000).arrayBuffer();let text;
          try{text=new TextDecoder('utf-8',{fatal:true}).decode(bytes,{stream:blob.size>512000});}catch{text=new TextDecoder('euc-kr').decode(bytes);}
          if(!active||revision!==previewRevision)return;
          const pre=document.createElement('pre');pre.className='materials-text-preview';pre.textContent=text;content.replaceChildren(pre);
          if(blob.size>512000){const note=document.createElement('p');note.className='fine-print';note.textContent='긴 텍스트는 앞부분만 표시합니다. 전체 내용은 원본을 내려받아 확인하세요.';content.append(note);}
        } catch(error) { if(active&&revision===previewRevision)content.textContent=error.message; }
      } else {
        const url=source(record);if(record.local)previewUrl=url;
        if(ext==='pdf')content.innerHTML=`<iframe class="materials-pdf-preview" src="${escape(url)}" title="${escape(record.title)} PDF 미리보기"></iframe><p class="fine-print">PDF가 표시되지 않으면 원본 내려받기로 확인하세요.</p>`;
        else content.innerHTML=`<img class="materials-image-preview" src="${escape(url)}" alt="${escape(record.title)}">`;
      }
      if(active&&revision===previewRevision&&!preview.open)preview.showModal();
    }
    function download(record) {
      const url=source(record),anchor=document.createElement('a');anchor.href=url;anchor.download=S.safeFilename(record.filename);document.body.append(anchor);anchor.click();anchor.remove();if(record.local)setTimeout(()=>URL.revokeObjectURL(url),1000);
    }
    function edit(record) {
      editId=record.id;
      for(const [selector,value] of [['#materials-title',record.title],['#materials-year',record.year||''],['#materials-round',record.round||''],['#materials-edit-kind',record.kind],['#materials-notes',record.notes||'']])root.querySelector(selector).value=value;
      root.querySelector('#materials-form-error').textContent='';editor.showModal();
    }
    async function publish() {
      if(busy||loading)return;
      busy=true;renderList();status('자료 파일과 게시용 목록을 ZIP으로 묶는 중입니다…');
      try {
        const result=await S.packagePublishing(allRecords());
        const url=URL.createObjectURL(result.blob),anchor=document.createElement('a');anchor.href=url;anchor.download='network-materials-'+new Date().toISOString().slice(0,10)+'.zip';document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
        status(`자료 ${result.count}개의 게시용 목록을 내보냈습니다. ZIP을 풀어 프로젝트에 넣은 다음 직접 게시하세요.`);toast('게시용 ZIP을 만들었습니다.');
      }catch(error){showError(error);}finally{busy=false;renderList();}
    }

    root.addEventListener('click',event=>{
      const button=event.target.closest('[data-material-action]');if(!button)return;
      const action=button.dataset.materialAction,record=find(button.dataset.id);
      if(action==='choose')picker.click();
      else if(action==='publish')publish();
      else if(action==='close-editor')editor.close();
      else if(action==='close-preview')preview.close();
      else if(action==='preview-download'){const r=find(previewId);if(r)download(r);}
      else if(!record)return;
      else if(action==='preview')openPreview(record);
      else if(action==='download')download(record);
      else if(action==='edit'&&record.local)edit(record);
      else if(action==='review'&&record.local){button.disabled=true;S.save({...record,reviewed:!record.reviewed}).then(refresh).catch(showError).finally(()=>{button.disabled=false;});}
      else if(action==='remove'&&record.local)confirmAction('이 자료를 삭제할까요?',`‘${record.title}’의 브라우저 보관 사본과 메모가 삭제됩니다. 컴퓨터의 원본 파일은 바뀌지 않습니다.`,()=>S.remove(record.id).then(refresh).catch(showError));
    },options);
    picker.addEventListener('change',event=>{addFiles(event.target.files);event.target.value='';},options);
    root.querySelector('#materials-search').addEventListener('input',event=>{search=event.target.value;renderList();},options);
    root.querySelector('#materials-kind').addEventListener('change',event=>{kind=event.target.value;renderList();},options);
    root.querySelector('#materials-edit-form').addEventListener('submit',async event=>{
      event.preventDefault();const record=find(editId);if(!record?.local)return;
      const title=root.querySelector('#materials-title').value.trim(),year=root.querySelector('#materials-year').value,round=root.querySelector('#materials-round').value;
      if(!title){root.querySelector('#materials-form-error').textContent='제목을 입력해 주세요.';return;}
      const submit=event.target.querySelector('[type="submit"]');submit.disabled=true;
      try{await S.save({...record,title,year:year?Number(year):null,round:round?Number(round):null,kind:root.querySelector('#materials-edit-kind').value,notes:root.querySelector('#materials-notes').value.trim()});await refresh();editor.close();toast('자료 정보를 저장했습니다.');}catch(error){root.querySelector('#materials-form-error').textContent=error.message;}finally{submit.disabled=false;}
    },options);
    preview.addEventListener('close',clearPreview,options);
    const hasFiles=event=>Array.from(event.dataTransfer?.types||[]).includes('Files');
    document.addEventListener('dragenter',event=>{if(!hasFiles(event))return;event.preventDefault();dragDepth++;dropzone.classList.add('drag-active');},options);
    document.addEventListener('dragover',event=>{if(!hasFiles(event))return;event.preventDefault();event.dataTransfer.dropEffect=busy?'none':'copy';},options);
    document.addEventListener('dragleave',event=>{if(!hasFiles(event))return;dragDepth=Math.max(0,dragDepth-1);if(!dragDepth)dropzone.classList.remove('drag-active');},options);
    document.addEventListener('drop',event=>{if(!hasFiles(event))return;event.preventDefault();dragDepth=0;dropzone.classList.remove('drag-active');if(storageError){toast('현재 브라우저에서 자료 저장을 사용할 수 없습니다.');return;}addFiles(event.dataTransfer.files);},options);
    dispose=()=>{active=false;controller.abort();clearPreview();if(editor.open)editor.close();if(preview.open)preview.close();};
    renderList();
    S.list().then(records=>{locals=records.sort((a,b)=>Date.parse(b.addedAt)-Date.parse(a.addedAt));}).catch(error=>{storageError=error.message||'브라우저 저장소를 열 수 없습니다.';}).finally(()=>{loading=false;renderList();});
  }
  window.StudyMaterialsPage={mount,unmount:()=>dispose()};
})();


