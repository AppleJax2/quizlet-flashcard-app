import { useRef, useEffect } from 'react';
import createFocusTrap from '@/utils/focus-trap';

/**
 * Hook that traps focus within a container element when active.
 * Essential for keyboard accessibility in modal dialogs.
 * 
 * @param active - Whether the focus trap should be active
 * @returns - Ref to attach to the container element
 * 
 * @example
 * ```tsx
 * const Modal = ({ isOpen, onClose }) => {
 *   const containerRef = useFocusTrap(isOpen);
 * 
 *   if (!isOpen) return null;
 * 
 *   return (
 *     <div className="modal-overlay">
 *       <div ref={containerRef} className="modal">
 *         <h2>Modal Title</h2>
 *         <button>Focusable Button</button>
 *         <button onClick={onClose}>Close</button>
 *       </div>
 *     </div>
 *   );
 * };
 * ```
 */
export function useFocusTrap<T extends HTMLElement = HTMLDivElement>(
  active: boolean = false
): React.RefObject<T> {
  const containerRef = useRef<T>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    
    if (!container) return;
    
    const trap = createFocusTrap(containerRef);
    
    if (active) {
      // Small delay to ensure the DOM is fully updated
      // This is important for cases where the modal is conditionally rendered
      const timeoutId = setTimeout(() => {
        trap.activate();
      }, 50);
      
      return () => {
        clearTimeout(timeoutId);
        trap.deactivate();
      };
    }
    
    return () => {
      trap.deactivate();
    };
  }, [active]);
  
  // Update trap when children change
  useEffect(() => {
    const container = containerRef.current;
    
    if (!container || !active) return;
    
    const trap = createFocusTrap(containerRef);
    const observer = new MutationObserver(() => {
      trap.update();
    });
    
    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['tabindex', 'disabled']
    });
    
    return () => {
      observer.disconnect();
    };
  }, [active]);
  
  return containerRef;
}

export default useFocusTrap; 