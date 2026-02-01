/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  HelpCircle,
  Home,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Plane,
  Settings,
  UserPlus,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "@/navigation";

export const Navigation: React.FC = () => {
  const t = useTranslations("Navigation");
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Only update active section if on home page
      if (pathname !== "/") {
        return;
      }

      const sections = ["destinations", "services", "faq", "contact"];
      let currentSection = "home";

      if (window.scrollY < 100) {
        currentSection = "home";
      } else {
        for (const sectionId of sections) {
          const element = document.getElementById(sectionId);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 150) {
              currentSection = sectionId;
            }
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // Set active section based on pathname (derived from state)
  const derivedSection = pathname === "/destinations" ? "destinations" : pathname === "/" ? "home" : "home";

  useEffect(() => {
    if (derivedSection !== activeSection) {
      setActiveSection(derivedSection);
    }
  }, [derivedSection, activeSection]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>, id: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (id === "home") {
      if (pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push("/");
      }
      return;
    }

    // Handle destinations navigation to dedicated page
    if (id === "destinations") {
      router.push("/destinations");
      return;
    }

    // If not on home page, navigate home first
    if (pathname !== "/") {
      router.push("/");
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const navLinks = [
    { id: "home", label: t("home"), icon: Home },
    { id: "destinations", label: t("destination"), icon: MapPin },
    { id: "services", label: t("services"), icon: Briefcase },
    { id: "faq", label: t("faq"), icon: HelpCircle },
    { id: "contact", label: t("contact"), icon: Mail },
  ];

  const handleLogoClick = () => {
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`w-full flex justify-between items-center transition-all duration-500 z-[100] ${
          isScrolled
            ? "fixed top-0 bg-white/70 backdrop-blur-xl py-3 px-4 md:px-12 shadow-sm border-b border-gray-100/50"
            : "absolute top-0 bg-transparent py-6 px-4 md:px-12"
        }`}
      >
        <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
          <span className="text-2xl font-bold tracking-tight text-gray-900">KinXplore</span>
        </div>

        {/* Desktop Links */}
        <div
          className={`hidden md:flex items-center px-8 py-3 rounded-full transition-all duration-500 gap-8 text-sm font-medium ${
            isScrolled
              ? "bg-transparent text-gray-600"
              : "bg-white/80 backdrop-blur-md shadow-sm border border-gray-100/50 text-gray-600"
          }`}
        >
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => scrollToSection(e, link.id)}
              className={`transition-colors flex items-center gap-1.5 relative ${
                activeSection === link.id ? "text-blue-600 font-semibold" : "hover:text-blue-600"
              }`}
            >
              {activeSection === link.id && (
                <motion.span layoutId="activeDot" className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
              )}
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-6 text-gray-700">
                <button
                  onClick={() => router.push("/bookings")}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full font-bold text-sm transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  <Plane size={16} />
                  My Bookings
                </button>
              </div>

              <div className="relative flex items-center gap-3 pl-0 md:pl-4 md:border-l border-gray-200">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-3 hover:opacity-80 transition"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm bg-blue-600 flex items-center justify-center text-white font-bold">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span>{profile?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}</span>
                    )}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-[10px] text-gray-400 font-medium leading-none mb-1">{t("hello")}</p>
                    <p className="text-sm font-bold text-gray-900 leading-none">
                      {profile?.full_name || user.email?.split("@")[0] || t("traveler")}
                    </p>
                  </div>
                </button>

                {/* User Dropdown */}
                {showUserDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowUserDropdown(false)} />
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-bold text-gray-900">{profile?.full_name || "User"}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <div className="py-2">
                        <button
                          onClick={() => {
                            setShowUserDropdown(false);
                            router.push("/profile");
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-3"
                        >
                          <Settings size={16} />
                          Profile Settings
                        </button>
                        <button
                          onClick={() => {
                            setShowUserDropdown(false);
                            openTripsModal();
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-3"
                        >
                          <Plane size={16} />
                          My Trips
                        </button>
                        <button
                          onClick={() => {
                            setShowUserDropdown(false);
                            router.push("/bookings");
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-3"
                        >
                          <ShoppingBag size={16} />
                          My Bookings
                        </button>
                      </div>
                      <div className="border-t border-gray-100 py-2">
                        <button
                          onClick={async () => {
                            setShowUserDropdown(false);
                            await signOut();
                            router.push("/");
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-3"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => router.push("/login")}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 font-medium text-sm transition-all"
              >
                <LogIn size={16} />
                Login
              </button>
              <button
                onClick={() => router.push("/register")}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full font-bold text-sm transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                <UserPlus size={16} />
                Sign Up
              </button>
            </div>
          )}

          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2.5 rounded-2xl bg-white/80 backdrop-blur-md border border-gray-100 shadow-sm text-gray-900"
          >
            <Menu size={24} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[110] md:hidden"
            />

            {/* Drawer Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[80%] max-w-sm bg-white z-[120] shadow-2xl flex flex-col md:hidden p-8"
            >
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl italic shadow-lg shadow-blue-500/20">
                    K
                  </div>
                  <span className="text-xl font-bold text-gray-900">KinXplore</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 space-y-6">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4">Main Menu</p>
                <div className="space-y-2">
                  {/* My Trips - Featured */}
                  <div
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      openTripsModal();
                    }}
                    className="flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl active:scale-95"
                  >
                    <div className="flex items-center gap-4">
                      <Plane size={20} />
                      <span className="font-bold">My Trips</span>
                    </div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  </div>

                  {navLinks.map((link) => (
                    <div
                      key={link.id}
                      onClick={(e) => scrollToSection(e as any, link.id)}
                      className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${
                        activeSection === link.id ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <link.icon
                          size={20}
                          className={activeSection === link.id ? "text-blue-600" : "text-gray-400"}
                        />
                        <span className="font-bold">{link.label}</span>
                      </div>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: activeSection === link.id ? 1 : 0 }}>
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                      </motion.div>
                    </div>
                  ))}
                  <div className="flex items-center gap-4 p-4 rounded-2xl text-gray-500 hover:bg-gray-50 cursor-pointer">
                    <Settings size={20} className="text-gray-400" />
                    <span className="font-bold">Settings</span>
                  </div>
                </div>
              </div>

              <div className="pt-8 mt-auto border-t border-gray-100">
                {user ? (
                  <>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-600 text-white font-bold border-2 border-blue-50">
                        {profile?.avatar_url ? (
                          <img
                            src={profile.avatar_url}
                            alt="Profile"
                            className="w-full h-full rounded-2xl object-cover"
                          />
                        ) : (
                          <span>{profile?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">
                          {profile?.full_name || user.email?.split("@")[0] || t("traveler")}
                        </p>
                        <p className="text-xs text-gray-400 font-medium">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={async () => {
                        setIsMobileMenuOpen(false);
                        await signOut();
                        router.push("/");
                      }}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors"
                    >
                      <LogOut size={20} />
                      {t("logout")}
                    </button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        router.push("/login");
                      }}
                      className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl border-2 border-gray-200 text-gray-700 font-bold hover:border-blue-500 hover:text-blue-600 transition-all"
                    >
                      <LogIn size={20} />
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        router.push("/register");
                      }}
                      className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                    >
                      <UserPlus size={20} />
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
