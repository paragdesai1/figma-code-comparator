(()=>{"use strict";const e="figma-overlay",n="figma-controls";let t={mode:"web",opacity:.5,isInitialized:!1,isVisible:!1,frames:[]};const s={WEB:{id:"web",label:"Web View",showOpacity:!1},SPLIT:{id:"split",label:"Split View",showOpacity:!0},FIGMA:{id:"figma",label:"Figma View",showOpacity:!1},OVERLAY:{id:"overlay",label:"Overlay View",showOpacity:!0},MEASURE:{id:"measure",label:"Measure View",showOpacity:!0},DRAGGABLE:{id:"draggable",label:"Draggable View",showOpacity:!0,labelTop:!0},BLEND:{id:"blend",label:"Blend-Diff View",showOpacity:!0,labelTop:!0}};function o(){const e=document.createElement("div");e.id=n,e.className="design-controls",e.style.cssText=`\n        position: fixed;\n        top: 20px;\n        right: 20px;\n        display: ${t.isVisible?"flex":"none"};\n        flex-direction: column;\n        gap: 16px;\n        z-index: 999999;\n        background: white;\n        padding: 16px;\n        border-radius: 8px;\n        box-shadow: 0 2px 10px rgba(0,0,0,0.1);\n        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n    `;const o=document.createElement("div");o.className="design-controls__group";const i=document.createElement("h6");i.className="design-controls__label",i.textContent=`Mode: ${s[t.mode.toUpperCase()].label}`,i.style.cssText="\n        margin: 0 0 8px 0;\n        font-size: 12px;\n        font-weight: 600;\n        color: #333;\n    ";const a=document.createElement("div");a.className="design-controls__buttons",a.style.cssText="\n        display: flex;\n        gap: 4px;\n        flex-wrap: wrap;\n    ";const c={WEB:'<svg width="40" height="58" viewBox="0 0 40 58" xmlns="http://www.w3.org/2000/svg"><path d="M0 10.85c0 3.796 1.937 7.136 4.87 9.075A10.86 10.86 0 000 29a10.86 10.86 0 004.87 9.075A10.86 10.86 0 000 47.15C0 53.155 4.89 58 10.833 58c5.998 0 10.932-4.89 10.932-10.949V37.028a10.702 10.702 0 007.255 2.822h.196C35.172 39.85 40 34.992 40 29a10.86 10.86 0 00-4.87-9.075A10.86 10.86 0 0040 10.85C40 4.858 35.172 0 29.216 0H10.784C4.828 0 0 4.858 0 10.85zm29.216 7.3c4.006 0 7.255-3.268 7.255-7.3 0-4.031-3.248-7.299-7.255-7.299h-7.451V18.15h7.45zm-10.98 3.55h-7.452c-4.006 0-7.254 3.27-7.254 7.3 0 4.031 3.249 7.3 7.255 7.3h7.451V21.7zm3.529 7.3c0 4.031 3.248 7.3 7.255 7.3h.196c4.006 0 7.255-3.269 7.255-7.3s-3.248-7.3-7.255-7.3h-.196c-4.007 0-7.255 3.269-7.255 7.3zm-10.98 10.85h7.45v7.201c0 4.073-3.329 7.398-7.402 7.398-4.02 0-7.304-3.28-7.304-7.3 0-4.03 3.249-7.299 7.255-7.299zm7.45-36.299V18.15h-7.45c-4.007 0-7.256-3.268-7.256-7.3 0-4.031 3.249-7.299 7.255-7.299h7.451z" fill-rule="evenodd"></path></svg>',SPLIT:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 10.935v2.131l-8 3.947v-2.23L21.64 12 16 9.21V6.987l8 3.948zM8 14.783L2.36 12 8 9.21V6.987l-8 3.948v2.131l8 3.947v-2.23zM15.047 4h-2.078L8.958 20h2.073l4.016-16z"></path></svg>',FIGMA:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M4 17.162L2 18V5.028L14 0v2.507L4 6.697v10.465zm16-8.156v8.635l-8 3.352v-8.635l8-3.352zM22 6l-12 5.028V24l12-5.028V6zM8 9.697l10-4.19V3L6 8.028V21l2-.838V9.697z"></path></svg>',DRAGGABLE:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M6 13v4l-6-5 6-5v4h3v2H6zm9-2v2h3v4l6-5-6-5v4h-3zm-4-6v14h2V5h-2z"></path></svg>',BLEND:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M22 2v20L2 2h20zm2-2H0v24h24V0z"></path></svg>',OVERLAY:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M14 9l10 7.675-4.236.71 2.66 5.423L19.983 24l-2.675-5.474L14 21.389V9zM7 2h5V0H7v2zm7 0h3v3h2V0h-5v2zM2 5V2h3V0H0v5h2zm-2 7h2V7H0v5zm5 5H2v-3H0v5h5v-2zM17 7v1.781l2 1.535V7h-2zM7 19h5v-2H7v2z"></path></svg>',MEASURE:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 3v5h-1V5h-2v3h-1V5h-2v5h-1V5h-2v3h-1V5h-2v3h-1V5H9v5H8V5H6v3H5V5H2v14h22v2H0V3h24zM10 17v-6H8.859c0 .91-.809 1.07-1.701 1.111v1h1.488V17H10zm5.078-.985v.958H19v-1.306h-1.826c.822-.74 1.722-1.627 1.722-2.782 0-1.146-.763-1.885-1.941-1.885-.642 0-1.288.204-1.833.656l.424 1.148c.352-.279.715-.524 1.168-.524.486 0 .754.255.754.717-.011.774-.861 1.527-2.39 3.018z"></path></svg>'};Object.values(s).forEach((e=>{const n=document.createElement("div");n.style.cssText="\n            position: relative;\n            display: inline-block;\n        ";const s=document.createElement("button");s.className="design-controls__button"+(t.mode===e.id?" design-controls__button--active":""),s.innerHTML=c[e.id.toUpperCase()],s.style.cssText=`\n            width: 40px;\n            height: 40px;\n            border: none;\n            border-radius: 4px;\n            background: ${t.mode===e.id?"#e0e0e0":"#f0f0f0"};\n            cursor: pointer;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            transition: all 0.2s;\n            padding: 8px;\n        `;const o=document.createElement("div");o.className="design-controls__tooltip",o.textContent=e.label,o.style.cssText="\n            position: absolute;\n            bottom: 100%;\n            left: 50%;\n            transform: translateX(-50%);\n            padding: 4px 8px;\n            background: rgba(0, 0, 0, 0.75);\n            color: white;\n            font-size: 12px;\n            border-radius: 4px;\n            white-space: nowrap;\n            pointer-events: none;\n            opacity: 0;\n            transition: opacity 0.2s;\n            margin-bottom: 4px;\n        ",s.addEventListener("mouseover",(()=>{s.style.background="#e0e0e0",o.style.opacity="1"})),s.addEventListener("mouseout",(()=>{s.style.background=t.mode===e.id?"#e0e0e0":"#f0f0f0",o.style.opacity="0"})),s.addEventListener("click",(()=>{t.mode=e.id,i.textContent=`Mode: ${e.label}`,l(),a.querySelectorAll(".design-controls__button").forEach((e=>{e.classList.remove("design-controls__button--active"),e.style.background="#f0f0f0"})),s.classList.add("design-controls__button--active"),s.style.background="#e0e0e0",d.style.display=e.showOpacity?"block":"none"})),n.appendChild(o),n.appendChild(s),a.appendChild(n)})),o.appendChild(i),o.appendChild(a);const d=document.createElement("div");d.className="design-controls__group controls__group--collapseable",d.style.display=s[t.mode.toUpperCase()].showOpacity?"block":"none";const r=document.createElement("h6");r.className="design-controls__label",r.textContent="Overlay Opacity",r.style.cssText="\n        margin: 0 0 8px 0;\n        font-size: 12px;\n        font-weight: 600;\n        color: #333;\n    ";const p=document.createElement("div");p.className="design-controls__slider",p.style.cssText="\n        display: flex;\n        align-items: center;\n        gap: 8px;\n    ";const g=document.createElement("input");g.type="range",g.id="opacity",g.name="opacity",g.min="0.01",g.max="1",g.step="0.01",g.value=String(t.opacity),g.className="design-controls__range",g.style.cssText="\n        width: 100px;\n        margin: 0;\n        -webkit-appearance: none;\n        height: 4px;\n        background: #e0e0e0;\n        border-radius: 2px;\n        outline: none;\n    ";const h=document.createElement("span");return h.className="design-controls__value",h.textContent=`${Math.round(100*t.opacity)}%`,h.style.cssText="\n        font-size: 12px;\n        color: #666;\n        min-width: 36px;\n    ",g.addEventListener("input",(()=>{t.opacity=Number(g.value),h.textContent=`${Math.round(100*t.opacity)}%`,l()})),p.appendChild(g),p.appendChild(h),d.appendChild(r),d.appendChild(p),e.appendChild(o),e.appendChild(d),document.body.appendChild(e),e}function i(){let n=document.getElementById(e);return n||(n=document.createElement("div"),n.id=e,n.style.cssText=`\n            position: fixed;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n            pointer-events: none;\n            z-index: 999998;\n            display: ${t.isVisible?"block":"none"};\n        `,document.body.appendChild(n)),n}function a(e){const n=i();n.innerHTML="";const t=document.createElement("img");t.src=e.imageUrl,t.style.cssText="\n        width: 100%;\n        height: 100%;\n        object-fit: contain;\n    ",n.appendChild(t)}function l(){const e=i();switch(t.mode){case s.WEB.id:e.style.display="none";break;case s.FIGMA.id:e.style.display="block",e.style.opacity="1";break;case s.SPLIT.id:e.style.display="block",e.style.clipPath="inset(0 50% 0 0)",e.style.opacity="1";break;case s.OVERLAY.id:case s.MEASURE.id:case s.BLEND.id:case s.DRAGGABLE.id:e.style.display="block",e.style.clipPath="none",e.style.opacity=String(t.opacity)}}function c(){t.isInitialized?console.log("UI already initialized"):(o(),i(),t.isInitialized=!0,t.frames.length>0&&(a(t.frames[0]),l()))}function d(e){var n,s;const o=e.data;switch(console.log("Received window message:",o),o.type){case"INIT_COMPARISON":c(),null===(n=e.source)||void 0===n||n.postMessage({type:"INIT_COMPARISON_DONE"},{targetOrigin:"*"});break;case"FIGMA_FRAMES":if(!Array.isArray(o.frames)||0===o.frames.length)return void console.error("Invalid frames data received");t.frames=o.frames,t.isInitialized||c(),a(t.frames[0]),l(),null===(s=e.source)||void 0===s||s.postMessage({type:"FRAMES_RECEIVED"},{targetOrigin:"*"})}}chrome.runtime.onMessage.addListener(((s,d,r)=>{switch(console.log("Received chrome message:",s),s.type){case"TOGGLE_UI":console.log("Handling TOGGLE_UI message"),function(){console.log("Toggling UI, current state:",t),t.isInitialized||(console.log("Initializing comparison..."),c()),t.isVisible=!t.isVisible,console.log("New visibility state:",t.isVisible);const s=document.getElementById(n),a=document.getElementById(e);s?(console.log("Updating controls visibility"),s.style.display=t.isVisible?"flex":"none"):(console.log("Controls not found, creating..."),o()),a?(console.log("Updating overlay visibility"),a.style.display=t.isVisible?"block":"none"):(console.log("Overlay not found, creating..."),i())}(),0===t.frames.length&&console.log("No frames loaded yet"),r({success:!0,visible:t.isVisible});break;case"INIT_COMPARISON":console.log("Handling INIT_COMPARISON message"),c(),r({success:!0});break;case"FIGMA_FRAMES":if(console.log("Handling FIGMA_FRAMES message",s.frames),!Array.isArray(s.frames)||0===s.frames.length)return console.error("Invalid frames data received"),void r({success:!1,error:"Invalid frames data"});t.frames=s.frames,t.isInitialized||c(),a(t.frames[0]),l(),r({success:!0});break;default:console.warn("Unknown message type:",s.type),r({success:!1,error:"Unknown message type"})}return!0})),document.addEventListener("DOMContentLoaded",(()=>{console.log("DOM Content Loaded"),window.addEventListener("message",d),chrome.runtime.sendMessage({type:"CONTENT_READY"},(e=>{console.log("Content script ready, response:",e)}))}))})();