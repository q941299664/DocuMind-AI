package top.demotao.documind.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import top.demotao.documind.common.BaseEntity;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * 角色表
 * </p>
 *
 * @author TraeAI
 * @since 2026-02-10
 */
@Getter
@Setter
@TableName("roles")
@ApiModel(value = "Roles对象", description = "角色表")
public class Roles extends BaseEntity {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty("角色ID")
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @ApiModelProperty("角色名称(如: 管理员)")
    @TableField("name")
    private String name;

    @ApiModelProperty("角色编码(如: admin)")
    @TableField("code")
    private String code;

    @ApiModelProperty("描述")
    @TableField("description")
    private String description;
}
