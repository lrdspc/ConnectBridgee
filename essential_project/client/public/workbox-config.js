module.exports = {
  globDirectory: 'dist/public/',
  globPatterns: [
    '**/*.{js,css,html,svg}'
  ],
  swDest: 'dist/public/service-worker.js',
  swSrc: 'client/public/service-worker.js',
  // Don't precache images - they'll be cached at runtime
  globIgnores: ['**/icons/**/*'],
  // Ignore hashed files - no need to precache them again
  dontCacheBustURLsMatching: new RegExp('.+\\.[a-f0-9]{8}\\..+'),
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
};
