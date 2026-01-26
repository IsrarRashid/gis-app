function estimateTextWidth(text: string, fontSize: number) {
  return Math.ceil(text.length * fontSize * 0.6);
}

export function calculateLeftMargin<T extends { label: string; value: number }>(
  data: T[],
  fontSize: number,
  suffix = ""
) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const label = `${maxValue.toLocaleString()}${suffix}`;

  // padding + breathing room
  return estimateTextWidth(label, fontSize) + 16;
}

export function calculateXAxisHeight(
  labels: string[],
  fontSize: number,
  lineGap = 2,
  baseOffset = 16
) {
  const maxWords = Math.max(...labels.map((l) => l.split(" ").length));

  return maxWords * (fontSize + lineGap) + baseOffset;
}

export const getGradientId = (label: string) =>
  `bar-gradient-${label.replace(/\s+/g, "-").toLowerCase()}`;
