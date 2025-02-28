import { mount } from 'enzyme';

import ThreadCard, { $imports } from '../ThreadCard';

import { checkAccessibility } from '../../../test-util/accessibility';
import { mockImportedComponents } from '../../../test-util/mock-imported-components';

describe('ThreadCard', () => {
  let container;
  let fakeDebounce;
  let fakeFrameSync;
  let fakeStore;
  let fakeThread;

  const threadCardSelector = 'div[data-testid="thread-card"]';

  function createComponent(props) {
    return mount(
      <ThreadCard frameSync={fakeFrameSync} thread={fakeThread} {...props} />,
      { attachTo: container }
    );
  }

  beforeEach(() => {
    container = document.createElement('div');
    document.body.append(container);

    fakeDebounce = sinon.stub().returnsArg(0);
    fakeFrameSync = {
      hoverAnnotations: sinon.stub(),
      scrollToAnnotation: sinon.stub(),
    };
    fakeStore = {
      annotationFocusRequest: sinon.stub().returns(null),
      clearAnnotationFocusRequest: sinon.stub(),
      isAnnotationHovered: sinon.stub().returns(false),
      route: sinon.stub(),
    };

    fakeThread = {
      id: 't1',
      annotation: { $tag: 'myTag' },
    };

    $imports.$mock(mockImportedComponents());
    $imports.$mock({
      'lodash.debounce': fakeDebounce,
      '../store': { useSidebarStore: () => fakeStore },
    });
  });

  afterEach(() => {
    $imports.$restore();
    container.remove();
  });

  it('renders a `Thread` for the passed `thread`', () => {
    const wrapper = createComponent();
    assert(wrapper.find('Thread').props().thread === fakeThread);
  });

  it('applies a hovered CSS class if the annotation thread is hovered', () => {
    fakeStore.isAnnotationHovered.returns(true);

    const wrapper = createComponent();

    assert.isTrue(wrapper.find(threadCardSelector).hasClass('is-hovered'));
  });

  describe('mouse and click events', () => {
    it('scrolls to the annotation when the `ThreadCard` is clicked', () => {
      const wrapper = createComponent();

      wrapper.find(threadCardSelector).simulate('click');

      assert.calledWith(fakeFrameSync.scrollToAnnotation, 'myTag');
    });

    it('focuses the annotation thread when mouse enters', () => {
      const wrapper = createComponent();

      wrapper.find(threadCardSelector).simulate('mouseenter');

      assert.calledWith(fakeFrameSync.hoverAnnotations, sinon.match(['myTag']));
    });

    it('unfocuses the annotation thread when mouse exits', () => {
      const wrapper = createComponent();

      wrapper.find(threadCardSelector).simulate('mouseleave');

      assert.calledWith(fakeFrameSync.hoverAnnotations, sinon.match([]));
    });

    ['button', 'a'].forEach(tag => {
      it(`does not scroll to the annotation if the event's target or ancestor is a ${tag}`, () => {
        const wrapper = createComponent();
        const nodeTarget = document.createElement(tag);
        const nodeChild = document.createElement('div');
        nodeTarget.appendChild(nodeChild);

        wrapper.find(threadCardSelector).props().onClick({
          target: nodeTarget,
        });
        wrapper.find(threadCardSelector).props().onClick({
          target: nodeChild,
        });
        assert.notCalled(fakeFrameSync.scrollToAnnotation);
      });
    });
  });

  describe('keyboard focus request handling', () => {
    [null, 'other-annotation'].forEach(focusRequest => {
      it('does not focus thread if there is no matching focus request', () => {
        fakeStore.annotationFocusRequest.returns(focusRequest);

        createComponent();

        const threadCard = container.querySelector(threadCardSelector);

        assert.notEqual(document.activeElement, threadCard);
        assert.notCalled(fakeStore.clearAnnotationFocusRequest);
      });
    });

    it('gives focus to the thread if there is a matching focus request', () => {
      fakeStore.annotationFocusRequest.returns('t1');

      createComponent();

      const threadCard = container.querySelector(threadCardSelector);
      assert.equal(document.activeElement, threadCard);
      assert.called(fakeStore.clearAnnotationFocusRequest);
    });
  });

  it(
    'should pass a11y checks',
    checkAccessibility({
      content: () => createComponent(),
    })
  );
});
