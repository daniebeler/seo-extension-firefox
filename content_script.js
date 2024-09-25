// Function to check if an element is visible

console.log('Content script is running');

function isVisible(element) {
  const style = window.getComputedStyle(element);
  
  // Check if the element or its parents are hidden
  const isNotDisplayed = style.display === 'none';
  const isVisibilityHidden = style.visibility === 'hidden';
  const isOpacityZero = parseFloat(style.opacity) === 0;
  
  // Check if the element is outside the viewport
  const rect = element.getBoundingClientRect();
  const isOffScreen = rect.width === 0 || rect.height === 0 || rect.bottom < 0 || rect.right < 0;

  return !isNotDisplayed && !isVisibilityHidden && !isOpacityZero && !isOffScreen;
}

// Count only visible H1 tags and store it on the window object
const visibleH1Tags = Array.from(document.querySelectorAll('h1')).filter(isVisible).length;

// Store the result on the window object so it can be accessed by the popup
window.visibleH1TagCount = visibleH1Tags;

console.log(`Visible H1 tags count: ${visibleH1Tags}`);