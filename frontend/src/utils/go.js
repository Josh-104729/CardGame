const MPI = Math.PI;
const O_X = 700;
const O_Y = 630;
const PP = 180;
const Rad = 330;
const ONE = 1;

const calc_radian = (a) => {
  return (MPI * a) / PP;
};

const calc_sin = (se) => {
  return Math.sin(calc_radian(se));
};

const calc_cos = (ce) => {
  return Math.cos(calc_radian(ce));
};

const calc_floor = (fe) => {
  return Math.floor(fe);
};

const calc_alpha = (ae) => {
  return (PP * 2) / ae;
};

export const Go = (n) => {
  let points = new Array();
  points.push({
    x: O_X,
    y: O_Y,
  });
  let x_0 = points[0].x;
  let y_0 = points[0].y;

  let num = n;
  let alpha = calc_alpha(num);
  for (let i = 1; i < n; i++) {
    points.push({
      x: Math.floor(x_0 + calc_sin(alpha * i) * Rad),
      y: Math.floor(y_0 - (ONE - calc_cos(alpha * i)) * Rad),
    });
  }
  return points;
};
