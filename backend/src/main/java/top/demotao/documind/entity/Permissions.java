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
 * 权限表
 * </p>
 *
 * @author TraeAI
 * @since 2026-02-10
 */
@Getter
@Setter
@TableName("permissions")
@ApiModel(value = "Permissions对象", description = "权限表")
public class Permissions extends BaseEntity {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty("权限ID")
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @ApiModelProperty("权限名称")
    @TableField("name")
    private String name;

    @ApiModelProperty("权限编码(如: user:create)")
    @TableField("code")
    private String code;

    @ApiModelProperty("资源类型")
    @TableField("resource")
    private String resource;

    @ApiModelProperty("操作类型")
    @TableField("action")
    private String action;
}
