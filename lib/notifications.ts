type DeliveryResult={sent:boolean;provider?:string;error?:string};

export async function sendEmail(to:string,subject:string,text:string):Promise<DeliveryResult>{
  const key=process.env.RESEND_API_KEY, from=process.env.EMAIL_FROM;
  if(!key||!from) return {sent:false,error:"Email provider not configured"};
  try{
    const r=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${key}`,"Content-Type":"application/json"},body:JSON.stringify({from,to:[to],subject,text})});
    if(!r.ok) return {sent:false,provider:"resend",error:`HTTP ${r.status}`};
    return {sent:true,provider:"resend"};
  }catch(e){return {sent:false,provider:"resend",error:e instanceof Error?e.message:"Email failed"};}
}

export async function sendSms(to:string,message:string):Promise<DeliveryResult>{
  const key=process.env.AFRICASTALKING_API_KEY, username=process.env.AFRICASTALKING_USERNAME;
  if(!key||!username) return {sent:false,error:"SMS provider not configured"};
  try{
    const body=new URLSearchParams({username,to,message});
    const r=await fetch("https://api.africastalking.com/version1/messaging",{method:"POST",headers:{apiKey:key,"Content-Type":"application/x-www-form-urlencoded",Accept:"application/json"},body});
    if(!r.ok) return {sent:false,provider:"africastalking",error:`HTTP ${r.status}`};
    return {sent:true,provider:"africastalking"};
  }catch(e){return {sent:false,provider:"africastalking",error:e instanceof Error?e.message:"SMS failed"};}
}

export async function deliverOtp(input:{email?:string;phone?:string;code:string}){
  const jobs:Promise<DeliveryResult>[]=[];
  if(input.email) jobs.push(sendEmail(input.email,"EcoVolt verification code",`Your EcoVolt verification code is ${input.code}. It expires in 10 minutes.`));
  if(input.phone) jobs.push(sendSms(input.phone,`EcoVolt verification code: ${input.code}. Expires in 10 minutes.`));
  const results=await Promise.all(jobs);
  return {sent:results.some(r=>r.sent),results};
}
