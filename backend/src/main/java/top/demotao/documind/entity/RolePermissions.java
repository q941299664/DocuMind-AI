package top.demotao.documind.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.github.jeffreyning.mybatisplus.anno.MppMultiId;
import java.io.Serializable;
import top.demotao.documind.common.BaseEntity;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * 角色-权限关联表
 * </p>
 *
 * @author TraeAI
 * @since 2026-02-10
 */
@Getter
@Setter
@TableName("role_permissions")
@ApiModel(value = "RolePermissions对象", description = "角色-权限关联表")
public class RolePermissions {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty("角色ID")
    @MppMultiId // 复合主键
    private Long roleId;

    @ApiModelProperty("权限ID")
    @MppMultiId // 复合主键
    private Long permissionId;
}
