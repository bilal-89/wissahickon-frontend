import { render as rtlRender } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';

function render(ui: React.ReactElement, { route = '/' } = {}) {
    return rtlRender(
        <MemoryRouter initialEntries={[route]}>
            {ui}
        </MemoryRouter>
    );
}

export * from '@testing-library/react';
export { render };