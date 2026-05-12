import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useUnsavedImage(publicId: string | null, isDirty: boolean) {
  const router = useRouter();

  useEffect(() => {
    if (!isDirty || !publicId) return;

    // 1. Handle page refresh or tab close
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Setting returnValue triggers the browser's native confirmation dialog
      e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
    };

    const handleUnload = () => {
      // User is definitely leaving the page (or confirmed the beforeunload dialog)
      const formData = new FormData();
      formData.append('deletePublicId', publicId);
      // Use sendBeacon because fetch will be cancelled when page unloads
      navigator.sendBeacon('/api/upload', formData);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleUnload);

    // 2. Handle Next.js internal link clicks
    const handleLinkClick = async (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target || !target.href) return;

      const isInternal = target.href.startsWith(window.location.origin);
      // Ignore if it's opening in a new tab or an external link
      if (isInternal && target.target !== '_blank') {
        e.preventDefault();
        
        const confirmLeave = window.confirm(
          'You have an unsaved image upload. Are you sure you want to leave? Your uploaded image will be removed.'
        );
        
        if (confirmLeave) {
          try {
            const formData = new FormData();
            formData.append('deletePublicId', publicId);
            await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            });
          } catch (err) {
            console.error('Failed to cleanup image on leave', err);
          }
          // Proceed with navigation
          router.push(target.href.replace(window.location.origin, ''));
        }
      }
    };

    document.addEventListener('click', handleLinkClick, { capture: true });

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleUnload);
      document.removeEventListener('click', handleLinkClick, { capture: true });
    };
  }, [isDirty, publicId, router]);
}
