import App from './App.svelte';
import { run } from './socket';

run();

const app = new App({
  target: document.body,
  props: {
    name: 'world',
  },
});

export default app;
