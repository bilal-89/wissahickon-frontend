// src/test-utils/test-utils.tsx
import { render } from '@testing-library/react';

const customRender = (ui: React.ReactElement) => {
    return render(ui);
};

export * from '@testing-library/react';
export { customRender as render };