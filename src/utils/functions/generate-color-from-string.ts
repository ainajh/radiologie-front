const generateColorFromString = (str: string) => {
  let generatedColor = "#008b8b";
  const hashCoded = hashCode(str);
  const colorHex = intToRGB(hashCoded);
  generatedColor = colorHex;

  return generatedColor + "CC";
};

// Generate a hash code from the input string
const hashCode = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

// Convert an integer to an RGB color
const intToRGB = (i: number) => {
  const c = (i & 0x00ffffff).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;
};

export default generateColorFromString;
