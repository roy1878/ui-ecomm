import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AuthService);
  });

  it('should register a new user and allow login', () => {
    const registerResult = service.register('Jane Doe', 'jane', 'secret123');

    expect(registerResult.success).toBeTrue();
    expect(service.isLoggedIn()).toBeTrue();

    const loginResult = service.login('jane', 'secret123');
    expect(loginResult.success).toBeTrue();
    expect(loginResult.user?.name).toBe('Jane Doe');
  });

  it('should reject a login when credentials are wrong', () => {
    service.register('Jane Doe', 'jane', 'secret123');

    const loginResult = service.login('jane', 'wrong-password');
    expect(loginResult.success).toBeFalse();
  });
});
