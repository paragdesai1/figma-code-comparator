(()=>{"use strict";const e={mode:"figma",opacity:.5},n="figma-overlay",t="figma-controls";function o(){console.log("Initializing overlay and controls"),function(){const t=document.getElementById(n);t&&t.remove();const o=document.createElement("div");o.id=n,o.style.cssText=`\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    background-color: black;\n    opacity: ${e.opacity};\n    pointer-events: none;\n    z-index: 999999;\n    transition: all 0.3s ease;\n  `,document.body.appendChild(o)}(),function(){const o=document.getElementById(t);o&&o.remove();const i=document.createElement("div");i.id=t,i.style.cssText="\n    position: fixed;\n    top: 20px;\n    right: 20px;\n    background: white;\n    padding: 8px;\n    border-radius: 8px;\n    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);\n    z-index: 1000000;\n    display: flex;\n    align-items: center;\n    gap: 8px;\n  ",[{name:"Browser",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none">\n        <path d="M16.36 14C16.44 13.34 16.5 12.68 16.5 12C16.5 11.32 16.44 10.66 16.36 10H19.74C19.9 10.64 20 11.31 20 12C20 12.69 19.9 13.36 19.74 14M14.59 19.56C15.19 18.45 15.65 17.25 15.97 16H18.92C17.96 17.65 16.43 18.93 14.59 19.56M14.34 14H9.66C9.56 13.34 9.5 12.68 9.5 12C9.5 11.32 9.56 10.65 9.66 10H14.34C14.43 10.65 14.5 11.32 14.5 12C14.5 12.68 14.43 13.34 14.34 14M12 19.96C11.17 18.76 10.5 17.43 10.09 16H13.91C13.5 17.43 12.83 18.76 12 19.96M8 8H5.08C6.03 6.34 7.57 5.06 9.4 4.44C8.8 5.55 8.35 6.75 8 8M5.08 16H8C8.35 17.25 8.8 18.45 9.4 19.56C7.57 18.93 6.03 17.65 5.08 16M4.26 14C4.1 13.36 4 12.69 4 12C4 11.31 4.1 10.64 4.26 10H7.64C7.56 10.66 7.5 11.32 7.5 12C7.5 12.68 7.56 13.34 7.64 14M12 4.03C12.83 5.23 13.5 6.57 13.91 8H10.09C10.5 6.57 11.17 5.23 12 4.03M18.92 8H15.97C15.65 6.75 15.19 5.55 14.59 4.44C16.43 5.07 17.96 6.34 18.92 8M12 2C6.47 2 2 6.5 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="currentColor"/>\n      </svg>'},{name:"Code",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none">\n        <path d="M8.7 15.9L4.8 12L8.7 8.1C9.09 7.71 9.09 7.09 8.7 6.7C8.31 6.31 7.69 6.31 7.3 6.7L2.7 11.3C2.31 11.69 2.31 12.31 2.7 12.7L7.3 17.3C7.69 17.69 8.31 17.69 8.7 17.3C9.09 16.91 9.09 16.29 8.7 15.9ZM15.3 15.9L19.2 12L15.3 8.1C14.91 7.71 14.91 7.09 15.3 6.7C15.69 6.31 16.31 6.31 16.7 6.7L21.3 11.3C21.69 11.69 21.69 12.31 21.3 12.7L16.7 17.3C16.31 17.69 15.69 17.69 15.3 17.3C14.91 16.91 14.91 16.29 15.3 15.9Z" fill="currentColor"/>\n      </svg>'},{name:"Figma",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none">\n        <path d="M15 5H9C7.34 5 6 6.34 6 8C6 9.66 7.34 11 9 11H15C16.66 11 18 9.66 18 8C18 6.34 16.66 5 15 5ZM15 9H9C8.45 9 8 8.55 8 8C8 7.45 8.45 7 9 7H15C15.55 7 16 7.45 16 8C16 8.55 15.55 9 15 9ZM15 11H9C7.34 11 6 12.34 6 14C6 15.66 7.34 17 9 17H15C16.66 17 18 15.66 18 14C18 12.34 16.66 11 15 11ZM15 15H9C8.45 15 8 14.55 8 14C8 13.45 8.45 13 9 13H15C15.55 13 16 13.45 16 14C16 14.55 15.55 15 15 15ZM9 17C7.34 17 6 18.34 6 20C6 21.66 7.34 23 9 23C10.66 23 12 21.66 12 20V17H9Z" fill="currentColor"/>\n      </svg>'},{name:"Split",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none">\n        <path d="M18 4V20C18 21.1 17.1 22 16 22H4C2.9 22 2 21.1 2 20V4C2 2.9 2.9 2 4 2H16C17.1 2 18 2.9 18 4ZM13.5 12L16 9.5V4H4V20H16V14.5L13.5 12ZM22 6V18C22 19.1 21.1 20 20 20H19V18H20V6H19V4H20C21.1 4 22 4.9 22 6Z" fill="currentColor"/>\n      </svg>'},{name:"Blend",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none">\n        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="currentColor"/>\n        <path d="M12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11Z" fill="currentColor"/>\n        <path d="M12 13C10.8954 13 10 13.8954 10 15C10 16.1046 10.8954 17 12 17C13.1046 17 14 16.1046 14 15C14 13.8954 13.1046 13 12 13Z" fill="currentColor"/>\n      </svg>'}].forEach((t=>{const o=document.createElement("div");o.style.cssText="\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      gap: 4px;\n    ";const a=document.createElement("button");a.innerHTML=t.icon,a.title=t.name,a.style.cssText=`\n      width: 40px;\n      height: 40px;\n      padding: 8px;\n      border: none;\n      border-radius: 4px;\n      cursor: pointer;\n      background: ${e.mode===t.name.toLowerCase()?"#18A0FB":"#F5F5F5"};\n      color: ${e.mode===t.name.toLowerCase()?"#FFFFFF":"#333333"};\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      transition: all 0.2s ease;\n    `;const s=document.createElement("span");s.textContent=t.name,s.style.cssText="\n      font-size: 10px;\n      color: #333333;\n      text-align: center;\n    ",o.appendChild(a),o.appendChild(s),a.addEventListener("mouseover",(()=>{e.mode!==t.name.toLowerCase()&&(a.style.background="#E8E8E8")})),a.addEventListener("mouseout",(()=>{e.mode!==t.name.toLowerCase()&&(a.style.background="#F5F5F5")})),a.addEventListener("click",(()=>{const o=t.name.toLowerCase();e.mode=o,i.querySelectorAll("button").forEach((e=>{e.style.background=e===a?"#18A0FB":"#F5F5F5",e.style.color=e===a?"#FFFFFF":"#333333"}));const s=document.getElementById(n);if(s)switch(o){case"browser":s.style.display="none";break;case"figma":s.style.display="block",s.style.opacity="1",s.style.clipPath="none";break;case"split":s.style.display="block",s.style.opacity="1",s.style.clipPath="inset(0 50% 0 0)";break;case"blend":s.style.display="block",s.style.opacity=e.opacity.toString(),s.style.clipPath="none"}l.style.display="browser"===o?"none":"block"})),i.appendChild(o)}));const l=document.createElement("input");l.type="range",l.min="0",l.max="1",l.step="0.1",l.value=e.opacity.toString(),l.style.cssText=`\n    width: 100px;\n    margin-left: 8px;\n    accent-color: #18A0FB;\n    display: ${"browser"===e.mode?"none":"block"};\n  `,l.addEventListener("input",(t=>{const o=t.target;e.opacity=parseFloat(o.value);const i=document.getElementById(n);i&&(i.style.opacity=e.opacity.toString())})),i.appendChild(l),document.body.appendChild(i)}()}"loading"===document.readyState?document.addEventListener("DOMContentLoaded",o):o(),chrome.runtime.onMessage.addListener(((e,n,t)=>(console.log("Received message:",e),"INIT_COMPARISON"===e.type&&(o(),t({success:!0})),!0)))})();