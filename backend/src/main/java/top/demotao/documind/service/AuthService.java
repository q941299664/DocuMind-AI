package top.demotao.documind.service;

import top.demotao.documind.dto.LoginRequest;
import top.demotao.documind.dto.RegisterRequest;
import top.demotao.documind.entity.Users;
import java.util.Map;

public interface AuthService {
    void sendVerificationCode(String email);
    
    void register(RegisterRequest request);
    
    Map<String, Object> login(LoginRequest request);
    
    Users getCurrentUser();
}
