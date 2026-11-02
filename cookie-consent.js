/* DevZink cookie consent: banner + preferences + Google Consent Mode v2 + server log */
(function(){
  var KEY="dz_consent",VER="1",API="/api/consent";
  function read(){try{var c=JSON.parse(localStorage.getItem(KEY));return c&&c.version===VER?c:null}catch(e){return null}}
  function uuid(){return(crypto.randomUUID?crypto.randomUUID():"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(c){var r=Math.random()*16|0;return(c=="x"?r:r&3|8).toString(16)}))}
  function applyGtag(c){if(typeof window.gtag==="function")gtag("consent","update",{analytics_storage:c.analytics?"granted":"denied",ad_storage:c.marketing?"granted":"denied",ad_user_data:c.marketing?"granted":"denied",ad_personalization:c.marketing?"granted":"denied"});
    window.dispatchEvent(new CustomEvent("dz:consent",{detail:c}))}
  function save(action,cats){var prev=read()||{};var rec={id:prev.id||uuid(),version:VER,action:action,categories:{necessary:true,analytics:!!cats.analytics,marketing:!!cats.marketing},ts:new Date().toISOString()};
    try{localStorage.setItem(KEY,JSON.stringify(rec))}catch(e){}
    applyGtag(rec.categories);
    try{fetch(API,{method:"POST",headers:{"Content-Type":"application/json"},keepalive:true,body:JSON.stringify({id:rec.id,version:VER,action:action,categories:rec.categories,page:location.pathname})}).catch(function(){})}catch(e){}
    hide()}
  var css='.dzc{position:fixed;z-index:9999;left:clamp(12px,2vw,24px);bottom:clamp(12px,2vw,24px);width:min(440px,calc(100vw - 24px));padding:22px;border-radius:20px;background:rgba(10,10,18,.92);-webkit-backdrop-filter:blur(18px);backdrop-filter:blur(18px);border:1px solid rgba(255,255,255,.1);box-shadow:0 30px 80px -20px rgba(0,0,0,.7),0 0 0 1px rgba(139,92,246,.12);color:#fff;font:400 15px/1.55 "General Sans",system-ui,sans-serif;transform:translateY(24px);opacity:0;transition:transform .6s cubic-bezier(.22,1,.36,1),opacity .5s}'
  +'.dzc.on{transform:none;opacity:1}.dzc::before{content:"";position:absolute;inset:0 0 auto;height:2px;border-radius:20px 20px 0 0;background:linear-gradient(90deg,#8B5CF6,#22D3EE)}'
  +'.dzc h2{font:600 19px/1.2 "Clash Display",system-ui,sans-serif;margin:0 0 8px;letter-spacing:.01em}.dzc p{margin:0 0 16px;color:#B8B8C4;font-size:14px}.dzc a{color:#fff;text-decoration:underline;text-underline-offset:3px}'
  +'.dzc__row{display:flex;gap:10px;flex-wrap:wrap}.dzc button{cursor:pointer;flex:1 1 auto;min-height:44px;padding:0 18px;border-radius:99px;font:500 14px/1 "General Sans",system-ui,sans-serif;border:1px solid rgba(255,255,255,.16);background:transparent;color:#fff;transition:transform .3s,background-color .3s,border-color .3s}'
  +'.dzc button:hover{transform:translateY(-1px);border-color:rgba(255,255,255,.4)}.dzc .dzc__acc{border:0;background:linear-gradient(135deg,#8B5CF6,#22D3EE);color:#030305;font-weight:600}.dzc .dzc__link{flex:0 0 100%;min-height:32px;border:0;color:#B8B8C4;text-decoration:underline;text-underline-offset:3px}'
  +'.dzc__prefs{display:none;margin:4px 0 16px;border-top:1px solid rgba(255,255,255,.08)}.dzc.prefs .dzc__prefs{display:block}.dzc.prefs .dzc__link{display:none}'
  +'.dzc__opt{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.08)}.dzc__opt b{display:block;font-weight:500;font-size:14px}.dzc__opt small{color:#85858F;font-size:12.5px;line-height:1.45}'
  +'.dzc__sw{position:relative;flex:0 0 42px;height:24px;margin-top:2px}.dzc__sw input{position:absolute;inset:0;opacity:0;margin:0;cursor:pointer}.dzc__sw i{position:absolute;inset:0;border-radius:99px;background:#232333;transition:background .3s;pointer-events:none}.dzc__sw i::after{content:"";position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:transform .3s cubic-bezier(.22,1,.36,1)}'
  +'.dzc__sw input:checked+i{background:linear-gradient(135deg,#8B5CF6,#22D3EE)}.dzc__sw input:checked+i::after{transform:translateX(18px)}.dzc__sw input:disabled+i{opacity:.55}.dzc__sw input:focus-visible+i{outline:2px solid #22D3EE;outline-offset:2px}'
  +'@media(max-width:520px){.dzc{left:12px;right:12px;width:auto;padding:18px}.dzc button{flex:1 1 40%}}@media(prefers-reduced-motion:reduce){.dzc{transition:none}}';
  var el;
  function build(){if(el)return el;var st=document.createElement("style");st.textContent=css;document.head.appendChild(st);
    el=document.createElement("section");el.className="dzc";el.setAttribute("role","dialog");el.setAttribute("aria-live","polite");el.setAttribute("aria-labelledby","dzc-t");
    el.innerHTML='<h2 id="dzc-t">We value your privacy</h2><p>We use essential cookies to run this site and, with your permission, analytics and marketing cookies to improve it and measure our ads. You can change your choice anytime from “Cookie settings” in the footer.</p>'
    +'<div class="dzc__prefs"><div class="dzc__opt"><div><b>Necessary</b><small>Required for the site to work. Always on.</small></div><span class="dzc__sw"><input type="checkbox" checked disabled aria-label="Necessary cookies"><i></i></span></div>'
    +'<div class="dzc__opt"><div><b>Analytics</b><small>Helps us understand how visitors use the site.</small></div><span class="dzc__sw"><input type="checkbox" id="dzc-an" aria-label="Analytics cookies"><i></i></span></div>'
    +'<div class="dzc__opt"><div><b>Marketing</b><small>Measures ad performance and personalisation.</small></div><span class="dzc__sw"><input type="checkbox" id="dzc-mk" aria-label="Marketing cookies"><i></i></span></div></div>'
    +'<div class="dzc__row"><button type="button" class="dzc__rej">Reject all</button><button type="button" class="dzc__acc">Accept all</button><button type="button" class="dzc__save" hidden>Save choices</button><button type="button" class="dzc__link">Customize</button></div>';
    document.body.appendChild(el);
    var an=el.querySelector("#dzc-an"),mk=el.querySelector("#dzc-mk"),sv=el.querySelector(".dzc__save");
    el.querySelector(".dzc__acc").onclick=function(){save("accept_all",{analytics:1,marketing:1})};
    el.querySelector(".dzc__rej").onclick=function(){save("reject_all",{})};
    el.querySelector(".dzc__link").onclick=function(){el.classList.add("prefs");sv.hidden=false;an.focus()};
    sv.onclick=function(){save("custom",{analytics:an.checked,marketing:mk.checked})};
    return el}
  function show(prefs){build();var c=read();if(c){el.querySelector("#dzc-an").checked=c.categories.analytics;el.querySelector("#dzc-mk").checked=c.categories.marketing}
    if(prefs){el.classList.add("prefs");el.querySelector(".dzc__save").hidden=false}
    requestAnimationFrame(function(){requestAnimationFrame(function(){el.classList.add("on")})})}
  function hide(){if(!el)return;el.classList.remove("on");setTimeout(function(){el.classList.remove("prefs");el.querySelector(".dzc__save").hidden=true},600)}
  window.DZConsent={open:function(){show(true)},get:read};
  document.addEventListener("click",function(e){var t=e.target.closest&&e.target.closest("[data-cookie-settings]");if(t){e.preventDefault();show(true)}});
  var c=read();if(c)applyGtag(c.categories);else setTimeout(function(){show(false)},1200);
})();
