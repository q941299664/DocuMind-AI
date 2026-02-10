package top.demotao.documind.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import top.demotao.documind.common.Result;
import top.demotao.documind.dto.LoginRequest;
import top.demotao.documind.dto.RegisterRequest;
import top.demotao.documind.entity.Users;
import top.demotao.documind.service.AuthService;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin // 允许跨域
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/send-code")
    public Result<String> sendCode(@RequestParam String email) {
        authService.sendVerificationCode(email);
        return Result.success("验证码已发送");
    }

    @PostMapping("/register")
    public Result<String> register(@RequestBody @Validated RegisterRequest request) {
        authService.register(request);
        return Result.success("注册成功");
    }

    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody @Validated LoginRequest request) {
        Map<String, Object> data = authService.login(request);
        return Result.success(data);
    }
    
    @GetMapping("/me")
    public Result<Users> me() {
        return Result.success(authService.getCurrentUser());
    }
}
