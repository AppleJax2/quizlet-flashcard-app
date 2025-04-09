/**
 * Focus Trap utility to improve keyboard accessibility in modal dialogs
 * Keeps focus trapped within a specified container for keyboard navigation
 */

/**
 * Get all focusable elements within a container
 */
export const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const elements = container.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  return Array.from(elements) as HTMLElement[];
};

/**
 * Focus Trap class to manage focus within a container
 */
export class FocusTrap {
  private container: HTMLElement;
  private focusableElements: HTMLElement[];
  private firstFocusableElement: HTMLElement | null;
  private lastFocusableElement: HTMLElement | null;
  private previouslyFocusedElement: HTMLElement | null;
  private handleKeyDown: (e: KeyboardEvent) => void;
  private active: boolean = false;

  constructor(container: HTMLElement) {
    this.container = container;
    this.focusableElements = getFocusableElements(container);
    this.firstFocusableElement = this.focusableElements[0] || null;
    this.lastFocusableElement = this.focusableElements[this.focusableElements.length - 1] || null;
    this.previouslyFocusedElement = document.activeElement as HTMLElement;
    
    this.handleKeyDown = this.onKeyDown.bind(this);
  }

  /**
   * Activate the focus trap
   */
  activate(): void {
    if (this.active || !this.firstFocusableElement) return;
    
    // Store previously focused element to restore later
    this.previouslyFocusedElement = document.activeElement as HTMLElement;
    
    // Add keydown event listener
    document.addEventListener('keydown', this.handleKeyDown);
    
    // Focus the first element
    this.firstFocusableElement.focus();
    
    this.active = true;
  }

  /**
   * Deactivate the focus trap
   */
  deactivate(): void {
    if (!this.active) return;
    
    // Remove event listener
    document.removeEventListener('keydown', this.handleKeyDown);
    
    // Restore focus to previously focused element
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus();
    }
    
    this.active = false;
  }

  /**
   * Update the focusable elements (useful when content changes)
   */
  updateFocusableElements(): void {
    this.focusableElements = getFocusableElements(this.container);
    this.firstFocusableElement = this.focusableElements[0] || null;
    this.lastFocusableElement = this.focusableElements[this.focusableElements.length - 1] || null;
  }

  /**
   * Handle keydown events to trap focus
   */
  private onKeyDown(e: KeyboardEvent): void {
    // If not tab key, return
    if (e.key !== 'Tab') return;
    
    // If no focusable elements, do nothing
    if (!this.firstFocusableElement || !this.lastFocusableElement) return;

    // Handle shift + tab (backwards)
    if (e.shiftKey) {
      if (document.activeElement === this.firstFocusableElement) {
        e.preventDefault();
        this.lastFocusableElement.focus();
      }
    } 
    // Handle tab (forwards)
    else {
      if (document.activeElement === this.lastFocusableElement) {
        e.preventDefault();
        this.firstFocusableElement.focus();
      }
    }
  }
}

/**
 * Hook-friendly focus trap function
 */
export const createFocusTrap = (containerRef: React.RefObject<HTMLElement>): {
  activate: () => void;
  deactivate: () => void;
  update: () => void;
} => {
  let focusTrap: FocusTrap | null = null;

  return {
    activate: () => {
      if (containerRef.current && !focusTrap) {
        focusTrap = new FocusTrap(containerRef.current);
        focusTrap.activate();
      } else if (focusTrap) {
        focusTrap.activate();
      }
    },
    deactivate: () => {
      if (focusTrap) {
        focusTrap.deactivate();
        focusTrap = null;
      }
    },
    update: () => {
      if (focusTrap) {
        focusTrap.updateFocusableElements();
      }
    }
  };
};

export default createFocusTrap; 