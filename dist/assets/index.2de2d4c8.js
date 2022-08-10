const lt=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function e(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerpolicy&&(n.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?n.credentials="include":s.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(s){if(s.ep)return;s.ep=!0;const n=e(s);fetch(s.href,n)}};lt();/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const D=window.ShadowRoot&&(window.ShadyCSS===void 0||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,I=Symbol(),V=new WeakMap;class et{constructor(t,e,i){if(this._$cssResult$=!0,i!==I)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(D&&t===void 0){const i=e!==void 0&&e.length===1;i&&(t=V.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&V.set(e,t))}return t}toString(){return this.cssText}}const ht=o=>new et(typeof o=="string"?o:o+"",void 0,I),at=(o,...t)=>{const e=o.length===1?o[0]:t.reduce((i,s,n)=>i+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+o[n+1],o[0]);return new et(e,o,I)},dt=(o,t)=>{D?o.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet):t.forEach(e=>{const i=document.createElement("style"),s=window.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=e.cssText,o.appendChild(i)})},W=D?o=>o:o=>o instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return ht(e)})(o):o;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var O;const q=window.trustedTypes,ct=q?q.emptyScript:"",K=window.reactiveElementPolyfillSupport,j={toAttribute(o,t){switch(t){case Boolean:o=o?ct:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,t){let e=o;switch(t){case Boolean:e=o!==null;break;case Number:e=o===null?null:Number(o);break;case Object:case Array:try{e=JSON.parse(o)}catch{e=null}}return e}},it=(o,t)=>t!==o&&(t==t||o==o),k={attribute:!0,type:String,converter:j,reflect:!1,hasChanged:it};class _ extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u()}static addInitializer(t){var e;(e=this.h)!==null&&e!==void 0||(this.h=[]),this.h.push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach((e,i)=>{const s=this._$Ep(i,e);s!==void 0&&(this._$Ev.set(s,i),t.push(s))}),t}static createProperty(t,e=k){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i=typeof t=="symbol"?Symbol():"__"+t,s=this.getPropertyDescriptor(t,i,e);s!==void 0&&Object.defineProperty(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(s){const n=this[t];this[e]=s,this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||k}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const e=this.properties,i=[...Object.getOwnPropertyNames(e),...Object.getOwnPropertySymbols(e)];for(const s of i)this.createProperty(s,e[s])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const s of i)e.unshift(W(s))}else t!==void 0&&e.push(W(t));return e}static _$Ep(t,e){const i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}u(){var t;this._$E_=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$Eg(),this.requestUpdate(),(t=this.constructor.h)===null||t===void 0||t.forEach(e=>e(this))}addController(t){var e,i;((e=this._$ES)!==null&&e!==void 0?e:this._$ES=[]).push(t),this.renderRoot!==void 0&&this.isConnected&&((i=t.hostConnected)===null||i===void 0||i.call(t))}removeController(t){var e;(e=this._$ES)===null||e===void 0||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])})}createRenderRoot(){var t;const e=(t=this.shadowRoot)!==null&&t!==void 0?t:this.attachShadow(this.constructor.shadowRootOptions);return dt(e,this.constructor.elementStyles),e}connectedCallback(){var t;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$ES)===null||t===void 0||t.forEach(e=>{var i;return(i=e.hostConnected)===null||i===void 0?void 0:i.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$ES)===null||t===void 0||t.forEach(e=>{var i;return(i=e.hostDisconnected)===null||i===void 0?void 0:i.call(e)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=k){var s,n;const r=this.constructor._$Ep(t,i);if(r!==void 0&&i.reflect===!0){const d=((n=(s=i.converter)===null||s===void 0?void 0:s.toAttribute)!==null&&n!==void 0?n:j.toAttribute)(e,i.type);this._$El=t,d==null?this.removeAttribute(r):this.setAttribute(r,d),this._$El=null}}_$AK(t,e){var i,s;const n=this.constructor,r=n._$Ev.get(t);if(r!==void 0&&this._$El!==r){const d=n.getPropertyOptions(r),l=d.converter,h=(s=(i=l==null?void 0:l.fromAttribute)!==null&&i!==void 0?i:typeof l=="function"?l:null)!==null&&s!==void 0?s:j.fromAttribute;this._$El=r,this[r]=h(e,d.type),this._$El=null}}requestUpdate(t,e,i){let s=!0;t!==void 0&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||it)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),i.reflect===!0&&this._$El!==t&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(t,i))):s=!1),!this.isUpdatePending&&s&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((s,n)=>this[n]=s),this._$Ei=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),(t=this._$ES)===null||t===void 0||t.forEach(s=>{var n;return(n=s.hostUpdate)===null||n===void 0?void 0:n.call(s)}),this.update(i)):this._$Ek()}catch(s){throw e=!1,this._$Ek(),s}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;(e=this._$ES)===null||e===void 0||e.forEach(i=>{var s;return(s=i.hostUpdated)===null||s===void 0?void 0:s.call(i)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){this._$EC!==void 0&&(this._$EC.forEach((e,i)=>this._$EO(i,this[i],e)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}_.finalized=!0,_.elementProperties=new Map,_.elementStyles=[],_.shadowRootOptions={mode:"open"},K==null||K({ReactiveElement:_}),((O=globalThis.reactiveElementVersions)!==null&&O!==void 0?O:globalThis.reactiveElementVersions=[]).push("1.3.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var M;const m=globalThis.trustedTypes,J=m?m.createPolicy("lit-html",{createHTML:o=>o}):void 0,v=`lit$${(Math.random()+"").slice(9)}$`,st="?"+v,ut=`<${st}>`,y=document,w=(o="")=>y.createComment(o),C=o=>o===null||typeof o!="object"&&typeof o!="function",ot=Array.isArray,pt=o=>ot(o)||typeof(o==null?void 0:o[Symbol.iterator])=="function",E=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Z=/-->/g,F=/>/g,f=RegExp(`>|[ 	
\f\r](?:([^\\s"'>=/]+)([ 	
\f\r]*=[ 	
\f\r]*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),G=/'/g,Q=/"/g,nt=/^(?:script|style|textarea|title)$/i,$t=o=>(t,...e)=>({_$litType$:o,strings:t,values:e}),vt=$t(1),A=Symbol.for("lit-noChange"),u=Symbol.for("lit-nothing"),X=new WeakMap,ft=(o,t,e)=>{var i,s;const n=(i=e==null?void 0:e.renderBefore)!==null&&i!==void 0?i:t;let r=n._$litPart$;if(r===void 0){const d=(s=e==null?void 0:e.renderBefore)!==null&&s!==void 0?s:null;n._$litPart$=r=new H(t.insertBefore(w(),d),d,void 0,e!=null?e:{})}return r._$AI(o),r},g=y.createTreeWalker(y,129,null,!1),_t=(o,t)=>{const e=o.length-1,i=[];let s,n=t===2?"<svg>":"",r=E;for(let l=0;l<e;l++){const h=o[l];let $,a,c=-1,p=0;for(;p<h.length&&(r.lastIndex=p,a=r.exec(h),a!==null);)p=r.lastIndex,r===E?a[1]==="!--"?r=Z:a[1]!==void 0?r=F:a[2]!==void 0?(nt.test(a[2])&&(s=RegExp("</"+a[2],"g")),r=f):a[3]!==void 0&&(r=f):r===f?a[0]===">"?(r=s!=null?s:E,c=-1):a[1]===void 0?c=-2:(c=r.lastIndex-a[2].length,$=a[1],r=a[3]===void 0?f:a[3]==='"'?Q:G):r===Q||r===G?r=f:r===Z||r===F?r=E:(r=f,s=void 0);const U=r===f&&o[l+1].startsWith("/>")?" ":"";n+=r===E?h+ut:c>=0?(i.push($),h.slice(0,c)+"$lit$"+h.slice(c)+v+U):h+v+(c===-2?(i.push(void 0),l):U)}const d=n+(o[e]||"<?>")+(t===2?"</svg>":"");if(!Array.isArray(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return[J!==void 0?J.createHTML(d):d,i]};class P{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,r=0;const d=t.length-1,l=this.parts,[h,$]=_t(t,e);if(this.el=P.createElement(h,i),g.currentNode=this.el.content,e===2){const a=this.el.content,c=a.firstChild;c.remove(),a.append(...c.childNodes)}for(;(s=g.nextNode())!==null&&l.length<d;){if(s.nodeType===1){if(s.hasAttributes()){const a=[];for(const c of s.getAttributeNames())if(c.endsWith("$lit$")||c.startsWith(v)){const p=$[r++];if(a.push(c),p!==void 0){const U=s.getAttribute(p.toLowerCase()+"$lit$").split(v),T=/([.?@])?(.*)/.exec(p);l.push({type:1,index:n,name:T[2],strings:U,ctor:T[1]==="."?mt:T[1]==="?"?At:T[1]==="@"?bt:N})}else l.push({type:6,index:n})}for(const c of a)s.removeAttribute(c)}if(nt.test(s.tagName)){const a=s.textContent.split(v),c=a.length-1;if(c>0){s.textContent=m?m.emptyScript:"";for(let p=0;p<c;p++)s.append(a[p],w()),g.nextNode(),l.push({type:2,index:++n});s.append(a[c],w())}}}else if(s.nodeType===8)if(s.data===st)l.push({type:2,index:n});else{let a=-1;for(;(a=s.data.indexOf(v,a+1))!==-1;)l.push({type:7,index:n}),a+=v.length-1}n++}}static createElement(t,e){const i=y.createElement("template");return i.innerHTML=t,i}}function b(o,t,e=o,i){var s,n,r,d;if(t===A)return t;let l=i!==void 0?(s=e._$Cl)===null||s===void 0?void 0:s[i]:e._$Cu;const h=C(t)?void 0:t._$litDirective$;return(l==null?void 0:l.constructor)!==h&&((n=l==null?void 0:l._$AO)===null||n===void 0||n.call(l,!1),h===void 0?l=void 0:(l=new h(o),l._$AT(o,e,i)),i!==void 0?((r=(d=e)._$Cl)!==null&&r!==void 0?r:d._$Cl=[])[i]=l:e._$Cu=l),l!==void 0&&(t=b(o,l._$AS(o,t.values),l,i)),t}class gt{constructor(t,e){this.v=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}p(t){var e;const{el:{content:i},parts:s}=this._$AD,n=((e=t==null?void 0:t.creationScope)!==null&&e!==void 0?e:y).importNode(i,!0);g.currentNode=n;let r=g.nextNode(),d=0,l=0,h=s[0];for(;h!==void 0;){if(d===h.index){let $;h.type===2?$=new H(r,r.nextSibling,this,t):h.type===1?$=new h.ctor(r,h.name,h.strings,this,t):h.type===6&&($=new Et(r,this,t)),this.v.push($),h=s[++l]}d!==(h==null?void 0:h.index)&&(r=g.nextNode(),d++)}return n}m(t){let e=0;for(const i of this.v)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class H{constructor(t,e,i,s){var n;this.type=2,this._$AH=u,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$C_=(n=s==null?void 0:s.isConnected)===null||n===void 0||n}get _$AU(){var t,e;return(e=(t=this._$AM)===null||t===void 0?void 0:t._$AU)!==null&&e!==void 0?e:this._$C_}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=b(this,t,e),C(t)?t===u||t==null||t===""?(this._$AH!==u&&this._$AR(),this._$AH=u):t!==this._$AH&&t!==A&&this.T(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.k(t):pt(t)?this.S(t):this.T(t)}j(t,e=this._$AB){return this._$AA.parentNode.insertBefore(t,e)}k(t){this._$AH!==t&&(this._$AR(),this._$AH=this.j(t))}T(t){this._$AH!==u&&C(this._$AH)?this._$AA.nextSibling.data=t:this.k(y.createTextNode(t)),this._$AH=t}$(t){var e;const{values:i,_$litType$:s}=t,n=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=P.createElement(s.h,this.options)),s);if(((e=this._$AH)===null||e===void 0?void 0:e._$AD)===n)this._$AH.m(i);else{const r=new gt(n,this),d=r.p(this.options);r.m(i),this.k(d),this._$AH=r}}_$AC(t){let e=X.get(t.strings);return e===void 0&&X.set(t.strings,e=new P(t)),e}S(t){ot(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new H(this.j(w()),this.j(w()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for((i=this._$AP)===null||i===void 0||i.call(this,!1,!0,e);t&&t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var e;this._$AM===void 0&&(this._$C_=t,(e=this._$AP)===null||e===void 0||e.call(this,t))}}class N{constructor(t,e,i,s,n){this.type=1,this._$AH=u,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=u}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,s){const n=this.strings;let r=!1;if(n===void 0)t=b(this,t,e,0),r=!C(t)||t!==this._$AH&&t!==A,r&&(this._$AH=t);else{const d=t;let l,h;for(t=n[0],l=0;l<n.length-1;l++)h=b(this,d[i+l],e,l),h===A&&(h=this._$AH[l]),r||(r=!C(h)||h!==this._$AH[l]),h===u?t=u:t!==u&&(t+=(h!=null?h:"")+n[l+1]),this._$AH[l]=h}r&&!s&&this.P(t)}P(t){t===u?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t!=null?t:"")}}class mt extends N{constructor(){super(...arguments),this.type=3}P(t){this.element[this.name]=t===u?void 0:t}}const yt=m?m.emptyScript:"";class At extends N{constructor(){super(...arguments),this.type=4}P(t){t&&t!==u?this.element.setAttribute(this.name,yt):this.element.removeAttribute(this.name)}}class bt extends N{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){var i;if((t=(i=b(this,t,e,0))!==null&&i!==void 0?i:u)===A)return;const s=this._$AH,n=t===u&&s!==u||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==u&&(s===u||n);n&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;typeof this._$AH=="function"?this._$AH.call((i=(e=this.options)===null||e===void 0?void 0:e.host)!==null&&i!==void 0?i:this.element,t):this._$AH.handleEvent(t)}}class Et{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){b(this,t)}}const Y=window.litHtmlPolyfillSupport;Y==null||Y(P,H),((M=globalThis.litHtmlVersions)!==null&&M!==void 0?M:globalThis.litHtmlVersions=[]).push("2.2.7");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var R,L;class S extends _{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return(t=(e=this.renderOptions).renderBefore)!==null&&t!==void 0||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=ft(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)===null||t===void 0||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)===null||t===void 0||t.setConnected(!1)}render(){return A}}S.finalized=!0,S._$litElement$=!0,(R=globalThis.litElementHydrateSupport)===null||R===void 0||R.call(globalThis,{LitElement:S});const tt=globalThis.litElementPolyfillSupport;tt==null||tt({LitElement:S});((L=globalThis.litElementVersions)!==null&&L!==void 0?L:globalThis.litElementVersions=[]).push("3.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const St=o=>t=>typeof t=="function"?((e,i)=>(window.customElements.define(e,i),i))(o,t):((e,i)=>{const{kind:s,elements:n}=i;return{kind:s,elements:n,finisher(r){window.customElements.define(e,r)}}})(o,t);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const wt=(o,t)=>t.kind==="method"&&t.descriptor&&!("value"in t.descriptor)?{...t,finisher(e){e.createProperty(t.key,o)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:t.key,initializer(){typeof t.initializer=="function"&&(this[t.key]=t.initializer.call(this))},finisher(e){e.createProperty(t.key,o)}};function rt(o){return(t,e)=>e!==void 0?((i,s,n)=>{s.constructor.createProperty(n,i)})(o,t,e):wt(o,t)}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var z;((z=window.HTMLSlotElement)===null||z===void 0?void 0:z.prototype.assignedElements)!=null;const Ct="/assets/lit.c8dae599.svg";var Pt=Object.defineProperty,xt=Object.getOwnPropertyDescriptor,B=(o,t,e,i)=>{for(var s=i>1?void 0:i?xt(t,e):t,n=o.length-1,r;n>=0;n--)(r=o[n])&&(s=(i?r(t,e,s):r(s))||s);return i&&s&&Pt(t,e,s),s};let x=class extends S{constructor(){super(...arguments),this.docsHint="Click on the Vite and Lit logos to learn more",this.count=0}render(){return vt`
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" class="logo" alt="Vite logo" />
        </a>
        <a href="https://lit.dev" target="_blank">
          <img src=${Ct} class="logo lit" alt="Lit logo" />
        </a>
      </div>
      <slot></slot>
      <div class="card">
        <button @click=${this._onClick} part="button">
          count is ${this.count}
        </button>
      </div>
      <p class="read-the-docs">${this.docsHint}</p>
    `}_onClick(){this.count++}};x.styles=at`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }

    .logo {
      height: 6em;
      padding: 1.5em;
      will-change: filter;
    }
    .logo:hover {
      filter: drop-shadow(0 0 2em #646cffaa);
    }
    .logo.lit:hover {
      filter: drop-shadow(0 0 2em #325cffaa);
    }

    .card {
      padding: 2em;
    }

    .read-the-docs {
      color: #888;
    }

    h1 {
      font-size: 3.2em;
      line-height: 1.1;
    }

    a {
      font-weight: 500;
      color: #646cff;
      text-decoration: inherit;
    }
    a:hover {
      color: #535bf2;
    }

    button {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #1a1a1a;
      cursor: pointer;
      transition: border-color 0.25s;
    }
    button:hover {
      border-color: #646cff;
    }
    button:focus,
    button:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }

    @media (prefers-color-scheme: light) {
      a:hover {
        color: #747bff;
      }
      button {
        background-color: #f9f9f9;
      }
    }
  `;B([rt()],x.prototype,"docsHint",2);B([rt({type:Number})],x.prototype,"count",2);x=B([St("my-element")],x);
