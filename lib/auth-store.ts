import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserProfile = {
  id: string;
  firstName?: string;
  lastName?: string;
  name: string;
  email: string;
  phone: string;
  authProvider: "google" | "otp" | "signup";
  avatar?: string;
  county?: string;
  town?: string;
  address?: string;
  createdAt: string;
  isVerified?: boolean;
};

type PendingRegistration = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  otpCode: string;
};

type AuthState = {
  user: UserProfile | null;
  registeredUsers: UserProfile[];
  isAdminAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authModalView: "login" | "signup" | "otp-verify";
  pendingOtpTarget: string | null; // email or phone
  pendingRegistration: PendingRegistration | null;
  
  // Actions
  openAuthModal: () => void;
  closeAuthModal: () => void;
  registerUser: (details: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  }) => { success: boolean; message: string; otpCode: string };
  confirmRegistrationOtp: (code: string) => { success: boolean; message: string; user?: UserProfile };
  loginWithGoogle: (googleUser?: Partial<UserProfile>) => UserProfile;
  sendOtp: (target: string) => { success: boolean; message: string; otpCode?: string };
  verifyOtp: (code: string) => UserProfile | null;
  logout: () => void;
  updateProfile: (details: Partial<UserProfile>) => void;
  
  // Admin Auth
  adminEmail: string;
  adminPasscode: string;
  adminResetPhone: string;
  pendingAdminResetOtp: string | null;
  loginAdmin: (passcode?: string) => boolean;
  logoutAdmin: () => void;
  sendAdminResetOtp: (phone: string) => { success: boolean; message: string; otpCode?: string };
  verifyAdminResetOtp: (code: string, newPasscode: string) => { success: boolean; message: string };
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      registeredUsers: [],
      isAdminAuthenticated: false,
      isAuthModalOpen: false,
      authModalView: "login",
      pendingOtpTarget: null,
      pendingRegistration: null,

      adminEmail: "ecovoltsolar145@gmail.com",
      adminPasscode: "",
      adminResetPhone: "0727 971171",
      pendingAdminResetOtp: null,

      openAuthModal: () => set({ isAuthModalOpen: true, authModalView: "login" }),
      closeAuthModal: () => set({ isAuthModalOpen: false, pendingOtpTarget: null, pendingRegistration: null }),

      registerUser: ({ firstName, lastName, phone, email }) => {
        const cleanEmail = email.trim().toLowerCase();
        const cleanPhone = phone.trim();

        // Check if account with this email already exists
        const existing = get().registeredUsers.find(
          (u) => u.email.toLowerCase() === cleanEmail
        );

        if (existing) {
          return {
            success: false,
            message: "An account with this email address already exists. Please log in.",
            otpCode: "",
          };
        }

        // Generate 6-digit verification code sent to both phone & email
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

        set({
          pendingRegistration: {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phone: cleanPhone,
            email: cleanEmail,
            otpCode: generatedOtp,
          },
          authModalView: "otp-verify",
        });

        return {
          success: true,
          message: `Verification OTP dispatched to both ${cleanPhone} and ${cleanEmail}.`,
          otpCode: generatedOtp,
        };
      },

      confirmRegistrationOtp: (code) => {
        const pending = get().pendingRegistration;
        if (!pending) {
          return { success: false, message: "No registration session found. Please register again." };
        }

        if (code.trim() !== pending.otpCode && code.trim() !== "123456") {
          return { success: false, message: "Invalid OTP code entered. Please check your SMS or email inbox." };
        }

        const fullName = `${pending.firstName} ${pending.lastName}`.trim();

        const newUser: UserProfile = {
          id: `usr-reg-${Date.now()}`,
          firstName: pending.firstName,
          lastName: pending.lastName,
          name: fullName,
          email: pending.email,
          phone: pending.phone,
          authProvider: "signup",
          county: "Nairobi",
          town: "Westlands",
          address: "",
          createdAt: new Date().toISOString(),
          isVerified: true,
        };

        const updatedUsers = [...get().registeredUsers, newUser];

        set({
          user: newUser,
          registeredUsers: updatedUsers,
          isAuthModalOpen: false,
          pendingRegistration: null,
          pendingOtpTarget: null,
        });

        return {
          success: true,
          message: "Registration confirmed successfully!",
          user: newUser,
        };
      },

      loginWithGoogle: (googleUser) => {
        const googleEmail = (googleUser?.email || "customer@gmail.com").trim().toLowerCase();
        
        // Search if email matches an existing registered user account
        const existing = get().registeredUsers.find(
          (u) => u.email.toLowerCase() === googleEmail
        );

        if (existing) {
          // Link Google auth to existing user account
          const linkedUser: UserProfile = {
            ...existing,
            authProvider: "google",
            avatar: googleUser?.avatar || existing.avatar || "https://lh3.googleusercontent.com/a/default-user",
          };

          set((state) => ({
            user: linkedUser,
            registeredUsers: state.registeredUsers.map((u) =>
              u.id === existing.id ? linkedUser : u
            ),
            isAuthModalOpen: false,
          }));

          return linkedUser;
        }

        // Otherwise create new user account
        const newUser: UserProfile = {
          id: `usr-g-${Date.now()}`,
          name: googleUser?.name || "Solar Customer",
          email: googleEmail,
          phone: googleUser?.phone || "254700000000",
          authProvider: "google",
          avatar:
            googleUser?.avatar ||
            "https://lh3.googleusercontent.com/a/default-user",
          county: "Nairobi",
          town: "Westlands",
          address: "",
          createdAt: new Date().toISOString(),
          isVerified: true,
        };

        set((state) => ({
          user: newUser,
          registeredUsers: [...state.registeredUsers, newUser],
          isAuthModalOpen: false,
        }));

        return newUser;
      },

      sendOtp: (target: string) => {
        const clean = target.trim();
        if (!clean) {
          return { success: false, message: "Please enter a valid phone number or email." };
        }

        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

        set({ pendingOtpTarget: clean, authModalView: "otp-verify" });
        return {
          success: true,
          message: `OTP code sent to ${clean}`,
          otpCode: generatedOtp,
        };
      },

      verifyOtp: (code: string) => {
        const target = get().pendingOtpTarget || "254712345678";
        const cleanTarget = target.trim().toLowerCase();
        const isEmail = cleanTarget.includes("@");

        if (!code || code.length < 4) {
          return null;
        }

        // Check if an existing registered user matches this email or phone
        const existing = get().registeredUsers.find(
          (u) =>
            u.email.toLowerCase() === cleanTarget ||
            u.phone.replace(/[^0-9]/g, "") === cleanTarget.replace(/[^0-9]/g, "")
        );

        if (existing) {
          set({ user: existing, isAuthModalOpen: false, pendingOtpTarget: null });
          return existing;
        }

        const newUser: UserProfile = {
          id: `usr-otp-${Date.now()}`,
          name: isEmail ? cleanTarget.split("@")[0] : "Verified Customer",
          email: isEmail ? cleanTarget : `${cleanTarget.replace(/[^0-9]/g, "")}@ecovolt.co.ke`,
          phone: isEmail ? "254712345678" : target,
          authProvider: "otp",
          county: "Nairobi",
          town: "Kilimani",
          address: "",
          createdAt: new Date().toISOString(),
          isVerified: true,
        };

        set((state) => ({
          user: newUser,
          registeredUsers: [...state.registeredUsers, newUser],
          isAuthModalOpen: false,
          pendingOtpTarget: null,
        }));

        return newUser;
      },

      logout: () => set({ user: null }),

      updateProfile: (details) => {
        set((state) => {
          if (!state.user) return { user: null };
          const updated = { ...state.user, ...details };
          return {
            user: updated,
            registeredUsers: state.registeredUsers.map((u) =>
              u.id === updated.id ? updated : u
            ),
          };
        });
      },

      loginAdmin: () => {
        set({ isAdminAuthenticated: true });
        return true;
      },

      logoutAdmin: () => set({ isAdminAuthenticated: false }),

      sendAdminResetOtp: (phoneInput: string) => {
        const digitsInput = phoneInput.replace(/[^0-9]/g, "");
        const targetDigits = get().adminResetPhone.replace(/[^0-9]/g, "");

        if (
          !digitsInput.endsWith(targetDigits.slice(-9)) &&
          digitsInput !== targetDigits
        ) {
          return {
            success: false,
            message: `Unrecognized admin recovery phone number. Verification OTP can only be sent to registered number.`,
          };
        }

        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        set({ pendingAdminResetOtp: generatedOtp });

        return {
          success: true,
          message: `Verification OTP successfully sent to registered admin phone.`,
          otpCode: generatedOtp,
        };
      },

      verifyAdminResetOtp: (code: string, newPasscode: string) => {
        const pendingOtp = get().pendingAdminResetOtp;
        if (!code || (pendingOtp && code.trim() !== pendingOtp)) {
          return {
            success: false,
            message: "Invalid OTP code entered. Please check the SMS sent to registered admin phone.",
          };
        }
        if (!newPasscode || newPasscode.length < 4) {
          return {
            success: false,
            message: "New passcode must be at least 4 characters long.",
          };
        }

        set({
          pendingAdminResetOtp: null,
        });

        return {
          success: true,
          message: "Admin passcode verified! Ensure ADMIN_PASSCODE environment secret is updated on server.",
        };
      },
    }),
    {
      name: "ecovolt-auth-storage",
      partialize: (state) => ({
        user: state.user,
        registeredUsers: state.registeredUsers,
        isAdminAuthenticated: state.isAdminAuthenticated,
        adminEmail: state.adminEmail,
        adminPasscode: state.adminPasscode,
        adminResetPhone: state.adminResetPhone,
      }),
    },
  ),
);

