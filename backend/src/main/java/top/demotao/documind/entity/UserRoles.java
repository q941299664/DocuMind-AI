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
 * 用户-角色关联表
 * </p>
 *
 * @author TraeAI
 * @since 2026-02-10
 */
@Getter
@Setter
@TableName("user_roles")
@ApiModel(value = "UserRoles对象", description = "用户-角色关联表")
public class UserRoles {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty("用户ID")
    @MppMultiId // 复合主键
    private Long userId;

    @ApiModelProperty("角色ID")
    @MppMultiId // 复合主键
    private Long roleId;
}
