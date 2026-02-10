package top.demotao.documind.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Null;
import java.io.Serializable;
import top.demotao.documind.common.BaseEntity;
import top.demotao.documind.common.ValidationGroups;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * 用户表
 * </p>
 *
 * @author TraeAI
 * @since 2026-02-10
 */
@Getter
@Setter
@TableName("users")
@ApiModel(value = "Users对象", description = "用户表")
public class Users extends BaseEntity {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty("用户ID")
    @TableId(value = "id", type = IdType.AUTO)
    @Null(message = "新增时ID必须为空", groups = ValidationGroups.Insert.class)
    @NotBlank(message = "修改时ID不能为空", groups = ValidationGroups.Update.class)
    private Long id;

    @ApiModelProperty("用户名")
    @TableField("username")
    @NotBlank(message = "用户名不能为空", groups = {ValidationGroups.Insert.class, ValidationGroups.Update.class})
    private String username;

    @ApiModelProperty("邮箱")
    @TableField("email")
    @NotBlank(message = "邮箱不能为空", groups = {ValidationGroups.Insert.class, ValidationGroups.Update.class})
    @Email(message = "邮箱格式不正确", groups = {ValidationGroups.Insert.class, ValidationGroups.Update.class})
    private String email;

    @ApiModelProperty("加密密码")
    @TableField("password")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY) // 仅序列化时忽略（输出时不显示密码），反序列化时允许（输入时接收密码）
    @NotBlank(message = "密码不能为空", groups = ValidationGroups.Insert.class)
    private String password;

    @ApiModelProperty("是否激活")
    @TableField("actived")
    private Boolean actived;
}
