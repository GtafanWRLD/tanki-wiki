(()=>{
const script=document.currentScript;
const dataURL=new URL('tank-search.json',script.src);
const root=new URL('../',new URL('../',dataURL));
const normalize=s=>s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9а-яё]/g,'');
let rows;
const data=fetch(dataURL).then(r=>r.json()).then(r=>rows=r);
function openTarget(){
const id=decodeURIComponent(location.hash.slice(1));
const target=document.getElementById(id);
if(!target)return;
let node=target;
while(node){if(node.tagName==='DETAILS')node.open=true;node=node.parentElement}
target.scrollIntoView({block:'start'});
}
window.addEventListener('hashchange',openTarget);
function setup(){
openTarget();
document.querySelectorAll('.tank-finder:not([data-ready])').forEach(box=>{
box.dataset.ready='true';
const input=box.querySelector('input'),output=box.querySelector('.tank-results');
async function search(){
await data;
const q=normalize(input.value);
output.replaceChildren();
if(!q)return;
const matches=rows.map(r=>({r,key:normalize(r.name),slug:normalize(r.slug)})).filter(x=>x.key.includes(q)||x.slug.includes(q)).sort((a,b)=>(a.key===q?0:a.key.startsWith(q)?1:2)-(b.key===q?0:b.key.startsWith(q)?1:2)||a.r.name.localeCompare(b.r.name)).slice(0,20);
if(!matches.length){output.textContent='No matching tanks.';return}
const list=document.createElement('ul');
for(const {r} of matches){const li=document.createElement('li'),a=document.createElement('a');a.href=new URL(r.url,root);a.textContent=r.name+' · '+r.nation+' · Tier '+r.tier;li.append(a);list.append(li)}
output.append(list);
}
input.addEventListener('input',search);
input.addEventListener('keydown',e=>{if(e.key==='Enter'){const a=output.querySelector('a');if(a){e.preventDefault();location.href=a.href}}});
});
}
setup();
if(typeof document$!=='undefined')document$.subscribe(setup);
})();