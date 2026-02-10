package top.demotao.documind.service.impl;

import top.demotao.documind.entity.RolePermissions;
import top.demotao.documind.mapper.RolePermissionsMapper;
import top.demotao.documind.service.IRolePermissionsService;
import com.github.jeffreyning.mybatisplus.service.MppServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 角色-权限关联表 服务实现类
 * </p>
 *
 * @author TraeAI
 * @since 2026-02-10
 */
@Service
public class RolePermissionsServiceImpl extends MppServiceImpl<RolePermissionsMapper, RolePermissions> implements IRolePermissionsService {

}
