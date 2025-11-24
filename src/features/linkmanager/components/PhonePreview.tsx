import React from "react";
import Image from "next/image";
import { BioPageConfig } from "@/types";

interface PhonePreviewProps {
  config: BioPageConfig;
}

export const PhonePreview: React.FC<PhonePreviewProps> = ({ config }) => {
  const themeClasses = {
    light: "bg-slate-50 text-slate-900",
    dark: "bg-slate-900 text-white",
    colorful: "bg-gradient-to-br from-indigo-500 to-purple-600 text-white",
  };

  const themeClass = themeClasses[config.theme] || themeClasses.light;

  return (
    <div className="w-full lg:w-[380px] shrink-0 flex justify-center items-start pt-8">
      <div className="w-[320px] h-[650px] bg-slate-900 rounded-[40px] border-8 border-slate-800 shadow-2xl overflow-hidden relative">
        {/* Phone Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-slate-800 rounded-b-xl z-20"></div>

        {/* Bio Page Content */}
        <div
          className={`w-full h-full overflow-y-auto ${themeClass} pt-12 pb-8 px-6`}
        >
          <div className="flex flex-col items-center text-center mb-8">
            <Image
              src={config.avatar}
              alt="Avatar"
              width={64}
              height={64}
              className="rounded-full border-2 border-white dark:border-slate-800 mb-2 object-cover"
              unoptimized
            />
            <h2 className="font-bold text-xl mb-1">{config.displayName}</h2>
            <p className="text-sm opacity-90">{config.username}</p>
            <p className="text-sm mt-3 opacity-80 leading-relaxed">
              {config.bio}
            </p>
          </div>

          {config.enableLeadCapture && (
            <div className="mb-6">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <p className="text-sm font-bold mb-3 text-center">
                  {config.leadCaptureText}
                </p>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full mb-2 px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-sm placeholder:text-white/60 outline-none"
                  disabled
                />
                <button
                  className="w-full py-2 bg-white text-indigo-600 rounded-lg text-sm font-bold"
                  disabled
                >
                  Subscribe
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {config.links
              .filter((l) => l.active)
              .map((link) => (
                <div
                  key={link.id}
                  className="w-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-center font-bold text-sm hover:bg-white/20 transition-colors cursor-pointer"
                >
                  {link.title}
                </div>
              ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-[10px] opacity-50 font-bold uppercase tracking-widest">
              Powered by SocialFlow
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
