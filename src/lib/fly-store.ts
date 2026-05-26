type FlyListener = (from: { x: number; y: number }) => void;

let listeners: FlyListener[] = [];

export const flyToCart = {
  emit(from: { x: number; y: number }) {
    listeners.forEach((fn) => fn(from));
  },
  subscribe(fn: FlyListener) {
    listeners.push(fn);
    return () => {
      listeners = listeners.filter((l) => l !== fn);
    };
  },
};
