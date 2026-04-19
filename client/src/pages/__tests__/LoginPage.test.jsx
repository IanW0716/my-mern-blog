import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../LoginPage.jsx';
import { UserContext } from '../../UserContext.jsx';

// Mock global fetch
global.fetch = vi.fn();

// Mock UserContext
const mockSetUserInfo = vi.fn();

const renderWithProviders = (component) => {
  return render(
    <UserContext.Provider value={{ setUserInfo: mockSetUserInfo }}>
      <BrowserRouter>{component}</BrowserRouter>
    </UserContext.Provider>
  );
};

describe('LoginPage 单元测试', () => {
  it('应当能正常渲染登录表单', () => {
    renderWithProviders(<LoginPage />);
    
    expect(screen.getByPlaceholderText('用户名')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('密码')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /登陆/i })).toBeInTheDocument();
  });

  it('输入用户名和密码应当更新状态', () => {
    renderWithProviders(<LoginPage />);
    
    const usernameInput = screen.getByPlaceholderText('用户名');
    const passwordInput = screen.getByPlaceholderText('密码');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('password123');
  });

  it('点击登录按钮应当发起正确的 fetch 请求', async () => {
    // 模拟 fetch 成功响应
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '1', username: 'testuser' }),
    });

    renderWithProviders(<LoginPage />);
    
    fireEvent.change(screen.getByPlaceholderText('用户名'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('密码'), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /登陆/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('https://api.gzw-blog.me/login', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ username: 'testuser', password: 'password123' }),
      }));
    });

    await waitFor(() => {
      expect(mockSetUserInfo).toHaveBeenCalledWith({ id: '1', username: 'testuser' });
    });
  });

  it('登录失败应当弹出 alert', async () => {
    // 模拟 fetch 失败响应
    fetch.mockResolvedValueOnce({
      ok: false,
    });
    
    // Mock window.alert
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    renderWithProviders(<LoginPage />);
    
    fireEvent.click(screen.getByRole('button', { name: /登陆/i }));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('用户名或密码错误！');
    });

    alertMock.mockRestore();
  });
});
