import type { VirtualElement } from '../../lib/react-utils';
import TeactDOM from '../../lib/react-utils/react-dom';

export default function jsxToHtml(jsx: VirtualElement) {
  const fragment = document.createElement('div');
  TeactDOM.render(jsx, fragment);

  const children = Array.from(fragment.children);
  TeactDOM.render(undefined, fragment);

  return children;
}
