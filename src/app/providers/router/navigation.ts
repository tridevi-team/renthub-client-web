import { browserRouter } from './router';

export const navigate = (to: string) => {
  browserRouter.navigate(to);
};
