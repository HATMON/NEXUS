import fs from "node:fs";
const required=["app/api/admin/login/route.ts","app/api/auth/otp/request/route.ts","app/api/stripe/webhook/route.ts","app/api/payments/mpesa/initiate/route.ts","lib/customer-auth.ts","models/User.ts"];
for(const f of required){if(!fs.existsSync(f)){console.error("Missing required file:",f);process.exit(1);}}
for(const f of ["app/api/admin/orders/route.ts","app/api/admin/products/route.ts","app/api/admin/products/bulk/route.ts"]){if(!fs.readFileSync(f,"utf8").includes("requireAdmin")){console.error("Admin authorization missing:",f);process.exit(1);}}
console.log("EcoVolt source smoke checks passed.");
