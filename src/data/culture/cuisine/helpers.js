/** Small helpers shared by the cuisine data files. */

export const bi = (en, as) => ({ en, as });

export const commons = (fileName, width = 1200) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
    fileName,
  )}?width=${width}`;

export const commonsPage = (fileName) =>
  `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(fileName)}`;
