!function(e){var t={};function n(r){if(t[r])return t[r].exports;var a=t[r]={i:r,l:!1,exports:{}};return e[r].call(a.exports,a,a.exports,n),a.l=!0,a.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)n.d(r,a,function(t){return e[t]}.bind(null,a));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=2)}([function(e,t){e.exports=React},function(e,t){e.exports=ReactDOM},function(e,t,n){"use strict";n.r(t);var r,a=n(0),i=n.n(a),o=n(1),l=n.n(o);!function(e){e[e.initialRender=0]="initialRender",e[e.beforeTransition=1]="beforeTransition",e[e.duringTransition=2]="duringTransition",e[e.afterTransition=3]="afterTransition"}(r||(r={}));const c=a.createContext(null);function s(e){const t=Date.now(),{left:n,right:r,top:a,bottom:i}=e.getBoundingClientRect();return{timestamp:t,left:n,right:r,top:a,bottom:i,width:r-n,height:i-a}}function u(e){return{x:e.left+e.width/2,y:e.top+e.height/2}}const f=new Map,d={takeSnapshot:(e,t,n)=>(function(e,t,n,r){const a=s(r);if(!a.width||!a.height)return;const i=e.get(t);i?i.set(n,a):e.set(t,new Map([[n,a]]))})(f,e,t,n),removeSnapshot:(e,t)=>(function(e,t,n){let r;(r=e.get(t))&&(r.delete(n),r.size||e.delete(t))})(f,e,t),createStyle(e,t,n,a,i="all 0.3s ease-in"){if("undefined"!=typeof window){if(e===r.initialRender)return{opacity:0};if(e===r.beforeTransition&&a){const e=function(e,t,n){let r;if(r=e.get(t))for(const[e,t]of r.entries())if(e!==n&&t)return t;return null}(f,t,n);if(e){return function(e,t){const n=u(t),r=u(e);return{transform:[`translateX(${n.x-r.x}px)`,`translateY(${n.y-r.y}px)`,`scaleX(${t.width/e.width})`,`scaleY(${t.height/e.height})`].join(" ")}}(s(a),e)}}else{if(e===r.duringTransition)return{transition:i};if(e===r.afterTransition)return}}}},b=({children:e,instanceId:t,isTarget:n,logicalId:i,transition:o})=>{const l=Object(a.useRef)(null),s=Object(a.useContext)(c)||d,[u,f]=Object(a.useState)(()=>n?s.createStyle(r.initialRender,i,t,void 0,o):void 0),b=Object(a.useCallback)(()=>{l.current instanceof HTMLElement&&i&&t&&s.takeSnapshot(i,t,l.current)},[i,t,s]),m=Object(a.useCallback)(()=>{i&&t&&s.removeSnapshot(i,t)},[t,i,s]);if(Object(a.useLayoutEffect)(()=>{const e=l.current;if(!(e instanceof HTMLElement))return;b();let a=!0;if(n&&i&&t&&u){const n=s.createStyle(r.beforeTransition,i,t,l.current,o);if(f(n||void 0),!n)return;requestAnimationFrame(()=>{if(!a||l.current!==e)return;e.getBoundingClientRect(),f(s.createStyle(r.duringTransition,i,t,e,o));const n=()=>{e.removeEventListener("transitionend",n),a&&l.current===e&&f(s.createStyle(r.afterTransition,i,t,e,o))};e.addEventListener("transitionend",n)})}return()=>{a=!1}},[n,i,t,o,b,s]),"function"!=typeof e)return e;if(e.length>3)return e(u,b,m,l);{const t=e(u,b,m);return Object(a.cloneElement)(t,{ref:l})}},m={button:"p-2 inline-block border border-solid shadow-outline focus:outline-0",verticalContainer:"flex p-4 justify-around",tabHeader:"flex items-center justify-end p-4 ",userIcon:"flex-none inline-block w-24 h-24 border-solid border bg-gray-200",tabContent:"h-64",mainContent:"h-64 bg-gray-100",userAvatar:"w-40 h-40 border-solid border inline-block bg-gray-200 mx-4"},g=e=>{const[t,n]=Object(a.useState)(1);return i.a.createElement("div",null,i.a.createElement("p",{className:m.verticalContainer},i.a.createElement("button",{title:"tab1",className:m.button,onClick:()=>n(1)},"tab1"),i.a.createElement("button",{title:"tab2",className:m.button,onClick:()=>n(2)},"tab2")),1===t&&i.a.createElement("div",null,i.a.createElement("div",{className:m.tabContent},i.a.createElement(b,{logicalId:"user",instanceId:"tab",isTarget:!0,transition:"all 2s linear"},(e,t,n,r)=>(console.log("user/tab",e),i.a.createElement("div",{className:m.userIcon,ref:r,style:e})))),i.a.createElement("div",{className:m.mainContent},i.a.createElement("p",null,"page1"))),2===t&&i.a.createElement("div",null,i.a.createElement("div",{className:m.tabContent}),i.a.createElement("div",{className:m.mainContent},i.a.createElement("p",null,"page2"),i.a.createElement(b,{logicalId:"user",instanceId:"main",isTarget:!0},(e,t)=>(console.log("user/main",e),i.a.createElement("div",{className:m.userAvatar,style:e,onClick:()=>{t(),n(1)}}))))))};l.a.render(i.a.createElement(i.a.Fragment,null,i.a.createElement(g,null)),document.getElementById("root"))}]);
//# sourceMappingURL=main.1b80c83c.js.map