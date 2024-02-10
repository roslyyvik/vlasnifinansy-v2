addEventListener('message', event => {
  const [a, b] = event.data;

  // Do stuff with the message
  postMessage(a + b);
});