export const GROUPS={fixed:'Charges fixes',variable:'Charges variables',loan:'Prêts',saving:'Épargne',income:'Revenus',withdrawal:'Retrait d’épargne',adjustment:'Ajustement de solde'};
export const CATEGORIES=[
['rent','Loyer','🏠','fixed'],['energy','ENGIE / énergie','💡','fixed'],['water','Eau','💧','fixed'],['homeinsurance','Assurance habitation','🛡️','fixed'],['carinsurance','Assurance voiture','🚗','fixed'],['healthinsurance','Mutuelle','❤️','fixed'],['phone','Téléphone','📱','fixed'],['internet','Internet','📶','fixed'],['subscription','Abonnements','🎟️','fixed'],['tax','Impôts et taxes','🏛️','fixed'],['bank','Frais bancaires','🏦','fixed'],['fixedother','Autre charge fixe','📌','fixed'],
['groceries','Courses','🛒','variable'],['fuel','Carburant','⛽','variable'],['restaurant','Restaurant / café','🍽️','variable'],['leisure','Loisirs','🎭','variable'],['health','Santé','🩺','variable'],['car','Entretien voiture','🔧','variable'],['transport','Transport / parking','🚌','variable'],['house','Maison','🛋️','variable'],['clothes','Vêtements','👕','variable'],['holidays','Vacances','🏖️','variable'],['gifts','Cadeaux','🎁','variable'],['family','Famille','👨‍👩‍👧','variable'],['sport','Sport','🎾','variable'],['beauty','Coiffeur / soins','✂️','variable'],['other','Autre dépense','🧾','variable'],
['carloan','Prêt voiture','🚙','loan'],['personalloan','Prêt personnel','📄','loan'],['otherloan','Autre prêt','🏦','loan'],['per','PER','🌱','saving'],['livreta','Livret A','🐷','saving'],['pea','PEA','📈','saving'],['term','Compte à terme','🔐','saving'],['savingother','Autre épargne','💰','saving'],['salary','Salaire net','💼','income'],['pension','Pension / retraite','☀️','income'],['incomeother','Autre revenu','💶','income'],['adjust','Correction de solde','⚖️','adjustment']
].map(([id,name,icon,group])=>({id,name,icon,group}));
export const cat=id=>CATEGORIES.find(c=>c.id===id);
export const round=n=>Math.round((n+Number.EPSILON)*100)/100;
export const uid=()=>{if(globalThis.crypto.randomUUID)return globalThis.crypto.randomUUID();const a=globalThis.crypto.getRandomValues(new Uint8Array(16));a[6]=(a[6]&15)|64;a[8]=(a[8]&63)|128;const h=[...a].map(b=>b.toString(16).padStart(2,'0')).join('');return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`;};
export function today(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
export const monthOf=d=>d.slice(0,7);
export function shiftMonth(m,n){const [y,mo]=m.split('-').map(Number);const d=new Date(y,mo-1+n,1);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;}
export function validMonth(m){return /^\d{4}-(0[1-9]|1[0-2])$/.test(m)&&m>='1900-01'&&m<='2199-12';}
export function validDate(d){if(!/^\d{4}-(0[1-9]|1[0-2])-\d{2}$/.test(d)||!validMonth(d.slice(0,7)))return false;const [y,m,day]=d.split('-').map(Number);return day>=1&&day<=new Date(y,m,0).getDate();}
export function dueDate(month,day){const [y,m]=month.split('-').map(Number);return `${month}-${String(Math.min(day,new Date(y,m,0).getDate())).padStart(2,'0')}`;}
export function initialState(openingDate,openingBalance){return {app:'MonBuget',version:1,settings:{openingDate,openingBalance},transactions:[],recurring:[],skipped:[],budgets:{},holdings:{},lastBackup:null};}
export const effect=t=>round(['income','withdrawal','adjustment'].includes(t.type)?t.amount:-t.amount);
export function plannedForMonth(state,month){
const handled=new Set([...state.skipped,...state.transactions.map(t=>t.scheduleKey).filter(Boolean)]);
return state.recurring.filter(r=>r.start<=month&&(!r.end||r.end>=month)).map(r=>({...r,id:`${r.series}:${month}`,scheduleKey:`${r.series}:${month}`,date:dueDate(month,r.day),status:'planned',recurringId:r.id})).filter(t=>t.date>=state.settings.openingDate&&!handled.has(t.scheduleKey));
}
export function entries(state,month){return [...state.transactions.filter(t=>monthOf(t.date)===month&&t.date>=state.settings.openingDate),...plannedForMonth(state,month)].sort((a,b)=>a.date.localeCompare(b.date)||a.id.localeCompare(b.id));}
export function balanceAt(state,date){if(date<state.settings.openingDate)return null;return round(state.settings.openingBalance+state.transactions.filter(t=>t.status==='confirmed'&&t.date>=state.settings.openingDate&&t.date<=date).reduce((n,t)=>n+effect(t),0));}
export function monthSummary(state,month,now=today()){
const all=entries(state,month),end=dueDate(month,31),start=month+'-01';const real=all.filter(t=>t.status==='confirmed');const planned=all.filter(t=>t.status==='planned');
const totals={};for(const type of Object.keys(GROUPS))totals[type]=round(real.filter(t=>t.type===type).reduce((n,t)=>n+t.amount,0));
const startBalance=monthOf(state.settings.openingDate)===month?state.settings.openingBalance:balanceAt(state,new Date(Number(month.slice(0,4)),Number(month.slice(5))-1,0).toLocaleDateString('sv-SE'));
const current=balanceAt(state,now<end?now:end);
// Prévision : les retards antérieurs restent à confirmer et affectent le disponible.
let carry=0;const openingMonth=monthOf(state.settings.openingDate);let cursor=openingMonth;
while(cursor<month){carry+=entries(state,cursor).filter(t=>t.status==='planned').reduce((n,t)=>n+effect(t),0);cursor=shiftMonth(cursor,1);}
const confirmedEnd=balanceAt(state,end);
return {all,real,planned,totals,startBalance,current,carry:round(carry),forecast:confirmedEnd===null?null:round(confirmedEnd+carry+planned.reduce((n,t)=>n+effect(t),0)),expenses:round(totals.fixed+totals.variable+totals.loan),saving:round(totals.saving-totals.withdrawal)};
}
export function overdue(state,month){let m=monthOf(state.settings.openingDate),list=[];while(m<month){list.push(...entries(state,m).filter(t=>t.status==='planned'));m=shiftMonth(m,1);}return list;}
export function validateState(s){
const fail=()=>{throw Error('Fichier de sauvegarde invalide ou incompatible.');};
if(!s||s.app!=='MonBuget'||s.version!==1||!s.settings||!validDate(s.settings.openingDate)||!Number.isFinite(s.settings.openingBalance)||Math.abs(s.settings.openingBalance)>1e10)fail();
if(!Array.isArray(s.transactions)||!Array.isArray(s.recurring)||!Array.isArray(s.skipped)||s.transactions.length>100000||s.recurring.length>5000||s.skipped.length>100000)fail();
const ids=new Set(),keys=new Set();const text=(v,max)=>typeof v==='string'&&v.length<=max;
for(const t of s.transactions){if(!t||!text(t.id,150)||ids.has(t.id)||!validDate(t.date)||t.date<s.settings.openingDate||!['confirmed','planned'].includes(t.status)||!validOperation(t)||!text(t.label,200)||!text(t.note,1000)||t.scheduleKey&&!text(t.scheduleKey,100))fail();ids.add(t.id);if(t.scheduleKey){if(keys.has(t.scheduleKey))fail();keys.add(t.scheduleKey);}}
for(const r of s.recurring){if(!r||!text(r.id,150)||ids.has(r.id)||!text(r.series,100)||!validMonth(r.start)||r.end&&(!validMonth(r.end)||r.end<r.start)||!Number.isInteger(r.day)||r.day<1||r.day>31||!validOperation(r)||r.type==='adjustment'||!text(r.label,200)||!text(r.note,1000))fail();ids.add(r.id);}
for(let i=0;i<s.recurring.length;i++)for(let j=i+1;j<s.recurring.length;j++){let a=s.recurring[i],b=s.recurring[j];if(a.series===b.series&&a.start<=(b.end||'2199-12')&&b.start<=(a.end||'2199-12'))fail();}
if(s.skipped.some(k=>!text(k,150)))fail();
if(!s.budgets||typeof s.budgets!=='object'||Array.isArray(s.budgets)||!s.holdings||typeof s.holdings!=='object'||Array.isArray(s.holdings))fail();
for(const [k,v]of Object.entries(s.budgets))if(!cat(k)||!Number.isFinite(v)||v<0||v>1e10)fail();
for(const [k,v]of Object.entries(s.holdings))if(!cat(k)||!v||!Number.isFinite(v.value)||v.value<0||v.value>1e10||!validDate(v.date))fail();
if(s.lastBackup!==null&&(!text(s.lastBackup,50)||!Number.isFinite(Date.parse(s.lastBackup))))fail();return s;
}
export function validOperation(t){return cat(t.category)&&((cat(t.category).group===t.type)||(t.type==='withdrawal'&&cat(t.category).group==='saving'))&&Number.isFinite(t.amount)&&Math.abs(t.amount)<=1e10&&(t.type==='adjustment'?t.amount!==0:t.amount>0);}
