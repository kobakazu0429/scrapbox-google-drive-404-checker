export const progress = (total: number, index: number, msg: string) => {
  const width = 3;
  const i = String(index).padStart(width);
  const t = String(total).padStart(width);
  console.log(`[${i} / ${t}] ${msg}`);
};
