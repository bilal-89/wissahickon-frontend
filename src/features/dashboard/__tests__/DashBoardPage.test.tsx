import DashboardPage from '../DashBoardPage';
import { render, screen } from '../../../test_utils/test-utils';

const mockAuthContext = {
    currentTenant: { name: 'Test Business', role: 'Owner' },
    isOwner: true,
    isStaff: false,
    isClient: false,
    user: { email: 'test@example.com' }
};

jest.mock('../../../contexts/AuthContext', () => ({
    useAuth: () => mockAuthContext
}));

describe('DashboardPage', () => {
    test('renders welcome message with tenant name', () => {
        render(<DashboardPage />);
        expect(screen.getByText(/Welcome to Test Business/i)).toBeInTheDocument();
    });

    test('shows owner-specific quick actions', () => {
        render(<DashboardPage />);
        expect(screen.getByText(/Manage Users/i)).toBeInTheDocument();
        expect(screen.getByText(/Business Settings/i)).toBeInTheDocument();
    });

    test('displays role in context message', () => {
        render(<DashboardPage />);
        const roleText = screen.getByText('You are viewing this business as:');
        const roleValue = screen.getByText('Owner');
        expect(roleText).toBeInTheDocument();
        expect(roleValue).toBeInTheDocument();
    });
});