package top.demotao.documind.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import top.demotao.documind.common.ErrorCode;
import top.demotao.documind.common.exception.BusinessException;
import top.demotao.documind.dto.LoginRequest;
import top.demotao.documind.dto.RegisterRequest;
import top.demotao.documind.entity.Roles;
import top.demotao.documind.entity.UserRoles;
import top.demotao.documind.entity.Users;
import top.demotao.documind.security.JwtTokenUtil;
import top.demotao.documind.service.AuthService;
import top.demotao.documind.service.IRolesService;
import top.demotao.documind.service.IUserRolesService;
import top.demotao.documind.service.IUsersService;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private MailService mailService;

    @Autowired
    private IUsersService usersService;

    @Autowired
    private IRolesService rolesService;

    @Autowired
    private IUserRolesService userRolesService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Override
    public void sendVerificationCode(String email) {
        mailService.sendVerificationCode(email);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void register(RegisterRequest request) {
        // 1. 校验验证码
        if (!mailService.verifyCode(request.getEmail(), request.getCode())) {
            throw new BusinessException(ErrorCode.VERIFY_CODE_ERROR);
        }

        // 2. 检查用户是否存在
        if (usersService.count(new LambdaQueryWrapper<Users>().eq(Users::getUsername, request.getUsername())) > 0) {
            throw new BusinessException(ErrorCode.USER_EXIST);
        }
        if (usersService.count(new LambdaQueryWrapper<Users>().eq(Users::getEmail, request.getEmail())) > 0) {
            throw new BusinessException(ErrorCode.EMAIL_EXIST);
        }

        // 3. 创建用户
        Users user = new Users();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        
        // 直接使用 PasswordEncoder (BCrypt) 加密
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        user.setActived(true);
        usersService.save(user);

        // 4. 分配默认角色 (user)
        Roles userRole = rolesService.getOne(new LambdaQueryWrapper<Roles>().eq(Roles::getCode, "user"));
        if (userRole != null) {
            UserRoles userRoles = new UserRoles();
            userRoles.setUserId(user.getId());
            userRoles.setRoleId(userRole.getId());
            userRolesService.save(userRoles);
        }
    }

    @Override
    public Map<String, Object> login(LoginRequest request) {
        // 1. 检查用户是否存在 (用户名或邮箱)
        Users existUser = usersService.getOne(new LambdaQueryWrapper<Users>()
                .eq(Users::getUsername, request.getUsername())
                .or()
                .eq(Users::getEmail, request.getUsername()));

        if (existUser == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
        // 检查用户是否激活
        if (!existUser.getActived()) {
            throw new BusinessException(ErrorCode.USER_NOT_ACTIVATED);
        }
        // 使用 AuthenticationManager 进行认证
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );


        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtTokenUtil.generateToken(userDetails);

        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("user", existUser);

        return data;
    }

    @Override
    public Users getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Users user = usersService.getOne(new LambdaQueryWrapper<Users>().eq(Users::getUsername, username));
        if (user != null) {
            user.setPassword(null);
        }
        return user;
    }
}
