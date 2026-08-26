import { roleGuard } from './role.guard';

describe('roleGuard', () => {
  it('should create a guard for the supplied roles', () => {
    expect(roleGuard(['ADMINISTRATEUR'])).toBeTruthy();
  });
});
