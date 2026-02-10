package top.demotao.documind.common;

import lombok.Getter;

/**
 * 统一错误码枚举
 * <p>
 * 错误码区间划分：
 * 10000 ~ 19999 : 通用/系统错误
 * 20000 ~ 29999 : 用户/认证相关错误
 * 30000 ~ 39999 : 业务逻辑错误
 * 40000 ~ 49999 : 第三方服务错误 (如 AI 引擎)
 * </p>
 */
@Getter
public enum ErrorCode {

    // === 通用错误 (10000-19999) ===
    SUCCESS(200, "操作成功"),
    SYSTEM_ERROR(10001, "系统繁忙，请稍后重试"),
    PARAM_ERROR(10002, "参数错误"),

    // === 用户/认证错误 (20000-29999) ===
    USER_NOT_FOUND(20001, "账号不存在，是否前往注册？"), // 特殊状态码供前端识别
    USER_EXIST(20002, "用户名已存在"),
    EMAIL_EXIST(20003, "邮箱已注册"),
    VERIFY_CODE_ERROR(20004, "验证码错误或已过期"),
    LOGIN_FAIL(20005, "用户名或密码错误"),
    UNAUTHORIZED(20006, "未登录或Token已失效"),
    FORBIDDEN(20007, "无权访问"),
    USER_NOT_ACTIVATED(20008, "用户已被禁用"),

    // === 业务错误 (30000-39999) ===
    // TODO: 添加业务相关错误码

    // === 第三方服务错误 (40000-49999) ===
    AI_SERVICE_ERROR(40001, "AI 服务调用失败"),
    ;


    private final int code;
    private final String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }
}
