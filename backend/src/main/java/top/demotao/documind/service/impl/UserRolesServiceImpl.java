package top.demotao.documind.service.impl;

import top.demotao.documind.entity.UserRoles;
import top.demotao.documind.mapper.UserRolesMapper;
import top.demotao.documind.service.IUserRolesService;
import com.github.jeffreyning.mybatisplus.service.MppServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 用户-角色关联表 服务实现类
 * </p>
 *
 * @author TraeAI
 * @since 2026-02-10
 */
@Service
public class UserRolesServiceImpl extends MppServiceImpl<UserRolesMapper, UserRoles> implements IUserRolesService {

}
