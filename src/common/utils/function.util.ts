export const createSlug = (str: string) => {
  return str.replace(/[ًٌٍَُِّ\.\+_()""'';]+/g, '')?.replace(/[\s]+/g, '-');
};
