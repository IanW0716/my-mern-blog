import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// 每次测试后清理 DOM
afterEach(() => {
  cleanup();
});
