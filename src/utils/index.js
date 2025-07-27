export function createPageUrl(pageName) {
  // This is a simplified function. In a real app, you might have a more complex routing logic.
  switch (pageName) {
    case 'AudioDetection':
      return '/';
    case 'Results':
      return '/results';
    case 'History':
      return '/history';
    default:
      return '/';
  }
}
