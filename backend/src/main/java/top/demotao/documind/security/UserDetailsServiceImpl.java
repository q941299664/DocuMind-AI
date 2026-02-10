package top.demotao.documind.security;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import top.demotao.documind.entity.Roles;
import top.demotao.documind.entity.UserRoles;
import top.demotao.documind.entity.Users;
import top.demotao.documind.service.IRolesService;
import top.demotao.documind.service.IUserRolesService;
import top.demotao.documind.service.IUsersService;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private IUsersService usersService;

    @Autowired
    private IUserRolesService userRolesService;

    @Autowired
    private IRolesService rolesService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 支持用户名或邮箱登录
        Users user = usersService.getOne(new LambdaQueryWrapper<Users>()
                .eq(Users::getUsername, username)
                .or()
                .eq(Users::getEmail, username));

        if (user == null) {
            throw new UsernameNotFoundException("用户不存在: " + username);
        }

        // 获取用户角色
        List<UserRoles> userRolesList = userRolesService.list(new LambdaQueryWrapper<UserRoles>()
                .eq(UserRoles::getUserId, user.getId()));

        List<GrantedAuthority> authorities = new ArrayList<>();
        if (!userRolesList.isEmpty()) {
            List<Long> roleIds = userRolesList.stream().map(UserRoles::getRoleId).collect(Collectors.toList());
            List<Roles> roles = rolesService.listByIds(roleIds);
            for (Roles role : roles) {
                authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getCode()));
            }
        }

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                user.getActived(),
                true,
                true,
                true,
                authorities
        );
    }
}
