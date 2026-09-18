# EcoVolt Nexus deployment checklist

Set Preview environment variables for MongoDB, admin/customer session secrets, Stripe test mode, Google OAuth, Resend, Africa's Talking, and M-Pesa sandbox. Keep EXPOSE_DEV_OTP=false on Vercel.

Stripe webhook: https://YOUR-DOMAIN/api/stripe/webhook (checkout.session.completed)
Google redirect: https://YOUR-DOMAIN/api/auth/google/callback
M-Pesa callback: https://YOUR-DOMAIN/api/payments/mpesa/callback

Before production run npm run test and npm run build, verify MongoDB access from Vercel, and complete end-to-end admin, customer, catalogue, order, payment, tracking, notification, contact and quote tests.
