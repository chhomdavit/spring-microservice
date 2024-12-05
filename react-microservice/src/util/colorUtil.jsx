export const colors = () => [
  "#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF", "#FFABAB",
  "#FFC3A0", "#D5AAFF", "#FF677D", "#B9FBC0", "#FFD1DC", "#FFEDCC",
  "#D4C2FC", "#C6E2FF", "#FFF5BA", "#FFC9E8", "#FFEEB8", "#B4E7E5",
  "#C4E3D7", "#F1B2B6", "#D9E4EC", "#F8BBD0", "#D0E9E9", "#E3C9D3",
  "#FAD02E", "#F28D35", "#D83367", "#BB4D72", "#6C5B7B", "#F0C9A6",
  "#8A9B0F", "#E4D1B9", "#F6A5A1", "#A3D2CA", "#E3D9FF", "#F0B8B9",
  "#E1F7D5", "#D0D6E0", "#D8D8D8", "#D4F1F4", "#D5F2F3", "#F6E2B3",
  "#D9C8D3", "#F4C7C3", "#E6B2A1", "#E5D4D0", "#D1E8E2", "#B8C8D3",
  "#C5D9C7", 
];

export const getRandomColor = () => {
  const colorList = colors();
  return colorList[Math.floor(Math.random() * colorList.length)];
};

export const startColorChangeInterval = (callback, interval = 60000) => {
  return setInterval(() => {
    const randomColor = getRandomColor();
    callback(randomColor);
  }, interval);
};