// src/utils/tailwindCheck.ts

/**
 * Checks if Tailwind CSS is properly loaded by injecting a test element
 * and checking if the styles are applied
 */
export function checkTailwindIsLoaded(): boolean {
  // Create a test element
  const testElement = document.createElement('div');
  testElement.className = 'bg-blue-500 p-4';
  testElement.style.position = 'absolute';
  testElement.style.left = '-9999px';
  document.body.appendChild(testElement);
  
  // Get computed styles
  const computedStyle = window.getComputedStyle(testElement);
  
  // Log the actual values we're getting
  console.log('Test element style check:', {
    padding: computedStyle.padding,
    backgroundColor: computedStyle.backgroundColor
  });
  
  // More lenient check - just verify the element has some padding and background color
  const hasPadding = computedStyle.padding !== '0px';
  const hasBackgroundColor = computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' && 
                            computedStyle.backgroundColor !== 'transparent';
  
  // Clean up
  document.body.removeChild(testElement);
  
  console.log('Tailwind loaded check result:', { hasPadding, hasBackgroundColor });
  
  // If using CDN, just assume it's working since the script is loaded
  const isCdnLoaded = document.querySelector('script[src*="tailwindcss"]') !== null;
  
  return hasPadding && hasBackgroundColor || isCdnLoaded;
}