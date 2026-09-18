"use client";
import { useEffect } from "react";
import { useAuthStore, UserProfile } from "@/lib/auth-store";

export default function SessionHydrator(){
  const setAuthenticatedUser = useAuthStore((s)=>s.setAuthenticatedUser);
  useEffect(()=>{
    fetch("/api/auth/session", { cache: "no-store" })
      .then(async (r)=> r.ok ? r.json() : null)
      .then((data)=>{ if(data?.authenticated && data.user) setAuthenticatedUser(data.user as UserProfile); })
      .catch(()=>{});
  },[setAuthenticatedUser]);
  return null;
}
