// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: (query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    }),
});

class IntersectionObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
}

class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
}

window.IntersectionObserver = IntersectionObserverMock;
window.ResizeObserver = ResizeObserverMock;
window.scrollTo = jest.fn();
