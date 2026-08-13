import React, { useEffect, useState } from 'react';
import { MessageSquare, AlertCircle } from 'lucide-react';

export const DisqusComments: React.FC = () => {
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    // Configure disqus_config on window
    (window as any).disqus_config = function (this: any) {
      this.page.url = window.location.href;
      this.page.identifier = 'terminalpro-main-forum';
    };

    // Inject disqus_thread embed script
    const existingEmbed = document.getElementById('disqus-embed-script');
    if (!existingEmbed) {
      const d = document;
      const s = d.createElement('script');
      s.id = 'disqus-embed-script';
      s.src = 'https://aps-smu.disqus.com/embed.js';
      s.setAttribute('data-timestamp', (+new Date()).toString());
      s.async = true;
      s.onerror = () => {
        console.warn('Disqus embed script failed to load or was blocked.');
        setLoadError(true);
      };
      (d.head || d.body).appendChild(s);
    } else if ((window as any).DISQUS) {
      try {
        (window as any).DISQUS.reset({
          reload: true,
          config: (window as any).disqus_config
        });
      } catch (err) {
        console.warn('Failed to reset Disqus instance:', err);
      }
    }

    // Inject count script with explicit https protocol
    const existingCountScript = document.getElementById('dsq-count-scr');
    if (!existingCountScript) {
      const countScript = document.createElement('script');
      countScript.id = 'dsq-count-scr';
      countScript.src = 'https://aps-smu.disqus.com/count.js';
      countScript.async = true;
      countScript.onerror = () => {
        console.warn('Disqus count script failed to load.');
      };
      (document.head || document.body).appendChild(countScript);
    }
  }, []);

  return (
    <section id="forum" className="max-w-[1440px] mx-auto px-6 py-8 mt-8 border-t border-[#363A45]">
      <div className="bg-[#1E222D] border border-[#363A45] rounded-xl p-6 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-[#363A45]">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-[#b6c4ff]" />
            <div>
              <h3 className="text-lg font-bold font-display text-[#dfe2f2]">
                Community Discussion Forum
              </h3>
              <p className="text-xs text-[#c3c5d8]">
                Share market insights, technical analysis, and price target predictions
              </p>
            </div>
          </div>
          <span className="text-xs text-[#b6c4ff] font-mono-data bg-[#2962ff]/20 px-3 py-1 rounded-lg border border-[#2962ff]/40">
            Disqus: aps-smu
          </span>
        </div>

        {loadError && (
          <div className="p-4 bg-[#FF5252]/10 border border-[#FF5252]/30 rounded-lg text-xs text-[#FF5252] mb-4 flex items-center gap-2 font-mono-data">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Disqus comments couldn't be loaded directly in this preview environment. You can open the app in a new tab or visit Disqus directly to participate.</span>
          </div>
        )}

        <div id="disqus_thread" className="min-h-[220px] text-[#dfe2f2]"></div>
        <noscript>
          Please enable JavaScript to view the{' '}
          <a href="https://disqus.com/?ref_noscript" className="text-[#b6c4ff] underline">
            comments powered by Disqus.
          </a>
        </noscript>
      </div>
    </section>
  );
};

