import React from '../../lib/react-utils';
import TeactDOM from '../../lib/react-utils/react-dom';

function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  TeactDOM.render(element, document.getElementById('root')!);
}

setInterval(tick, 1000);
