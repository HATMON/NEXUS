function baseUrl(){ return process.env.MPESA_ENV==="production" ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke"; }
function timestamp(){ const d=new Date(); const p=(n:number)=>String(n).padStart(2,"0"); return `${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`; }
export async function getMpesaToken(){
  const key=process.env.MPESA_CONSUMER_KEY, secret=process.env.MPESA_CONSUMER_SECRET;
  if(!key||!secret) throw new Error("M-Pesa credentials are not configured.");
  const auth=Buffer.from(`${key}:${secret}`).toString("base64");
  const r=await fetch(`${baseUrl()}/oauth/v1/generate?grant_type=client_credentials`,{headers:{Authorization:`Basic ${auth}`},cache:"no-store"});
  if(!r.ok) throw new Error(`M-Pesa OAuth failed (${r.status}).`); const data:any=await r.json(); return data.access_token as string;
}
export function normalizeMpesaPhone(phone:string){ let d=phone.replace(/\D/g,""); if(d.startsWith("0")) d=`254${d.slice(1)}`; if(d.startsWith("+")) d=d.slice(1); return d; }
export async function initiateStkPush(input:{phone:string;amount:number;accountReference:string;description:string}){
  const shortcode=process.env.MPESA_SHORTCODE, passkey=process.env.MPESA_PASSKEY, callback=process.env.MPESA_CALLBACK_URL;
  if(!shortcode||!passkey||!callback) throw new Error("M-Pesa STK settings are not configured.");
  const ts=timestamp(); const password=Buffer.from(`${shortcode}${passkey}${ts}`).toString("base64"); const token=await getMpesaToken();
  const payload={BusinessShortCode:shortcode,Password:password,Timestamp:ts,TransactionType:"CustomerPayBillOnline",Amount:Math.max(1,Math.round(input.amount)),PartyA:normalizeMpesaPhone(input.phone),PartyB:shortcode,PhoneNumber:normalizeMpesaPhone(input.phone),CallBackURL:callback,AccountReference:input.accountReference,TransactionDesc:input.description.slice(0,13)};
  const r=await fetch(`${baseUrl()}/mpesa/stkpush/v1/processrequest`,{method:"POST",headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},body:JSON.stringify(payload)}); const data:any=await r.json(); if(!r.ok||data.ResponseCode!=="0") throw new Error(data.errorMessage||data.ResponseDescription||"M-Pesa STK request failed."); return data;
}
